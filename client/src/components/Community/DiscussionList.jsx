import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Zap, Send, Loader2, Trash2 } from 'lucide-react';
import PostCard from './PostCard';

export function DiscussionList() {
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('user'));

    const fetchPosts = async () => {
        try {
            const res = await api.get('/posts/all');
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
            await api.post('/posts/new', {
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
                await api.delete(`/posts/${postId}`);
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
                        <div key={post._id} className="relative">

                            <PostCard post={post} />

                            {isOwner && (
                                <button
                                    onClick={() => handleDelete(post._id)}
                                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 opacity-50 hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                    title="Delete Post"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}