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
    portfolio: {
        isPublished: {
            type: Boolean,
            default: false
        },
        headline: {
            type: String,
            default: '',
            trim: true
        },
        coverImage: {
            type: String,
            default: ''
        },
        about: {
            type: String,
            default: '',
            trim: true
        },
        skills: [{
            type: String,
            trim: true
        }],
        services: [{
            type: String,
            trim: true
        }],
        featuredWorks: [{
            title: { type: String, default: '', trim: true },
            image: { type: String, default: '' },
            description: { type: String, default: '', trim: true },
            link: { type: String, default: '', trim: true }
        }],
        contactEmail: {
            type: String,
            default: '',
            trim: true
        },
        isAvailableForWork: {
            type: Boolean,
            default: true
        }
    },
    mentorProfile: {
        isMentor: {
            type: Boolean,
            default: false
        },
        mentorSlug: {
            type: String,
            unique: true,
            sparse: true,
            trim: true
        },
        headline: {
            type: String,
            default: '',
            trim: true
        },
        primarySkill: {
            type: String,
            default: '',
            trim: true
        },
        sessionTag: {
            type: String,
            default: '',
            trim: true
        },
        hourlyRate: {
            type: Number,
            default: 0
        },
        rating: {
            type: Number,
            default: 4.8,
            min: 0,
            max: 5
        },
        totalStudents: {
            type: Number,
            default: 0
        },
        totalSessions: {
            type: Number,
            default: 0
        },
        yearsExperience: {
            type: Number,
            default: 0
        },
        languages: [{
            type: String,
            trim: true
        }],
        mentorshipModes: [{
            type: String,
            trim: true
        }],
        tags: [{
            type: String,
            trim: true
        }],
        coverImage: {
            type: String,
            default: ''
        },
        accentColor: {
            type: String,
            default: 'indigo'
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        availableForBooking: {
            type: Boolean,
            default: true
        }
    },
    sellerProfile: {
        storeName: {
            type: String,
            default: '',
            trim: true
        },
        sellerCategory: {
            type: String,
            default: 'Creator & Artisan',
            trim: true
        },
        location: {
            type: String,
            default: '',
            trim: true
        },
        latitude: {
            type: Number,
            default: null
        },
        longitude: {
            type: Number,
            default: null
        },
        isVerifiedSeller: {
            type: Boolean,
            default: true
        }
    },
    savedItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    walletBalance: {
        type: Number,
        default: 0
    },
    transactions: [{
        title: String,
        amount: Number,
        type: { type: String, enum: ['credit', 'debit'] },
        date: { type: Date, default: Date.now }
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
