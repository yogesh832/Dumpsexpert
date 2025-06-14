const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const {
  subscribe,
  confirmSubscription,
  unsubscribe,
  getAllSubscribers,
  deleteSubscriber,
  updateSubscriberStatus,
  createAndSendNewsletter,
  getAllNewsletters,
  getNewsletterById,
  deleteNewsletter
} = require('../controllers/newsletterController');

// Public routes
router.post('/subscribe', subscribe);
router.get('/confirm/:token', confirmSubscription);
router.get('/unsubscribe/:token', unsubscribe);

// Protected routes (admin only)
router.get('/subscribers', isAuthenticated, getAllSubscribers);
router.delete('/subscribers/:id', isAuthenticated, deleteSubscriber);
router.put('/subscribers/:id/status', isAuthenticated, updateSubscriberStatus);

router.post('/send', isAuthenticated, createAndSendNewsletter);
router.get('/history', isAuthenticated, getAllNewsletters);
router.get('/history/:id', isAuthenticated, getNewsletterById);
router.delete('/history/:id', isAuthenticated, deleteNewsletter);

module.exports = router;