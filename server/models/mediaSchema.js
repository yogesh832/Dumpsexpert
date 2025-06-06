const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
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
    maxlength: 200
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);