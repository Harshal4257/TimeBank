const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    poster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { 
        type: String, 
        enum: ['Programming', 'Design', 'Data Analytics', 'Business', 'Other'],
        required: true 
    },
    hours: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Open', 'In Progress', 'Completed'], 
        default: 'Open' 
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);