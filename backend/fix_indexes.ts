import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kaleido');
    console.log('Connected to DB');

    const db = mongoose.connection.db;
    const collections = await db?.listCollections().toArray();
    
    if (collections?.some(c => c.name === 'users')) {
      console.log('Dropping anchorId_1 index from users collection...');
      await db?.collection('users').dropIndex('anchorId_1');
      console.log('✅ Index dropped successfully');
    }

    process.exit(0);
  } catch (error: any) {
    if (error.message.includes('index not found')) {
      console.log('ℹ️ Index already removed or does not exist');
      process.exit(0);
    }
    console.error('FAILED TO DROP INDEX:', error);
    process.exit(1);
  }
};

fixIndexes();
