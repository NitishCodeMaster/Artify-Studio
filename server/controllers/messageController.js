const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');

const isParticipant = (conversation, userId) => {
    return conversation?.participants?.some((participant) => {
        const id = participant?._id || participant;
        return id?.toString() === userId.toString();
    });
};

const formatConversationForUser = (conversation, userId) => {
    const otherUser = conversation.participants.find(p => {
        const id = p?._id || p;
        return id?.toString() !== userId.toString();
    });

    return {
        _id: conversation._id,
        user: otherUser || { name: "Unknown User" },
        lastMessage: conversation.lastMessage,
        updatedAt: conversation.updatedAt
    };
};

exports.startConversation = async (req, res) => {
    try {
        const senderId = req.user._id || req.user.id;
        const receiverId = req.params.userId;

        if (!receiverId || senderId.toString() === receiverId.toString()) {
            return res.status(400).json({ success: false, message: "Invalid conversation user" });
        }

        const receiverExists = await User.exists({ _id: receiverId });
        if (!receiverExists) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let chat = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('participants', 'name profilePic');

        if (!chat) {
            chat = await Conversation.create({
                participants: [senderId, receiverId],
                lastMessage: "Started a new conversation ✨"
            });
            chat = await chat.populate('participants', 'name profilePic');
        }

        res.status(200).json({ success: true, conversation: formatConversationForUser(chat, senderId) });
    } catch (error) {
        console.error("Error starting chat:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        }).populate('participants', 'name profilePic').sort({ updatedAt: -1 });

        const formattedConversations = conversations.map(conv => formatConversationForUser(conv, userId));

        res.status(200).json({ success: true, conversations: formattedConversations });
    } catch (error) {
        console.error("Error fetching conversations:", error);
        res.status(500).json({ success: false, message: "Error fetching chats" });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id.toString();

        const conversation = await Conversation.findById(chatId);
        if (!conversation) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }
        if (!isParticipant(conversation, userId)) {
            return res.status(403).json({ success: false, message: "You cannot access this chat" });
        }

        const messages = await Message.find({ conversationId: chatId }).sort({ createdAt: 1 });

        const formattedMessages = messages.map(msg => ({
            _id: msg._id,
            text: msg.text,
            createdAt: msg.createdAt,
            sender: msg.sender.toString() === userId ? 'me' : 'other'
        }));

        res.status(200).json({ success: true, messages: formattedMessages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Error fetching messages" });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { text } = req.body;
        const senderId = req.user._id;
        const cleanText = String(text || '').trim();

        if (!cleanText) {
            return res.status(400).json({ success: false, message: "Message cannot be empty" });
        }

        const existingConversation = await Conversation.findById(chatId);
        if (!existingConversation) {
            return res.status(404).json({ success: false, message: "Chat not found" });
        }
        if (!isParticipant(existingConversation, senderId)) {
            return res.status(403).json({ success: false, message: "You cannot send messages in this chat" });
        }

        const newMessage = await Message.create({
            conversationId: chatId,
            sender: senderId,
            text: cleanText
        });

        const conversation = await Conversation.findByIdAndUpdate(chatId, {
            lastMessage: cleanText
        }, { new: true }).populate('participants', 'name profilePic');

        const io = req.app.get('io');
        const payload = {
            _id: newMessage._id.toString(),
            conversationId: chatId,
            text: cleanText,
            sender: senderId.toString(),
            createdAt: newMessage.createdAt
        };

        io.to(chatId).emit("receive_message", payload);

        if (conversation) {
            conversation.participants.forEach((participant) => {
                io.to(`user:${participant._id.toString()}`).emit(
                    "conversation_updated",
                    formatConversationForUser(conversation, participant._id)
                );
            });
        }

        res.status(201).json({ success: true, message: payload });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error" });
    }
};
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user._id || req.user.id;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ success: false, message: "Message not found" });
        }

        if (message.sender.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await Message.findByIdAndDelete(messageId);

        const latestMessage = await Message.findOne({ conversationId: message.conversationId }).sort({ createdAt: -1 });
        const conversation = await Conversation.findByIdAndUpdate(message.conversationId, {
            lastMessage: latestMessage?.text || "No messages yet"
        }, { new: true }).populate('participants', 'name profilePic');

        const io = req.app.get('io');
        io.to(message.conversationId.toString()).emit("message_deleted", messageId);

        if (conversation) {
            conversation.participants.forEach((participant) => {
                io.to(`user:${participant._id.toString()}`).emit(
                    "conversation_updated",
                    formatConversationForUser(conversation, participant._id)
                );
            });
        }

        res.status(200).json({ success: true, messageId });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
