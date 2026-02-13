const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['Poster', 'Seeker', 'Admin'], // Restricts role to these 3 options
        default: 'Seeker' 
    },
    skills: {
        type: [String], // Array of strings (e.g., ["Python", "React"])
        default: []
    },
    rating: { 
        type: Number, 
        default: 0 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', userSchema);