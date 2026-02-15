const express = require('express');
const router = express.Router();
const { createTask, getTasks } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createTask);
router.get('/', getTasks);

module.exports = router; // Make sure this line is exactly like this