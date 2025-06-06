const mongoose = require('mongoose');

const sitemapSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
    trim: true
  },
  download: {
    type: String,
    required: true,
    trim: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Sitemap', sitemapSchema);