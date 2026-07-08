const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  generateWireframe,
  getUserWireframes,
  getWireframe,
  regenerateWireframe,
  deleteWireframe,
} = require("../controllers/wireframeController");

// All routes require authentication
router.use(protect);

router.post("/generate", generateWireframe);
router.get("/user", getUserWireframes);
router.put("/regenerate", regenerateWireframe);
router.get("/:id", getWireframe);
router.delete("/:id", deleteWireframe);

module.exports = router;
