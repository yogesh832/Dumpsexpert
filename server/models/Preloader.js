// models/Preloader.js
const mongoose = require("mongoose");

const preloaderSchema = new mongoose.Schema({
  active: { type: Boolean, default: false },
  imageUrl: String,
  imagePublicId: String,
  backgroundColor: { type: String, default: "#FFFFFF" },
});

module.exports = mongoose.model("Preloader", preloaderSchema);
