const Project = require("../models/Project");

// @desc    Create a new project
// @route   POST /api/v1/projects
// @access  Private
const createProject = async (req, res, next) => {
  try {
    const { projectName, businessType, description, websiteGoal } = req.body;

    if (!projectName || !businessType || !description || !websiteGoal) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all project details fields.",
      });
    }

    // Auto-assemble the prompt for future AI modules
    const prompt = `Create a premium ${businessType} website named "${projectName}" focusing on the goal of ${websiteGoal}. Project Details: ${description}`;

    const project = await Project.create({
      userId: req.user.id,
      projectName,
      businessType,
      description,
      websiteGoal,
      prompt,
      status: "Draft",
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects for the logged in user
// @route   GET /api/v1/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/v1/projects/:id
// @access  Private
const getSingleProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

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

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project details
// @route   PUT /api/v1/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  try {
    const { projectName, businessType, description, websiteGoal, status } = req.body;
    let project = await Project.findById(req.params.id);

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

    // Re-assemble prompt if key properties changed
    const finalName = projectName || project.projectName;
    const finalType = businessType || project.businessType;
    const finalGoal = websiteGoal || project.websiteGoal;
    const finalDesc = description || project.description;
    const prompt = `Create a premium ${finalType} website named "${finalName}" focusing on the goal of ${finalGoal}. Project Details: ${finalDesc}`;

    project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        projectName: finalName,
        businessType: finalType,
        websiteGoal: finalGoal,
        description: finalDesc,
        prompt,
        status: status || project.status,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project record
// @route   DELETE /api/v1/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

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

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project record deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Export controller methods
module.exports = {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
};
