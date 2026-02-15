const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true // Ensures email matching isn't case-sensitive
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['Poster', 'Seeker', 'Admin'], 
        default: 'Seeker' 
    },
    skills: {
        type: [String], 
        default: []
    },
    bio: {
        type: String,
        default: ""
    },
    rating: { 
        type: Number, 
        default: 0 
    },
    numReviews: {
        type: Number,
        default: 0
    },
    // The "Time Currency" - ensure this is what the frontend asks for
    credits: {
        type: Number,
        default: 30, 
        min: 0 // Prevents credits from accidentally going negative
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true // Automatically manages createdAt and updatedAt
});

module.exports = mongoose.model('User', userSchema);