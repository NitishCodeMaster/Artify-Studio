require('dotenv').config();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/orderModel');
const userModel = require('../models/userModel');
const Event = require('../models/eventModel');
const Workshop = require('../models/workshopModel');
const Product = require('../models/productModel');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const roundAmount = (value) => Math.round(Number(value || 0));

const resolveCheckout = async ({ eventId, workshopId, productId, products = [], fallbackAmount }) => {
    if (eventId) {
        const event = await Event.findById(eventId).select('title price organizer attendees maxSeats status');
        if (!event) throw new Error('Event not found');
        if (event.status === 'completed' || event.status === 'cancelled') throw new Error('Event is not available for booking');
        return {
            type: 'ticket_booking',
            title: event.title,
            amount: roundAmount(event.price),
            event
        };
    }

    if (workshopId) {
        const workshop = await Workshop.findById(workshopId).populate('mentor', 'name');
        if (!workshop) throw new Error('Workshop not found');
        if (!workshop.isPublished || workshop.status !== 'upcoming') throw new Error('Workshop is not available for booking');
        return {
            type: 'workshop_booking',
            title: workshop.title,
            amount: workshop.accessType === 'paid' ? roundAmount(workshop.price) : 0,
            workshop
        };
    }

    const productIds = [...new Set([productId, ...products].filter(Boolean).map(String))];
    if (productIds.length) {
        const foundProducts = await Product.find({ _id: { $in: productIds } }).select('name price seller');
        if (foundProducts.length !== productIds.length) throw new Error('One or more products were not found');
        const amount = foundProducts.reduce((sum, product) => sum + roundAmount(product.price), 0);
        return {
            type: 'marketplace_purchase',
            title: foundProducts.length === 1 ? foundProducts[0].name : `${foundProducts.length} marketplace items`,
            amount,
            products: foundProducts
        };
    }

    throw new Error('Checkout item is required');
};

