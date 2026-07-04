const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Read from cookies first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  // Fallback to Bearer authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No authorization token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_fallback_key");
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Access denied. User profile not found.",
      });
    }

    if (req.user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked by the administrator. Access Denied.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Invalid or expired token.",
    });
  }
};

module.exports = { protect };
