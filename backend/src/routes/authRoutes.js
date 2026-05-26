import express from 'express';
import {
  register, login, getMe, updateProfile, changePassword,
  forgotPassword, resetPassword, toggleWishlist, addAddress, deleteAddress
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.put('/me', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.post('/addresses', protect, addAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
export default router;
