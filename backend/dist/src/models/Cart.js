import { Schema, model } from 'mongoose';
const cartSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [{
            product: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1, min: 1, max: 99 },
            price: Number
        }],
    promoCode: String,
    discountPct: { type: Number, default: 0 }
}, { timestamps: true });
export const Cart = model('Cart', cartSchema);
//# sourceMappingURL=Cart.js.map