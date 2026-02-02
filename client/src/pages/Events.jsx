import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from '../components/Navbar';
import EventHero from '../components/Events/EventHero';
import ArtistView from '../components/Events/ArtistView';
import AudienceView from '../components/Events/AudienceView';
import { Footer } from '../components/Footer';

import LiveRadar from '../components/Events/LiveRadar';
import VibeFilter from '../components/Events/VibeFilter';


const Events = () => {
    const [viewMode, setViewMode] = useState('artist');
    const [activeVibe, setActiveVibe] = useState('all');

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-indigo-500/30">
            <Navbar />
            <EventHero />

             <div className="sticky top-20 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl">
                <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">

                     <div className="flex items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                {viewMode === 'artist' ? 'Artist Workspace' : 'Box Office'}
                            </h2>
                        </div>
                         <LiveRadar />
                    </div>

                     <div className="relative flex bg-[#111] p-1 rounded-lg border border-white/10 self-start md:self-auto">
                        <motion.div
                            className="absolute top-1 bottom-1 w-[100px] bg-indigo-600 rounded-md shadow-lg"
                            animate={{ x: viewMode === 'artist' ? 0 : 100 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                        <button onClick={() => setViewMode('artist')} className={`relative z-10 w-[100px] py-2 text-xs font-bold transition-colors ${viewMode === 'artist' ? 'text-white' : 'text-white/50'}`}>Perform</button>
                        <button onClick={() => setViewMode('audience')} className={`relative z-10 w-[100px] py-2 text-xs font-bold transition-colors ${viewMode === 'audience' ? 'text-white' : 'text-white/50'}`}>Attend</button>
                    </div>
                </div>
            </div>

             <div className="max-w-[1400px] mx-auto px-6 mt-8">
                <div className="flex items-center gap-4 mb-4">
                    <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Filter by Vibe</span>
                    <div className="h-[1px] flex-1 bg-white/5"></div>
                </div>
                 <VibeFilter activeVibe={activeVibe} setActiveVibe={setActiveVibe} />
            </div>

             <div className="max-w-[1400px] mx-auto px-6 py-8 min-h-[600px]">
                <AnimatePresence mode="wait">
                     {viewMode === 'artist' ? <ArtistView key="artist" filter={activeVibe} /> : <AudienceView key="audience" filter={activeVibe} />}
                </AnimatePresence>
            </div>

            <Footer />
        </div>
    );
};

export default Events;