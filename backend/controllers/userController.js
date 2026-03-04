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
            credits: 30
        });

        if (user) {
            // UPDATED: Wrapped user details in a 'user' object for Frontend
            res.status(201).json({
                token: generateToken(user.id),
                user: {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    skills: user.skills || []
                }
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
            // UPDATED: Wrapped user details in a 'user' object for Frontend
            res.json({
                token: generateToken(user.id),
                user: {
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    skills: user.skills || []
                }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                credits: user.credits,
                role: user.role,
                avatarUrl: user.avatarUrl || '',
                skills: user.skills || [],
                bio: user.bio || '',
                location: user.location || '',
                currentRole: user.currentRole || ''
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Update User Profile
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, location, currentRole, skills, bio } = req.body;
        if (name !== undefined) user.name = name;
        if (location !== undefined) user.location = location;
        if (currentRole !== undefined) user.currentRole = currentRole;
        if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : [];
        if (bio !== undefined) user.bio = bio;

        await user.save();
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            credits: user.credits,
            role: user.role,
            avatarUrl: user.avatarUrl || '',
            skills: user.skills,
            bio: user.bio,
            location: user.location,
            currentRole: user.currentRole
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Upload / update profile photo
const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // File path is provided by multer middleware
        user.avatarUrl = `/uploads/profile-photos/${req.file.filename}`;
        await user.save();

        res.json({
            message: 'Profile photo updated',
            avatarUrl: user.avatarUrl
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Get User By ID (Public Profile)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (user) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                credits: user.credits,
                role: user.role,
                avatarUrl: user.avatarUrl || '',
                skills: user.skills || [],
                bio: user.bio || '',
                location: user.location || '',
                currentRole: user.currentRole || '',
                rating: user.rating,
                numReviews: user.numReviews
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    uploadProfilePhoto,
    getUserById
};