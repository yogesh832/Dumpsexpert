const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  label: String,
  text: String,
  image: String, // 🆕 optional image per option
});

const questionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true },
  questionCode: { type: String, unique: true },
  questionText: String,
  questionImage: String, // 🆕 optional image for question
  questionType: { type: String, default: "radio" },
  difficulty: String,
  marks: Number,
  negativeMarks: Number,
  subject: String,
  topic: String,
  tags: [String],
  options: [optionSchema],
  correctAnswers: [String],
  isSample: Boolean,
  explanation: String,
  status: { type: String, enum: ["publish", "draft"], default: "draft" }
}, { timestamps: true });

module.exports = mongoose.model("Question", questionSchema);
