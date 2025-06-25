const SEO = require('../models/seoSchema');

// Get all SEO settings
exports.getAllSEO = async (req, res) => {
  try {
    // Find the SEO document (there should be only one)
    const seo = await SEO.findOne().populate('lastUpdatedBy', 'name email');
    
    if (!seo) {
      // If no SEO settings exist, create default ones
      const defaultSEO = new SEO({
        default: {
          title: 'Dumps Expert - Your Certification Exam Preparation Partner',
          description: 'Prepare for your certification exams with Dumps Expert. We provide high-quality exam dumps and practice tests to help you pass your exams.',
          keywords: 'certification, exam dumps, practice tests, exam preparation',
          schema: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Dumps Expert",
            "url": "https://dumpsexpert.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://dumpsexpert.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        },
        lastUpdatedBy: req.user ? req.user._id : '000000000000000000000000' // Default user ID if not authenticated
      });
      
      await defaultSEO.save();
      return res.status(200).json({
        message: 'Default SEO settings created',
        data: defaultSEO
      });
    }
    
    res.status(200).json({
      message: 'SEO settings retrieved successfully',
      data: seo
    });
  } catch (error) {
    console.error('Error retrieving SEO settings:', error);
    res.status(500).json({
      message: 'Server error while retrieving SEO settings',
      error: error.message
    });
  }
};

// Get SEO settings for a specific page
exports.getPageSEO = async (req, res) => {
  try {
    const { page } = req.params;
    
    if (!page) {
      return res.status(400).json({ message: 'Page parameter is required' });
    }
    
    // Find the SEO document
    const seo = await SEO.findOne();
    
    if (!seo) {
      return res.status(404).json({ message: 'SEO settings not found' });
    }
    
    // Get page-specific SEO or default if not found
    const pageSEO = seo.pages.get(page) || seo.default;
    
    res.status(200).json({
      message: 'Page SEO settings retrieved successfully',
      data: pageSEO,
      isDefault: !seo.pages.get(page)
    });
  } catch (error) {
    console.error('Error retrieving page SEO settings:', error);
    res.status(500).json({
      message: 'Server error while retrieving page SEO settings',
      error: error.message
    });
  }
};

// Update default SEO settings
exports.updateDefaultSEO = async (req, res) => {
  try {
    const {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
      twitterTitle,
      twitterDescription,
      twitterImage,
      twitterCard,
      canonicalUrl,
      schema
    } = req.body;
    
    // Validate authentication
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Validate schema if provided
    if (schema) {
      try {
        JSON.parse(schema);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid JSON-LD schema format' });
      }
    }
    
    // Find or create SEO document
    let seo = await SEO.findOne();
    
    if (!seo) {
      seo = new SEO({
        default: {},
        lastUpdatedBy: req.user._id
      });
    }
    
    // Update default SEO settings
    seo.default = {
      // Basic SEO fields
      title: title || seo.default?.title,
      description: description || seo.default?.description,
      keywords: keywords || seo.default?.keywords,
      
      // Open Graph fields
      ogTitle: ogTitle || seo.default?.ogTitle,
      ogDescription: ogDescription || seo.default?.ogDescription,
      ogImage: ogImage || seo.default?.ogImage,
      ogUrl: ogUrl || seo.default?.ogUrl,
      
      // Twitter Card fields
      twitterTitle: twitterTitle || seo.default?.twitterTitle,
      twitterDescription: twitterDescription || seo.default?.twitterDescription,
      twitterImage: twitterImage || seo.default?.twitterImage,
      twitterCard: twitterCard || seo.default?.twitterCard,
      
      // Additional SEO fields
      canonicalUrl: canonicalUrl || seo.default?.canonicalUrl,
      schema: schema || seo.default?.schema
    };
    
    seo.lastUpdatedBy = req.user._id;
    await seo.save();
    
    res.status(200).json({
      message: 'Default SEO settings updated successfully',
      data: seo.default
    });
  } catch (error) {
    console.error('Error updating default SEO settings:', error);
    res.status(500).json({
      message: 'Server error while updating default SEO settings',
      error: error.message
    });
  }
};

// Update SEO settings for a specific page
exports.updatePageSEO = async (req, res) => {
  try {
    const { page } = req.params;
    const {
      title,
      description,
      keywords,
      ogTitle,
      ogDescription,
      ogImage,
      ogUrl,
      twitterTitle,
      twitterDescription,
      twitterImage,
      twitterCard,
      canonicalUrl,
      schema,
      useDefault
    } = req.body;
    
    // Validate page parameter
    if (!page) {
      return res.status(400).json({ message: 'Page parameter is required' });
    }
    
    // Validate authentication
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Validate schema if provided
    if (schema) {
      try {
        JSON.parse(schema);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid JSON-LD schema format' });
      }
    }
    
    // Find or create SEO document
    let seo = await SEO.findOne();
    
    if (!seo) {
      seo = new SEO({
        default: {
          title: 'Dumps Expert - Your Certification Exam Preparation Partner',
          description: 'Prepare for your certification exams with Dumps Expert. We provide high-quality exam dumps and practice tests to help you pass your exams.',
          keywords: 'certification, exam dumps, practice tests, exam preparation'
        },
        lastUpdatedBy: req.user._id
      });
    }
    
    // If useDefault is true, remove page-specific SEO settings
    if (useDefault) {
      seo.pages.delete(page);
    } else {
      // Get existing page SEO or create new one
      const existingPageSEO = seo.pages.get(page) || {};
      
      // Update page SEO settings
      seo.pages.set(page, {
        // Basic SEO fields
        title: title || existingPageSEO.title,
        description: description || existingPageSEO.description,
        keywords: keywords || existingPageSEO.keywords,
        
        // Open Graph fields
        ogTitle: ogTitle || existingPageSEO.ogTitle,
        ogDescription: ogDescription || existingPageSEO.ogDescription,
        ogImage: ogImage || existingPageSEO.ogImage,
        ogUrl: ogUrl || existingPageSEO.ogUrl,
        
        // Twitter Card fields
        twitterTitle: twitterTitle || existingPageSEO.twitterTitle,
        twitterDescription: twitterDescription || existingPageSEO.twitterDescription,
        twitterImage: twitterImage || existingPageSEO.twitterImage,
        twitterCard: twitterCard || existingPageSEO.twitterCard,
        
        // Additional SEO fields
        canonicalUrl: canonicalUrl || existingPageSEO.canonicalUrl,
        schema: schema || existingPageSEO.schema
      });
    }
    
    seo.lastUpdatedBy = req.user._id;
    await seo.save();
    
    res.status(200).json({
      message: `SEO settings for page '${page}' updated successfully`,
      data: useDefault ? seo.default : seo.pages.get(page),
      isDefault: useDefault
    });
  } catch (error) {
    console.error('Error updating page SEO settings:', error);
    res.status(500).json({
      message: 'Server error while updating page SEO settings',
      error: error.message
    });
  }
};

// Delete SEO settings for a specific page (revert to default)
exports.deletePageSEO = async (req, res) => {
  try {
    const { page } = req.params;
    
    // Validate page parameter
    if (!page) {
      return res.status(400).json({ message: 'Page parameter is required' });
    }
    
    // Validate authentication
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Find SEO document
    const seo = await SEO.findOne();
    
    if (!seo) {
      return res.status(404).json({ message: 'SEO settings not found' });
    }
    
    // Check if page-specific SEO exists
    if (!seo.pages.has(page)) {
      return res.status(404).json({ message: `No custom SEO settings found for page '${page}'` });
    }
    
    // Remove page-specific SEO
    seo.pages.delete(page);
    seo.lastUpdatedBy = req.user._id;
    await seo.save();
    
    res.status(200).json({
      message: `SEO settings for page '${page}' deleted successfully, reverted to default`,
      data: seo.default
    });
  } catch (error) {
    console.error('Error deleting page SEO settings:', error);
    res.status(500).json({
      message: 'Server error while deleting page SEO settings',
      error: error.message
    });
  }
};

// Get a list of all pages with custom SEO settings
exports.getCustomSEOPages = async (req, res) => {
  try {
    // Find the SEO document
    const seo = await SEO.findOne();
    
    if (!seo) {
      return res.status(404).json({ message: 'SEO settings not found' });
    }
    
    // Get all pages with custom SEO
    const pages = Array.from(seo.pages.keys());
    
    res.status(200).json({
      message: 'Custom SEO pages retrieved successfully',
      data: pages
    });
  } catch (error) {
    console.error('Error retrieving custom SEO pages:', error);
    res.status(500).json({
      message: 'Server error while retrieving custom SEO pages',
      error: error.message
    });
  }
};