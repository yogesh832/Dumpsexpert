const SocialLink = require('../models/socialLinkSchema');
const { cloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// Get all SocialLinks
exports.getAllSocialLinks = async (req, res) => {
  try {
    const socialLinks = await SocialLink.find().populate('lastUpdatedBy', 'name email');
    
    res.status(200).json({
      message: 'Social links retrieved successfully',
      count: socialLinks.length,
      data: socialLinks
    });
  } catch (error) {
    console.error('Error retrieving social links:', error);
    res.status(500).json({ 
      message: 'Server error while retrieving social links', 
      error: error.message 
    });
  }
};

// Create a new SocialLink
exports.createSocialLink = async (req, res, next) => {
  try {
    const { socialURL } = req.body;
    const userId = req.user?._id;

    // Validate input
    if (!socialURL) {
      return res.status(400).json({ message: 'socialURL is required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'socialIcon image is required' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'social_links'
    });

    const socialLink = new SocialLink({
      socialIcon: result.secure_url, // Cloudinary URL
      socialURL,
      lastUpdatedBy: userId
    });

    await socialLink.save();
    res.status(201).json({ message: 'Social link created successfully', data: socialLink });
  } catch (error) {
    console.error('Error creating social link:', error);
    res.status(500).json({ message: 'Server error during social link creation', error: error.message });
  }
};

// Update a SocialLink
exports.updateSocialLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { socialURL } = req.body;
    const userId = req.user?._id;

    // Validate input
    if (!socialURL) {
      return res.status(400).json({ message: 'socialURL is required' });
    }
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the social link first to check if it exists
    const existingSocialLink = await SocialLink.findById(id);
    if (!existingSocialLink) {
      return res.status(404).json({ message: 'Social link not found' });
    }

    const updates = { 
      socialURL,
      lastUpdatedBy: userId 
    };

    // Handle image upload if provided
    if (req.file) {
      // Delete old image from Cloudinary if new image is uploaded
      if (existingSocialLink.socialIcon) {
        try {
          // Extract public ID from the URL
          const publicId = existingSocialLink.socialIcon.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`social_links/${publicId}`);
        } catch (cloudinaryError) {
          console.warn('Error deleting old image from Cloudinary:', cloudinaryError);
          // Continue with the update even if image deletion fails
        }
      }
      
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'social_links'
      });
      updates.socialIcon = result.secure_url;
    }

    const updatedSocialLink = await SocialLink.findByIdAndUpdate(
      id, 
      updates, 
      { new: true, runValidators: true }
    );

    res.status(200).json({ 
      message: 'Social link updated successfully', 
      data: updatedSocialLink 
    });
  } catch (error) {
    console.error('Error updating social link:', error);
    res.status(500).json({ 
      message: 'Server error during social link update', 
      error: error.message 
    });
  }
};

// Delete a SocialLink
exports.deleteSocialLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the social link first to check if it exists
    const socialLink = await SocialLink.findById(id);
    if (!socialLink) {
      return res.status(404).json({ message: 'Social link not found' });
    }

    // Delete image from Cloudinary
    if (socialLink.socialIcon) {
      try {
        const publicId = socialLink.socialIcon.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`social_links/${publicId}`);
      } catch (cloudinaryError) {
        console.warn('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with deletion even if image removal fails
      }
    }

    await SocialLink.findByIdAndDelete(id);
    res.status(200).json({ 
      message: 'Social link deleted successfully',
      deletedId: id
    });
  } catch (error) {
    console.error('Error deleting social link:', error);
    res.status(500).json({ 
      message: 'Server error during social link deletion', 
      error: error.message 
    });
  }
};