const express = require('express');
const router = express.Router();
const { addReview, getMyReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addReview);
router.get('/my', protect, getMyReviews);

module.exports = router;