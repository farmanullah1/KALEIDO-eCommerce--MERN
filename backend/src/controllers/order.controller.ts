import { Request, Response } from 'express';
import { Order } from '../models/Order.js';
import { Cart } from '../models/Cart.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { shippingAddress, paymentMethod } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json(errorResponse('No items in cart'));
  }

  const items = cart.items.map(item => ({
    product: item.product,
    sellerId: (item.product as any).sellerId,
    name: (item.product as any).name,
    image: (item.product as any).images[0],
    price: item.price,
    quantity: item.quantity
  }));

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = (subtotal * cart.discountPct) / 100;
  const shippingCost = subtotal > 50 ? 0 : 4.99;
  const tax = (subtotal - discountAmount) * 0.085;
  const total = subtotal - discountAmount + shippingCost + tax;

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingCost,
    tax,
    total,
    promoCode: cart.promoCode,
    discountAmount
  });

  // Clear cart
  cart.items = [];
  cart.promoCode = undefined;
  cart.discountPct = 0;
  await cart.save();

  res.status(201).json(successResponse(order, 'Order placed successfully'));
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    // Check if user is owner or admin
    if ((order.user as any)._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json(errorResponse('Not authorized to view this order'));
    }
    res.json(successResponse(order));
  } else {
    res.status(404).json(errorResponse('Order not found'));
  }
});

// @desc    Get orders for a specific seller
// @route   GET /api/orders/seller
// @access  Private/Seller
export const getSellerOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ 'items.sellerId': req.user._id })
    .populate('user', 'name email')
    .sort('-createdAt');

  // Filter items in each order to only show those belonging to the seller
  const sellerOrders = orders.map(order => {
    const filteredItems = order.items.filter(item => item.sellerId.toString() === req.user._id.toString());
    const sellerSubtotal = filteredItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    
    return {
      ...order.toObject(),
      items: filteredItems,
      sellerSubtotal
    };
  });

  res.json(successResponse(sellerOrders));
});

// @desc    Get logged in user orders
// @route   GET /api/orders/mine
// @access  Private
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json(successResponse(orders));
});
