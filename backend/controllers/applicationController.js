const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Seeker)
const applyForJob = async (req, res) => {
    try {
        const jobId = req.params.jobId;
        const seekerId = req.user.id; // From auth middleware

        // 1. Check if already applied
        const existingApplication = await Application.findOne({ jobId, seekerId });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        // 2. Create Application
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
            .populate('seekerId', 'name email skills rating'); // Get applicant details
        
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
            .populate('jobId', 'title hourlyRate status'); // Get job details
        
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    applyForJob,
    getJobApplications,
    getMyApplications
};