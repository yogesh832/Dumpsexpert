const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  socialIcon: {
    type: String,
    required: true,
    trim: true, // Stores Cloudinary URL of the icon image
    validate: {
      validator: (v) => /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/.test(v),
      message: 'Invalid image URL'
    }
  },
  socialURL: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => /^https?:\/\/.+/.test(v),
      message: 'Invalid URL format'
    }
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SocialLink', socialLinkSchema);