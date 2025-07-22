const express = require("express");
const router = express.Router();
const examController = require("../controllers/ExamController");

router.post("/", examController.createExam);
router.get("/", examController.getExams);

// ✅ Update this route
router.get("/byId/:id", examController.getExamById);
router.get('/byProduct/:productId', examController.getExamsByProduct);
router.get("/byslug/:slug", examController.getExamsByProductSlug);
// GET exam by courseId
router.get("/byCourseId/:courseId",examController.gerExamByCourseId);
router.get("/:id", examController.getExamById); // still supports direct id fetch
router.put("/:id", examController.updateExam);
router.delete("/:id", examController.deleteExam);

module.exports = router;
