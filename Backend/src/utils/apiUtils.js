exports.sendResponse = (res, statusCode, success, message, data = null, meta = null) => {
    return res.status(statusCode).json({
        success,
        message,
        data,
        meta
    });
};

exports.catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
