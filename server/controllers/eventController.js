const Event = require('../models/eventModel');
const Notification = require('../models/notification');
const User = require('../models/userModel');
const { sendGigSelectionEmail } = require('../utils/sendEmail');

const toPositiveNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
};

const resolveGigPricing = ({ gigType, price, artistPayout, existingGigType = null, existingPrice = 0, existingArtistPayout = 0 }) => {
    let finalGigType = ['free', 'paid_gig', 'ticketed'].includes(gigType)
        ? gigType
        : (existingGigType && ['free', 'paid_gig', 'ticketed'].includes(existingGigType) ? existingGigType : null);

    if (!finalGigType) {
        if (Number(artistPayout) > 0 || Number(existingArtistPayout) > 0) finalGigType = 'paid_gig';
        else if (Number(price) > 0 || Number(existingPrice) > 0) finalGigType = 'ticketed';
        else finalGigType = 'free';
    }

    if (finalGigType === 'paid_gig') {
        const rawPayout = artistPayout !== undefined ? Number(artistPayout) : Number(existingArtistPayout);
        return {
            gigType: 'paid_gig',
            price: 0,
            artistPayout: rawPayout > 0 ? rawPayout : 5000
        };
    }

    if (finalGigType === 'ticketed') {
        const rawPrice = price !== undefined ? Number(price) : Number(existingPrice);
        return {
            gigType: 'ticketed',
            price: rawPrice > 0 ? rawPrice : 500,
            artistPayout: 0
        };
    }

    return {
        gigType: 'free',
        price: 0,
        artistPayout: 0
    };
};

exports.createEvent = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { title, description, date, time, price, location, latitude, longitude, category, bannerImage, maxSeats, gigType, artistPayout } = req.body;

        if (!title || !description || !date || !time || !location || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields (Title, Description, Date, Time, Location, Category)"
            });
        }

        const eventDateTime = new Date(`${date}T${time}`);

        const pricing = resolveGigPricing({ gigType, price, artistPayout, title, description });

        const event = await Event.create({
            title,
            description,
            dateTime: eventDateTime,
            date,
            time,
            price: pricing.price,
            artistPayout: pricing.artistPayout,
            gigType: pricing.gigType,
            location,
            latitude: latitude !== undefined && latitude !== '' ? Number(latitude) : null,
            longitude: longitude !== undefined && longitude !== '' ? Number(longitude) : null,
            category: category || "General",
            bannerImage: bannerImage || "https://via.placeholder.com/800x400?text=Event+Banner",
            maxSeats: maxSeats ? Number(maxSeats) : 100,
            organizer: userId
        });

        const io = req.app.get('io');
        const onlineUsers = req.app.get('onlineUsers');

        const targetUsers = await User.find({ _id: { $ne: userId } });

        if (targetUsers.length > 0) {
            const notifications = targetUsers.map(u => ({
                recipient: u._id,
                sender: userId,
                type: 'event',
                title: `New ${category} Event! 🎉`,
                message: `${title} is happening at ${location}.`,
                link: `/events/${event._id}`,
                eventId: event._id
            }));

            await Notification.insertMany(notifications);

            targetUsers.forEach(u => {
                try {
                    const socketId = onlineUsers.get(u._id.toString());
                    if (socketId) {
                        io.to(socketId).emit("new_notification", {
                            title: `New ${category} Event 🔔`,
                            message: title,
                            eventId: event._id,
                            link: `/events/${event._id}`
                        });
                    }
                } catch (err) {
                    console.log("Socket emit error:", err.message);
                }
            });
        }

        const eventObject = {
            ...event.toObject(),
            gigType: pricing.gigType,
            artistPayout: pricing.artistPayout,
            price: pricing.price
        };

        if (io) io.emit("new_event", eventObject);
        res.status(201).json({ success: true, message: "Gig published successfully! 🎊", event: eventObject });
    } catch (error) {
        console.error("Create Event Error:", error);
        res.status(500).json({ success: false, message: "Error creating event" });
    }
};

