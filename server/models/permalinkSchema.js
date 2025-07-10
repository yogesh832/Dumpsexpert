const mongoose = require('mongoose');

const PermalinkSchema = new mongoose.Schema({
  pageName: { type: String, required: true },
  slug: { type: String, required: true },
});

module.exports = mongoose.model('Permalink', PermalinkSchema);
