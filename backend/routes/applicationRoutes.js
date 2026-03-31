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
    updateApplicationStatus,
    submitWork
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { uploadJobFiles, uploadSubmissionFiles } = require('../config/cloudinary');

// ✅ SPECIFIC ROUTES FIRST (before any /:id routes)
router.get('/my-accepted', protect, async (req, res) => {
    try {
        const Application = require('../models/Application');
        const applications = await Application.find({ status: 'submitted' })
            .populate({
                path: 'jobId',
                match: { poster: req.user._id }
            })
            .populate('seekerId', 'name email');

        const filtered = applications.filter(app => app.jobId !== null);
        res.json(filtered);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch applications' });
    }
});

router.post('/apply/:jobId', protect, applyForJob);
router.get('/job/:jobId', protect, getJobApplications);
router.get('/poster', protect, getPosterApplications);
router.get('/my', protect, getMyApplications);
router.get('/job/:jobId/me', protect, getMyApplicationForJob);
router.delete('/:id', protect, cancelApplication);
router.put('/:id/complete', protect, completeJob);

// ✅ Seeker submits work with files
router.put('/:id/submit', protect, uploadSubmissionFiles.array('files', 5), submitWork);

// ✅ Poster accepts/rejects with optional files & instructions
router.put('/:id/:action', protect, uploadJobFiles.array('files', 5), updateApplicationStatus);

module.exports = router;