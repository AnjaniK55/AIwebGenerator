const User = require("../models/User");
const Project = require("../models/Project");
const Client = require("../models/Client");

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/v1/admin/users/:id/role
// @access  Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!["user", "admin", "client"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role specified." });
    }
    // Prevent self-demotion
    if (req.params.id === req.user.id && role !== "admin") {
      return res.status(400).json({ success: false, message: "You cannot change your own admin role." });
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/v1/admin/users/:id
// @access  Admin
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own account." });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    // Remove all associated projects
    await Project.deleteMany({ userId: req.params.id });
    res.status(200).json({ success: true, message: "User and associated data deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects (admin view)
// @route   GET /api/v1/admin/projects
// @access  Admin
const getAllProjects = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) filter.projectName = { $regex: search, $options: "i" };

    const projects = await Project.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all clients (admin view)
// @route   GET /api/v1/admin/clients
// @access  Admin
const getAllClients = async (req, res, next) => {
  try {
    const clients = await Client.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: clients.length, data: clients });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform analytics
// @route   GET /api/v1/admin/analytics
// @access  Admin
const getAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalProjects, totalClients, completedProjects, aiGenerations] =
      await Promise.all([
        User.countDocuments(),
        Project.countDocuments(),
        Client.countDocuments(),
        Project.countDocuments({ status: "Completed" }),
        Project.countDocuments({ generationStatus: "Completed" }),
      ]);

    // Monthly user registrations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Monthly project creations (last 6 months)
    const projectGrowth = await Project.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    // Recent users (last 5)
    const recentUsers = await User.find({}).select("-password").sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      data: {
        stats: { totalUsers, totalProjects, totalClients, completedProjects, aiGenerations },
        userGrowth,
        projectGrowth,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Block a user
// @route   PUT /api/v1/admin/users/:id/block
// @access  Admin
const blockUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot block your own administrative account." });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User profile not found." });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Unblock a user
// @route   PUT /api/v1/admin/users/:id/unblock
// @access  Admin
const unblockUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User profile not found." });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, updateUserRole, deleteUser, getAllProjects, getAllClients, getAnalytics, blockUser, unblockUser };
