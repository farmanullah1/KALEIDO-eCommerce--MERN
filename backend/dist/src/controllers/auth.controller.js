import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
    console.log('🚀 Registration started for:', req.body.email);
    try {
        const { name, email, password, role, sellerInfo } = req.body;
        console.log('🔍 Checking if user exists...');
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('❌ User already exists');
            return res.status(400).json(errorResponse('User already exists'));
        }
        console.log('🔑 Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log('✅ Password hashed');
        const userData = {
            name,
            email,
            passwordHash,
            role: role || 'buyer',
        };
        if (role === 'seller' && sellerInfo) {
            console.log('🏪 Adding seller info...');
            userData.sellerInfo = {
                shopName: sellerInfo.shopName,
                shopDescription: sellerInfo.shopDescription || '',
                shopLogo: sellerInfo.shopLogo || '',
                banner: sellerInfo.banner || '',
                gstNumber: sellerInfo.gstNumber || '',
                socialLinks: sellerInfo.socialLinks || {},
                isApproved: false,
            };
        }
        console.log('💾 Creating user in DB...');
        const user = await User.create(userData);
        console.log('✅ User created with ID:', user._id);
        if (user) {
            console.log('🎟️ Generating tokens...');
            const accessToken = generateAccessToken(user._id.toString());
            const refreshToken = generateRefreshToken(user._id.toString());
            user.refreshToken = refreshToken;
            await user.save();
            console.log('✅ Tokens generated and saved');
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            console.log('✨ Registration complete!');
            res.status(201).json(successResponse({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                accessToken,
            }, 'User registered successfully'));
        }
        else {
            console.log('❌ Failed to create user object');
            res.status(400).json(errorResponse('Invalid user data'));
        }
    }
    catch (error) {
        console.error('🔥 CRITICAL REGISTRATION ERROR:', error);
        res.status(500).json(errorResponse('Internal Server Error during registration', error.message));
    }
});
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
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
    }
    else {
        res.status(401).json(errorResponse('Invalid email or password'));
    }
});
// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
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
export const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (user) {
        res.json(successResponse(user));
    }
    else {
        res.status(404).json(errorResponse('User not found'));
    }
});
// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshAccessToken = asyncHandler(async (req, res) => {
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
        if (decoded.id !== user._id.toString()) {
            return res.status(401).json(errorResponse('Invalid refresh token'));
        }
        const accessToken = generateAccessToken(user._id.toString());
        res.json(successResponse({ accessToken }, 'Token refreshed successfully'));
    }
    catch (error) {
        res.status(401).json(errorResponse('Refresh token expired or invalid'));
    }
});
// @desc    Upgrade user to seller
// @route   POST /api/auth/upgrade
// @access  Private
export const upgradeToSeller = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json(errorResponse('User not found'));
    }
    if (user.role === 'seller' || user.role === 'admin') {
        return res.status(400).json(errorResponse('User is already a seller or admin'));
    }
    const { shopName, shopDescription, gstNumber, socialLinks, banner } = req.body;
    user.role = 'seller';
    user.sellerInfo = {
        shopName: shopName || `${user.name}'s Shop`,
        shopDescription: shopDescription || '',
        gstNumber: gstNumber || '',
        socialLinks: socialLinks || {},
        banner: banner || '',
        isApproved: false,
    };
    await user.save();
    res.json(successResponse({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    }, 'Successfully upgraded to seller'));
});
//# sourceMappingURL=auth.controller.js.map