const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const CartItem = require('./models/CartItem');

const app = express();
const PORT = process.env.PORT || 5001; // Changed to 5001 to avoid potential conflicts

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kaleido')
  .then(() => console.log('Connected to KALEIDO MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/cart', async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID is required' });
    
    const newItem = new CartItem({ productId });
    await newItem.save();
    
    res.status(201).json({ message: 'Product added to cart', item: newItem });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    const items = await CartItem.find().sort({ addedAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`KALEIDO API running on http://0.0.0.0:${PORT}`);
});
