const mongoose = require("mongoose");

const WireframeHistorySchema = new mongoose.Schema(
  {
    version: {
      type: Number,
      required: true,
    },
    wireframeData: {
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

const WireframeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    blueprintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blueprint",
      required: [true, "Blueprint ID is required"],
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
    wireframeData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    history: [WireframeHistorySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wireframe", WireframeSchema);
