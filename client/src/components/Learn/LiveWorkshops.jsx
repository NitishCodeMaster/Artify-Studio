import React, { useEffect, useState } from 'react';
import { Calendar, Users, ArrowRight, Sparkles, Clock3, Plus, Trash2, X, Video, UserRound, ArrowLeft, Copy, CalendarPlus, IndianRupee, LockKeyhole, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';
import { buildRazorpayPrefill, loadRazorpay } from '../../utils/razorpay';
import api from '../../utils/api';

const WorkshopSkeleton = () => (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="h-48 animate-pulse bg-white/[0.04]" />
        <div className="space-y-4 p-5">
            <div className="h-6 w-2/3 rounded bg-white/10" />
            <div className="h-4 w-40 rounded bg-white/10" />
            <div className="flex items-center justify-between pt-8">
                <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-white/10" />
                    <div className="h-4 w-24 rounded bg-white/10" />
                </div>
                <div className="h-12 w-12 rounded-full bg-white/10" />
            </div>
        </div>
    </div>
);

export function LiveWorkshops({ workshops = [], filter = '', loading = false, onCreateWorkshop, onDeleteWorkshop, canCreateWorkshop = false, currentUserId = '' }) {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);
    const [processingId, setProcessingId] = useState('');

    const visibleWorkshops = workshops.filter((ws) => {
        const q = filter.toLowerCase();
        return !q || ws.title.toLowerCase().includes(q) || ws.tags.some((tag) => tag.toLowerCase().includes(q));
    });

    const getRoomUrl = (workshop) => `https://meet.jit.si/artify-workshop-${workshop.id}`;

    const openRoom = (workshop) => {
        window.open(getRoomUrl(workshop), '_blank', 'noopener,noreferrer');
    };

    const handleJoinWorkshop = async (workshop) => {
        if (workshop.accessType !== 'paid' || Number(workshop.price) <= 0) {
            try {
                setProcessingId(workshop.id);
                await api.post('/payments/book-free', { workshopId: workshop.id });
                openRoom(workshop);
            } catch (error) {
                toast.error(error.response?.data?.message || 'Free workshop join nahi ho paya.');
            } finally {
                setProcessingId('');
            }
            return;
        }

        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            toast.error('Razorpay load nahi ho paya.');
            return;
        }

        try {
            setProcessingId(workshop.id);
            const { data } = await api.post('/payments/create-order', {
                amount: workshop.price,
                workshopId: workshop.id,
            });
            const user = JSON.parse(localStorage.getItem('user')) || {};
            const prefill = buildRazorpayPrefill(user);

            const options = {
                key: data.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: 'INR',
                name: 'Artify Studio',
                description: `Workshop seat: ${workshop.title}`,
                order_id: data.order.id,
                prefill,
                readonly: {
                    contact: Boolean(prefill.contact),
                    email: Boolean(prefill.email),
                    name: Boolean(prefill.name),
                },
                theme: { color: '#8b5cf6' },
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/payments/verify-payment', {
                            ...response,
                            workshopId: workshop.id,
                            totalAmount: workshop.price,
                        });

                        if (verifyRes.data.success) {
                            toast.success('Workshop seat booked. Opening live room...');
                            openRoom(workshop);
                        }
                    } catch {
                        toast.error('Payment verify nahi ho paya.');
                    } finally {
                        setProcessingId('');
                    }
                },
                modal: {
                    ondismiss: () => setProcessingId(''),
                },
            };

            new window.Razorpay(options).open();
        } catch (error) {
            console.error('Workshop payment error:', error);
            toast.error(error.response?.data?.message || 'Payment start nahi ho paya.');
            setProcessingId('');
        }
    };

    const copyRoomLink = async (workshop) => {
        try {
            await navigator.clipboard.writeText(getRoomUrl(workshop));
            toast.success('Live room link copied.');
        } catch {
            toast.error('Room link copy nahi ho paya.');
        }
    };

    const downloadCalendarInvite = (workshop) => {
        const start = new Date(workshop.startAt || Date.now());
        const end = new Date(start.getTime() + Number(workshop.durationMinutes || 60) * 60 * 1000);
        const formatDate = (date) => date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        const roomUrl = getRoomUrl(workshop);
        const ics = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Artify Studio//Workshop//EN',
            'BEGIN:VEVENT',
            `UID:${workshop.id}@artify-studio`,
            `DTSTAMP:${formatDate(new Date())}`,
            `DTSTART:${formatDate(start)}`,
            `DTEND:${formatDate(end)}`,
            `SUMMARY:${workshop.title}`,
            `DESCRIPTION:${(workshop.summary || '').replace(/\n/g, ' ')} Join room: ${roomUrl}`,
            `LOCATION:${roomUrl}`,
            'END:VEVENT',
            'END:VCALENDAR',
        ].join('\r\n');

        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${workshop.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-artify.ics`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('Calendar invite downloaded.');
    };

    useEffect(() => {
        if (visibleWorkshops.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % visibleWorkshops.length);
        }, 3200);
        return () => clearInterval(interval);
    }, [visibleWorkshops]);

    useEffect(() => {
        if (activeIndex > visibleWorkshops.length - 1) {
            setActiveIndex(0);
        }
    }, [activeIndex, visibleWorkshops.length]);

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45 }}
                className="mb-7 flex flex-col items-start justify-between gap-4 px-1 sm:mb-8 sm:px-3 md:flex-row md:items-end"
            >
                <div className="min-w-0">
                    <h3 className="text-2xl font-bold text-white sm:text-[1.8rem]">Upcoming Live Masterclasses</h3>
                    <p className="mt-2 text-sm text-white/40">Mentor-led workshops now come from live backend data, so this section stays fresh automatically.</p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-3 md:w-auto md:justify-end">
                    {canCreateWorkshop && (
                        <button
                            onClick={onCreateWorkshop}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200 transition-all hover:bg-indigo-500/15"
                        >
                            <Plus size={13} />
                            Create Workshop
                        </button>
                    )}
                    <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 md:flex">
                        <Sparkles size={14} className="text-pink-400" />
                        Live workshop rotation
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
                {loading && [1, 2].map((item) => <WorkshopSkeleton key={item} />)}

                {!loading && (
                    <AnimatePresence>
                        {visibleWorkshops.map((ws, index) => (
                            <motion.div
                                key={ws.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.45, delay: index * 0.08 }}
                                whileHover={{ y: -6 }}
                                className={`group relative cursor-pointer overflow-hidden rounded-2xl border bg-[#070707] transition-all duration-300 hover:border-pink-400/35 ${activeIndex === index ? 'border-white/20' : 'border-white/10'}`}
                                onClick={() => setSelectedWorkshop(ws)}
                            >
                                <div className="relative h-48 overflow-hidden bg-[#101010]">
                                    <ImageWithFallback src={ws.image} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-xl" />
                                    <ImageWithFallback src={ws.image} alt={ws.title} className="relative z-10 h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-[1.02]" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-black/35 to-transparent" />
                                    <div className="absolute left-4 top-4 z-20 flex flex-wrap gap-2">
                                        <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${ws.accessType === 'paid' ? 'border-amber-400/25 bg-amber-500/15 text-amber-100' : 'border-emerald-400/25 bg-emerald-500/15 text-emerald-100'}`}>
                                            {ws.accessType === 'paid' ? `₹${ws.price}` : 'Free'}
                                        </span>
                                        {ws.tags.map((tag) => (
                                            <span key={tag} className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <motion.div
                                        animate={{ scaleX: activeIndex === index ? [0, 1] : 0 }}
                                        transition={{ duration: 2.8, ease: 'linear' }}
                                        className={`absolute left-0 right-0 top-0 h-[2px] origin-left bg-gradient-to-r ${ws.color}`}
                                    />
                                    {String(ws.mentorId) === String(currentUserId) && (
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onDeleteWorkshop?.(ws);
                                            }}
                                            className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full border border-red-400/25 bg-red-500/15 text-red-200 backdrop-blur-md transition-all hover:bg-red-500 hover:text-white"
                                            aria-label={`Delete ${ws.title}`}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    )}
                                </div>

                                <div className="relative flex h-full flex-col p-5 sm:p-6">
                                    <h4 className="max-w-md text-xl font-bold text-white sm:text-[1.35rem]">{ws.title}</h4>
                                    <p className="mt-2 text-white/65">{ws.tutor}</p>
                                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/45">{ws.summary}</p>

                                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-sm text-white/80">
                                                <Calendar size={16} className="text-pink-400" /> {ws.date}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/50">
                                                <span className="flex items-center gap-2">
                                                    <Users size={16} /> {ws.attendees} Registered
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <IndianRupee size={16} /> {ws.accessType === 'paid' ? `₹${ws.price}` : 'Free'}
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Clock3 size={16} /> {ws.durationMinutes} min
                                                </span>
                                            </div>
                                        </div>

                                        <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110" aria-label={`Open ${ws.title}`}>
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {!loading && visibleWorkshops.length === 0 && (
                    <div className="col-span-full rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-16 text-center text-white/40">
                        No workshops matched your search yet.
                    </div>
                )}
            </div>

            {!loading && visibleWorkshops.length > 0 && (
                <div className="mt-6 flex justify-center gap-2">
                    {visibleWorkshops.map((ws, index) => (
                        <button
                            key={ws.id}
                            onClick={() => setActiveIndex(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === index ? `w-10 bg-gradient-to-r ${ws.color}` : 'w-2 bg-white/20 hover:bg-white/40'}`}
                            aria-label={`Focus ${ws.title}`}
                        />
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedWorkshop && (
                    <div className="fixed inset-0 z-[9999] flex items-start justify-center px-3 pb-8 pt-28 sm:pt-28">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedWorkshop(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 22, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 16, scale: 0.98 }}
                            className="relative h-[min(720px,calc(100dvh-9rem))] w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#09090b] shadow-2xl"
                        >
                            <button
                                type="button"
                                onClick={() => setSelectedWorkshop(null)}
                                className="absolute left-4 top-4 z-20 flex h-10 items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 text-sm font-bold text-white/75 backdrop-blur-md transition-all hover:bg-white hover:text-black"
                                aria-label="Back to workshop cards"
                            >
                                <ArrowLeft size={16} />
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedWorkshop(null)}
                                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white/70 backdrop-blur-md transition-all hover:bg-white hover:text-black"
                                aria-label="Close workshop details"
                            >
                                <X size={18} />
                            </button>

                            <div className="grid h-full overflow-y-auto lg:grid-cols-[0.86fr_1.14fr] lg:overflow-hidden">
                                <div className="relative min-h-[220px] bg-[#111] lg:min-h-0">
                                    <ImageWithFallback src={selectedWorkshop.image} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-xl" />
                                    <ImageWithFallback src={selectedWorkshop.image} alt={selectedWorkshop.title} className="relative z-10 h-full max-h-[320px] w-full object-contain p-3 lg:max-h-none lg:p-4" />
                                    <div className="absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-t from-[#09090b] to-transparent" />
                                </div>

                                <div className="flex min-h-0 flex-col p-4 sm:p-5 lg:p-6">
                                    <div className="mb-3 flex flex-wrap gap-2 pr-12">
                                        <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${selectedWorkshop.accessType === 'paid' ? 'border-amber-400/25 bg-amber-500/10 text-amber-100' : 'border-emerald-400/25 bg-emerald-500/10 text-emerald-100'}`}>
                                            {selectedWorkshop.accessType === 'paid' ? `Paid • ₹${selectedWorkshop.price}` : 'Free Class'}
                                        </span>
                                        {selectedWorkshop.tags.map((tag) => (
                                            <span key={tag} className="rounded-full border border-pink-400/20 bg-pink-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-pink-100">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-xl font-black leading-tight text-white sm:text-2xl lg:text-[1.65rem]">{selectedWorkshop.title}</h3>
                                    <p className="mt-1 text-sm text-white/60">{selectedWorkshop.tutor}</p>
                                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/55">{selectedWorkshop.summary}</p>

                                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                                        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                            <Calendar size={16} className="mb-2 text-pink-300" />
                                            <p className="text-xs uppercase tracking-[0.18em] text-white/35">Schedule</p>
                                            <p className="mt-1 text-sm font-semibold text-white">{selectedWorkshop.date}</p>
                                        </div>
                                        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                            <Clock3 size={16} className="mb-2 text-indigo-300" />
                                            <p className="text-xs uppercase tracking-[0.18em] text-white/35">Duration</p>
                                            <p className="mt-1 text-sm font-semibold text-white">{selectedWorkshop.durationMinutes} minutes</p>
                                        </div>
                                        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                            <Users size={16} className="mb-2 text-emerald-300" />
                                            <p className="text-xs uppercase tracking-[0.18em] text-white/35">Registered</p>
                                            <p className="mt-1 text-sm font-semibold text-white">{selectedWorkshop.attendees} learners</p>
                                        </div>
                                        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                            {selectedWorkshop.accessType === 'paid' ? <LockKeyhole size={16} className="mb-2 text-amber-300" /> : <BadgeCheck size={16} className="mb-2 text-emerald-300" />}
                                            <p className="text-xs uppercase tracking-[0.18em] text-white/35">Access</p>
                                            <p className="mt-1 text-sm font-semibold text-white">{selectedWorkshop.accessType === 'paid' ? `₹${selectedWorkshop.price}` : 'Free'}</p>
                                        </div>
                                        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                            <Video size={16} className="mb-2 text-fuchsia-300" />
                                            <p className="text-xs uppercase tracking-[0.18em] text-white/35">Mode</p>
                                            <p className="mt-1 text-sm font-semibold text-white">{selectedWorkshop.mode}</p>
                                        </div>
                                        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 p-3">
                                            <Sparkles size={16} className="mb-2 text-pink-300" />
                                            <p className="text-xs uppercase tracking-[0.18em] text-white/35">Room Kit</p>
                                            <p className="mt-1 text-sm font-semibold text-white">Link + calendar ready</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.025] p-3">
                                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/60">
                                            <span className="rounded-full bg-white/[0.06] px-3 py-1">Live room opens in Jitsi</span>
                                            <span className="rounded-full bg-white/[0.06] px-3 py-1">Calendar invite included</span>
                                            <span className="rounded-full bg-white/[0.06] px-3 py-1">Mentor profile one click away</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto grid gap-3 pt-4 sm:grid-cols-2">
                                        <button
                                            onClick={() => handleJoinWorkshop(selectedWorkshop)}
                                            disabled={processingId === selectedWorkshop.id}
                                            className="flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition-all hover:bg-gray-200"
                                        >
                                            {selectedWorkshop.accessType === 'paid' ? <IndianRupee size={16} /> : <Video size={16} />}
                                            {processingId === selectedWorkshop.id ? 'Processing...' : selectedWorkshop.accessType === 'paid' ? `Pay ₹${selectedWorkshop.price} & Join` : 'Join Free Room'}
                                        </button>
                                        <button
                                            onClick={() => selectedWorkshop.mentorId && navigate(`/profile/${selectedWorkshop.mentorId}`)}
                                            className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-white/[0.08]"
                                        >
                                            <UserRound size={16} />
                                            View Mentor
                                        </button>
                                    </div>

                                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                        <button
                                            onClick={() => copyRoomLink(selectedWorkshop)}
                                            className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-5 py-2.5 text-sm font-bold text-white/70 transition-all hover:bg-white/[0.08] hover:text-white"
                                        >
                                            <Copy size={15} />
                                            Copy Room Link
                                        </button>
                                        <button
                                            onClick={() => downloadCalendarInvite(selectedWorkshop)}
                                            className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-5 py-2.5 text-sm font-bold text-white/70 transition-all hover:bg-white/[0.08] hover:text-white"
                                        >
                                            <CalendarPlus size={15} />
                                            Add to Calendar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
