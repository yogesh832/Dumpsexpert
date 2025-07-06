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

    // 🧠 Find previous attempts
    const previousAttempts = await Result.find({ studentId, examCode });
    const nextAttempt = previousAttempts.length + 1;

    const result = new Result({
      ...req.body,
      attempt: nextAttempt, // 🆕 include the attempt number
    });

    await result.save();
    res.status(201).json({ message: "Result saved successfully", attempt: nextAttempt });
  } catch (err) {
    res.status(500).json({ error: "Failed to save result", details: err.message });
  }
});


// ✅ GET /api/results/check?studentId=abc123&examCode=EXAM101
// Used in frontend to check before test starts
router.get("/check", async (req, res) => {
  try {
    const { studentId, examCode } = req.query;

    if (!studentId || !examCode) {
      return res.status(400).json({ error: "studentId and examCode required" });
    }

    const result = await Result.findOne({ studentId, examCode });
    return res.status(200).json({ alreadySubmitted: !!result });
  } catch (error) {
    return res.status(500).json({ error: "Failed to check result status", details: error.message });
  }
});

module.exports = router;
