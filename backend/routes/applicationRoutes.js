const express = require('express');
const router = express.Router();
const { 
    applyForJob, 
    getJobApplications, 
    getMyApplications,
    getMyApplicationForJob,
    completeJob,
    cancelApplication,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

// Route to apply for a job (Seeker only)
router.post('/apply/:jobId', protect, applyForJob);

// Route to get all applicants for a specific job (Poster only)
router.get('/job/:jobId', protect, getJobApplications);

// Route to get my applications (Seeker only)
router.get('/my', protect, getMyApplications);

// Route to get my application for a given job (Seeker only)
router.get('/job/:jobId/me', protect, getMyApplicationForJob);

// Route to cancel (unapply) an application (Seeker only)
router.delete('/:id', protect, cancelApplication);

// Route to complete a job and transfer credits (Poster only)
router.put('/:id/complete', protect, completeJob);

module.exports = router;