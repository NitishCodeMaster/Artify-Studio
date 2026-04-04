const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage, startConversation } = require('../controllers/messageController');
const { authUser } = require('../middleware/authMiddleware');

router.get('/conversations', authUser, getConversations);
router.post('/start/:userId', authUser, startConversation);
router.get('/:chatId', authUser, getMessages);
router.post('/:chatId', authUser, sendMessage);

module.exports = router;