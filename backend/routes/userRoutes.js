const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Route for User Registration
router.post('/register', registerUser);

// Route for User Login
router.post('/login', loginUser);

module.exports = router;