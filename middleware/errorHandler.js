/**
 * Global error handling middleware
 * Handles different types of errors and returns standardized error responses
 */

const { sendError } = require('../utils/response');

/**
 * Global error handler middleware that catches and processes all application errors
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} _next - Express next middleware function (unused)
 */
const errorHandler = (err, req, res, _next) => {
    console.error('Error Stack:', err.stack);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        return sendError(res, 'Resource not found', null, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return sendError(res, `${field} already exists`, null, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(error => error.message);
        return sendError(res, 'Validation Error', errors, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        return sendError(res, 'Invalid token', null, 401);
    }

    if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Token expired', null, 401);
    }

    // Default to 500 server error
    return sendError(res, err.message || 'Internal Server Error', null, err.statusCode || 500);
};

/**
 * Middleware to handle 404 Not Found errors for undefined routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const notFound = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.statusCode = 404;
    next(error);
};

module.exports = {
    errorHandler,
    notFound
}; 