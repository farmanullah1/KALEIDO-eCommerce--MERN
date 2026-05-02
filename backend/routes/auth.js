const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const Session = require('../models/Session');
const VerificationToken = require('../models/VerificationToken');
const emailService = require('../services/emailService');

// Helper: Get crystal color based on hour
const getCrystalSpecs = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 10) return { color: 'dawn', hex: '#FF00FF' }; // Hot Magenta
  if (hour >= 10 && hour < 17) return { color: 'day', hex: '#F5A97F' };  // Coral Ember
  if (hour >= 17 && hour < 21) return { color: 'dusk', hex: '#C8BFFF' }; // Neon Violet
  return { color: 'night', hex: '#00ECFB' }; // Cyber Cyan
};

// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { message: "The vault is locked. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware: Auth check
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No drift detected. (No token)" });
  
  const session = await Session.findOne({ sessionToken: token });
  if (!session) return res.status(401).json({ message: "Your drift expired. Anchor again?" });
  
  const user = await User.findOne({ anchorId: session.anchorId });
  if (!user) return res.status(404).json({ message: "Anchor lost in the void." });
  
  req.user = user;
  req.session = session;
  next();
};

// Signup Initiate
router.post('/signup/initiate', async (req, res) => {
  const { email, password } = req.body;
  
  // Basic validation
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ message: "Invalid echoes. Check email and password strength." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) return res.status(409).json({ message: "This anchor is already claimed" });

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  const { color, hex } = getCrystalSpecs();
  
  const newUser = new User({
    anchorId: uuidv4(),
    email,
    passwordHash,
    anchorCrystalColor: color,
    crystalHexCode: hex
  });

  await newUser.save();

  // Create verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await VerificationToken.create({
    email,
    token: code,
    type: 'email_verification'
  });

  await emailService.sendVerificationEmail(email, code, color);

  res.status(201).json({ 
    success: true, 
    anchorId: newUser.anchorId, 
    crystalColor: color, 
    crystalHexCode: hex,
    message: "Threshold portal ready" 
  });
});

// Signup Verify
router.post('/signup/verify', async (req, res) => {
  const { email, verificationCode } = req.body;
  
  const tokenRecord = await VerificationToken.findOne({ email, token: verificationCode, type: 'email_verification' });
  if (!tokenRecord) return res.status(401).json({ message: "The key does not fit this lock" });

  const user = await User.findOne({ email });
  user.emailVerified = true;
  await user.save();
  await VerificationToken.deleteOne({ _id: tokenRecord._id });

  const sessionToken = uuidv4();
  await Session.create({ sessionToken, anchorId: user.anchorId });
  await emailService.sendWelcomeEmail(email, user.anchorCrystalColor);

  res.json({ 
    success: true, 
    sessionToken, 
    anchorCrystalColor: user.anchorCrystalColor, 
    message: "Anchored. Welcome." 
  });
});

// Login
router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Echoes mismatched. (Wrong credentials)" });
  }

  if (!user.emailVerified) {
    return res.status(403).json({ message: "This anchor is not yet sealed. Check your echoes (email)." });
  }

  const sessionToken = uuidv4();
  await Session.create({ sessionToken, anchorId: user.anchorId });
  
  user.lastActiveAt = Date.now();
  await user.save();

  res.json({
    success: true,
    sessionToken,
    anchorCrystalColor: user.anchorCrystalColor,
    crystalHexCode: user.crystalHexCode,
    anchorCrystalTier: user.anchorCrystalTier,
    isSeller: user.isSeller
  });
});

// Logout
router.post('/logout', auth, async (req, res) => {
  await Session.deleteOne({ sessionToken: req.session.sessionToken });
  res.json({ success: true, message: "Drift ended. Anchor sleeping." });
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  
  // Security: always return success
  if (user) {
    const token = uuidv4().replace(/-/g, '');
    await VerificationToken.create({
      email,
      token,
      type: 'password_reset'
    });
    await emailService.sendPasswordResetEmail(email, token);
  }

  res.json({ success: true, message: "If this anchor exists, a key has been sent." });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  
  const tokenRecord = await VerificationToken.findOne({ token, type: 'password_reset' });
  if (!tokenRecord || tokenRecord.expiresAt < Date.now()) {
    return res.status(401).json({ message: "This key has crumbled. Request a new one." });
  }

  const user = await User.findOne({ email: tokenRecord.email });
  const salt = await bcrypt.genSalt(12);
  user.passwordHash = await bcrypt.hash(newPassword, salt);
  await user.save();

  await Session.deleteMany({ anchorId: user.anchorId });
  await VerificationToken.deleteOne({ _id: tokenRecord._id });

  res.json({ success: true, message: "Vault resealed. Log in with your new key." });
});

// Get Me
router.get('/me', auth, async (req, res) => {
  const { passwordHash, ...safeUser } = req.user.toObject();
  res.json(safeUser);
});

// Update Preferences
router.put('/me/preferences', auth, async (req, res) => {
  const { motionReduction, highContrast, textScaling } = req.body;
  if (motionReduction !== undefined) req.user.preferences.motionReduction = motionReduction;
  if (highContrast !== undefined) req.user.preferences.highContrast = highContrast;
  if (textScaling !== undefined) req.user.preferences.textScaling = textScaling;
  
  await req.user.save();
  res.json(req.user.preferences);
});

// Delete Account
router.delete('/me', auth, async (req, res) => {
  if (req.headers['x-confirm'] !== 'permanently erase') {
    return res.status(400).json({ message: "The void requires explicit confirmation." });
  }

  req.user.deletedAt = Date.now();
  req.user.email = `deleted_${req.user.anchorId}@kaleido.void`;
  await req.user.save();
  
  await Session.deleteMany({ anchorId: req.user.anchorId });
  res.json({ success: true, message: "Your echoes have faded. The forge remembers nothing." });
});

module.exports = router;
