const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
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
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    profilePic: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        trim: true
    },
    role: {
        type: String,
        default: "Artist"
    },
    bio: {
        type: String,
        default: '',
        maxLength: [250, "Bio cannot exceed 250 characters"]
    },
    artStyle: {
        type: String,
        default: '',
    },
    originLocation: {
        type: String,
        default: '',
    },
    experience: {
        type: String,
        default: '',
    },
    socialLinks: {
        instagram: { type: String, default: '' },
        youtube: { type: String, default: '' },
        portfolioUrl: { type: String, default: '' }
    },
    savedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    resetPasswordToken: String,
    resetPasswordExpire: Date,

}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);