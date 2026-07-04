const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    role: { type: String, required: [true, "Role/Company is required"], trim: true },
    review: { type: String, required: [true, "Review text is required"], trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", TestimonialSchema);
