const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createCheckoutSession,
  stripeWebhook,
  getSubscription,
  cancelSubscription,
} = require("../controllers/paymentController");

// Stripe webhook endpoint (MUST NOT run under protect middleware or body parser, handled at app level raw parsing)
router.post("/webhook", stripeWebhook);

// Protected routes
router.post("/create-checkout", protect, createCheckoutSession);
router.get("/subscription", protect, getSubscription);
router.post("/subscription/cancel", protect, cancelSubscription);

module.exports = router;
