const mongoose = require('mongoose');

const addBlogCategorySchema = new mongoose.Schema({
  language: {
    type: String,
    required: true,
    trim: true,
    enum: ['en', 'es', 'fr'] // Add supported languages
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v),
      message: 'Invalid image URL'
    }
  },
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogCategoryList',
    required: true
  },
  metaTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: 60 // SEO best practice
  },
  metaKeywords: {
    type: String,
    required: true,
    trim: true
  },
  metaDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 160 // SEO best practice
  },
  schema: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => {
        try {
          JSON.parse(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid JSON-LD schema'
    }
  },
  status: {
    type: String,
    enum: ['unpublish', 'publish'],
    required: true,
    default: 'unpublish'
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('AddBlogCategory', addBlogCategorySchema);