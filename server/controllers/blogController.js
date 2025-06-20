const BlogList = require('../models/blogSchema');
const { cloudinary } = require('../utils/cloudinary');

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
      .populate('category', 'title')
      .populate('lastUpdatedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.status(200).json({
      message: 'Blogs retrieved successfully',
      data: blogs,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: parseInt(page),
      hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
      hasPrevPage: parseInt(page) > 1
    });
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    res.status(500).json({
      message: 'Server error while retrieving blogs',
      error: error.message
    });
  }
};

// Get a single blog post by ID// Get a single blog post by slug (for public viewing)
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await BlogList.findOne({ slug, status: 'publish' })
      .populate('category', 'title')
      .populate('lastUpdatedBy', 'name email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({
      message: 'Blog retrieved successfully',
      data: blog
    });
  } catch (error) {
    console.error('Error retrieving blog by slug:', error);
    res.status(500).json({
      message: 'Server error while retrieving blog',
      error: error.message
    });
  }
};


// Get a single blog post by slug (for public viewing)
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const blog = await BlogList.findOne({ slug, status: 'publish' })
      .populate('category', 'title')
      .populate('lastUpdatedBy', 'name email');
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    res.status(200).json({
      message: 'Blog retrieved successfully',
      data: blog
    });
  } catch (error) {
    console.error('Error retrieving blog by slug:', error);
    res.status(500).json({
      message: 'Server error while retrieving blog',
      error: error.message
    });
  }
};

// Create a new blog post
exports.createBlog = async (req, res) => {
  try {
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
      status
    } = req.body;

    const userId = req.user?._id;

    // Validate required fields
    if (!title || !language || !slug || !category || !content || !metaTitle || !metaKeywords || !metaDescription || !schema) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if slug already exists
    const existingBlog = await BlogList.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({ message: 'Slug already exists' });
    }

    // Upload image to Cloudinary if provided
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blogs'
      });
      imageUrl = result.secure_url;
    } else {
      return res.status(400).json({ message: 'Blog image is required' });
    }

    // Create new blog
    const newBlog = new BlogList({
      imageUrl,
      title,
      language,
      slug,
      category,
      content,
      metaTitle,
      metaKeywords,
      metaDescription,
      schema,
      status: status || 'unpublish',
      lastUpdatedBy: userId
    });

    await newBlog.save();

    res.status(201).json({
      message: 'Blog created successfully',
      data: newBlog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({
      message: 'Server error during blog creation',
      error: error.message
    });
  }
};


// Get a single blog post by ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await BlogList.findById(id)
      .populate('category', 'title')
      .populate('lastUpdatedBy', 'name email');

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json({
      message: 'Blog retrieved successfully',
      data: blog
    });
  } catch (error) {
    console.error('Error retrieving blog:', error);
    res.status(500).json({
      message: 'Server error while retrieving blog',
      error: error.message
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
      status
    } = req.body;

    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the blog first to check if it exists
    const existingBlog = await BlogList.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Check if slug already exists (excluding current blog)
    if (slug && slug !== existingBlog.slug) {
      const slugExists = await BlogList.findOne({ slug, _id: { $ne: id } });
      if (slugExists) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
    }

    // Prepare update object
    const updates = {
      title: title || existingBlog.title,
      language: language || existingBlog.language,
      slug: slug || existingBlog.slug,
      category: category || existingBlog.category,
      content: content || existingBlog.content,
      metaTitle: metaTitle || existingBlog.metaTitle,
      metaKeywords: metaKeywords || existingBlog.metaKeywords,
      metaDescription: metaDescription || existingBlog.metaDescription,
      schema: schema || existingBlog.schema,
      status: status ? status.toLowerCase() : existingBlog.status,
      lastUpdatedBy: userId
    };

    // Handle image upload if provided
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (existingBlog.imageUrl) {
        try {
          const publicId = existingBlog.imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`blogs/${publicId}`);
        } catch (cloudinaryError) {
          console.warn('Error deleting old image from Cloudinary:', cloudinaryError);
          // Continue with the update even if image deletion fails
        }
      }
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'blogs'
      });
      updates.imageUrl = result.secure_url;
    }

    // Update the blog
    const updatedBlog = await BlogList.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('category', 'title').populate('lastUpdatedBy', 'name email');

    res.status(200).json({
      message: 'Blog updated successfully',
      data: updatedBlog
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({
      message: 'Server error during blog update',
      error: error.message
    });
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the blog first to check if it exists
    const blog = await BlogList.findById(id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete image from Cloudinary
    if (blog.imageUrl) {
      try {
        const publicId = blog.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`blogs/${publicId}`);
      } catch (cloudinaryError) {
        console.warn('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if image removal fails
      }
    }

    await BlogList.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Blog deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      message: 'Server error during blog deletion',
      error: error.message
    });
  }
};
