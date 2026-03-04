const Message = require('../models/Message');

// @desc    Get user messages/conversations
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        // Find all messages where the user is either sender or receiver
        const messages = await Message.find({
            $or: [{ sender: userId }, { receiver: userId }]
        })
            .populate('sender', 'name email avatarUrl')
            .populate('receiver', 'name email avatarUrl')
            .sort({ createdAt: -1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
    try {
        const { receiver, content, isSystemMessage } = req.body;
        const sender = req.user.id;

        const newMessage = new Message({
            sender,
            receiver,
            content,
            isSystemMessage: isSystemMessage || false
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMessages,
    sendMessage
};
