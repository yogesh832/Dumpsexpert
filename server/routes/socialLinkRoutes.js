const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const { getAllSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } = require('../controllers/socialLinkController');
const auth = require('../middlewares/authMiddleware');

const upload = multer({ storage });

// GET all SocialLinks
router.get('/', getAllSocialLinks);

// CREATE a SocialLink
router.post('/', auth, upload.single('socialIcon'), createSocialLink);

// UPDATE a SocialLink
router.put('/:id', auth, upload.single('socialIcon'), updateSocialLink);

// DELETE a SocialLink
router.delete('/:id', auth, deleteSocialLink);

module.exports = router;