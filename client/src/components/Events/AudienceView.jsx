import React from 'react';
import { motion } from 'framer-motion';
import TicketCard from './TicketCard';
import { upcomingEvents } from '../../Data/EventData';

const AudienceView = () => {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Trending Events</h3>
                <button className="text-xs text-indigo-400 font-bold hover:text-white transition-colors">View All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {upcomingEvents.map(event => <TicketCard key={event.id} event={event} />)}
            </div>
        </motion.div>
    );
};

export default AudienceView;