exports.getAllEvents = async (req, res) => {
    try {
        let events = await Event.find()
            .select('-payments')
            .populate('organizer', 'name profilePic role')
            .populate('applicants.artist', 'name profilePic role artStyle bio originLocation sellerProfile')
            .sort({ date: 1 })
            .lean();

        events = events.map(e => {
            const payout = Number(e.artistPayout || 0);
            const price = Number(e.price || 0);
            let type = e.gigType;
            if (!type || !['free', 'paid_gig', 'ticketed'].includes(type)) {
                if (payout > 0) type = 'paid_gig';
                else if (price > 0) type = 'ticketed';
                else type = 'free';
            }

            return {
                ...e,
                gigType: type,
                artistPayout: type === 'paid_gig' ? (payout > 0 ? payout : 5000) : 0,
                price: type === 'ticketed' ? (price > 0 ? price : 500) : 0
            };
        });

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
        const userId = (req.user?._id || req.user?.id || req.user)?.toString();
        const eventId = req.params.id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const eventOrganizerId = event.organizer?._id
            ? event.organizer._id.toString()
            : (event.organizer ? event.organizer.toString() : null);

        if (eventOrganizerId && eventOrganizerId !== userId && req.user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this event"
            });
        }

        await event.deleteOne();
        await Notification.deleteMany({ eventId: eventId });

        const io = req.app.get('io');
        if (io) {
            io.emit("notification_deleted", { eventId });
            io.emit("event_deleted", { eventId: eventId.toString() });
        }

        res.status(200).json({
            success: true,
            message: "Event and related notifications deleted successfully! 🗑️"
        });

    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting event"
        });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const rawEvent = await Event.findById(req.params.id)
            .populate('organizer', 'name profilePic role bio originLocation sellerProfile')
            .populate('applicants.artist', 'name profilePic role artStyle bio originLocation sellerProfile experience rating email phoneNumber socialLinks createdAt')
            .lean();

        if (!rawEvent) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const event = {
            ...rawEvent,
            gigType: rawEvent.gigType || (Number(rawEvent.artistPayout) > 0 ? 'paid_gig' : (Number(rawEvent.price) > 0 ? 'ticketed' : 'free'))
        };

        res.status(200).json({
            success: true,
            event
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const userId = (req.user?._id || req.user?.id || req.user)?.toString();
        const eventId = req.params.id;

        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        const eventOrganizerId = event.organizer?._id
            ? event.organizer._id.toString()
            : (event.organizer ? event.organizer.toString() : null);

        if (!event.organizer) {
            event.organizer = req.user._id || req.user.id;
        } else if (eventOrganizerId && eventOrganizerId !== userId && req.user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to edit this event"
            });
        }

        const { title, description, date, time, price, location, latitude, longitude, category, bannerImage, maxSeats, gigType, artistPayout } = req.body;

        const pricing = resolveGigPricing({
            gigType,
            price,
            artistPayout,
            existingGigType: event.gigType || null,
            existingPrice: event.price,
            existingArtistPayout: event.artistPayout,
            title: title || event.title,
            description: description || event.description
        });

        const updateFields = {
            gigType: pricing.gigType,
            artistPayout: pricing.artistPayout,
            price: pricing.price
        };

        if (title !== undefined) updateFields.title = title;
        if (description !== undefined) updateFields.description = description;
        if (date !== undefined) updateFields.date = date;
        if (time !== undefined) updateFields.time = time;
        if (location !== undefined) updateFields.location = location;
        if (latitude !== undefined) updateFields.latitude = latitude !== '' && latitude !== null ? Number(latitude) : null;
        if (longitude !== undefined) updateFields.longitude = longitude !== '' && longitude !== null ? Number(longitude) : null;
        if (category !== undefined) updateFields.category = category;
        if (bannerImage !== undefined && bannerImage !== '') updateFields.bannerImage = bannerImage;
        if (maxSeats !== undefined) updateFields.maxSeats = Number(maxSeats);

        if (date && time) {
            updateFields.dateTime = new Date(`${date}T${time}`);
        }

        let rawUpdated = await Event.findByIdAndUpdate(
            eventId,
            { $set: updateFields },
            { new: true }
        )
            .populate('organizer', 'name profilePic role')
            .populate('applicants.artist', 'name profilePic role artStyle')
            .lean();

        const updatedEvent = {
            ...rawUpdated,
            gigType: pricing.gigType,
            artistPayout: pricing.artistPayout,
            price: pricing.price
        };

        const io = req.app.get('io');
        if (io) {
            io.emit("event_updated", updatedEvent);
        }

        return res.status(200).json({
            success: true,
            message: "Event updated successfully! ✏️",
            event: updatedEvent
        });
    } catch (error) {
        console.error("Update Event Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating event"
        });
    }
};

