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
    const { userId } = req; // from auth middleware
    const { siteTitle, currencyDirection } = req.body;
    let existingSettings = await BasicInfo.findOne();

    const updateData = {
      siteTitle,
      currencyDirection,
      lastUpdatedBy: userId
    };

    if (req.files) {
      if (req.files['favicon']) {
        updateData.favicon = await handleImageUpdate(
          existingSettings,
          req.files['favicon'][0],
          'favicon'
        );
      }
      if (req.files['headerLogo']) {
        updateData.headerLogo = await handleImageUpdate(
          existingSettings,
          req.files['headerLogo'][0],
          'headerLogo'
        );
      }
      if (req.files['breadcrumbImage']) {
        updateData.breadcrumbImage = await handleImageUpdate(
          existingSettings,
          req.files['breadcrumbImage'][0],
          'breadcrumbImage'
        );
      }
    }

    const options = { new: true, upsert: true, setDefaultsOnInsert: true };
    const updatedSettings = await BasicInfo.findOneAndUpdate({}, updateData, options);

    res.json(updatedSettings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Middleware for file upload
exports.uploadFiles = parser.fields([
  { name: 'favicon', maxCount: 1 },
  { name: 'headerLogo', maxCount: 1 },
  { name: 'breadcrumbImage', maxCount: 1 }
]);
