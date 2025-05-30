const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const dbConnection = require("./config/dbConnection");
const cookieParser = require("cookie-parser");



dotenv.config();

const PORT = process.env.PORT || 8000;
const cors = require("cors");

const allowedOrigins = [
  "http://localhost:5174",
  "https://dumpsexpert.vercel.app"
];

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

// Handle preflight
app.options("*", cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
//calling db
dbConnection();

//normal testing for api
app.get("/", (req,res)=>{
    res.json({
        message: "api is running..."
    })
});

//for auth routes
app.use("/api/auth", authRoutes);

app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
})