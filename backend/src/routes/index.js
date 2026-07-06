const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Express backend API is running smoothly",
    timestamp: new Date(),
    uptime: process.uptime(),
    version: "1.7.0",
    environment: process.env.NODE_ENV,
  });
});

// ============================================================
// ONE-TIME ADMIN SETUP ENDPOINT (secured by SETUP_SECRET)
// This creates/upgrades admin account on production database
// ============================================================
router.post("/setup/create-admin", async (req, res) => {
  const { secret } = req.body;
  const SETUP_SECRET = process.env.SETUP_SECRET || "manju_setup_2024_secure";

  if (!secret || secret !== SETUP_SECRET) {
    return res.status(403).json({ success: false, message: "Invalid setup secret." });
  }

  try {
    const User = require("../models/User");
    const adminEmail = "admin@manju.dev";
    const adminPassword = "AdminPass123";

    let user = await User.findOne({ email: adminEmail });

    if (user) {
      user.role = "admin";
      user.isVerified = true;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Existing user upgraded to admin successfully.",
        data: { email: user.email, role: user.role, id: user._id },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    user = await User.create({
      name: "Platform Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
      provider: "credentials",
      isVerified: true,
    });

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully on production database.",
      data: { email: user.email, role: user.role, id: user._id },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Mock/stub route endpoints for frontend hooks
router.get("/users/profile", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      id: "mock-user-id-1",
      name: "Admin User",
      email: "admin@manjuweb.agency",
      role: "admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  });
});

router.get("/clients", (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      {
        id: "mock-client-id-1",
        name: "Enterprise client Inc.",
        email: "partner@enterprise.com",
        projectId: "mock-proj-id-1",
        status: "active",
        createdAt: new Date().toISOString(),
      },
    ],
  });
});

module.exports = router;
