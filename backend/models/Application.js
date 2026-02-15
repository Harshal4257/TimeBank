const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job', // Links to the Job model
        required: true
    },
    seekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the User (Seeker) model
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'], // Tracks the application state
        default: 'Pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);