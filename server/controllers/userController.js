const userModel = require('../models/userModel');
const Post = require('../models/postModel');
const Product = require('../models/productModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const blacklistToken = require('../models/blacklistTokenModel');


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
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'User logged in successfully',
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
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let avatarUrl = user.avatar;
        if (req.body.avatar && req.body.avatar !== '') {
            avatarUrl = req.body.avatar;
        }

        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.role = req.body.role || user.role;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.avatar = avatarUrl;

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
        const topCreators = await User.find({ role: 'seller' })
            .select('name role avatar')
            .limit(5);

        if (topCreators.length === 0) {
            const users = await User.find().select('name role avatar').limit(5);
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
            .populate('user', 'name avatar')
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