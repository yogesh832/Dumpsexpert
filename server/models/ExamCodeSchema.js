const mongoose = require('mongoose');

const examCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  numberOfQuestions: {
    type: Number,
    required: true,
    min: 1
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

module.exports = mongoose.model('ExamCode', examCodeSchema);