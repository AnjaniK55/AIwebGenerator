const Consultation = require("../models/Consultation");

// ============================================================
// QUESTION FLOW — 25 questions in order
// ============================================================
const QUESTIONS = [
  { key: "businessName",       text: "👋 Welcome! I'm your AI Web Consultant from Manju Web Agency.\n\nI'll guide you through a quick consultation to understand your website needs perfectly.\n\nLet's start! **What is the name of your business or project?**" },
  { key: "category",           text: "Great! Now, **what type of business is it?**\n\nFor example: Restaurant, E-commerce Store, Portfolio, Real Estate, Fitness Studio, Tech Startup, etc." },
  { key: "description",        text: "Excellent! Could you **describe your business in 2–3 sentences?**\n\nWhat does your business do, and what makes it special?" },
  { key: "targetAudience",     text: "Perfect. **Who is your target audience?**\n\nDescribe your ideal customer — age group, location, interests, profession, etc." },
  { key: "services",           text: "Got it! **What services does your business offer?**\n\nList all the services you want highlighted on the website." },
  { key: "products",           text: "Do you **sell any products?**\n\nIf yes, please describe them. If not, just type *Skip* or *No*." },
  { key: "pages",              text: "Which **pages do you need** on your website?\n\nFor example: Home, About, Services, Portfolio, Blog, Contact, Pricing, FAQ, etc." },
  { key: "designStyle",        text: "What is your **preferred design style?**\n\nFor example: Modern & Minimal, Bold & Vibrant, Classic & Corporate, Dark Mode, Playful & Creative, Luxury, etc." },
  { key: "colorPreference",    text: "Do you have any **color preferences** for your website?\n\nFor example: Blue & White, Dark with Gold accents, Earthy tones, Brand colors, etc." },
  { key: "fontPreference",     text: "Do you have a **font or typography preference?**\n\nFor example: Modern Sans-serif, Classic Serif, Handwritten, Bold Display, etc. Or type *No preference*." },
  { key: "logoAvailable",      text: "**Do you already have a logo?**\n\nReply *Yes* if you have one ready to upload, or *No* if you need a logo designed as well." },
  { key: "domainAvailable",    text: "**Do you have a domain name?** (e.g. www.yourbusiness.com)\n\nIf yes, please share it. If not, type *No* and we can help you get one." },
  { key: "hostingRequired",    text: "**Do you need web hosting?**\n\nReply *Yes* if you need hosting, *No* if you already have a hosting plan, or *Not sure*." },
  { key: "referenceWebsites",  text: "Are there any **websites you like or want inspiration from?**\n\nPlease share URLs or describe what you like about them. You can type *None* if you don't have any." },
  { key: "requiredFeatures",   text: "What **special features** do you need on your website?\n\nFor example: Contact Form, Live Chat, Gallery, Testimonials, Newsletter, Members Area, Search, etc." },
  { key: "contactInfo",        text: "What **contact information** should be displayed on the website?\n\nFor example: phone number, email, address, WhatsApp, etc." },
  { key: "socialLinks",        text: "Please share your **social media links** to include on the website.\n\nFor example: Facebook, Instagram, LinkedIn, Twitter/X, YouTube, etc. Type *None* if not applicable." },
  { key: "paymentGateway",     text: "**Do you need a payment gateway** on your website?\n\nFor example: Razorpay, Stripe, PayPal, UPI, Credit/Debit Card, etc. Type *No* if not needed." },
  { key: "bookingSystem",      text: "**Do you need an online booking or appointment system?**\n\nFor example: appointment scheduling, table reservation, class booking, etc. Reply *Yes* or *No*." },
  { key: "blogRequired",       text: "**Do you want a Blog section** on your website?\n\nA blog helps with SEO and keeping customers updated. Reply *Yes* or *No*." },
  { key: "multiLanguage",      text: "**Do you need multi-language support?**\n\nFor example: English + Hindi, English + Arabic, etc. Reply *Yes* with languages, or *No*." },
  { key: "seoRequired",        text: "**Do you need SEO optimization?**\n\nSEO helps your website rank higher on Google. This is highly recommended. Reply *Yes* or *No*." },
  { key: "adminPanelRequired", text: "**Do you need a custom Admin Panel** to manage your website content?\n\nFor example: to update products, blog posts, team members, etc. Reply *Yes* or *No*." },
  { key: "timeline",           text: "⏳ **What is your expected timeline** for this project?\n\nFor example: 1 week, 2 weeks, 1 month, ASAP, etc." },
  { key: "budget",             text: "💰 **What is your approximate budget** for this project?\n\nThis helps us recommend the right solution for you. You can share a range like ₹10,000–₹30,000 or $500–$1000." },
];

