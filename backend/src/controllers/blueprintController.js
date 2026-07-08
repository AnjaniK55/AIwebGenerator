const Blueprint = require("../models/Blueprint");
const Consultation = require("../models/Consultation");
const aiService = require("../services/aiService");

// ============================================================
// @desc    Generate a new website blueprint from consultation
// @route   POST /api/v1/blueprint/generate
// @access  Private
// ============================================================
const generateBlueprint = async (req, res, next) => {
  try {
    const { consultationId } = req.body;

    if (!consultationId) {
      return res.status(400).json({
        success: false,
        message: "consultationId is a required parameter.",
      });
    }

    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Consultation record not found.",
      });
    }

    // Ownership check
    if (consultation.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access Denied. You do not own this consultation.",
      });
    }

    // Check if blueprint already exists for this consultation
    const existing = await Blueprint.findOne({ consultationId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Blueprint already exists. Use regenerate endpoint to create a new version.",
        data: existing,
      });
    }

    // Create empty pending blueprint first
    const blueprint = await Blueprint.create({
      userId: req.user.id,
      consultationId,
      status: "pending",
      version: 1,
    });

    try {
      const generated = await aiService.generateWebsiteBlueprint(consultation.answers);

      blueprint.blueprintData = generated.data;
      blueprint.status = "completed";
      await blueprint.save();

      res.status(201).json({
        success: true,
        message: "Website blueprint generated successfully.",
        data: blueprint,
      });
    } catch (aiError) {
      blueprint.status = "failed";
      await blueprint.save();

      return res.status(500).json({
        success: false,
        message: aiError.message || "Failed to generate website blueprint from AI.",
      });
    }
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get current user's blueprints
// @route   GET /api/v1/blueprint/user
// @access  Private
// ============================================================
const getUserBlueprints = async (req, res, next) => {
  try {
    const blueprints = await Blueprint.find({ userId: req.user.id })
      .populate("consultationId", "answers.businessName status")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blueprints.length,
      data: blueprints,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get website blueprint by ID
// @route   GET /api/v1/blueprint/:id
// @access  Private
// ============================================================
const getBlueprint = async (req, res, next) => {
  try {
    const blueprint = await Blueprint.findById(req.params.id)
      .populate("consultationId", "answers.businessName status");

    if (!blueprint) {
      return res.status(404).json({
        success: false,
        message: "Blueprint not found.",
      });
    }

    // Ownership check (admin can access all)
    if (blueprint.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied.",
      });
    }

    res.status(200).json({
      success: true,
      data: blueprint,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Regenerate website blueprint (increments version)
// @route   PUT /api/v1/blueprint/regenerate
// @access  Private
// ============================================================
const regenerateBlueprint = async (req, res, next) => {
  try {
    const { blueprintId } = req.body;

    if (!blueprintId) {
      return res.status(400).json({
        success: false,
        message: "blueprintId is required.",
      });
    }

    const blueprint = await Blueprint.findById(blueprintId);
    if (!blueprint) {
      return res.status(404).json({
        success: false,
        message: "Blueprint not found.",
      });
    }

    if (blueprint.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access Denied.",
      });
    }

    const consultation = await Consultation.findById(blueprint.consultationId);
    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: "Associated consultation record not found.",
      });
    }

    // Push current version data to history
    if (blueprint.status === "completed" && blueprint.blueprintData) {
      blueprint.history.push({
        version: blueprint.version,
        blueprintData: blueprint.blueprintData,
        generatedAt: new Date(),
      });
    }

    blueprint.status = "pending";
    await blueprint.save();

    try {
      const generated = await aiService.generateWebsiteBlueprint(consultation.answers);

      blueprint.blueprintData = generated.data;
      blueprint.version += 1;
      blueprint.status = "completed";
      blueprint.markModified("history");
      blueprint.markModified("blueprintData");
      await blueprint.save();

      res.status(200).json({
        success: true,
        message: "Blueprint regenerated successfully.",
        data: blueprint,
      });
    } catch (aiError) {
      blueprint.status = "failed";
      blueprint.markModified("history");
      blueprint.markModified("blueprintData");
      await blueprint.save();

      return res.status(500).json({
        success: false,
        message: aiError.message || "Failed to regenerate blueprint.",
      });
    }
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Delete blueprint
// @route   DELETE /api/v1/blueprint/:id
// @access  Private
// ============================================================
const deleteBlueprint = async (req, res, next) => {
  try {
    const blueprint = await Blueprint.findById(req.params.id);

    if (!blueprint) {
      return res.status(404).json({
        success: false,
        message: "Blueprint not found.",
      });
    }

    // Ownership check (admin can delete all)
    if (blueprint.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied.",
      });
    }

    await Blueprint.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blueprint deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN ONLY
// ============================================================

// @desc    Get all blueprints
// @route   GET /api/v1/admin/blueprints
const getAllBlueprints = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let blueprints = await Blueprint.find(filter)
      .populate("userId", "name email")
      .populate("consultationId", "answers.businessName")
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      blueprints = blueprints.filter(
        (b) =>
          b.userId?.name?.toLowerCase().includes(q) ||
          b.userId?.email?.toLowerCase().includes(q) ||
          b.blueprintData?.websiteType?.toLowerCase().includes(q) ||
          b.blueprintData?.websiteGoal?.toLowerCase().includes(q)
      );
    }

    // Generate statistics for admin
    const totalCount = blueprints.length;
    const completedCount = blueprints.filter((b) => b.status === "completed").length;
    const typeDistribution = {};
    const goalDistribution = {};

    blueprints.forEach((b) => {
      if (b.status === "completed" && b.blueprintData) {
        const type = b.blueprintData.websiteType || "Other";
        const goal = b.blueprintData.websiteGoal || "Other";
        typeDistribution[type] = (typeDistribution[type] || 0) + 1;
        goalDistribution[goal] = (goalDistribution[goal] || 0) + 1;
      }
    });

    res.status(200).json({
      success: true,
      count: totalCount,
      stats: {
        total: totalCount,
        completed: completedCount,
        types: typeDistribution,
        goals: goalDistribution,
      },
      data: blueprints,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateBlueprint,
  getUserBlueprints,
  getBlueprint,
  regenerateBlueprint,
  deleteBlueprint,
  getAllBlueprints,
};
