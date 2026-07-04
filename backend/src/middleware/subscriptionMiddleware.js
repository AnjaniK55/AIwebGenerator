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
