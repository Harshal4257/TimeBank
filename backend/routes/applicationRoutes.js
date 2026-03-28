const express = require('express');
const router = express.Router();
const {
    applyForJob,
    getJobApplications,
    getMyApplications,
    getMyApplicationForJob,
    completeJob,
    cancelApplication,
    getPosterApplications,
    updateApplicationStatus
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

// ✅ MOVED TO TOP — must be before any /:id routes
router.get('/my-accepted', protect, async (req, res) => {
    try {
        const Application = require('../models/Application');
        const applications = await Application.find({ status: 'accepted' })
            .populate({
                path: 'jobId',
                match: { poster: req.user._id } // ← changed postedBy to poster
            })
            .populate('seekerId', 'name email');

        const filtered = applications.filter(app => app.jobId !== null);
        res.json(filtered);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch applications' });
    }
});
// Route to apply for a job (Seeker only)
router.post('/apply/:jobId', protect, applyForJob);

// Route to get all applicants for a specific job (Poster only)
router.get('/job/:jobId', protect, getJobApplications);

// Route to get all applications for jobs posted by current user (Poster only)
router.get('/poster', protect, getPosterApplications);

// Route to get my applications (Seeker only)
router.get('/my', protect, getMyApplications);

// Route to get my application for a given job (Seeker only)
router.get('/job/:jobId/me', protect, getMyApplicationForJob);

// Route to cancel (unapply) an application (Seeker only)
router.delete('/:id', protect, cancelApplication);

// Route to complete a job and transfer credits (Poster only)
router.put('/:id/complete', protect, completeJob);

// Route to accept or reject an application (Poster only)
router.put('/:id/:action', protect, updateApplicationStatus);

module.exports = router;