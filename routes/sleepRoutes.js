/**
 * Sleep entry routes configuration
 */

const express = require('express');
const {
    createSleep,
    getSleepEntries,
    getSleepEntry,
    updateSleepEntry,
    deleteSleepEntry
} = require('../controllers/sleepController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getSleepEntries)
    .post(createSleep);

router.route('/:id')
    .get(getSleepEntry)
    .put(updateSleepEntry)
    .delete(deleteSleepEntry);

module.exports = router; 