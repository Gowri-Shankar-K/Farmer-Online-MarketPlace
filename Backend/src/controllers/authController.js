const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { catchAsync, sendResponse } = require('../utils/apiUtils');

const generateAccessToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'
    });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });
};

exports.register = catchAsync(async (req, res, next) => {
    const { name, email, password, role, phoneNumber, location } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        const error = new Error('User already exists');
        error.statusCode = 400;
        throw error;
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        phoneNumber,
        location
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    sendResponse(res, 201, true, 'User registered successfully', {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        accessToken
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        const error = new Error('Please provide email and password');
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    sendResponse(res, 200, true, 'Login successful', {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        accessToken
    });
});

exports.logout = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
        await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    }

    res.clearCookie('refreshToken');
    sendResponse(res, 200, true, 'Logged out successfully');
});

exports.refreshToken = catchAsync(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        const error = new Error('Refresh token not found');
        error.statusCode = 401;
        throw error;
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
        const error = new Error('Invalid refresh token');
        error.statusCode = 401;
        throw error;
    }

    const accessToken = generateAccessToken(user);
    sendResponse(res, 200, true, 'Token refreshed', { accessToken });
});

exports.getMe = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    sendResponse(res, 200, true, 'User profile fetched', user);
});
