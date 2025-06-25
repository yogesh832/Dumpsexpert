const mongoose = require('mongoose');

const seoPageSchema = new mongoose.Schema({
  // Basic SEO fields
  title: {
    type: String,
    trim: true,
    maxlength: 60
  },
  description: {
    type: String,
    trim: true,
    maxlength: 160
  },
  keywords: {
    type: String,
    trim: true
  },
  
  // Open Graph fields
  ogTitle: {
    type: String,
    trim: true
  },
  ogDescription: {
    type: String,
    trim: true
  },
  ogImage: {
    type: String,
    trim: true,
    validate: {
      validator: (v) => !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v),
      message: 'Invalid image URL'
    }
  },
  ogUrl: {
    type: String,
    trim: true,
    validate: {
      validator: (v) => !v || /^https?:\/\/.+/.test(v),
      message: 'Invalid URL format'
    }
  },
  
  // Twitter Card fields
  twitterTitle: {
    type: String,
    trim: true
  },
  twitterDescription: {
    type: String,
    trim: true
  },
  twitterImage: {
    type: String,
    trim: true,
    validate: {
      validator: (v) => !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/.test(v),
      message: 'Invalid image URL'
    }
  },
  twitterCard: {
    type: String,
    trim: true,
    default: 'summary_large_image',
    enum: ['summary', 'summary_large_image', 'app', 'player']
  },
  
  // Additional SEO fields
  canonicalUrl: {
    type: String,
    trim: true,
    validate: {
      validator: (v) => !v || /^https?:\/\/.+/.test(v),
      message: 'Invalid URL format'
    }
  },
  schema: {
    type: String,
    trim: true,
    validate: {
      validator: (v) => {
        if (!v) return true;
        try {
          JSON.parse(v);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Invalid JSON-LD schema'
    }
  }
}, { _id: false });

const seoSchema = new mongoose.Schema({
  // Default SEO settings
  default: seoPageSchema,
  
  // Page-specific SEO settings
  pages: {
    type: Map,
    of: seoPageSchema,
    default: {}
  },
  
  // Track who last updated the SEO settings
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('SEO', seoSchema);