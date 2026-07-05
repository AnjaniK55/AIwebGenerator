const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "super_secret_fallback_key", {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);

  const isProd = process.env.NODE_ENV === "production";
  const cookieDays = parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 7;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",  // 'none' required for cross-origin (Vercel→Render)
  };

  const userObj = user.toObject();
  delete userObj.password;

  res
    .status(statusCode)
    .cookie("token", token, cookieOptions)
    .json({
      success: true,
      data: userObj,
    });
};

module.exports = {
  generateToken,
  sendTokenResponse,
};
