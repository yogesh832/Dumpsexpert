const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
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
router.get('/', isAuthenticated, getAllContacts);
router.get('/:id', isAuthenticated, getContactById);
router.put('/:id', isAuthenticated, updateContact);
router.delete('/:id', isAuthenticated, deleteContact);
router.post('/:id/reply', isAuthenticated, replyToContact);

module.exports = router;