const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const dbConnection = require("./config/dbConnection");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// const cors = require("cors");

const allowedOrigins = [
  'http://localhost:5173',
  'https://dumpsexpert.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


// Middlewares
app.use(express.json());
app.use(cookieParser());

// Connect DB
dbConnection();

// Test route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Auth routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
