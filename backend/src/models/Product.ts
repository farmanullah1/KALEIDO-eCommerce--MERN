import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: 'electronics' | 'fashion' | 'home-decor' | 'beauty' | 'sports';
  subcategory: string;
  brand: string;
  stock: number;
  images: string[];
  rating: {
    average: number;
    count: number;
  };
  tags: string[];
  isFeatured: boolean;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>({
  name:        { type: String, required: true },
  slug:        { type: String, unique: true },
  description: String,
  price:       { type: Number, required: true },
  comparePrice:Number,
  category:    { type: String, enum: ['electronics', 'fashion', 'home-decor', 'beauty', 'sports'] },
  subcategory: String,
  brand:       String,
  stock:       { type: Number, default: 0 },
  images:      [String],
  rating: {
    average: { type: Number, default: 0 },
    count:   { type: Number, default: 0 }
  },
  tags:        [String],
  isFeatured:  { type: Boolean, default: false },
  createdAt:   { type: Date, default: Date.now }
});

export const Product = model<IProduct>('Product', productSchema);
