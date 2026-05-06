const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        default: ''
    },
    image: {
        type: String,
    },
    voiceIntro: {
        url: {
            type: String,
            default: ''
        },
        duration: {
            type: Number,
            default: 0
        },
        mimeType: {
            type: String,
            default: ''
        }
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    comments: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    category: {
        type: String,
        default: 'General'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Post', postSchema);
