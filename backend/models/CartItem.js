const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CartItem', CartItemSchema);
