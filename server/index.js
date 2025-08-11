const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const passport = require("passport");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// DB connection
const dbConnection = require("./config/dbConnection");
dbConnection();

// Routes
const authRoutes = require("./routes/authRoutes");
const passportAuthRoutes = require("./routes/passportAuthRoutes");
const basicInfoRoutes = require("./routes/basicInfoRoutes");
const menuBuilderRoutes = require("./routes/menuBuilderRoutes");
const socialLinkRoutes = require("./routes/socialLinkRoutes");
const blogRoutes = require("./routes/blogRoutes");
const productRoutes = require("./routes/productRoutes");
const metaInfoRoutes = require("./routes/metaInfoRoutes");
const scriptRoutes = require("./routes/scriptRoutes");
const sitemapRoutes = require("./routes/sitemapRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const contactRoutes = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const generalFaqRoutes = require("./routes/generalFaqRoutes");
const couponRoutes = require("./routes/couponRoutes");
const orderRoutes = require("./routes/orderRoutes");
const seoRoutes = require("./routes/seoRoutes");
const imageUploadRoutes = require("./routes/imageUploadRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const productCategoryRoutes = require("./routes/productCategoryRoutes");
const blogCategoryRoutes = require("./routes/blogCategoryRoutes");
const resultRoutes = require("./routes/resultRoutes");
const examRoutes = require("./routes/examRoutes");
const questionRoutes = require("./routes/questionRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const preloaderRoutes = require("./routes/preloaderRoutes");

const Question = require("./models/QuestionSchema");

const permalinkRoutes = require('./routes/permalinkRoutes');

const seedPermalinkRoutes = require('./routes/seedPermalinks');
const reviewRoutes = require('./routes/review.routes');
require("./utils/passport");

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "http://localhost:3000",
  "https://dumpsexpert.vercel.app",
].map((origin) => origin.toLowerCase().replace(/\/$/, ""));

// CORS setup
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.toLowerCase().replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Static folder for locally stored uploads (fallback when Cloudinary credentials are missing)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // <- If using form data

app.use(passport.initialize());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", passportAuthRoutes);
app.use("/api/basic-info", basicInfoRoutes);
app.use("/api/menu-builder", menuBuilderRoutes);
app.use("/api/social-links", socialLinkRoutes); // ✅ use only once
app.use("/api/blog-categories", blogCategoryRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/products", productRoutes);
app.use("/api/meta-info", metaInfoRoutes);
app.use("/api/scripts", scriptRoutes);
app.use("/api/sitemaps", sitemapRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/general-faqs", generalFaqRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seo", seoRoutes);
app.use("/api/images", imageUploadRoutes);
app.use("/api/product-categories", productCategoryRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/maintenance-page", maintenanceRoutes);
app.use("/api/announcement", announcementRoutes);
app.use("/api/preloader", preloaderRoutes);
app.use('/api/permalinks', permalinkRoutes);
app.use("/api/seed-permalinks", seedPermalinkRoutes);
app.use('/api/reviews', reviewRoutes);



// Custom exam questions fetch
app.get("/api/exams/:examId/questions", async (req, res) => {
  try {
    const questions = await Question.find({ examId: req.params.examId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 UNCAUGHT ERROR:", err.stack || err);
  res.status(500).json({
    message: "Internal server error",
    error: err.message || err,
  });
});

// Server start
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
