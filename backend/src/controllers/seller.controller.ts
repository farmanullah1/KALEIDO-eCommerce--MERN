import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get seller products
// @route   GET /api/seller/products
// @access  Private/Seller
export const getSellerProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({ sellerId: req.user._id });
  res.json(successResponse(products));
});

// @desc    Get seller orders
// @route   GET /api/seller/orders
// @access  Private/Seller
export const getSellerOrders = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.user._id;
  
  // Find orders that contain items from this seller
  const orders = await Order.find({
    'items.sellerId': sellerId
  })
  .populate('user', 'name email')
  .sort({ createdAt: -1 });

  // Map orders to include seller-specific data
  const sellerOrders = orders.map(order => {
    const sellerItems = order.items.filter(item => item.sellerId.toString() === sellerId.toString());
    const sellerSubtotal = sellerItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    
    // Get the status for this specific seller
    const status = order.sellerOrdersStatus?.get(sellerId.toString()) || order.status;

    return {
      ...order.toObject(),
      items: sellerItems,
      sellerSubtotal,
      status // Use seller-specific status if available
    };
  });

  res.json(successResponse(sellerOrders));
});

// @desc    Update order status (for items from this seller)
// @route   PUT /api/seller/orders/:id/status
// @access  Private/Seller
export const updateSellerOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    // Update the status for this specific seller in the order
    if (!order.sellerOrdersStatus) {
      order.sellerOrdersStatus = new Map();
    }
    order.sellerOrdersStatus.set(req.user._id.toString(), status);
    
    // Optional: If all sellers marked as delivered, mark main order as delivered
    // For now, let's just keep it simple.
    
    await order.save();
    res.json(successResponse(order, 'Order status updated successfully'));
  } else {
    res.status(404).json(errorResponse('Order not found'));
  }
});

// @desc    Get seller dashboard stats
// @route   GET /api/seller/dashboard
// @access  Private/Seller
export const getSellerStats = asyncHandler(async (req: Request, res: Response) => {
  const sellerId = req.user._id;

  const totalProducts = await Product.countDocuments({ sellerId });
  const activeProducts = await Product.countDocuments({ sellerId, moderationStatus: 'active' });
  const pendingProducts = await Product.countDocuments({ sellerId, moderationStatus: 'pending' });

  const orders = await Order.find({ 'items.sellerId': sellerId }).sort({ createdAt: -1 });

  let totalEarnings = 0;
  orders.forEach(order => {
    order.items.forEach(item => {
      if (item.sellerId.toString() === sellerId.toString()) {
        totalEarnings += item.price * item.quantity;
      }
    });
  });

  // Mock sales data for the chart (last 7 days)
  const salesData = [
    { name: 'Mon', sales: 4000 },
    { name: 'Tue', sales: 3000 },
    { name: 'Wed', sales: 2000 },
    { name: 'Thu', sales: 2780 },
    { name: 'Fri', sales: 1890 },
    { name: 'Sat', sales: 2390 },
    { name: 'Sun', sales: 3490 },
  ];

  const recentOrders = orders.slice(0, 5);

  res.json(successResponse({
    totalEarnings,
    activeProducts,
    pendingProducts,
    totalProducts,
    storeHealth: '98%',
    salesData,
    recentOrders
  }));
});

// @desc    Update seller settings
// @route   PUT /api/seller/settings
// @access  Private/Seller
export const updateSellerSettings = asyncHandler(async (req: Request, res: Response) => {
  const { shopName, shopDescription, gstNumber, returnPolicy } = req.body;
  const user = await req.user; // Actually req.user is already there

  if (user) {
    user.sellerInfo = {
      ...user.sellerInfo,
      shopName: shopName || user.sellerInfo?.shopName,
      shopDescription: shopDescription || user.sellerInfo?.shopDescription,
      gstNumber: gstNumber || (user.sellerInfo as any)?.gstNumber,
      returnPolicy: returnPolicy || (user.sellerInfo as any)?.returnPolicy,
    };

    await user.save();
    res.json(successResponse(user, 'Settings updated successfully'));
  } else {
    res.status(404).json(errorResponse('User not found'));
  }
});
