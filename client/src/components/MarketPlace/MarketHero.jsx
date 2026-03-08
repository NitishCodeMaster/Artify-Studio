import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

const MarketHero = () => {
    return (
        <div className="relative w-full h-[450px] flex flex-col items-center justify-center bg-[#050505] overflow-hidden">

             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />

            <div className="relative z-10 text-center px-6 max-w-2xl">

                 <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
                >
                    <Sparkles size={12} className="text-amber-300" />
                    <span className="text-[10px] font-semibold text-white/80 uppercase tracking-widest">Premium Collection</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-medium text-white mb-6 font-playfair leading-tight"
                >
                    Curated Artifacts & <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Vintage Gear.</span>
                </motion.h1>

                 <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative w-full shadow-2xl group"
                >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
                    <div className="relative flex items-center bg-[#0f0f0f] border border-white/10 rounded-full p-2 pl-6">
                        <Search className="text-white/40 mr-3" size={18} />
                        <input
                            type="text"
                            placeholder="Search for flutes, guitars, or paintings..."
                            className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm font-light"
                        />
                        <button className="px-6 py-2.5 bg-white text-black rounded-full text-xs font-bold hover:bg-gray-200 transition-colors">
                            Search
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MarketHero;