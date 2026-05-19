import { Router } from 'express';
import { 
  getAllUsers, 
  updateUserByAdmin, 
  deleteUserByAdmin,
  getPendingSellers,
  approveSeller,
  getAdminStats,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/admin.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);
router.use(admin);

router.get('/dashboard', getAdminStats);
router.get('/users', getAllUsers);
router.route('/users/:id')
  .put(updateUserByAdmin)
  .delete(deleteUserByAdmin);

router.get('/sellers/pending', getPendingSellers);
router.put('/sellers/:id/approve', approveSeller);

// Category Management
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
