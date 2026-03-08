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
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['gear', 'tribal', 'digital', 'instrument', 'other'],
        default: 'other'
    },
    images: [
        {
            url: {
                type: String,
                required: true
            }
        }
    ],
    // Ye batayega ki kis seller ne upload kiya
    seller: {
        type: mongoose.Schema.ObjectId,
        ref: "Seller"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", productSchema);