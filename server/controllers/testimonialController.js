const mongoose = require('mongoose');
const { cloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

const Testimonial = mongoose.model('Testimonial', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  imageUrl: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true }));

// Get all testimonials
exports.getAllTestimonials = async (req, res) => {
  try {
    const { isActive } = req.query;
    const query = {};
    
    // Apply filters if provided
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const testimonials = await Testimonial.find(query)
      .populate('lastUpdatedBy', 'name email')
      .sort({ order: 1 })
      .exec();
    
    res.status(200).json({
      message: 'Testimonials retrieved successfully',
      data: testimonials
    });
  } catch (error) {
    console.error('Error retrieving testimonials:', error);
    res.status(500).json({
      message: 'Server error while retrieving testimonials',
      error: error.message
    });
  }
};

// Get testimonial by ID
exports.getTestimonialById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const testimonial = await Testimonial.findById(id)
      .populate('lastUpdatedBy', 'name email');
    
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }
    
    res.status(200).json({
      message: 'Testimonial retrieved successfully',
      data: testimonial
    });
  } catch (error) {
    console.error('Error retrieving testimonial:', error);
    res.status(500).json({
      message: 'Server error while retrieving testimonial',
      error: error.message
    });
  }
};

// Create a new testimonial
exports.createTestimonial = async (req, res) => {
  try {
    const { name, position, company, content, rating, isActive, order } = req.body;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Validate required fields
    if (!name || !content) {
      return res.status(400).json({ message: 'Name and content are required' });
    }

    // Upload image to Cloudinary if provided
    let imageUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'testimonials'
      });
      imageUrl = result.secure_url;
    }

    // Create new testimonial
    const newTestimonial = new Testimonial({
      name,
      position,
      company,
      content,
      rating: rating || 5,
      imageUrl,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
      lastUpdatedBy: userId
    });

    await newTestimonial.save();

    res.status(201).json({
      message: 'Testimonial created successfully',
      data: newTestimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      message: 'Server error during testimonial creation',
      error: error.message
    });
  }
};

// Update a testimonial
exports.updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, company, content, rating, isActive, order } = req.body;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the testimonial first to check if it exists
    const existingTestimonial = await Testimonial.findById(id);
    if (!existingTestimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Prepare update object
    const updates = {
      lastUpdatedBy: userId
    };

    // Only update fields if provided
    if (name) updates.name = name;
    if (position !== undefined) updates.position = position;
    if (company !== undefined) updates.company = company;
    if (content) updates.content = content;
    if (rating !== undefined) updates.rating = rating;
    if (isActive !== undefined) updates.isActive = isActive;
    if (order !== undefined) updates.order = order;

    // Handle image upload if provided
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (existingTestimonial.imageUrl) {
        try {
          const publicId = existingTestimonial.imageUrl.split('/').pop().split('.')[0];
          await deleteFromCloudinary(`testimonials/${publicId}`);
        } catch (cloudinaryError) {
          console.warn('Error deleting old image from Cloudinary:', cloudinaryError);
          // Continue with the update even if image deletion fails
        }
      }
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'testimonials'
      });
      updates.imageUrl = result.secure_url;
    }

    // Update the testimonial
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('lastUpdatedBy', 'name email');

    res.status(200).json({
      message: 'Testimonial updated successfully',
      data: updatedTestimonial
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({
      message: 'Server error during testimonial update',
      error: error.message
    });
  }
};

// Delete a testimonial
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the testimonial first to check if it exists
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ message: 'Testimonial not found' });
    }

    // Delete image from Cloudinary if it exists
    if (testimonial.imageUrl) {
      try {
        const publicId = testimonial.imageUrl.split('/').pop().split('.')[0];
        await deleteFromCloudinary(`testimonials/${publicId}`);
      } catch (cloudinaryError) {
        console.warn('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if image removal fails
      }
    }

    await Testimonial.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Testimonial deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({
      message: 'Server error during testimonial deletion',
      error: error.message
    });
  }
};

// Reorder testimonials
exports.reorderTestimonials = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Validate input
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid items array' });
    }

    // Update each testimonial with new order
    const updatePromises = items.map(item => {
      return Testimonial.findByIdAndUpdate(
        item.id,
        { order: item.order, lastUpdatedBy: userId },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      message: 'Testimonials reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering testimonials:', error);
    res.status(500).json({
      message: 'Server error during testimonial reordering',
      error: error.message
    });
  }
};