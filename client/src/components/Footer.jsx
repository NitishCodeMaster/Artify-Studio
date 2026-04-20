import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { footerData } from '../Data/FooterData';
import { Send, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Footer = () => {
    const [email, setEmail] = useState('');
    const currentYear = new Date().getFullYear();

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            toast.success("Welcome to the community! 🎨");
            setEmail('');
        }
    };

    return (
        <footer className="bg-[#050505] border-t border-white/5 pt-10 pb-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex flex-col lg:flex-row justify-between items-center pb-8 border-b border-white/5 mb-8 gap-6">
                    <div className="text-center lg:text-left">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-1">
                            Newsletter
                        </h3>
                        <p className="text-lg font-bold text-white leading-none">Join Artify Insider.</p>
                        <p className="text-white/40 text-xs font-medium mt-1">Get early access to live gigs and artist stories.</p>
                    </div>
                    <form onSubmit={handleSubscribe} className="relative w-full max-w-sm group">
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your email..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white focus:outline-none focus:border-indigo-500/50 text-xs transition-all"
                        />
                        <button type="submit" className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center transition-colors">
                            <Send size={14} />
                        </button>
                    </form>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-10 items-start">

                    <div className="col-span-2 md:col-span-1 space-y-6">
                        <Link to="/" className="group flex items-center gap-3 w-fit">
                            <div className="relative w-10 h-10">
                                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-50 transition-opacity"></div>

                                <div className="relative w-full h-full bg-black border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-indigo-500/30 via-purple-500/10 to-transparent"></div>
                                    <span className="relative z-10 font-black text-xl text-white tracking-tighter">A</span>
                                </div>
                            </div>

                            <div className="flex flex-col leading-[0.8]">
                                <span className="text-lg font-black tracking-tighter text-white group-hover:tracking-widest transition-all ease-in-out duration-500">
                                    ARTIFY
                                </span>
                                <span className="text-[8px] text-indigo-400 font-bold tracking-[0.3em] uppercase opacity-80">
                                    Studio
                                </span>
                            </div>
                        </Link>

                        <div className="flex gap-2.5">
                            {footerData.socials.map((social, i) => (
                                <a
                                    key={i}
                                    href={social.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: social.color }}
                                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5"
                                >
                                    {React.cloneElement(social.icon, { size: 16 })}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="md:pl-6">
                        <h4 className="text-white font-black mb-4 uppercase tracking-[0.2em] text-[10px] opacity-50">Explore</h4>
                        <ul className="space-y-2.5">
                            {footerData.quickLinks.map((link, i) => (
                                <li key={i}>
                                    <Link to={link.path} className="text-white/40 hover:text-indigo-400 transition-colors text-xs font-semibold">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black mb-4 uppercase tracking-[0.2em] text-[10px] opacity-50">Support</h4>
                        <ul className="space-y-2.5">
                            {footerData.support.map((link, i) => (
                                <li key={i}>
                                    <Link to={link.path} className="text-white/40 hover:text-indigo-400 transition-colors text-xs font-semibold">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="p-5 bg-white/5 rounded-2xl border border-white/5">
                        <h4 className="text-white font-black mb-4 uppercase tracking-[0.2em] text-[10px] opacity-50">Contact</h4>
                        <ul className="space-y-3">
                            {footerData.contact.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-white/40 text-[10px] font-medium leading-tight">
                                    <span className="text-indigo-500">{item.icon}</span>
                                    {item.detail}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center">
                    <p className="text-white/10 text-[8px] font-black uppercase tracking-[0.4em]">
                        © {currentYear} Artify Studio — Concept by Nitish
                    </p>
                    <div className="flex items-center gap-2 text-white/10">
                        <ShieldCheck size={12} />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Secure Platform</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};