exports.applyForGig = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { message } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ success: false, message: "Gig not found" });
        }

        const alreadyApplied = event.applicants.some(
            a => a.artist && a.artist.toString() === userId.toString()
        );

        if (alreadyApplied) {
            return res.status(400).json({ success: false, message: "You have already applied for this gig!" });
        }

        event.applicants.push({
            artist: userId,
            message: message || "Interested in performing for this gig!",
            status: 'applied'
        });

        await event.save();

        const organizerId = event.organizer?._id || event.organizer;
        if (organizerId && organizerId.toString() !== userId.toString()) {
            await Notification.create({
                recipient: organizerId,
                sender: userId,
                type: 'event',
                title: 'New Gig Applicant! 🎤',
                message: `${req.user.name || 'An artist'} applied for your gig "${event.title}".`,
                link: `/events/${event._id}`,
                eventId: event._id
            });
        }

        res.status(200).json({
            success: true,
            message: "Gig application submitted successfully! 🚀",
            event
        });
    } catch (error) {
        console.error("Apply Gig Error:", error);
        res.status(500).json({ success: false, message: "Error applying for gig" });
    }
};

exports.selectGigApplicant = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { applicantId } = req.body;
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email')
            .populate('applicants.artist', 'name email profilePic role');

        if (!event) {
            return res.status(404).json({ success: false, message: "Gig not found" });
        }

        const organizerId = event.organizer?._id || event.organizer;
        if (organizerId.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to select applicants for this gig" });
        }

        const applicant = event.applicants.find(a => (a._id && a._id.toString() === applicantId) || (a.artist && (a.artist._id ? a.artist._id.toString() : a.artist.toString()) === applicantId));
        if (!applicant) {
            return res.status(404).json({ success: false, message: "Applicant not found" });
        }

        applicant.status = 'selected';
        await event.save();

        const selectedArtist = applicant.artist;
        const artistId = selectedArtist?._id ? selectedArtist._id : selectedArtist;

        if (artistId) {
            // 1. Create In-App Notification
            const notif = await Notification.create({
                recipient: artistId,
                sender: userId,
                type: 'event',
                title: 'Gig Selection Confirmation! 🎉',
                message: `Congratulations! You have been selected to perform for "${event.title}". Check your profile & email.`,
                link: `/events/${event._id}`,
                eventId: event._id
            });

            // 2. Emit Live Socket Notification
            const io = req.app.get('io');
            if (io) {
                io.to(`user:${artistId.toString()}`).emit("new_notification", notif);
            }

            // 3. Send Email Notification to Selected Artist
            if (selectedArtist && selectedArtist.email) {
                sendGigSelectionEmail({
                    artistEmail: selectedArtist.email,
                    artistName: selectedArtist.name,
                    gigTitle: event.title,
                    gigDate: event.date,
                    gigTime: event.time,
                    gigLocation: event.location,
                    payout: event.artistPayout || 0,
                    organizerName: event.organizer?.name || 'Organizer',
                    gigId: event._id
                }).catch(err => console.error("Async Email Error:", err));
            }
        }

        res.status(200).json({
            success: true,
            message: "Artist selected for gig! Confirmation email & live notification sent 📩✨",
            event
        });
    } catch (error) {
        console.error("Select Applicant Error:", error);
        res.status(500).json({ success: false, message: "Error selecting applicant" });
    }
};

