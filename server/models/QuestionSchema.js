const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  label: String,
  text: String,
});

const questionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam" },
  questionText: String,
  questionType: String,
  difficulty: String,
  marks: Number,
  negativeMarks: Number,
  options: [optionSchema],
  correctAnswers: [String],
  isSample: Boolean,
  status: { type: String, enum: ["publish", "draft"], default: "draft" },
});

module.exports = mongoose.model("Question", questionSchema);
