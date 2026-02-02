import React from 'react';
import { Star, Palette, Music, Mic2, Zap, ArrowRight, Users, Sparkles, Mic, Wind, MapPin, BadgeCheck, Crown } from 'lucide-react';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';

import avatar1 from "../../assets/Images/ArtistSpotlight/acoustic.jpeg";
import avatar2 from "../../assets/Images/PerformerPanel/avatar2.jpeg";
import avatar3 from "../../assets/Images/ArtistSpotlight/pianist.avif";
import avatar4 from "../../assets/Images/ArtistSpotlight/beat.avif";
import avatar5 from "../../assets/Images/ArtistSpotlight/dancer.avif";
import avatar6 from "../../assets/Images/ArtistSpotlight/painter.avif";

const artists = [
    {
        id: 1,
        name: "Sumeet Singh",
        role: "Acoustic Artist",
        location: "New Delhi, India",
        followers: "12.5K",
        rating: "4.9",
        image: avatar1,
        color: "from-pink-500 to-rose-500",
        iconColor: "text-pink-400 bg-pink-500/10 border-pink-500/20",
        borderColor: "border-pink-500/30 group-hover:border-pink-500",
        glow: "group-hover:shadow-pink-500/30",
        icon: Mic,
    },
    {
        id: 2,
        name: "Jordan Chen",
        role: "Rock Vocalist",
        location: "Seoul, S. Korea",
        followers: "18.2K",
        rating: "5.0",
        image: avatar2,
        color: "from-blue-500 to-indigo-500",
        iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        borderColor: "border-blue-500/30 group-hover:border-blue-500",
        glow: "group-hover:shadow-blue-500/30",
        icon: Mic2,
    },
    {
        id: 3,
        name: "Sofia Laurent",
        role: "Classical Pianist",
        location: "Paris, France",
        followers: "25.8K",
        rating: "4.8",
        image: avatar3,
        color: "from-purple-500 to-violet-500",
        iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        borderColor: "border-purple-500/30 group-hover:border-purple-500",
        glow: "group-hover:shadow-purple-500/30",
        icon: Music,
        featured: true,
    },
    {
        id: 4,
        name: "Alex Thompson",
        role: "Beat Producer",
        location: "Los Angeles, USA",
        followers: "15.3K",
        rating: "4.9",
        image: avatar4,
        color: "from-emerald-500 to-teal-500",
        iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        borderColor: "border-emerald-500/30 group-hover:border-emerald-500",
        glow: "group-hover:shadow-emerald-500/30",
        icon: Zap,
    },
    {
        id: 5,
        name: "Nina Patel",
        role: "Contemporary Dancer",
        location: "London, UK",
        followers: "22.1K",
        rating: "5.0",
        image: avatar5,
        color: "from-orange-500 to-amber-500",
        iconColor: "text-orange-400 bg-orange-500/10 border-orange-500/20",
        borderColor: "border-orange-500/30 group-hover:border-orange-500",
        glow: "group-hover:shadow-orange-500/30",
        icon: Wind,
    },
    {
        id: 6,
        name: "Lucas Moretti",
        role: "Fine Art Painter",
        location: "Florence, Italy",
        followers: "34.2K",
        rating: "5.0",
        image: avatar6,
        color: "from-cyan-500 to-sky-500",
        iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        borderColor: "border-cyan-500/30 group-hover:border-cyan-500",
        glow: "group-hover:shadow-cyan-500/30",
        icon: Palette,
    },
];

