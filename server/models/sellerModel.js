const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SellerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        select: false
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    profilePic: {
        type: String,
        default: ""
    },

    shopName: {
        type: String,
        required: true,
        trim: true
    },

    shopImage: {
        type: String,
        default: ""
    },

    shopAddress: {
        type: String,
        required: true,
        trim: true,
        default: ""
    },

    role: {
        type: String,
        default: "seller"
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],  // [longitude, latitude]
            required: true,
            default: [0, 0]
        }
    },
}, { timestamps: true });

SellerSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


SellerSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Seller', SellerSchema);
