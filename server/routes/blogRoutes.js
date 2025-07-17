const express = require('express');
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  
  deleteBlog
} = require('../controllers/blogController');
const { parser } = require('../utils/cloudinary');



// Get all blogs with optional filtering
router.get('/all', getAllBlogs);

// Get a specific blog by ID (for admin)
router.get('/id/:id', getBlogById);

// Get a specific blog by slug (for public view)
router.get('/slug/:slug', getBlogBySlug);

// Create a new blog
router.post('/create', parser.single('image'), createBlog);

// Update a blog
router.put('/:id', parser.single('image'), updateBlog);

// Delete a blog
router.delete('/:id', deleteBlog);

module.exports = router;
