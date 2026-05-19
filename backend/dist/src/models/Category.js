import { Schema, model } from 'mongoose';
const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    description: String,
    image: String,
    isActive: { type: Boolean, default: true }
});
categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    next();
});
export const Category = model('Category', categorySchema);
//# sourceMappingURL=Category.js.map