const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyOrders } = require('../controllers/paymentController');
const { authUser } = require('../middleware/authMiddleware');

router.post('/create-order', authUser, createOrder);
router.post('/verify-payment', authUser, verifyPayment);
router.get('/my-orders', authUser, getMyOrders);


module.exports = router;