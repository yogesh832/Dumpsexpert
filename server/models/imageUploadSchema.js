const mongoose = require('mongoose');

const imageUploadSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/.test(v),
      message: 'Invalid image URL'
    }
  },
  publicId: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  altText: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    default: 'general'
  },
  size: {
    type: Number,
    default: 0
  },
  format: {
    type: String,
    trim: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ImageUpload', imageUploadSchema);