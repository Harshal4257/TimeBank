// backend/models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requiredSkills: { type: [String], required: true }, // Keep for Matching
    category: { 
        type: String, 
        enum: ['Programming', 'Design', 'Data Analytics', 'Business', 'Other'],
        required: true 
    }, // Added from Task model
    hours: { type: Number, required: true }, // Added from Task model
    hourlyRate: { type: Number, required: true },
    poster: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, default: 'Open' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);