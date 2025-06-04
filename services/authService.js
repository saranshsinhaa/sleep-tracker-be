/**
 * Authentication service for JWT token management
 */

const jwt = require('jsonwebtoken');

/**
 * Generates a JWT token for user authentication
 * @param {string} id - User ID
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d',
    });
};

/**
 * Verifies a JWT token and returns decoded payload
 * @param {string} token - JWT token
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Sends token response with cookie and JSON
 * @param {Object} user - User object
 * @param {number} statusCode - HTTP status code
 * @param {Object} res - Express response object
 * @param {string} message - Response message
 */
const sendTokenResponse = (user, statusCode, res, message) => {
    const token = generateToken(user._id);

    const options = {
        expires: new Date(
            Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            message,
            data: {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            },
            timestamp: new Date().toISOString()
        });
};

module.exports = {
    generateToken,
    verifyToken,
    sendTokenResponse
}; 