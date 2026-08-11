const userModel = require('../models/userModel');
const Post = require('../models/postModel');
const Product = require('../models/productModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const blacklistToken = require('../models/blacklistTokenModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const buildMentorSlug = (name, userId) => {
    const base = (name || 'mentor')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 32) || 'mentor';

    return `mentor-${base}-${String(userId).slice(-6)}`;
};

const normalizePhone = (value) => {
    const digits = String(value || '').replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    return digits.length > 10 ? digits.slice(-10) : digits;
};

const toList = (value) => {
    if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
    return String(value || '').split(',').map((item) => item.trim()).filter(Boolean);
};

const normalizeFeaturedWorks = (works) => {
    if (!Array.isArray(works)) return [];
    return works
        .slice(0, 6)
        .map((work) => ({
            title: String(work?.title || '').trim(),
            image: String(work?.image || '').trim(),
            description: String(work?.description || '').trim(),
            link: String(work?.link || '').trim()
        }))
        .filter((work) => work.title || work.image || work.description || work.link);
};

const serializePortfolio = (user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    profilePic: user.profilePic,
    role: user.role,
    bio: user.bio,
    artStyle: user.artStyle,
    originLocation: user.originLocation,
    experience: user.experience,
    socialLinks: user.socialLinks,
    portfolio: user.portfolio || {}
});

