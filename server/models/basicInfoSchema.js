const mongoose = require('mongoose');

const basicInfoSchema = new mongoose.Schema({
  siteTitle: {
    type: String,
    required: true,
    trim: true
  },
  currencyDirection: {
    type: String,
    required: true,
    trim: true
  },
  faviconUrl: {
    type: String,
    trim: true
  },
  headerLogoUrl: {
    type: String,
    trim: true
  },
  breadcrumbImageUrl: {
    type: String,
    trim: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('BasicInfo', basicInfoSchema);
