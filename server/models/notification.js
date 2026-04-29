const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['event', 'message', 'payment'], default: 'event' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    link: String,
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);