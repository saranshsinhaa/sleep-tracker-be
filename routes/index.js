/**
 * Main API routes configuration
 * Defines all available endpoints for the application
 */

const express = require('express');
const { healthCheck } = require('../controllers/healthController');

const router = express.Router();

router.get('/healthcheck', healthCheck);

module.exports = router; 