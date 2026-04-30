import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight, MessageSquare, Bookmark, Wallet, Ticket } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import eventImg from '../../assets/Images/Events/image1.jpeg';

const Sidebar = ({ categories, activeCategory, setActiveCategory, setSearchQuery }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleSpaceClick = (itemPath) => {
        navigate(itemPath);
    };

    const spaceItems = [
        { name: 'Messages', icon: MessageSquare, path: '/messages' },
        { name: 'Saved Collections', icon: Bookmark, path: '/saved' },
        { name: 'Wallet', icon: Wallet, path: '/wallet' }
    ];

    return (
        <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0 z-40">
            <div className="sticky top-24 space-y-6">

                <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 shadow-2xl relative overflow-hidden">
                    {/* 🌟 FIX 1: 'pointer-events-none' add kiya taaki ye clicks block na kare */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none"></div>

                    {/* Categories Section */}
                    <div className="mb-8 relative z-10">
                        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 px-3">Discover</h3>
                        <div className="space-y-1">
                            {categories.map((cat, i) => {
                                const isActive = activeCategory === cat.name;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => { setActiveCategory(cat.name); setSearchQuery(""); }}
                                        className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-white/5 text-white' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
                                    >
                                        {isActive && <motion.div layoutId="activeNav" className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-amber-400 to-orange-500 rounded-r-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />}
                                        <cat.icon size={18} className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-amber-500 drop-shadow-md' : 'group-hover:text-amber-400'}`} />
                                        <span className="relative z-10 text-sm font-medium tracking-wide">{cat.name}</span>
                                        <div className="absolute right-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"><ChevronRight size={14} className="text-white/30" /></div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {/* 🌟 Your Space (FIX 2: 'relative z-10' add kiya taaki ye background ke upar aaye) */}
                    <div className="relative z-10">
                        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 px-3">Your Space</h3>
                        <div className="space-y-1">
                            {spaceItems.map((item, i) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleSpaceClick(item.path)}
                                        className={`w-full flex items-center gap-4 px-4 py-2.5 rounded-xl transition-all group cursor-pointer ${isActive ? 'bg-white/20 text-white shadow-md' : 'text-white/50 hover:text-white hover:bg-white/10 hover:shadow-sm'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                                            <item.icon size={16} />
                                        </div>
                                        <span className="text-sm font-medium">{item.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Event Card */}
                <div onClick={() => navigate('/events')} className="relative group cursor-pointer">
                    <div className="absolute -inset-1 bg-gradient-to-b from-amber-500 to-orange-600 rounded-[2rem] blur opacity-20 group-hover:opacity-50 transition duration-500"></div>

                    <div className="relative bg-[#0F0F0F] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col">
                        <div className="relative h-36 overflow-hidden">
                            <img
                                src={eventImg}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                alt="Royal Stag BoomBox 2026"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-black/20 to-transparent pointer-events-none"></div>

                            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-center shadow-xl">
                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1">UPCOMING</p>
                                <p className="text-xl font-black text-white leading-none">2026</p>
                            </div>
                        </div>

                        <div className="px-5 pb-5 pt-3 relative bg-[#0F0F0F] z-10">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="text-lg font-black text-white leading-tight group-hover:text-amber-400 transition-colors">BoomBox 2026 Tour</h4>
                                    <p className="text-xs text-white/50 font-medium mt-1 line-clamp-1">Badshah, Armaan Malik, Divine</p>
                                    <p className="text-[10px] text-white/40 mt-0.5">Kolkata, Vizag, Mumbai</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-lg text-xs font-bold text-amber-400">
                                    ₹1499+
                                </div>
                            </div>
                            <div className="w-full border-t-2 border-dashed border-white/10 my-5 relative">
                                <div className="absolute -left-7 -top-2 w-4 h-4 bg-[#050505] rounded-full border-r border-white/10"></div>
                                <div className="absolute -right-7 -top-2 w-4 h-4 bg-[#050505] rounded-full border-l border-white/10"></div>
                            </div>
                            <button className="w-full py-3.5 rounded-xl bg-amber-500 text-black text-xs font-black uppercase tracking-widest hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                                <Ticket size={16} /> Get Tickets
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </aside>
    );
};

export default Sidebar;
