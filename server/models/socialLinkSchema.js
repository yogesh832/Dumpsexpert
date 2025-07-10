const mongoose = require('mongoose');

const SocialLinkSchema = new mongoose.Schema({
  icon: { type: String, required: true },
  url: { type: String, required: true },
});

module.exports = mongoose.model('SocialLink', SocialLinkSchema);
