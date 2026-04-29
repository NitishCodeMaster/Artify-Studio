import React from 'react';
import { Sparkles, Zap, Music, Star, ArrowRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CTA() {
    const navigate = useNavigate();

    return (
        <section className="py-20 bg-black relative overflow-hidden">

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000"></div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            <Music className="absolute bottom-20 right-10 md:right-40 text-blue-500/10 rotate-[12deg]" size={80} />
            <Star className="absolute top-20 left-10 md:left-40 text-pink-500/10 rotate-[-12deg]" size={80} />

            <div className="relative z-10 max-w-3xl mx-auto px-6">

                <div className="relative p-[1px] rounded-[2.8rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl">

                    <div className="bg-[#050505] rounded-[2.7rem] px-6 py-10 md:px-10 md:py-14 text-center relative overflow-hidden">

                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-gradient-to-b from-white/5 to-transparent blur-3xl pointer-events-none"></div>
                        <div className="absolute inset-y-8 left-8 hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block"></div>
                        <div className="absolute inset-y-8 right-8 hidden w-px bg-gradient-to-b from-transparent via-white/10 to-transparent lg:block"></div>

                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.45 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md hover:bg-white/10 transition-colors cursor-default"
                        >
                            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold text-white/80 tracking-widest uppercase font-poppins">
                                Join 50,000+ Creators
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.45 }}
                            transition={{ duration: 0.5, delay: 0.05 }}
                            className="text-3xl md:text-5xl font-bold text-white font-playfair mb-5 leading-tight"
                        >
                            Create, Learn & <br />
                            <span className="relative inline-block">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                                    Trade Your Gear
                                </span>
                                <Sparkles className="absolute -top-5 -right-8 text-yellow-400 w-6 h-6 animate-bounce" />
                            </span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.45 }}
                            transition={{ duration: 0.5, delay: 0.12 }}
                            className="text-white/60 text-base md:text-lg font-light font-poppins max-w-xl mx-auto mb-8 leading-relaxed"
                        >
                            Join the ultimate creative ecosystem. Showcase your talent, connect with mentors,
                            and <b>buy or sell instruments</b> directly with other artists.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.45 }}
                            transition={{ duration: 0.5, delay: 0.18 }}
                            className="mb-8 grid gap-3 sm:grid-cols-3 max-w-2xl mx-auto"
                        >
                            {[
                                { label: 'Share Work', icon: Sparkles },
                                { label: 'Find Artists', icon: Users },
                                { label: 'Trade Gear', icon: Music },
                            ].map((item) => (
                                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/75 flex items-center justify-center gap-2 backdrop-blur-md">
                                    <item.icon size={14} className="text-indigo-300" />
                                    <span>{item.label}</span>
                                </div>
                            ))}
                        </motion.div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => navigate('/community')}
                                className="group min-w-[200px] px-8 py-3.5 rounded-full bg-white text-black font-bold text-base hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                Join Community
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/marketplace')}
                                className="min-w-[200px] px-8 py-3.5 rounded-full border border-white/15 bg-white/[0.04] text-white font-bold text-base hover:bg-white/[0.08] hover:border-white/25 transition-all duration-300"
                            >
                                Explore Marketplace
                            </button>
                        </div>

                        <p className="text-white/40 text-xs mt-4">
                            Free to join • Built for artists
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
