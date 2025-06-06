/**
 * Health check controller
 * Handles system health monitoring and status reporting
 */

const os = require('os');
const mongoose = require('mongoose');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Formats seconds into HH:MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
const formatTime = (seconds) => {
    function pad(s) {
        return (s < 10 ? '0' : '') + s;
    }
    let hours = Math.floor(seconds / (60 * 60));
    let minutes = Math.floor((seconds % (60 * 60)) / 60);
    let secs = Math.floor(seconds % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(secs);
};

/**
 * Comprehensive health check endpoint that returns detailed system information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const healthCheck = async (req, res) => {
    try {
        let healthcheckData = {
            message: '🛠️ Sleep Tracker API v1 working!',
            serverUptime: formatTime(process.uptime()),
            osUptime: formatTime(os.uptime()),
            timestamp: new Date().toUTCString(),
            cpus: os.cpus(),
            architecture: os.arch(),
            networkInterfaces: os.networkInterfaces(),
            totalMemory: os.totalmem(),
            freeMemory: os.freemem(),
            platform: os.platform(),
            osType: os.type(),
            osRelease: os.release(),
            osVersion: os.version(),
            hostname: os.hostname(),
            userInfo: os.userInfo(),
            reqIP: req.headers['x-real-ip'] || req.connection.remoteAddress,
            nodeVersion: process.version,
            memoryUsage: process.memoryUsage(),
            loadAverage: os.loadavg(),
        };

        // Check MongoDB connection status
        try {
            if (mongoose.connection.readyState === 1) {
                healthcheckData.mongoDBStatus = '✅ Connected to MongoDB';
                healthcheckData.databaseName = mongoose.connection.name;
                healthcheckData.databaseHost = mongoose.connection.host;
            } else {
                healthcheckData.mongoDBStatus = '⚠️ MongoDB connection pending';
            }
        } catch (error) {
            healthcheckData.mongoDBStatus = '❌ MongoDB connection failed';
        }

        return sendSuccess(
            res,
            'Health check completed successfully',
            healthcheckData
        );
    } catch (error) {
        return sendError(res, 'Health check failed', error.message);
    }
};

module.exports = {
    healthCheck
};
