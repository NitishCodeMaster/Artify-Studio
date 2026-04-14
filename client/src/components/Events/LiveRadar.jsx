import React from 'react';
import { motion } from 'framer-motion';

const LiveRadar = ({ count }) => {
    return (
        <div className="hidden lg:flex items-center gap-4 bg-[#0a0a0a] border border-white/10 px-4 py-2 rounded-full shadow-xl">
            <div className="relative flex items-center justify-center w-8 h-8">
                <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-20 animate-ping"></span>
                <div className="relative w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
            </div>

            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Now</span>
                <span className="text-xs text-white/50">{count} Events Active Today</span>
            </div>
        </div>
    );
};

export default LiveRadar;