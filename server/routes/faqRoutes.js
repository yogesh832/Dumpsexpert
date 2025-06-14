const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
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
router.post('/', isAuthenticated, createFAQ);
router.put('/:id', isAuthenticated, updateFAQ);
router.delete('/:id', isAuthenticated, deleteFAQ);
router.post('/reorder', isAuthenticated, reorderFAQs);

module.exports = router;