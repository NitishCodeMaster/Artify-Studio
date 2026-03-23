const Post = require('../models/postModel');

exports.createPost = async (req, res) => {
    try {
        const { content, text, image, category } = req.body;
        const finalContent = content || text;

        if (!finalContent && !image) {
            return res.status(400).json({ success: false, message: "Post cannot be empty!" });
        }

        const newPost = await Post.create({
            content: finalContent,
            image: image || '',
            user: req.user._id,
            category: category || 'General'
        });

        const populatedPost = await Post.findById(newPost._id)
            .populate('user', 'name email')
            .populate('comments.user', 'name');

        req.app.get('io').emit('new_post', populatedPost);

        res.status(201).json({ success: true, message: "Post created successfully! 🎉", post: populatedPost });
    } catch (error) {
        console.error("❌ Create Post Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category && category !== 'All') {
            query.category = category;
        }

        const posts = await Post.find(query)
            .populate('user', 'name email')
            .populate('comments.user', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching posts", error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.params.id);

        req.app.get('io').emit('post_deleted', req.params.id);

        res.status(200).json({ success: true, message: "Post Deleted Successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting post", error: error.message });
    }
};

exports.toggleLike = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const userIdString = req.user._id.toString();
        const isLiked = post.likes.some(id => id.toString() === userIdString);

        if (isLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userIdString);
        } else {
            post.likes.push(req.user._id);
        }

        await post.save();

        req.app.get('io').emit('update_likes', { postId: req.params.id, likes: post.likes });

        res.status(200).json({ success: true, likes: post.likes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "Post not found" });

        const newComment = {
            user: req.user.id,
            text: req.body.text
        };

        post.comments.push(newComment);
        await post.save();

        const updatedPost = await Post.findById(req.params.id).populate('comments.user', 'name');

        req.app.get('io').emit('update_comments', { postId: req.params.id, comments: updatedPost.comments });

        res.status(201).json({ success: true, comments: updatedPost.comments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};