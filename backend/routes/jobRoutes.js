const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// Route to Get all jobs (Public) and Post a job (Private)
router.route('/')
    .get(getJobs)
    .post(protect, createJob);

// Route to Get a specific job by ID (Public)
router.route('/:id')
    .get(getJobById);

module.exports = router;