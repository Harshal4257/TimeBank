const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware'); // Ensure this path is correct

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private/Protected Route - This is what the Dashboard needs!
router.get('/profile', protect, getUserProfile);

module.exports = router;