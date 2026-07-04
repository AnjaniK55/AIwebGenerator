const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    businessType: {
      type: String,
      required: [true, "Business type is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    websiteGoal: {
      type: String,
      required: [true, "Website goal is required"],
      trim: true,
    },
    prompt: {
      type: String,
      required: [true, "Prompt is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Draft", "Processing", "Completed", "Failed"],
      default: "Draft",
    },
    // AI Generative Outputs fields [Added in Phase 5]
    aiGeneratedData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    generatedPages: {
      type: Array,
      default: [],
    },
    generatedComponents: {
      type: Array,
      default: [],
    },
    generationStatus: {
      type: String,
      enum: ["Draft", "Processing", "Completed", "Failed"],
      default: "Draft",
    },
    aiModel: {
      type: String,
      default: "",
    },
    generatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);
