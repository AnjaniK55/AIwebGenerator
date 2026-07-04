const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "credentials";
      },
      minlength: [6, "Password must be at least 6 characters long"],
    },
    image: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "client", "admin"],
      default: "user",
    },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "pro", "agency"],
      default: "free",
    },
    subscriptionStatus: {
      type: String,
      default: "inactive",
    },
    subscriptionExpiry: {
      type: Date,
      default: null,
    },
    aiGenerationsLimit: {
      type: Number,
      default: 3,
    },
    aiGenerationsUsed: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
