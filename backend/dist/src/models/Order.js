import { Schema, model } from 'mongoose';
const orderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    items: [{
            product: { type: Schema.Types.ObjectId, ref: 'Product' },
            sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
            name: String,
            image: String,
            price: Number,
            quantity: Number
        }],
    shippingAddress: {
        name: String, line1: String, line2: String,
        city: String, state: String, postalCode: String, country: String, phone: String
    },
    paymentMethod: { type: String, enum: ['card', 'paypal', 'cod'] },
    subtotal: Number,
    shippingCost: Number,
    tax: Number,
    total: Number,
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    sellerOrdersStatus: {
        type: Map,
        of: String,
        default: {}
    },
    promoCode: String,
    discountAmount: { type: Number, default: 0 }
}, { timestamps: true });
export const Order = model('Order', orderSchema);
//# sourceMappingURL=Order.js.map