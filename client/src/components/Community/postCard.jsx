import React, { useState } from 'react';
import { Heart, MessageCircle, Send, UserCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { timeAgo } from '../../utils/timeAgo';
import { useNavigate } from 'react-router-dom';

const PostCard = ({ post }) => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};

    const navigate = useNavigate();
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(currentUser._id || currentUser.id));
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const [commentText, setCommentText] = useState('');
    const [isCommenting, setIsCommenting] = useState(false);

    const handleLike = async () => {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
        setIsLikeAnimating(true);
        setTimeout(() => setIsLikeAnimating(false), 300);

        try {
            await api.put(`/posts/${post._id}/like`);
        } catch (error) {
            console.error("Like failed:", error);
            setIsLiked(!isLiked);
            setLikesCount(prev => isLiked ? prev + 1 : prev - 1);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsCommenting(true);
        try {
            const res = await api.post(`/posts/${post._id}/comment`, { text: commentText });

            setComments(res.data.comments || [...comments, { text: commentText, user: currentUser }]);
            setCommentText(''); // Input box khaali karo
        } catch (error) {
            console.error("Comment failed:", error);
            alert("Failed to post comment. Try again.");
        } finally {
            setIsCommenting(false);
        }
    };

    return (
        <div className="bg-[#111] border border-white/[0.05] rounded-2xl p-5 mb-6 text-white/90">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-500">
                        <UserCircle2 size={24} />
                    </div>
                    <div>
                        <h4
                            onClick={() => post.user?._id && navigate(`/profile/${post.user._id}`)}
                            className="font-bold text-base text-white hover:text-amber-400 cursor-pointer transition-colors"
                        >
                            {post.user?.name || "Anonymous Artist"}
                        </h4>
                        <span className="text-white/40 text-xs font-medium">
                            {timeAgo(post.createdAt)}
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-white/80 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                {post.content}
            </p>

            {post.image && (
                <div className="rounded-xl overflow-hidden mb-4 border border-white/[0.05]">
                    <img src={post.image} alt="Post Attachment" className="w-full h-auto object-cover max-h-[400px]" />
                </div>
            )}

            <div className="flex items-center gap-6 pt-3 border-t border-white/[0.05]">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={handleLike}>
                    <motion.div
                        animate={isLikeAnimating ? { scale: [1, 1.4, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        <Heart
                            size={20}
                            className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-white/40 group-hover:text-red-400'}`}
                        />
                    </motion.div>
                    <span className={`text-sm font-medium transition-colors ${isLiked ? 'text-red-500' : 'text-white/50 group-hover:text-red-400'}`}>
                        {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
                    </span>
                </div>

                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => setShowComments(!showComments)}
                >
                    <MessageCircle size={20} className="text-white/40 group-hover:text-amber-500 transition-colors" />
                    <span className="text-sm font-medium text-white/50 group-hover:text-amber-500 transition-colors">
                        {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                    </span>
                </div>
            </div>

            <AnimatePresence>
                {showComments && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 mt-4 border-t border-white/[0.02]">

                            <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-5">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center">
                                    <UserCircle2 size={18} className="text-white/50" />
                                </div>
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        className="w-full bg-[#1a1a1a] border border-white/10 rounded-full py-2 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-amber-500/50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!commentText.trim() || isCommenting}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-amber-500 disabled:text-white/20 transition-colors p-1"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar pr-2">
                                {comments.length > 0 ? (
                                    comments.map((cmd, idx) => (
                                        <div key={idx} className="flex gap-3 text-sm">
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex-shrink-0 flex items-center justify-center mt-0.5">
                                                <UserCircle2 size={16} className="text-white/40" />
                                            </div>
                                            <div className="bg-[#1a1a1a] px-4 py-2.5 rounded-2xl rounded-tl-sm border border-white/[0.02] flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="font-semibold text-white/80 text-xs">
                                                        {cmd.user?.name || "Community Member"}
                                                    </span>
                                                    <span className="text-[10px] text-white/30">
                                                        {cmd.createdAt ? timeAgo(cmd.createdAt) : "Just now"}
                                                    </span>
                                                </div>
                                                <p className="text-white/70 leading-relaxed">{cmd.text}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-white/30 text-xs py-2">No comments yet. Be the first to start the conversation!</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PostCard;