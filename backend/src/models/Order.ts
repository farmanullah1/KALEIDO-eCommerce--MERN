import { Schema, model, Document } from 'mongoose';

export interface IOrder extends Document {
  user: Schema.Types.ObjectId;
  items: {
    product: Schema.Types.ObjectId;
    sellerId: Schema.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: {
    name: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentMethod: 'card' | 'paypal' | 'cod';
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  promoCode?: string;
  discountAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  user:     { type: Schema.Types.ObjectId, ref: 'User' },
  items:    [{
    product:  { type: Schema.Types.ObjectId, ref: 'Product' },
    sellerId: { type: Schema.Types.ObjectId, ref: 'User' },
    name:     String,
    image:    String,
    price:    Number,
    quantity: Number
  }],
  shippingAddress: {
    name: String, line1: String, line2: String,
    city: String, state: String, postalCode: String, country: String, phone: String
  },
  paymentMethod:  { type: String, enum: ['card', 'paypal', 'cod'] },
  subtotal:       Number,
  shippingCost:   Number,
  tax:            Number,
  total:          Number,
  status:         { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
  promoCode:      String,
  discountAmount: { type: Number, default: 0 }
}, { timestamps: true });

export const Order = model<IOrder>('Order', orderSchema);
