const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const { getSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } = require('../controllers/socialLinkController');
const auth = require('../middlewares/authMiddleware');

// const upload = multer({ storage: storage.params({ folder: 'social_links' }) });

// // GET all SocialLinks
// router.get('/', getSocialLinks);

// CREATE a SocialLink
// router.post('/', auth, upload.single('socialIcon'), createSocialLink);

// UPDATE a SocialLink
// router.put('/:id', auth, upload.single('socialIcon'), updateSocialLink);

// DELETE a SocialLink
// router.delete('/:id', auth, deleteSocialLink);

module.exports = router;