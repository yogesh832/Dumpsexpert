const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { parser } = require('../utils/cloudinary');
const {
  getAllImages,
  getImageById,
  uploadImage,
  updateImage,
  deleteImage,
  getImageCategories
} = require('../controllers/imageUploadController');
const {authMiddleware} = require('../middlewares/authMiddleware');

// Configure multer for temporary storage before uploading to Cloudinary
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'temp'));
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Get all images with pagination and filtering
router.get('/', getAllImages);

// Get image categories
router.get('/categories', getImageCategories);

// Get a single image by ID
router.get('/:id', getImageById);

// Upload a new image
router.post('/', authMiddleware, upload.single('image'), uploadImage);

// Update image metadata or replace image
router.put('/:id', authMiddleware, upload.single('image'), updateImage);

// Delete an image
router.delete('/:id', authMiddleware, deleteImage);

module.exports = router;