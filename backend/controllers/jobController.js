const Job = require('../models/Job');
const SavedJob = require('../models/SavedJob');
const calculateMatchScore = require('../utils/matchSkills');

// @desc    Create a new job (Now includes category and hours from Task model)
// @route   POST /api/jobs
// @access  Private (Poster only)
const createJob = async (req, res) => {
    // Added category and hours to destructuring
    const { title, description, requiredSkills, hourlyRate, category, hours } = req.body;

    try {
        const job = await Job.create({
            title,
            description,
            requiredSkills,
            hourlyRate,
            category, // From old Task model
            hours,    // From old Task model
            poster: req.user.id 
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: 'Invalid job data' });
    }
};

// @desc    Get jobs created by the logged-in Poster
// @route   GET /api/jobs/my-jobs
// @access  Private (Poster only)
const getPosterJobs = async (req, res) => {
    try {
        console.log("DEBUG: Logged in User ID:", req.user.id);
        
        // Temporarily remove all filters to see if ANY jobs exist
        const allJobsInDB = await Job.find({});
        console.log("DEBUG: Total jobs existing in DB:", allJobsInDB.length);

        // Now check for this specific poster
        const jobs = await Job.find({ poster: req.user.id });
        console.log("DEBUG: Jobs found for this specific poster:", jobs.length);

        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs (Generic feed)
const getJobs = async (req, res) => {
    try {
        const query = req.user ? { poster: { $ne: req.user.id } } : {};
        const jobs = await Job.find(query).populate('poster', 'name email');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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

// @desc    Get matching jobs for Seeker Dashboard
const getMatchingJobs = async (req, res) => {
    try {
        const userSkills = req.user.skills || [];
        console.log("DEBUG: Seeker Skills:", userSkills);

        // Change this line to remove the 'status' filter temporarily
        const allJobs = await Job.find({ 
            poster: { $ne: req.user.id } 
            // status: 'Open'  <-- Comment this out!
        }).populate('poster', 'name email');
        
        console.log("DEBUG: Jobs available for matching:", allJobs.length);

        const matchingJobs = allJobs.map(job => {
            const score = calculateMatchScore(userSkills, job.requiredSkills);
            return { ...job._doc, matchScore: Math.round(score * 100) };
        });

        res.json(matchingJobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Save/Unsave Logic
const saveJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const existingSave = await SavedJob.findOne({ seeker: req.user.id, job: jobId });
        if (existingSave) return res.status(400).json({ message: 'Job already saved' });

        const savedJob = await SavedJob.create({ seeker: req.user.id, job: jobId });
        res.status(201).json({ message: 'Job saved successfully', savedJob });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const unsaveJob = async (req, res) => {
    try {
        await SavedJob.findOneAndDelete({ seeker: req.user.id, job: req.params.jobId });
        res.json({ message: 'Job unsaved successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSavedJobs = async (req, res) => {
    try {
        const savedJobs = await SavedJob.find({ seeker: req.user.id })
            .populate({ path: 'job', populate: { path: 'poster', select: 'name email' } });
        res.json(savedJobs.map(s => s.job));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get top recommended jobs (Cosine Similarity)
// @route   GET /api/jobs/recommendations
// @access  Private
const getRecommendedJobs = async (req, res) => {
    try {
        const userSkills = req.user.skills || [];
        
        // Fetch a limited number of active jobs
        const jobs = await Job.find({ 
            status: 'Open', 
            poster: { $ne: req.user.id } 
        }).limit(10).populate('poster', 'name email');

        const recommendations = jobs.map(job => {
            const score = calculateMatchScore(userSkills, job.requiredSkills);
            return { 
                ...job._doc, 
                matchScore: Math.round(score * 100) 
            };
        });

        // Sort by highest match
        recommendations.sort((a, b) => b.matchScore - a.matchScore);

        res.json(recommendations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Poster only)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Make sure the logged-in user is the owner of the job
        if (job.poster.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to update this job' });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Poster only)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Make sure the logged-in user is the owner
        if (job.poster.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await job.deleteOne();
        res.json({ message: 'Job removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Export ALL functions
// At the bottom of controllers/jobController.js
module.exports = {
    createJob,
    getJobs,
    getJobById,
    getMatchingJobs,
    getPosterJobs, // <--- Double check this is here!
    saveJob,
    unsaveJob,
    getSavedJobs,
    getRecommendedJobs, 
    updateJob, 
    deleteJob ,
};