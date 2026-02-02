import React, { useState } from 'react';
import { Layers, Music, Palette, Zap, Disc, Camera } from 'lucide-react';
import { Footer } from '../components/Footer';

import HeroSection from '../components/Discover/HeroSection';
import Sidebar from '../components/Discover/SideBar';
import ContentFeed from '../components/Discover/ContentFeed';

const categories = [
    { name: "All", icon: Layers, color: "text-white" },
    { name: "Musicians", icon: Music, color: "text-indigo-400" },
    { name: "Visual Artists", icon: Palette, color: "text-pink-400" },
    { name: "Performers", icon: Zap, color: "text-yellow-400" },
    { name: "Photographers", icon: Camera, color: "text-emerald-400" },
    { name: "Gear Trading", icon: Disc, color: "text-red-400" },
];

const Discover = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <main className="bg-[#050505] min-h-screen text-white w-full font-sans selection:bg-indigo-500/30">
             <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12 relative z-20">
                 <Sidebar
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    setSearchQuery={setSearchQuery}
                />

                 <ContentFeed
                    activeCategory={activeCategory}
                    searchQuery={searchQuery}
                    setActiveCategory={setActiveCategory}
                />
            </div>

            <Footer />
        </main>
    );
};

export default Discover;