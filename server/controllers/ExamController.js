const Exam = require("../models/ExamCodeSchema");

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

// ✅ Get Exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exam" });
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
