import React, { useState } from 'react';
import { Layers, Music, Palette, Star, Camera, Calendar } from 'lucide-react';
import { Footer } from '../components/Footer';

import HeroSection from '../components/Discover/HeroSection';
import Sidebar from '../components/Discover/SideBar';
import ContentFeed from '../components/Discover/ContentFeed';

const categories = [
    { name: 'All', icon: Layers },
    { name: 'Painters & Crafters', icon: Palette },
    { name: 'Musicians & Singers', icon: Music },
    { name: 'Dancers & Actors', icon: Star },
    { name: 'Photographers & Video', icon: Camera },
    { name: 'Event Organizers', icon: Calendar }
];

const Discover = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <main className="bg-[#050505] min-h-screen text-white w-full font-sans selection:bg-indigo-500/30">
            <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <div className="max-w-[1680px] mx-auto px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 relative z-20">
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
