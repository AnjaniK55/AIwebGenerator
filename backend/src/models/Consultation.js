const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["assistant", "user"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ConsultationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed"],
      default: "in_progress",
    },
    currentStep: {
      type: Number,
      default: 0,
      min: 0,
      max: 25,
    },
    messages: [MessageSchema],
    answers: {
      businessName:        { type: String, default: "" },
      category:            { type: String, default: "" },
      description:         { type: String, default: "" },
      targetAudience:      { type: String, default: "" },
      services:            { type: String, default: "" },
      products:            { type: String, default: "" },
      pages:               { type: String, default: "" },
      designStyle:         { type: String, default: "" },
      colorPreference:     { type: String, default: "" },
      fontPreference:      { type: String, default: "" },
      logoAvailable:       { type: String, default: "" },
      domainAvailable:     { type: String, default: "" },
      hostingRequired:     { type: String, default: "" },
      referenceWebsites:   { type: String, default: "" },
      requiredFeatures:    { type: String, default: "" },
      contactInfo:         { type: String, default: "" },
      socialLinks:         { type: String, default: "" },
      paymentGateway:      { type: String, default: "" },
      bookingSystem:       { type: String, default: "" },
      blogRequired:        { type: String, default: "" },
      multiLanguage:       { type: String, default: "" },
      seoRequired:         { type: String, default: "" },
      adminPanelRequired:  { type: String, default: "" },
      timeline:            { type: String, default: "" },
      budget:              { type: String, default: "" },
      extraNotes:          { type: String, default: "" },
    },
    generatedJSON: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Consultation", ConsultationSchema);
