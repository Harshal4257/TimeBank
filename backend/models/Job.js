const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    requiredSkills: { 
        type: [String], // Important for the Matching Algorithm
        required: true 
    },
    hourlyRate: { 
        type: Number, 
        required: true 
    },
    poster: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // Links this job to the specific User who posted it
        required: true 
    },
    status: { 
        type: String, 
        enum: ['Open', 'In Progress', 'Completed', 'Closed'], 
        default: 'Open' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Job', jobSchema);