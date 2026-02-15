const Job = require('../models/Job');
const calculateMatchScore = require('../utils/matchSkills');

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
            poster: req.user.id 
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

// @desc    Get jobs ranked by skill match for the logged-in user
// @route   GET /api/jobs/recommendations
// @access  Private
const getRecommendedJobs = async (req, res) => {
    try {
        const user = req.user; 
        const jobs = await Job.find();

        const recommendations = jobs.map(job => {
            const score = calculateMatchScore(user.skills, job.requiredSkills);
            return { ...job._doc, matchScore: score };
        });

        // Sort: Highest match score first
        recommendations.sort((a, b) => b.matchScore - a.matchScore);

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export ALL functions so the router can use them
module.exports = {
    createJob,
    getJobs,
    getJobById,
    getRecommendedJobs // <--- This was missing!
};