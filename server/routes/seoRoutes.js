const express = require('express');
const router = express.Router();
const seoController = require('../controllers/seoController');
const { protect, admin } = require('../middleware/authMiddleware');

// Get all SEO settings
router.get('/', seoController.getAllSEO);

// Get a list of all pages with custom SEO settings
router.get('/pages', seoController.getCustomSEOPages);

// Get SEO settings for a specific page
router.get('/:page', seoController.getPageSEO);

// Update default SEO settings (protected)
router.put('/default', protect, admin, seoController.updateDefaultSEO);

// Update SEO settings for a specific page (protected)
router.put('/:page', protect, admin, seoController.updatePageSEO);

// Delete SEO settings for a specific page (revert to default) (protected)
router.delete('/:page', protect, admin, seoController.deletePageSEO);

module.exports = router;