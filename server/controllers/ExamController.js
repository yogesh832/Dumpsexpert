const Exam = require("../models/ExamCodeSchema");

// Create Exam
exports.createExam = async (req, res) => {
  try {
    const {
      name,
      eachQuestionMark,
      duration,
      sampleDuration,
      passingScore,
      code,
      numberOfQuestions,
      priceUSD,
      priceINR,
      status,
      mainInstructions,
      sampleInstructions,
      lastUpdatedBy,
    } = req.body;

    const newExam = new Exam({
      name,
      eachQuestionMark,
      duration,
      sampleDuration,
      passingScore,
      code,
      numberOfQuestions,
      priceUSD,
      priceINR,
      status,
      mainInstructions,
      sampleInstructions,
      lastUpdatedBy,
    });

    await newExam.save();
    res.status(201).json({ message: "Exam created successfully", exam: newExam });
  } catch (err) {
    console.error("Create Exam Error:", err);
    res.status(500).json({ error: "Failed to create exam" });
  }
};


// Get Exam by Exam Code
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.status(200).json(exam);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exam" });
  }
};


// Get All Exams
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find();
    res.status(200).json(exams);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exams" });
  }
};

// Get Exam by ID
exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ error: "Exam not found" });
    res.status(200).json(exam);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch exam" });
  }
};

// Update Exam
exports.updateExam = async (req, res) => {
  try {
    const {
      name,
      eachQuestionMark,
      duration,
      sampleDuration,
      passingScore,
      code,
      numberOfQuestions,
      priceUSD,
      priceINR,
      status,
      mainInstructions,
      sampleInstructions,
      lastUpdatedBy,
    } = req.body;

    const updatedExam = await Exam.findByIdAndUpdate(
      req.params.id,
      {
        name,
        eachQuestionMark,
        duration,
        sampleDuration,
        passingScore,
        code,
        numberOfQuestions,
        priceUSD,
        priceINR,
        status,
        mainInstructions,
        sampleInstructions,
        lastUpdatedBy,
      },
      { new: true }
    );

    if (!updatedExam) return res.status(404).json({ error: "Exam not found" });

    res.status(200).json({ message: "Exam updated successfully", exam: updatedExam });
  } catch (err) {
    console.error("Update Exam Error:", err);
    res.status(500).json({ error: "Failed to update exam" });
  }
};

// Delete Exam
exports.deleteExam = async (req, res) => {
  try {
    const deleted = await Exam.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Exam not found" });
    res.status(200).json({ message: "Exam deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete exam" });
  }
};
