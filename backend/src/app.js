const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const router = require("./routes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration (allow requests from Next.js client)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Dev logging
app.use(morgan("dev"));

// Parse cookie payloads
app.use(cookieParser());

// Webhook raw body parser MUST be mounted BEFORE express.json()
app.use("/api/v1/payment/webhook", express.raw({ type: "application/json" }));

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base API routes
app.use("/api/v1", router);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Catch-all route handler for unhandled requests
app.use((req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error handler
app.use(errorHandler);

module.exports = app;
