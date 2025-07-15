const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require("dotenv");

dotenv.config();

// Validate required Cloudinary environment variables
const hasCloudinaryCreds =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (!hasCloudinaryCreds) {
  console.warn(
    "⚠️  CLOUDINARY_* environment variables are missing. " +
      "Falling back to local disk storage for uploads.",
    {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    }
  );
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Choose appropriate storage engine based on env availability
let storage;

if (hasCloudinaryCreds) {
  // ✅ Use Cloudinary if credentials are present
  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "basic-info",
      allowed_formats: ["jpg", "jpeg", "png"],
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    },
  });
} else {
  // 🗄️  Fallback to local disk storage to prevent runtime errors
  const path = require("path");
  const fs = require("fs");

  // Ensure uploads directory exists
  const uploadsDir = path.join(__dirname, "../uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

  storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, uploadsDir),
    filename: (_, file, cb) => {
      const ext = path.extname(file.originalname);
      const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, name);
    },
  });
}

const parser = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Delete helper only relevant when Cloudinary is configured
const deleteFromCloudinary = async (public_id) => {
  if (!hasCloudinaryCreds) return; // Skip when not using Cloudinary
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    console.error("Cloudinary Deletion Error:", err.message);
  }
};

module.exports = { parser, cloudinary, deleteFromCloudinary };
