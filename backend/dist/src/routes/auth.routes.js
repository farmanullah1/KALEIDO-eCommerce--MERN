import { Router } from 'express';
import { registerUser, loginUser, logoutUser, getUserProfile, refreshAccessToken, upgradeToSeller } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authRateLimit } from '../middleware/rateLimit.middleware.js';
const router = Router();
router.post('/register', authRateLimit, registerUser);
router.post('/login', authRateLimit, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getUserProfile);
router.post('/refresh', refreshAccessToken);
router.post('/upgrade', protect, upgradeToSeller);
export default router;
//# sourceMappingURL=auth.routes.js.map