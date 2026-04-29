const Review = require('../models/reviewModel');
const Event = require('../models/eventModel');

exports.addReview = async (req, res) => {
    try {
        const { targetId, onModel, rating, comment } = req.body;
        const userId = req.user._id;

        const review = await Review.create({
            user: userId,
            targetId,
            onModel,
            rating,
            comment
        });

        if (onModel === 'Event') {
            const allReviews = await Review.find({ targetId, onModel: 'Event' });
            const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;

            await Event.findByIdAndUpdate(targetId, { averageRating: avgRating });
        }

        res.status(201).json({ success: true, message: "Review added!", review });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ targetId: req.params.targetId })
            .populate('user', 'name profilePic')
            .sort('-createdAt');

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        if (!review.user || review.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Not allowed" });
        }

        const targetId = review.targetId;
        await review.deleteOne();

        const remainingReviews = await Review.find({ targetId });

        let newAvg = 0;
        if (remainingReviews.length > 0) {
            newAvg = remainingReviews.reduce((acc, curr) => acc + curr.rating, 0) / remainingReviews.length;
        }

        await Event.findByIdAndUpdate(targetId, { averageRating: newAvg });

        res.status(200).json({ success: true });

    } catch (error) {
        console.error("DELETE REVIEW ERROR:", error); 
        res.status(500).json({ success: false, message: error.message });
    }
};