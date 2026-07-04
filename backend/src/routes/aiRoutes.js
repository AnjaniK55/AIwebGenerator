const express = require("express");
const router = express.Router();
const { generateWebsite } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");
const { checkSubscriptionLimit } = require("../middleware/subscriptionMiddleware");

// AI generation pathway
router.post("/generate", protect, checkSubscriptionLimit, generateWebsite);

module.exports = router;
