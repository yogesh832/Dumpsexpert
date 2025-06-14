const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const auth = require('../middlewares/authMiddleware');
const { parser } = require('../utils/cloudinary');

// Get all blogs with pagination and filtering
router.get('/', blogController.getAllBlogs);

// Get blog by ID
router.get('/id/:id', blogController.getBlogById);

// Get blog by slug
router.get('/slug/:slug', blogController.getBlogBySlug);

// Create a new blog
router.post('/', auth, parser.single('image'), blogController.createBlog);

// Update a blog
router.put('/:id', auth, parser.single('image'), blogController.updateBlog);

// Delete a blog
router.delete('/:id', auth, blogController.deleteBlog);

module.exports = router;