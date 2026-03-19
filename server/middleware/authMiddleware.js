const userModel = require('../models/userModel');
const sellerModel = require('../models/sellerModel');
const jwt = require('jsonwebtoken');
const blacklistToken = require('../models/blacklistTokenModel');

module.exports.authUser = async (req, res, next) => {
    try {
        const token= req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access - no token provided' });
        }

        const isBlacklisted = await blacklistToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is blacklisted, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "user") {
            return res.status(403).json({ message: "Access denied: User only" });
        }

        const user = await userModel.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};

module.exports.authSeller = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access - no token provided' });
        }
        const isBlacklisted = await blacklistToken.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token is blacklisted, authorization denied' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== "seller") {
            return res.status(403).json({ message: "Access denied: Seller only" });
        }

        const seller = await sellerModel.findById(decoded.id).select('-password');
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        req.seller = seller;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};