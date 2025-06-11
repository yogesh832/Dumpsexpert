const SocialLink = require('../models/socialLinkSchema');
const { cloudinary } = require('../utils/cloudinary');

// Get all SocialLinks
exports.getSocialLinks = async (req, res, next) => {
  try {
    const socialLinks = await SocialLink.find();
    res.json(socialLinks);
  } catch (error) {
    next(error);
  }
};

// Create a new SocialLink
exports.createSocialLink = async (req, res, next) => {
  try {
    const { socialURL } = req.body;

    // Validate input
    if (!socialURL) {
      return res.status(400).json({ message: 'socialURL is required' });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'socialIcon image is required' });
    }

    const socialLink = new SocialLink({
      socialIcon: req.file.path, // Cloudinary URL
      socialURL
    });
    await socialLink.save();
    res.status(201).json(socialLink);
  } catch (error) {
    next(error);
  }
};

// Update a SocialLink
exports.updateSocialLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { socialURL } = req.body;

    // Validate input
    if (!socialURL) {
      return res.status(400).json({ message: 'socialURL is required' });
    }

    const updates = { socialURL };
    if (req.file) {
      // Delete old image from Cloudinary if new image is uploaded
      const socialLink = await SocialLink.findById(id);
      if (socialLink && socialLink.socialIcon) {
        const publicId = socialLink.socialIcon.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`social_links/${publicId}`);
      }
      updates.socialIcon = req.file.path; // New Cloudinary URL
    }

    const socialLink = await SocialLink.findByIdAndUpdate(id, updates, { new: true });

    if (!socialLink) {
      return res.status(404).json({ message: 'SocialLink not found' });
    }

    res.json(socialLink);
  } catch (error) {
    next(error);
  }
};

// Delete a SocialLink
exports.deleteSocialLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    const socialLink = await SocialLink.findById(id);

    if (!socialLink) {
      return res.status(404).json({ message: 'SocialLink not found' });
    }

    // Delete image from Cloudinary
    if (socialLink.socialIcon) {
      const publicId = socialLink.socialIcon.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`social_links/${publicId}`);
    }

    await SocialLink.findByIdAndDelete(id);
    res.json({ message: 'SocialLink deleted successfully' });
  } catch (error) {
    next(error);
  }
};