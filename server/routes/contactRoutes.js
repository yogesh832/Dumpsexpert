const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
  replyToContact
} = require('../controllers/contactController');

// Public routes
router.post('/submit', submitContactForm);

// Protected routes (admin only)
router.get('/', authMiddleware, getAllContacts);
router.get('/:id', authMiddleware, getContactById);
router.put('/:id', authMiddleware, updateContact);
router.delete('/:id', authMiddleware, deleteContact);
router.post('/:id/reply', authMiddleware, replyToContact);

module.exports = router;