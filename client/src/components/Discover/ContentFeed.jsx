import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, Frown, Filter, TrendingUp, MapPin, Award, ShieldCheck, Zap, Disc, Music, Camera } from 'lucide-react';
import { StandardCard, EventCard } from './Cards';

import img1 from '../../assets/Images/PerformerPanel/image1.jpeg';
import img2 from '../../assets/Images/PerformerPanel/image2.jpeg';
import img3 from '../../assets/Images/PerformerPanel/image3.jpeg';
import spot1 from '../../assets/Images/ArtistSpotlight/acoustic.jpeg';
import spot2 from '../../assets/Images/ArtistSpotlight/dancer.avif';
import spot3 from '../../assets/Images/ArtistSpotlight/painter.avif';

const bentoItems = [
    { id: 1, type: "artist", category: "Musicians", name: "Aarav Patel", role: "Guitarist", loc: "Mumbai", img: img1, rating: "4.9", price: "₹5k/hr" },
    { id: 2, type: "event", category: "Performers", name: "Neon Jazz Night", role: "Live at Blue Frog", loc: "Delhi", img: img2, date: "Tonight", time: "8:00 PM" },
    { id: 3, type: "artist", category: "Visual Artists", name: "Sneha Art", role: "Painter", loc: "Bangalore", img: spot3, rating: "5.0", price: "₹20k/art" },
    { id: 4, type: "gear", category: "Gear Trading", name: "Fender Strat", role: "Electric Guitar", loc: "Pune", img: spot1, rating: "New", price: "₹45,000" },
    { id: 5, type: "artist", category: "Performers", name: "Vikram Dance", role: "Choreographer", loc: "Mumbai", img: spot2, rating: "4.8", price: "₹2k/hr" },
    { id: 6, type: "artist", category: "Musicians", name: "Riya Sen", role: "Vocalist", loc: "Goa", img: img3, rating: "4.9", price: "₹8k/hr" },
    { id: 7, type: "artist", category: "Photographers", name: "Lens Magic", role: "Portrait", loc: "Chennai", img: spot1, rating: "4.6", price: "₹10k/shoot" },
    { id: 8, type: "event", category: "Musicians", name: "Drum Circle", role: "Workshop", loc: "Manali", img: img2, date: "Sat, 24th", time: "10:00 AM" },
];

