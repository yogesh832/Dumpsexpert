const mongoose = require('mongoose');

const editQuestionSchema = new mongoose.Schema({
  examCode: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamCode',
    required: true
  },
  addToSample: {
    type: Boolean,
    required: true,
    default: false
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'short-answer', 'essay'],
    required: true,
    trim: true
  },
  question: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  answers: [
    {
      text: {
        type: String,
        required: true,
        trim: true
      },
      isCorrect: {
        type: Boolean,
        required: true
      }
    }
  ],
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

module.exports = mongoose.model('EditQuestion', editQuestionSchema);