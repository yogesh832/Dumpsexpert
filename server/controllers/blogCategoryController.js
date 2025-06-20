const AddBlogCategory = require("../models/blogCategorySchema");
const { deleteFromCloudinary } = require("../utils/cloudinary");



const getBlogCategoryById = async (req, res) => {
  try {
    const blog = await AddBlogCategory.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not Found" });

    return res.status(200).json(blog);
  } catch (err) {
    console.error("❌ Error in getBlogCategoryById:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Create Blog Category
const createBlogCategory = async (req, res) => {
  try {
    const {
      language,
      title,
      category,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    const newCategory = new AddBlogCategory({
      sectionName: title,
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

const getAllBlogCategories = async (req, res) => {
  try {
    const categories = await AddBlogCategory.find().populate('category');
    res.status(200).json(categories);
  } catch (err) {
    console.error('Fetch Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  }
};


// Update Blog Category
const updateBlogCategory = async (req, res) => {
  try {
    const {
      sectionName,
      category,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
    } = req.body;

    if (
      !sectionName ||
      !category ||
      !metaTitle ||
      !metaKeywords ||
      !metaDescription ||
      !schema
    ) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    const blog = await AddBlogCategory.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog category not found" });

    // If a new image is uploaded, delete the old one from Cloudinary
    if (req.file) {
      await deleteFromCloudinary(blog.imagePublicId);
    }

    const updateData = {
      sectionName,
      category,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
      lastUpdatedBy: req.user?._id || req.body.lastUpdatedBy,
    };

    if (req.file) {
      updateData.imageUrl = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    const updated = await AddBlogCategory.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({ message: "Updated successfully", data: updated });
  } catch (err) {
    console.error("❌ Error in updateBlogCategory:", err);
    return res.status(500).json({ error: "Update failed", details: err.message });
  }
};

// Delete Blog Category
const deleteBlogCategory = async (req, res) => {
  try {
    const blog = await AddBlogCategory.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog category not found" });

    await deleteFromCloudinary(blog.imagePublicId);
    await blog.deleteOne();

    return res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("❌ Error in deleteBlogCategory:", err);
    return res.status(500).json({ error: "Delete failed", details: err.message });
  }
};

module.exports = {
  createBlogCategory,
  getAllBlogCategories,
  getBlogCategoryById,
  updateBlogCategory,
  deleteBlogCategory,
};

