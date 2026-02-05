const Product = require('../models/Product');
const { catchAsync, sendResponse } = require('../utils/apiUtils');

exports.createProduct = catchAsync(async (req, res, next) => {
    req.body.farmer = req.user._id;
    const product = await Product.create(req.body);
    sendResponse(res, 201, true, 'Product created successfully', product);
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
    // 1. Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludedFields.forEach(el => delete queryObj[el]);

    // Handle price range filters like [gte], [lte]
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // 2. Search
    if (req.query.search) {
        query = query.find({
            $or: [
                { name: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ]
        });
    }

    // Only show approved products for buyers
    if (req.user?.role === 'buyer' || !req.user) {
        query = query.find({ status: 'approved' });
    }

    // 3. Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    // 4. Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    const products = await query;
    const total = await Product.countDocuments(JSON.parse(queryStr));

    sendResponse(res, 200, true, 'Products fetched successfully', products, {
        total,
        page,
        pages: Math.ceil(total / limit)
    });
});

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('farmer', 'name email phoneNumber');
    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }
    sendResponse(res, 200, true, 'Product fetched successfully', product);
});

exports.updateProduct = catchAsync(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    // Check if farmer owns this product
    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        const error = new Error('Not authorized to update this product');
        error.statusCode = 403;
        throw error;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    sendResponse(res, 200, true, 'Product updated successfully', product);
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        const error = new Error('Product not found');
        error.statusCode = 404;
        throw error;
    }

    if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        const error = new Error('Not authorized to delete this product');
        error.statusCode = 403;
        throw error;
    }

    await Product.findByIdAndDelete(req.params.id);
    sendResponse(res, 200, true, 'Product deleted successfully');
});

exports.approveProduct = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
        const error = new Error('Invalid status');
        error.statusCode = 400;
        throw error;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, { status }, { new: true });
    sendResponse(res, 200, true, `Product ${status} successfully`, product);
});
