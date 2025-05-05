import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;

  // Build query
  let query = {};

  // Search functionality
  if (req.query.search) {
    query = {
      $text: { $search: req.query.search },
    };
  }

  // Category filter
  if (req.query.category) {
    query.category = req.query.category;
  }

  // Price filter
  if (req.query.minPrice || req.query.maxPrice) {
    query.price = {};
    if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
  }

  // Stock filter
  if (req.query.inStock === 'true') {
    query.countInStock = { $gt: 0 };
  }

  // Discount/Sale filter
  if (req.query.onSale === 'true') {
    query.discount = { $gt: 0 };
  }

  // Featured filter
  if (req.query.featured === 'true') {
    query.featured = true;
  }

  // Determine sort order
  let sortOrder = {};
  const sort = req.query.sort || '-createdAt'; // Default to newest
  
  if (sort === 'price') {
    sortOrder = { price: 1 }; // Ascending price
  } else if (sort === '-price') {
    sortOrder = { price: -1 }; // Descending price
  } else if (sort === 'rating') {
    sortOrder = { rating: 1 };
  } else if (sort === '-rating') {
    sortOrder = { rating: -1 };
  } else if (sort === 'numReviews') {
    sortOrder = { numReviews: 1 };
  } else if (sort === '-numReviews') {
    sortOrder = { numReviews: -1 };
  } else {
    // Default to newest
    sortOrder = { createdAt: -1 };
  }

  // Count total matching documents
  const count = await Product.countDocuments(query);

  // Get products
  const products = await Product.find(query)
    .sort(sortOrder)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    totalProducts: count,
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    // Update overall product rating
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(5);
  res.json(products);
});

// @desc    Get related products
// @route   GET /api/products/related/:id
// @access  Public
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Find products with the same category
  const relatedProducts = await Product.find({
    _id: { $ne: product._id }, // Exclude the current product
    category: product.category,
  }).limit(4);

  res.json(relatedProducts);
});

// @desc    Get product categories
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: req.body.name || 'Sample product',
    price: req.body.price || 0,
    user: req.user._id,
    image: req.body.image || '/images/sample.jpg',
    brand: req.body.brand || 'Sample brand',
    category: req.body.category || 'Sample category',
    countInStock: req.body.countInStock || 0,
    numReviews: 0,
    description: req.body.description || 'Sample description',
    discount: req.body.discount || 0,
    featured: req.body.featured || false,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    discount,
    featured,
    features,
    specifications,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    product.discount = discount !== undefined ? discount : product.discount;
    product.featured = featured !== undefined ? featured : product.featured;
    
    if (features) product.features = features;
    if (specifications) product.specifications = specifications;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProducts,
  getProductById,
  createProductReview,
  getTopProducts,
  getRelatedProducts,
  getProductCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};