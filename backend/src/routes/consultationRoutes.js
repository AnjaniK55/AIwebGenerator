const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  startConsultation,
  getConsultation,
  getMyConsultations,
  sendMessage,
  updateAnswer,
  completeConsultation,
  deleteConsultation,
  goBack,
} = require("../controllers/consultationController");

// All routes require authentication
router.use(protect);

// Start or resume consultation
router.post("/start", startConsultation);

// Get user's own consultations list
router.get("/my", getMyConsultations);

// Send a message / answer
router.post("/message", sendMessage);

// Edit a previous answer
router.put("/update", updateAnswer);

// Go back to previous step
router.post("/back", goBack);

// Get consultation by ID
router.get("/:id", getConsultation);

// Complete consultation and generate JSON
router.post("/:id/complete", completeConsultation);

// Delete consultation
router.delete("/:id", deleteConsultation);

module.exports = router;
