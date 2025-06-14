// controllers/basicInfoController.js
const BasicInfo = require('../models/basicInfoSchema');
const { parser, deleteFromCloudinary } = require('../utils/cloudinary');

// Helper function
const handleImageUpdate = async (existing, newImage, field) => {
  if (newImage) {
    if (existing && existing[field] && existing[field].public_id) {
      await deleteFromCloudinary(existing[field].public_id);
    }
    return {
      public_id: newImage.public_id,
      url: newImage.secure_url
    };
  }
  return existing ? existing[field] : null;
};

// GET
exports.getSettings = async (req, res) => {
  try {
    const settings = await BasicInfo.findOne().sort({ createdAt: -1 }).limit(1);
    res.json(settings || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT
exports.updateSettings = async (req, res) => {
  try {
    // Get user ID from auth middleware
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { siteTitle, currencyDirection } = req.body;
    
    // Validate required fields
    if (!siteTitle || !currencyDirection) {
      return res.status(400).json({ message: 'siteTitle and currencyDirection are required' });
    }

    let existingSettings = await BasicInfo.findOne();

    const updateData = {
      siteTitle,
      currencyDirection,
      lastUpdatedBy: userId
    };

    // Handle file uploads if present
    if (req.files) {
      if (req.files['favicon']) {
        const result = await cloudinary.uploader.upload(req.files['favicon'][0].path, {
          folder: 'basic-info'
        });
        updateData.faviconUrl = result.secure_url;
      }
      if (req.files['headerLogo']) {
        const result = await cloudinary.uploader.upload(req.files['headerLogo'][0].path, {
          folder: 'basic-info'
        });
        updateData.headerLogoUrl = result.secure_url;
      }
      if (req.files['breadcrumbImage']) {
        const result = await cloudinary.uploader.upload(req.files['breadcrumbImage'][0].path, {
          folder: 'basic-info'
        });
        updateData.breadcrumbImageUrl = result.secure_url;
      }
    }

    const options = { new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true };
    const updatedSettings = await BasicInfo.findOneAndUpdate({}, updateData, options);

    res.status(200).json({ message: 'Settings updated successfully', data: updatedSettings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ message: 'Server error during settings update', error: error.message });
  }
};

// Middleware for file upload
exports.uploadFiles = parser.fields([
  { name: 'favicon', maxCount: 1 },
  { name: 'headerLogo', maxCount: 1 },
  { name: 'breadcrumbImage', maxCount: 1 }
]);
