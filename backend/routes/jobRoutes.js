const express = require('express');
const router = express.Router();
const { 
    createJob, 
    getJobs, 
    getJobById, 
    getRecommendedJobs, // Make sure this is imported!
    getMatchingJobs, // New matching jobs endpoint
    saveJob, // Save job functionality
    unsaveJob, // Unsave job functionality
    getSavedJobs // Get saved jobs
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// 1. Static/Specific routes MUST come first
router.get('/recommendations', protect, getRecommendedJobs);
router.get('/match', protect, getMatchingJobs); // New endpoint for matching jobs
router.get('/saved', protect, getSavedJobs); // Get saved jobs

// 2. Save/Unsave job routes
router.post('/save/:jobId', protect, saveJob);
router.delete('/save/:jobId', protect, unsaveJob);

// 3. The root route
router.route('/')
    .get(getJobs)
    .post(protect, createJob);

// 4. Dynamic routes (with :id) MUST come last
router.get('/:id', getJobById);

module.exports = router;