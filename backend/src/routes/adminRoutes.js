const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
  getUsers,
  updateUserRole,
  deleteUser,
  getAllProjects,
  getAllClients,
  getAnalytics,
  blockUser,
  unblockUser,
} = require("../controllers/adminController");

const {
  getServices,
  createService,
  updateService,
  deleteService,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
} = require("../controllers/cmsController");

// Restrict all routes below to authenticated admins only
router.use(protect);
router.use(adminOnly);

// ==========================================
// ADMIN GENERAL MANAGEMENTS
// ==========================================
router.get("/users", getUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/block", blockUser);
router.put("/users/:id/unblock", unblockUser);
router.delete("/users/:id", deleteUser);

router.get("/projects", getAllProjects);
router.get("/clients", getAllClients);
router.get("/analytics", getAnalytics);

// ==========================================
// CMS - SERVICES
// ==========================================
router.route("/cms/services")
  .get(getServices)
  .post(createService);

router.route("/cms/services/:id")
  .put(updateService)
  .delete(deleteService);

// ==========================================
// CMS - TESTIMONIALS
// ==========================================
router.route("/cms/testimonials")
  .get(getTestimonials)
  .post(createTestimonial);

router.route("/cms/testimonials/:id")
  .put(updateTestimonial)
  .delete(deleteTestimonial);

// ==========================================
// CMS - BLOGS
// ==========================================
router.route("/cms/blogs")
  .get(getBlogs)
  .post(createBlog);

router.route("/cms/blogs/:id")
  .put(updateBlog)
  .delete(deleteBlog);

// ==========================================
// CMS - FAQS
// ==========================================
router.route("/cms/faqs")
  .get(getFaqs)
  .post(createFaq);

router.route("/cms/faqs/:id")
  .put(updateFaq)
  .delete(deleteFaq);

module.exports = router;
