import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { Zap, Send, Loader2, Trash2, Tag, Filter, Image as ImageIcon, X } from 'lucide-react';
import PostCard from './postCard';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import { io } from 'socket.io-client';

const POST_CATEGORIES = ['General', 'Looking for Band', 'Art Feedback', 'Gigs'];

export function DiscussionList() {
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [postCategory, setPostCategory] = useState('General');
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [imageUrl, setImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const socket = io("http://localhost:5000");

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const endpoint = activeFilter === 'All'
                ? '/posts/all'
                : `/posts/all?category=${encodeURIComponent(activeFilter)}`;

            const res = await api.get(endpoint);
            setPosts(res.data.posts);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [activeFilter]);

    useEffect(() => {
        socket.on("new_post", (newPost) => {
            setPosts((prev) => {
                if (activeFilter === 'All' || activeFilter === newPost.category) {
                    return [newPost, ...prev];
                }
                return prev;
            });
        });

        socket.on("post_deleted", (postId) => {
            setPosts((prev) => prev.filter(post => post._id !== postId));
        });

        socket.on("update_likes", ({ postId, likes }) => {
            setPosts((prev) => prev.map(post => post._id === postId ? { ...post, likes } : post));
        });

        socket.on("update_comments", ({ postId, comments }) => {
            setPosts((prev) => prev.map(post => post._id === postId ? { ...post, comments } : post));
        });

        return () => {
            socket.off("new_post");
            socket.off("post_deleted");
            socket.off("update_likes");
            socket.off("update_comments");
        };
    }, [activeFilter]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);

        formData.append('upload_preset', 'artify_community');

        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/dinlyqk3c/image/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.secure_url) {
                setImageUrl(data.secure_url);
            }
        } catch (err) {
            console.error("Upload error", err);
            alert("Failed to upload image. Please try again.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser) {
            alert("Please login to post in the community!");
            return;
        }

        if (!newPostContent.trim() && !imageUrl) {
            alert("Please write something or upload an image!");
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/posts/new', {
                user: currentUser._id || currentUser.id,
                content: newPostContent,
                category: postCategory,
                image: imageUrl
            });

            setNewPostContent('');
            setPostCategory('General');
            setImageUrl('');

            if (activeFilter !== 'All' && activeFilter !== postCategory) {
                setActiveFilter('All');
            } else {
                fetchPosts();
            }
        } catch (error) {
            alert("Error creating post!");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const initiateDelete = (postId) => {
        setPostToDelete(postId);
        setDeleteModalOpen(true);
    };

    const confirmDeleteAction = async () => {
        if (!postToDelete) return;

        try {
            await api.delete(`/posts/${postToDelete}`);
            setPosts(posts.filter(post => post._id !== postToDelete));
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete post");
        } finally {
            setDeleteModalOpen(false);
            setPostToDelete(null);
        }
    };

    return (
        <div className="lg:col-span-2 space-y-6">

            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/10 mb-8 shadow-xl shadow-indigo-500/5">
                <h3 className="text-lg font-bold text-white mb-4">Start a Discussion</h3>
                <form onSubmit={handlePostSubmit} className="flex flex-col gap-4">
                    <textarea
                        rows="3"
                        placeholder="What's on your mind? Looking for a band? Need art feedback?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 resize-none"
                    />

                    {imageUrl && (
                        <div className="relative w-fit mt-2">
                            <img src={imageUrl} alt="Upload preview" className="h-32 rounded-lg border border-white/10 object-cover" />
                            <button
                                type="button"
                                onClick={() => setImageUrl('')}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/10">
                                <Tag size={16} className="text-indigo-400" />
                                <select
                                    value={postCategory}
                                    onChange={(e) => setPostCategory(e.target.value)}
                                    className="bg-transparent text-sm text-white/80 focus:outline-none cursor-pointer"
                                >
                                    {POST_CATEGORIES.map(cat => (
                                        <option key={cat} value={cat} className="bg-[#0f0f0f]">{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <input
                                type="file"
                                ref={fileInputRef}
                                hidden
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                disabled={uploadingImage}
                                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 px-4 py-2 rounded-xl border border-white/10 transition-colors"
                                title="Upload Image"
                            >
                                {uploadingImage ? <Loader2 className="animate-spin text-indigo-400" size={18} /> : <ImageIcon size={18} className="text-indigo-400" />}
                                <span className="text-sm font-medium hidden sm:block">Photo</span>
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting || uploadingImage || (!newPostContent.trim() && !imageUrl)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl font-bold transition-all"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            Post
                        </button>
                    </div>
                </form>
            </div>

            <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Zap size={24} className="text-yellow-500" /> Community Feed
                    </h3>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2">
                    <div className="flex items-center justify-center p-2 bg-white/5 rounded-lg border border-white/10 text-white/50 mr-2">
                        <Filter size={16} />
                    </div>
                    {['All', ...POST_CATEGORIES].map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeFilter === filter
                                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/5'
                                }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-500" size={30} /></div>
            ) : posts.length === 0 ? (
                <div className="text-center py-16 text-white/50 bg-[#0f0f0f] border border-dashed border-white/10 rounded-3xl">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Filter size={24} className="text-indigo-400 opacity-50" />
                    </div>
                    <p className="text-lg font-medium text-white/80">No posts in this category yet.</p>
                    <p className="text-sm mt-1">Be the first to start a discussion!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => {
                        const isOwner = currentUser && (post.user?._id === currentUser._id || post.user?._id === currentUser.id);

                        return (
                            <div key={post._id} className="relative group">
                                <PostCard post={post} />

                                {isOwner && (
                                    <button
                                        onClick={() => initiateDelete(post._id)}
                                        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white border border-red-500/20"
                                        title="Delete Post"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteAction}
                title="Delete Post?"
                message="Are you sure you want to delete this post from the community? This action cannot be undone."
            />

        </div>
    );
}