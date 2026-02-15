const Review = require('../models/Review');
const User = require('../models/User');

const addReview = async (req, res) => {
    const { jobId, revieweeId, rating, comment } = req.body;

    try {
        // 1. Save the new review
        const review = await Review.create({
            jobId,
            reviewerId: req.user.id,
            revieweeId,
            rating,
            comment
        });

        // 2. Recalculate the Reviewee's average rating
        const reviews = await Review.find({ revieweeId });
        const numReviews = reviews.length;
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        // 3. Update the User profile
        await User.findByIdAndUpdate(revieweeId, {
            rating: avgRating.toFixed(1),
            numReviews: numReviews
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { addReview };