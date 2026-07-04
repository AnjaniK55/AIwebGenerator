const express = require("express");
const router = express.Router();
const {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");

// Project CRUD paths
router
  .route("/")
  .post(protect, createProject)
  .get(protect, getProjects);

router
  .route("/:id")
  .get(protect, getSingleProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

module.exports = router;
