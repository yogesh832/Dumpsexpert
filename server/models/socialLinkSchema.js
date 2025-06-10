const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  socialIcon: {
    type: String,
    required: true,
    trim: true // Stores Cloudinary URL of the icon image
  },
  socialURL: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SocialLink', socialLinkSchema);