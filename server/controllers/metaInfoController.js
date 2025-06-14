const MetaInfo = require('../models/metaInfoSchema');

// Get all meta information
exports.getMetaInfo = async (req, res) => {
  try {
    // Find the meta info document (there should be only one)
    const metaInfo = await MetaInfo.findOne().populate('lastUpdatedBy', 'name email');
    
    if (!metaInfo) {
      // If no meta info exists, create a default one
      const defaultMetaInfo = new MetaInfo({
        home: {
          metaTitle: 'DumpsExpert - Home',
          metaKeywords: 'exam dumps, certification, study materials',
          metaDescription: 'DumpsExpert provides high-quality exam dumps and certification materials.',
          schema: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "DumpsExpert",
            "url": "https://dumpsexpert.com"
          })
        },
        about: {
          metaTitle: 'About Us - DumpsExpert',
          metaKeywords: 'about dumpsexpert, certification experts',
          metaDescription: 'Learn more about DumpsExpert and our mission to help you succeed in your certification journey.',
          schema: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About DumpsExpert"
          })
        },
        faq: {
          metaTitle: 'FAQ - DumpsExpert',
          metaKeywords: 'dumpsexpert faq, certification questions',
          metaDescription: 'Frequently asked questions about DumpsExpert certification materials and services.',
          schema: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage"
          })
        },
        contact: {
          metaTitle: 'Contact Us - DumpsExpert',
          metaKeywords: 'contact dumpsexpert, support',
          metaDescription: 'Get in touch with DumpsExpert for questions about our certification materials and services.',
          schema: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact DumpsExpert"
          })
        },
        blog: {
          metaTitle: 'Blog - DumpsExpert',
          metaKeywords: 'certification blog, exam tips, study guides',
          metaDescription: 'Read the latest articles, tips, and guides for certification success on the DumpsExpert blog.',
          schema: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "DumpsExpert Blog"
          })
        },
        lastUpdatedBy: req.user?._id || '64f8b8fb83e6a0e1e4b0bd0f' // Default admin ID or current user
      });

      await defaultMetaInfo.save();
      return res.status(200).json({
        message: 'Default meta information created and retrieved successfully',
        data: defaultMetaInfo
      });
    }
    
    res.status(200).json({
      message: 'Meta information retrieved successfully',
      data: metaInfo
    });
  } catch (error) {
    console.error('Error retrieving meta information:', error);
    res.status(500).json({
      message: 'Server error while retrieving meta information',
      error: error.message
    });
  }
};

// Get meta information for a specific page
exports.getPageMetaInfo = async (req, res) => {
  try {
    const { page } = req.params;
    
    // Validate page parameter
    const validPages = ['home', 'about', 'faq', 'contact', 'blog'];
    if (!validPages.includes(page)) {
      return res.status(400).json({ message: 'Invalid page parameter' });
    }
    
    // Find the meta info document
    const metaInfo = await MetaInfo.findOne().select(`${page} lastUpdatedBy`);
    
    if (!metaInfo) {
      return res.status(404).json({ message: 'Meta information not found' });
    }
    
    res.status(200).json({
      message: `Meta information for ${page} page retrieved successfully`,
      data: metaInfo[page]
    });
  } catch (error) {
    console.error('Error retrieving page meta information:', error);
    res.status(500).json({
      message: 'Server error while retrieving page meta information',
      error: error.message
    });
  }
};

// Update meta information
exports.updateMetaInfo = async (req, res) => {
  try {
    const { home, about, faq, contact, blog } = req.body;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find existing meta info or create new one
    let metaInfo = await MetaInfo.findOne();
    
    if (!metaInfo) {
      // Create new meta info if it doesn't exist
      metaInfo = new MetaInfo({
        lastUpdatedBy: userId
      });
    }

    // Update fields if provided
    if (home) {
      // Validate schema JSON
      if (home.schema) {
        try {
          JSON.parse(home.schema);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid JSON schema for home page' });
        }
      }
      metaInfo.home = { ...metaInfo.home.toObject(), ...home };
    }

    if (about) {
      // Validate schema JSON
      if (about.schema) {
        try {
          JSON.parse(about.schema);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid JSON schema for about page' });
        }
      }
      metaInfo.about = { ...metaInfo.about.toObject(), ...about };
    }

    if (faq) {
      // Validate schema JSON
      if (faq.schema) {
        try {
          JSON.parse(faq.schema);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid JSON schema for faq page' });
        }
      }
      metaInfo.faq = { ...metaInfo.faq.toObject(), ...faq };
    }

    if (contact) {
      // Validate schema JSON
      if (contact.schema) {
        try {
          JSON.parse(contact.schema);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid JSON schema for contact page' });
        }
      }
      metaInfo.contact = { ...metaInfo.contact.toObject(), ...contact };
    }

    if (blog) {
      // Validate schema JSON
      if (blog.schema) {
        try {
          JSON.parse(blog.schema);
        } catch (e) {
          return res.status(400).json({ message: 'Invalid JSON schema for blog page' });
        }
      }
      metaInfo.blog = { ...metaInfo.blog.toObject(), ...blog };
    }

    // Update lastUpdatedBy
    metaInfo.lastUpdatedBy = userId;

    // Save changes
    await metaInfo.save();

    res.status(200).json({
      message: 'Meta information updated successfully',
      data: metaInfo
    });
  } catch (error) {
    console.error('Error updating meta information:', error);
    res.status(500).json({
      message: 'Server error during meta information update',
      error: error.message
    });
  }
};

// Update meta information for a specific page
exports.updatePageMetaInfo = async (req, res) => {
  try {
    const { page } = req.params;
    const pageData = req.body;
    const userId = req.user?._id;

    // Validate page parameter
    const validPages = ['home', 'about', 'faq', 'contact', 'blog'];
    if (!validPages.includes(page)) {
      return res.status(400).json({ message: 'Invalid page parameter' });
    }

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Validate schema JSON if provided
    if (pageData.schema) {
      try {
        JSON.parse(pageData.schema);
      } catch (e) {
        return res.status(400).json({ message: `Invalid JSON schema for ${page} page` });
      }
    }

    // Find existing meta info or create new one
    let metaInfo = await MetaInfo.findOne();
    
    if (!metaInfo) {
      // Create new meta info with default values
      metaInfo = new MetaInfo({
        lastUpdatedBy: userId
      });
    }

    // Update the specific page data
    metaInfo[page] = { ...metaInfo[page].toObject(), ...pageData };
    metaInfo.lastUpdatedBy = userId;

    // Save changes
    await metaInfo.save();

    res.status(200).json({
      message: `Meta information for ${page} page updated successfully`,
      data: metaInfo[page]
    });
  } catch (error) {
    console.error('Error updating page meta information:', error);
    res.status(500).json({
      message: 'Server error during page meta information update',
      error: error.message
    });
  }
};