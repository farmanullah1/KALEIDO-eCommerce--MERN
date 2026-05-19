import { Schema, model } from 'mongoose';
const couponSchema = new Schema({
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discountAmount: { type: Number, required: true },
    minPurchaseAmount: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});
export const Coupon = model('Coupon', couponSchema);
//# sourceMappingURL=Coupon.js.map