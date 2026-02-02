import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Clock, Ticket, PlayCircle } from 'lucide-react';

 import { featuredEvents } from '../../Data/EventData';

const EventHero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % featuredEvents.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const event = featuredEvents[currentIndex];

     if (!event) return null;

    return (
        <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-black font-sans">
            <AnimatePresence mode="wait">
                <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0"
                >
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent" />
                </motion.div>
            </AnimatePresence>

            <div className="relative z-10 h-full max-w-[1400px] mx-auto px-6 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-3xl"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
                            <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${event.color} animate-pulse`}></span>
                            <span className="text-xs font-bold uppercase tracking-widest text-white">Featured Event</span>
                        </div>

                        <h1 className="text-5xl md:text-8xl font-bold text-white font-playfair mb-4 leading-[0.9] tracking-tight drop-shadow-2xl">
                            {event.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-white/80 font-light italic mb-8 border-l-4 border-indigo-500 pl-4">
                            Perfomance by <span className="text-white font-bold">{event.artist}</span>
                        </p>

                        <div className="flex flex-wrap gap-6 mb-10 text-sm md:text-base text-white/90 font-medium">
                            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                                <Calendar size={18} className="text-indigo-400" /> {event.date}
                            </div>
                            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                                <Clock size={18} className="text-indigo-400" /> {event.time}
                            </div>
                            <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
                                <MapPin size={18} className="text-indigo-400" /> {event.location}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className={`px-8 py-4 rounded-full bg-gradient-to-r ${event.color} text-white font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center gap-3`}>
                                <Ticket size={18} /> Get Tickets • {event.price}
                            </button>
                            <button className="px-6 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white hover:text-black transition-colors flex items-center gap-3 backdrop-blur-md">
                                <PlayCircle size={18} /> Watch Trailer
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="absolute bottom-10 right-10 z-20 flex gap-4 items-end">
                {featuredEvents.map((_, i) => (
                    <div key={i} className="relative group cursor-pointer" onClick={() => setCurrentIndex(i)}>
                        <div className={`h-1 transition-all duration-500 ${i === currentIndex ? 'w-16 bg-white' : 'w-8 bg-white/20'}`}></div>
                        <p className={`text-[10px] mt-2 font-bold transition-colors ${i === currentIndex ? 'text-white' : 'text-transparent'}`}>0{i + 1}</p>
                    </div>
                ))}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050505] to-transparent z-10" />
        </div>
    );
};

export default EventHero;