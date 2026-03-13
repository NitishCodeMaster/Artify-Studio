const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { toggleLike, addComment } = require('../controllers/postController');
const { authUser } = require('../middleware/authMiddleware');

router.post('/new', authUser,postController.createPost);
router.get('/all', postController.getAllPosts);
router.delete('/:id', authUser, postController.deletePost);

router.put('/:id/like', authUser, toggleLike);
router.post('/:id/comment', authUser, addComment);

module.exports = router;