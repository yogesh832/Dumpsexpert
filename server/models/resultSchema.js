// models/ResultModel.js
const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  examCode: { type: String, required: true },
  totalQuestions: Number,
  attempted: Number,
  wrong: Number,
  correct: Number,
  percentage: Number,
  duration: Number,
  completedAt: String,
  userAnswers: Object,
  questions: Array,
}, { timestamps: true });

// 👇 Ensures only one result per user per exam
resultSchema.index({ studentId: 1, examCode: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);
