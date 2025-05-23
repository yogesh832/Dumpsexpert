const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// DB connection
const dbConnection = async () => {
  try {
    const uri = process.env.MONGO_DB_URI;
    await mongoose.connect(uri);
    console.log("MongoDB is connected");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};

module.exports = dbConnection;
