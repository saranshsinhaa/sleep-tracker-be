/**
 * Health check routes
 */

const express = require('express');
const { healthCheck } = require('../controllers/healthController');

const router = express.Router();

/**
 * GET /v1/healthcheck - Comprehensive health check
 */
router.get('/', healthCheck);

module.exports = router; 