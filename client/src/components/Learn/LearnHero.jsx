import React from 'react';
import { Search, Sparkles, ArrowRight, BadgeCheck, CalendarClock, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export function LearnHero({ searchQuery, setSearchQuery, stats, onFindMentor }) {
    return (
        <div className="mb-14 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.45 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
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
                className="text-5xl md:text-7xl font-black text-white font-playfair mb-6 leading-tight"
            >
                Learn from the <br className="hidden sm:block" />
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
                className="text-lg text-white/40 leading-relaxed max-w-2xl mb-8"
            >
                Book 1-on-1 mentorship sessions, join live masterclasses, and level up your skills with verified pros.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mb-7 flex flex-wrap items-center gap-3"
            >
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
                    {stats?.mentors || 0}+ live mentors
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/65">
                    {stats?.workshops || 0}+ active workshops
                </div>
            </motion.div>
 
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.45 }}
                transition={{ duration: 0.5, delay: 0.18 }}
                className="relative max-w-2xl group"
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
                    <button
                        onClick={onFindMentor}
                        className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        Find Mentor
                        <ArrowRight size={16} />
                    </button>
                </div>
            </motion.div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                    { icon: GraduationCap, title: 'Personal Mentors', value: `${stats?.mentors || 0}+`, text: 'Learn directly from verified artist profiles.' },
                    { icon: CalendarClock, title: 'Live Workshops', value: `${stats?.workshops || 0}+`, text: 'Join practical sessions and community classes.' },
                    { icon: BadgeCheck, title: 'Verified Identity', value: 'Artify', text: 'Mentors come from real creator accounts.' },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-md">
                            <div className="mb-4 flex items-center justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-500/15 text-pink-300">
                                    <Icon size={20} />
                                </div>
                                <span className="text-xl font-black text-white">{item.value}</span>
                            </div>
                            <h3 className="font-bold text-white">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-white/45">{item.text}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
