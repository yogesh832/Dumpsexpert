const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  active: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imagePublicId: {
    type: String,
    required: true,
  },
  delay: {
    type: Number,
    default: 2.0,
  },
}, { timestamps: true });

module.exports = mongoose.model("AnnouncementSetting", announcementSchema);
