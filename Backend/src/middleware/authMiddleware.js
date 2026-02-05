const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { catchAsync } = require('../utils/apiUtils');

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        const error = new Error('Not authorized to access this route');
        error.statusCode = 401;
        throw error;
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        const error = new Error('Not authorized to access this route');
        error.statusCode = 401;
        throw error;
    }
});

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const error = new Error(`User role ${req.user.role} is not authorized to access this route`);
            error.statusCode = 403;
            throw error;
        }
        next();
    };
};
