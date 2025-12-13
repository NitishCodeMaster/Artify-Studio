const sellerModel = require('../models/sellerModel');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const blacklistToken = require('../models/blacklistTokenModel');

module.exports.registerSeller = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, shopName, phone, shopAddress, location } = req.body;

        const sellerExists = await sellerModel.findOne({ email });
        if (sellerExists) {

            return res.status(400).json({ message: 'Seller already exists' });
        }
        const seller = await sellerModel.create({ name, email, password, shopName, phone, shopAddress, location });
        const token = jwt.sign(
            { id: seller._id, role: 'seller' },
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
            message: 'Seller registered successfully',
            token,
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,

                shopName: seller.shopName,
                profilePic: seller.profilePic,
                role: seller.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
} 

module.exports.loginSeller = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        const seller = await sellerModel.findOne({ email }).select('+password');
        if (!seller) {
            return res.status(400).json({ message: 'seller not found' });
        }
        const isMatch = await seller.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: seller._id, role: seller.role },
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
            message: 'Seller logged in successfully',
            token,
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                shopName: seller.shopName,
                profilePic: seller.profilePic,
                role: seller.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.logoutSeller = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
        if (token) {
            await blacklistToken.create({ token });
        }
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });
        res.status(200).json({ message: "Seller logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.getSellerProfile = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const seller = await sellerModel.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.status(200).json(seller);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports.updateSellerProfile = async (req, res) => {
    try {
        const sellerId = req.seller.id;
        const updates = req.body;
        const seller = await sellerModel.findByIdAndUpdate(sellerId, updates, { new: true });
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.status(200).json(seller);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}   
