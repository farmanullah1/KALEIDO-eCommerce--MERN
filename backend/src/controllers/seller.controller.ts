import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { successResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get seller dashboard statistics
// @route   GET /api/seller/stats
// @access  Private/Seller
export const getSellerStats = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.user._id;

  const sellerOrders = await Order.find({
    'items.sellerId': sellerId
  }).sort({ createdAt: -1 });

  let totalEarnings = 0;
  sellerOrders.forEach(order => {
    if (order.status === 'delivered') {
      order.items.forEach(item => {
        if (item.sellerId.toString() === sellerId.toString()) {
          totalEarnings += item.price * item.quantity;
        }
      });
    }
  });

  // 2. Product Stats
  const activeProducts = await Product.countDocuments({ sellerId, moderationStatus: 'active' });
  const pendingProducts = await Product.countDocuments({ sellerId, moderationStatus: 'pending' });

  // 4. Sales Data (Last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const weeklyOrders = await Order.find({
    'items.sellerId': sellerId,
    createdAt: { $gte: sevenDaysAgo }
  });

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const salesMap: any = {};
  
  // Initialize map
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    salesMap[days[d.getDay()]] = 0;
  }

  weeklyOrders.forEach(order => {
    const day = days[new Date(order.createdAt).getDay()];
    order.items.forEach(item => {
      if (item.sellerId.toString() === sellerId.toString()) {
        salesMap[day] += item.price * item.quantity;
      }
    });
  });

  const salesData = Object.keys(salesMap).map(day => ({
    name: day,
    sales: salesMap[day]
  })).reverse();

  res.json(successResponse({
    totalEarnings,
    activeProducts,
    pendingProducts,
    recentOrders,
    storeHealth: totalEarnings > 1000 ? 'Celestial' : 'Optimal',
    salesData
  }));
});
