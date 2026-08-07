import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { footerData } from '../Data/FooterData';
import { Send, ShieldCheck, Heart, Sparkles, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Footer = () => {
    const [email, setEmail] = useState('');
    const currentYear = new Date().getFullYear();

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            toast.success("Welcome to the Artify Insider community! 🎨");
            setEmail('');
        }
    };

    return (
        <footer className="bg-[#050508] border-t border-white/10 pt-16 pb-8 relative overflow-hidden text-white font-sans">
            {/* Background Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-b from-indigo-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
                {/* Top Section: High-Impact Newsletter Banner */}
                <div className="relative rounded-3xl p-8 md:p-10 border border-white/10 bg-gradient-to-r from-white/[0.03] via-indigo-500/[0.04] to-purple-500/[0.03] backdrop-blur-2xl shadow-2xl overflow-hidden">
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
                        <div className="space-y-2 text-center lg:text-left max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest">
                                <Sparkles size={12} /> Empowering 50,000+ Artists & Organizers
                            </div>
                            <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                                Stay Tuned for Live Gigs & Exclusive Art Drops.
                            </h3>
                            <p className="text-white/50 text-xs md:text-sm leading-relaxed">
                                Get instant notifications about local cafe gigs, ticket sales, live workshops, and marketplace deals.
                            </p>
                        </div>

                        <form onSubmit={handleSubscribe} className="relative w-full max-w-md">
                            <div className="flex items-center bg-black/60 border border-white/15 focus-within:border-indigo-500 rounded-2xl p-1.5 shadow-2xl transition-all">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your artist email address..."
                                    className="w-full bg-transparent px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition-all shrink-0 active:scale-95"
                                >
                                    <span>Subscribe</span>
                                    <Send size={13} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-4">
                    {/* Brand Column (Span 2) */}
                    <div className="lg:col-span-2 space-y-5">
                        <Link to="/" className="group flex items-center gap-3 w-fit">
                            <div className="relative w-11 h-11">
                                <div className="absolute inset-0 bg-indigo-500 blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
                                <div className="relative w-full h-full bg-black border border-white/15 rounded-2xl flex items-center justify-center overflow-hidden shadow-xl">
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-indigo-500/30 via-purple-500/10 to-transparent" />
                                    <span className="relative z-10 font-black text-2xl text-white tracking-tighter">A</span>
                                </div>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-xl font-black tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                                    ARTIFY
                                </span>
                                <span className="text-[9px] text-indigo-400 font-extrabold tracking-[0.3em] uppercase opacity-90">
                                    Studio Hub
                                </span>
                            </div>
                        </Link>

                        <p className="text-white/50 text-xs leading-relaxed max-w-md">
                            Artify Studio is India’s premier artist platform connecting live performers, cafe organizers, visual creators, and art collectors in one unified ecosystem.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-2">
                            {footerData.socials.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: social.color }}
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all shadow-md group"
                                >
                                    {React.cloneElement(social.icon, { size: 18, className: "group-hover:scale-110 transition-transform" })}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div>
                        <h4 className="text-white font-extrabold mb-4 uppercase tracking-[0.2em] text-[11px] text-indigo-400">
                            Explore Platform
                        </h4>
                        <ul className="space-y-2.5">
                            {footerData.quickLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.path}
                                        className="text-white/60 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-indigo-500/50 group-hover:w-2 group-hover:bg-indigo-400 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-extrabold mb-4 uppercase tracking-[0.2em] text-[11px] text-indigo-400">
                            Community & Support
                        </h4>
                        <ul className="space-y-2.5">
                            {footerData.support.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.path}
                                        className="text-white/60 hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5 group"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-purple-500/50 group-hover:w-2 group-hover:bg-purple-400 transition-all" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Location Card */}
                    <div className="bg-white/[0.02] border border-white/10 p-5 rounded-2xl space-y-3">
                        <h4 className="text-white font-extrabold uppercase tracking-[0.2em] text-[10px] text-white/40">
                            Headquarters
                        </h4>
                        <ul className="space-y-2.5">
                            {footerData.contact.map((item, i) => (
                                <li key={i} className="flex items-start gap-2.5 text-white/70 text-xs font-medium leading-tight">
                                    <span className="text-indigo-400 shrink-0 mt-0.5">{item.icon}</span>
                                    <span>{item.detail}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <p className="text-white/40 text-xs font-medium flex items-center gap-1.5 justify-center md:justify-start">
                        <span>© {currentYear} Artify Studio. All rights reserved. Concept by Nitish.</span>
                    </p>

                    <div className="flex items-center gap-6">
                        <span className="text-white/40 text-xs font-medium flex items-center gap-1">
                            <MapPin size={12} className="text-emerald-400" /> Made for Artists in India
                        </span>
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                            <ShieldCheck size={14} />
                            <span>SSL 256-Bit Secure</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};