/**
 * Request logging middleware
 * Logs all incoming requests with timing information
 */

const Log = require('../models/Log');

/**
 * Gets the real client IP address considering proxies and load balancers
 * @param {Object} req - Express request object
 * @returns {string} - Client IP address
 */
const getClientIP = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
           req.headers['x-real-ip'] ||
           req.headers['x-client-ip'] ||
           req.connection.remoteAddress ||
           req.socket.remoteAddress ||
           req.ip ||
           'unknown';
};

/**
 * Saves log entry to database
 * @param {Object} logData - Log data to save
 */
const saveLogToDatabase = async (logData) => {
    try {
        await Log.create(logData);
    } catch (error) {
        // Silent fail for logging - don't break the request
    }
};

/**
 * Checks if the request should be excluded from database logging
 * @param {string} url - Request URL
 * @returns {boolean} - True if should be excluded from database
 */
const shouldExcludeFromDatabase = (url) => {
    const excludedPaths = ['/favicon.png', '/favicon.ico'];
    return excludedPaths.includes(url);
};

/**
 * Logs HTTP requests with method, URL, IP address, status code, and response time
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const logger = (req, res, next) => {
    const start = Date.now();
    const clientIP = getClientIP(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${clientIP}`);

    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - IP: ${clientIP}`);

        if (!shouldExcludeFromDatabase(req.originalUrl)) {
            const logData = {
                method: req.method,
                url: req.originalUrl,
                ip: clientIP,
                statusCode: res.statusCode,
                duration,
                userAgent,
                userId: req.user ? req.user.id : null
            };
            
            saveLogToDatabase(logData);
        }
        
        originalEnd.call(this, chunk, encoding);
    };

    next();
};

module.exports = logger; 