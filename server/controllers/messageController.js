const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');

exports.startConversation = async (req, res) => {
    try {
        const senderId = req.user._id;
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
        res.status(500).json({ success: false, message: "Error starting chat" });
    }
};

exports.getConversations = async (req, res) => {
    try {
        const userId = req.user._id;

        const conversations = await Conversation.find({
            participants: { $in: [userId] }
        }).populate('participants', 'name profilePic').sort({ updatedAt: -1 });

        const formattedConversations = conversations.map(conv => {
            const otherUser = conv.participants.find(p => p._id.toString() !== userId.toString());
            return {
                _id: conv._id,
                user: otherUser || { name: "Unknown User" },
                lastMessage: conv.lastMessage,
                updatedAt: conv.updatedAt
            };
        });

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

        await Conversation.findByIdAndUpdate(chatId, {
            lastMessage: text
        });

        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ success: false, message: "Error sending message" });
    }
};