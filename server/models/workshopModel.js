const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    summary: {
        type: String,
        default: '',
        trim: true
    },
    startAt: {
        type: Date,
        required: true
    },
    durationMinutes: {
        type: Number,
        default: 60
    },
    attendeesCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    mode: {
        type: String,
        default: 'Live'
    },
    coverImage: {
        type: String,
        default: ''
    },
    accentColor: {
        type: String,
        default: 'from-purple-600 to-pink-600'
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Workshop', WorkshopSchema);
