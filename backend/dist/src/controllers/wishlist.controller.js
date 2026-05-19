import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const getWishlist = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user.wishlist });
});
export const toggleWishlist = asyncHandler(async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    const index = user.wishlist.indexOf(productId);
    if (index === -1) {
        user.wishlist.push(productId);
    }
    else {
        user.wishlist.splice(index, 1);
    }
    await user.save();
    const updatedUser = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({
        success: true,
        data: updatedUser?.wishlist,
        message: index === -1 ? 'Added to wishlist' : 'Removed from wishlist'
    });
});
//# sourceMappingURL=wishlist.controller.js.map