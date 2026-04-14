import React from 'react';
import { motion } from 'framer-motion';
import TicketCard from './TicketCard';

const AudienceView = ({ events, onOpenDetails }) => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-white">Trending Events</h3>
                    <p className="text-xs text-white/40">Handpicked gigs around you</p>
                </div>
                <button className="text-xs text-indigo-400 font-bold hover:text-white transition-colors">
                    View All
                </button>
            </div>

            {events.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {events.map(event => (
                        <TicketCard key={event._id} event={event} onOpenDetails={onOpenDetails} />
                    ))}
                </div>
            ) : (
                <div className="h-64 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl">
                    <p className="text-white/30 text-sm">No events found for this vibe.</p>
                </div>
            )}
        </motion.div>
    );
};

export default AudienceView;