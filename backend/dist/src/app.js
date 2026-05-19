import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { globalErrorHandler } from './middleware/error.middleware.js';
// Import routes
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import cartRoutes from './routes/cart.routes.js';
import orderRoutes from './routes/order.routes.js';
import sellerRoutes from './routes/seller.routes.js';
import adminRoutes from './routes/admin.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import path from 'path';
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: env.CLIENT_URL,
    credentials: true,
}));
// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to KALEIDO API' });
});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/upload', uploadRoutes);
// Error Handler
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map