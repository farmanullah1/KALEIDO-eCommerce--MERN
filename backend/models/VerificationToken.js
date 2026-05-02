const mongoose = require('mongoose');

const VerificationTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  type: { type: String, enum: ['email_verification', 'password_reset'], required: true },
  expiresAt: { type: Date, default: () => Date.now() + 3600000 } // 1 hour expiry
});

// Auto-delete after expiresAt
VerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('VerificationToken', VerificationTokenSchema);
