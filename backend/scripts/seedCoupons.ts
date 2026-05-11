import mongoose from 'mongoose';
import { Coupon } from '../src/models/Coupon.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const coupons = [
  {
    code: 'KALEIDO10',
    discountType: 'percentage',
    discountAmount: 10,
    minPurchaseAmount: 50,
    expiryDate: new Date('2026-12-31'),
    isActive: true,
    usageLimit: 100
  },
  {
    code: 'WELCOME25',
    discountType: 'percentage',
    discountAmount: 25,
    minPurchaseAmount: 100,
    expiryDate: new Date('2026-12-31'),
    isActive: true,
    usageLimit: 50
  },
  {
    code: 'CYBER50',
    discountType: 'fixed',
    discountAmount: 50,
    minPurchaseAmount: 200,
    expiryDate: new Date('2026-12-31'),
    isActive: true,
    usageLimit: 10
  }
];

const seedCoupons = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to Dimension DB');

    await Coupon.deleteMany();
    await Coupon.insertMany(coupons);

    console.log('✅ Coupons manifested in the database');
    process.exit();
  } catch (error) {
    console.error('Error seeding coupons:', error);
    process.exit(1);
  }
};

seedCoupons();
