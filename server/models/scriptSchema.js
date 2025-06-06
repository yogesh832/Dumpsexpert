const mongoose = require('mongoose');

const scriptSchema = new mongoose.Schema({
  tawkToStatus: {
    type: String,
    trim: true
  },
  tawkToWidgetCode: {
    type: String,
    trim: true
  },
  messengerStatus: {
    type: String,
    trim: true
  },
  fbPageId: {
    type: String,
    trim: true
  },
  googleAnalyticsStatus: {
    type: String,
    trim: true
  },
  googleAnalyticsCode: {
    type: String,
    trim: true
  },
  googleRecaptchaStatus: {
    type: String,
    trim: true
  },
  googleRecaptchaSiteKey: {
    type: String,
    trim: true
  },
  googleRecaptchaSecretKey: {
    type: String,
    trim: true,
    select: false
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Script', scriptSchema);