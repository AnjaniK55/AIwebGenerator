const Project = require("../models/Project");
const aiService = require("../services/aiService");

// @desc    Generate website plan and layout structure using Claude API
// @route   POST /api/v1/ai/generate
// @access  Private
const generateWebsite = async (req, res, next) => {
  try {
    const { projectId, prompt } = req.body;

    if (!projectId || !prompt) {
      return res.status(400).json({
        success: false,
        message: "Project ID and prompt are required parameters.",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project record not found.",
      });
    }

    // Ownership check
    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access Denied. You do not own this project.",
      });
    }

    // Set generation status to Processing
    project.generationStatus = "Processing";
    project.status = "Processing";
    await project.save();

    try {
      const generated = await aiService.generateWebsiteStructure(
        project.projectName,
        project.businessType,
        project.description,
        project.websiteGoal,
        prompt
      );

      // Save generated results to project document
      project.aiGeneratedData = generated.data;
      project.generatedPages = generated.data.pages || [];
      project.generatedComponents = generated.data.components || [];
      project.generationStatus = "Completed";
      project.status = "Completed";
      project.aiModel = generated.model;
      project.generatedAt = Date.now();

      // Increment user's AI generations used count
      const User = require("../models/User");
      await User.findByIdAndUpdate(req.user.id, { $inc: { aiGenerationsUsed: 1 } });

      await project.save();

      res.status(200).json({
        success: true,
        data: project,
      });
    } catch (apiError) {
      // Rollback status to Failed upon exception
      project.generationStatus = "Failed";
      project.status = "Failed";
      await project.save();

      return res.status(500).json({
        success: false,
        message: apiError.message || "Failed to generate website from AI compiler.",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateWebsite,
};
