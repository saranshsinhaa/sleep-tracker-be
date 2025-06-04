/**
 * Authentication controller.
 */

const User = require('../models/User');
const { sendTokenResponse } = require('../services/authService');
const { sendError, sendSuccess } = require('../utils/response');

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(res, 'User already exists with this email', null, 400);
        }

        const user = await User.create({
            name,
            email,
            password
        });

        sendTokenResponse(user, 201, res, 'User registered successfully');
    } catch (error) {
        console.error('Registration error:', error);
        return sendError(res, 'Registration failed', error.message);
    }
};

/**
 * Login user with email and password
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, 'Please provide email and password', null, 400);
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return sendError(res, 'Invalid credentials', null, 401);
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return sendError(res, 'Invalid credentials', null, 401);
        }

        if (!user.isActive) {
            return sendError(res, 'Account is deactivated', null, 401);
        }

        sendTokenResponse(user, 200, res, 'Login successful');
    } catch (error) {
        console.error('Login error:', error);
        return sendError(res, 'Login failed', error.message);
    }
};

/**
 * Get current logged in user profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        return sendSuccess(res, 'User profile retrieved successfully', userData);
    } catch (error) {
        console.error('Get profile error:', error);
        return sendError(res, 'Failed to get user profile', error.message);
    }
};

/**
 * Logout user and clear cookie
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const logout = (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    return sendSuccess(res, 'User logged out successfully');
};

module.exports = {
    register,
    login,
    getMe,
    logout
}; 