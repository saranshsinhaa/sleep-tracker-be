/**
 * Sleep Tracker Backend Server
 * Main application entry point.
 */

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectDB } = require('./utils/database');
const logger = require('./middleware/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { sendSuccess } = require('./utils/response');
const routes = require('./routes');
require('dotenv').config();

const app = express();

connectDB();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || '*',
        credentials: true,
    })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(logger);
app.use('/v1', routes);

app.get('/', (req, res) => {
    const data = {
        message: '🛠️ Sleep Tracker API v1',
        version: '1.0.0',
        status: 'active',
        timestamp: new Date().toISOString(),
        endpoints: {
            healthcheck: '/v1/healthcheck',
            auth: {
                register: 'POST /v1/auth/register',
                login: 'POST /v1/auth/login',
                logout: 'POST /v1/auth/logout',
                profile: 'GET /v1/auth/me',
            },
            sleep: {
                list: 'GET /v1/sleep',
                create: 'POST /v1/sleep',
                get: 'GET /v1/sleep/:id',
                update: 'PUT /v1/sleep/:id',
                delete: 'DELETE /v1/sleep/:id',
            },
        },
    };
    return sendSuccess(res, 'API is running', data);
});

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(PORT, () => {
        console.log('🚀 ====================================');
        console.log('🛠️  Sleep Tracker API v1.0.0');
        console.log(`🌍 Server running on port ${PORT}`);
        console.log('📊 Health check: /v1/healthcheck');
        console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log('🚀 ====================================');
    });

    process.on('unhandledRejection', (err) => {
        console.log('❌ Unhandled Promise Rejection:', err.message);
        server.close(() => {
            process.exit(1);
        });
    });
}

module.exports = app;
