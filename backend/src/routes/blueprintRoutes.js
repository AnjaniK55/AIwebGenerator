const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  generateBlueprint,
  getUserBlueprints,
  getBlueprint,
  regenerateBlueprint,
  deleteBlueprint,
} = require("../controllers/blueprintController");

// All routes require authentication
router.use(protect);

router.post("/generate", generateBlueprint);
router.get("/user", getUserBlueprints);
router.put("/regenerate", regenerateBlueprint);
router.get("/:id", getBlueprint);
router.delete("/:id", deleteBlueprint);

module.exports = router;