const COMPLETION_MESSAGE = "🎉 **Thank you! Your consultation is complete.**\n\nI've collected all the information needed to build your perfect website. Our team will review your requirements and get back to you shortly.\n\nYou can view your consultation summary below. Feel free to edit any answers if needed.";

const ANSWER_KEYS = QUESTIONS.map((q) => q.key);

// ============================================================
// BUILD GENERATED JSON FROM ANSWERS
// ============================================================
const buildGeneratedJSON = (answers) => ({
  businessName:       answers.businessName || "",
  category:           answers.category || "",
  description:        answers.description || "",
  targetAudience:     answers.targetAudience || "",
  services:           answers.services || "",
  products:           answers.products || "",
  pages:              answers.pages ? answers.pages.split(",").map((p) => p.trim()) : [],
  designStyle:        answers.designStyle || "",
  colors:             answers.colorPreference || "",
  fonts:              answers.fontPreference || "",
  logo:               answers.logoAvailable?.toLowerCase().includes("yes"),
  domain:             answers.domainAvailable || "",
  hosting:            answers.hostingRequired || "",
  references:         answers.referenceWebsites || "",
  requiredFeatures:   answers.requiredFeatures || "",
  contactInfo:        answers.contactInfo || "",
  socialLinks:        answers.socialLinks || "",
  paymentGateway:     answers.paymentGateway?.toLowerCase().includes("yes"),
  booking:            answers.bookingSystem?.toLowerCase().includes("yes"),
  blog:               answers.blogRequired?.toLowerCase().includes("yes"),
  multiLanguage:      answers.multiLanguage?.toLowerCase().includes("yes"),
  seo:                answers.seoRequired?.toLowerCase().includes("yes"),
  adminPanel:         answers.adminPanelRequired?.toLowerCase().includes("yes"),
  timeline:           answers.timeline || "",
  budget:             answers.budget || "",
  notes:              answers.extraNotes || "",
});

