const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  examCode: { type: String, required: true },
  attempt: { type: Number, required: true }, // 🔥 new field
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

// 🔄 Remove unique index since we now allow multiple attempts
resultSchema.index({ studentId: 1, examCode: 1, attempt: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);
