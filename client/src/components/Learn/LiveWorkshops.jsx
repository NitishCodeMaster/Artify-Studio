import React, { useEffect, useState } from 'react';
import { Calendar, Users, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const workshops = [
    {
        id: 1,
        title: "Mastering Watercolor Textures",
        tutor: "With Elena R.",
        date: "Tomorrow, 5:00 PM",
        attendees: 140,
        tags: ["Art", "Live"],
        color: "from-blue-600 to-cyan-600"
    },
    {
        id: 2,
        title: "Music Production 101: FL Studio",
        tutor: "With DJ Kronik",
        date: "Sat, 24 Feb, 8:00 PM",
        attendees: 320,
        tags: ["Music", "Tech"],
        color: "from-purple-600 to-pink-600"
    }
];

export function LiveWorkshops({ filter = '' }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (workshops.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % workshops.length);
        }, 2600);
        return () => clearInterval(interval);
    }, []);

    const visibleWorkshops = workshops.filter((ws) => {
        const q = filter.toLowerCase();
        return !q || ws.title.toLowerCase().includes(q) || ws.tags.some((tag) => tag.toLowerCase().includes(q));
    });

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45 }}
                className="mb-10 px-4 flex items-end justify-between gap-6"
            >
                <div>
                    <h3 className="text-3xl font-bold text-white">Upcoming Live Masterclasses</h3>
                    <p className="mt-2 text-white/40 text-sm">Live sessions rotating through the week for artists and performers.</p>
                </div>
                <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
                    <Sparkles size={14} className="text-pink-400" />
                    Auto spotlight
                </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
                <AnimatePresence>
                    {visibleWorkshops.map((ws, index) => (
                    <motion.div
                        key={ws.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.45, delay: index * 0.08 }}
                        whileHover={{ y: -6 }}
                        className={`group relative overflow-hidden rounded-3xl border cursor-pointer transition-all duration-300 ${activeIndex === index ? 'border-white/20' : 'border-white/10'}`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${ws.color} ${activeIndex === index ? 'opacity-20' : 'opacity-10 group-hover:opacity-20'} transition-opacity`}></div>
                        <motion.div
                            animate={{ scaleX: activeIndex === index ? [0, 1] : 0 }}
                            transition={{ duration: 2.2, ease: "linear" }}
                            className={`absolute left-0 right-0 top-0 h-[2px] origin-left bg-gradient-to-r ${ws.color}`}
                        />

                        <div className="relative p-8 flex flex-col h-full">
                            <div className="flex gap-2 mb-4">
                                {ws.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h4 className="text-2xl font-bold text-white mb-2 max-w-sm">{ws.title}</h4>
                            <p className="text-white/60 mb-8">{ws.tutor}</p>

                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-sm text-white/80">
                                        <Calendar size={16} className="text-pink-400" /> {ws.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/50">
                                        <Users size={16} /> {ws.attendees} Registered
                                    </div>
                                </div>

                                <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>

                {visibleWorkshops.length === 0 && (
                    <div className="col-span-full rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-16 text-center text-white/40">
                        No workshops matched your search yet.
                    </div>
                )}
            </div>

            {visibleWorkshops.length > 0 && (
                <div className="mt-6 flex justify-center gap-2">
                    {visibleWorkshops.map((ws, index) => (
                        <button
                            key={ws.id}
                            onClick={() => setActiveIndex(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === index ? `w-10 bg-gradient-to-r ${ws.color}` : 'w-2 bg-white/20 hover:bg-white/40'}`}
                            aria-label={`Focus ${ws.title}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
