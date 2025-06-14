const Product = require('../models/productListSchema');
const { cloudinary } = require('../utils/cloudinary');

// Get all products with pagination and filtering
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, status } = req.query;
    const query = {};

    // Apply filters if provided
    if (category) query.category = category;
    if (status) query.status = status;

    // Count total documents matching the query
    const totalDocs = await Product.countDocuments(query);

    // Fetch products with pagination
    const products = await Product.find(query)
      .populate('lastUpdatedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.status(200).json({
      message: 'Products retrieved successfully',
      data: products,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: parseInt(page),
      hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
      hasPrevPage: parseInt(page) > 1
    });
  } catch (error) {
    console.error('Error retrieving products:', error);
    res.status(500).json({
      message: 'Server error while retrieving products',
      error: error.message
    });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id)
      .populate('lastUpdatedBy', 'name email');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json({
      message: 'Product retrieved successfully',
      data: product
    });
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({
      message: 'Server error while retrieving product',
      error: error.message
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    
    const products = await Product.find({ category, status: 'active' })
      .populate('lastUpdatedBy', 'name email');
    
    res.status(200).json({
      message: 'Products retrieved successfully',
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error retrieving products by category:', error);
    res.status(500).json({
      message: 'Server error while retrieving products',
      error: error.message
    });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const {
      sapExamCode,
      title,
      price,
      category,
      status,
      action
    } = req.body;

    const userId = req.user?._id;

    // Validate required fields
    if (!sapExamCode || !title || !price || !category || !status || !action) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Upload image to Cloudinary if provided
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products'
      });
      imageUrl = result.secure_url;
    } else {
      return res.status(400).json({ message: 'Product image is required' });
    }

    // Create new product
    const newProduct = new Product({
      sapExamCode,
      imageUrl,
      title,
      price,
      category,
      status,
      action,
      lastUpdatedBy: userId
    });

    await newProduct.save();

    res.status(201).json({
      message: 'Product created successfully',
      data: newProduct
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      message: 'Server error during product creation',
      error: error.message
    });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sapExamCode,
      title,
      price,
      category,
      status,
      action
    } = req.body;

    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the product first to check if it exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Prepare update object
    const updates = {
      sapExamCode: sapExamCode || existingProduct.sapExamCode,
      title: title || existingProduct.title,
      price: price || existingProduct.price,
      category: category || existingProduct.category,
      status: status || existingProduct.status,
      action: action || existingProduct.action,
      lastUpdatedBy: userId
    };

    // Handle image upload if provided
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (existingProduct.imageUrl) {
        try {
          const publicId = existingProduct.imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch (cloudinaryError) {
          console.warn('Error deleting old image from Cloudinary:', cloudinaryError);
          // Continue with the update even if image deletion fails
        }
      }
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'products'
      });
      updates.imageUrl = result.secure_url;
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('lastUpdatedBy', 'name email');

    res.status(200).json({
      message: 'Product updated successfully',
      data: updatedProduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      message: 'Server error during product update',
      error: error.message
    });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the product first to check if it exists
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image from Cloudinary
    if (product.imageUrl) {
      try {
        const publicId = product.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (cloudinaryError) {
        console.warn('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if image removal fails
      }
    }

    await Product.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Product deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      message: 'Server error during product deletion',
      error: error.message
    });
  }
};