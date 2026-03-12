const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { toggleLike, addComment } = require('../controllers/postController');
const { authUser } = require('../middleware/authMiddleware');

router.post('/new', postController.createPost);
router.get('/all', postController.getAllPosts);
router.delete('/:id', postController.deletePost);
router.put('/post/:id/like', authUser, toggleLike);
router.post('/post/:id/comment', authUser, addComment);

module.exports = router;