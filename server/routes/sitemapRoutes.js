const express = require('express');
const router = express.Router();
const sitemapController = require('../controllers/sitemapController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public', 'sitemaps'));
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function(req, file, cb) {
    // Accept only XML files
    if (path.extname(file.originalname).toLowerCase() === '.xml') {
      return cb(null, true);
    }
    cb(new Error('Only XML files are allowed'));
  }
});

// Get all sitemaps
router.get('/', sitemapController.getAllSitemaps);

// Get sitemap by ID
router.get('/:id', sitemapController.getSitemapById);

// Create a new sitemap
router.post('/', auth, upload.single('sitemap'), sitemapController.createSitemap);

// Update a sitemap
router.put('/:id', auth, upload.single('sitemap'), sitemapController.updateSitemap);

// Delete a sitemap
router.delete('/:id', auth, sitemapController.deleteSitemap);

// Download a sitemap
router.get('/:id/download', sitemapController.downloadSitemap);

// Generate sitemap.xml
router.post('/generate', auth, sitemapController.generateSitemap);

module.exports = router;