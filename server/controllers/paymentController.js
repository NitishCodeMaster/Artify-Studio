require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/orderModel');
const userModel = require('../models/userModel');
const Event = require('../models/eventModel');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
    try {
        const { amount, eventId } = req.body;


        if (!amount) {
            console.log(" Error: Amount missing");
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        const options = {
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `rcpt_${Date.now()}_${req.user._id.toString().slice(-5)}`,
            notes: {
                eventId: eventId || null,
                userId: req.user._id.toString(),
                type: eventId ? 'ticket_booking' : 'marketplace_purchase'
            }
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
        }

        res.status(200).json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            order
        });
    } catch (error) {
        console.error(" Razorpay Create Order Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            products,
            productSnapshots,
            totalAmount,
            eventId
        } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid signature!" });
        }

        if (eventId) {
            const updatedEvent = await Event.findByIdAndUpdate(eventId, {
                $addToSet: { attendees: req.user._id },
                $push: {
                    payments: {
                        user: req.user._id,
                        paymentId: razorpay_payment_id,
                        orderId: razorpay_order_id,
                        amount: totalAmount,
                        status: 'paid'
                    }
                }
            }, { new: true });
            if (!updatedEvent) {
                console.error(" Event not found during payment verification");
            }
        }
        const newOrder = await Order.create({
            user: req.user._id,
            products: products || [],
            totalAmount: totalAmount,
            razorpay_payment_id,
            razorpay_order_id,
            eventId: eventId || null
        });

        if (productSnapshots && productSnapshots.length > 0) {
            for (const item of productSnapshots) {
                const sellerId = item.seller?._id || item.seller;
                if (sellerId) {
                    await userModel.findByIdAndUpdate(sellerId, {
                        $inc: { walletBalance: item.price },
                        $push: {
                            transactions: {
                                title: `Sold '${item.name}'`,
                                amount: item.price,
                                type: 'credit',
                                date: new Date()
                            }
                        }
                    });
                }
            }
        }

        return res.status(200).json({
            success: true,
            message: eventId ? "Ticket Booked Successfully!" : "Payment verified & Wallet updated!",
            order: newOrder
        });

    } catch (error) {
        console.error(" Razorpay Verify Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('products')
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(" Razorpay Fetch Orders Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
