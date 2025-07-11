const SocialLink = require('../models/socialLinkSchema');

// GET all links
exports.getLinks = async (req, res) => {
  try {
    const links = await SocialLink.find();
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch links' });
  }
};

// POST new link
exports.addLink = async (req, res) => {
  try {
    const { icon, url } = req.body;
    if (!icon || !url) {
      return res.status(400).json({ error: 'Icon and URL are required' });
    }
    const newLink = new SocialLink({ icon, url });
    await newLink.save();
    res.status(201).json(newLink);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add link' });
  }
};

// DELETE link
exports.deleteLink = async (req, res) => {
  try {
    await SocialLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Link deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete link' });
  }
};

// UPDATE link (optional, not used yet)
exports.updateLink = async (req, res) => {
  try {
    const { icon, url } = req.body;
    const updated = await SocialLink.findByIdAndUpdate(
      req.params.id,
      { icon, url },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update link' });
  }
};
