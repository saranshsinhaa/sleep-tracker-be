/**
 * Standardized API response utility functions
 * Provides consistent response format across the application
 */

/**
 * Sends a standardized response with configurable status, message, data, and error
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success - Success flag
 * @param {string} message - Response message
 * @param {*} data - Response data (optional)
 * @param {*} error - Error details (optional)
 * @returns {Object} Express response
 */
const sendResponse = (res, statusCode, success, message, data = null, error = null) => {
    const response = {
        status: statusCode,
        success,
        message,
        timestamp: new Date().toISOString(),
    };

    if (data !== null) {
        response.data = data;
    }

    if (error !== null) {
        response.error = error;
    }

    return res.status(statusCode).json(response);
};

/**
 * Sends a success response
 * @param {Object} res - Express response object
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {Object} Express response
 */
const sendSuccess = (res, message = 'Success', data = null, statusCode = 200) => {
    return sendResponse(res, statusCode, true, message, data);
};

/**
 * Sends an error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @param {*} error - Error details
 * @param {number} statusCode - HTTP status code (default: 500)
 * @returns {Object} Express response
 */
const sendError = (res, message = 'Internal Server Error', error = null, statusCode = 500) => {
    return sendResponse(res, statusCode, false, message, null, error);
};

/**
 * Sends a validation error response
 * @param {Object} res - Express response object
 * @param {Array} errors - Array of validation errors
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
const sendValidationError = (res, errors, message = 'Validation Error') => {
    return sendResponse(res, 400, false, message, null, errors);
};

/**
 * Sends a not found error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
const sendNotFound = (res, message = 'Resource not found') => {
    return sendResponse(res, 404, false, message);
};

/**
 * Sends an unauthorized error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
const sendUnauthorized = (res, message = 'Unauthorized access') => {
    return sendResponse(res, 401, false, message);
};

/**
 * Sends a forbidden error response
 * @param {Object} res - Express response object
 * @param {string} message - Error message
 * @returns {Object} Express response
 */
const sendForbidden = (res, message = 'Access forbidden') => {
    return sendResponse(res, 403, false, message);
};

module.exports = {
    sendResponse,
    sendSuccess,
    sendError,
    sendValidationError,
    sendNotFound,
    sendUnauthorized,
    sendForbidden
}; 