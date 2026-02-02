import React from 'react';
import { Star, Music, Palette, Zap, TrendingUp, Ticket, Gavel, Quote, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';


import user1 from '../../assets/Images/features/user1.jpeg';
import user2 from '../../assets/Images/features/user2.jpeg';
import user3 from '../../assets/Images/features/user3.jpeg';

const testimonials = [
    {
        id: 1,
        name: "Rohan Das",
        role: "Indie Guitarist",
        location: "Mumbai, IN",
        image: user2,
        impact: "Sold Vintage Gear",
        impactIcon: TrendingUp,
        roleIcon: Music,
        text: "I was struggling to sell my old amp. On Artify, I found a buyer in 2 days who understood its value. The verification gave me total peace of mind.",
        rating: 5,
        gradient: "from-indigo-500 to-blue-500"
    },
    {
        id: 2,
        name: "Ananya Gupta",
        role: "Contemporary Dancer",
        location: "Delhi, IN",
        image: user1,
        impact: "Booked First Show",
        impactIcon: Ticket,
        roleIcon: Zap,
        text: "Finding a venue for my dance recital was a nightmare until I used the 'Events' tab. I connected with a theater owner and sold out my first show!",
        rating: 5,
        gradient: "from-purple-500 to-pink-500"
    },
    {
        id: 3,
        name: "Arjun Verma",
        role: "Abstract Painter",
        location: "Bangalore, IN",
        image: user3,
        impact: "Auctioned 3 Paintings",
        impactIcon: Gavel,
        roleIcon: Palette,
        text: "I used to just post art on social media with no sales. Artify's Marketplace helped me connect with serious collectors who actually bought my canvas work.",
        rating: 5,
        gradient: "from-emerald-500 to-teal-500"
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-black relative overflow-hidden">

            <div className="absolute inset-0 pointer-events-none">

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]"></div>

                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px]"></div>

                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

                <div className="mb-20 text-center md:text-left relative">
                    <div className="hidden md:block absolute -left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>

                    <h2 className="text-4xl md:text-6xl font-bold text-white font-playfair mb-6 leading-tight">
                        Voices of the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                            Creative Revolution
                        </span>
                    </h2>
                    <p className="text-white/50 text-lg font-poppins max-w-2xl mx-auto md:mx-0">
                        Real stories from artists—Musicians, Dancers, and Painters—who are shaping their careers with Artify.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((item) => (
                        <div key={item.id} className="group relative">

                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.gradient} rounded-[2rem] opacity-20 group-hover:opacity-100 blur transition duration-500`}></div>

                            <div className="relative h-full bg-[#080808] rounded-[2rem] p-8 md:p-10 flex flex-col justify-between border border-white/5 group-hover:-translate-y-2 transition-transform duration-500 overflow-hidden">

                                <Quote className="absolute top-6 right-8 text-white/[0.03] w-24 h-24 -rotate-12 group-hover:text-white/[0.08] transition-colors duration-500" />

                                <div>
                                    <div className="inline-block mb-8 relative z-10">
                                        <div className="pl-2 pr-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 shadow-lg group-hover:bg-white/10 transition-colors">
                                            <div className={`w-7 h-7 rounded-full bg-gradient-to-r ${item.gradient} flex items-center justify-center shadow-inner`}>
                                                <item.impactIcon size={14} className="text-white" />
                                            </div>
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-white/90">
                                                {item.impact}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-white/80 text-lg md:text-xl font-light leading-relaxed mb-8 font-playfair relative z-10">
                                        "{item.text}"
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-6 border-t border-white/5 relative z-10">
                                    <div className="relative w-12 h-12 flex-shrink-0">
                                        <div className="w-full h-full rounded-full overflow-hidden border border-white/20 group-hover:border-white/50 transition-colors">
                                            <ImageWithFallback
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="text-white font-bold text-base font-sans truncate">{item.name}</h4>
                                            <CheckCircle2 size={14} className="text-blue-500 fill-blue-500/10" />
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs text-white/40 font-poppins uppercase tracking-wide mt-0.5">
                                            <item.roleIcon size={12} className="text-indigo-400" />
                                            <span className="truncate">{item.role}</span>
                                        </div>
                                    </div>

                                    <div className="ml-auto flex gap-0.5 flex-shrink-0">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={12}
                                                className={`${i < item.rating ? "text-yellow-400 fill-yellow-400" : "text-white/10 fill-white/10"}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}