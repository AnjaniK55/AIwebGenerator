const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY || "sk_test_mock_secret_key");
const User = require("../models/User");
const Subscription = require("../models/Subscription");
const Payment = require("../models/Payment");

// Map plans to pricing particulars
const PLAN_CONFIG = {
  pro: {
    name: "Pro Plan Membership",
    price: 19.00, // $19.00
    limit: 50,    // 50 AI credits
  },
  agency: {
    name: "Agency Plan Membership",
    price: 49.00, // $49.00
    limit: 200,   // 200 AI credits
  },
};

// @desc    Create a Stripe Checkout Session
// @route   POST /api/v1/payment/create-checkout
// @access  Private
const createCheckoutSession = async (req, res, next) => {
  try {
    const { plan } = req.body;

    if (!plan || !PLAN_CONFIG[plan]) {
      return res.status(400).json({
        success: false,
        message: "Invalid subscription plan selected.",
      });
    }

    const config = PLAN_CONFIG[plan];
    const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: config.name,
              description: `Upgrade to ${plan} for ${config.limit} AI compilation credits monthly.`,
            },
            unit_amount: Math.round(config.price * 100), // Stripe units in cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${clientUrl}/dashboard/subscription?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/dashboard/subscription?cancel=true`,
      metadata: {
        userId: req.user.id,
        plan,
      },
    });

    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe Webhook Listener
// @route   POST /api/v1/payment/webhook
// @access  Public
const stripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // If webhook secret is configured, construct event, otherwise read directly from raw body for testing mockups
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      console.log("⚠️ Running Stripe Webhook without webhookSecret validation.");
      event = JSON.parse(req.body.toString());
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Webhook signature verification failed.";
    return res.status(400).send(`Webhook Error: ${errMsg}`);
  }

  const session = event.data.object;

  try {
    if (event.type === "checkout.session.completed") {
      const { userId, plan } = session.metadata;
      const stripeCustomerId = session.customer;
      const stripeSubscriptionId = session.subscription;

      const user = await User.findById(userId);

      if (user) {
        // Upgrade database attributes
        user.subscriptionPlan = plan;
        user.subscriptionStatus = "active";
        
        // Default 30 days subscription duration
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        user.subscriptionExpiry = expiryDate;

        const config = PLAN_CONFIG[plan];
        user.aiGenerationsLimit = config.limit;
        user.aiGenerationsUsed = 0; // Reset usage counters

        await user.save();

        // Create subscription history log
        await Subscription.create({
          userId,
          plan,
          stripeCustomerId,
          stripeSubscriptionId,
          status: "active",
          startDate: Date.now(),
          endDate: expiryDate,
        });

        // Log payment transaction details
        await Payment.create({
          userId,
          amount: session.amount_total / 100,
          currency: session.currency || "usd",
          stripePaymentId: session.payment_intent || session.id,
          status: "completed",
        });

        console.log(`✓ Subscription upgrade processed for user ID: ${userId}`);
      }
    }

    if (event.type === "customer.subscription.updated") {
      const subId = session.id;
      const subscription = await Subscription.findOne({ stripeSubscriptionId: subId });

      if (subscription) {
        const periodEnd = new Date(session.current_period_end * 1000);
        subscription.endDate = periodEnd;
        subscription.status = session.status;
        await subscription.save();

        const user = await User.findById(subscription.userId);
        if (user) {
          user.subscriptionStatus = session.status === "active" ? "active" : "inactive";
          user.subscriptionExpiry = periodEnd;
          user.aiGenerationsUsed = 0; // Reset used count on cycle reset
          await user.save();
          console.log(`✓ Subscription renewal updated for user ID: ${user._id}`);
        }
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subId = session.id;
      const subscription = await Subscription.findOne({ stripeSubscriptionId: subId });

      if (subscription) {
        subscription.status = "canceled";
        await subscription.save();

        const user = await User.findById(subscription.userId);
        if (user) {
          user.subscriptionPlan = "free";
          user.subscriptionStatus = "inactive";
          user.aiGenerationsLimit = 3; // Reset to free limit
          user.aiGenerationsUsed = 0;
          await user.save();
          console.log(`✓ Subscription deleted processed for user ID: ${user._id}`);
        }
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Current Subscription Details
// @route   GET /api/v1/subscription
// @access  Private
const getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id, status: "active" }).sort({ createdAt: -1 });
    const user = await User.findById(req.user.id).select("aiGenerationsUsed aiGenerationsLimit subscriptionPlan subscriptionStatus subscriptionExpiry");

    res.status(200).json({
      success: true,
      data: {
        subscription,
        usage: {
          plan: user.subscriptionPlan,
          status: user.subscriptionStatus,
          expiry: user.subscriptionExpiry,
          used: user.aiGenerationsUsed,
          limit: user.aiGenerationsLimit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel Active Subscription Renewal
// @route   POST /api/v1/subscription/cancel
// @access  Private
const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user.id, status: "active" });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(404).json({
        success: false,
        message: "No active Stripe subscription found.",
      });
    }

    // Tell stripe to cancel at the end of billing duration
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    subscription.status = "canceled";
    await subscription.save();

    const user = await User.findById(req.user.id);
    if (user) {
      user.subscriptionStatus = "canceled";
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Subscription set to cancel at period end.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckoutSession,
  stripeWebhook,
  getSubscription,
  cancelSubscription,
};