exports.getNearbyEvents = async (req, res) => {
    try {
        const { lat, lng, radius = 50, category = 'all', sortBy = 'distance' } = req.query;

        const userLat = Number(lat);
        const userLng = Number(lng);

        if (isNaN(userLat) || isNaN(userLng)) {
            return res.status(400).json({ success: false, message: "Valid lat and lng query parameters are required." });
        }

        const events = await Event.find({ status: { $nin: ['completed', 'cancelled'] } })
            .populate('organizer', 'name profilePic role email phone sellerProfile')
            .sort({ date: 1 });

        const calculateDistance = (l1, ln1, l2, ln2) => {
            const R = 6371;
            const dLat = (l2 - l1) * (Math.PI / 180);
            const dLon = (ln2 - ln1) * (Math.PI / 180);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(l1 * (Math.PI / 180)) * Math.cos(l2 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return parseFloat((R * c).toFixed(1));
        };

        const cityCoordsMap = {
            'chandigarh': [30.7333, 76.7794],
            'jaipur': [26.9124, 75.7873],
            'delhi': [28.6139, 77.2090],
            'mumbai': [19.0760, 72.8777],
            'kolkata': [22.5726, 88.3639],
            'bangalore': [12.9719, 77.5961],
            'pune': [18.5204, 73.8567],
            'haridwar': [29.9457, 78.1642],
            'ranchi': [23.3441, 85.3096]
        };

        const processed = events.map(event => {
            let eLat = Number(event.latitude);
            let eLng = Number(event.longitude);

            if (isNaN(eLat) || isNaN(eLng) || eLat === 0 || eLng === 0) {
                const normLoc = (event.location || '').toLowerCase();
                const matchedKey = Object.keys(cityCoordsMap).find(k => normLoc.includes(k));
                if (matchedKey) {
                    [eLat, eLng] = cityCoordsMap[matchedKey];
                } else {
                    [eLat, eLng] = [30.7333, 76.7794];
                }
            }

            const dist = calculateDistance(userLat, userLng, eLat, eLng);

            return {
                ...event.toObject(),
                latitude: eLat,
                longitude: eLng,
                distanceKm: dist
            };
        });

        let filtered = processed;
        if (category && category !== 'all') {
            filtered = filtered.filter(e => e.category === category);
        }

        const maxRadius = Number(radius);
        if (!isNaN(maxRadius) && maxRadius > 0) {
            filtered = filtered.filter(e => e.distanceKm <= maxRadius);
        }

        if (sortBy === 'distance') {
            filtered.sort((a, b) => a.distanceKm - b.distanceKm);
        } else if (sortBy === 'payout') {
            filtered.sort((a, b) => (b.artistPayout || b.price || 0) - (a.artistPayout || a.price || 0));
        }

        res.status(200).json({
            success: true,
            total: filtered.length,
            userLocation: { lat: userLat, lng: userLng },
            events: filtered
        });
    } catch (error) {
        console.error("Get Nearby Events Error:", error);
        res.status(500).json({ success: false, message: "Error fetching nearby events", error: error.message });
    }
};

exports.generateEventTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const event = await Event.findById(id).populate('organizer', 'name email profilePic');
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        const isAttendee = event.attendees.some(att => att.toString() === userId.toString());
        const isOrganizer = event.organizer?._id?.toString() === userId.toString();

        if (!isAttendee && !isOrganizer) {
            event.attendees.addToSet(userId);
            await event.save();
        }

        let existingTicket = event.tickets.find(t => t.user.toString() === userId.toString());

        if (!existingTicket) {
            const randomCode = 'ART-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            const qrPayload = JSON.stringify({
                ticketCode: randomCode,
                eventId: event._id,
                userId: userId,
                issuedAt: Date.now()
            });
            const qrToken = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'artify_ticket_secret').update(qrPayload).digest('hex');

            existingTicket = {
                ticketCode: randomCode,
                user: userId,
                qrToken,
                status: 'valid',
                checkedInAt: null,
                createdAt: new Date()
            };

            event.tickets.push(existingTicket);
            await event.save();
        }

        res.status(200).json({
            success: true,
            ticket: existingTicket,
            event: {
                _id: event._id,
                title: event.title,
                location: event.location,
                date: event.date,
                time: event.time,
                category: event.category,
                price: event.price,
                organizer: event.organizer
            },
            attendee: {
                name: req.user.name,
                email: req.user.email,
                profilePic: req.user.profilePic
            }
        });
    } catch (error) {
        console.error("Generate Ticket Error:", error);
        res.status(500).json({ success: false, message: "Error generating ticket pass", error: error.message });
    }
};

exports.getMyEventTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const event = await Event.findById(id).populate('organizer', 'name email profilePic');
        if (!event) {
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        let ticket = event.tickets.find(t => t.user.toString() === userId.toString());

        if (!ticket) {
            return exports.generateEventTicket(req, res);
        }

        res.status(200).json({
            success: true,
            ticket,
            event: {
                _id: event._id,
                title: event.title,
                location: event.location,
                date: event.date,
                time: event.time,
                category: event.category,
                price: event.price,
                organizer: event.organizer
            },
            attendee: {
                name: req.user.name,
                email: req.user.email,
                profilePic: req.user.profilePic
            }
        });
    } catch (error) {
        console.error("Get My Ticket Error:", error);
        res.status(500).json({ success: false, message: "Error fetching ticket" });
    }
};

exports.verifyTicketEntry = async (req, res) => {
    try {
        const { ticketCode, qrToken, eventId } = req.body;

        if (!ticketCode && !qrToken) {
            return res.status(400).json({ success: false, message: "Ticket Code or QR Token is required for entry scan." });
        }

        let event;
        if (eventId) {
            event = await Event.findById(eventId).populate('tickets.user', 'name email profilePic');
        } else {
            event = await Event.findOne({
                'tickets': {
                    $elemMatch: {
                        $or: [{ ticketCode: ticketCode?.toUpperCase() }, { qrToken }]
                    }
                }
            }).populate('tickets.user', 'name email profilePic');
        }

        if (!event) {
            return res.status(404).json({ success: false, message: "Ticket not found in system database." });
        }

        const targetTicket = event.tickets.find(t =>
            (ticketCode && t.ticketCode.toUpperCase() === ticketCode.toUpperCase()) ||
            (qrToken && t.qrToken === qrToken)
        );

        if (!targetTicket) {
            return res.status(404).json({ success: false, message: "Invalid Ticket Pass code." });
        }

        if (targetTicket.status === 'checked_in') {
            return res.status(400).json({
                success: false,
                alreadyCheckedIn: true,
                message: `⚠️ ALREADY USED! Ticket was checked in on ${new Date(targetTicket.checkedInAt).toLocaleTimeString('en-IN')}.`,
                ticket: targetTicket,
                eventTitle: event.title
            });
        }

        targetTicket.status = 'checked_in';
        targetTicket.checkedInAt = new Date();
        await event.save();

        res.status(200).json({
            success: true,
            granted: true,
            message: "🎉 ENTRY GRANTED! Ticket pass verified successfully.",
            ticket: targetTicket,
            event: {
                title: event.title,
                location: event.location,
                date: event.date,
                time: event.time
            },
            attendee: targetTicket.user
        });
    } catch (error) {
        console.error("Verify Ticket Entry Error:", error);
        res.status(500).json({ success: false, message: "Error verifying ticket entry" });
    }
};
