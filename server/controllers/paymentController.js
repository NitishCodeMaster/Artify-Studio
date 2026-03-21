const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/orderModel');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        const options = {
            amount: Math.round(amount * 100), // Professional Rule: Convert INR to Paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}_${req.user._id.toString().slice(-5)}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error("❌ Razorpay Create Order Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products, totalAmount } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {

            const newOrder = await Order.create({
                user: req.user._id,
                products: products,
                totalAmount: totalAmount,
                razorpay_payment_id,
                razorpay_order_id
            });

            return res.status(200).json({
                success: true,
                message: "Payment verified & Order Placed successfully!",
                order: newOrder
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid signature! Payment verification failed.",
            });
        }
    } catch (error) {
        console.error("❌ Razorpay Verify Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};