const Event = require('../models/eventModel');

exports.createEvent = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { title, description, date, time, price, location, category, bannerImage, maxSeats } = req.body;
        if (!title || !description || !date || !time || !location) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields (Title, Description, Date, Time, Location)"
            });
        }
        const event = await Event.create({
            title,
            description,
            date,
            time,
            price: price || 0,
            location,
            category: category || "General",
            bannerImage: bannerImage || "https://via.placeholder.com/800x400?text=Event+Banner",
            maxSeats: maxSeats || 100,
            organizer: userId
        });
        res.status(201).json({ success: true, message: "Event published successfully! 🎊", event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error creating event" });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', 'name profilePic')
            .sort({ date: 1 });
        res.status(200).json({ success: true, events });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching events" });
    }
};

exports.addEventReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }
        const alreadyReviewed = event.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "You already reviewed this event"
            });
        }
        const review = {
            user: req.user._id || req.user.id,
            rating: Number(rating),
            comment: comment || ""
        };

        event.reviews.push(review);
        event.numReviews = event.reviews.length;

        const totalRating = event.reviews.reduce((acc, item) => item.rating + acc, 0);
        event.averageRating = totalRating / event.reviews.length;

        await event.save();
        res.status(201).json({ success: true, message: "Review added successfully! ⭐" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error adding review" });
    }
};
exports.deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
         const event = await Event.findByIdAndDelete(eventId);

        if (!event) {
            return res.status(404).json({ success: false, message: "Event nahi mila!" });
        }

        res.status(200).json({ success: true, message: "Event delete ho gaya!" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};