import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Zap, MessageSquare, Heart, Send, Loader2, Trash2 } from 'lucide-react';

export function DiscussionList() {
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('user'));

    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/posts/all');
            setPosts(res.data.posts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("Please login to post in the community!");
            return;
        }

        if (!newPostContent.trim()) return;

        setSubmitting(true);
        try {
            await axios.post('http://localhost:5000/posts/new', {
                user: currentUser._id || currentUser.id,
                content: newPostContent,
                category: "General"
            });

            setNewPostContent('');
            fetchPosts();
        } catch (error) {
            alert("Error creating post!");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (postId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/posts/${postId}`);
                setPosts(posts.filter(post => post._id !== postId));
            } catch (error) {
                console.error("Delete error:", error);
                alert("Failed to delete post");
            }
        }
    };

    return (
        <div className="lg:col-span-2 space-y-6">

            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/10 mb-8 shadow-xl shadow-indigo-500/5">
                <h3 className="text-lg font-bold text-white mb-4">Start a Discussion</h3>
                <form onSubmit={handlePostSubmit} className="flex flex-col gap-3">
                    <textarea
                        rows="3"
                        placeholder="What's on your mind? Looking for a band? Need art feedback?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting || !newPostContent.trim()}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold transition-all"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            Post
                        </button>
                    </div>
                </form>
            </div>

            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Zap size={24} className="text-yellow-500" /> Community Feed
                </h3>
            </div>

            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-500" size={30} /></div>
            ) : posts.length === 0 ? (
                <div className="text-center py-10 text-white/50 bg-[#0f0f0f] border border-white/5 rounded-2xl">
                    No posts yet. Be the first to start a discussion!
                </div>
            ) : (
                posts.map((post) => { 
                    const isOwner = currentUser && (post.user?._id === currentUser._id || post.user?._id === currentUser.id);

                    return (
                        <div key={post._id} className="relative group p-6 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/5">
 
                            {isOwner && (
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                    title="Delete Post"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                    {post.user?.name?.charAt(0) || 'A'}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border text-indigo-400 bg-indigo-500/10 border-indigo-500/20">
                                            {post.category || 'General'}
                                        </span>
                                        <span className="text-xs text-white/30">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p className="text-lg font-medium text-white mb-2 leading-relaxed">
                                        {post.content}
                                    </p>

                                    <div className="flex items-center gap-6 text-sm text-white/40 mt-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
                                            <Heart size={16} /> {post.likes?.length || 0} Likes
                                        </div>
                                        <div className="flex items-center gap-2 hover:text-white cursor-pointer transition-colors">
                                            <MessageSquare size={16} /> {post.comments?.length || 0} Comments
                                        </div>
                                        <div className="ml-auto text-white/60 text-xs">
                                            Posted by <span className="text-white font-medium">{post.user?.name || 'Unknown User'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}