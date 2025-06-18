const express = require('express');
const router = express.Router();
const questionCtrl = require('../controllers/QuestionController');

// ✅ Get questions by examId
router.get('/byExam/:examId', questionCtrl.getQuestionsByExam);

// CRUD routes
router.post('/', questionCtrl.createQuestion);
router.put('/:id', questionCtrl.updateQuestion);
router.delete('/:id', questionCtrl.deleteQuestion);

module.exports = router;
