import React, { useState, useEffect } from 'react';
import { Star, Send, User, MessageSquare, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../../utils/api';
const userProfile = JSON.parse(localStorage.getItem("user"));

export const ReviewSection = ({ targetId, onModel }) => {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await api.get(`/reviews/${targetId}`);
                if (res.data.success) {
                    setReviews(res.data.reviews);
                }
            } catch (err) {
                console.error("Error fetching reviews:", err);
            } finally {
                setFetching(false);
            }
        };

        if (targetId) fetchReviews();
    }, [targetId]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();

        console.log("Checking targetId before submit:", targetId);

        if (!targetId) {
            return toast.error("Technical Error: Target ID not found!");
        }

        if (!comment.trim()) return toast.error("Write a vibe check first! ✍️");

        setLoading(true);

        try {
            const res = await api.post('/reviews/add', {
                targetId,
                onModel,
                rating,
                comment
            });

            if (res.data.success) {
                toast.success("Vibe check posted! ⭐");
                setReviews(prev => [res.data.review, ...prev]);
                setComment("");
                setRating(5);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to post review");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("confirm delete?")) return;

        try {
            const res = await api.delete(`/reviews/delete/${reviewId}`);
            if (res.data.success) {
                toast.success("Review removed!");
                setReviews(prev => prev.filter(r => r._id !== reviewId));
            }
        } catch (err) {
            toast.error("Failed to delete review!");
        }
    };

    return (
        <div className="space-y-12 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl"
            >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <h4 className="text-xl font-black italic text-white uppercase tracking-tighter">Post a Review</h4>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Share your experience with the community</p>
                    </div>

                    <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((num) => (
                            <button
                                key={num}
                                onMouseEnter={() => setHover(num)}
                                onMouseLeave={() => setHover(0)}
                                onClick={() => setRating(num)}
                                className="focus:outline-none transition-transform active:scale-90"
                            >
                                <Star
                                    size={24}
                                    className={`transition-all duration-300 ${num <= (hover || rating)
                                        ? "fill-amber-500 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                                        : "text-white/5"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative">
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="What was the highlight of the event?..."
                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-white text-sm focus:outline-none focus:border-indigo-500/50 min-h-[120px] transition-all resize-none"
                    />
                    <button
                        onClick={handleReviewSubmit}
                        disabled={loading}
                        className="absolute bottom-4 right-4 px-6 py-3 bg-white text-black hover:bg-indigo-500 hover:text-white rounded-xl shadow-xl transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest disabled:opacity-50"
                    >
                        {loading ? "Posting..." : "Submit"}
                        <Send size={14} />
                    </button>
                </div>
            </motion.div>

            <div className="space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <h5 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] whitespace-nowrap">Community Feedback</h5>
                    <div className="h-px w-full bg-white/5"></div>
                </div>

                {fetching ? (
                    <p className="text-center text-white/20 animate-pulse uppercase text-xs tracking-widest">Loading Reviews...</p>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-10 opacity-20">
                        <MessageSquare size={40} className="mx-auto mb-4" />
                        <p className="text-xs font-bold uppercase tracking-widest">No reviews yet. Be the first!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence>
                            {reviews.map((rev, i) => (
                                <motion.div
                                    key={rev._id || i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex gap-5 group hover:bg-white/[0.04] transition-all"
                                >
                                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                                        {rev.user?.profilePic ? (
                                            <img src={rev.user.profilePic} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <User size={20} className="text-white/20" />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">

                                            <h6 className="text-sm font-black uppercase tracking-tight text-white/90">
                                                {rev.user?.name || "Artify Citizen"}
                                            </h6>

                                            <div className="flex items-center gap-2">

                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, starIdx) => (
                                                        <Star
                                                            key={starIdx}
                                                            size={10}
                                                            className={`${starIdx < rev.rating ? "fill-amber-500 text-amber-500" : "text-white/5"}`}
                                                        />
                                                    ))}
                                                </div>

                                                {userProfile && (rev.user?._id === userProfile._id || rev.user === userProfile._id) && (
                                                    <button
                                                        onClick={() => handleDeleteReview(rev._id)}
                                                        className="p-1 text-white/20 hover:text-red-500 rounded transition"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}

                                            </div>
                                        </div>
                                        <p className="text-sm text-white/50 leading-relaxed font-light">
                                            {rev.comment}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};