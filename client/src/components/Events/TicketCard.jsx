import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const TicketCard = ({ event, onOpenDetails }) => {
    const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
    });

    return (
        <motion.div
            onClick={() => onOpenDetails(event)}
            className="group relative h-[420px] w-full rounded-[2.5rem] overflow-hidden bg-[#0A0A0A] cursor-pointer border border-white/5"
        >
            <div className="absolute inset-0 z-0">
                <motion.img
                    src={event.bannerImage || 'https://via.placeholder.com/600x800'}
                    alt={event.title}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 h-full p-8 flex flex-col justify-between">

                <div className="flex justify-between items-center">
                    <div className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-[11px] font-black tracking-[0.2em] text-white uppercase">
                        {formattedDate}
                    </div>

                    <div className="relative h-12 w-12 flex items-center justify-end">
                        <div className="absolute right-0 text-xl font-bold text-white tracking-tighter transition-all duration-500 group-hover:opacity-0 group-hover:-translate-y-4">
                            {event.price === 0 ? 'Free' : `₹${event.price}`}
                        </div>

                        <div className="absolute right-0 opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 bg-white text-black h-12 w-12 rounded-full flex items-center justify-center shadow-xl shadow-white/20">
                            <ArrowRight size={20} />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-indigo-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                            {event.category || 'Live Event'}
                        </p>
                        <h3 className="text-3xl font-bold text-white leading-[1.1] tracking-tight">
                            {event.title}
                        </h3>
                        <p className="text-white/40 text-sm font-medium">
                            {event.organizer?.name || "By Artify Artist"}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <div className="h-[1px] w-12 bg-indigo-500 transition-all duration-500 group-hover:w-20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">
                            View Details
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TicketCard;