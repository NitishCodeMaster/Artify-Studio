import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, PlayCircle, Trash2, ShieldCheck, Users, Zap, Ticket } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';
import { ReviewSection } from './ReviewSection';

const EventDetails = ({ event: propEvent, onBack, refresh, viewMode }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(propEvent || null);
    const { user } = useAuth();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!event && id) {
            const fetchEvent = async () => {
                try {
                    const res = await api.get(`/events/${id}`);
                    setEvent(res.data.event);
                } catch (err) {
                    toast("Event not available");
                    navigate("/events");
                }
            };

            fetchEvent();
        }
    }, [id]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    if (!event) {
        return <p className="text-white p-10">Loading event...</p>;
    }

    const handleDelete = async () => {
        try {
            await api.delete(`/events/${event._id}`);
            toast.success("Event Deleted");
            if (refresh) refresh();
            onBack ? onBack() : navigate("/events");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handlePayment = async () => {
        if (!window.Razorpay) {
            toast.error("Razorpay failed to load.");
            return;
        }

        try {
            setIsProcessing(true);
            const { data } = await api.post('/payments/create-order', {
                amount: event.price,
                eventId: event._id
            });

            const rawPhone = user?.phone || "";
            const cleanPhone = rawPhone.toString().replace(/\D/g, '').slice(-10);
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: "Artify Studio",
                description: `Ticket for ${event.title}`,
                order_id: data.order.id,
                prefill: {
                    name: user?.fullname || user?.name || "Guest User",
                    email: user?.email || "customer@example.com",
                    contact: cleanPhone,
                    ...(cleanPhone.length === 10 ? { contact: cleanPhone } : {})
                },
                readonly: {
                    contact: cleanPhone.length === 10 ? true : false,
                    email: true,
                    name: true
                },
                theme: { color: "#6366f1" },
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/payments/verify', {
                            ...response,
                            eventId: event._id,
                            totalAmount: event.price
                        });
                        if (verifyRes.data.success) {
                            toast.success("Ticket Booked!");
                            if (refresh) refresh();
                            if (onBack) onBack();
                            else navigate("/events");
                        }
                    } catch (err) {
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

                <div className="flex items-center gap-4">
                    {viewMode === 'artist' && (
                        <button onClick={() => setShowDeleteModal(true)} className="p-3 text-red-500 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-xl transition-all">
                            <Trash2 size={18} />
                        </button>
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

                    <div className="absolute bottom-16 left-12 right-12 space-y-6">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600 rounded-full"
                        >
                            <Zap size={12} className="fill-white" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Premium Event</span>
                        </motion.div>

                        <h1 className="text-4xl xl:text-7xl font-black tracking-tighter leading-[0.85] uppercase">
                            {event.title}
                        </h1>

                        <div className="flex items-center gap-6">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-9 h-9 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white/20">A</div>
                                ))}
                            </div>
                            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
                                Joined by {event.attendees?.length || 0} People
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#080808]/40">
                    <div className="max-w-3xl mx-auto px-8 md:px-16 py-16 space-y-10">

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

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="relative group p-[1px] rounded-[2.5rem] bg-gradient-to-br from-indigo-500/40 via-transparent to-white/5"
                        >
                            <div className="bg-[#0c0c0c] border border-white/5 rounded-[2.4rem] p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
                                <div className="relative z-10 text-center md:text-left">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] mb-4 text-center md:text-left">Access Pass</p>
                                    <div className="flex items-baseline gap-2 justify-center md:justify-start">
                                        <span className="text-4xl font-black tracking-tighter italic">₹{event.price}</span>
                                        <span className="text-xs font-bold text-white/20 uppercase tracking-widest">/ Individual</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="w-full md:w-auto px-6 py-3 bg-white text-black rounded-[1.5rem] font-black text-base hover:bg-indigo-500 hover:text-white transition-all shadow-2xl flex items-center justify-center gap-4 relative z-10 active:scale-95 disabled:opacity-50"
                                >
                                    {isProcessing ? "SECURE..." : "GET TICKETS"}
                                    <Ticket size={22} />
                                </button>

                                <ShieldCheck size={180} className="absolute -right-10 -bottom-10 text-white/[0.02] -rotate-12 pointer-events-none" />
                            </div>
                        </motion.div>

                        <div className="space-y-3">
                            <h5 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">The Vision</h5>
                            <p className="text-base font-light text-white/70 leading-relaxed italic">
                                "{event.description || "An immersive journey into the world of art and music, crafted specifically for the Artify collective. Witness creativity in its purest form."}"
                            </p>
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
            </AnimatePresence>
        </motion.div>
    );
};

export default EventDetails;