const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');

const formatConversationForUser = (conversation, userId) => {
    const otherUser = conversation.participants.find(p => p._id.toString() !== userId.toString());

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

        let chat = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });

        if (!chat) {
            chat = await Conversation.create({
                participants: [senderId, receiverId],
                lastMessage: "Started a new conversation ✨"
            });
        }

        res.status(200).json({ success: true, conversation: chat });
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

        const newMessage = await Message.create({
            conversationId: chatId,
            sender: senderId,
            text: text
        });

        const conversation = await Conversation.findByIdAndUpdate(chatId, {
            lastMessage: text
        }, { new: true }).populate('participants', 'name profilePic');

        const io = req.app.get('io');
        const payload = {
            _id: newMessage._id.toString(),
            conversationId: chatId,
            text: text,
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

        const io = req.app.get('io');
        io.to(message.conversationId.toString()).emit("message_deleted", messageId);

        res.status(200).json({ success: true, messageId });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
