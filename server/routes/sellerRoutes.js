const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const sellerController = require('../controllers/sellerController');
const { authSeller } = require('../middleware/authMiddleware');

router.post('/register', [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('shopName').not().isEmpty().withMessage('Shop name is required'),
    body('phone')
        .customSanitizer((value) => String(value || '').replace(/\D/g, '').slice(-10))
        .isLength({ min: 10, max: 10 })
        .withMessage('Phone must be a 10 digit number'),
    body('shopAddress').not().isEmpty().withMessage('Shop address is required'),
    body('location').optional()
], sellerController.registerSeller);


router.post('/login', [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').not().isEmpty().withMessage('Password is required')
], sellerController.loginSeller);

router.post('/logout', authSeller, sellerController.logoutSeller);

router.get('/profile', authSeller, sellerController.getSellerProfile);

router.put('/profile', authSeller, sellerController.updateSellerProfile);

module.exports = router;
