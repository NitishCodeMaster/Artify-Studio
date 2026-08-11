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
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null
    },
    category: {
        type: String,
        enum: ['Music', 'Dance', 'Art', 'General'],
        default: "General"
    },
    gigType: {
        type: String,
        enum: ['free', 'paid_gig', 'ticketed'],
        default: 'free'
    },
    artistPayout: {
        type: Number,
        default: 0
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    applicants: [{
        artist: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['applied', 'selected', 'rejected'],
            default: 'applied'
        },
        message: {
            type: String,
            default: ""
        },
        demoVideoUrl: {
            type: String,
            default: ""
        },
        demoAudioUrl: {
            type: String,
            default: ""
        },
        appliedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isLive: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    archivedAt: {
        type: Date,
        default: null
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

    tickets: [{
        ticketCode: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        qrToken: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['valid', 'checked_in', 'cancelled'],
            default: 'valid'
        },
        checkedInAt: {
            type: Date,
            default: null
        },
        createdAt: {
            type: Date,
            default: Date.now
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

eventSchema.index({ date: 1, status: 1 });
eventSchema.index({ category: 1, date: 1 });
eventSchema.index({ organizer: 1 });

module.exports = mongoose.model('Event', eventSchema);
