const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User'); // 1. Added this missing import!

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

const updateApplicationStatus = async (req, res) => {
    try {
        const { id, action } = req.params;

        const application = await Application.findById(id).populate('jobId');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const job = application.jobId;

        // Ensure only the poster can update the status
        if (job.poster.toString() !== req.user.id.toString()) {
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
        res.json({ message: `Application ${action}ed successfully`, application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPosterApplications = async (req, res) => {
    try {
        // 1. Find all jobs posted by this user
        const myJobs = await Job.find({ poster: req.user.id });
        const jobIds = myJobs.map(job => job._id);

        // 2. Find all applications for those jobs
        const applications = await Application.find({ jobId: { $in: jobIds } })
            .populate('seekerId', 'name email skills rating')
            .populate('jobId', 'title status');

        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForJob,
    getJobApplications,
    getMyApplications,
    getPosterApplications,
    completeJob,
    updateApplicationStatus
};