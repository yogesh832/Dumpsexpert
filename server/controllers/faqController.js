const mongoose = require('mongoose');
const FAQ = mongoose.model('FAQ', new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true }));

// Get all FAQs
exports.getAllFAQs = async (req, res) => {
  try {
    const { category, isActive } = req.query;
    const query = {};
    
    // Apply filters if provided
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const faqs = await FAQ.find(query)
      .populate('lastUpdatedBy', 'name email')
      .sort({ category: 1, order: 1 })
      .exec();
    
    res.status(200).json({
      message: 'FAQs retrieved successfully',
      data: faqs
    });
  } catch (error) {
    console.error('Error retrieving FAQs:', error);
    res.status(500).json({
      message: 'Server error while retrieving FAQs',
      error: error.message
    });
  }
};

// Get FAQ by ID
exports.getFAQById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const faq = await FAQ.findById(id)
      .populate('lastUpdatedBy', 'name email');
    
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    res.status(200).json({
      message: 'FAQ retrieved successfully',
      data: faq
    });
  } catch (error) {
    console.error('Error retrieving FAQ:', error);
    res.status(500).json({
      message: 'Server error while retrieving FAQ',
      error: error.message
    });
  }
};

// Create a new FAQ
exports.createFAQ = async (req, res) => {
  try {
    const { question, answer, category, order, isActive } = req.body;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Validate required fields
    if (!question || !answer || !category) {
      return res.status(400).json({ message: 'Question, answer, and category are required' });
    }

    // Create new FAQ
    const newFAQ = new FAQ({
      question,
      answer,
      category,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      lastUpdatedBy: userId
    });

    await newFAQ.save();

    res.status(201).json({
      message: 'FAQ created successfully',
      data: newFAQ
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({
      message: 'Server error during FAQ creation',
      error: error.message
    });
  }
};

// Update a FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, order, isActive } = req.body;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the FAQ first to check if it exists
    const existingFAQ = await FAQ.findById(id);
    if (!existingFAQ) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    // Prepare update object
    const updates = {
      question: question || existingFAQ.question,
      answer: answer || existingFAQ.answer,
      category: category || existingFAQ.category,
      lastUpdatedBy: userId
    };

    // Only update optional fields if provided
    if (order !== undefined) updates.order = order;
    if (isActive !== undefined) updates.isActive = isActive;

    // Update the FAQ
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('lastUpdatedBy', 'name email');

    res.status(200).json({
      message: 'FAQ updated successfully',
      data: updatedFAQ
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({
      message: 'Server error during FAQ update',
      error: error.message
    });
  }
};

// Delete a FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the FAQ first to check if it exists
    const faq = await FAQ.findById(id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await FAQ.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'FAQ deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({
      message: 'Server error during FAQ deletion',
      error: error.message
    });
  }
};

// Get FAQ categories
exports.getFAQCategories = async (req, res) => {
  try {
    const categories = await FAQ.distinct('category');
    
    res.status(200).json({
      message: 'FAQ categories retrieved successfully',
      data: categories
    });
  } catch (error) {
    console.error('Error retrieving FAQ categories:', error);
    res.status(500).json({
      message: 'Server error while retrieving FAQ categories',
      error: error.message
    });
  }
};

// Reorder FAQs
exports.reorderFAQs = async (req, res) => {
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

    // Update each FAQ with new order
    const updatePromises = items.map(item => {
      return FAQ.findByIdAndUpdate(
        item.id,
        { order: item.order, lastUpdatedBy: userId },
        { new: true }
      );
    });

    await Promise.all(updatePromises);

    res.status(200).json({
      message: 'FAQs reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering FAQs:', error);
    res.status(500).json({
      message: 'Server error during FAQ reordering',
      error: error.message
    });
  }
};