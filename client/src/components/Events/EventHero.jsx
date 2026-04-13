import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Ticket, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { featuredEvents as dummyData } from '../../Data/EventData';

const EventHero = ({ events }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    const featuredList = (events && events.length > 0)
        ? events.slice(0, 3)
        : dummyData;

    useEffect(() => {
        if (featuredList.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredList.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [featuredList.length]);

    const event = featuredList[currentIndex];

    if (!event) return null;

    const displayDate = event.date.includes('-') || !isNaN(Date.parse(event.date))
        ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
        : event.date;

    return (
        <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-black font-sans">
            <AnimatePresence mode="wait">
                <motion.div
                    key={event._id || event.id} 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={event.bannerImage || event.image}
                        alt={event.title}
                        className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={event._id || event.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
                            <span className={`w-2 h-2 rounded-full ${event.color ? `bg-gradient-to-r ${event.color}` : 'bg-indigo-500'} animate-pulse shadow-[0_0_10px_#6366f1]`}></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-white">
                                {events && events.length > 0 ? "Featured Event" : "Sample Preview"}
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-bold text-white font-playfair mb-4 leading-[0.9] tracking-tight">
                            {event.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-white/80 font-light italic mb-8 border-l-4 border-indigo-500 pl-4">
                            Perfomance by <span className="text-white font-bold">{event.organizer?.name || event.artist}</span>
                        </p>

                        <div className="flex flex-wrap gap-4 mb-10 text-sm md:text-base text-white/90 font-medium">
                            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                                <Calendar size={18} className="text-indigo-400" /> {displayDate}
                            </div>
                            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                                <Clock size={18} className="text-indigo-400" /> {event.time}
                            </div>
                            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                                <MapPin size={18} className="text-indigo-400" /> {event.location}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                             <button
                                onClick={() => navigate(`/event/${event._id}`)}
                                className="px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-[0_10px_30px_rgba(99,102,241,0.3)] flex items-center gap-3"
                            >
                                <Ticket size={18} /> Get Tickets • {event.price === 0 ? 'FREE' : `₹${event.price}`}
                            </button>

                             {event.trailerUrl && (
                                <button
                                    onClick={() => window.open(event.trailerUrl, '_blank')}
                                    className="px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white hover:text-black transition-colors flex items-center gap-3 backdrop-blur-md"
                                >
                                    <PlayCircle size={18} /> Watch Trailer
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute bottom-10 right-10 z-20 flex gap-4 items-end">
                {featuredList.map((_, i) => (
                    <div key={i} className="relative group cursor-pointer" onClick={() => setCurrentIndex(i)}>
                        <div className={`h-1 transition-all duration-500 ${i === currentIndex ? 'w-16 bg-white' : 'w-8 bg-white/20'}`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventHero;