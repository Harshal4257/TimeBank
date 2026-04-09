const express = require('express');
const router = express.Router();
const { addReview, getMyReviews, getJobReviews, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my', protect, getMyReviews);
router.get('/job/:jobId', getJobReviews);   // public — anyone can read reviews
router.post('/', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;