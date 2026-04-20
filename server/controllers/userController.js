const userModel = require('../models/userModel');
const Post = require('../models/postModel');
const Product = require('../models/productModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const blacklistToken = require('../models/blacklistTokenModel');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

module.exports.registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, phone, } = req.body;

        const userExists = await userModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await userModel.create({ name, email, password, phone });

        const token = jwt.sign(
            { id: user._id, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
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

        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
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
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.profilePic = profilePicUrl;

        user.originLocation = req.body.originLocation || user.originLocation;
        user.artStyle = req.body.artStyle || user.artStyle;
        user.experience = req.body.experience || user.experience;

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
        const user = await userModel.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const posts = await Post.find({ user: req.params.id })
            .populate('user', 'name profilePic')
            .sort({ createdAt: -1 });

        let products = [];
        try {
            products = await Product.find({ seller: req.params.id }).sort({ createdAt: -1 });
        } catch (err) {
            console.log("No products found for this user or schema mismatch");
        }

        res.status(200).json({ success: true, user, posts, products });
    } catch (error) {
        console.error("❌ Fetch Profile Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "No artist found with this email." });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `Artify Studio <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: '🎨 Password Reset Request - Artify Studio',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #0a0a0a; padding: 40px; color: #fff; text-align: center;">
                    <h2 style="color: #f59e0b;">Password Reset Request</h2>
                    <p style="color: #aaa; font-size: 16px;">We received a request to reset your password for Artify Studio.</p>
                    <p style="color: #aaa; font-size: 16px;">Click the magic button below to set a new password:</p>
                    <br/>
                    <a href="${resetUrl}" style="background-color: #f59e0b; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password ✨</a>
                    <br/><br/>
                    <p style="color: #555; font-size: 12px;">If you didn't request this, please ignore this email. This link will expire in 15 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ success: true, message: "Magic link sent to your email!" });

    } catch (error) {
        console.error("Forgot Password Error:", error);

        if (req.user) {
            const user = await userModel.findOne({ email: req.body.email });
            if (user) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                await user.save({ validateBeforeSave: false });
            }
        }
        res.status(500).json({ success: false, message: "Email could not be sent. Please try again." });
    }
};

module.exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await userModel.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired token! Please try again." });
        }

        user.password = req.body.password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Password updated magically! ✨ You can now login." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ success: false, message: "Something went wrong!" });
    }
};

module.exports.getWallet = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            balance: 12450,
            transactions: [
                { _id: "t1", title: "Sold 'Abstract Sunset'", type: "credit", amount: 4500, date: new Date(Date.now() - 86400000) },
                { _id: "t2", title: "BoomBox 2026 Ticket", type: "debit", amount: 1499, date: new Date(Date.now() - 172800000) },
                { _id: "t3", title: "Wallet Top-up", type: "credit", amount: 5000, date: new Date(Date.now() - 500000000) }
            ]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching wallet" });
    }
};

module.exports.getSavedItems = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            savedItems: []
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching saved items" });
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