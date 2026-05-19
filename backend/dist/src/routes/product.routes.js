import { Router } from 'express';
import { getProducts, getFeaturedProducts, getProductById, createProduct, updateProduct, deleteProduct, getSellerProducts, updateProductModeration, createProductReview, getCategories } from '../controllers/product.controller.js';
import { protect, seller, admin } from '../middleware/auth.middleware.js';
const router = Router();
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/seller', protect, seller, getSellerProducts);
router.get('/:id', getProductById);
router.post('/', protect, seller, createProduct);
router.put('/:id', protect, updateProduct); // Middleware inside handles seller/admin check
router.delete('/:id', protect, deleteProduct); // Middleware inside handles seller/admin check
router.put('/:id/moderation', protect, admin, updateProductModeration);
router.post('/:id/reviews', protect, createProductReview);
export default router;
//# sourceMappingURL=product.routes.js.map