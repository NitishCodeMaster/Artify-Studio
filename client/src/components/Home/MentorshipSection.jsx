import React from 'react';
import { Star, GraduationCap, Users, ArrowRight, BookOpen, Video, Music, Palette, Wind, CheckCircle2, Sparkles, Globe, ShieldCheck, Zap } from 'lucide-react';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';

import teacher1 from "../../assets/Images/teacher/image1.jpg";
import teacher2 from "../../assets/Images/teacher/image2.avif";
import teacher3 from "../../assets/Images/teacher/image3.avif";

const mentors = [
    {
        id: 1,
        name: "Arjun Mehta",
        specialty: "Guitar & Music Theory",
        experience: "7 Years Exp.",
        students: "1k+ Students",
        rating: "4.9",
        image: teacher1,
        color: "from-sky-500 to-blue-600",
        shadow: "group-hover:shadow-blue-500/20",
        border: "group-hover:border-blue-400/50",
        text: "text-sky-400",
        bg: "bg-blue-500/10",
        icon: Music,
    },
    {
        id: 2,
        name: "Elena Ray",
        specialty: "Oil Painting Masterclass",
        experience: "11 Years Exp.",
        students: "2.2k+ Students",
        rating: "5.0",
        image: teacher2,
        color: "from-orange-300 to-amber-600",
        shadow: "group-hover:shadow-orange-500/20",
        border: "group-hover:border-orange-400/50",
        text: "text-orange-300",
        bg: "bg-orange-500/10",
        icon: Palette,
    },
    {
        id: 3,
        name: "Elena Vance",
        specialty: "Contemporary Fusion",
        experience: "9 Years Exp.",
        students: "1.5k+ Students",
        rating: "4.9",
        image: teacher3,
        color: "from-violet-400 to-purple-500",
        shadow: "group-hover:shadow-violet-500/20",
        border: "group-hover:border-violet-500/50",
        text: "text-violet-400",
        bg: "bg-violet-500/10",
        icon: Wind,
    }
];

export default function MentorshipSection() {
    return (
        <section className="relative pt-16 pb-16 bg-[#020202] overflow-hidden">


            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <Music className="absolute top-20 left-10 text-blue-900/20 rotate-[-12deg] blur-[2px]" size={120} />
            <Palette className="absolute bottom-20 right-10 text-orange-900/20 rotate-[12deg] blur-[2px]" size={120} />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                            <GraduationCap size={16} className="text-yellow-400" />
                            <span className="text-xs font-bold text-yellow-100 tracking-[0.2em] uppercase font-poppins">
                                Elite Mentorship
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white font-playfair leading-tight">
                            Master Your <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-500">
                                Craft
                                <Sparkles className="absolute -top-6 -right-8 text-yellow-500/50 animate-pulse" size={24} />
                            </span>
                        </h2>
                        <p className="text-white/50 mt-6 text-lg font-light leading-relaxed">
                            Stop scrolling, start creating. Book 1-on-1 sessions with industry experts and elevate your skills today.
                        </p>
                    </div>

                    <button className="hidden md:flex group items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                        <span>Find a Mentor</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="flex flex-wrap items-center gap-6 md:gap-12 mb-16 border-y border-white/5 py-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-green-500/10 text-green-400"><ShieldCheck size={18} /></div>
                        <span className="text-sm text-white/60 font-medium">Verified Experts</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-blue-500/10 text-blue-400"><Globe size={18} /></div>
                        <span className="text-sm text-white/60 font-medium">Global Community</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-purple-500/10 text-purple-400"><Zap size={18} /></div>
                        <span className="text-sm text-white/60 font-medium">Instant Booking</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {mentors.map((mentor) => (
                        <div key={mentor.id} className={`group relative h-full bg-[#0A0A0A] rounded-[2rem] border border-white/5 overflow-hidden hover:-translate-y-2 transition-all duration-500 ${mentor.shadow} ${mentor.border}`}>

                            <div className="relative h-72 w-full overflow-hidden">
                                <ImageWithFallback
                                    src={mentor.image}
                                    alt={mentor.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 saturate-[0.85] group-hover:saturate-100"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent"></div>

                                <div className={`absolute bottom-4 left-6 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 ${mentor.text}`}>
                                    <mentor.icon size={26} />
                                </div>

                                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-white text-xs font-bold">{mentor.rating}</span>
                                </div>
                            </div>

                            <div className="p-6 pt-2">
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-2xl font-bold text-white font-playfair">{mentor.name}</h3>
                                    <CheckCircle2 size={16} className="text-blue-500/80" />
                                </div>

                                <div className={`inline-block px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider mb-6 ${mentor.bg} ${mentor.text} border border-white/5`}>
                                    {mentor.specialty}
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-5 mb-6">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-1.5 text-white/40 text-xs uppercase font-bold tracking-wider">
                                            <BookOpen size={12} /> Experience
                                        </div>
                                        <span className="text-white font-semibold">{mentor.experience}</span>
                                    </div>
                                    <div className="flex flex-col gap-1 border-l border-white/5 pl-4">
                                        <div className="flex items-center gap-1.5 text-white/40 text-xs uppercase font-bold tracking-wider">
                                            <Users size={12} /> Students
                                        </div>
                                        <span className="text-white font-semibold">{mentor.students}</span>
                                    </div>
                                </div>

                                <button className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-sm hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                                    <Video size={16} />
                                    Book Trial Class
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <button className="px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        Find a Mentor
                    </button>
                </div>

            </div>
        </section>
    );
}