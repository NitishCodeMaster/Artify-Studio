const express = require('express');
const router = express.Router();
const {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require('../controllers/notificationController');
const { authUser } = require('../middleware/authMiddleware');

router.get('/', authUser, getNotifications);
router.get('/unread-count', authUser, getUnreadCount);
router.put('/mark-all-read', authUser, markAllAsRead);
router.put('/:id/read', authUser, markAsRead);
router.delete('/:id', authUser, deleteNotification);

module.exports = router;