module.exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, phone, signupAs } = req.body;

        const userExists = await userModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const mentorProfile = signupAs === 'mentor'
            ? {
                isMentor: true,
                headline: 'Helping creators sharpen their craft with practical guidance.',
                primarySkill: 'Creative Mentorship',
                sessionTag: 'Beginner to Confident',
                rating: 4.8,
                availableForBooking: true,
                accentColor: 'indigo',
                mentorshipModes: ['1-on-1', 'Online'],
                tags: ['Creative Mentorship', 'Feedback']
            }
            : undefined;

        const user = await userModel.create({
            name,
            email,
            password,
            phone,
            role: signupAs === 'mentor' ? 'Creative Mentorship' : 'Artist',
            mentorProfile
        });

        if (signupAs === 'mentor') {
            user.mentorProfile.mentorSlug = buildMentorSlug(user.name, user._id);
            await user.save();
        }


        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                role: user.role,
                mentorProfile: user.mentorProfile,
            },
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.loginUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, loginAs } = req.body;

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        if (loginAs === 'mentor' && !user.mentorProfile?.isMentor) {
            const mentorProfile = user.mentorProfile || {};
            mentorProfile.isMentor = true;
            mentorProfile.mentorSlug = mentorProfile.mentorSlug || buildMentorSlug(user.name, user._id);
            mentorProfile.headline = mentorProfile.headline || user.bio || 'Helping creators sharpen their craft with practical guidance.';
            mentorProfile.primarySkill = mentorProfile.primarySkill || user.artStyle || user.role || 'Creative Mentorship';
            mentorProfile.sessionTag = mentorProfile.sessionTag || mentorProfile.primarySkill;
            mentorProfile.rating = mentorProfile.rating || 4.8;
            mentorProfile.availableForBooking = true;
            mentorProfile.accentColor = mentorProfile.accentColor || 'indigo';
            mentorProfile.mentorshipModes = mentorProfile.mentorshipModes?.length ? mentorProfile.mentorshipModes : ['1-on-1', 'Online'];
            mentorProfile.tags = mentorProfile.tags?.length ? mentorProfile.tags : [mentorProfile.primarySkill, 'Feedback'];
            user.mentorProfile = mentorProfile;
            await user.save();
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                role: user.role,
                bio: user.bio,
                artStyle: user.artStyle,
                originLocation: user.originLocation,
                experience: user.experience,
                mentorProfile: user.mentorProfile,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.logoutUser = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (token) {
            await blacklistToken.create({ token });
        }

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.status(200).json({ message: "User logged out successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

exports.updateUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let profilePicUrl = user.profilePic;
        if (req.body.profilePic && req.body.profilePic !== '') {
            profilePicUrl = req.body.profilePic;
        }

        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.role = req.body.role || user.role;
        user.phone = normalizePhone(req.body.phoneNumber || req.body.phone) || user.phone;
        user.profilePic = profilePicUrl;

        user.originLocation = req.body.originLocation || user.originLocation;
        user.artStyle = req.body.artStyle || user.artStyle;
        user.experience = req.body.experience || user.experience;

        if (req.body.socialLinks) {
            user.socialLinks = {
                ...(user.socialLinks || {}),
                ...req.body.socialLinks
            };
        }

        if (req.body.portfolio) {
            user.portfolio = {
                ...(user.portfolio || {}),
                ...req.body.portfolio
            };
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully! 🎉",
            user
        });

    } catch (error) {
        console.error("❌ Update Profile Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
module.exports.getTopCreators = async (req, res) => {
    try {
        const topCreators = await userModel.find({ role: 'seller' })
            .select('name role profilePic')
            .limit(5);

        if (topCreators.length === 0) {
            const users = await userModel.find().select('name role profilePic').limit(5);
            return res.status(200).json({ success: true, creators: users });
        }

        res.status(200).json({ success: true, creators: topCreators });
    } catch (error) {
        console.error("❌ Top Creators Error:", error.message);
        res.status(500).json({ success: false, message: "Error fetching creators" });
    }
};

module.exports.getUserProfileById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const posts = await Post.find({ user: userId }).sort({ createdAt: -1 });
        const products = await Product.find({ seller: userId }).sort({ createdAt: -1 });

        // Query actual Artify Event records where this artist was SELECTED by the organizer
        const Event = require('../models/eventModel');
        const selectedGigs = await Event.find({
            'applicants': {
                $elemMatch: {
                    artist: userId,
                    status: 'selected'
                }
            }
        }).populate('organizer', 'name profilePic role').sort({ date: -1 }).lean();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingGigs = selectedGigs.filter(g => new Date(g.date) >= today);
        const pastGigs = selectedGigs.filter(g => new Date(g.date) < today);

        const stats = {
            totalPerformances: pastGigs.length,
            selectedGigsCount: selectedGigs.length,
            upcomingGigsCount: upcomingGigs.length,
            portfolioCount: (user.portfolio?.featuredWorks?.length || 0) + posts.length,
            rating: user.mentorProfile?.rating || 4.8
        };

        res.status(200).json({
            success: true,
            user,
            posts,
            products,
            selectedGigs,
            upcomingGigs,
            pastGigs,
            stats
        });
    } catch (error) {
        console.error("❌ Get User Profile By ID Error:", error);
        res.status(500).json({ success: false, message: "Error fetching user profile" });
    }
};

module.exports.toggleSaveProduct = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const productId = req.params.id;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        console.log("Saving product ID:", productId);
        console.log("Current savedItems before clean:", user.savedItems);
        user.savedItems = user.savedItems.filter(item => item !== null);
        const isSaved = user.savedItems.some(id => id && id.toString() === productId);

        if (isSaved) {
            user.savedItems = user.savedItems.filter(id => id && id.toString() !== productId);
        } else {
            user.savedItems.push(productId);
        }

        await user.save();
        console.log("New saved status:", !isSaved);
        res.status(200).json({
            success: true,
            saved: !isSaved
        });
    } catch (error) {
        console.error("Toggle Save Error:", error);
        res.status(500).json({ success: false, message: "Server error during toggle" });
    }
};

module.exports.getSavedItems = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const user = await userModel.findById(userId).populate('savedItems');
        res.status(200).json({ success: true, savedItems: user.savedItems || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching saved items" });
    }
};

module.exports.getWallet = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            balance: user.walletBalance || 0,
            transactions: (user.transactions || []).reverse()
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching wallet data" });
    }
};

module.exports.getPortfolio = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).select('-password -resetPasswordToken -resetPasswordExpire');
        if (!user) {
            return res.status(404).json({ success: false, message: "Portfolio not found" });
        }

        const isOwner = req.user && String(req.user._id || req.user.id) === String(user._id);
        if (!user.portfolio?.isPublished && !isOwner) {
            return res.status(404).json({ success: false, message: "Portfolio is not published yet" });
        }

        const posts = await Post.find({ user: user._id })
            .populate('user', 'name profilePic')
            .sort({ createdAt: -1 })
            .limit(6);

        res.status(200).json({ success: true, artist: serializePortfolio(user), posts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching portfolio", error: error.message });
    }
};

