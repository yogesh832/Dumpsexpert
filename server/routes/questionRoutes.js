const express = require("express");
const router = express.Router();
const questionCtrl = require("../controllers/QuestionController");
const { parser } = require("../utils/cloudinary");

// ✅ Upload question/option image (reused Cloudinary parser)
router.post("/upload", parser.single("file"), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.status(200).json({ secure_url: req.file.path });
});

// ✅ Get all questions
router.get("/", questionCtrl.getAllQuestions);

// ✅ Get questions by examId
router.get("/byExam/:examId", questionCtrl.getQuestionsByExam);
router.get("/byProductSlug/:slug", questionCtrl.getQuestionsByProductSlug);

// ✅ Get single question by ID
router.get("/:id", questionCtrl.getQuestionById);

// ✅ Create a question
router.post("/", questionCtrl.createQuestion);

// ✅ Update a question
router.put("/:id", questionCtrl.updateQuestion);

// ✅ Delete a question
router.delete("/:id", questionCtrl.deleteQuestion);

module.exports = router;
//added comment to avoid confusion
