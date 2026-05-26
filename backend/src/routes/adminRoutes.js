import express from 'express';
import { getDashboard, getUsers, updateUser, getReviews, approveReview, deleteReview } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();
router.use(protect, admin);
router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/reviews', getReviews);
router.put('/reviews/:id/approve', approveReview);
router.delete('/reviews/:id', deleteReview);
export default router;
