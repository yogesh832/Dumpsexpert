const Question = require("../models/QuestionSchema");

// Generate unique question code
const generateQuestionCode = async () => {
  const count = await Question.countDocuments();
  return `Q-${String(count + 1).padStart(3, '0')}`;
};

// 🔄 Create a question
exports.createQuestion = async (req, res) => {
  try {
    const questionCode = await generateQuestionCode();
    const question = new Question({ ...req.body, questionCode });
    const saved = await question.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🆙 Update a question
exports.updateQuestion = async (req, res) => {
  try {
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
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

// 🔍 Get single question
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
    const questions = await Question.find({ examId: req.params.examId });
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
