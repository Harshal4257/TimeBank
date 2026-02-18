const Job = require('../models/Job');
const SavedJob = require('../models/SavedJob');
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

// @desc    Get jobs matching seeker skills
// @route   GET /api/jobs/match
// @access  Private (Seeker only)
const getMatchingJobs = async (req, res) => {
    try {
        const user = req.user;
        
        // Get all jobs
        const allJobs = await Job.find().populate('poster', 'name email');
        
        // Calculate match scores and filter jobs with at least one matching skill
        const matchingJobs = allJobs.map(job => {
            const score = calculateMatchScore(user.skills, job.requiredSkills);
            return { ...job._doc, matchScore: score };
        }).filter(job => job.matchScore > 0) // Only include jobs with matching skills
        .sort((a, b) => b.matchScore - a.matchScore); // Sort by highest match first
        
        res.json(matchingJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Save a job for later
// @route   POST /api/jobs/save/:jobId
// @access  Private (Seeker only)
const saveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const seekerId = req.user.id;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if already saved
        const existingSave = await SavedJob.findOne({ seeker: seekerId, job: jobId });
        if (existingSave) {
            return res.status(400).json({ message: 'Job already saved' });
        }

        // Save the job
        const savedJob = await SavedJob.create({
            seeker: seekerId,
            job: jobId
        });

        res.status(201).json({ message: 'Job saved successfully', savedJob });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Unsave a job
// @route   DELETE /api/jobs/save/:jobId
// @access  Private (Seeker only)
const unsaveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const seekerId = req.user.id;

        // Find and remove the saved job
        const savedJob = await SavedJob.findOneAndDelete({ seeker: seekerId, job: jobId });
        
        if (!savedJob) {
            return res.status(404).json({ message: 'Saved job not found' });
        }

        res.json({ message: 'Job unsaved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get saved jobs for a seeker
// @route   GET /api/jobs/saved
// @access  Private (Seeker only)
const getSavedJobs = async (req, res) => {
    try {
        const seekerId = req.user.id;

        // Get all saved jobs for this seeker
        const savedJobs = await SavedJob.find({ seeker: seekerId })
            .populate({
                path: 'job',
                populate: {
                    path: 'poster',
                    select: 'name email'
                }
            })
            .sort({ savedAt: -1 });

        // Extract just the job data
        const jobs = savedJobs.map(savedJob => savedJob.job);

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export ALL functions so the router can use them
module.exports = {
    createJob,
    getJobs,
    getJobById,
    getRecommendedJobs, // <--- This was missing!
    getMatchingJobs, // New matching jobs function
    saveJob, // Save job function
    unsaveJob, // Unsave job function
    getSavedJobs // Get saved jobs function
};