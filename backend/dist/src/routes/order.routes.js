import { Router } from 'express';
import { createOrder, getOrderById, getMyOrders } from '../controllers/order.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router = Router();
router.use(protect); // All order routes are protected
router.post('/', createOrder);
router.get('/mine', getMyOrders);
router.get('/:id', getOrderById);
export default router;
//# sourceMappingURL=order.routes.js.map