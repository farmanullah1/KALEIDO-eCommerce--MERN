import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyRefreshToken 
} from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json(errorResponse('User already exists'));
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  if (user) {
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json(successResponse({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    }, 'User registered successfully'));
  } else {
    res.status(400).json(errorResponse('Invalid user data'));
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json(successResponse({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      accessToken,
    }, 'Login successful'));
  } else {
    res.status(401).json(errorResponse('Invalid email or password'));
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.json(successResponse(null, 'Logged out successfully'));
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id).select('-passwordHash');

  if (user) {
    res.json(successResponse(user));
  } else {
    res.status(404).json(errorResponse('User not found'));
  }
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json(errorResponse('No refresh token provided'));
  }

  const user = await User.findOne({ refreshToken });

  if (!user) {
    return res.status(401).json(errorResponse('Invalid refresh token'));
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    if (decoded.id !== (user._id as any).toString()) {
      return res.status(401).json(errorResponse('Invalid refresh token'));
    }

    const accessToken = generateAccessToken(user._id.toString());
    res.json(successResponse({ accessToken }, 'Token refreshed successfully'));
  } catch (error) {
    res.status(401).json(errorResponse('Refresh token expired or invalid'));
  }
});

// @desc    Upgrade user to seller
// @route   POST /api/auth/upgrade
// @access  Private
export const upgradeToSeller = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json(errorResponse('User not found'));
  }

  if (user.role === 'seller' || user.role === 'admin') {
    return res.status(400).json(errorResponse('User is already a seller or admin'));
  }

  user.role = 'seller';
  await user.save();

  res.json(successResponse({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }, 'Successfully upgraded to seller'));
});
