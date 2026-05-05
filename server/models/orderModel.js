const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    razorpay_payment_id: {
        type: String,
        required: true
    },
    razorpay_order_id: {
        type: String,
        required: true
    },
    eventId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Event',
        default: null
    },
    workshopId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Workshop',
        default: null
    },
    status: {
        type: String,
        default: 'Processing' 
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
