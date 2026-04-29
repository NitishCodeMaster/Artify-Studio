import React from 'react';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function LearnHero({ searchQuery, setSearchQuery }) {
    return (
        <div className="text-center max-w-4xl mx-auto mb-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
            >
                <motion.div
                    animate={{ rotate: [0, 10, -8, 0], scale: [1, 1.08, 1] }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <Sparkles size={16} className="text-pink-400" />
                </motion.div>
                <span className="text-xs font-bold text-pink-400 tracking-widest uppercase">Master Your Craft</span>
            </motion.div>

            <motion.h2
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-5xl md:text-7xl font-black text-white font-playfair mb-8 leading-tight"
            >
                Learn from the <br />
                <motion.span
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="bg-[length:200%_200%] text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"
                >
                    Legends of Art
                </motion.span>
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="text-lg text-white/40 leading-relaxed max-w-2xl mx-auto mb-10"
            >
                Book 1-on-1 mentorship sessions, join live masterclasses, and level up your skills with verified pros.
            </motion.p>
 
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="relative max-w-xl mx-auto group"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-full p-2 pl-6 shadow-2xl">
                    <Search className="text-white/40 mr-3" size={20} />
                    <input
                        type="text"
                        placeholder="What do you want to learn? (e.g. Guitar, Oil Painting)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent text-white w-full focus:outline-none placeholder-white/30"
                    />
                    <button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                        Find Mentor
                        <ArrowRight size={16} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
