import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createCoupon = asyncHandler(async (req: Request, res: Response) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, data: coupon });
});

export const validateCoupon = asyncHandler(async (req: Request, res: Response) => {
  const { code, cartTotal } = req.body;
  
  const coupon = await Coupon.findOne({ code, isActive: true });

  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
  }

  if (new Date() > coupon.expiryDate) {
    return res.status(400).json({ success: false, message: 'Coupon has expired' });
  }

  if (coupon.usedCount >= coupon.usageLimit) {
    return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
  }

  if (cartTotal < coupon.minPurchaseAmount) {
    return res.status(400).json({ success: false, message: `Minimum purchase of $${coupon.minPurchaseAmount} required` });
  }

  res.status(200).json({ 
    success: true, 
    data: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountAmount: coupon.discountAmount
    }
  });
});

export const getAllCoupons = asyncHandler(async (req: Request, res: Response) => {
  const coupons = await Coupon.find();
  res.status(200).json({ success: true, data: coupons });
});
