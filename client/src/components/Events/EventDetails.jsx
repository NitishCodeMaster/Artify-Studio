import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, Trash2, ShieldCheck, Zap, Ticket, Pencil, QrCode, Camera, User, MessageSquare, ExternalLink, Phone, Mail, Sparkles, CheckCircle2, X } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';
import CreateEventModal from './CreateEventModal';
import EventTicketModal from './EventTicketModal';
import TicketScannerModal from './TicketScannerModal';
import UpiPaymentModal from './UpiPaymentModal';
import { ReviewSection } from './ReviewSection';
import EventMap from './EventMap';
import { buildRazorpayPrefill, loadRazorpay } from '../../utils/razorpay';

const EventDetails = ({ event: propEvent, onBack, refresh, viewMode }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(propEvent || null);
    const { user } = useAuth();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showTicketModal, setShowTicketModal] = useState(false);
    const [showScannerModal, setShowScannerModal] = useState(false);
    const [showUpiModal, setShowUpiModal] = useState(false);
    const [showPaymentOptionModal, setShowPaymentOptionModal] = useState(false);
    const [viewingApplicant, setViewingApplicant] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!event && id) {
            const fetchEvent = async () => {
                try {
                    const res = await api.get(`/events/${id}`);
                    setEvent(res.data.event);
                } catch {
                    toast("Event not available");
                    navigate("/events");
                }
            };

            fetchEvent();
        }
    }, [event, id, navigate]);

    if (!event) {
        return <p className="text-white p-10">Loading event...</p>;
    }

    const currentUser = user || JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("artify_user"));
    const currentUserId = currentUser?._id || currentUser?.id;
    const organizerId = event.organizer?._id || event.organizer;
    const isOwner = Boolean(
        currentUserId &&
        organizerId &&
        currentUserId.toString() === organizerId.toString()
    );

    const isPaidArtistGig = event.gigType === 'paid_gig' || (Number(event.artistPayout) > 0 && Number(event.price) === 0);

    const hasBookedTicket = Boolean(
        currentUserId && (
            event.attendees?.some(att => (att._id || att).toString() === currentUserId.toString()) ||
            event.tickets?.some(t => (t.user?._id || t.user).toString() === currentUserId.toString())
        )
    );

    const [applyMessage, setApplyMessage] = useState('');
    const [demoVideoUrl, setDemoVideoUrl] = useState('');
    const [demoAudioUrl, setDemoAudioUrl] = useState('');
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [isApplying, setIsApplying] = useState(false);

    const hasApplied = event.applicants?.some(
        a => (a.artist?._id || a.artist || a).toString() === currentUserId?.toString()
    );

    const handleApplyGig = async (e) => {
        e?.preventDefault();
        setIsApplying(true);
        try {
            const res = await api.post(`/events/${event._id}/apply`, {
                message: applyMessage,
                demoVideoUrl,
                demoAudioUrl
            });
            if (res.data.success) {
                toast.success(res.data.message || "Applied for Gig! 🚀");
                if (res.data.event) setEvent(res.data.event);
                setShowApplyModal(false);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error applying for gig");
        } finally {
            setIsApplying(false);
        }
    };

    const handleSelectApplicant = async (applicantId) => {
        try {
            const res = await api.post(`/events/${event._id}/select-applicant`, { applicantId });
            if (res.data.success) {
                toast.success("Artist selected for Gig! ✨");
                if (res.data.event) setEvent(res.data.event);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error selecting applicant");
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/events/delete/${event._id}`);
            toast.success("Event Deleted");
            if (refresh) refresh();
            onBack ? onBack() : navigate("/events");
        } catch {
            toast.error("Delete failed");
        }
    };

    const handlePayment = async () => {
        if (Number(event.price) <= 0) {
            try {
                setIsProcessing(true);
                await api.post('/payments/book-free', { eventId: event._id });
                toast.success("Free ticket booked! Opening your VIP pass... 🎟️");
                try {
                    const freshRes = await api.get(`/events/${event._id}`);
                    if (freshRes.data?.event) setEvent(freshRes.data.event);
                } catch {
                    setEvent(prev => ({
                        ...prev,
                        attendees: [...(prev.attendees || []), currentUserId]
                    }));
                }
                if (refresh) refresh();
                setShowTicketModal(true);
            } catch (error) {
                toast.error(error.response?.data?.message || "Free booking failed");
            } finally {
                setIsProcessing(false);
            }
            return;
        }

        // Open Payment Choice Modal (UPI QR Code vs Razorpay)
        setShowPaymentOptionModal(true);
    };

    const handleLaunchRazorpay = async () => {
        setShowPaymentOptionModal(false);
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            toast.error("Razorpay failed to load.");
            return;
        }

        try {
            setIsProcessing(true);
            const { data } = await api.post('/payments/create-order', {
                amount: event.price,
                eventId: event._id
            });

            const prefill = buildRazorpayPrefill(user);
            const options = {
                key: data.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: "Artify Studio",
                description: `Ticket for ${event.title}`,
                order_id: data.order.id,
                prefill,
                config: {
                    display: {
                        preferences: {
                            show_default_blocks: true
                        }
                    }
                },
                theme: { color: "#6366f1" },
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/payments/verify-payment', {
                            ...response,
                            eventId: event._id,
                            totalAmount: event.price
                        });
                        if (verifyRes.data.success) {
                            toast.success("Ticket Booked Successfully! 🎟️");
                            try {
                                const freshRes = await api.get(`/events/${event._id}`);
                                if (freshRes.data?.event) setEvent(freshRes.data.event);
                            } catch {
                                setEvent(prev => ({
                                    ...prev,
                                    attendees: [...(prev.attendees || []), currentUserId]
                                }));
                            }
                            if (refresh) refresh();
                            setShowTicketModal(true);
                        }
                    } catch {
                        toast.error("Verification failed!");
                    }
                },
                modal: {
                    ondismiss: () => setIsProcessing(false),
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Payment Error:", error);
            toast.error("Order creation failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050505] text-white overflow-hidden flex flex-col font-sans"
        >

            <nav className="h-20 shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-black/40 backdrop-blur-xl z-50">
                <button onClick={() => (onBack ? onBack() : navigate(-1))} className="flex items-center gap-3 text-white/40 hover:text-white transition-all group">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.3em]">Back to Hub</span>
                </button>

                <div className="flex items-center gap-3">
                    {!isPaidArtistGig && !isOwner && hasBookedTicket && (
                        <button
                            onClick={() => setShowTicketModal(true)}
                            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl transition-all flex items-center gap-2 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95"
                        >
                            <QrCode size={16} />
                            <span>My Ticket Pass</span>
                        </button>
                    )}

                    {isOwner && (
                        <>
                            {!isPaidArtistGig && (
                                <button
                                    onClick={() => setShowScannerModal(true)}
                                    className="px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl transition-all flex items-center gap-2 text-xs font-black shadow-lg shadow-cyan-500/20 active:scale-95"
                                >
                                    <Camera size={16} />
                                    <span className="hidden sm:inline">Scan Gate Tickets</span>
                                </button>
                            )}
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="px-4 py-2.5 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl transition-all flex items-center gap-2 text-xs font-bold active:scale-95"
                                title="Edit Gig"
                            >
                                <Pencil size={16} />
                                <span className="hidden sm:inline">Edit Gig</span>
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="p-3 text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-all active:scale-95"
                                title="Delete Gig"
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                </div>
            </nav>

            <main className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                <div className="hidden lg:block w-[45%] relative border-r border-white/5 overflow-hidden">
                    <motion.img
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 0.7 }}
                        transition={{ duration: 1.5 }}
                        src={event.bannerImage}
                        className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                        alt={event.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]/40" />

                    <div className="absolute bottom-6 sm:bottom-12 left-4 sm:left-8 md:left-12 right-4 sm:right-8 md:right-12 space-y-3 sm:space-y-6">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 rounded-full"
                        >
                            <Zap size={12} className="fill-white" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                                {isPaidArtistGig ? "Paid Performer Gig" : "Audience Event"}
                            </span>
                        </motion.div>

                        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight uppercase">
                            {event.title}
                        </h1>

                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-7 h-7 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center text-[9px] font-bold text-white/40">A</div>
                                ))}
                            </div>
                            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                                {isPaidArtistGig ? `${event.applicants?.length || 0} Applicants` : `${event.attendees?.length || 0} Attending`}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#080808]/40">
                    <div className="max-w-3xl mx-auto px-6 md:px-10 py-8 space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="space-y-3">
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <Calendar size={14} /> Schedule
                                </span>
                                <h4 className="text-2xl font-bold">{new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h4>
                                <p className="text-sm text-white/30 font-medium">{event.time || "07:00 PM Onwards"}</p>
                            </motion.div>

                            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }} className="space-y-2">
                                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                    <MapPin size={14} /> Venue
                                </span>
                                <h4 className="text-xl font-bold capitalize">{event.location}</h4>
                                <p className="text-sm text-white/30 font-medium">Verified Artify Hub</p>
                            </motion.div>
                        </div>

                        {/* Commercial Gig / Ticket Pass Card */}
                        <motion.div
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="relative group p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-transparent to-white/5"
                        >
                            <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
                                <div className="relative z-10 text-center md:text-left">
                                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1 text-center md:text-left">
                                        {isPaidArtistGig
                                            ? "⭐ Paid Artist Performance Gig"
                                            : (event.gigType === 'ticketed' || Number(event.price) > 0
                                                ? "🎟️ Audience Ticketed Event"
                                                : "🎁 Free Audience Event Pass")}
                                    </p>
                                    <div className="flex items-baseline gap-2 justify-center md:justify-start">
                                        {isPaidArtistGig ? (
                                            <>
                                                <span className="text-3xl font-extrabold tracking-tight text-emerald-400">₹{event.artistPayout || 5000}</span>
                                                <span className="text-xs font-semibold text-emerald-300/70 uppercase tracking-wider">/ Performer Payout</span>
                                            </>
                                        ) : event.gigType === 'ticketed' || Number(event.price) > 0 ? (
                                            <>
                                                <span className="text-3xl font-extrabold tracking-tight text-white">₹{event.price || 500}</span>
                                                <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">/ Ticket Pass</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-2xl font-extrabold tracking-tight text-purple-400">FREE</span>
                                                <span className="text-xs font-semibold text-purple-300/70 uppercase tracking-wider">₹0 Entry Pass</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="relative z-10 w-full md:w-auto">
                                    {isPaidArtistGig ? (
                                        isOwner ? (
                                            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20 inline-block">
                                                Your Gig Post ({event.applicants?.length || 0} Applicants)
                                            </span>
                                        ) : event.applicants?.some(a => (a.artist?._id || a.artist)?.toString() === currentUserId?.toString() && a.status === 'selected') ? (
                                            <div className="w-full md:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 text-emerald-300 border border-emerald-500/50 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                                                <Sparkles size={16} className="text-amber-400 animate-pulse" />
                                                <span>YOU ARE SELECTED FOR THIS GIG! 🎉</span>
                                            </div>
                                        ) : hasApplied ? (
                                            <button disabled className="w-full md:w-auto px-5 py-2.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold text-xs flex items-center justify-center gap-2">
                                                Application Submitted ✓
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setShowApplyModal(true)}
                                                className="w-full md:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-extrabold text-sm transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-95"
                                            >
                                                Apply Now 🚀
                                            </button>
                                        )
                                    ) : (
                                        isOwner ? (
                                            <button
                                                onClick={() => setShowScannerModal(true)}
                                                className="w-full md:w-auto px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 active:scale-95"
                                            >
                                                <Camera size={16} />
                                                <span>Scan Gate Entry Passes 📷</span>
                                            </button>
                                        ) : hasBookedTicket ? (
                                            <button
                                                onClick={() => setShowTicketModal(true)}
                                                className="w-full md:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95"
                                            >
                                                <QrCode size={16} />
                                                <span>View My VIP Gate Pass 🎟️</span>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handlePayment}
                                                disabled={isProcessing}
                                                className="w-full md:w-auto px-6 py-2.5 bg-white text-black rounded-xl font-bold text-sm hover:bg-indigo-500 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                            >
                                                {isProcessing ? "PROCESSING..." : (Number(event.price) > 0 ? "GET TICKETS 🎟️" : "RSVP FREE PASS 🎁")}
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Applicants Section for Gig Organizer */}
                        {isOwner && (
                            <div className="bg-[#111] border border-white/10 p-6 rounded-3xl space-y-4">
                                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                        🎤 Applicants for this Gig <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">{event.applicants?.length || 0}</span>
                                    </h4>
                                </div>

                                {event.applicants && event.applicants.length > 0 ? (
                                    <div className="space-y-3">
                                        {event.applicants.map((app, index) => {
                                            const artist = app.artist || {};
                                            const isSelected = app.status === 'selected';

                                            return (
                                                <div key={index} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-indigo-500/30 transition-all">
                                                    <div
                                                        onClick={() => setViewingApplicant({ artist, message: app.message, status: app.status, date: app.createdAt })}
                                                        className="flex items-center gap-3 cursor-pointer group"
                                                    >
                                                        <img
                                                            src={artist.profilePic || "https://via.placeholder.com/150"}
                                                            className="w-12 h-12 rounded-full object-cover border border-indigo-500/40 shrink-0 group-hover:scale-105 transition-transform"
                                                            alt={artist.name || 'Artist'}
                                                        />
                                                        <div>
                                                            <h5 className="font-bold text-white text-sm flex items-center gap-2 group-hover:text-indigo-300 transition-colors">
                                                                {artist.name || 'Artist Applicant'}
                                                                <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase font-bold">{artist.artStyle || artist.role || 'Artist'}</span>
                                                            </h5>
                                                            <p className="text-xs text-white/60 italic mt-0.5 line-clamp-1">"{app.message || 'Ready to perform for this gig!'}"</p>
                                                        </div>
                                                    </div>

                                                    <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto justify-end">
                                                        <button
                                                            onClick={() => setViewingApplicant({ artist, message: app.message, status: app.status, date: app.createdAt })}
                                                            className="px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                                                        >
                                                            <User size={14} className="text-indigo-400" />
                                                            <span>View Profile</span>
                                                        </button>

                                                        {isSelected ? (
                                                            <span className="px-3 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center gap-1">
                                                                <CheckCircle2 size={14} /> Selected
                                                            </span>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleSelectApplicant(app._id || artist._id)}
                                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                                                            >
                                                                <Sparkles size={14} /> Select Artist
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-xs text-white/40 italic text-center py-4">No artists have applied for this gig yet. Applicant profiles will appear here.</p>
                                )}
                            </div>
                        )}

                        {/* Organizer / Author Card */}
                        <div className="p-4 bg-[#12121e] border border-amber-500/20 rounded-2xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <img
                                    src={event.organizer?.profilePic || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"}
                                    alt={event.organizer?.name || "Organizer"}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/60 shadow-md shrink-0"
                                />
                                <div>
                                    <p className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Posted By Organizer</p>
                                    <h5 className="font-extrabold text-white text-sm hover:text-amber-300 transition-colors">
                                        {event.organizer?.name || "Artify Creator"}
                                    </h5>
                                    <p className="text-[10px] text-white/50">{event.organizer?.role || "Event Host & Creator"}</p>
                                </div>
                            </div>
                            {event.organizer?._id && (
                                <button
                                    onClick={() => navigate(`/profile/${event.organizer._id}`)}
                                    className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                                >
                                    <User size={13} /> View Author Profile ↗
                                </button>
                            )}
                        </div>

                        <div className="space-y-3">
                            <h5 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">The Vision</h5>
                            <p className="text-base font-light text-white/70 leading-relaxed italic">
                                "{event.description || "An immersive journey into the world of art and music, crafted specifically for the Artify collective. Witness creativity in its purest form."}"
                            </p>
                        </div>

                        {/* Event Location Map */}
                        <div className="pt-2 mt-4 border-t border-white/10">
                            <EventMap
                                latitude={event.latitude}
                                longitude={event.longitude}
                                title={event.title}
                                venue={event.location}
                                date={event.date}
                            />
                        </div>

                        <div className="pt-2 mt-4 border-t border-white/10">
                            {event && (
                                <ReviewSection
                                    targetId={event._id}
                                    onModel="Event"
                                />
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold text-white/10 uppercase tracking-[0.2em] pt-2">
                            <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-500" /> Secure Checkout</span>
                            <span className="flex items-center gap-2"><Clock size={14} className="text-indigo-500" /> Instant Pass Generation</span>
                            <span className="flex items-center gap-2"><Zap size={14} className="text-indigo-500" /> Verified Organizer</span>
                        </div>
                    </div>
                </div>
            </main>

            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteConfirmModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDelete}
                        title={event.title}
                    />
                )}
                {showEditModal && (
                    <CreateEventModal
                        isOpen={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        eventToEdit={event}
                        refresh={(updatedEv) => {
                            if (updatedEv) setEvent(updatedEv);
                            if (refresh) refresh();
                        }}
                    />
                )}
                {showApplyModal && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowApplyModal(false)}
                            className="absolute inset-0 bg-black/85 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-[#0e0e17] border border-white/15 w-full max-w-lg p-6 sm:p-7 rounded-3xl z-10 space-y-5 shadow-2xl text-left"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowApplyModal(false)}
                                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={16} />
                            </button>

                            {/* Header */}
                            <div className="space-y-1.5 pr-6">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                                    🎤 Performer Application
                                </div>
                                <h3 className="text-xl font-black text-white leading-snug">
                                    Apply for <span className="text-emerald-400">{event.title}</span>
                                </h3>
                                <p className="text-xs text-white/50 leading-relaxed">
                                    Send your pitch and optional video/audio demo links to the event organizer.
                                </p>
                            </div>

                            <form onSubmit={handleApplyGig} className="space-y-4 pt-1">
                                {/* Pitch Note */}
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-extrabold text-white/70 uppercase tracking-wider flex items-center gap-1.5">
                                        📝 Pitch Note / Experience
                                    </label>
                                    <textarea
                                        required
                                        rows="3"
                                        placeholder="e.g. Hi! I'm a vocalist & acoustic guitarist with 3+ years of live performance experience. Excited to perform at your venue!"
                                        className="w-full bg-white/[0.04] border border-white/10 rounded-2xl p-4 text-white text-xs outline-none focus:border-emerald-500 focus:bg-black/50 transition-all resize-none placeholder:text-white/30"
                                        value={applyMessage}
                                        onChange={(e) => setApplyMessage(e.target.value)}
                                    />
                                </div>

                                {/* Audition Demos Container */}
                                <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                                        ✨ Performance Demos <span className="text-white/40 font-normal lowercase">(optional)</span>
                                    </p>

                                    {/* Video Demo Input */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-white/80 flex items-center gap-1.5">
                                            🎥 Singing / Performance Video URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="YouTube, Vimeo, Instagram, or Cloudinary Video Link..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-emerald-500 transition-all placeholder:text-white/30"
                                            value={demoVideoUrl}
                                            onChange={(e) => setDemoVideoUrl(e.target.value)}
                                        />
                                    </div>

                                    {/* Audio Demo Input */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-white/80 flex items-center gap-1.5">
                                            🎵 Audio Vocal Sample URL
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="MP3, Soundcloud, Drive, or Audio Portfolio Link..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-white text-xs outline-none focus:border-purple-500 transition-all placeholder:text-white/30"
                                            value={demoAudioUrl}
                                            onChange={(e) => setDemoAudioUrl(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setShowApplyModal(false)}
                                        className="px-4 py-2.5 text-xs font-bold text-white/50 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isApplying}
                                        className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                                    >
                                        {isApplying ? "Submitting..." : "Submit Application 🚀"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <EventTicketModal
                isOpen={showTicketModal}
                onClose={() => setShowTicketModal(false)}
                eventId={event._id}
                eventData={event}
            />

            <TicketScannerModal
                isOpen={showScannerModal}
                onClose={() => setShowScannerModal(false)}
                eventId={event._id}
                eventTitle={event.title}
            />

            <UpiPaymentModal
                isOpen={showUpiModal}
                onClose={() => setShowUpiModal(false)}
                event={event}
                user={user}
                onPaymentSuccess={async () => {
                    try {
                        const freshRes = await api.get(`/events/${event._id}`);
                        if (freshRes.data?.event) setEvent(freshRes.data.event);
                    } catch {
                        setEvent(prev => ({
                            ...prev,
                            attendees: [...(prev.attendees || []), currentUserId]
                        }));
                    }
                    if (refresh) refresh();
                    setShowTicketModal(true);
                }}
            />

            {/* Payment Method Selector Modal */}
            <AnimatePresence>
                {showPaymentOptionModal && (
                    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowPaymentOptionModal(false)}
                            className="absolute inset-0 bg-black/85 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-[#0d0d18] border border-amber-500/30 w-full max-w-md p-6 rounded-3xl z-10 shadow-2xl space-y-4 text-left"
                        >
                            <button
                                onClick={() => setShowPaymentOptionModal(false)}
                                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={16} />
                            </button>

                            <div className="space-y-1 pr-6">
                                <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                                    Secure Ticket Checkout
                                </span>
                                <h3 className="text-xl font-black text-white">Select Payment Method</h3>
                                <p className="text-xs text-white/50">Ticket Fee: <strong className="text-amber-400">₹{event.price}</strong> for {event.title}</p>
                            </div>

                            <div className="space-y-3 pt-2">
                                {/* Option 1: Instant UPI QR Scanner */}
                                <button
                                    onClick={() => {
                                        setShowPaymentOptionModal(false);
                                        setShowUpiModal(true);
                                    }}
                                    className="w-full p-4 bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/40 rounded-2xl transition-all flex items-center justify-between group cursor-pointer text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500 text-black flex items-center justify-center font-black shrink-0 shadow-lg">
                                            <QrCode size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                                                Pay via UPI QR Code / Scanner <Sparkles size={12} className="text-amber-400" />
                                            </p>
                                            <p className="text-[10px] text-white/60">GPay, PhonePe, Paytm, BHIM (Exact ₹{event.price})</p>
                                        </div>
                                    </div>
                                    <span className="text-amber-400 text-xs font-bold shrink-0">Select ➔</span>
                                </button>

                                {/* Option 2: Razorpay */}
                                <button
                                    onClick={handleLaunchRazorpay}
                                    className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all flex items-center justify-between group cursor-pointer text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shrink-0 shadow-lg">
                                            💳
                                        </div>
                                        <div>
                                            <p className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition-colors">
                                                Cards, Netbanking & Wallets
                                            </p>
                                            <p className="text-[10px] text-white/50">Credit Card, Debit Card, Netbanking (Razorpay)</p>
                                        </div>
                                    </div>
                                    <span className="text-white/40 group-hover:text-white text-xs font-bold shrink-0">Select ➔</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Artist Applicant Full Profile Dossier Modal */}
            <AnimatePresence>
                {viewingApplicant && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setViewingApplicant(null)}
                            className="absolute inset-0 bg-black/85 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-[#0d0d14] border border-white/15 w-full max-w-lg p-6 rounded-3xl z-10 shadow-2xl space-y-5 overflow-hidden text-left"
                        >
                            <button
                                onClick={() => setViewingApplicant(null)}
                                className="absolute top-4 right-4 p-2 text-white/50 hover:text-white bg-white/5 rounded-full"
                            >
                                ✕
                            </button>

                            {/* Header Profile */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={viewingApplicant.artist?.profilePic || "https://via.placeholder.com/150"}
                                    alt={viewingApplicant.artist?.name}
                                    className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/50 shadow-lg shrink-0"
                                />
                                <div>
                                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                                        {viewingApplicant.artist?.name || "Artist Applicant"}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-md font-bold uppercase border border-indigo-500/30">
                                            🎨 {viewingApplicant.artist?.artStyle || viewingApplicant.artist?.role || "Artist"}
                                        </span>
                                        {viewingApplicant.artist?.originLocation && (
                                            <span className="text-xs text-white/60 flex items-center gap-1">
                                                <MapPin size={12} className="text-indigo-400" /> {viewingApplicant.artist.originLocation}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Pitch Message */}
                            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Applicant Pitch Note</p>
                                <p className="text-xs text-white/90 italic leading-relaxed">
                                    "{viewingApplicant.message || "Ready to perform for this gig!"}"
                                </p>
                            </div>

                            {/* Demo Performance Media (Video / Audio) */}
                            {(viewingApplicant.demoVideoUrl || viewingApplicant.demoAudioUrl) && (
                                <div className="space-y-2 p-3 bg-[#13131f] border border-indigo-500/20 rounded-2xl">
                                    <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                                        🎬 Performance Audition Samples
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        {viewingApplicant.demoVideoUrl && (
                                            <a
                                                href={viewingApplicant.demoVideoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 font-bold flex items-center gap-2 transition-colors truncate"
                                            >
                                                <span className="text-base shrink-0">🎥</span>
                                                <div className="truncate text-left">
                                                    <p className="text-[11px] font-extrabold truncate">Singing Video Demo</p>
                                                    <p className="text-[9px] text-emerald-400/70 truncate">Watch Performance Video ↗</p>
                                                </div>
                                            </a>
                                        )}

                                        {viewingApplicant.demoAudioUrl && (
                                            <a
                                                href={viewingApplicant.demoAudioUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-300 font-bold flex items-center gap-2 transition-colors truncate"
                                            >
                                                <span className="text-base shrink-0">🎵</span>
                                                <div className="truncate text-left">
                                                    <p className="text-[11px] font-extrabold truncate">Vocal Audio Sample</p>
                                                    <p className="text-[9px] text-purple-400/70 truncate">Listen Audio Track ↗</p>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Profile Details Grid */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-white/40 font-bold uppercase">Experience</p>
                                    <p className="text-white font-bold mt-0.5">{viewingApplicant.artist?.experience || "Live Performer"}</p>
                                </div>

                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-white/40 font-bold uppercase">Store / Studio</p>
                                    <p className="text-white font-bold mt-0.5">{viewingApplicant.artist?.sellerProfile?.storeName || "Artify Creator"}</p>
                                </div>

                                {viewingApplicant.artist?.phoneNumber && (
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 col-span-2 flex items-center justify-between">
                                        <span className="text-[10px] text-white/40 font-bold uppercase flex items-center gap-1">
                                            <Phone size={12} /> Contact Number
                                        </span>
                                        <span className="text-emerald-400 font-bold">{viewingApplicant.artist.phoneNumber}</span>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                <button
                                    onClick={() => navigate('/messages')}
                                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                                >
                                    <MessageSquare size={16} /> Direct Chat
                                </button>

                                <button
                                    onClick={() => navigate(`/profile/${viewingApplicant.artist?._id}`)}
                                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
                                >
                                    <ExternalLink size={16} /> Full Profile Page
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default EventDetails;
