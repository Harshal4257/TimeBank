const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    const { title, description, category, hours } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (user.credits < hours) {
            return res.status(400).json({ message: 'Insufficient credits' });
        }

        const task = await Task.create({ poster: req.user.id, title, description, category, hours });

        // DEDUCT THE HOURS HERE
        user.credits -= hours; 
        await user.save();

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all available tasks
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
    try {
        // Fetch tasks and "populate" the poster's name so we know who created it
        const tasks = await Task.find({ status: 'Open' })
            .populate('poster', 'name')
            .sort({ createdAt: -1 });

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createTask,
    getTasks,
};