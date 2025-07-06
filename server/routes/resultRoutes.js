// server/routes/resultRoutes.js
const express = require("express");
const router = express.Router();
const Result = require("../models/resultSchema");

// ✅ POST /api/results/save — Save result if not already submitted
router.post("/save", async (req, res) => {
  try {
    const { studentId, examCode } = req.body;

    if (!studentId || !examCode) {
      return res.status(400).json({ message: "studentId and examCode are required" });
    }

    // Count previous attempts
    const existingAttempts = await Result.countDocuments({ studentId, examCode });

    const result = new Result({
      ...req.body,
      attempt: existingAttempts + 1, // 👈 Add attempt number
    });

    await result.save();

    return res.status(201).json({ message: "Result saved successfully", attempt: existingAttempts + 1 });
  } catch (err) {
    res.status(500).json({ error: "Failed to save result", details: err.message });
  }
});


// resultController.js
router.get('/history/:studentId',getStudentResultHistory = async (req, res) => {
  try {
    const { studentId } = req.params;
    const results = await Result.find({ studentId }).sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch result history" });
  }
});




module.exports = router;
