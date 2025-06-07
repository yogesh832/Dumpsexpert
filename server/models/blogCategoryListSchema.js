const mongoose = require('mongoose');

const blogCategoryListSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  order: {
    type: Number,
    required: true,
    min: 0
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

module.exports = mongoose.model('BlogCategoryList', blogCategoryListSchema);