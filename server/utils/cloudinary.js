const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// console.log('Cloudinary ENV:', {
//   CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
//   CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
//   CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
// });


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'basic-info',
    allowed_formats: ['jpg', 'jpeg', 'png', 'svg', 'ico'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

const parser = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Optional: 2MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/x-icon'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});


const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error('❌ Cloudinary deletion error:', error.message || error);
  }
};

module.exports = { parser, cloudinary, deleteFromCloudinary };
