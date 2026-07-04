const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const createOrUpgradeAdmin = async () => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/manju_web_agency";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@manju.dev";
  const adminPassword = process.env.ADMIN_PASSWORD || "AdminPass123";

  console.log("Connecting to Database:", mongoUri);
  
  try {
    await mongoose.connect(mongoUri);
    console.log("✓ MongoDB Connected");

    const User = require("./src/models/User");

    // Check if user already exists
    let user = await User.findOne({ email: adminEmail });

    if (user) {
      console.log(`User ${adminEmail} already exists. Upgrading to admin role...`);
      user.role = "admin";
      await user.save();
      console.log("✓ User upgraded successfully to admin.");
    } else {
      console.log(`Creating fresh admin user account for ${adminEmail}...`);
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
      console.log("✓ Admin user created successfully.");
    }

    console.log("=========================================");
    console.log("ADMIN ACCOUNT PARTICULARS:");
    console.log("=========================================");
    console.log("ID   :", user._id.toString());
    console.log("Email:", user.email);
    console.log("Role :", user.role);
    console.log("Pass :", adminPassword);
    console.log("=========================================");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("✗ Failed to initialize admin account:", error);
    process.exit(1);
  }
};

createOrUpgradeAdmin();
