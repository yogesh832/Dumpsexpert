const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const passport = require("passport");

//routes path
const authRoutes = require("./routes/authRoutes");
const passportAuthRoutes = require("./routes/passportAuthRoutes");
const basicInfoRoutes = require("./routes/basicInfoRoutes");
const menuBuilderRoutes = require("./routes/menuBuilderRoutes");
const socialLinkRoutes = require("./routes/socialLinkRoutes");
const blogRoutes = require("./routes/blogRoutes");
const blogPostRoutes = require("./routes/blogRoutes");
const productRoutes = require("./routes/productRoutes");
const metaInfoRoutes = require("./routes/metaInfoRoutes");
const scriptRoutes = require("./routes/scriptRoutes");
const sitemapRoutes = require("./routes/sitemapRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const contactRoutes = require("./routes/contactRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const faqRoutes = require("./routes/faqRoutes");
const couponRoutes = require("./routes/couponRoutes");
const orderRoutes = require("./routes/orderRoutes");
const seoRoutes = require("./routes/seoRoutes");
const dbConnection = require("./config/dbConnection");
const imageUploadRoutes = require("./routes/imageUploadRoutes");

const productCategoryRoutes = require('./routes/productCategoryRoutes');

const Question = require('./models/QuestionSchema');

const blogCategoryRoutes = require("./routes/blogCategoryRoutes");

const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
require("./utils/passport");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4173",
  "https://dumpsexpert.vercel.app",
];



app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


// app.options('*', cors()); 
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

dbConnection();

app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

app.use("/api/auth", authRoutes);
app.use("/api/auth", passportAuthRoutes);
app.use('/api/basic-info', basicInfoRoutes);
app.use('/api/menu-builder', menuBuilderRoutes);
app.use('/api/social-links', socialLinkRoutes);
app.use('/api/blog-categories', blogRoutes);
app.use('/api/blogs', blogPostRoutes);
app.use('/api/products', productRoutes);
app.use('/api/meta-info', metaInfoRoutes);
app.use('/api/scripts', scriptRoutes);
app.use('/api/sitemaps', sitemapRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/images', imageUploadRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/blog-categories', blogCategoryRoutes);
app.use('/api/blog', blogRoutes);

app.get('/api/exams/:examId/questions', async (req, res) => {
  try {
    const questions = await Question.find({ examId: req.params.examId });
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.use('/api/product-categories', productCategoryRoutes); // <-- new line
// ⚠️ AFTER all app.use() and app.use('/api/...')
app.use((err, req, res, next) => {
  console.error('🔥 UNCAUGHT ERROR:', err.stack || err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message || err,
  });
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
