const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. Register
const registerUser = async (req, res) => {
    const { name, email, password, role, skills } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({ name, email, password: hashedPassword, role, skills, credits: 30 });

        res.status(201).json({
            token: generateToken(user.id),
            user: { _id: user.id, name: user.name, email: user.email, role: user.role, skills: user.skills || [], credits: user.credits || 0 }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                token: generateToken(user.id),
                user: { _id: user.id, name: user.name, email: user.email, role: user.role, skills: user.skills || [], credits: user.credits || 0 }
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Get own profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({
            _id: user.id, name: user.name, email: user.email,
            credits: user.credits, role: user.role,
            avatarUrl: user.avatarUrl || '', skills: user.skills || [],
            bio: user.bio || '', location: user.location || '', currentRole: user.currentRole || ''
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 4. Update profile — uses findByIdAndUpdate to avoid validating unrelated fields (e.g. credits)
const updateUserProfile = async (req, res) => {
    try {
        const { name, location, currentRole, skills, bio } = req.body;

        const updates = {};
        if (name !== undefined) updates.name = name;
        if (location !== undefined) updates.location = location;
        if (currentRole !== undefined) updates.currentRole = currentRole;
        if (skills !== undefined) updates.skills = Array.isArray(skills) ? skills : [];
        if (bio !== undefined) updates.bio = bio;

        // runValidators: false prevents credits min:0 from blocking the save
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: false }
        ).select('-password');

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            _id: user.id, name: user.name, email: user.email,
            credits: user.credits, role: user.role,
            avatarUrl: user.avatarUrl || '', skills: user.skills,
            bio: user.bio, location: user.location, currentRole: user.currentRole
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. Upload profile photo
const uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const avatarUrl = `/uploads/profile-photos/${req.file.filename}`;

        // Use findByIdAndUpdate to avoid credits validation
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { avatarUrl } },
            { new: true, runValidators: false }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'Profile photo updated', avatarUrl: user.avatarUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. Get user by ID (public)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({
            _id: user.id, name: user.name, email: user.email,
            credits: user.credits, role: user.role,
            avatarUrl: user.avatarUrl || '', skills: user.skills || [],
            bio: user.bio || '', location: user.location || '',
            currentRole: user.currentRole || '',
            rating: user.rating, numReviews: user.numReviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile, uploadProfilePhoto, getUserById };