import React from 'react';
import { motion } from 'framer-motion';
import { Mic2, DollarSign, Users } from 'lucide-react';
import GigCard from './GigCard';
import { gigOpportunities, artistStats } from '../../Data/EventData';

const ArtistView = () => {
    const icons = { mic: Mic2, dollar: DollarSign, users: Users };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10">

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {artistStats.map((stat, i) => {
                    const Icon = icons[stat.icon];
                    return (
                        <div key={i} className="bg-[#0a0a0a] border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                            <div className={`p-2 rounded-full bg-white/5 ${stat.color}`}><Icon size={20} /></div>
                            <div>
                                <h4 className="text-2xl font-bold text-white">{stat.value}</h4>
                                <p className="text-xs text-white/40 uppercase tracking-wide">{stat.label}</p>
                            </div>
                        </div>
                    )
                })}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-4 rounded-2xl flex flex-col justify-center items-center text-center cursor-pointer hover:scale-105 transition-transform">
                    <span className="font-bold text-white text-lg">Create Profile</span>
                    <span className="text-xs text-white/70">Get Scouted</span>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    Latest Gigs <span className="text-xs font-normal text-white/40 bg-white/5 px-2 py-0.5 rounded">For You</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {gigOpportunities.map(gig => <GigCard key={gig.id} gig={gig} />)}
                </div>
            </div>
        </motion.div>
    );
};

export default ArtistView;