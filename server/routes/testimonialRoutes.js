const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { isAuthenticated } = require('../middleware/auth');
const {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials
} = require('../controllers/testimonialController');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `testimonial-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Public routes
router.get('/', getAllTestimonials);
router.get('/:id', getTestimonialById);

// Protected routes
router.post('/', isAuthenticated, upload.single('image'), createTestimonial);
router.put('/:id', isAuthenticated, upload.single('image'), updateTestimonial);
router.delete('/:id', isAuthenticated, deleteTestimonial);
router.post('/reorder', isAuthenticated, reorderTestimonials);

module.exports = router;