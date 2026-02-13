const Job = require('../models/Job');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Poster only)
const createJob = async (req, res) => {
    const { title, description, requiredSkills, hourlyRate } = req.body;

    try {
        const job = await Job.create({
            title,
            description,
            requiredSkills,
            hourlyRate,
            poster: req.user.id // This comes from the 'protect' middleware!
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: 'Invalid job data' });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        // .populate('poster', 'name email') replaces the ID with actual user info
        const jobs = await Job.find().populate('poster', 'name email');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('poster', 'name email');

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createJob,
    getJobs,
    getJobById,
};