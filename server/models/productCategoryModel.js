const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  public_id: { type: String },
  status: { type: String, enum: ['Ready', 'Publish'], default: 'Ready' }
}, { timestamps: true });

module.exports = mongoose.model('ProductCategory', productCategorySchema);
