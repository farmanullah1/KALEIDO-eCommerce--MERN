import { Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
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

  const sort: any = {};
  if (req.query.sort === 'price_asc') sort.price = 1;
  else if (req.query.sort === 'price_desc') sort.price = -1;
  else if (req.query.sort === 'rating') sort['rating.average'] = -1;
  else sort.createdAt = -1;

  const filter: any = { ...keyword, ...category, ...priceFilter, moderationStatus: 'active' };
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
export const getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({ isFeatured: true }).limit(5);
  res.json(successResponse(products));
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(successResponse(product));
  } else {
    res.status(404).json(errorResponse('Product not found'));
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, price, description, category, subcategory, brand, stock, images, tags } = req.body;

  const product = new Product({
    name,
    price,
    description,
    category,
    subcategory,
    brand,
    stock,
    images,
    tags,
    sellerId: req.user._id,
    moderationStatus: 'pending', // Default to pending for new products
  });

  const createdProduct = await product.save();
  res.status(201).json(successResponse(createdProduct, 'Product created and pending moderation'));
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller/Admin
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const { name, price, description, category, subcategory, brand, stock, images, tags } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Only seller or admin can update
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json(errorResponse('Not authorized to update this product'));
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
    product.brand = brand || product.brand;
    product.stock = stock || product.stock;
    product.images = images || product.images;
    product.tags = tags || product.tags;

    // Reset moderation status on update if not admin
    if (req.user.role !== 'admin') {
      product.moderationStatus = 'pending';
    }

    const updatedProduct = await product.save();
    res.json(successResponse(updatedProduct, 'Product updated successfully'));
  } else {
    res.status(404).json(errorResponse('Product not found'));
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller/Admin
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    // Only seller or admin can delete
    if (product.sellerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json(errorResponse('Not authorized to delete this product'));
    }

    await Product.deleteOne({ _id: product._id });
    res.json(successResponse(null, 'Product removed'));
  } else {
    res.status(404).json(errorResponse('Product not found'));
  }
});

// @desc    Get seller products
// @route   GET /api/products/seller
// @access  Private/Seller
export const getSellerProducts = asyncHandler(async (req: Request, res: Response) => {
  const products = await Product.find({ sellerId: req.user._id });
  res.json(successResponse(products));
});

// @desc    Update product moderation status
// @route   PUT /api/products/:id/moderation
// @access  Private/Admin
export const updateProductModeration = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;

  if (!['active', 'rejected'].includes(status)) {
    return res.status(400).json(errorResponse('Invalid moderation status'));
  }

  const product = await Product.findById(req.params.id);

  if (product) {
    product.moderationStatus = status;
    const updatedProduct = await product.save();

    // Notify seller via Socket.io
    const io = req.app.get('io');
    if (io) {
      io.to(product.sellerId.toString()).emit('notification', {
        type: 'PRODUCT_MODERATION',
        message: `Your artifact "${product.name}" has been ${status === 'active' ? 'approved' : 'rejected'}.`,
        productId: product._id,
        status: status,
        createdAt: new Date()
      });
    }

    res.json(successResponse(updatedProduct, `Product ${status} successfully`));
  } else {
    res.status(404).json(errorResponse('Product not found'));
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = asyncHandler(async (req: Request, res: Response) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r: any) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json(errorResponse('Product already reviewed'));
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      createdAt: new Date(),
    };

    product.reviews.push(review as any);
    product.rating.count = product.reviews.length;
    product.rating.average =
      product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json(successResponse(null, 'Review added'));
  } else {
    res.status(404).json(errorResponse('Product not found'));
  }
});
