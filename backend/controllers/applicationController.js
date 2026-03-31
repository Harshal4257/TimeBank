const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const { cloudinary } = require('../config/cloudinary');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Seeker)
const applyForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const seekerId = req.user.id;

        const existingApplication = await Application.findOne({ jobId, seekerId });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            jobId,
            seekerId,
            status: 'pending'
        });

        const job = await Job.findById(jobId);
        const seeker = await User.findById(seekerId);

        if (job && seeker) {
            await Message.create({
                sender: seekerId,
                receiver: job.poster,
                content: `${seeker.name} applied to your job: "${job.title}"`,
                isSystemMessage: true
            });

            await Notification.create({
                user: job.poster,
                title: 'New Application!',
                message: `${seeker.name} applied to your job: "${job.title}"`,
                type: 'new_application',
                jobId: job._id
            });
        }

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications for a specific job
// @route   GET /api/applications/job/:jobId
// @access  Private (Poster)
const getJobApplications = async (req, res) => {
    try {
        const applications = await Application.find({ jobId: req.params.jobId })
            .populate('seekerId', 'name email skills rating');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my applications (for Seeker)
// @route   GET /api/applications/my
// @access  Private (Seeker)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({ seekerId: req.user.id })
            .populate('jobId', 'title hourlyRate hours status');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my application for a specific job
// @route   GET /api/applications/job/:jobId/me
// @access  Private (Seeker)
const getMyApplicationForJob = async (req, res) => {
    try {
        const application = await Application.findOne({
            jobId: req.params.jobId,
            seekerId: req.user.id
        });
        if (!application) return res.json(null);
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications for jobs posted by this poster
// @route   GET /api/applications/poster
// @access  Private (Poster)
const getPosterApplications = async (req, res) => {
    try {
        const jobs = await Job.find({ poster: req.user.id });
        const jobIds = jobs.map(j => j._id);

        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('seekerId', 'name email skills rating')
            .populate('jobId', 'title status hourlyRate hours');

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status (accept/reject) + add instructions & files
// @route   PUT /api/applications/:id/:action
// @access  Private (Poster)
const updateApplicationStatus = async (req, res) => {
    try {
        const { id, action } = req.params;
        const application = await Application.findById(id).populate('jobId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.jobId.poster.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (action === 'accept') {
            application.status = 'accepted';
            console.log("---- ACCEPT ROUTE DEBUG ----");
            console.log("req.body:", req.body);
            console.log("req.files:", req.files);
            console.log("----------------------------");

            // ✅ Save poster instructions if provided
            if (req.body.posterInstructions) {
                application.posterInstructions = req.body.posterInstructions;
            }

            // ✅ Save uploaded files if any
            if (req.files && req.files.length > 0) {
                application.posterFiles = req.files.map(file => ({
                    url: file.path,
                    originalName: file.originalname
                }));
            }

        } else if (action === 'reject') {
            application.status = 'rejected';
        } else {
            return res.status(400).json({ message: 'Invalid action' });
        }

        await application.save();

        // Notify seeker
        await Message.create({
            sender: req.user.id,
            receiver: application.seekerId,
            content: `Your application for "${application.jobId.title}" has been ${action}ed.`,
            isSystemMessage: true
        });

        await Notification.create({
            user: application.seekerId,
            title: action === 'accept' ? '🎉 Application Accepted!' : '❌ Application Rejected',
            message: action === 'accept'
                ? `Your application for "${application.jobId.title}" has been accepted! Check your application for work instructions.`
                : `Your application for "${application.jobId.title}" has been rejected.`,
            type: 'application_update',
            jobId: application.jobId._id
        });

        res.json({ message: `Application ${action}ed successfully`, application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Seeker submits completed work
// @route   PUT /api/applications/:id/submit
// @access  Private (Seeker)
const submitWork = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.seekerId.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (application.status !== 'accepted') {
            return res.status(400).json({ message: 'Can only submit work for accepted applications' });
        }

        // ✅ Save submission notes
        application.submissionNotes = req.body.submissionNotes || '';

        // ✅ Save submitted files
        if (req.files && req.files.length > 0) {
            application.submissionFiles = req.files.map(file => ({
                url: file.path,
                originalName: file.originalname
            }));
        }

        application.status = 'submitted';
        application.submittedAt = new Date();
        await application.save();

        // Notify poster
        const poster = await Job.findById(application.jobId._id);
        await Notification.create({
            user: application.jobId.poster,
            title: '📦 Work Submitted!',
            message: `Seeker has submitted work for "${application.jobId.title}". Review and pay if satisfied!`,
            type: 'work_submitted',
            jobId: application.jobId._id
        });

        res.json({ message: 'Work submitted successfully!', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete job (called after payment)
// @route   PUT /api/applications/:id/complete
// @access  Private (Poster)
const completeJob = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id)
            .populate('jobId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.jobId.poster.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        application.status = 'completed';
        application.paidAt = new Date();
        application.paymentAmount = application.jobId.hourlyRate * application.jobId.hours;
        await application.save();

        // Notify seeker
        await Notification.create({
            user: application.seekerId,
            title: '💰 Payment Received!',
            message: `You have received ₹${application.paymentAmount} for completing "${application.jobId.title}"!`,
            type: 'payment_received',
            jobId: application.jobId._id
        });

        res.json({ message: 'Job completed!', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Cancel application
// @route   DELETE /api/applications/:id
// @access  Private (Seeker)
const cancelApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        if (application.seekerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await application.deleteOne();
        res.json({ message: 'Application cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForJob,
    getJobApplications,
    getMyApplications,
    getMyApplicationForJob,
    completeJob,
    cancelApplication,
    getPosterApplications,
    updateApplicationStatus,
    submitWork
};