import { Request, Response } from 'express';
import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req: Request, res: Response) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json(successResponse(cart));
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json(errorResponse('Product not found'));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += (quantity || 1);
  } else {
    cart.items.push({
      product: productId as any,
      quantity: quantity || 1,
      price: product.price
    });
  }

  await cart.save();
  res.json(successResponse(cart, 'Item added to cart'));
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { quantity } = req.body;
  const itemId = req.params.itemId;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json(errorResponse('Cart not found'));
  }

  const itemIndex = cart.items.findIndex(item => (item as any)._id.toString() === itemId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.json(successResponse(cart, 'Cart updated'));
  } else {
    res.status(404).json(errorResponse('Item not found in cart'));
  }
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.params.itemId;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json(errorResponse('Cart not found'));
  }

  cart.items = cart.items.filter(item => (item as any)._id.toString() !== itemId);
  
  await cart.save();
  res.json(successResponse(cart, 'Item removed from cart'));
});

// @desc    Apply promo code
// @route   POST /api/cart/promo
// @access  Private
export const applyPromoCode = asyncHandler(async (req: Request, res: Response) => {
  const { code } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json(errorResponse('Cart not found'));
  }

  const coupon = await Coupon.findOne({ code, isActive: true });

  if (!coupon) {
    return res.status(404).json(errorResponse('Invalid or inactive promo code'));
  }

  if (new Date() > coupon.expiryDate) {
    return res.status(400).json(errorResponse('Promo code has expired'));
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json(errorResponse('Promo code limit reached'));
  }

  const cartTotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartTotal < coupon.minPurchaseAmount) {
    return res.status(400).json(errorResponse(`Minimum purchase of $${coupon.minPurchaseAmount} required`));
  }

  cart.promoCode = coupon.code;
  
  if (coupon.discountType === 'percentage') {
    cart.discountPct = coupon.discountAmount;
  } else {
    // For fixed amount, we store it differently or convert to effective percentage
    // For simplicity, let's assume discountPct is what we use, or add a discountAmount field
    // I'll stick to percentage for now or update the cart model.
    // Let's assume we use percentage for now as per ICart interface.
    cart.discountPct = Math.round((coupon.discountAmount / cartTotal) * 100);
  }

  await cart.save();
  res.json(successResponse(cart, `Promo applied: ${coupon.discountAmount}${coupon.discountType === 'percentage' ? '%' : '$'} discount`));
});
