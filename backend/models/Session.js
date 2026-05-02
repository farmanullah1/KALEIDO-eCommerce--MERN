const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  sessionToken: { type: String, unique: true, required: true },
  anchorId: { type: String, required: true },
  deviceInfo: { type: String },
  createdAt: { type: Date, default: Date.now, expires: '7d' }, // TTL index for 7 days
  lastPingAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', SessionSchema);
