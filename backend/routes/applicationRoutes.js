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
    submitWork,
    requestRevision
} = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { uploadJobFiles } = require('../config/cloudinary');

// ============================================================
// STATIC ROUTES FIRST
// ============================================================

router.get('/download-file', protect, async (req, res) => {
    try {
        const { url, filename } = req.query;
        if (!url) return res.status(400).json({ message: 'URL is required' });

        const axios = require('axios');
        const { cloudinary } = require('../config/cloudinary');

        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const uploadIndex = pathParts.indexOf('upload');
        let publicIdParts = pathParts.slice(uploadIndex + 1);

        if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
            publicIdParts = publicIdParts.slice(1);
        }

        const publicIdWithExt = publicIdParts.join('/');
        const ext = publicIdWithExt.split('.').pop();
        const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');

        console.log('Download — public_id:', publicId, '| ext:', ext);

        const signedUrl = cloudinary.url(publicId, {
            resource_type: 'raw',
            type: 'upload',
            sign_url: true,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            format: ext,
        });

        const cloudinaryResponse = await axios.get(signedUrl, {
            responseType: 'stream',
            maxRedirects: 5,
        });

        res.setHeader('Content-Disposition', `attachment; filename="${filename || 'download'}"`);
        res.setHeader('Content-Type', cloudinaryResponse.headers['content-type'] || 'application/octet-stream');
        if (cloudinaryResponse.headers['content-length']) {
            res.setHeader('Content-Length', cloudinaryResponse.headers['content-length']);
        }
        cloudinaryResponse.data.pipe(res);

    } catch (err) {
        console.error('Download route error:', err.message);
        if (err.response) console.error('Cloudinary status:', err.response.status);
        res.status(500).json({ message: err.message });
    }
});

router.get('/my-accepted', protect, async (req, res) => {
    try {
        const Application = require('../models/Application');
        const applications = await Application.find({ status: 'submitted' })
            .populate({ path: 'jobId', match: { poster: req.user._id } })
            .populate('seekerId', 'name email');
        const filtered = applications.filter(app => app.jobId !== null);
        res.json(filtered);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch applications' });
    }
});

router.post('/apply/:jobId', protect, applyForJob);
router.get('/job/:jobId', protect, getJobApplications);
router.get('/job/:jobId/me', protect, getMyApplicationForJob);
router.get('/poster', protect, getPosterApplications);
router.get('/my', protect, getMyApplications);

// ============================================================
// DYNAMIC /:id ROUTES — ordered from specific to generic
// ============================================================

router.delete('/:id', protect, cancelApplication);
router.put('/:id/complete', protect, completeJob);

// ✅ Seeker starts the timer — inline handler (no separate controller needed)
router.put('/:id/start-timer', protect, async (req, res) => {
    try {
        const Application = require('../models/Application');
        const application = await Application.findById(req.params.id);

        if (!application) return res.status(404).json({ message: 'Application not found' });
        if (application.seekerId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (application.status !== 'accepted') {
            return res.status(400).json({ message: 'Can only start timer for accepted applications' });
        }
        if (application.timerStartedAt) {
            return res.status(400).json({ message: 'Timer already started' });
        }

        application.timerStartedAt = new Date();
        await application.save();

        res.json({ message: 'Timer started!', application });
    } catch (err) {
        console.error('Start timer error:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// Seeker first submission (status must be 'accepted')
router.put('/:id/submit', protect, uploadJobFiles.array('files', 5), submitWork);

// Poster requests a revision
router.put('/:id/request-revision', protect, requestRevision);

// Seeker edits existing submission (status must be 'submitted')
router.put('/:id/resubmit', protect, uploadJobFiles.array('files', 5), async (req, res) => {
    console.log('=== RESUBMIT HIT ===', req.params.id);
    try {
        const Application = require('../models/Application');
        const application = await Application.findById(req.params.id);

        if (!application) return res.status(404).json({ message: 'Application not found' });
        if (application.seekerId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        if (application.status !== 'submitted' && application.status !== 'revision_requested') {
            return res.status(400).json({ message: 'Can only resubmit for submitted or revision-requested applications' });
        }

        if (req.body.submissionNotes !== undefined) {
            application.submissionNotes = req.body.submissionNotes;
        }
        if (req.files && req.files.length > 0) {
            application.submissionFiles = req.files.map(file => ({
                url: file.path,
                originalName: file.originalname,
                uploadedAt: new Date()
            }));
        }

        // Always reset to 'submitted' so poster sees the fresh resubmission
        application.status = 'submitted';
        application.revisionFeedback = '';
        application.submittedAt = new Date();
        await application.save();

        res.json({ message: 'Submission updated successfully!', application });
    } catch (err) {
        console.error('Resubmit error:', err.message);
        res.status(500).json({ message: err.message || 'Unknown error' });
    }
});

// Poster accepts/rejects — MUST be last, most generic pattern
router.put('/:id/:action', protect, uploadJobFiles.array('files', 5), updateApplicationStatus);

module.exports = router;