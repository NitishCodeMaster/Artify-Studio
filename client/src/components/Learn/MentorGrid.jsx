import React, { useMemo } from 'react';
import { Star, Video, ArrowRight, BadgeCheck, Languages, Users, Sparkles, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';

const MentorSkeleton = () => (
    <div className="rounded-2xl border border-white/5 bg-[#0f0f0f] p-3">
        <div className="h-56 animate-pulse rounded-xl bg-white/[0.04]" />
        <div className="space-y-3 px-2 pt-4">
            <div className="h-6 w-40 rounded bg-white/10" />
            <div className="h-4 w-32 rounded bg-white/10" />
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="h-6 w-20 rounded bg-white/10" />
                <div className="h-10 w-28 rounded-full bg-white/10" />
            </div>
        </div>
    </div>
);

export function MentorGrid({ mentors = [], filter = '', loading = false, onSelectFilter }) {
    const navigate = useNavigate();
    const visibleMentors = mentors.filter((mentor) => {
        const q = filter.toLowerCase();
        return !q
            || mentor.name.toLowerCase().includes(q)
            || mentor.skill.toLowerCase().includes(q)
            || mentor.specialty.toLowerCase().includes(q);
    });
    const quickMatches = useMemo(() => {
        const matches = mentors
            .flatMap((mentor) => [mentor.skill, mentor.specialty])
            .filter(Boolean)
            .map((item) => item.split('&')[0].split(',')[0].trim())
            .filter((item) => item.length > 2);

        return [...new Set(matches)].slice(0, 5);
    }, [mentors]);

    return (
        <div id="mentor-grid" className="mb-12 scroll-mt-24">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45 }}
                className="mb-8 flex flex-col items-start justify-between gap-4 px-1 sm:flex-row sm:items-end"
            >
                <div className="min-w-0">
                    <h3 className="text-2xl font-bold text-white sm:text-[1.8rem]">Top Rated Mentors</h3>
                    <p className="mt-2 text-sm text-white/40">Real mentor profiles powered from artist accounts, each with a unique mentor identity.</p>
                </div>
                <button onClick={() => navigate('/settings')} className="text-sm font-bold uppercase tracking-wider text-pink-400 hover:text-pink-300">
                    Become a Mentor
                </button>
            </motion.div>

            {!loading && quickMatches.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.35 }}
                    className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.025] p-3"
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-100">
                        <Sparkles size={14} className="text-pink-300" />
                        Mentor Match
                    </span>
                    {quickMatches.map((match) => (
                        <button
                            key={match}
                            onClick={() => onSelectFilter?.(match)}
                            className={`rounded-full border px-3 py-2 text-xs font-semibold transition-all ${filter.toLowerCase() === match.toLowerCase()
                                ? 'border-pink-300/60 bg-pink-400/15 text-white'
                                : 'border-white/10 bg-black/30 text-white/55 hover:border-white/25 hover:text-white'
                                }`}
                        >
                            {match}
                        </button>
                    ))}
                    {filter && (
                        <button
                            onClick={() => onSelectFilter?.('')}
                            className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-white/45 transition-colors hover:text-white"
                        >
                            <X size={13} />
                            Clear
                        </button>
                    )}
                </motion.div>
            )}

            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {loading && [1, 2, 3].map((item) => <MentorSkeleton key={item} />)}

                {!loading && visibleMentors.map((mentor, index) => (
                    <motion.div
                        key={mentor.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        whileHover={{ y: -8 }}
                        className={`group relative rounded-2xl border border-white/5 bg-[#0f0f0f] p-3 transition-all duration-300 hover:-translate-y-1.5 sm:p-3.5 ${mentor.shadow} ${mentor.border}`}
                    >
                        <div className="relative mb-4 h-56 overflow-hidden rounded-xl border border-white/10 bg-[#111111]">
                            <ImageWithFallback src={mentor.image} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-xl grayscale transition-opacity duration-500 group-hover:opacity-45" />
                            <ImageWithFallback src={mentor.image} alt={mentor.name} className="relative z-10 h-full w-full object-contain p-2 grayscale transition-all duration-500 group-hover:scale-[1.02] group-hover:grayscale-0" />
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                            <div className="absolute right-3 top-3 z-20 flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-3 py-1 backdrop-blur-md">
                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold text-white">{mentor.rating}</span>
                            </div>
                            <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2">
                                <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${mentor.badge}`}>
                                    {mentor.specialty}
                                </span>
                                {mentor.isVerified && (
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-emerald-200">
                                        <BadgeCheck size={11} />
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="px-2">
                            <div className="mb-1 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                                <h4 className="text-lg font-bold text-white">{mentor.name}</h4>
                                <span className="break-all text-[11px] uppercase tracking-[0.18em] text-white/30 sm:text-xs sm:tracking-[0.22em]">{mentor.mentorSlug}</span>
                            </div>
                            <p className="mb-1 text-sm text-white/70">{mentor.skill}</p>
                            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-white/45">{mentor.headline}</p>

                            <div className="mb-4 grid grid-cols-1 gap-2.5 text-xs text-white/55 sm:grid-cols-2">
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5">
                                    <div className="mb-1 flex items-center gap-1.5 uppercase tracking-[0.2em] text-white/30">
                                        <Users size={12} />
                                        Learners
                                    </div>
                                    <div className="text-sm font-semibold text-white">{mentor.students}</div>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5">
                                    <div className="mb-1 flex items-center gap-1.5 uppercase tracking-[0.2em] text-white/30">
                                        <Languages size={12} />
                                        Modes
                                    </div>
                                    <div className="text-sm font-semibold text-white">{mentor.mentorshipModes?.slice(0, 2).join(' • ') || 'Online'}</div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <div className="text-lg font-bold text-white">{mentor.price}</div>
                                    <div className="text-xs text-white/35">{mentor.experience}</div>
                                </div>
                                <button
                                    onClick={() => navigate(`/profile/${mentor.id}`)}
                                    className="flex min-h-9 items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-gray-200"
                                >
                                    <Video size={16} />
                                    View Mentor
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {!loading && visibleMentors.length === 0 && (
                    <div className="col-span-full rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-16 text-center text-white/40">
                        No mentors matched your search yet.
                    </div>
                )}
            </div>
        </div>
    );
}
