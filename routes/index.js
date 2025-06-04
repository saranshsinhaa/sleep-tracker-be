/**
 * Main API routes configuration
 * Defines all available endpoints for the application
 */

const express = require('express');
const { healthCheck } = require('../controllers/healthController');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.get('/healthcheck', healthCheck);
router.use('/auth', authRoutes);

module.exports = router; 