const Section = ({ title, items, type = "standard", onSeeAll }) => {
    if (!items?.length) return null;
    return (
        <div className="mb-16">
            <div className="flex items-end justify-between mb-6 px-1">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
                        {title}
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                    </h3>
                </div>
                <button onClick={onSeeAll} className="text-xs font-bold uppercase tracking-wider text-white/40 hover:text-indigo-400 transition-colors flex items-center gap-1 group">
                    View All <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            <div className="flex gap-6 overflow-x-auto pb-8 -mx-2 px-2 no-scrollbar scroll-smooth snap-x snap-mandatory">
                {items.map(item => (
                    <div key={item.id} className="snap-center">
                        {type === "event" ? <EventCard item={item} /> : <StandardCard item={item} layoutMode="horizontal" />}
                    </div>
                ))}
            </div>
        </div>
    )
};

 const ContentFeed = ({ activeCategory, searchQuery, setActiveCategory }) => {
    const getCategoryItems = (cat) => bentoItems.filter(i => i.category === cat);
    const getEventItems = () => bentoItems.filter(i => i.type === "event");

    const renderContent = () => {
        if (searchQuery) {
            const results = bentoItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.role.toLowerCase().includes(searchQuery.toLowerCase()));
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {results.length > 0 ? results.map(i => <StandardCard key={i.id} item={i} />) : <div className="text-white/40 text-center py-20 col-span-full"><Frown size={32} className="mb-4 mx-auto opacity-50" /><h3 className="text-lg font-bold text-white">No matches found</h3></div>}
                </div>
            )
        }

         if (activeCategory === "All") {
            return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-12">

                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {[
                            { label: "Trending", icon: TrendingUp, color: "text-orange-400", border: "group-hover:border-orange-500/50" },
                            { label: "New Arrivals", icon: Sparkles, color: "text-cyan-400", border: "group-hover:border-cyan-500/50" },
                            { label: "Near You", icon: MapPin, color: "text-emerald-400", border: "group-hover:border-emerald-500/50" },
                            { label: "Top Rated", icon: Award, color: "text-yellow-400", border: "group-hover:border-yellow-500/50" },
                            { label: "Verified", icon: ShieldCheck, color: "text-purple-400", border: "group-hover:border-purple-500/50" },
                        ].map((tag, i) => (
                            <button key={i} className={`group flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#121212] border border-white/5 transition-all duration-300 hover:bg-[#1A1A1A] ${tag.border}`}>
                                <tag.icon size={14} className={`text-white/40 transition-colors duration-300 ${tag.color.replace('text-', 'group-hover:text-')}`} />
                                <span className="text-xs font-bold text-white/60 group-hover:text-white uppercase tracking-wider">{tag.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full h-[400px] md:h-[350px] rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/10 shadow-2xl">
                        <img src={img1} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Spotlight" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>

                        {/* Content */}
                        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-center max-w-2xl">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white">Editor's Pick</span>
                                <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest"><Zap size={12} fill="currentColor" /> Trending Now</span>
                            </motion.div>

                            <h2 className="text-4xl md:text-6xl font-bold font-playfair text-white mb-6 leading-tight drop-shadow-lg">
                                The Sound of <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 italic">Silence</span>
                            </h2>

                            <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-md">
                                Join Aarav Patel for an exclusive acoustic session. A journey through rhythm, soul, and pure musical excellence.
                            </p>

                            <div className="flex gap-4">
                                <button className="px-8 py-3.5 bg-white text-black rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                    View Profile
                                </button>
                                <button className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-black/20 backdrop-blur-md hover:bg-white hover:text-black transition-all">
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Section title="Live Events & Gigs" items={getEventItems()} type="event" />
                        <Section title="Trending Musicians" items={getCategoryItems("Musicians")} onSeeAll={() => setActiveCategory("Musicians")} />
                        <Section title="Visual Arts Gallery" items={getCategoryItems("Visual Artists")} onSeeAll={() => setActiveCategory("Visual Artists")} />
                        <Section title="Gear Trading" items={getCategoryItems("Gear Trading")} onSeeAll={() => setActiveCategory("Gear Trading")} />
                    </div>

                </motion.div>
            )
        }

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {getCategoryItems(activeCategory).length > 0 ? getCategoryItems(activeCategory).map(item => <StandardCard key={item.id} item={item} />) : <div className="col-span-full py-20 flex flex-col items-center justify-center text-center text-white/40"><Frown size={32} className="mb-4 opacity-50" /><h3 className="text-lg font-bold text-white">No results in {activeCategory}</h3></div>}
            </motion.div>
        )
    };

    return (
        <div className="flex-1 min-h-[800px] relative">

            <div className="flex items-end justify-between mb-10 pb-6 border-b border-white/5 relative">
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-600/10 blur-[100px] pointer-events-none"></div>

                <div className="relative z-10">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        {activeCategory === "All" ? <><Sparkles size={12} /> Discover</> : activeCategory}
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold font-playfair text-white tracking-tight">
                        {searchQuery ? `"${searchQuery}"` : (activeCategory === "All" ? "The Spotlight" : activeCategory)}
                    </h2>
                </div>

                {!searchQuery && activeCategory !== "All" && (
                    <button className="relative z-10 flex items-center gap-2 px-5 py-2.5 bg-[#111] hover:bg-indigo-600 border border-white/10 hover:border-indigo-500/50 rounded-xl text-xs font-bold text-white/80 hover:text-white transition-all shadow-lg">
                        <Filter size={14} /> <span>Filter</span>
                    </button>
                )}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory + searchQuery}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default ContentFeed;