import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import img2 from '../../assets/Images/PerformerPanel/image2.jpeg';

const Sidebar = ({ categories, activeCategory, setActiveCategory, setSearchQuery }) => {
    return (
        <aside className="hidden lg:block w-72 flex-shrink-0 z-40">
            <div className="sticky top-28 space-y-8">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-5 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_50%)]"></div>

                    <div className="mb-6">
                        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 px-3">Discover</h3>
                        <div className="space-y-1">
                            {categories.map((cat, i) => {
                                const isActive = activeCategory === cat.name;
                                return (
                                    <button key={i} onClick={() => { setActiveCategory(cat.name); setSearchQuery(""); }} className={`relative w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive ? 'bg-white/5 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
                                        {isActive && <motion.div layoutId="activeNav" className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.5)]" />}
                                        <cat.icon size={18} className={`relative z-10 transition-colors duration-300 ${isActive ? 'text-white drop-shadow-md' : 'group-hover:text-indigo-300'}`} />
                                        <span className="relative z-10 text-sm font-medium tracking-wide">{cat.name}</span>
                                        <div className="absolute right-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"><ChevronRight size={14} className="text-white/30" /></div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] mb-4 px-3">Your Space</h3>
                        <div className="space-y-1">
                            {['Messages', 'Saved Collections', 'Wallet'].map((item, i) => (
                                <button key={i} className="w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all group">
                                    <div className="w-4 h-4 rounded-full border border-white/20 group-hover:border-indigo-400 transition-colors"></div>
                                    <span className="text-sm font-medium">{item}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                 <div className="relative group cursor-pointer perspective-1000">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-[2rem] blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
                    <div className="relative bg-[#0F0F0F] border border-white/10 rounded-[2rem] p-1 overflow-hidden">
                        <div className="relative h-32 rounded-[1.8rem] overflow-hidden mb-2">
                            <img src={img2} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="event" />
                            <div className="absolute inset-0 bg-black/40"></div>
                            <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/20"><span className="text-[10px] font-bold text-white uppercase tracking-wider">Tomorrow</span></div>
                        </div>
                        <div className="px-4 pb-4 pt-1">
                            <div className="flex justify-between items-start mb-2">
                                <div><h4 className="text-lg font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">Indie Fest '25</h4><p className="text-xs text-white/50">Mumbai Arena</p></div>
                                <div className="bg-indigo-600 px-2 py-1 rounded-lg text-xs font-bold text-white shadow-lg shadow-indigo-900/50">₹999</div>
                            </div>
                            <div className="w-full border-t border-dashed border-white/10 my-3 relative"><div className="absolute -left-5 -top-1.5 w-3 h-3 bg-[#050505] rounded-full"></div><div className="absolute -right-5 -top-1.5 w-3 h-3 bg-[#050505] rounded-full"></div></div>
                            <button className="w-full py-2.5 rounded-xl bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">Get Tickets <ArrowRight size={12} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;