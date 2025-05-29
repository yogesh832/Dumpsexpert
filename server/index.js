const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const dbConnection = require("./config/dbConnection");
const cookieParser = require("cookie-parser");



dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
//thi is test

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
