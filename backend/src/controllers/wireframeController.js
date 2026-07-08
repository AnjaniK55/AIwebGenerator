const Wireframe = require("../models/Wireframe");
const Blueprint = require("../models/Blueprint");
const aiService = require("../services/aiService");

// ============================================================
// @desc    Generate a new wireframe from blueprint
// @route   POST /api/v1/wireframe/generate
// @access  Private
// ============================================================
const generateWireframe = async (req, res, next) => {
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

    // Ownership check
    if (blueprint.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access Denied. You do not own this blueprint.",
      });
    }

    // Check if wireframe already exists for this blueprint
    const existing = await Wireframe.findOne({ blueprintId });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Wireframe already exists. Use regenerate endpoint to create a new version.",
        data: existing,
      });
    }

    // Create empty pending wireframe record first
    const wireframe = await Wireframe.create({
      userId: req.user.id,
      blueprintId,
      status: "pending",
      version: 1,
    });

    try {
      const generated = await aiService.generateWebsiteWireframe(blueprint.blueprintData);

      wireframe.wireframeData = generated.data;
      wireframe.status = "completed";
      await wireframe.save();

      res.status(201).json({
        success: true,
        message: "Wireframe generated successfully.",
        data: wireframe,
      });
    } catch (aiError) {
      wireframe.status = "failed";
      await wireframe.save();

      return res.status(500).json({
        success: false,
        message: aiError.message || "Failed to generate wireframe design from AI.",
      });
    }
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get current user's wireframes
// @route   GET /api/v1/wireframe/user
// @access  Private
// ============================================================
const getUserWireframes = async (req, res, next) => {
  try {
    const wireframes = await Wireframe.find({ userId: req.user.id })
      .populate({
        path: "blueprintId",
        populate: {
          path: "consultationId",
          select: "answers.businessName status",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: wireframes.length,
      data: wireframes,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get website wireframe by ID
// @route   GET /api/v1/wireframe/:id
// @access  Private
// ============================================================
const getWireframe = async (req, res, next) => {
  try {
    const wireframe = await Wireframe.findById(req.params.id)
      .populate({
        path: "blueprintId",
        populate: {
          path: "consultationId",
          select: "answers.businessName status",
        },
      });

    if (!wireframe) {
      return res.status(404).json({
        success: false,
        message: "Wireframe not found.",
      });
    }

    // Ownership check (admin can access all)
    if (wireframe.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied.",
      });
    }

    res.status(200).json({
      success: true,
      data: wireframe,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Regenerate website wireframe (increments version)
// @route   PUT /api/v1/wireframe/regenerate
// @access  Private
// ============================================================
const regenerateWireframe = async (req, res, next) => {
  try {
    const { wireframeId } = req.body;

    if (!wireframeId) {
      return res.status(400).json({
        success: false,
        message: "wireframeId is required.",
      });
    }

    const wireframe = await Wireframe.findById(wireframeId);
    if (!wireframe) {
      return res.status(404).json({
        success: false,
        message: "Wireframe not found.",
      });
    }

    if (wireframe.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access Denied.",
      });
    }

    const blueprint = await Blueprint.findById(wireframe.blueprintId);
    if (!blueprint) {
      return res.status(404).json({
        success: false,
        message: "Associated blueprint record not found.",
      });
    }

    // Push current version data to history
    if (wireframe.status === "completed" && wireframe.wireframeData) {
      wireframe.history.push({
        version: wireframe.version,
        wireframeData: wireframe.wireframeData,
        generatedAt: new Date(),
      });
    }

    wireframe.status = "pending";
    await wireframe.save();

    try {
      const generated = await aiService.generateWebsiteWireframe(blueprint.blueprintData);

      wireframe.wireframeData = generated.data;
      wireframe.version += 1;
      wireframe.status = "completed";
      wireframe.markModified("history");
      wireframe.markModified("wireframeData");
      await wireframe.save();

      res.status(200).json({
        success: true,
        message: "Wireframe regenerated successfully.",
        data: wireframe,
      });
    } catch (aiError) {
      wireframe.status = "failed";
      wireframe.markModified("history");
      wireframe.markModified("wireframeData");
      await wireframe.save();

      return res.status(500).json({
        success: false,
        message: aiError.message || "Failed to regenerate wireframe.",
      });
    }
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Delete wireframe
// @route   DELETE /api/v1/wireframe/:id
// @access  Private
// ============================================================
const deleteWireframe = async (req, res, next) => {
  try {
    const wireframe = await Wireframe.findById(req.params.id);

    if (!wireframe) {
      return res.status(404).json({
        success: false,
        message: "Wireframe not found.",
      });
    }

    // Ownership check (admin can delete all)
    if (wireframe.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access Denied.",
      });
    }

    await Wireframe.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Wireframe deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN ONLY
// ============================================================

// @desc    Get all wireframes (admin)
// @route   GET /api/v1/admin/wireframes
// @access  Private (Admin Only)
const getAllWireframes = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    // Populate blueprint consultation details for search matching
    let wireframes = await Wireframe.find(query)
      .populate({
        path: "blueprintId",
        populate: {
          path: "consultationId",
          select: "answers.businessName status",
        },
      })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    // Client-side text search over nested fields (businessName / email / name)
    if (search) {
      const regex = new RegExp(search, "i");
      wireframes = wireframes.filter((wf) => {
        const businessName = wf.blueprintId?.consultationId?.answers?.businessName || "";
        const email = wf.userId?.email || "";
        const name = wf.userId?.name || "";
        const designStyle = wf.wireframeData?.designStyle || "";
        return regex.test(businessName) || regex.test(email) || regex.test(name) || regex.test(designStyle);
      });
    }

    // Calculate distributions & statistics
    const totalCount = wireframes.length;
    const completedCount = wireframes.filter((w) => w.status === "completed").length;

    const styleDistribution = {};
    const layoutDistribution = {};

    wireframes.forEach((wf) => {
      if (wf.status === "completed" && wf.wireframeData) {
        const style = wf.wireframeData.designStyle || "Unknown";
        styleDistribution[style] = (styleDistribution[style] || 0) + 1;

        const pages = wf.wireframeData.pages || [];
        pages.forEach((p) => {
          const layoutStyle = p.layout?.style || "Unknown";
          layoutDistribution[layoutStyle] = (layoutDistribution[layoutStyle] || 0) + 1;
        });
      }
    });

    res.status(200).json({
      success: true,
      count: totalCount,
      stats: {
        total: totalCount,
        completed: completedCount,
        styles: styleDistribution,
        layouts: layoutDistribution,
      },
      data: wireframes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateWireframe,
  getUserWireframes,
  getWireframe,
  regenerateWireframe,
  deleteWireframe,
  getAllWireframes,
};
