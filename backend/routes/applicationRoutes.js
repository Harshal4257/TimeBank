const express = require('express');
const router = express.Router();
const { 
    applyForJob, 
    getJobApplications, 
    getMyApplications 
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

// Route to apply for a job (Seeker only)
router.post('/:jobId', protect, applyForJob);

// Route to get all applicants for a specific job (Poster only)
router.get('/job/:jobId', protect, getJobApplications);

// Route to get my applications (Seeker only)
router.get('/my', protect, getMyApplications);

module.exports = router;