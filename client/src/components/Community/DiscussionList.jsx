import React, { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { Send, Loader2, Trash2, Tag, Filter, Image as ImageIcon, X, MessageSquare, Mic, Square, PlayCircle } from 'lucide-react';
import PostCard from './postCard';
import ConfirmDeleteModal from '../ConfirmDeleteModal';
import { io } from 'socket.io-client';
import Masonry from 'react-masonry-css';

const POST_CATEGORIES = ['General', 'Looking for Band', 'Art Feedback', 'Gigs'];

export function DiscussionList({ missionDraft }) {
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [postCategory, setPostCategory] = useState('General');
    const [activeFilter, setActiveFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [imageUrl, setImageUrl] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const fileInputRef = useRef(null);
    const [voiceIntro, setVoiceIntro] = useState(null);
    const [recording, setRecording] = useState(false);
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const recordingSecondsRef = useRef(0);
    const recorderRef = useRef(null);
    const chunksRef = useRef([]);
    const streamRef = useRef(null);
    const timerRef = useRef(null);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const socket = io("http://localhost:5000");

    const breakpointColumnsObj = {
        default: 3,
        1500: 2,
        1100: 2,
        700: 1
    };

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

    useEffect(() => () => {
        if (timerRef.current) clearInterval(timerRef.current);
        streamRef.current?.getTracks().forEach((track) => track.stop());
    }, []);

    useEffect(() => {
        if (!missionDraft) return;
        setNewPostContent(missionDraft.text || '');
        setPostCategory(missionDraft.category || 'General');
    }, [missionDraft]);

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
            alert("Failed to upload image.");
        } finally {
            setUploadingImage(false);
        }
    };

    const stopRecording = () => {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
            recorderRef.current.stop();
        }
    };

    const startRecording = async () => {
        if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
            alert('Voice recording is not supported in this browser.');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            chunksRef.current = [];
            const recorder = new MediaRecorder(stream);
            recorderRef.current = recorder;
            setRecordingSeconds(0);
            recordingSecondsRef.current = 0;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
                const reader = new FileReader();
                reader.onloadend = () => {
                    setVoiceIntro({
                        url: reader.result,
                        duration: Math.min(recordingSecondsRef.current || 20, 20),
                        mimeType: blob.type,
                    });
                };
                reader.readAsDataURL(blob);
                stream.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
                setRecording(false);
                if (timerRef.current) clearInterval(timerRef.current);
            };

            recorder.start();
            setRecording(true);
            timerRef.current = setInterval(() => {
                setRecordingSeconds((prev) => {
                    const next = prev + 1;
                    recordingSecondsRef.current = next;
                    if (next >= 20) stopRecording();
                    return Math.min(next, 20);
                });
            }, 1000);
        } catch (error) {
            console.error('Voice recording failed:', error);
            alert('Microphone permission denied or recording failed.');
        }
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) return alert("Please login to post!");
        if (!newPostContent.trim() && !imageUrl && !voiceIntro?.url) return alert("Write something, upload a photo, or record a voice intro!");

        setSubmitting(true);
        try {
             await api.post('/posts/new', {
                user: currentUser._id || currentUser.id,
                content: newPostContent,
                category: postCategory,
                image: imageUrl,
                voiceIntro
            });

            setNewPostContent('');
            setPostCategory('General');
            setImageUrl('');
            setVoiceIntro(null);

            if (activeFilter !== 'All' && activeFilter !== postCategory) {
                setActiveFilter('All');
            } else {
                fetchPosts();
            }
        } catch (error) {
            console.error(error.response?.data?.message || "Error creating post");
            alert(error.response?.data?.message || "Error creating post!");
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
            console.error("Delete failed:", error);
            alert("Failed to delete post");
        } finally {
            setDeleteModalOpen(false);
            setPostToDelete(null);
        }
    };

    return (
        <div className="space-y-8 min-w-0">
            <div className="p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl shadow-indigo-500/10">
                <div className="p-6 rounded-[23px] bg-[#0a0a0a]">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <MessageSquare size={18} className="text-indigo-400" /> Start a Discussion
                    </h3>
                    <form onSubmit={handlePostSubmit} className="flex flex-col gap-4">
                        <textarea
                            rows="3"
                            placeholder="What's on your mind? Need art feedback?"
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
                        />

                        {imageUrl && (
                            <div className="relative w-fit">
                                <img src={imageUrl} alt="preview" className="h-32 rounded-lg border border-white/10 object-cover" />
                                <button type="button" onClick={() => setImageUrl('')} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-xl"><X size={14} /></button>
                            </div>
                        )}

                        {voiceIntro && (
                            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-3">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <span className="flex items-center gap-2 text-sm font-bold text-emerald-100">
                                        <PlayCircle size={16} />
                                        Voice intro attached ({voiceIntro.duration}s)
                                    </span>
                                    <button type="button" onClick={() => setVoiceIntro(null)} className="rounded-full bg-black/30 p-1 text-white/60 hover:text-white">
                                        <X size={14} />
                                    </button>
                                </div>
                                <audio controls src={voiceIntro.url} className="h-9 w-full" />
                            </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 pt-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                    <Tag size={16} className="text-indigo-400" />
                                    <select value={postCategory} onChange={(e) => setPostCategory(e.target.value)} className="bg-transparent text-sm text-white/80 outline-none cursor-pointer">
                                        {POST_CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#0f0f0f]">{cat}</option>)}
                                    </select>
                                </div>
                                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                                <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploadingImage} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-indigo-400 border border-white/10 transition-all">
                                    {uploadingImage ? <Loader2 className="animate-spin" size={20} /> : <ImageIcon size={20} />}
                                </button>
                                <button
                                    type="button"
                                    onClick={recording ? stopRecording : startRecording}
                                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition-all ${recording ? 'border-red-400/30 bg-red-500/15 text-red-200' : 'border-white/10 bg-white/5 text-emerald-300 hover:bg-white/10'}`}
                                >
                                    {recording ? <Square size={16} /> : <Mic size={16} />}
                                    {recording ? `${recordingSeconds}s / 20s` : 'Voice Intro'}
                                </button>
                            </div>
                            <button type="submit" disabled={submitting || uploadingImage || recording || (!newPostContent.trim() && !imageUrl && !voiceIntro?.url)} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20">
                                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />} Post
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
                <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-white/40"><Filter size={18} /></div>
                {['All', ...POST_CATEGORIES].map(filter => (
                    <button key={filter} onClick={() => setActiveFilter(filter)} className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all border ${activeFilter === filter ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20' : 'bg-white/5 text-white/50 border-white/5 hover:bg-white/10'}`}>
                        {filter}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>
            ) : (
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="flex -ml-6 w-auto"
                    columnClassName="pl-6 bg-clip-padding"
                >
                    {posts.map((post) => {
                        const userId = currentUser?._id || currentUser?.id;
                        const postUserId = post.user?._id || post.user;

                        const isOwner = userId === postUserId;
                        return (
                            <div key={post._id} className="mb-6 group relative">
                                <PostCard post={post} />
                                {isOwner && (
                                    <button onClick={() => initiateDelete(post._id)} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white border border-red-500/20 shadow-xl">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </Masonry>
            )}

            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteAction}
                title="Delete Post?"
                message="Are you sure you want to delete this post?"
            />
        </div>
    );
}
