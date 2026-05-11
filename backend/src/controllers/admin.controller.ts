import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { successResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = asyncHandler(async (req: Request, res: Response) => {
  const totalUsers = await User.countDocuments();
  const totalSellers = await User.countDocuments({ role: 'seller' });
  const totalProducts = await Product.countDocuments();
  const pendingProducts = await Product.countDocuments({ moderationStatus: 'pending' });
  
  const orders = await Order.find();
  const totalRevenue = orders.reduce((acc, order) => acc + (order.total || 0), 0);

  res.json(successResponse({
    totalUsers,
    totalSellers,
    totalProducts,
    pendingProducts,
    totalRevenue,
    revenueData: [
      { name: 'Jan', revenue: 4000 },
      { name: 'Feb', revenue: 3000 },
      { name: 'Mar', revenue: 5000 },
      { name: 'Apr', revenue: 4500 },
      { name: 'May', revenue: 6000 },
      { name: 'Jun', revenue: 7000 },
    ]
  }));
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find().select('-passwordHash');
  res.json(successResponse(users));
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.body;

  if (!['user', 'seller', 'admin'].includes(role)) {
    return res.status(400).json(errorResponse('Invalid role'));
  }

  const user = await User.findById(req.params.id);

  if (user) {
    user.role = role;
    await user.save();
    res.json(successResponse(user, `User role updated to ${role}`));
  } else {
    res.status(404).json(errorResponse('User not found'));
  }
});
