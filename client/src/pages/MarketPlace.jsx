import { useState } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer'; 
import MarketHero from '../components/MarketPlace/MarketHero';
import ProductCard from '../components/MarketPlace/ProductCard';
import { products } from '../Data/MarketData';

const categories = [
    { id: 'all', label: 'All Collection' },
    { id: 'gear', label: 'Vintage Gear' },
    { id: 'tribal', label: 'Tribal Artifacts' },
    { id: 'digital', label: 'Studio Assets' },
];

const Marketplace = () => {
    const [activeCategory, setActiveCategory] = useState('all');

    const filteredProducts = activeCategory === 'all'
        ? products
        : products.filter(p => p.category === activeCategory);

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-indigo-500/30">
            <Navbar />
            <MarketHero />

            <div className="max-w-[1280px] mx-auto px-6 pb-20">

                {/* 1. Elegant Tab Switcher */}
                <div className="flex justify-center mb-12 mt-5">
                    <div className="bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md inline-flex">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-300 ${activeCategory === cat.id
                                        ? 'bg-white text-black shadow-lg'
                                        : 'text-white/50 hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
 
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
 
                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center border border-dashed border-white/10 rounded-2xl">
                        <p className="text-white/40">No items available in this category.</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Marketplace;