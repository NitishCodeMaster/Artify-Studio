import React from 'react';
import { motion } from 'framer-motion';
import { Mic2, DollarSign, Users, PlusCircle } from 'lucide-react';
import GigCard from './GigCard';

const ArtistView = ({ events, refresh, onOpenModal,onOpenDetails }) => {
    const icons = { mic: Mic2, dollar: DollarSign, users: Users };


    const dynamicStats = [
        {
            label: 'Total Gigs',
            value: events.length,
            icon: 'mic',
            color: 'text-indigo-400'
        },
        {
            label: 'Total Earned',
            value: '₹0',
            icon: 'dollar',
            color: 'text-emerald-400'
        },
        {
            label: 'Attendees',
            value: events.reduce((acc, curr) => acc + (curr.attendees?.length || 0), 0),
            icon: 'users',
            color: 'text-amber-400'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
        >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dynamicStats.map((stat, i) => {
                    const Icon = icons[stat.icon];
                    return (
                        <div key={i} className="bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                            <div className={`p-2 rounded-full bg-white/5 ${stat.color}`}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
                                <p className="text-xs text-white/40 uppercase tracking-wide">{stat.label}</p>
                            </div>
                        </div>
                    );
                })}

                <div
                    onClick={onOpenModal}
                    className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-2xl flex flex-col justify-center items-center text-center cursor-pointer hover:scale-105 transition-transform shadow-lg shadow-indigo-500/10"
                >
                    <PlusCircle className="text-white mb-1" size={20} />
                    <span className="font-bold text-white text-sm">Post a Gig</span>
                    <span className="text-[10px] text-white/70 uppercase tracking-tighter">List your event</span>
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        Available Gigs <span className="text-xs font-normal text-white/40 bg-white/5 px-2 py-0.5 rounded">Real-time</span>
                    </h3>
                    <button
                        onClick={refresh}
                        className="text-[10px] uppercase tracking-widest text-indigo-400 hover:text-white transition-colors"
                    >
                        Refresh List
                    </button>
                </div>

                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <GigCard key={event._id} event={event} refresh={refresh} onOpenDetails={onOpenDetails}/>
                        ))}
                    </div>
                ) : (
                    <div className="h-48 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
                        <p className="text-white/20 text-sm italic">No gigs listed yet. Be the first to perform!</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ArtistView;