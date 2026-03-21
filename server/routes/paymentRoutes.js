const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { authUser } = require('../middleware/authMiddleware');

router.post('/create-order', authUser, createOrder);
router.post('/verify-payment', authUser, verifyPayment);

module.exports = router;