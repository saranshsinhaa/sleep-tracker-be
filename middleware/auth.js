/**
 * Authentication middleware for protecting routes
 */

const User = require('../models/User');
const { verifyToken } = require('../services/authService');
const { sendUnauthorized } = require('../utils/response');

/**
 * Middleware to protect routes - requires valid JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return sendUnauthorized(res, 'Not authorized to access this route');
    }

    try {
        const decoded = verifyToken(token);
        req.user = await User.findById(decoded.id);
        
        if (!req.user) {
            return sendUnauthorized(res, 'User not found');
        }

        if (!req.user.isActive) {
            return sendUnauthorized(res, 'User account is deactivated');
        }

        next();
    } catch (error) {
        return sendUnauthorized(res, 'Not authorized to access this route');
    }
};

module.exports = {
    protect
}; 