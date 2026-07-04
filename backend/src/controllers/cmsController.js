const Service = require("../models/Service");
const Testimonial = require("../models/Testimonial");
const Blog = require("../models/Blog");
const Faq = require("../models/Faq");

// ==========================================
// SERVICES CRUD
// ==========================================

const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({}).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: "Service not found" });
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// TESTIMONIALS CRUD
// ==========================================

const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: testimonials.length, data: testimonials });
  } catch (error) {
    next(error);
  }
};

const createTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: "Testimonial not found" });
    res.status(200).json({ success: true, message: "Testimonial deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// BLOGS CRUD
// ==========================================

const getBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate("author", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    next(error);
  }
};

const createBlog = async (req, res, next) => {
  try {
    // Inject the authenticated author user
    const blogData = { ...req.body, author: req.user.id };
    const blog = await Blog.create(blogData);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.status(200).json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// FAQS CRUD
// ==========================================

const getFaqs = async (req, res, next) => {
  try {
    const faqs = await Faq.find({}).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: faqs.length, data: faqs });
  } catch (error) {
    next(error);
  }
};

const createFaq = async (req, res, next) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};

const updateFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });
    res.status(200).json({ success: true, data: faq });
  } catch (error) {
    next(error);
  }
};

const deleteFaq = async (req, res, next) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });
    res.status(200).json({ success: true, message: "FAQ deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Services
  getServices,
  createService,
  updateService,
  deleteService,
  // Testimonials
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  // Blogs
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  // FAQs
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
};
