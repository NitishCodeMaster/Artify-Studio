const User = require('../models/userModel');
const Event = require('../models/eventModel');
const Product = require('../models/productModel');

exports.getHomeData = async (req, res) => {
    try {
        const [artistsCount, eventsCount, featuredEvents, newProducts] = await Promise.all([
            User.countDocuments({ role: 'artist' }),
            Event.countDocuments(),
            Event.find().sort({ date: 1 }).limit(6),
            Product.find().sort({ createdAt: -1 }).limit(6)
        ]);

        res.status(200).json({
            success: true,
            stats: {
                artistsCount,
                eventsCount
            },
            featuredEvents,
            newProducts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Home data retrieval failed",
            error: error.message
        });
    }
};