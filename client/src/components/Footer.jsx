import { Link } from "react-router-dom";
import {
    Instagram,
    Twitter,
    Facebook,
    Youtube,
    Mail,
    MapPin,
    ArrowRight,
    Heart
} from "lucide-react";

export function Footer() {
    const socialLinks = [
        { icon: Instagram, href: "#", colorClass: "hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500" },
        { icon: Twitter, href: "#", colorClass: "hover:bg-[#1DA1F2]" },
        { icon: Youtube, href: "#", colorClass: "hover:bg-[#FF0000]" },
        { icon: Facebook, href: "#", colorClass: "hover:bg-[#4267B2]" },
    ];

    return (
        <footer className="relative bg-[#050505] text-white overflow-hidden border-t border-white/5 pt-12 pb-6 font-sans">
            {/* Minimal Background Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px]" />
            </div>
            

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12 mb-10">
                    {/* Brand Section */}
                    <div className="lg:col-span-4 space-y-4">
                        <Link to="/" className="group relative z-50 flex items-center gap-3">
                            <div className="relative w-10 h-10">
                                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                                <div className="relative w-full h-full bg-black border border-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-indigo-500 via-purple-500 to-transparent opacity-50"></div>
                                    <span className="relative z-10 font-black text-xl text-white">A</span>
                                </div>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-xl font-bold tracking-wide text-white">
                                    ARTIFY
                                </span>
                                <span className="text-[9px] text-indigo-400 tracking-[0.2em] uppercase">
                                    Studio
                                </span>
                            </div>
                        </Link>
                        <p className="text-white/50 text-xs max-w-xs">
                            The digital ecosystem for talent, culture, and commerce.
                        </p>
                        <div className="flex gap-2">
                            {socialLinks.map((social, i) => (
                                <a key={i} href={social.href} className={`w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 transition-all hover:text-white ${social.colorClass} hover:border-transparent`}>
                                    <social.icon size={14} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links - Merged & Simplified */}
                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-bold mb-4 uppercase tracking-wider text-indigo-400">Company</h4>
                        <ul className="space-y-2 text-xs text-white/50">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Marketplace</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Live Events</a></li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="text-xs font-bold mb-4 uppercase tracking-wider text-indigo-400">Support</h4>
                        <ul className="space-y-2 text-xs text-white/50">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                        </ul>
                    </div>

                    {/* Compact Newsletter */}
                    <div className="lg:col-span-4 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Newsletter</h4>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs focus:outline-none focus:border-indigo-500/50 transition-colors"
                            />
                            <button className="absolute right-1 top-1 p-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-colors">
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-white/30 border-t border-white/5 pt-6">
                    <p>&copy; {new Date().getFullYear()} Artify Studio.</p>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <Mail size={10} /> support@artify.studio
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin size={10} /> Mumbai, India
                        </span>
                        <div className="flex items-center gap-1">
                            Made with <Heart size={10} className="text-red-500 fill-red-500" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}