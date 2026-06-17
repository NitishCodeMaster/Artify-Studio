const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require('../controllers/userController');
const { authUser } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const optionalAuthUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await userModel.findById(decoded.id).select('-password');
        }
    } catch {
        req.user = null;
    }
    next();
};

router.post('/register', [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone')
        .customSanitizer((value) => String(value || '').replace(/\D/g, '').slice(-10))
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone must be a 10 digit number')
], userController.registerUser);
router.post('/login', [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
], userController.loginUser);

router.post('/logout', authUser, userController.logoutUser);

router.get('/profile', authUser, userController.getUserProfile);

router.get('/top-creators', authUser, userController.getTopCreators);

router.get('/portfolio/featured', userController.getFeaturedPortfolios);
router.get('/portfolio/:id', optionalAuthUser, userController.getPortfolio);
router.put('/portfolio', authUser, userController.updatePortfolio);

router.get('/profile/:id', userController.getUserProfileById);

router.put('/profile', authUser, userController.updateUserProfile);
router.put('/mentor-profile', authUser, userController.updateMentorProfile);

router.post('/forgot-password', userController.forgotPassword);

router.post('/reset-password/:token', userController.resetPassword);

router.get('/wallet', authUser, userController.getWallet);

router.post('/save-product/:id', authUser, userController.toggleSaveProduct);

router.get('/saved-items', authUser, userController.getSavedItems);



module.exports = router;
