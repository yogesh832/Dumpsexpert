const ImageUpload = require('../models/imageUploadSchema');
const { cloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// Get all images with pagination and filtering
exports.getAllImages = async (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query;
    const query = {};

    // Apply category filter if provided
    if (category) query.category = category;

    // Count total documents matching the query
    const totalDocs = await ImageUpload.countDocuments(query);

    // Fetch images with pagination
    const images = await ImageUpload.find(query)
      .populate('lastUpdatedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.status(200).json({
      message: 'Images retrieved successfully',
      data: images,
      totalDocs,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: parseInt(page),
      hasNextPage: parseInt(page) < Math.ceil(totalDocs / limit),
      hasPrevPage: parseInt(page) > 1
    });
  } catch (error) {
    console.error('Error retrieving images:', error);
    res.status(500).json({
      message: 'Server error while retrieving images',
      error: error.message
    });
  }
};

// Get a single image by ID
exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const image = await ImageUpload.findById(id)
      .populate('lastUpdatedBy', 'name email');
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    res.status(200).json({
      message: 'Image retrieved successfully',
      data: image
    });
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({
      message: 'Server error while retrieving image',
      error: error.message
    });
  }
};

// Upload a new image
exports.uploadImage = async (req, res) => {
  try {
    const { title, altText, category } = req.body;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'uploads',
      resource_type: 'image'
    });

    // Create new image record
    const newImage = new ImageUpload({
      imageUrl: result.secure_url,
      publicId: result.public_id,
      title: title || 'Untitled',
      altText: altText || '',
      category: category || 'general',
      size: result.bytes,
      format: result.format,
      lastUpdatedBy: userId
    });

    await newImage.save();

    res.status(201).json({
      message: 'Image uploaded successfully',
      data: newImage
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      message: 'Server error during image upload',
      error: error.message
    });
  }
};

// Update image metadata
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, altText, category } = req.body;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the image first to check if it exists
    const existingImage = await ImageUpload.findById(id);
    if (!existingImage) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Prepare update object
    const updates = {
      title: title || existingImage.title,
      altText: altText || existingImage.altText,
      category: category || existingImage.category,
      lastUpdatedBy: userId
    };

    // Handle image replacement if provided
    if (req.file) {
      // Delete old image from Cloudinary
      await deleteFromCloudinary(existingImage.publicId);
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'uploads',
        resource_type: 'image'
      });

      updates.imageUrl = result.secure_url;
      updates.publicId = result.public_id;
      updates.size = result.bytes;
      updates.format = result.format;
    }

    // Update the image
    const updatedImage = await ImageUpload.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('lastUpdatedBy', 'name email');

    res.status(200).json({
      message: 'Image updated successfully',
      data: updatedImage
    });
  } catch (error) {
    console.error('Error updating image:', error);
    res.status(500).json({
      message: 'Server error during image update',
      error: error.message
    });
  }
};

// Delete an image
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the image first to check if it exists
    const image = await ImageUpload.findById(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Delete image from Cloudinary
    await deleteFromCloudinary(image.publicId);

    // Delete image from database
    await ImageUpload.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Image deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({
      message: 'Server error during image deletion',
      error: error.message
    });
  }
};

// Get image categories
exports.getImageCategories = async (req, res) => {
  try {
    const categories = await ImageUpload.distinct('category');
    
    res.status(200).json({
      message: 'Image categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    console.error('Error retrieving image categories:', error);
    res.status(500).json({
      message: 'Server error while retrieving image categories',
      error: error.message
    });
  }
};