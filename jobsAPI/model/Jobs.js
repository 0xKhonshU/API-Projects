const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Please provide a company'],
        maxlength: 50
    },
    stauts: {
        type: String,
        enum: ['pending', 'interview', 'declined'],
        default: 'pending'
    },
    position: {
        type: String,
        required: [true, 'Please provide a position'],
        maxLength: 100
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a user']
    }
}, { timestamps: true });

module.exports = mongoose.model('Jobs', jobSchema);