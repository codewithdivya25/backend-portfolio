class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // MongoDB Duplicate Key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    // JWT Invalid Error
    if (err.name === "JsonWebTokenError") {
        err = new ErrorHandler("Invalid token. Please login again!", 401);
    }

    // JWT Expired Error
    if (err.name === "TokenExpiredError") {
        err = new ErrorHandler("Token expired. Please login again!", 401);
    }

    // Mongoose Cast Error
    if (err.name === "CastError") {
        err = new ErrorHandler(`Invalid ${err.path}`, 400);
    }

    // Mongoose Validation Error
    let message = err.message;
    if (err.errors) {
        message = Object.values(err.errors)
            .map(error => error.message)
            .join(", ");
    }

    return res.status(err.statusCode).json({
        success: false,
        message,
    });
};

export default ErrorHandler;
