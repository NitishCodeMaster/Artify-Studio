import React, { useEffect, useState } from 'react';
import { Calendar, Users, ArrowRight, Sparkles, Clock3, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';

const WorkshopSkeleton = () => (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
        <div className="h-48 animate-pulse bg-white/[0.04]" />
        <div className="space-y-4 p-5">
            <div className="h-6 w-2/3 rounded bg-white/10" />
            <div className="h-4 w-40 rounded bg-white/10" />
            <div className="flex items-center justify-between pt-8">
                <div className="space-y-2">
                    <div className="h-4 w-32 rounded bg-white/10" />
                    <div className="h-4 w-24 rounded bg-white/10" />
                </div>
                <div className="h-12 w-12 rounded-full bg-white/10" />
            </div>
        </div>
    </div>
);

export function LiveWorkshops({ workshops = [], filter = '', loading = false, onCreateWorkshop, canCreateWorkshop = false }) {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);

    const visibleWorkshops = workshops.filter((ws) => {
        const q = filter.toLowerCase();
        return !q || ws.title.toLowerCase().includes(q) || ws.tags.some((tag) => tag.toLowerCase().includes(q));
    });

    useEffect(() => {
        if (visibleWorkshops.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % visibleWorkshops.length);
        }, 3200);
        return () => clearInterval(interval);
    }, [visibleWorkshops]);

    useEffect(() => {
        if (activeIndex > visibleWorkshops.length - 1) {
            setActiveIndex(0);
        }
    }, [activeIndex, visibleWorkshops.length]);

    return (
        <div>
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45 }}
                className="mb-7 flex flex-col items-start justify-between gap-4 px-1 sm:mb-8 sm:px-3 md:flex-row md:items-end"
            >
                <div className="min-w-0">
                    <h3 className="text-2xl font-bold text-white sm:text-[1.8rem]">Upcoming Live Masterclasses</h3>
                    <p className="mt-2 text-sm text-white/40">Mentor-led workshops now come from live backend data, so this section stays fresh automatically.</p>
                </div>
                <div className="flex w-full flex-wrap items-center gap-3 md:w-auto md:justify-end">
                    {canCreateWorkshop && (
                        <button
                            onClick={onCreateWorkshop}
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200 transition-all hover:bg-indigo-500/15"
                        >
                            <Plus size={13} />
                            Create Workshop
                        </button>
                    )}
                    <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60 md:flex">
                        <Sparkles size={14} className="text-pink-400" />
                        Live workshop rotation
                    </div>
                </div>
            </motion.div>

            <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
                {loading && [1, 2].map((item) => <WorkshopSkeleton key={item} />)}

                {!loading && (
                    <AnimatePresence>
                        {visibleWorkshops.map((ws, index) => (
                            <motion.div
                                key={ws.id}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.45, delay: index * 0.08 }}
                                whileHover={{ y: -6 }}
                                className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition-all duration-300 ${activeIndex === index ? 'border-white/20' : 'border-white/10'}`}
                                onClick={() => ws.mentorId && navigate(`/profile/${ws.mentorId}`)}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <ImageWithFallback src={ws.image} alt={ws.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-black/35 to-transparent" />
                                    <div className="absolute left-4 top-4 flex gap-2">
                                        {ws.tags.map((tag) => (
                                            <span key={tag} className="rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <motion.div
                                        animate={{ scaleX: activeIndex === index ? [0, 1] : 0 }}
                                        transition={{ duration: 2.8, ease: 'linear' }}
                                        className={`absolute left-0 right-0 top-0 h-[2px] origin-left bg-gradient-to-r ${ws.color}`}
                                    />
                                </div>

                                <div className="relative flex h-full flex-col p-5 sm:p-6">
                                    <h4 className="max-w-md text-xl font-bold text-white sm:text-[1.35rem]">{ws.title}</h4>
                                    <p className="mt-2 text-white/65">{ws.tutor}</p>
                                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/45">{ws.summary}</p>

                                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 text-sm text-white/80">
                                                <Calendar size={16} className="text-pink-400" /> {ws.date}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/50">
                                                <span className="flex items-center gap-2">
                                                    <Users size={16} /> {ws.attendees} Registered
                                                </span>
                                                <span className="flex items-center gap-2">
                                                    <Clock3 size={16} /> {ws.durationMinutes} min
                                                </span>
                                            </div>
                                        </div>

                                        <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform group-hover:scale-110">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {!loading && visibleWorkshops.length === 0 && (
                    <div className="col-span-full rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-16 text-center text-white/40">
                        No workshops matched your search yet.
                    </div>
                )}
            </div>

            {!loading && visibleWorkshops.length > 0 && (
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