module.exports.getFeaturedPortfolios = async (req, res) => {
    try {
        const artists = await userModel.find({ 'portfolio.isPublished': true })
            .select('name role profilePic artStyle originLocation experience portfolio')
            .sort({ updatedAt: -1 })
            .limit(6);

        res.status(200).json({
            success: true,
            artists: artists.map(serializePortfolio)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching featured portfolios" });
    }
};

module.exports.updatePortfolio = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id || req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.portfolio = {
            ...(user.portfolio || {}),
            isPublished: req.body.isPublished === true || req.body.isPublished === 'true',
            headline: req.body.headline || '',
            coverImage: req.body.coverImage || '',
            about: req.body.about || '',
            skills: toList(req.body.skills),
            services: toList(req.body.services),
            featuredWorks: normalizeFeaturedWorks(req.body.featuredWorks),
            contactEmail: req.body.contactEmail || user.email,
            isAvailableForWork: req.body.isAvailableForWork !== false
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: "Portfolio saved successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to save portfolio", error: error.message });
    }
};

module.exports.updateMentorProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const mentorProfile = user.mentorProfile || {};
        const isMentor = req.body.isMentor !== false;
        const nextSlug = mentorProfile.mentorSlug || buildMentorSlug(user.name, user._id);

        mentorProfile.isMentor = isMentor;
        mentorProfile.mentorSlug = nextSlug;
        mentorProfile.headline = req.body.headline || mentorProfile.headline || '';
        mentorProfile.primarySkill = req.body.primarySkill || mentorProfile.primarySkill || user.artStyle || '';
        mentorProfile.sessionTag = req.body.sessionTag || mentorProfile.sessionTag || mentorProfile.primarySkill || '';
        mentorProfile.hourlyRate = Number(req.body.hourlyRate || mentorProfile.hourlyRate || 0);
        mentorProfile.rating = Number(req.body.rating || mentorProfile.rating || 4.8);
        mentorProfile.totalStudents = Number(req.body.totalStudents || mentorProfile.totalStudents || 0);
        mentorProfile.totalSessions = Number(req.body.totalSessions || mentorProfile.totalSessions || 0);
        mentorProfile.yearsExperience = Number(req.body.yearsExperience || mentorProfile.yearsExperience || 0);
        mentorProfile.languages = Array.isArray(req.body.languages)
            ? req.body.languages.filter(Boolean)
            : typeof req.body.languages === 'string'
                ? req.body.languages.split(',').map((item) => item.trim()).filter(Boolean)
                : mentorProfile.languages || [];
        mentorProfile.mentorshipModes = Array.isArray(req.body.mentorshipModes)
            ? req.body.mentorshipModes.filter(Boolean)
            : typeof req.body.mentorshipModes === 'string'
                ? req.body.mentorshipModes.split(',').map((item) => item.trim()).filter(Boolean)
                : mentorProfile.mentorshipModes || [];
        mentorProfile.tags = Array.isArray(req.body.tags)
            ? req.body.tags.filter(Boolean)
            : typeof req.body.tags === 'string'
                ? req.body.tags.split(',').map((item) => item.trim()).filter(Boolean)
                : mentorProfile.tags || [];
        mentorProfile.coverImage = req.body.coverImage || mentorProfile.coverImage || user.profilePic || '';
        mentorProfile.accentColor = req.body.accentColor || mentorProfile.accentColor || 'indigo';
        mentorProfile.availableForBooking = req.body.availableForBooking !== false;
        mentorProfile.isVerified = typeof req.body.isVerified === 'boolean'
            ? req.body.isVerified
            : mentorProfile.isVerified || false;

        user.mentorProfile = mentorProfile;
        if (!user.role || user.role === 'Artist') {
            user.role = mentorProfile.primarySkill || 'Mentor';
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: "Mentor profile updated successfully",
            mentorProfile: user.mentorProfile,
            user
        });
    } catch (error) {
        console.error("Mentor Profile Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "No account found with this email" });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset instructions generated successfully",
            resetToken
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ success: false, message: "Error processing request", error: error.message });
    }
};

module.exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }
        const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await userModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }
        user.password = await userModel.hashPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successful! You can now log in."
        });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ success: false, message: "Error resetting password", error: error.message });
    }
};
