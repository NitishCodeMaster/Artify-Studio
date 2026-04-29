const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require('../controllers/userController');
const { authUser } = require('../middleware/authMiddleware');

router.post('/register', [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').not().isEmpty().withMessage('Phone is required')
], userController.registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required')
], userController.loginUser);

router.post('/logout', authUser, userController.logoutUser);

router.get('/profile', authUser, userController.getUserProfile);

router.get('/top-creators', authUser, userController.getTopCreators);

router.get('/profile/:id', userController.getUserProfileById);

router.put('/profile', authUser, userController.updateUserProfile);
router.put('/mentor-profile', authUser, userController.updateMentorProfile);

router.post('/forgot-password', userController.forgotPassword);

router.post('/reset-password/:token', userController.resetPassword);

router.get('/wallet', authUser, userController.getWallet);

router.post('/save-product/:id', authUser, userController.toggleSaveProduct);

router.get('/saved-items', authUser, userController.getSavedItems);



module.exports = router;
