const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const { getAllSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink } = require('../controllers/socialLinkController');
const { authMiddleware } = require('../middlewares/authMiddleware');

const upload = multer({ storage });

// GET all SocialLinks
router.get('/', getAllSocialLinks);
router.post('/', authMiddleware, upload.single('socialIcon'), createSocialLink);
router.put('/:id', authMiddleware, upload.single('socialIcon'), updateSocialLink);
router.delete('/:id', authMiddleware, deleteSocialLink);

module.exports = router;