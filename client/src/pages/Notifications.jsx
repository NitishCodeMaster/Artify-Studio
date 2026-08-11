import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Footer } from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, CheckCheck, Trash2, ArrowLeft, Loader2, Sparkles,
    Briefcase, CreditCard, Ticket, MessageSquare, Calendar, Mail
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const getCategoryBadge = (type) => {
    switch (type) {
        case 'selection':
        case 'gig':
            return { icon: <Briefcase size={14} className="text-amber-400" />, label: 'Gig Selection', color: 'border-amber-500/30 bg-amber-500/10 text-amber-300' };
        case 'application':
            return { icon: <Mail size={14} className="text-indigo-400" />, label: 'Application', color: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300' };
        case 'payment':
            return { icon: <CreditCard size={14} className="text-emerald-400" />, label: 'Payment', color: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' };
        case 'ticket':
            return { icon: <Ticket size={14} className="text-purple-400" />, label: 'VIP Pass', color: 'border-purple-500/30 bg-purple-500/10 text-purple-300' };
        case 'message':
            return { icon: <MessageSquare size={14} className="text-cyan-400" />, label: 'Message', color: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' };
        default:
            return { icon: <Calendar size={14} className="text-white/60" />, label: 'Update', color: 'border-white/20 bg-white/10 text-white/80' };
    }
};

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get('/notifications?limit=50');
            setNotifications(res.data.notifications || []);
        } catch (err) {
            console.error("Fetch notifications error:", err);
            setError("Unable to load notifications. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success("All notifications marked as read ✨");
        } catch {
            toast.error("Failed to mark notifications as read");
        }
    };

    const handleNotificationClick = async (notif) => {
        if (!notif.isRead) {
            try {
                await api.put(`/notifications/${notif._id}/read`);
                setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, isRead: true } : n));
            } catch (e) {
                console.error("Mark read error:", e);
            }
        }
        if (notif.link) {
            navigate(notif.link);
        } else if (notif.eventId) {
            navigate(`/events/${notif.eventId}`);
        } else {
            navigate('/events');
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await api.delete(`/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
            toast.success("Notification removed");
        } catch {
            toast.error("Failed to delete notification");
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'gigs') return n.type === 'selection' || n.type === 'gig' || n.type === 'application';
        if (filter === 'payments') return n.type === 'payment' || n.type === 'ticket';
        return true;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-amber-500/30">
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeft size={18} />
                        </button>
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-black uppercase text-amber-400 tracking-wider mb-1">
                                <Bell size={12} /> Activity Feed
                            </div>
                            <h1 className="text-2xl font-black text-white flex items-center gap-2">
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full font-extrabold">
                                        {unreadCount} New
                                    </span>
                                )}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                            >
                                <CheckCheck size={14} className="text-amber-400" />
                                <span>Mark All as Read</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    {['all', 'unread', 'gigs', 'payments'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setFilter(t)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all shrink-0 cursor-pointer ${filter === t
                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-black'
                                    : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                                }`}
                        >
                            {t === 'all' ? `All Notifications (${notifications.length})` : t === 'unread' ? `Unread (${unreadCount})` : t === 'gigs' ? 'Gigs & Applications' : 'Payments & Passes'}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center space-y-3">
                        <Loader2 size={32} className="animate-spin text-amber-500" />
                        <p className="text-xs text-white/40">Loading notifications...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 border border-red-500/30 bg-red-500/10 rounded-2xl text-center space-y-3">
                        <p className="text-sm text-red-300 font-bold">{error}</p>
                        <button
                            onClick={fetchNotifications}
                            className="px-4 py-2 bg-red-500 text-black font-bold text-xs rounded-xl hover:bg-red-400 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="p-12 border-2 border-dashed border-white/10 rounded-3xl text-center space-y-3 bg-white/[0.01]">
                        <Bell size={40} className="mx-auto text-white/20" />
                        <h3 className="text-base font-bold text-white/70">You're all caught up!</h3>
                        <p className="text-xs text-white/40 max-w-sm mx-auto">
                            New updates about your gig applications, selection status, payments, and ticket passes will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {filteredNotifications.map((n) => {
                                const badge = getCategoryBadge(n.type);

                                return (
                                    <motion.div
                                        key={n._id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        onClick={() => handleNotificationClick(n)}
                                        className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg ${!n.isRead
                                                ? 'bg-[#12121e] border-amber-500/40 hover:border-amber-500/70 shadow-amber-500/5'
                                                : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3.5 min-w-0">
                                            <div className={`p-2.5 rounded-xl border shrink-0 ${badge.color}`}>
                                                {badge.icon}
                                            </div>

                                            <div className="space-y-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h4 className="font-extrabold text-white text-sm group-hover:text-amber-300 transition-colors">
                                                        {n.title}
                                                    </h4>
                                                    {!n.isRead && (
                                                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                                                    )}
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                                                        {badge.label}
                                                    </span>
                                                </div>

                                                <p className="text-xs text-white/60 leading-relaxed font-normal">
                                                    {n.message}
                                                </p>

                                                <span className="text-[10px] text-white/40 block font-semibold pt-0.5">
                                                    {formatTimeAgo(n.createdAt)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                            <button
                                                onClick={(e) => handleDelete(e, n._id)}
                                                className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                                title="Delete notification"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Notifications;
