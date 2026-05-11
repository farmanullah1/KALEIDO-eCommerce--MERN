import { Router } from 'express';
import { 
  getAdminStats, 
  getUsers, 
  updateUserRole 
} from '../controllers/admin.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/stats', protect, admin, getAdminStats);
router.get('/users', protect, admin, getUsers);
router.put('/users/:id/role', protect, admin, updateUserRole);

export default router;
