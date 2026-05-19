import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Category } from '../models/Category.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendApprovalEmail, sendRejectionEmail } from '../services/email.service.js';
// ... (existing functions)
// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = asyncHandler(async (req, res) => {
    const { name, description, image } = req.body;
    const category = await Category.create({ name, description, image });
    res.status(201).json(successResponse(category, 'Category integrated into matrix'));
});
// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        category.name = req.body.name || category.name;
        category.description = req.body.description || category.description;
        category.image = req.body.image || category.image;
        await category.save();
        res.json(successResponse(category, 'Node recalibrated'));
    }
    else {
        res.status(404).json(errorResponse('Node not found'));
    }
});
// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
        await category.deleteOne();
        res.json(successResponse(null, 'Node dissolved'));
    }
    else {
        res.status(404).json(errorResponse('Node not found'));
    }
});
// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-passwordHash');
    res.json(successResponse(users));
});
// @desc    Update user role or delete user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUserByAdmin = asyncHandler(async (req, res) => {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (user) {
        user.role = role || user.role;
        const updatedUser = await user.save();
        res.json(successResponse(updatedUser, 'User updated successfully'));
    }
    else {
        res.status(404).json(errorResponse('User not found'));
    }
});
// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUserByAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.role === 'admin') {
            return res.status(400).json(errorResponse('Cannot delete admin user'));
        }
        await user.deleteOne();
        res.json(successResponse(null, 'User deleted successfully'));
    }
    else {
        res.status(404).json(errorResponse('User not found'));
    }
});
// @desc    Get pending sellers
// @route   GET /api/admin/sellers/pending
// @access  Private/Admin
export const getPendingSellers = asyncHandler(async (req, res) => {
    const sellers = await User.find({ role: 'seller', 'sellerInfo.isApproved': false });
    res.json(successResponse(sellers));
});
// @desc    Approve/Reject seller
// @route   PUT /api/admin/sellers/:id/approve
// @access  Private/Admin
export const approveSeller = asyncHandler(async (req, res) => {
    const { isApproved } = req.body;
    const seller = await User.findById(req.params.id);
    if (seller && seller.role === 'seller') {
        if (seller.sellerInfo) {
            seller.sellerInfo.isApproved = isApproved;
            await seller.save();
            // Notify the merchant of the outcome
            if (isApproved) {
                await sendApprovalEmail(seller.email, seller.name, seller.sellerInfo.shopName);
            }
            else {
                await sendRejectionEmail(seller.email, seller.name);
            }
            // Real-time notification via Socket.io
            const io = req.app.get('io');
            if (io) {
                io.to(seller._id.toString()).emit('notification', {
                    type: isApproved ? 'SUCCESS' : 'ERROR',
                    message: isApproved
                        ? 'Neural link established! Your merchant credentials have been authorized.'
                        : 'Neural link terminated. Your merchant application was declined.',
                    timestamp: new Date()
                });
            }
            res.json(successResponse(seller, isApproved ? 'Seller approved' : 'Seller rejected'));
        }
        else {
            res.status(400).json(errorResponse('User does not have seller info'));
        }
    }
    else {
        res.status(404).json(errorResponse('Seller not found'));
    }
});
// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getAdminStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const recentOrders = await Order.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('user', 'name email');
    const recentUsers = await User.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role createdAt');
    res.json(successResponse({
        stats: {
            totalUsers,
            totalSellers,
            totalProducts,
            totalOrders
        },
        recentOrders,
        recentUsers
    }));
});
//# sourceMappingURL=admin.controller.js.map