exports.createOrder = async (req, res) => {
    try {
        const { amount, eventId, workshopId, productId, products } = req.body;
        const checkout = await resolveCheckout({
            eventId,
            workshopId,
            productId,
            products,
            fallbackAmount: amount
        });

        if (!checkout.amount || checkout.amount <= 0) {
            console.log(" Error: Amount missing");
            return res.status(400).json({ success: false, message: "Amount is required" });
        }

        const options = {
            amount: checkout.amount * 100,
            currency: "INR",
            receipt: `rcpt_${Date.now()}_${req.user._id.toString().slice(-5)}`,
            notes: {
                eventId: eventId || null,
                workshopId: workshopId || null,
                productId: productId || null,
                userId: req.user._id.toString(),
                type: checkout.type
            }
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
        }

        res.status(200).json({
            success: true,
            key: process.env.RAZORPAY_KEY_ID,
            amount: checkout.amount,
            order
        });
    } catch (error) {
        console.error(" Razorpay Create Order Error:", error);
        res.status(400).json({ success: false, message: error.message || "Could not create order" });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            products = [],
            totalAmount,
            eventId,
            workshopId
        } = req.body;

        const existingOrder = await Order.findOne({ razorpay_payment_id });
        if (existingOrder) {
            return res.status(200).json({ success: true, message: "Payment already verified", order: existingOrder });
        }

        const checkout = await resolveCheckout({
            eventId,
            workshopId,
            products,
            fallbackAmount: totalAmount
        });

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: "Invalid signature!" });
        }

        const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
        if (!razorpayOrder || Number(razorpayOrder.amount) !== checkout.amount * 100) {
            return res.status(400).json({ success: false, message: "Payment amount mismatch" });
        }

        if (eventId) {
            const alreadyBooked = checkout.event.attendees.some((id) => id.toString() === req.user._id.toString());
            const updatedEvent = await Event.findByIdAndUpdate(eventId, {
                $addToSet: { attendees: req.user._id },
                $push: {
                    payments: {
                        user: req.user._id,
                        paymentId: razorpay_payment_id,
                        orderId: razorpay_order_id,
                        amount: checkout.amount,
                        status: 'paid'
                    }
                }
            }, { new: true });
            if (!updatedEvent) {
                console.error(" Event not found during payment verification");
            }
            if (!alreadyBooked && checkout.amount > 0) {
                await userModel.findByIdAndUpdate(req.user._id, {
                    $push: {
                        transactions: {
                            title: `Ticket: ${checkout.event.title}`,
                            amount: checkout.amount,
                            type: 'debit',
                            date: new Date()
                        }
                    }
                });

                await userModel.findByIdAndUpdate(checkout.event.organizer, {
                    $inc: { walletBalance: checkout.amount },
                    $push: {
                        transactions: {
                            title: `Ticket sale: ${checkout.event.title}`,
                            amount: checkout.amount,
                            type: 'credit',
                            date: new Date()
                        }
                    }
                });
            }
        }

        if (workshopId) {
            const alreadyEnrolled = checkout.workshop.enrolledLearners.some((id) => id.toString() === req.user._id.toString());
            const updatedWorkshop = await Workshop.findByIdAndUpdate(workshopId, {
                $addToSet: { enrolledLearners: req.user._id },
                ...(alreadyEnrolled ? {} : { $inc: { attendeesCount: 1 } }),
                $push: {
                    payments: {
                        user: req.user._id,
                        paymentId: razorpay_payment_id,
                        orderId: razorpay_order_id,
                        amount: checkout.amount,
                        status: 'paid'
                    }
                }
            }, { new: true }).populate('mentor', 'name');

            if (!alreadyEnrolled && checkout.amount > 0) {
                await userModel.findByIdAndUpdate(req.user._id, {
                    $push: {
                        transactions: {
                            title: `Workshop booking: ${updatedWorkshop.title}`,
                            amount: checkout.amount,
                            type: 'debit',
                            date: new Date()
                        }
                    }
                });
            }

            if (!alreadyEnrolled && updatedWorkshop?.mentor?._id && checkout.amount > 0) {
                await userModel.findByIdAndUpdate(updatedWorkshop.mentor._id, {
                    $inc: { walletBalance: checkout.amount },
                    $push: {
                        transactions: {
                            title: `Workshop booking: ${updatedWorkshop.title}`,
                            amount: checkout.amount,
                            type: 'credit',
                            date: new Date()
                        }
                    }
                });
            }
        }

        const newOrder = await Order.create({
            user: req.user._id,
            products: products || [],
            totalAmount: checkout.amount,
            razorpay_payment_id,
            razorpay_order_id,
            eventId: eventId || null,
            workshopId: workshopId || null
        });

        if (checkout.products?.length > 0) {
            await userModel.findByIdAndUpdate(req.user._id, {
                $push: {
                    transactions: {
                        title: checkout.title,
                        amount: checkout.amount,
                        type: 'debit',
                        date: new Date()
                    }
                }
            });

            for (const item of checkout.products) {
                const sellerId = item.seller;
                if (sellerId) {
                    await userModel.findByIdAndUpdate(sellerId, {
                        $inc: { walletBalance: roundAmount(item.price) },
                        $push: {
                            transactions: {
                                title: `Sold '${item.name}'`,
                                amount: roundAmount(item.price),
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
            message: workshopId ? "Workshop seat booked successfully!" : eventId ? "Ticket Booked Successfully!" : "Payment verified & Wallet updated!",
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

exports.bookFreeCheckout = async (req, res) => {
    try {
        const { eventId, workshopId } = req.body;
        if (!eventId && !workshopId) {
            return res.status(400).json({ success: false, message: "Checkout item is required" });
        }

        const checkout = await resolveCheckout({ eventId, workshopId });

        if (checkout.amount > 0) {
            return res.status(400).json({ success: false, message: "Paid checkout requires Razorpay payment" });
        }

        if (eventId) {
            await Event.findByIdAndUpdate(eventId, {
                $addToSet: { attendees: req.user._id }
            });
        }

        if (workshopId) {
            const alreadyEnrolled = checkout.workshop.enrolledLearners.some((id) => id.toString() === req.user._id.toString());
            await Workshop.findByIdAndUpdate(workshopId, {
                $addToSet: { enrolledLearners: req.user._id },
                ...(alreadyEnrolled ? {} : { $inc: { attendeesCount: 1 } })
            });
        }

        res.status(200).json({
            success: true,
            message: eventId ? "Free ticket booked successfully!" : "Free workshop seat booked successfully!"
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