export default function ArtistSpotlight() {
    return (
        <section id="community" className="relative pt-16 bg-black overflow-hidden">

            <div className="absolute inset-0 bg-black"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black pointer-events-none"></div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

                <div className="relative text-center mb-24 max-w-3xl mx-auto">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-indigo-500/15 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/30 mb-6 backdrop-blur-md">
                        <Sparkles size={14} className="text-indigo-300 fill-indigo-300/20 animate-pulse" />
                        <span className="text-xs font-bold text-indigo-200 tracking-[0.2em] uppercase font-poppins">
                            The Artify Spotlight
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white font-playfair leading-tight mb-6 relative z-10">
                        The Pulse of <br />
                        <span className="relative inline-block">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 italic pr-2">
                                Pure Creativity
                            </span>
                            <svg className="absolute w-full h-3 -bottom-1 left-0 text-purple-500 opacity-60" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.00025 6.99997C25.7501 2.99999 56.1265 2.00001 79.9999 2.00003C122.95 2.00006 142.333 7.83332 198 7.99999" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h2>

                    <p className="text-white/60 text-lg font-light font-poppins leading-relaxed max-w-2xl mx-auto">
                        Beyond just talent—these are the storytellers, the rhythm-makers, and the visionaries.
                        Explore the hand-picked artists who are redefining the <span className="text-white font-medium">Artify 🎨✨💜 Experience</span>.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-6 md:gap-x-12">
                    {artists.map((artist) => (
                        <div key={artist.id} className="group relative flex flex-col items-center text-center cursor-pointer">

                            <div className="relative mb-5">
                                <div className={`absolute -inset-[3px] rounded-full border-2 border-dashed ${artist.borderColor} opacity-60 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-700`}></div>
                                <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${artist.color} opacity-0 blur-xl group-hover:opacity-40 transition-opacity duration-500`}></div>

                                <div className={`relative w-36 h-36 md:w-44 md:h-44 rounded-full p-1.5 bg-black border border-white/10 ${artist.glow} transition-shadow duration-500`}>
                                    <div className="w-full h-full rounded-full overflow-hidden bg-black relative">
                                        <ImageWithFallback
                                            src={artist.image}
                                            alt={artist.name}
                                            className="w-full h-full object-cover saturate-[0.8] group-hover:saturate-[1.2] group-hover:scale-110 transition-all duration-700 ease-out"
                                        />
                                    </div>

                                    <div className={`absolute bottom-1 right-2 w-10 h-10 rounded-full flex items-center justify-center shadow-xl z-20 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300 backdrop-blur-md border ${artist.iconColor}`}>
                                        <artist.icon size={18} />
                                    </div>

                                    {artist.featured && (
                                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg tracking-wider border border-yellow-300">
                                            <Crown size={12} className="fill-black/80" />
                                            <span>TOP RATED</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative z-10 w-full px-2">

                                <div className="flex items-center justify-center gap-1.5 mb-1">
                                    <h3 className="text-lg md:text-xl font-bold text-white font-playfair group-hover:text-indigo-300 transition-colors">
                                        {artist.name}
                                    </h3>
                                    <BadgeCheck size={16} className="text-blue-500 fill-blue-500/20" />
                                </div>

                                <p className="text-xs md:text-sm font-medium uppercase tracking-wider text-white/50 mb-1 group-hover:text-white/80 transition-colors">
                                    {artist.role}
                                </p>

                                <div className="flex items-center justify-center gap-1 text-[11px] text-white/30 mb-4 font-poppins">
                                    <MapPin size={10} />
                                    <span>{artist.location}</span>
                                </div>

                                <div className="inline-flex items-center justify-center gap-4 bg-white/5 border border-white/10 rounded-full py-2 px-5 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300">
                                    <div className="flex items-center gap-1.5">
                                        <Users size={12} className="text-indigo-400" />
                                        <span className="text-xs font-semibold text-white/80">{artist.followers}</span>
                                    </div>
                                    <div className="w-[1px] h-3 bg-white/10"></div>
                                    <div className="flex items-center gap-1.5">
                                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                        <span className="text-xs font-semibold text-white/80">{artist.rating}</span>
                                    </div>
                                </div>

                                <div className="mt-4 h-0 opacity-0 group-hover:h-6 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <span className="text-xs font-bold text-white flex items-center justify-center gap-1">
                                        View Portfolio <ArrowRight size={12} />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-indigo-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]">
                        <span>Explore Community</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>

            </div>
        </section>
    );
}