// ============================================================
// @desc    Start a new consultation session
// @route   POST /api/v1/consultation/start
// @access  Private
// ============================================================
const startConsultation = async (req, res, next) => {
  try {
    // Check for existing in-progress consultation
    const existing = await Consultation.findOne({
      userId: req.user.id,
      status: "in_progress",
    }).sort({ createdAt: -1 });

    if (existing) {
      return res.status(200).json({
        success: true,
        message: "Resuming existing consultation.",
        data: existing,
        resumed: true,
      });
    }

    const firstQuestion = QUESTIONS[0];
    const consultation = await Consultation.create({
      userId: req.user.id,
      status: "in_progress",
      currentStep: 0,
      messages: [
        { role: "assistant", content: firstQuestion.text },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Consultation started.",
      data: consultation,
      resumed: false,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get consultation by ID
// @route   GET /api/v1/consultation/:id
// @access  Private
// ============================================================
const getConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);

    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found." });
    }

    // Ownership check (admin can see all)
    if (consultation.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Get current user's consultations
// @route   GET /api/v1/consultation/my
// @access  Private
// ============================================================
const getMyConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: consultations.length, data: consultations });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Send a message / answer in consultation
// @route   POST /api/v1/consultation/message
// @access  Private
// ============================================================
const sendMessage = async (req, res, next) => {
  try {
    const { consultationId, message } = req.body;

    if (!consultationId || !message?.trim()) {
      return res.status(400).json({ success: false, message: "consultationId and message are required." });
    }

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found." });
    }
    if (consultation.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }
    if (consultation.status === "completed") {
      return res.status(400).json({ success: false, message: "This consultation is already completed." });
    }

    const trimmedMsg = message.trim();

    // Save user message
    consultation.messages.push({ role: "user", content: trimmedMsg });

    // Save answer for current step
    const currentKey = ANSWER_KEYS[consultation.currentStep];
    if (currentKey) {
      consultation.answers[currentKey] = trimmedMsg;
    }

    // Move to next step
    consultation.currentStep += 1;

    let assistantReply = "";
    let isComplete = false;

    if (consultation.currentStep < QUESTIONS.length) {
      // Send next question
      assistantReply = QUESTIONS[consultation.currentStep].text;
    } else {
      // All questions answered — complete
      assistantReply = COMPLETION_MESSAGE;
      consultation.status = "completed";
      consultation.generatedJSON = buildGeneratedJSON(consultation.answers);
      isComplete = true;
    }

    consultation.messages.push({ role: "assistant", content: assistantReply });
    await consultation.save();

    res.status(200).json({
      success: true,
      data: consultation,
      nextQuestion: !isComplete ? QUESTIONS[consultation.currentStep - 1] : null,
      isComplete,
      assistantReply,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Update / edit a previous answer
// @route   PUT /api/v1/consultation/update
// @access  Private
// ============================================================
const updateAnswer = async (req, res, next) => {
  try {
    const { consultationId, key, value } = req.body;

    if (!consultationId || !key || value === undefined) {
      return res.status(400).json({ success: false, message: "consultationId, key, and value are required." });
    }

    if (!ANSWER_KEYS.includes(key)) {
      return res.status(400).json({ success: false, message: "Invalid answer key." });
    }

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found." });
    }
    if (consultation.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    consultation.answers[key] = value;

    // Regenerate JSON if completed
    if (consultation.status === "completed") {
      consultation.generatedJSON = buildGeneratedJSON(consultation.answers);
    }

    await consultation.save();

    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Complete consultation manually & generate JSON
// @route   POST /api/v1/consultation/:id/complete
// @access  Private
// ============================================================
const completeConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found." });
    }
    if (consultation.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    consultation.status = "completed";
    consultation.generatedJSON = buildGeneratedJSON(consultation.answers);

    if (!consultation.messages.some((m) => m.content === COMPLETION_MESSAGE)) {
      consultation.messages.push({ role: "assistant", content: COMPLETION_MESSAGE });
    }

    await consultation.save();

    res.status(200).json({ success: true, data: consultation });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Go back to previous question
// @route   POST /api/v1/consultation/back
// @access  Private
// ============================================================
const goBack = async (req, res, next) => {
  try {
    const { consultationId } = req.body;
    if (!consultationId) {
      return res.status(400).json({ success: false, message: "consultationId is required." });
    }

    const consultation = await Consultation.findById(consultationId);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found." });
    }
    if (consultation.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied." });
    }
    if (consultation.currentStep === 0) {
      return res.status(400).json({ success: false, message: "Cannot go back from the first step." });
    }

    // Revert last step answer
    const prevKey = ANSWER_KEYS[consultation.currentStep - 1];
    if (prevKey) {
      consultation.answers[prevKey] = "";
    }

    // Decrement current step
    consultation.currentStep -= 1;
    consultation.status = "in_progress";
    consultation.generatedJSON = null;

    // Pop the user response and the assistant follow-up/complete prompt
    if (consultation.messages.length >= 2) {
      consultation.messages.pop(); // Pop assistant question
      consultation.messages.pop(); // Pop user answer
    }

    await consultation.save();

    res.status(200).json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// @desc    Delete consultation
// @route   DELETE /api/v1/consultation/:id
// @access  Private (owner or admin)
// ============================================================
const deleteConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    if (!consultation) {
      return res.status(404).json({ success: false, message: "Consultation not found." });
    }
    if (consultation.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied." });
    }

    await Consultation.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Consultation deleted." });
  } catch (error) {
    next(error);
  }
};

// ============================================================
// ADMIN ONLY
// ============================================================

// @desc    Get all consultations (admin)
// @route   GET /api/v1/admin/consultations
const getAllConsultations = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let consultations = await Consultation.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      consultations = consultations.filter(
        (c) =>
          c.userId?.name?.toLowerCase().includes(q) ||
          c.userId?.email?.toLowerCase().includes(q) ||
          c.answers?.businessName?.toLowerCase().includes(q)
      );
    }

    res.status(200).json({ success: true, count: consultations.length, data: consultations });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  startConsultation,
  getConsultation,
  getMyConsultations,
  sendMessage,
  updateAnswer,
  completeConsultation,
  deleteConsultation,
  getAllConsultations,
  goBack,
  QUESTIONS,
};
