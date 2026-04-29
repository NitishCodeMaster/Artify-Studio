import React, { useEffect, useState } from 'react';
import { GraduationCap, ArrowRight, BookOpen, Video, Music, Palette, Wind, CheckCircle2, Sparkles, Globe, ShieldCheck, Zap, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';

const iconMap = {
    music: Music,
    guitar: Music,
    vocal: Music,
    paint: Palette,
    art: Palette,
    dance: Wind,
    movement: Wind,
};

const getMentorIcon = (skill = '') => {
    const key = skill.toLowerCase();
    return Object.entries(iconMap).find(([token]) => key.includes(token))?.[1] || Music;
};

const MentorCardSkeleton = () => (
    <div className="rounded-[2rem] border border-white/5 bg-[#0A0A0A] overflow-hidden">
        <div className="h-72 animate-pulse bg-white/[0.04]" />
        <div className="space-y-4 p-6">
            <div className="h-7 w-40 rounded bg-white/10" />
            <div className="h-6 w-32 rounded bg-white/10" />
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
                <div className="h-10 rounded bg-white/10" />
                <div className="h-10 rounded bg-white/10" />
            </div>
            <div className="h-12 rounded-xl bg-white/10" />
        </div>
    </div>
);

export default function MentorshipSection() {
    const navigate = useNavigate();
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await api.get('/learn/mentors', { params: { limit: 3 } });
                setMentors(res.data.mentors || []);
            } catch (error) {
                console.error('Failed to load mentorship spotlight:', error);
                setMentors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMentors();
    }, []);

    return (
        <section className="relative overflow-hidden bg-[#020202] pb-16 pt-16">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <Music className="absolute top-20 left-10 rotate-[-12deg] text-blue-900/20 blur-[2px]" size={120} />
            <Palette className="absolute bottom-20 right-10 rotate-[12deg] text-orange-900/20 blur-[2px]" size={120} />
            <div className="absolute top-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
                    <div className="max-w-2xl">
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                            <GraduationCap size={16} className="text-yellow-400" />
                            <span className="font-poppins text-xs font-bold uppercase tracking-[0.2em] text-yellow-100">
                                Elite Mentorship
                            </span>
                        </div>
                        <h2 className="font-playfair text-4xl font-bold leading-tight text-white md:text-6xl">
                            Master Your <span className="relative inline-block bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                                Craft
                                <Sparkles className="absolute -right-8 -top-6 animate-pulse text-yellow-500/50" size={24} />
                            </span>
                        </h2>
                        <p className="mt-6 text-lg font-light leading-relaxed text-white/50">
                            Live mentor profiles now come from real creator accounts, with unique mentor identities and bookable learning tracks.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/learn')}
                        className="hidden items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 font-medium text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-black md:flex group"
                    >
                        <span>Find a Mentor</span>
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </button>
                </div>

                <div className="mb-16 flex flex-wrap items-center gap-6 border-y border-white/5 py-6 md:gap-12">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-green-500/10 p-2 text-green-400"><ShieldCheck size={18} /></div>
                        <span className="text-sm font-medium text-white/60">Verified Experts</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-blue-500/10 p-2 text-blue-400"><Globe size={18} /></div>
                        <span className="text-sm font-medium text-white/60">Global Community</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-purple-500/10 p-2 text-purple-400"><Zap size={18} /></div>
                        <span className="text-sm font-medium text-white/60">Instant Booking</span>
                    </div>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {loading && [1, 2, 3].map((item) => <MentorCardSkeleton key={item} />)}

                    {!loading && mentors.map((mentor) => {
                        const Icon = getMentorIcon(mentor.skill);

                        return (
                            <div key={mentor.id} className={`group relative h-full overflow-hidden rounded-[2rem] border border-white/5 bg-[#0A0A0A] transition-all duration-500 hover:-translate-y-2 ${mentor.shadow} ${mentor.border}`}>
                                <div className="relative h-72 w-full overflow-hidden">
                                    <ImageWithFallback
                                        src={mentor.image}
                                        alt={mentor.name}
                                        className="h-full w-full object-cover saturate-[0.85] transition-transform duration-700 group-hover:scale-110 group-hover:saturate-100"
                                    />

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent"></div>

                                    <div className={`absolute bottom-4 left-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl transition-transform duration-300 group-hover:scale-110 ${mentor.text}`}>
                                        <Icon size={26} />
                                    </div>

                                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 shadow-lg backdrop-blur-md">
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-bold text-white">{mentor.rating}</span>
                                    </div>
                                </div>

                                <div className="p-6 pt-2">
                                    <div className="mb-1 flex items-center justify-between">
                                        <h3 className="font-playfair text-2xl font-bold text-white">{mentor.name}</h3>
                                        {mentor.isVerified && <CheckCircle2 size={16} className="text-blue-500/80" />}
                                    </div>

                                    <div className={`mb-3 inline-block rounded-lg border border-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${mentor.bg} ${mentor.text}`}>
                                        {mentor.specialty}
                                    </div>

                                    <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-white/45">{mentor.headline}</p>

                                    <div className="mb-6 grid grid-cols-2 gap-4 border-t border-white/5 pt-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/40">
                                                <BookOpen size={12} /> Experience
                                            </div>
                                            <span className="font-semibold text-white">{mentor.experience}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 border-l border-white/5 pl-4">
                                            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white/40">
                                                <Users size={12} /> Students
                                            </div>
                                            <span className="font-semibold text-white">{mentor.students}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/profile/${mentor.id}`)}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-white hover:text-black group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                                    >
                                        <Video size={16} />
                                        View Mentor Profile
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {!loading && mentors.length === 0 && (
                        <div className="col-span-full rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-8 py-16 text-center text-white/40">
                            No mentor profiles are live yet. Create one from settings to appear here.
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <button
                        onClick={() => navigate('/learn')}
                        className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                        Find a Mentor
                    </button>
                </div>
            </div>
        </section>
    );
}
