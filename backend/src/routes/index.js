const express = require("express");
const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Express backend API is running smoothly",
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Mock/stub route endpoints for testing the frontend hooks
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
