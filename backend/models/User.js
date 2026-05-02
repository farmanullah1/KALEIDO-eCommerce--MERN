const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  anchorId: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  anchorCrystalColor: { type: String }, // dawn, day, dusk, night
  crystalHexCode: { type: String },
  anchorCrystalTier: { type: String, default: "Drifter" },
  isSeller: { type: Boolean, default: false },
  isGhost: { type: Boolean, default: false },
  emailVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  lastActiveAt: { type: Date, default: Date.now },
  preferences: {
    motionReduction: { type: Boolean, default: false },
    highContrast: { type: Boolean, default: false },
    textScaling: { type: Number, default: 1 }
  },
  deletedAt: { type: Date }
});

module.exports = mongoose.model('User', UserSchema);
