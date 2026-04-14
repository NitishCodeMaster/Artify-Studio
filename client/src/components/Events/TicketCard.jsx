import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Calendar, User } from 'lucide-react';

const TicketCard = ({ event, onOpenDetails }) => {

    const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative h-[320px] rounded-2xl overflow-hidden cursor-pointer group border border-white/5"
            onClick={() => onOpenDetails(event)}
        >
            <img
                src={event.bannerImage || 'https://via.placeholder.com/400x600?text=Artify+Event'}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-50 transition-opacity duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="absolute bottom-0 p-5 w-full">
                <div className="flex justify-between items-end mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Calendar size={12} className="text-indigo-400" />
                            <span className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                                {eventDate}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white leading-tight mb-1 line-clamp-1">
                            {event.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-white/60">
                            <User size={12} />
                            <p className="text-xs font-medium">
                                {event.organizer?.name || "Verified Artist"}
                            </p>
                        </div>
                    </div>

                    <div className="bg-indigo-600/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-indigo-500/30 ml-2">
                        <span className="text-sm font-bold text-white">
                            {event.price === 0 ? 'FREE' : `₹${event.price}`}
                        </span>
                    </div>
                </div>

                <div className="h-0 group-hover:h-12 transition-all duration-300 overflow-hidden">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenDetails(event);
                        }}
                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-colors"
                    >
                        <Ticket size={14} /> Get Tickets
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default TicketCard;