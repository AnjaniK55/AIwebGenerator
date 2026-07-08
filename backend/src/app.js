const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const router = require("./routes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const aiRoutes = require("./routes/aiRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const consultationRoutes = require("./routes/consultationRoutes");
const blueprintRoutes = require("./routes/blueprintRoutes");
const wireframeRoutes = require("./routes/wireframeRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ============================================================
// SECURITY — HTTP Security Headers
// ============================================================
app.use(helmet());

// ============================================================
// SECURITY — Rate Limiting
// ============================================================
// Global rate limiter: max 100 requests per 10 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please wait and try again." },
});

// Auth limiter: max 10 login/register attempts per 15 minutes per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many authentication attempts. Try again in 15 minutes." },
});

app.use("/api/v1", globalLimiter);
app.use("/api/v1/auth/login", authLimiter);
app.use("/api/v1/auth/register", authLimiter);

// ============================================================
// CORS — Allow Vercel frontend and localhost dev
// ============================================================
const allowedOrigins = [
  "http://localhost:3000",
  "https://a-iweb-generator.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ============================================================
// LOGGING
// ============================================================
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ============================================================
// BODY PARSERS
// ============================================================
// Parse cookie payloads
app.use(cookieParser());

// Webhook raw body parser MUST be mounted BEFORE express.json()
app.use("/api/v1/payment/webhook", express.raw({ type: "application/json" }));

// Parse incoming request bodies
app.use(express.json({ limit: "10kb" }));          // Prevent large payload attacks
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ============================================================
// API ROUTES
// ============================================================
app.use("/api/v1", router);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/consultation", consultationRoutes);
app.use("/api/v1/blueprint", blueprintRoutes);
app.use("/api/v1/wireframe", wireframeRoutes);

// ============================================================
// 404 HANDLER
// ============================================================
app.use((req, res, next) => {
  const error = new Error(`Resource Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================
app.use(errorHandler);

module.exports = app;
