/**
 * Request logging middleware
 * Logs all incoming requests with timing information
 */

/**
 * Logs HTTP requests with method, URL, IP address, status code, and response time
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const logger = (req, res, next) => {
    const start = Date.now();

    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${req.ip || req.connection.remoteAddress}`);

    const originalEnd = res.end;
    res.end = function(chunk, encoding) {
        const duration = Date.now() - start;
        console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
        originalEnd.call(this, chunk, encoding);
    };
    next();
};

module.exports = logger; 