const mongoose = require("mongoose");
const resultSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  examCode: { type: String, required: true },
  attempt: { type: Number, default: 1 }, // 👈 add this
  totalQuestions: Number,
  code:{type: String,}, 
  attempted: Number,
  wrong: Number,
  correct: Number,
  percentage: Number,
  duration: Number,
  completedAt: String,
  userAnswers: Object,
  questions: Array,
}, { timestamps: true });

// 👇 Remove unique constraint now
// resultSchema.index({ studentId: 1, examCode: 1 }, { unique: true });

module.exports = mongoose.model("Result", resultSchema);
