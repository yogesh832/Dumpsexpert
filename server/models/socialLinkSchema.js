const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  socialIcon: {
    type: String,
    required: true,
    trim: true
  },
  socialURL: {
    type: String,
    required: true,
    trim: true
  },
  faviconUrl: {
    type: String,
    trim: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SocialLink', socialLinkSchema);
