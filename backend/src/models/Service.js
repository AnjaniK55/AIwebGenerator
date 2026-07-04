const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Service title is required"], trim: true },
    description: { type: String, required: [true, "Service description is required"], trim: true },
    icon: { type: String, default: "Layers" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
