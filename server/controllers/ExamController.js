const Exam = require("../models/ExamCodeSchema");
const Product = require("../models/productListSchema");
const mongoose = require("mongoose")
// ✅ Create Exam
exports.createExam = async (req, res) => {
  try {
    console.log("📥 Incoming exam payload:", req.body);

    // Create a single instance from full payload
    const exam = new Exam(req.body);

    // Save to DB
    await exam.save();

    console.log("✅ Exam created:", exam);
    res.status(201).json({
      message: "Exam created successfully",
      exam,
    });

  } catch (err) {
    console.error("❌ Create Exam Error:", err);
    res.status(500).json({
      error: "Failed to create exam",
      details: err.message,
    });
  }
};

exports.getExamsByCourseId = async (req, res) => {
  try {
  const { courseId } = req.params;
const exams = await Exam.find({
  courseId: new mongoose.Types.ObjectId(courseId)
});
    if (!exams || exams.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No exams found for this courseId"
      });
    }

    res.status(200).json({
      success: true,
      data: exams
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


// ✅ Get Exam by ID
exports.getExamById = async (req, res) => {
  const { id } = req.params;
  try {
    const exam = await Exam.findById(id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getExamsByProduct = async (req, res) => {
  try {
    const exams = await Exam.find({ productId: req.params.productId });
    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exams for product' });
  }
};



exports.getExamsByProductSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const exams = await Exam.find({ productId: product._id });
    res.status(200).json(exams);
  } catch (err) {
    console.error("Error in getExamsByProductSlug:", err);
    res.status(500).json({ error: 'Failed to fetch exams for product slug' });
  }
};
// ✅ Get All Exams
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exams" });
  }
};

// ✅ Update Exam
exports.updateExam = async (req, res) => {
  try {
    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      req.body,           // 🔄 Use full body directly
      { new: true }        // 👈 return updated document
    );

    if (!updatedExam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    res.status(200).json({
      message: "Exam updated successfully",
      exam: updatedExam,
    });

  } catch (err) {
    console.error("❌ Update Exam Error:", err);
    res.status(500).json({ error: "Failed to update exam" });
  }
};

// ✅ Delete Exam
exports.deleteExam = async (req, res) => {
  try {
    const deleted = await Exam.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete exam" });
  }
};
