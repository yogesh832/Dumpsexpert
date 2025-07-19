const mongoose = require("mongoose");
const Question = require("../models/QuestionSchema");
const Product = require("../models/productListSchema");
const ExamCodeSchema = require("../models/ExamCodeSchema");
// 🔢 Generate unique question code
const generateQuestionCode = async () => {
  const count = await Question.countDocuments();
  return `Q-${String(count + 1).padStart(3, "0")}`;
};

// ➕ Create a question
exports.createQuestion = async (req, res) => {
  try {
    const { examId } = req.body;

    if (!examId) {
      return res.status(400).json({ message: "examId is required" });
    }

    const questionCode = await generateQuestionCode();

    const question = new Question({
      ...req.body,
      examId: new mongoose.Types.ObjectId(examId), // store as ObjectId
      questionCode,
    });

    const saved = await question.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Error creating question:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// 🔄 Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Delete a question
exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📄 Get all questions
exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔍 Get a question by ID
exports.getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.status(200).json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📚 Get questions by exam ID
exports.getQuestionsByExam = async (req, res) => {
  try {
    const examObjectId = new mongoose.Types.ObjectId(req.params.examId);
    const questions = await Question.find({ examId: examObjectId });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get only sample questions for an exam



exports.getQuestionsByProductSlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
console.log("product._id:", product._id);
console.log("typeof product._id:", typeof product._id);

const question = await Question.findOne();
console.log("sample examId:", question.examId);

    const questions = await Question.find({ examId: question.examId });

    res.json({ success: true, data: questions },
      console.log("Fetched questions for product:", slug, questions)
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

