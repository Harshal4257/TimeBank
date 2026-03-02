const express = require('express');
const router = express.Router();
const {
    applyForJob,
    getJobApplications,
    getMyApplications,
    getPosterApplications,
    completeJob, // <--- 1. ADD THIS IMPORT HERE
    updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

// Route to apply for a job (Seeker only)
router.post('/apply/:jobId', protect, applyForJob);

// Route to get all applicants for a specific job (Poster only)
router.get('/job/:jobId', protect, getJobApplications);

// Route to get all applications for jobs posted by current user (Poster only)
router.get('/poster', protect, getPosterApplications);

// Route to get my applications (Seeker only)
router.get('/my', protect, getMyApplications);

// Route to complete a job and transfer credits
router.put('/:id/complete', protect, completeJob);

// Route to accept or reject an application (Poster only)
router.put('/:id/:action', protect, updateApplicationStatus);

module.exports = router;