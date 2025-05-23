const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const dbConnection = require("./config/dbConnection");


dotenv.config();

const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());

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
