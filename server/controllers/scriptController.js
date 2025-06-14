const Script = require('../models/scriptSchema');

// Get all script settings
exports.getScriptSettings = async (req, res) => {
  try {
    // Find the script settings document (there should be only one)
    const scriptSettings = await Script.findOne().populate('lastUpdatedBy', 'name email');
    
    if (!scriptSettings) {
      // If no script settings exist, create default ones
      const defaultScriptSettings = new Script({
        tawkToStatus: 'inactive',
        tawkToWidgetCode: '',
        messengerStatus: 'inactive',
        fbPageId: '',
        googleAnalyticsStatus: 'inactive',
        googleAnalyticsCode: '',
        googleRecaptchaStatus: 'inactive',
        googleRecaptchaSiteKey: '',
        googleRecaptchaSecretKey: '',
        lastUpdatedBy: req.user?._id || '64f8b8fb83e6a0e1e4b0bd0f' // Default admin ID or current user
      });

      await defaultScriptSettings.save();
      return res.status(200).json({
        message: 'Default script settings created and retrieved successfully',
        data: defaultScriptSettings
      });
    }
    
    res.status(200).json({
      message: 'Script settings retrieved successfully',
      data: scriptSettings
    });
  } catch (error) {
    console.error('Error retrieving script settings:', error);
    res.status(500).json({
      message: 'Server error while retrieving script settings',
      error: error.message
    });
  }
};

// Update script settings
exports.updateScriptSettings = async (req, res) => {
  try {
    const {
      tawkToStatus,
      tawkToWidgetCode,
      messengerStatus,
      fbPageId,
      googleAnalyticsStatus,
      googleAnalyticsCode,
      googleRecaptchaStatus,
      googleRecaptchaSiteKey,
      googleRecaptchaSecretKey
    } = req.body;

    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find existing script settings or create new ones
    let scriptSettings = await Script.findOne();
    
    if (!scriptSettings) {
      // Create new script settings if they don't exist
      scriptSettings = new Script({
        lastUpdatedBy: userId
      });
    }

    // Update fields if provided
    if (tawkToStatus !== undefined) scriptSettings.tawkToStatus = tawkToStatus;
    if (tawkToWidgetCode !== undefined) scriptSettings.tawkToWidgetCode = tawkToWidgetCode;
    if (messengerStatus !== undefined) scriptSettings.messengerStatus = messengerStatus;
    if (fbPageId !== undefined) scriptSettings.fbPageId = fbPageId;
    if (googleAnalyticsStatus !== undefined) scriptSettings.googleAnalyticsStatus = googleAnalyticsStatus;
    if (googleAnalyticsCode !== undefined) scriptSettings.googleAnalyticsCode = googleAnalyticsCode;
    if (googleRecaptchaStatus !== undefined) scriptSettings.googleRecaptchaStatus = googleRecaptchaStatus;
    if (googleRecaptchaSiteKey !== undefined) scriptSettings.googleRecaptchaSiteKey = googleRecaptchaSiteKey;
    if (googleRecaptchaSecretKey !== undefined) scriptSettings.googleRecaptchaSecretKey = googleRecaptchaSecretKey;

    // Update lastUpdatedBy
    scriptSettings.lastUpdatedBy = userId;

    // Save changes
    await scriptSettings.save();

    // Remove sensitive data before sending response
    const response = scriptSettings.toObject();
    delete response.googleRecaptchaSecretKey;

    res.status(200).json({
      message: 'Script settings updated successfully',
      data: response
    });
  } catch (error) {
    console.error('Error updating script settings:', error);
    res.status(500).json({
      message: 'Server error during script settings update',
      error: error.message
    });
  }
};

// Get public script settings (for frontend use)
exports.getPublicScriptSettings = async (req, res) => {
  try {
    // Find the script settings document
    const scriptSettings = await Script.findOne().select('-googleRecaptchaSecretKey');
    
    if (!scriptSettings) {
      return res.status(404).json({ message: 'Script settings not found' });
    }
    
    // Create a filtered response with only active scripts
    const publicSettings = {
      tawkTo: scriptSettings.tawkToStatus === 'active' ? {
        active: true,
        widgetCode: scriptSettings.tawkToWidgetCode
      } : { active: false },
      messenger: scriptSettings.messengerStatus === 'active' ? {
        active: true,
        pageId: scriptSettings.fbPageId
      } : { active: false },
      googleAnalytics: scriptSettings.googleAnalyticsStatus === 'active' ? {
        active: true,
        code: scriptSettings.googleAnalyticsCode
      } : { active: false },
      googleRecaptcha: scriptSettings.googleRecaptchaStatus === 'active' ? {
        active: true,
        siteKey: scriptSettings.googleRecaptchaSiteKey
      } : { active: false }
    };
    
    res.status(200).json({
      message: 'Public script settings retrieved successfully',
      data: publicSettings
    });
  } catch (error) {
    console.error('Error retrieving public script settings:', error);
    res.status(500).json({
      message: 'Server error while retrieving public script settings',
      error: error.message
    });
  }
};