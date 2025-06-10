// utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'basic-info',
    allowed_formats: ['jpg', 'jpeg', 'png', 'svg', 'ico'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

const parser = multer({ storage: storage });

const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

module.exports = { parser, cloudinary, deleteFromCloudinary };