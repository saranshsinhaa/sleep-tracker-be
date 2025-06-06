/**
 * Main API routes configuration
 * Defines all available endpoints for the application
 */

const express = require('express');
const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const sleepRoutes = require('./sleepRoutes');

const router = express.Router();

router.use('/healthcheck', healthRoutes);
router.use('/auth', authRoutes);
router.use('/sleep', sleepRoutes);

module.exports = router; 