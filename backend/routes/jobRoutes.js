const express = require('express');
const router = express.Router();
const { 
    createJob, 
    getJobs, 
    getJobById, 
    getRecommendedJobs // Make sure this is imported!
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// 1. Static/Specific routes MUST come first
router.get('/recommendations', protect, getRecommendedJobs);

// 2. The root route
router.route('/')
    .get(getJobs)
    .post(protect, createJob);

// 3. Dynamic routes (with :id) MUST come last
router.get('/:id', getJobById);

module.exports = router;