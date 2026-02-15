const express = require('express');
const router = express.Router();
const { 
    applyForJob, 
    getJobApplications, 
    getMyApplications,
    completeJob // <--- 1. ADD THIS IMPORT HERE
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

// Route to apply for a job (Seeker only)
router.post('/:jobId', protect, applyForJob);

// Route to get all applicants for a specific job (Poster only)
router.get('/job/:jobId', protect, getJobApplications);

// Route to get my applications (Seeker only)
router.get('/my', protect, getMyApplications);

// Route to complete a job and transfer credits
router.put('/:id/complete', protect, completeJob);

module.exports = router;