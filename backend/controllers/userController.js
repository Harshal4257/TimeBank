const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// 1. Register User
const registerUser = async (req, res) => {
    const { name, email, password, role, skills } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name, email, password: hashedPassword, role, skills,
            credits: 30 // Explicitly setting 30 for new users
        });

        if (user) {
            res.status(201).json({
                _id: user.id, name: user.name, email: user.email,
                role: user.role, token: generateToken(user.id)
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id, name: user.name, email: user.email,
                role: user.role, token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get User Profile (The missing piece for your Dashboard)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            res.json({
                _id: user.id,
                name: user.name,
                credits: user.credits, // This sends the 30 hours!
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Exporting all three functions
module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};