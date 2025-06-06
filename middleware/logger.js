/**
 * Request logging middleware
 * Logs all incoming requests with timing information
 */

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
 * Logs HTTP requests with method, URL, IP address, status code, and response time
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const logger = (req, res, next) => {
    const start = Date.now();
    const clientIP = getClientIP(req);

    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${clientIP}`);

    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - IP: ${clientIP}`);
        originalEnd.call(this, chunk, encoding);
    };

    next();
};

module.exports = logger; 