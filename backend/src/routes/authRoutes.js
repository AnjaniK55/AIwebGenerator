const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  googleLogin,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Authentication entrypoints
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/google-login", googleLogin);

// Protected routes
router.get("/me", protect, getProfile);

module.exports = router;
