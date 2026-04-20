import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, PlayCircle, Trash2, ShieldCheck, Users, Zap, Ticket } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';

const EventDetails = ({ event, onBack, refresh, viewMode }) => {
    const { user } = useAuth();
    if (!event) return null;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

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
                            refresh();
                            onBack();
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
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -z-10" />

            <nav className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-black/20 backdrop-blur-md">
                <button onClick={onBack} className="flex items-center gap-2 text-white/50 hover:text-white transition-all group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Back</span>
                </button>
                {viewMode === 'artist' && (
                    <button onClick={() => setShowDeleteModal(true)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                        <Trash2 size={18} />
                    </button>
                )}
            </nav>

            <main className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0">

                <div className="lg:col-span-5 relative bg-[#080808] border-r border-white/5">
                    <img
                        src={event.bannerImage}
                        className="w-full h-full object-cover opacity-60"
                        alt={event.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050505]" />

                    <div className="absolute bottom-10 left-10 space-y-4">
                        <div className="flex gap-3">
                            <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase">
                                {event.category}
                            </span>
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                <Users size={12} className="text-indigo-400" />
                                <span className="text-[10px] font-bold uppercase">{event.attendees?.length || 0} Attending</span>
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">{event.title}</h1>
                    </div>
                </div>

                <div className="lg:col-span-7 flex flex-col p-8 md:p-12 overflow-y-auto custom-scrollbar">
                    <div className="max-w-2xl space-y-10">

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-xs text-indigo-400 font-black uppercase tracking-widest flex items-center gap-2">
                                    <Calendar size={14} /> Schedule
                                </p>
                                <p className="text-xl font-bold">{new Date(event.date).toDateString()}</p>
                                <p className="text-sm text-white/40">{event.time || "07:00 PM onwards"}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-indigo-400 font-black uppercase tracking-widest flex items-center gap-2">
                                    <MapPin size={14} /> Venue
                                </p>
                                <p className="text-xl font-bold capitalize">{event.location}</p>
                                <p className="text-sm text-white/40">Open Entry for Ticket Holders</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">The Experience</h4>
                            <p className="text-lg text-white/70 font-light leading-relaxed line-clamp-4">
                                {event.description || "Join us for an unforgettable artistic journey where creativity meets passion. A curated experience designed specifically for the Artify community."}
                            </p>
                        </div>

                        <div className="relative group p-8 rounded-[2rem] bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 overflow-hidden">
                            <div className="flex justify-between items-end relative z-10">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Entry Pass</p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-white">₹{event.price}</span>
                                        <span className="text-sm text-white/40 font-medium">/ person</span>
                                    </div>
                                </div>
                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className="px-10 py-5 bg-white text-black rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50"
                                >
                                    {isProcessing ? "Processing..." : "Get Tickets"}
                                    <Ticket size={20} />
                                </button>
                            </div>

                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <ShieldCheck size={100} />
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">
                            <span className="flex items-center gap-2"><ShieldCheck size={14} /> Secured Payment</span>
                            <span className="flex items-center gap-2"><Clock size={14} /> Instant Confirmation</span>
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