const Job = require('../models/Job');
const SavedJob = require('../models/SavedJob');
const User = require('../models/User');
const Message = require('../models/Message');
const Notification = require('../models/Notification');
const Application = require('../models/Application');
const calculateMatchScore = require('../utils/matchSkills');

// ─────────────────────────────────────────────────────────────
// Helper: returns IDs of ALL jobs whose deadline has passed.
// These are hidden from ALL seeker-facing listing endpoints.
// ─────────────────────────────────────────────────────────────
const getExpiredJobIds = async () => {
    const now = new Date();
    const expiredJobs = await Job.find(
        { deadline: { $lt: now } },
        '_id'
    ).lean();
    return new Set(expiredJobs.map(j => j._id.toString()));
};

// @desc    Create a new job (Now includes category and hours from Task model)
// @route   POST /api/jobs
// @access  Private (Poster only)
const createJob = async (req, res) => {
    // Added category and hours to destructuring
    const { title, description, requiredSkills, hourlyRate, category, hours, location, workLocation, deadline } = req.body;

    try {
        const job = await Job.create({
            title,
            description,
            requiredSkills,
            hourlyRate,
            category, // From old Task model
            hours,    // From old Task model
            location,
            workLocation,
            deadline,
            poster: req.user.id
        });

        // --- AUTOMATED MESSAGING: notify matching seekers ---
        const poster = await User.findById(req.user.id);
        const seekers = await User.find({ role: 'Seeker' });

        for (const seeker of seekers) {
            const score = calculateMatchScore(seeker.skills || [], requiredSkills);
            if (score >= 0.4) { // 40% match threshold
                await Message.create({
                    sender: req.user.id,
                    receiver: seeker._id,
                    content: `${poster.name} posted a new job: "${title}" which matches your skills!`,
                    isSystemMessage: true
                });
                await Notification.create({
                    user: seeker._id,
                    title: 'New Job Match!',
                    message: `${poster.name} posted a new job: "${title}" which matches your skills!`,
                    type: 'job_match',
                    jobId: job._id
                });
            }
        }
        // ----------------------------------------------------

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

// @desc    Get all jobs (Generic feed — Seeker Marketplace)
const getJobs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Hide all deadline-expired jobs from seeker listings
        const expiredIds = await getExpiredJobIds();

        const baseFilter = req.user ? { poster: { $ne: req.user.id } } : {};
        if (expiredIds.size > 0) {
            baseFilter._id = { $nin: [...expiredIds] };
        }

        const [jobs, total] = await Promise.all([
            Job.find(baseFilter)
                .populate('poster', 'name email rating numReviews')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Job.countDocuments(baseFilter)
        ]);

        res.json({
            jobs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('poster', 'name email');
        if (!job) return res.status(404).json({ message: 'Job not found' });

        // If deadline has passed, check if this seeker has an application.
        // If no application exists → job is expired for this seeker.
        if (job.deadline && new Date(job.deadline) < new Date() && req.user) {
            const existingApp = await Application.findOne({
                jobId: job._id,
                seekerId: req.user.id
            });
            if (!existingApp) {
                return res.status(404).json({ message: 'This job listing has expired.' });
            }
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get matching jobs for Seeker Dashboard
const getMatchingJobs = async (req, res) => {
    try {
        const userSkills = req.user.skills || [];
        console.log("DEBUG: Seeker Skills:", userSkills);

        // Hide all deadline-expired jobs
        const expiredIds = await getExpiredJobIds();

        const filter = { poster: { $ne: req.user.id } };
        if (expiredIds.size > 0) {
            filter._id = { $nin: [...expiredIds] };
        }

        const allJobs = await Job.find(filter)
            .populate('poster', 'name email rating numReviews');

        console.log("DEBUG: Jobs available for matching:", allJobs.length);

        const matchingJobs = allJobs.map(job => {
            const score = calculateMatchScore(userSkills, job.requiredSkills);
            return { ...job._doc, matchScore: Math.round(score * 100) };
        });

        matchingJobs.sort((a, b) => b.matchScore - a.matchScore);

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
        // Exclude all deadline-expired jobs from saved list
        const expiredIds = await getExpiredJobIds();

        const savedJobs = await SavedJob.find({ seeker: req.user.id })
            .populate({ path: 'job', populate: { path: 'poster', select: 'name email' } });

        const visibleJobs = savedJobs
            .map(s => s.job)
            .filter(job => job && !expiredIds.has(job._id.toString()));

        res.json(visibleJobs);
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

// @desc    Update a job status
// @route   PUT /api/jobs/:id/status
// @access  Private (Poster only)
const updateJobStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.poster.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        job.status = status;
        await job.save();

        res.json(job);
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
    deleteJob,
    updateJobStatus,
};