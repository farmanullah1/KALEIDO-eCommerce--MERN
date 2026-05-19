import { Router } from 'express';
import { 
  getSellerProducts, 
  getSellerOrders, 
  updateSellerOrderStatus,
  getSellerStats,
  updateSellerSettings
} from '../controllers/seller.controller.js';
import { protect, seller } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.use(seller);

router.get('/dashboard', getSellerStats);
router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);
router.put('/orders/:id/status', updateSellerOrderStatus);
router.put('/settings', updateSellerSettings);

export default router;
