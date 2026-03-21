 import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

const MarketHero = ({ searchQuery, setSearchQuery, onSearch }) => {
    
    // Enter dabane par search trigger ho
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className="relative w-full h-[500px] flex flex-col items-center justify-center bg-[#030303] overflow-hidden">
            
            {/* Elegant Backgrounds */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />

            <div className="relative z-10 text-center px-6 max-w-3xl w-full">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8 backdrop-blur-md"
                >
                    <Sparkles size={14} className="text-amber-400" />
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">The Elite Collection</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight tracking-tight"
                >
                    Curated Artifacts & <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400">Vintage Masterpieces.</span>
                </motion.h1>

                {/* 🌟 Functional Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full max-w-2xl mx-auto shadow-2xl group"
                >
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full opacity-20 group-hover:opacity-40 transition duration-500 blur-md"></div>
                    <div className="relative flex items-center bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 hover:border-amber-500/50 rounded-full p-2 pl-6 transition-colors duration-300">
                        <Search className="text-white/40 group-focus-within:text-amber-500 transition-colors mr-3" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Search flutes, canvas, acoustic guitars..."
                            className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-base font-light"
                        />
                        <button 
                            onClick={onSearch}
                            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-full text-sm font-bold hover:scale-105 transition-transform"
                        >
                            Explore
                        </button>
                    </div>
                </motion.div>
                
            </div>
        </div>
    );
};

export default MarketHero;