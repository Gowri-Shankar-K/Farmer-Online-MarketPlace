const Order = require('../models/Order');
const Product = require('../models/Product');
const { catchAsync, sendResponse } = require('../utils/apiUtils');

exports.createOrder = catchAsync(async (req, res, next) => {
    const { items, shippingAddress } = req.body;

    // Calculate total amount and verify stock
    let totalAmount = 0;
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product || product.quantity < item.quantity) {
            const error = new Error(`Product ${product ? product.name : item.product} is out of stock or unavailable`);
            error.statusCode = 400;
            throw error;
        }
        totalAmount += product.price * item.quantity;

        // Reduce stock
        product.quantity -= item.quantity;
        await product.save();
    }

    const order = await Order.create({
        buyer: req.user._id,
        items,
        totalAmount,
        shippingAddress
    });

    sendResponse(res, 201, true, 'Order placed successfully', order);
});

exports.getMyOrders = catchAsync(async (req, res, next) => {
    let query = {};
    if (req.user.role === 'buyer') {
        query = { buyer: req.user._id };
    } else if (req.user.role === 'farmer') {
        // For farmers, they see orders containing their products
        // This is a bit more complex, for now let's simplify or filter by product items
        const farmerProducts = await Product.find({ farmer: req.user._id }).select('_id');
        const productIds = farmerProducts.map(p => p._id);
        query = { 'items.product': { $in: productIds } };
    }

    const orders = await Order.find(query)
        .populate('buyer', 'name email phoneNumber')
        .populate('items.product', 'name price unit images');

    sendResponse(res, 200, true, 'Orders fetched successfully', orders);
});

exports.getOrderDetails = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
        .populate('buyer', 'name email location')
        .populate('items.product');

    if (!order) {
        const error = new Error('Order not found');
        error.statusCode = 404;
        throw error;
    }

    sendResponse(res, 200, true, 'Order details fetched', order);
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
    sendResponse(res, 200, true, 'Order status updated', order);
});
