import { Router } from 'express';
import { createCoupon, validateCoupon, getAllCoupons } from '../controllers/coupon.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/validate', protect, validateCoupon);

// Admin only routes
router.post('/', protect, admin, createCoupon);
router.get('/', protect, admin, getAllCoupons);

export default router;
