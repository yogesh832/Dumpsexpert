const AddBlogCategory = require("../models/AddBlogCategory");

// Create Blog Category
exports.createBlogCategory = async (req, res) => {
  try {
    const {
      language,
      title,
      category,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
      status,
    } = req.body;

    const imageUrl = req.body.imageUrl; // You can change this to handle file uploads later

    if (!imageUrl) return res.status(400).json({ error: "Image URL is required" });

    const newBlog = new AddBlogCategory({
      language,
      imageUrl,
      title,
      category,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
      status: status.toLowerCase(), // standardize casing
      lastUpdatedBy: req.user?._id || req.body.lastUpdatedBy, // update this logic as per auth
    });

    const saved = await newBlog.save();
    return res.status(201).json({ message: "Blog Category created", data: saved });
  } catch (err) {
    console.error("❌ Error in createBlogCategory:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

// Get All Blog Categories
exports.getAllBlogCategories = async (req, res) => {
  try {
    const blogs = await AddBlogCategory.find().populate('category').populate('lastUpdatedBy');
    return res.status(200).json(blogs);
  } catch (err) {
    console.error("❌ Error in getAllBlogCategories:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get Single Blog Category
exports.getBlogCategoryById = async (req, res) => {
  try {
    const blog = await AddBlogCategory.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Not Found" });

    return res.status(200).json(blog);
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update Blog Category
exports.updateBlogCategory = async (req, res) => {
  try {
    const updated = await AddBlogCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return res.status(200).json({ message: "Updated", data: updated });
  } catch (err) {
    return res.status(500).json({ error: "Update failed" });
  }
};

// Delete Blog Category
exports.deleteBlogCategory = async (req, res) => {
  try {
    await AddBlogCategory.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ error: "Delete failed" });
  }
};
