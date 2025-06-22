const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');
// const { protect, admin } = require('../middlewares/authMiddleware');
 const { authMiddleware } = require('../middlewares/authMiddleware');

// // Get all SEO settings
router.get('/', seoController.getAllSEO);

// Get a list of all pages with custom SEO settings
router.get('/pages', seoController.getCustomSEOPages);

// Get SEO settings for a specific page
router.get('/:page', seoController.getPageSEO);

// Update default SEO settings (protected)
router.put('/default', authMiddleware, seoController.updateDefaultSEO);

// Update SEO settings for a specific page (protected)
router.put('/:page', authMiddleware, seoController.updatePageSEO);

// Create or update SEO settings for a specific page (protected)
router.post('/:page', authMiddleware, seoController.updatePageSEO);

// Delete SEO settings for a specific page (revert to default) (protected)
router.delete('/:page', authMiddleware, seoController.deletePageSEO);

module.exports = router;