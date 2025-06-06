/**
 * Sleep controller for managing sleep entries
 */

const Sleep = require('../models/Sleep');
const { sendSuccess, sendError, sendNotFound } = require('../utils/response');

/**
 * Create a new sleep entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createSleep = async (req, res) => {
    try {
        const { startTime, endTime } = req.body;

        if (!startTime || !endTime) {
            return sendError(res, 'Start time and end time are required', null, 400);
        }

        if (new Date(endTime) <= new Date(startTime)) {
            return sendError(res, 'End time must be after start time', null, 400);
        }

        const sleepEntry = await Sleep.create({
            userId: req.user.id,
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        });

        return sendSuccess(res, 'Sleep entry created successfully', sleepEntry, 201);
    } catch (error) {
        console.error('Create sleep error:', error);
        return sendError(res, 'Failed to create sleep entry', error.message);
    }
};

/**
 * Get all sleep entries for logged in user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSleepEntries = async (req, res) => {
    try {
        const sleepEntries = await Sleep.find({ userId: req.user.id })
            .sort({ createdAt: -1 });

        return sendSuccess(res, 'Sleep entries retrieved successfully', sleepEntries);
    } catch (error) {
        console.error('Get sleep entries error:', error);
        return sendError(res, 'Failed to get sleep entries', error.message);
    }
};

/**
 * Get a single sleep entry by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSleepEntry = async (req, res) => {
    try {
        const sleepEntry = await Sleep.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!sleepEntry) {
            return sendNotFound(res, 'Sleep entry not found');
        }

        return sendSuccess(res, 'Sleep entry retrieved successfully', sleepEntry);
    } catch (error) {
        console.error('Get sleep entry error:', error);
        return sendError(res, 'Failed to get sleep entry', error.message);
    }
};

/**
 * Update a sleep entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateSleepEntry = async (req, res) => {
    try {
        const { startTime, endTime } = req.body;

        const sleepEntry = await Sleep.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!sleepEntry) {
            return sendNotFound(res, 'Sleep entry not found');
        }

        if (startTime) sleepEntry.startTime = new Date(startTime);
        if (endTime) sleepEntry.endTime = new Date(endTime);

        if (sleepEntry.endTime <= sleepEntry.startTime) {
            return sendError(res, 'End time must be after start time', null, 400);
        }

        await sleepEntry.save();

        return sendSuccess(res, 'Sleep entry updated successfully', sleepEntry);
    } catch (error) {
        console.error('Update sleep entry error:', error);
        return sendError(res, 'Failed to update sleep entry', error.message);
    }
};

/**
 * Delete a sleep entry
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteSleepEntry = async (req, res) => {
    try {
        const sleepEntry = await Sleep.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!sleepEntry) {
            return sendNotFound(res, 'Sleep entry not found');
        }

        await Sleep.findByIdAndDelete(req.params.id);

        return sendSuccess(res, 'Sleep entry deleted successfully');
    } catch (error) {
        console.error('Delete sleep entry error:', error);
        return sendError(res, 'Failed to delete sleep entry', error.message);
    }
};

module.exports = {
    createSleep,
    getSleepEntries,
    getSleepEntry,
    updateSleepEntry,
    deleteSleepEntry
}; 