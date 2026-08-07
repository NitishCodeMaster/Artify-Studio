const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        default: 'good'
    },
    images: [
        {
            public_id: { type: String },
            url: { type: String, required: true }
        }
    ],
    videos: [
        {
            public_id: { type: String },
            url: { type: String },
            duration: { type: Number }
        }
    ],
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    location: {
        type: String,
        default: 'Chandigarh'
    },
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null
    },
    sellerStoreName: {
        type: String,
        default: ''
    },
    sellerProfession: {
        type: String,
        default: 'Artisan & Creator'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);
