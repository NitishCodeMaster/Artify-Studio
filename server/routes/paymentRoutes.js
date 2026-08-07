const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyOrders, bookFreeCheckout, getTradeHistory, getMySales } = require('../controllers/paymentController');
const { authUser } = require('../middleware/authMiddleware');

router.post('/create-order', authUser, createOrder);
router.post('/verify-payment', authUser, verifyPayment);
router.post('/book-free', authUser, bookFreeCheckout);
router.get('/my-orders', authUser, getMyOrders);
router.get('/trade-history', authUser, getTradeHistory);
router.get('/my-sales', authUser, getMySales);


module.exports = router;
