const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQCategories,
  reorderFAQs
} = require('../controllers/faqController');

// Public routes
router.get('/', getAllFAQs);
router.get('/categories', getFAQCategories);
router.get('/:id', getFAQById);

// Protected routes (admin only)
router.post('/', authMiddleware, createFAQ);
router.put('/:id', authMiddleware, updateFAQ);
router.delete('/:id', authMiddleware, deleteFAQ);
router.post('/reorder', authMiddleware, reorderFAQs);

module.exports = router;