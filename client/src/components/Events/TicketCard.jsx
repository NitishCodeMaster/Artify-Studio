import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket } from 'lucide-react';

const TicketCard = ({ event }) => {
    return (
        <motion.div whileHover={{ scale: 1.02 }} className="relative h-[280px] rounded-2xl overflow-hidden cursor-pointer group">
            <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            <div className="absolute bottom-0 p-5 w-full">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <span className="text-indigo-400 text-xs font-bold uppercase tracking-wider">{event.date}</span>
                        <h3 className="text-xl font-bold text-white leading-tight">{event.title}</h3>
                        <p className="text-sm text-white/60">{event.artist}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                        <span className="text-sm font-bold text-white">{event.price}</span>
                    </div>
                </div>

                <div className="h-0 group-hover:h-10 transition-all duration-300 overflow-hidden">
                    <button
                        onClick={() => alert(`Booking started for ${event.title}. Redirecting to payment... 🎟️`)}
                        className="w-full mt-2 bg-indigo-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                        <Ticket size={14} /> Book Now
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default TicketCard;