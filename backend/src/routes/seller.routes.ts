import { Router } from 'express';
import { getSellerStats } from '../controllers/seller.controller.js';
import { protect, seller } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/stats', protect, seller, getSellerStats);

export default router;
