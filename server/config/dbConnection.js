const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

// DB connection
const dbConnection = async () => {
  try {
    const uri = process.env.MONGO_DB_URI;
    await mongoose.connect(uri);
    console.log("✅ MongoDB is connected");


    // const collection = mongoose.connection.collection("results");
    // await collection.dropIndex("studentId_1_examCode_1");
    // console.log("✅ Dropped unique index on studentId and examCode");
 
  


  

  } catch (error) {
    // Catch specific index error gracefully
    if (error.codeName === "IndexNotFound") {
      console.log("⚠️ Index 'questionCode_1' not found (already removed)");
    } else {
      console.error("❌ Error during DB connection or index drop:", error);
    }
  }
};

module.exports = dbConnection;
