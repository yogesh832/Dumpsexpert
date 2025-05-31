// index.js (or server.js)

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes"); 
const dbConnection = require("./config/dbConnection"); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://dumpsexpert.vercel.app"
];

// CORS middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ''))) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Handle preflight requests
app.options("*", cors({
  origin: true,
  credentials: true
}));

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Connect to database
dbConnection();

// Basic root route to test API
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});


app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
