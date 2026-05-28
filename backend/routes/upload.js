const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { protect, adminOnly } = require('../middleware/auth');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage for multer (upload buffer to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
});

// Upload helper
const uploadToCloudinary = (buffer, folder = 'alamin-computer') => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        transformation: [
          { width: 1200, height: 900, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });
};

// ── Upload Single Image ────────────────────────────
router.post('/image', protect, adminOnly, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image provided.');
  }

  const result = await uploadToCloudinary(req.file.buffer, 'alamin-computer/products');

  res.json({
    success: true,
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  });
}));

// ── Upload Multiple Images ─────────────────────────
router.post("/images", upload.array('images', 10), asyncHandler(async (req, res) => {
  if (!req.files?.length) {
    res.status(400);
    throw new Error('No images provided.');
  }

  const uploads = await Promise.all(
    req.files.map(file => uploadToCloudinary(file.buffer, 'alamin-computer/products'))
  );

  res.json({
    success: true,
    images: uploads.map(r => ({ url: r.secure_url, publicId: r.public_id })),
  });
}));

// ── Delete Image ───────────────────────────────────
router.delete('/image', protect, adminOnly, asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) {
    res.status(400);
    throw new Error('Public ID is required.');
  }

  await cloudinary.uploader.destroy(publicId);
  res.json({ success: true, message: 'Image deleted.' });
}));

module.exports = router;
