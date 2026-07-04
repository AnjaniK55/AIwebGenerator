const bcrypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const { sendTokenResponse } = require("../utils/jwt");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Register a new user
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // 1. Basic validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all registration fields.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // 2. Prevent duplicate registrations
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // 3. Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user record
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login credentials user
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    // Fetch user and explicitly load password
    const user = await User.findOne({ email });
    if (!user || user.provider !== "credentials") {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Authentication failed.",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked by the administrator. Access Denied.",
      });
    }

    // Secure password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Authentication failed.",
      });
    }

    // Record login time
    user.lastLogin = Date.now();
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user & clear cookie
// @route   POST /api/v1/auth/logout
// @access  Private
const logoutUser = (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5000), // Clear immediately
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "User logged out successfully.",
  });
};

// @desc    Get current user profile
// @route   GET /api/v1/auth/me
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth token exchange login
// @route   POST /api/v1/auth/google-login
// @access  Public
const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Google verification ID token is required.",
      });
    }

    let email, name, image;

    // Support mock verification for dev environment local testing
    if (process.env.NODE_ENV !== "production" && idToken === "mock_google_token") {
      email = "google_test_user@example.com";
      name = "Google Test User";
      image = "https://lh3.googleusercontent.com/mock-image.png";
    } else {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      email = payload.email;
      name = payload.name;
      image = payload.picture;
    }

    // Upsert User profile
    let user = await User.findOne({ email });

    if (user) {
      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your account has been blocked by the administrator. Access Denied.",
        });
      }
      user.image = image || user.image;
      user.lastLogin = Date.now();
      await user.save();
    } else {
      user = await User.create({
        name,
        email,
        image,
        provider: "google",
        isVerified: true,
        lastLogin: Date.now(),
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Google login verification failed. Token is invalid or expired.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  googleLogin,
};
