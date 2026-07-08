const mongoose = require("mongoose");

const BlueprintHistorySchema = new mongoose.Schema(
  {
    version: {
      type: Number,
      required: true,
    },
    blueprintData: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const BlueprintSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    consultationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultation",
      required: [true, "Consultation ID is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    version: {
      type: Number,
      default: 1,
    },
    blueprintData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    history: [BlueprintHistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blueprint", BlueprintSchema);
