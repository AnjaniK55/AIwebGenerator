const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

// Monitor connection events
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB connection disconnected. Retrying...");
});

mongoose.connection.on("error", (err) => {
  console.error(`MongoDB error occurred: ${err}`);
});

module.exports = connectDB;
