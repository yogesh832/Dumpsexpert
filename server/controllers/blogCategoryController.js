const BlogCategory = require('../models/blogCategorySchema');
const { deleteFromCloudinary } = require('../utils/cloudinary');

// Get Blog Category by ID
const getBlogCategoryById = async (req, res) => {
  try {
    const category = await BlogCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Not Found' });

    return res.status(200).json(category);
  } catch (err) {
    console.error('❌ Error in getBlogCategoryById:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Create Blog Category
const createBlogCategory = async (req, res) => {
  try {
    const {
      sectionName,
      category,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const newCategory = new BlogCategory({
      sectionName,
      category,
      imageUrl: req.file.path,
      imagePublicId: req.file.filename,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
    });

    const saved = await newCategory.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Create Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

// Get All Blog Categories
const getAllBlogCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find();
    res.status(200).json(categories);
  } catch (err) {
    console.error('❌ Error fetching all blog categories:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

// Update Blog Category
const updateBlogCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const {
      sectionName,
      category,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
    } = req.body;

    const updateData = {
      sectionName,
      category,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
    };

    if (req.file) {
      // If new image is uploaded, delete the old one if it exists
      const oldCategory = await BlogCategory.findById(categoryId);
      if (oldCategory && oldCategory.imagePublicId) {
        await deleteFromCloudinary(oldCategory.imagePublicId);
      }
      updateData.imageUrl = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updatedCategory = await BlogCategory.findByIdAndUpdate(categoryId, updateData, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error('Update Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

// Delete Blog Category
const deleteBlogCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await BlogCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Delete associated image from Cloudinary if it exists
    if (category.imagePublicId) {
      await deleteFromCloudinary(category.imagePublicId);
    }

    await BlogCategory.findByIdAndDelete(categoryId);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};

module.exports = {
  createBlogCategory,
  getAllBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
};
