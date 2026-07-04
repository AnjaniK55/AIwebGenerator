require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// Handle uncaught exceptions early
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Server is shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Establish MongoDB connection
connectDB();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

const server = app.listen(PORT, () => {
  console.log(`Express server successfully running in [${NODE_ENV}] mode on port ${PORT}`);
});

// Handle unhandled promise rejections gracefully
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! Closing server and exiting...");
  console.error(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
