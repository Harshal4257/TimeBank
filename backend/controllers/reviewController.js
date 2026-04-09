const Review = require('../models/Review');
const User = require('../models/User');
const Application = require('../models/Application');

// @desc    Add a review for a completed job
// @route   POST /api/reviews
// @access  Private (Seeker)
const addReview = async (req, res) => {
    const { jobId, revieweeId, rating, comment } = req.body;
    try {
        // Check seeker actually completed this job
        const application = await Application.findOne({
            jobId,
            seekerId: req.user.id,
            status: 'completed'
        });
        if (!application) {
            return res.status(403).json({ message: 'You can only review jobs you have completed' });
        }

        // Prevent duplicate reviews
        const existing = await Review.findOne({ jobId, reviewerId: req.user.id });
        if (existing) {
            return res.status(400).json({ message: 'You have already reviewed this job' });
        }

        const review = await Review.create({
            jobId,
            reviewerId: req.user.id,
            revieweeId,
            rating,
            comment
        });

        // Recalculate reviewee's average rating
        const allReviews = await Review.find({ revieweeId });
        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        await User.findByIdAndUpdate(revieweeId, {
            rating: parseFloat(avgRating.toFixed(1)),
            numReviews: allReviews.length
        });

        const populated = await Review.findById(review._id)
            .populate('reviewerId', 'name')
            .populate('jobId', 'title');

        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get reviews written by current seeker
// @route   GET /api/reviews/my
// @access  Private
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewerId: req.user.id })
            .populate('reviewerId', 'name')
            .populate('jobId', 'title')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all reviews for a specific job
// @route   GET /api/reviews/job/:jobId
// @access  Public
const getJobReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ jobId: req.params.jobId })
            .populate('reviewerId', 'name')
            .populate('jobId', 'title')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        if (review.reviewerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        review.rating = req.body.rating ?? review.rating;
        review.comment = req.body.comment ?? review.comment;
        await review.save();

        // Recalculate rating
        const allReviews = await Review.find({ revieweeId: review.revieweeId });
        const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
        await User.findByIdAndUpdate(review.revieweeId, {
            rating: parseFloat(avgRating.toFixed(1)),
            numReviews: allReviews.length
        });

        const populated = await Review.findById(review._id)
            .populate('reviewerId', 'name')
            .populate('jobId', 'title');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        if (review.reviewerId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const revieweeId = review.revieweeId;
        await review.deleteOne();

        // Recalculate rating after deletion
        const allReviews = await Review.find({ revieweeId });
        if (allReviews.length > 0) {
            const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
            await User.findByIdAndUpdate(revieweeId, {
                rating: parseFloat(avgRating.toFixed(1)),
                numReviews: allReviews.length
            });
        } else {
            await User.findByIdAndUpdate(revieweeId, { rating: 0, numReviews: 0 });
        }

        res.json({ message: 'Review deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addReview, getMyReviews, getJobReviews, updateReview, deleteReview };