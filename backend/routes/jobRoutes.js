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
    getRecommendedJobs,
    updateJob, // <--- ADD THIS IMPORT
    deleteJob,  // <--- ADD THIS IMPORT
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
    router.route('/:id')
    .get(getJobById)           // To view details
    .put(protect, updateJob)    // <--- THIS WAS MISSING! Handles the Edit
    .delete(protect, deleteJob); // <--- THIS WAS MISSING! Handles the Delete

// ID-specific routes (Keep these at the bottom!)
router.get('/:id', getJobById);

module.exports = router;