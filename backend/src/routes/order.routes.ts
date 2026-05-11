import { Router } from 'express';
import { 
  createOrder, 
  getOrderById, 
  getMyOrders,
  getSellerOrders
} from '../controllers/order.controller.js';
import { protect, seller } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect); // All order routes are protected

router.post('/', createOrder);
router.get('/mine', getMyOrders);
router.get('/seller', seller, getSellerOrders);
router.get('/:id', getOrderById);

export default router;
