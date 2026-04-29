import React, { useEffect, useMemo, useState } from 'react';
import {
    Heart, ShoppingCart, Tag, Store, Music, Hammer, BookOpen, Palette,
    Guitar, Sparkles, Search, Mic2, ArrowRight, Speaker, VenetianMask
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';

import imgMadhubani from '../../assets/Images/MarketPlace/image1.jpg';
import imgWoodInst from '../../assets/Images/MarketPlace/image2.png';
import imgGuitar from '../../assets/Images/MarketPlace/image3.avif';
import imgDrum from '../../assets/Images/MarketPlace/image4.jpeg';
import imgWoodPanel from '../../assets/Images/MarketPlace/image5.png';
import imgMemoryFrame from '../../assets/Images/MarketPlace/image6.png';

const fallbackImages = [imgMadhubani, imgWoodInst, imgGuitar, imgDrum, imgWoodPanel, imgMemoryFrame];

const categoryStyles = [
    {
        match: ['art', 'madhubani', 'folk'],
        icon: Palette,
        color: 'from-yellow-500 via-orange-500 to-red-500',
        borderColor: 'group-hover:border-orange-500/50',
        shadowColor: 'group-hover:shadow-orange-500/20',
        tagColor: 'yellow',
    },
    {
        match: ['guitar', 'music', 'electric'],
        icon: Guitar,
        color: 'from-blue-500 via-indigo-500 to-violet-500',
        borderColor: 'group-hover:border-blue-500/50',
        shadowColor: 'group-hover:shadow-blue-500/20',
        tagColor: 'blue',
    },
    {
        match: ['percussion', 'drum'],
        icon: Music,
        color: 'from-purple-500 via-fuchsia-500 to-pink-500',
        borderColor: 'group-hover:border-purple-500/50',
        shadowColor: 'group-hover:shadow-purple-500/20',
        tagColor: 'blue',
    },
    {
        match: ['wood', 'flute', 'craft'],
        icon: Hammer,
        color: 'from-emerald-500 via-green-500 to-teal-500',
        borderColor: 'group-hover:border-emerald-500/50',
        shadowColor: 'group-hover:shadow-emerald-500/20',
        tagColor: 'green',
    },
];

const getCategoryTheme = (category = '') => {
    const key = category.toLowerCase();
    return categoryStyles.find((item) => item.match.some((word) => key.includes(word))) || {
        icon: BookOpen,
        color: 'from-rose-500 via-pink-500 to-red-500',
        borderColor: 'group-hover:border-rose-500/50',
        shadowColor: 'group-hover:shadow-rose-500/20',
        tagColor: 'orange',
    };
};

const formatPrice = (price) => `₹${Number(price || 0).toLocaleString()}`;

const MarketSkeleton = () => (
    <div className="rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-3 animate-pulse">
        <div className="h-64 rounded-[1.5rem] bg-white/[0.04]" />
        <div className="space-y-4 px-3 pb-3 pt-5">
            <div className="h-6 w-2/3 rounded bg-white/10" />
            <div className="h-14 w-full rounded bg-white/10" />
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="h-4 w-28 rounded bg-white/10" />
                <div className="h-10 w-10 rounded-full bg-white/10" />
            </div>
        </div>
    </div>
);

export default function MarketPlace() {
    const navigate = useNavigate();
    const [likedItems, setLikedItems] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products/all');
                const incoming = res.data.products || [];

                const normalized = incoming.slice(0, 6).map((item, index) => {
                    const theme = getCategoryTheme(item.category);

                    return {
                        id: item._id,
                        _id: item._id,
                        name: item.name,
                        price: formatPrice(item.price),
                        originalPrice: item.originalPrice ? formatPrice(item.originalPrice) : null,
                        seller: 'Artify Seller',
                        category: item.category,
                        condition: item.condition || 'Available Now',
                        description: item.description,
                        image: item.images?.[0]?.url || fallbackImages[index % fallbackImages.length],
                        ...theme,
                    };
                });

                setItems(normalized);
            } catch (error) {
                console.error('Failed to load home marketplace:', error);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const toggleLike = (index) => {
        setLikedItems((prev) => (
            prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
        ));
    };

    const visibleItems = useMemo(() => items, [items]);

    return (
        <section id="marketplace" className="relative w-full overflow-hidden bg-black pb-12 pt-12">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute left-1/2 top-1/3 h-[500px] w-[900px] -translate-x-1/2 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 blur-[160px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

                <Music className="absolute bottom-[10%] left-[5%] -rotate-12 text-white/5" size={150} strokeWidth={0.5} />
                <VenetianMask className="absolute right-[10%] top-[7%] rotate-12 text-white/5" size={180} strokeWidth={0.5} />
                <Speaker className="absolute bottom-[20%] right-[5%] -rotate-[15deg] text-white/5" size={200} strokeWidth={0.5} />
                <Mic2 className="absolute left-[40%] top-[6%] rotate-[8deg] text-white/5" size={120} strokeWidth={0.5} />
                <Palette className="absolute bottom-[30%] left-[20%] -rotate-6 text-white/5" size={80} strokeWidth={0.5} />

                <div className="absolute right-20 top-20 h-64 w-64 rounded-full bg-purple-900/20 blur-[80px]" />
                <div className="absolute bottom-20 left-10 h-80 w-80 rounded-full bg-orange-900/10 blur-[100px]" />
                <Sparkles className="absolute left-1/3 top-14 animate-pulse text-pink-500" size={30} />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.55 }}
                    className="mb-16 flex flex-col gap-8 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between"
                >
                    <div className="max-w-2xl">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-md">
                            <Store size={14} className="text-yellow-500" />
                            <span className="text-xs font-bold uppercase tracking-widest text-yellow-500">The Creator's Marketplace</span>
                        </div>
                        <h2 className="font-playfair text-4xl font-bold leading-snug text-white md:text-5xl md:leading-tight">
                            Trade Used Gear & <br />
                            <motion.span
                                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="bg-[length:200%_200%] bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent italic"
                            >
                                Authentic Folk Art
                            </motion.span>
                        </h2>
                        <p className="mt-4 max-w-lg font-poppins text-sm text-white/50 md:text-base">
                            The perfect place to upgrade your studio. Buy and sell pre-loved instruments, recording gear, and handmade crafts from fellow artists.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/marketplace')}
                            className="group flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-6 py-3 font-bold text-white transition-all hover:-translate-y-1 hover:bg-white/10"
                        >
                            <Search size={18} className="text-white/70" />
                            Explore Market
                        </button>

                        <button
                            onClick={() => navigate('/add-product')}
                            className="group flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-black transition-all hover:-translate-y-1 hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                        >
                            Sell Gear & Art
                            <Tag size={18} className="transition-transform group-hover:rotate-12" />
                        </button>
                    </div>
                </motion.div>

                <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-3">
                    {loading && [1, 2, 3, 4, 5, 6].map((item) => <MarketSkeleton key={item} />)}

                    {!loading && visibleItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.45, delay: index * 0.07 }}
                            whileHover={{ y: -6 }}
                            className={`group relative flex h-full flex-col rounded-[2rem] border border-white/10 bg-[#0a0a0a] p-3 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${item.borderColor} ${item.shadowColor}`}
                        >
                            <div className={`pointer-events-none absolute inset-0 rounded-[2rem] bg-gradient-to-br ${item.color} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-5`} />

                            <div className="relative h-64 shrink-0 overflow-hidden rounded-[1.5rem] bg-gray-900">
                                <motion.div
                                    animate={{ scale: [1, 1.04, 1] }}
                                    transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: index * 0.2 }}
                                    className="absolute inset-0"
                                >
                                    <ImageWithFallback
                                        src={item.image}
                                        alt={item.name}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </motion.div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                                <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-white backdrop-blur-md">
                                    <item.icon size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">{item.category}</span>
                                </div>

                                <button
                                    onClick={() => toggleLike(index)}
                                    className="absolute right-3 top-3 z-20 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 text-white transition-all hover:border-red-500 hover:bg-red-500 backdrop-blur-md"
                                >
                                    <Heart size={14} className={likedItems.includes(index) ? 'fill-white text-white' : 'text-white'} />
                                </button>

                                <div className="absolute bottom-3 left-3">
                                    <span className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[10px] font-bold backdrop-blur-md
                                        ${item.tagColor === 'yellow' ? 'border-yellow-500/30 bg-yellow-500/25 text-yellow-200' : ''}
                                        ${item.tagColor === 'blue' ? 'border-blue-500/30 bg-blue-500/25 text-blue-200' : ''}
                                        ${item.tagColor === 'green' ? 'border-emerald-500/30 bg-emerald-500/25 text-emerald-200' : ''}
                                        ${item.tagColor === 'orange' ? 'border-orange-500/30 bg-orange-500/25 text-orange-200' : ''}
                                    `}>
                                        <Tag size={10} />
                                        {item.condition}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-grow flex-col px-3 pb-3 pt-5">
                                <div className="mb-3 flex items-start justify-between">
                                    <h3 className="pr-2 text-xl font-bold leading-tight text-white transition-colors group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 group-hover:bg-clip-text group-hover:text-transparent">
                                        {item.name}
                                    </h3>
                                    <div className="shrink-0 text-right">
                                        {item.originalPrice && (
                                            <span className="text-[10px] text-white/40 line-through">{item.originalPrice}</span>
                                        )}
                                        <span className="block text-lg font-bold text-white">{item.price}</span>
                                    </div>
                                </div>

                                <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-white/50">
                                    {item.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-2 w-2 rounded-full ${item.tagColor === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                                        <span className="text-xs font-medium text-white/60">
                                            By <span className="cursor-pointer text-white hover:underline">{item.seller}</span>
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => navigate(`/product/${item._id}`)}
                                        className={`rounded-full bg-white p-2.5 text-black transition-transform hover:scale-110 shadow-[0_0_15px_rgba(255,255,255,0.1)] ${item.tagColor === 'blue' ? 'group-hover:bg-blue-400' : 'group-hover:bg-yellow-400'}`}
                                    >
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {!loading && visibleItems.length === 0 && (
                        <div className="col-span-full flex min-h-[320px] items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-8 text-center text-white/40">
                            No marketplace items available right now.
                        </div>
                    )}
                </div>

                <div className="mt-20 flex justify-center">
                    <button
                        onClick={() => navigate('/marketplace')}
                        className="group flex items-center gap-3 text-sm font-semibold text-white/70 transition-colors hover:text-white"
                    >
                        <span className="relative tracking-wide">
                            View all marketplace pieces
                            <span className="absolute left-0 -bottom-1 h-[1px] w-full origin-left scale-x-0 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 transition-transform duration-300 group-hover:scale-x-100" />
                        </span>

                        <ArrowRight size={14} className="opacity-70 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100" />
                    </button>
                </div>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t from-black to-transparent" />
        </section>
    );
}
