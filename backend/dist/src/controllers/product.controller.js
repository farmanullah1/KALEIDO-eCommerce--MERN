import { Product } from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(req.query.limit) || 12;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.q
        ? {
            name: {
                $regex: req.query.q,
                $options: 'i',
            },
        }
        : {};
    const category = req.query.category ? { category: req.query.category } : {};
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || Infinity;
    const priceFilter = { price: { $gte: minPrice, $lte: maxPrice === Infinity ? 999999 : maxPrice } };
    const sort = {};
    if (req.query.sort === 'price_asc')
        sort.price = 1;
    else if (req.query.sort === 'price_desc')
        sort.price = -1;
    else if (req.query.sort === 'rating')
        sort['rating.average'] = -1;
    else
        sort.createdAt = -1;
    const filter = { ...keyword, ...category, ...priceFilter };
    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .sort(sort)
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    res.json(successResponse({
        products,
        page,
        pages: Math.ceil(count / pageSize),
        total: count,
    }));
});
// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ isFeatured: true }).limit(5);
    res.json(successResponse(products));
});
// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(successResponse(product));
    }
    else {
        res.status(404).json(errorResponse('Product not found'));
    }
});
//# sourceMappingURL=product.controller.js.map