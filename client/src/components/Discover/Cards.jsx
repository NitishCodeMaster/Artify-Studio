import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, MapPin, ArrowUpRight, Calendar, Clock } from 'lucide-react';

export const StandardCard = ({ item, layoutMode = "grid" }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -10 }}
        className={`group relative rounded-[2rem] overflow-hidden bg-[#0a0a0a] shadow-2xl cursor-pointer
        ${layoutMode === 'horizontal' ? 'w-[280px] md:w-[320px] h-[420px]' : 'w-full h-[450px]'}`}
    >
        <div className="absolute inset-0 z-0">
            <img
                src={item.img}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>
        </div>

        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
            {/* Category Pill */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">{item.category}</span>
            </div>

            <button className="p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black hover:scale-110 transition-all shadow-lg backdrop-blur-md">
                <Heart size={16} />
            </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 flex flex-col justify-end h-full">

            <div className="mb-2 opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100 flex items-center gap-1 text-yellow-400">
                <Star size={12} fill="currentColor" />
                <span className="text-xs font-bold text-white">{item.rating || "New"}</span>
            </div>

            <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
                <h3 className="text-2xl font-bold font-playfair text-white leading-tight mb-1">{item.name}</h3>
                <p className="text-sm text-white/60 font-medium">{item.role}</p>
            </div>

            <div className="h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 ease-in-out border-t border-white/10 pt-0 group-hover:pt-4 mt-0 group-hover:mt-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-white/70">
                        <MapPin size={12} />
                        <span className="text-xs">{item.loc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-indigo-400">{item.price}</span>
                        <div className="bg-white text-black p-1.5 rounded-full">
                            <ArrowUpRight size={12} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </motion.div>
);

export const EventCard = ({ item }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative w-[320px] md:w-[420px] h-[240px] flex-shrink-0 rounded-[2rem] overflow-hidden bg-[#0a0a0a] border border-white/5 shadow-2xl group cursor-pointer"
    >
        <img
            src={item.img}
            className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-all duration-700 group-hover:scale-105 group-hover:rotate-1"
            alt="event"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>

        <div className="relative z-10 p-6 flex flex-col justify-between h-full">

            <div className="flex justify-between items-start">
                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 text-center min-w-[60px]">
                    <span className="block text-xs font-bold text-white/60 uppercase tracking-wider">{item.date.split(' ')[0]}</span>
                    <span className="block text-lg font-bold text-white font-playfair leading-none mt-0.5">24</span>
                </div>

                <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 flex items-center gap-2 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">Live</span>
                </div>
            </div>

            <div className="relative">
                <div className="w-8 h-1 bg-indigo-500 rounded-full mb-3 group-hover:w-16 transition-all duration-500"></div>

                <h3 className="text-2xl font-bold font-playfair text-white mb-1 group-hover:text-indigo-300 transition-colors">{item.name}</h3>

                <div className="flex items-center gap-4 text-xs text-white/60 font-medium">
                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-indigo-500" /> {item.role}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-indigo-500" /> {item.time}</span>
                </div>
            </div>
        </div>
    </motion.div>
);