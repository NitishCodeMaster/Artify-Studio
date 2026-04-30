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
        }, 8000);
        return () => clearInterval(timer);
    }, [featuredList.length]);

    const event = featuredList[currentIndex];

    if (!event) return null;

    const scrollToEvents = () => {
        const element = document.getElementById('event-list');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const displayDate = event.date.includes('-') || !isNaN(Date.parse(event.date))
        ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })
        : event.date;

    return (
        <div className="relative w-full h-[600px] md:h-[680px] overflow-hidden bg-[#050505] font-sans">
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
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                            </span>
                            <p className="text-sm font-bold tracking-[0.3em] uppercase text-indigo-400/90">
                                Now Trending in {event.location.split(',')[0]}
                            </p>
                        </div>

                         <h1 className="text-6xl md:text-[120px] font-black text-white leading-[0.85] mb-6 tracking-tighter drop-shadow-2xl">
                            {event.title.split(' ').map((word, i) => (
                                <span key={i} className={i === 1 ? "text-indigo-500 block md:inline" : ""}>
                                    {word}{' '}
                                </span>
                            ))}
                        </h1>

                        <div className="flex items-center gap-6 mb-12">
                            <div className="h-20 w-[2px] bg-gradient-to-b from-indigo-500 to-transparent"></div>
                            <div>
                                <p className="text-2xl text-white/70 font-medium tracking-tight">
                                    Featuring <span className="text-white font-bold underline decoration-indigo-500 underline-offset-8">
                                        {event.organizer?.name || event.artist}
                                    </span>
                                </p>
                                <div className="flex items-center gap-4 mt-4 text-white/50 text-sm">
                                    <span className="flex items-center gap-1"><Calendar size={14} /> {event.date}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {event.location}</span>
                                </div>
                            </div>
                        </div>

                         <div className="flex flex-wrap gap-5">
                            <button
                                onClick={scrollToEvents}
                                className="group relative px-10 py-5 bg-indigo-600 rounded-full overflow-hidden transition-all hover:bg-indigo-500 active:scale-95 shadow-2xl shadow-indigo-600/20"
                            >
                                <span className="relative z-10 text-white font-black text-lg flex items-center gap-2">
                                    Find Tickets <Ticket size={20} className="group-hover:rotate-12 transition-transform" />
                                </span>
                            </button>

                            {event.trailerUrl && (
                                <button
                                    onClick={() => window.open(event.trailerUrl, '_blank')}
                                    className="px-8 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all flex items-center gap-3 backdrop-blur-xl group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <PlayCircle size={20} fill="currentColor" className="text-white" />
                                    </div>
                                    Watch Intro
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-10 items-center">
                <span className="text-white/30 [writing-mode:vertical-lr] text-xs font-bold tracking-[0.5em] uppercase">Scroll to Explore</span>
                <div className="w-[1px] h-32 bg-gradient-to-b from-indigo-500 via-white/20 to-transparent"></div>
            </div>

             <div className="absolute bottom-12 left-6 right-6 z-20 flex justify-between items-end max-w-[1400px] mx-auto">
                <div className="flex gap-3">
                    {featuredList.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-[2px] transition-all duration-700 ${i === currentIndex ? 'w-24 bg-indigo-500' : 'w-8 bg-white/20'}`}
                        />
                    ))}
                </div>
                <div className="text-white/20 font-black text-6xl select-none">
                    0{currentIndex + 1}
                </div>
            </div>
        </div>
    );
};

export default EventHero;
