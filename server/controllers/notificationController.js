const Notification = require('../models/notification');

// Helper to create and send real-time notification with idempotency check
const createNotification = async (req, { recipient, sender, type, title, message, link, eventId }) => {
    try {
        if (!recipient) return null;
        const recipientId = recipient.toString();

        // Idempotency check: avoid duplicate identical notifications created within 10 seconds
        const tenSecondsAgo = new Date(Date.now() - 10000);
        const existing = await Notification.findOne({
            recipient: recipientId,
            type,
            title,
            createdAt: { $gte: tenSecondsAgo }
        });

        if (existing) {
            return existing;
        }

        const notification = await Notification.create({
            recipient: recipientId,
            sender: sender || null,
            type: type || 'system',
            title,
            message,
            link: link || '',
            eventId: eventId || null,
            isRead: false
        });

        // Real-time Socket.IO emission to recipient's room
        const io = req.app?.get('io');
        if (io) {
            io.to(`user:${recipientId}`).emit('new_notification', notification);
        }

        return notification;
    } catch (error) {
        console.error("❌ Create Notification Error:", error.message);
        return null;
    }
};

// GET /api/notifications - Get user notifications sorted by newest first
const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const limit = Number(req.query.limit) || 20;

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('sender', 'name profilePic role')
            .lean();

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });

        res.status(200).json({
            success: true,
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error("❌ Get Notifications Error:", error);
        res.status(500).json({ success: false, message: "Failed to load notifications" });
    }
};

// GET /api/notifications/unread-count
const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });

        res.status(200).json({ success: true, unreadCount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error counting unread notifications" });
    }
};

// PUT /api/notifications/:id/read - Mark single notification as read
const markAsRead = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipient: userId },
            { $set: { isRead: true } },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });

        res.status(200).json({
            success: true,
            message: "Marked as read",
            notification,
            unreadCount
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error marking notification as read" });
    }
};

// PUT /api/notifications/mark-all-read - Mark all notifications as read
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;

        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read ✨",
            unreadCount: 0
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error marking all as read" });
    }
};

// DELETE /api/notifications/:id - Delete notification
const deleteNotification = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const { id } = req.params;

        await Notification.deleteOne({ _id: id, recipient: userId });

        const unreadCount = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });

        res.status(200).json({
            success: true,
            message: "Notification removed",
            unreadCount
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting notification" });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
