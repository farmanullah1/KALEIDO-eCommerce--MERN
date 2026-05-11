import { Schema, model } from 'mongoose';
const productSchema = new Schema({
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    description: String,
    price: { type: Number, required: true },
    comparePrice: Number,
    category: { type: String, enum: ['electronics', 'fashion', 'home-decor', 'beauty', 'sports'] },
    subcategory: String,
    brand: String,
    stock: { type: Number, default: 0 },
    images: [String],
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});
export const Product = model('Product', productSchema);
//# sourceMappingURL=Product.js.map