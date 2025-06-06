const mongoose = require('mongoose');

const pageMetaSchema = new mongoose.Schema({
  metaTitle: {
    type: String,
    trim: true
  },
  metaKeywords: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  },
  schema: {
    type: String,
    trim: true
  }
}, { _id: false });

const metaInfoSchema = new mongoose.Schema({
  home: pageMetaSchema,
  about: pageMetaSchema,
  faq: pageMetaSchema,
  contact: pageMetaSchema,
  blog: pageMetaSchema,
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MetaInfo', metaInfoSchema);