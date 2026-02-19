const express = require('express');
const router = express.Router();
const { 
    createJob, 
    getJobs, 
    getJobById, 
    getMatchingJobs, 
    getPosterJobs, 
    saveJob, 
    unsaveJob, 
    getSavedJobs,
    getRecommendedJobs
} = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// Dashboard & Matching
router.get('/match', protect, getMatchingJobs);
router.get('/my-jobs', protect, getPosterJobs); // DASHBOARD USES THIS
router.get('/recommendations', protect, getRecommendedJobs);

// Saved Jobs
router.get('/saved', protect, getSavedJobs); 
router.post('/save/:jobId', protect, saveJob);
router.delete('/save/:jobId', protect, unsaveJob);

// Base Job Routes
router.route('/')
    .get(getJobs)
    .post(protect, createJob);

// ID-specific routes (Keep these at the bottom!)
router.get('/:id', getJobById);

module.exports = router;