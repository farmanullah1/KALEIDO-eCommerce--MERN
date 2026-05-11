import { Router } from 'express';
import { 
  getProducts, 
  getFeaturedProducts, 
  getProductById 
} from '../controllers/product.controller.js';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);

export default router;
