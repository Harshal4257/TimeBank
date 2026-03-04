const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User'); // 1. Added this missing import!
const Message = require('../models/Message'); // Import Message model
const Notification = require('../models/Notification'); // Import Notification model

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

        // --- AUTOMATED MESSAGING ---
        // Notify the poster that someone applied
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
        // ---------------------------

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
            .populate('jobId', 'title hourlyRate status');

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
        const jobId = req.params.jobId;
        const seekerId = req.user.id;

        const application = await Application.findOne({ jobId, seekerId });
        if (!application) {
            return res.json(null);
        }
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Complete a job and transfer time credits
// @route   PUT /api/applications/:id/complete
// @access  Private (Poster only)
const completeJob = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id).populate('jobId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const job = application.jobId;

        // Ensure only the poster can complete the job
        if (job.poster.toString() !== req.user.id.toString()) {
            return res.status(401).json({ message: 'User not authorized to complete this job' });
        }

        const creditsToTransfer = job.hourlyRate * job.hours; // This represents the time credits to be transferred

        // 1. Update Application status
        application.status = 'completed';
        await application.save();

        // 2. Transfer Credits: Poster loses credits, Seeker gains credits
        await User.findByIdAndUpdate(job.poster, { $inc: { credits: -creditsToTransfer } });
        await User.findByIdAndUpdate(application.seekerId, { $inc: { credits: creditsToTransfer } });

        res.json({ message: 'Job completed and credits transferred', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all applications for jobs posted by this user (Poster)
// @route   GET /api/applications/poster
// @access  Private (Poster)
const getPosterApplications = async (req, res) => {
    try {
        const jobs = await Job.find({ poster: req.user.id });
        const jobIds = jobs.map(j => j._id);

        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('seekerId', 'name email skills rating')
            .populate('jobId', 'title status');

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update application status (accept/reject)
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
            return res.status(401).json({ message: 'Not authorized to update this application' });
        }

        if (action === 'accept') {
            application.status = 'accepted';
        } else if (action === 'reject') {
            application.status = 'rejected';
        } else {
            return res.status(400).json({ message: 'Invalid action. Must be accept or reject.' });
        }

        await application.save();

        // --- AUTOMATED MESSAGING ---
        // Notify the seeker about the status update
        await Message.create({
            sender: req.user.id,
            receiver: application.seekerId,
            content: `Your application for "${application.jobId.title}" has been ${action}ed.`,
            isSystemMessage: true
        });

        await Notification.create({
            user: application.seekerId,
            title: 'Application Update!',
            message: `Your application for "${application.jobId.title}" has been ${action}ed.`,
            type: 'application_update',
            jobId: application.jobId._id
        });
        // ---------------------------

        res.json({ message: `Application ${action}ed successfully`, application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const cancelApplication = async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Only the seeker who applied can cancel
        if (application.seekerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized to cancel this application' });
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
    updateApplicationStatus
};