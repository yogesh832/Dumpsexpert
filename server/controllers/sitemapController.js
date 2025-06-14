const Sitemap = require('../models/sitemapSchema');
const fs = require('fs');
const path = require('path');

// Get all sitemaps
exports.getAllSitemaps = async (req, res) => {
  try {
    const sitemaps = await Sitemap.find().populate('lastUpdatedBy', 'name email');
    
    res.status(200).json({
      message: 'Sitemaps retrieved successfully',
      data: sitemaps
    });
  } catch (error) {
    console.error('Error retrieving sitemaps:', error);
    res.status(500).json({
      message: 'Server error while retrieving sitemaps',
      error: error.message
    });
  }
};

// Get sitemap by ID
exports.getSitemapById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const sitemap = await Sitemap.findById(id).populate('lastUpdatedBy', 'name email');
    
    if (!sitemap) {
      return res.status(404).json({ message: 'Sitemap not found' });
    }
    
    res.status(200).json({
      message: 'Sitemap retrieved successfully',
      data: sitemap
    });
  } catch (error) {
    console.error('Error retrieving sitemap:', error);
    res.status(500).json({
      message: 'Server error while retrieving sitemap',
      error: error.message
    });
  }
};

// Create a new sitemap
exports.createSitemap = async (req, res) => {
  try {
    const { fileName } = req.body;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Sitemap file is required' });
    }

    // Create new sitemap entry
    const newSitemap = new Sitemap({
      fileName: fileName || req.file.originalname,
      download: req.file.path, // Store the file path
      lastUpdatedBy: userId
    });

    await newSitemap.save();

    res.status(201).json({
      message: 'Sitemap created successfully',
      data: newSitemap
    });
  } catch (error) {
    console.error('Error creating sitemap:', error);
    res.status(500).json({
      message: 'Server error while creating sitemap',
      error: error.message
    });
  }
};

// Update a sitemap
exports.updateSitemap = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileName } = req.body;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the existing sitemap
    const sitemap = await Sitemap.findById(id);
    
    if (!sitemap) {
      return res.status(404).json({ message: 'Sitemap not found' });
    }

    // Update fields
    if (fileName) sitemap.fileName = fileName;
    
    // If a new file was uploaded, update the download path
    if (req.file) {
      // Delete the old file if it exists
      if (sitemap.download) {
        try {
          const filePath = path.resolve(sitemap.download);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error('Error deleting old sitemap file:', err);
        }
      }
      
      sitemap.download = req.file.path;
    }

    // Update lastUpdatedBy
    sitemap.lastUpdatedBy = userId;

    // Save changes
    await sitemap.save();

    res.status(200).json({
      message: 'Sitemap updated successfully',
      data: sitemap
    });
  } catch (error) {
    console.error('Error updating sitemap:', error);
    res.status(500).json({
      message: 'Server error while updating sitemap',
      error: error.message
    });
  }
};

// Delete a sitemap
exports.deleteSitemap = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Find the sitemap
    const sitemap = await Sitemap.findById(id);
    
    if (!sitemap) {
      return res.status(404).json({ message: 'Sitemap not found' });
    }

    // Delete the file if it exists
    if (sitemap.download) {
      try {
        const filePath = path.resolve(sitemap.download);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error('Error deleting sitemap file:', err);
      }
    }

    // Delete the sitemap document
    await Sitemap.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Sitemap deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting sitemap:', error);
    res.status(500).json({
      message: 'Server error while deleting sitemap',
      error: error.message
    });
  }
};

// Download a sitemap
exports.downloadSitemap = async (req, res) => {
  try {
    const { id } = req.params;
    
    const sitemap = await Sitemap.findById(id);
    
    if (!sitemap) {
      return res.status(404).json({ message: 'Sitemap not found' });
    }
    
    if (!sitemap.download) {
      return res.status(404).json({ message: 'Sitemap file not found' });
    }
    
    const filePath = path.resolve(sitemap.download);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'Sitemap file not found on server' });
    }
    
    res.download(filePath, sitemap.fileName);
  } catch (error) {
    console.error('Error downloading sitemap:', error);
    res.status(500).json({
      message: 'Server error while downloading sitemap',
      error: error.message
    });
  }
};

// Generate sitemap.xml (this is a placeholder - actual implementation would depend on your site structure)
exports.generateSitemap = async (req, res) => {
  try {
    const userId = req.user?._id;

    // Validate authentication
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // This is where you would implement your sitemap generation logic
    // For example, you might query your database for all pages, products, blogs, etc.
    // and generate a sitemap.xml file based on that data
    
    // Placeholder for sitemap generation logic
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
  <!-- More URLs would be added here -->
</urlset>`;
    
    // Save the sitemap to a file
    const fileName = 'sitemap.xml';
    const filePath = path.join(__dirname, '..', 'public', 'sitemaps', fileName);
    
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, sitemapContent);
    
    // Create or update the sitemap entry in the database
    let sitemap = await Sitemap.findOne({ fileName });
    
    if (!sitemap) {
      sitemap = new Sitemap({
        fileName,
        download: filePath,
        lastUpdatedBy: userId
      });
    } else {
      sitemap.download = filePath;
      sitemap.lastUpdatedBy = userId;
    }
    
    await sitemap.save();
    
    res.status(200).json({
      message: 'Sitemap generated successfully',
      data: sitemap
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({
      message: 'Server error while generating sitemap',
      error: error.message
    });
  }
};