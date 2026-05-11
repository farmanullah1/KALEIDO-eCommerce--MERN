import { Schema, model, Document } from 'mongoose';

export interface ICartItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ICart extends Document {
  user: Schema.Types.ObjectId;
  items: ICartItem[];
  promoCode?: string;
  discountPct: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>({
  user:  { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{
    product:  { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1, min: 1, max: 99 },
    price:    Number
  }],
  promoCode:    String,
  discountPct:  { type: Number, default: 0 }
}, { timestamps: true });

export const Cart = model<ICart>('Cart', cartSchema);
