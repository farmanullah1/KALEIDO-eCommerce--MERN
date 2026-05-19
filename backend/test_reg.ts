import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './src/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kaleido');
    console.log('Connected to DB');

    const email = `test_${Date.now()}@test.com`;
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const userData = {
      name: 'Test User',
      email,
      passwordHash,
      role: 'buyer'
    };

    console.log('Creating user...');
    const user = await User.create(userData);
    console.log('User created:', user._id);

    await User.deleteOne({ _id: user._id });
    console.log('User cleaned up');
    process.exit(0);
  } catch (error) {
    console.error('TEST FAILED:', error);
    process.exit(1);
  }
};

test();
