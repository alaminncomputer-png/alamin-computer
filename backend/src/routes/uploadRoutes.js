import express from 'express';
import { upload } from '../config/cloudinary.js';
import { protect, admin } from '../middleware/auth.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();
router.post('/product-image', protect, admin, upload.array('images', 5), (req, res) => {
  const images = req.files.map(f => ({ url: f.path, publicId: f.filename }));
  res.json({ images });
});
router.delete('/product-image', protect, admin, async (req, res) => {
  const { publicId } = req.body;
  await cloudinary.uploader.destroy(publicId);
  res.json({ message: 'Image deleted' });
});
export default router;
