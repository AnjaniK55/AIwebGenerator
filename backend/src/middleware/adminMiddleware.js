// @desc    Middleware: Restrict access to admin-role users only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: "Access Denied. Admin privileges required.",
  });
};

module.exports = { adminOnly };
