const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Blog title is required"], trim: true },
    content: { type: String, required: [true, "Blog content is required"] },
    image: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    slug: { type: String, trim: true },
  },
  { timestamps: true }
);

// Auto-generate slug from title before save
BlogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  next();
});

module.exports = mongoose.model("Blog", BlogSchema);
