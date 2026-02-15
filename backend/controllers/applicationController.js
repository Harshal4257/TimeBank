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
            status: 'Pending'
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
        const hours = job.hourlyRate; // This represents the time credits to be transferred

        // 1. Update Application status
        application.status = 'Completed';
        await application.save();

        // 2. Transfer Credits: Poster loses hours, Seeker gains hours
        await User.findByIdAndUpdate(job.poster, { $inc: { credits: -hours } });
        await User.findByIdAndUpdate(application.seekerId, { $inc: { credits: hours } });

        res.json({ message: 'Job completed and credits transferred', application });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForJob,
    getJobApplications,
    getMyApplications,
    completeJob
};