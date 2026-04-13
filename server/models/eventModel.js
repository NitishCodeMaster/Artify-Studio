const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    bannerImage: {
        type: String,
        default: ""
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['Music', 'Dance', 'Art', 'Workshop'],
        default: "General"
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isLive: {
        type: Boolean,
        default: false
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    maxSeats: {
        type: Number,
        default: 100
    },
    trailerUrl: {
        type: String,
        default: ""
    },
    payments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        paymentId: String,
        orderId: String,
        amount: Number,
        status: {
            type: String,
            enum: ['created', 'paid', 'failed'],
            default: 'created'
        }
    }],

    reviews: [reviewSchema],
    averageRating: {
        type: Number,
        default: 0
    },
    numReviews: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
module.exports = mongoose.model('Event', eventSchema);
