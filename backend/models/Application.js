const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    seekerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'submitted', 'completed', 'revision_requested'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },

    // ✅ Saved when poster accepts (for record keeping)
    acceptedAt: {
        type: Date,
        default: null
    },

    // ✅ Timer starts when seeker clicks "Start Work"
    timerStartedAt: {
        type: Date,
        default: null
    },

    // Poster shares work with seeker
    posterInstructions: {
        type: String,
        default: ''
    },
    posterFiles: [
        {
            url: { type: String },
            originalName: { type: String },
            uploadedAt: { type: Date, default: Date.now }
        }
    ],

    // Seeker submits completed work
    submissionNotes: {
        type: String,
        default: ''
    },
    submissionFiles: [
        {
            url: { type: String },
            originalName: { type: String },
            uploadedAt: { type: Date, default: Date.now }
        }
    ],
    submittedAt: {
        type: Date,
        default: null
    },

    // Revision request by poster
    revisionFeedback: {
        type: String,
        default: ''
    },
    revisionDeadline: {
        type: Date,
        default: null
    },
    revisionCount: {
        type: Number,
        default: 0
    },

    // Payment info
    paymentAmount: {
        type: Number,
        default: 0
    },
    paidAt: {
        type: Date,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);