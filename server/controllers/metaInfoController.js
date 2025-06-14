const MetaInfo = require('../models/metaInfoSchema');

// Get all meta information
exports.getAllMetaInfo = async (req, res) => {
  try {
    const metaInfo = await MetaInfo.findOne().populate('lastUpdatedBy', 'name email');

    if (!metaInfo) {
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
        lastUpdatedBy: req.user?._id || '64f8b8fb83e6a0e1e4b0bd0f'
      });

      await defaultMetaInfo.save();
      return res.status(200).json({ message: 'Default meta info created', data: defaultMetaInfo });
    }

    res.status(200).json({ message: 'Meta information retrieved', data: metaInfo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get meta info for a specific page
exports.getMetaInfoByPage = async (req, res) => {
  try {
    const { page } = req.params;
    const validPages = ['home', 'about', 'faq', 'contact', 'blog'];
    if (!validPages.includes(page)) {
      return res.status(400).json({ message: 'Invalid page parameter' });
    }

    const metaInfo = await MetaInfo.findOne().select(`${page} lastUpdatedBy`);
    if (!metaInfo) {
      return res.status(404).json({ message: 'Meta information not found' });
    }

    res.status(200).json({ message: `Meta info for ${page}`, data: metaInfo[page] });
  } catch (error) {
    res.status(500).json({ message: 'Error getting page meta info', error: error.message });
  }
};

// Update all meta info
exports.updateAllMetaInfo = async (req, res) => {
  try {
    const { home, about, faq, contact, blog } = req.body;
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    let metaInfo = await MetaInfo.findOne();
    if (!metaInfo) metaInfo = new MetaInfo({ lastUpdatedBy: userId });

    const pages = { home, about, faq, contact, blog };
    for (const [page, data] of Object.entries(pages)) {
      if (data && data.schema) {
        try {
          JSON.parse(data.schema);
        } catch (err) {
          return res.status(400).json({ message: `Invalid JSON schema for ${page}` });
        }
      }
      if (data) metaInfo[page] = { ...metaInfo[page]?.toObject(), ...data };
    }

    metaInfo.lastUpdatedBy = userId;
    await metaInfo.save();

    res.status(200).json({ message: 'Meta info updated', data: metaInfo });
  } catch (error) {
    res.status(500).json({ message: 'Update error', error: error.message });
  }
};

// Update meta info for a specific page
exports.updateMetaInfoByPage = async (req, res) => {
  try {
    const { page } = req.params;
    const data = req.body;
    const userId = req.user?._id;

    const validPages = ['home', 'about', 'faq', 'contact', 'blog'];
    if (!validPages.includes(page)) return res.status(400).json({ message: 'Invalid page' });
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    if (data.schema) {
      try {
        JSON.parse(data.schema);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid JSON schema' });
      }
    }

    let metaInfo = await MetaInfo.findOne();
    if (!metaInfo) metaInfo = new MetaInfo({ lastUpdatedBy: userId });

    metaInfo[page] = { ...metaInfo[page]?.toObject(), ...data };
    metaInfo.lastUpdatedBy = userId;
    await metaInfo.save();

    res.status(200).json({ message: `Meta info for ${page} updated`, data: metaInfo[page] });
  } catch (error) {
    res.status(500).json({ message: 'Error updating page meta', error: error.message });
  }
};
