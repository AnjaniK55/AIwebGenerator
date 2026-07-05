const User = require("../models/User");

const checkSubscriptionLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Bypass check for administrators
    if (user.role === "admin") {
      return next();
    }

    // Auto-downgrade if paid subscription has expired
    if (
      user.subscriptionPlan !== "free" &&
      user.subscriptionExpiry &&
      new Date(user.subscriptionExpiry) < new Date()
    ) {
      user.subscriptionPlan = "free";
      user.subscriptionStatus = "inactive";
      user.aiGenerationsLimit = 3;
      user.aiGenerationsUsed = 0;
      await user.save();
    }

    if (user.aiGenerationsUsed >= user.aiGenerationsLimit) {
      return res.status(403).json({
        success: false,
        message: `AI credits exhausted (${user.aiGenerationsUsed}/${user.aiGenerationsLimit} used). Please upgrade your subscription plan to continue generating website layouts.`,
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkSubscriptionLimit,
};
