const BlogList = require("../models/blogSchema");
const { cloudinary } = require("../utils/cloudinary");

// Get all blog posts with pagination and filtering
exports.getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status, language } = req.query;
    const query = {};

    // Apply filters if provided
    if (category) query.category = category;
    if (status) query.status = status.toLowerCase();
    if (language) query.language = language;

    // Count total documents matching the query
    const totalDocs = await BlogList.countDocuments(query);

    // Fetch blogs with pagination
    const blogs = await BlogList.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.status(200).json({
      message: "Blogs retrieved successfully",
      data: blogs,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: parseInt(page),
      hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
      hasPrevPage: parseInt(page) > 1,
    });
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    res.status(500).json({
      message: "Server error while retrieving blogs",
      error: error.message,
    });
  }
};

// Get a single blog post by ID

exports.getBlogById = async (req, res) => {
  try {
    const blog = await BlogList.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.status(200).json({ data: blog });
  } catch (err) {
    // console.error("Error fetching blog by ID:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Get a single blog post by slug (for public viewing)
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await BlogList.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error retrieving blog by slug:", error);
    res.status(500).json({
      message: "Server error while retrieving blog",
      error: error.message,
    });
  }
};

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      language,
      slug,
      category,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
      status,
    } = req.body;

    // Create new blog post with data from frontend
    const newBlogData = {
      title: title || "Untitled Blog",
      content: content || "Default content",
      language: language || "en",
      slug:
        slug ||
        (title
          ? title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          : "untitled-blog"),
      category: category || "", // Use category from frontend as string
      metaTitle: metaTitle || (title ? title : "Untitled Blog"),
      metaKeywords: metaKeywords || "",
      metaDescription: metaDescription || "",
      schema: schema || "",
      status: status || "unpublish",
      imageUrl: req.file ? req.file.path : "",
      imagePublicId: req.file ? req.file.filename : "",
    };

    const newBlog = new BlogList(newBlogData);

    // Save to database
    await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({
      message: "Server error while creating blog",
      error: error.message,
    });
  }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      language,
      slug,
      category,
      content,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
      status,
    } = req.body;

    // Prepare updated data
    const updatedData = {
      title: title || "Untitled Blog",
      content: content || "Default content",
      language: language || "en",
      slug:
        slug ||
        (title
          ? title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          : "untitled-blog"),
      category: category || "", // Use category from frontend as string
      metaTitle: metaTitle || (title ? title : "Untitled Blog"),
      metaKeywords: metaKeywords || "",
      metaDescription: metaDescription || "",
      schema: schema || "",
      status: status || "unpublish",
    };

    // If an image is uploaded, update image fields
    if (req.file) {
      updatedData.imageUrl = req.file.path;
      updatedData.imagePublicId = req.file.filename;
    }

    // Update the blog post
    const updatedBlog = await BlogList.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      message: "Server error while updating blog",
      error: error.message,
    });
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the blog first to check if it exists
    const blog = await BlogList.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Delete image from Cloudinary if exists
    if (blog.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      } catch (cloudinaryError) {
        console.warn("Error deleting image from Cloudinary:", cloudinaryError);
        // Continue with deletion even if image removal fails
      }
    }

    await BlogList.findByIdAndDelete(id);

    res.status(200).json({
      message: "Blog deleted successfully",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      message: "Server error during blog deletion",
      error: error.message,
    });
  }
};
