import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Ticket, Sparkles, ChevronRight, ChevronLeft, Plus } from 'lucide-react';

const EventHero = ({ events, onOpenModal, onSelectEvent }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const featuredList = (events && events.length > 0)
        ? events.slice(0, 5)
        : [];

    useEffect(() => {
        if (featuredList.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredList.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [featuredList.length]);

    const handleNext = () => {
        if (featuredList.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % featuredList.length);
        }
    };

    const handlePrev = () => {
        if (featuredList.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + featuredList.length) % featuredList.length);
        }
    };

    const currentEvent = featuredList[currentIndex];

    return (
        <div className="relative w-full bg-[#08080c] py-6 px-4 md:px-8 border-b border-white/10">
            <div className="max-w-[1400px] mx-auto">

                {/* Top Welcome & Post Action Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                                <Sparkles size={12} /> ARTIFY GIG HUB
                            </span>
                            <span className="text-xs text-white/40 font-medium">Live Performances & Events</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                            Discover & Host Live Gigs
                        </h1>
                    </div>

                    <button
                        onClick={onOpenModal}
                        className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center gap-2 active:scale-95 shrink-0"
                    >
                        <Plus size={16} /> Post New Gig
                    </button>
                </div>

                {/* Hero Showcase Slide */}
                {currentEvent ? (
                    <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentEvent._id || currentIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 z-0"
                            >
                                <img
                                    src={currentEvent.bannerImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200"}
                                    alt={currentEvent.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/60 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#08080c]/90 via-[#08080c]/40 to-transparent" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Content overlay */}
                        <div className="relative z-10 h-full p-6 md:p-10 flex flex-col justify-end max-w-2xl">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                {currentEvent.gigType === 'paid_gig' || (Number(currentEvent.artistPayout) > 0 && currentEvent.gigType !== 'free' && currentEvent.gigType !== 'ticketed') ? (
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                                        ⭐ Paid Gig • ₹{currentEvent.artistPayout || 5000} Payout
                                    </span>
                                ) : currentEvent.gigType === 'ticketed' || (Number(currentEvent.price) > 0 && currentEvent.gigType !== 'free') ? (
                                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold">
                                        🎟️ Ticketed • ₹{currentEvent.price || 500}
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold">
                                        🎁 Free Gig
                                    </span>
                                )}
                                <span className="px-2.5 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium backdrop-blur-md">
                                    {currentEvent.category || 'General'}
                                </span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight mb-2 tracking-tight line-clamp-2">
                                {currentEvent.title}
                            </h2>

                            <p className="text-xs sm:text-sm text-white/70 line-clamp-2 mb-4 max-w-xl font-normal">
                                {currentEvent.description || "Join us for an unforgettable live experience with talented artists and great vibes."}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 mb-5">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Calendar size={14} className="text-indigo-400" />
                                    {new Date(currentEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1.5 font-medium capitalize">
                                    <MapPin size={14} className="text-indigo-400" />
                                    {currentEvent.location}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => onSelectEvent && onSelectEvent(currentEvent)}
                                    className="px-5 py-2.5 bg-white text-black font-extrabold text-xs rounded-xl hover:bg-indigo-400 hover:text-white transition-all shadow-xl flex items-center gap-2 active:scale-95"
                                >
                                    View Details <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Arrows & Indicators */}
                        {featuredList.length > 1 && (
                            <>
                                <div className="absolute right-4 bottom-4 z-20 flex items-center gap-2">
                                    <button
                                        onClick={handlePrev}
                                        className="p-2 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 text-white backdrop-blur-md transition-all active:scale-95"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="p-2 rounded-full bg-black/40 hover:bg-black/80 border border-white/10 text-white backdrop-blur-md transition-all active:scale-95"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>

                                <div className="absolute left-6 top-4 z-20 flex gap-1.5">
                                    {featuredList.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                                idx === currentIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-white/30'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="w-full py-12 rounded-3xl bg-gradient-to-br from-indigo-900/20 via-[#111] to-purple-900/20 border border-white/10 text-center space-y-3">
                        <Sparkles size={32} className="mx-auto text-indigo-400 animate-pulse" />
                        <h3 className="text-xl font-bold text-white">Live Performing Arts & Gigs</h3>
                        <p className="text-xs text-white/50 max-w-md mx-auto">
                            Post a paid gig for your cafe/event or apply as an artist to perform live!
                        </p>
                        <button
                            onClick={onOpenModal}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
                        >
                            <Plus size={16} /> Post Your First Gig
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventHero;
