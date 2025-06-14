const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
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
router.get('/subscribers', authMiddleware, getAllSubscribers);
router.delete('/subscribers/:id', authMiddleware, deleteSubscriber);
router.put('/subscribers/:id/status', authMiddleware, updateSubscriberStatus);

router.post('/send', authMiddleware, createAndSendNewsletter);
router.get('/history', authMiddleware, getAllNewsletters);
router.get('/history/:id', authMiddleware, getNewsletterById);
router.delete('/history/:id', authMiddleware, deleteNewsletter);

module.exports = router;