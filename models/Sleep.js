/**
 * Sleep entry model for tracking user sleep data
 */

const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: Date,
        required: [true, 'End time is required']
    },
    duration: {
        type: Number
    }
}, {
    timestamps: true
});

/**
 * Pre-save middleware to calculate duration in minutes
 */
sleepSchema.pre('save', function(next) {
    if (this.startTime && this.endTime) {
        this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60));
    }
    next();
});

/**
 * Index for efficient querying by user and date
 */
sleepSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Sleep', sleepSchema); 