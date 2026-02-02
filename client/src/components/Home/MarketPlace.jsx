import React, { useState } from 'react';
import {
    Heart, ShoppingCart, Tag, Store, Music, Hammer, BookOpen, Palette,
    Guitar, Sparkles, Search, Mic2, ArrowRight, Speaker,
    VenetianMask
} from 'lucide-react';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';

 import imgMadhubani from '../../assets/Images/MarketPlace/image1.jpg';
import imgWoodInst from '../../assets/Images/MarketPlace/image2.png';
import imgGuitar from '../../assets/Images/MarketPlace/image3.avif';
import imgDrum from '../../assets/Images/MarketPlace/image4.jpeg';
import imgWoodPanel from '../../assets/Images/MarketPlace/image5.png';
import imgMemoryFrame from '../../assets/Images/MarketPlace/image6.png';

const marketItems = [
    {
        id: 1,
        name: 'Madhubani Painting (A3)',
        price: '$45',
        seller: 'Bihar Folk Art',
        category: 'Folk Art',
        icon: Palette,
        image: imgMadhubani,
        condition: 'New - Handmade',
        description: 'Authentic hand-painted Madhubani art on handmade paper. Unframed.',
        color: 'from-yellow-500 via-orange-500 to-red-500',
        borderColor: 'group-hover:border-orange-500/50',
        shadowColor: 'group-hover:shadow-orange-500/20',
        tagColor: 'yellow'
    },
    {
        id: 2,
        name: 'Fender Stratocaster (2015)',
        price: '$650',
        originalPrice: '$1200',
        seller: 'Rock Music Shop',
        category: 'Electric Guitar',
        icon: Guitar,
        image: imgGuitar,
        condition: 'Used - Excellent',
        description: 'Well maintained, minor scratches on the back. Perfect for gigging musicians.',
        color: 'from-blue-500 via-indigo-500 to-violet-500',
        borderColor: 'group-hover:border-blue-500/50',
        shadowColor: 'group-hover:shadow-blue-500/20',
        tagColor: 'blue'
    },
    {
        id: 3,
        name: 'Vintage Drum Kit',
        price: '$350',
        originalPrice: '$800',
        seller: 'BeatMasters',
        category: 'Percussion',
        icon: Music,
        image: imgDrum,
        condition: 'Used - Fair',
        description: 'Classic sound, skins replaced recently. Great for practice or garage bands.',
        color: 'from-purple-500 via-fuchsia-500 to-pink-500',
        borderColor: 'group-hover:border-purple-500/50',
        shadowColor: 'group-hover:shadow-purple-500/20',
        tagColor: 'blue'
    },
    {
        id: 4,
        name: 'Hand-Carved Flute Set',
        price: '$60',
        seller: 'Folk Wood Artisans',
        category: 'Musical Woodcraft',
        icon: Music,
        image: imgWoodInst,
        condition: 'New - Playable',
        description: 'Set of 3 bamboo and wood flutes carved by tribal artisans.',
        color: 'from-emerald-500 via-green-500 to-teal-500',
        borderColor: 'group-hover:border-emerald-500/50',
        shadowColor: 'group-hover:shadow-emerald-500/20',
        tagColor: 'green'
    },
    {
        id: 5,
        name: 'Story Wood Art Panel',
        price: '$180',
        seller: 'Village Wood Artisans',
        category: 'Wood Sculpture',
        icon: Hammer,
        image: imgWoodPanel,
        condition: 'Unique Piece',
        description: 'Hand-carved wooden panel narrating a traditional folk story.',
        color: 'from-amber-600 via-orange-600 to-red-600',
        borderColor: 'group-hover:border-amber-500/50',
        shadowColor: 'group-hover:shadow-amber-500/20',
        tagColor: 'orange'
    },
    {
        id: 6,
        name: 'Living Memory Frame',
        price: '$210',
        seller: 'Heritage Artists',
        category: 'Memory Art',
        icon: BookOpen,
        image: imgMemoryFrame,
        condition: 'Artist Story Included',
        description: 'A hand-carved wooden artwork sold with the artist’s personal story.',
        color: 'from-rose-500 via-pink-500 to-red-500',
        borderColor: 'group-hover:border-rose-500/50',
        shadowColor: 'group-hover:shadow-rose-500/20',
        tagColor: 'orange'
    }
];

export default function MarketPlace() {
    const [likedItems, setLikedItems] = useState([]);

    const toggleLike = (index) => {
        setLikedItems(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    return (

        <section id="marketplace" className="relative w-full  pt-12 pb-12 bg-black overflow-hidden">

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] 
               bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 
               blur-[160px] pointer-events-none" />

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                <Music className="absolute bottom-[10%] left-[5%] text-white/5 -rotate-12" size={150} strokeWidth={0.5} />

                <VenetianMask className="absolute top-[7%] right-[10%] text-white/5 rotate-12" size={180} strokeWidth={0.5} />
                <Speaker className="absolute bottom-[20%] right-[5%] text-white/5 -rotate-[15deg]" size={200} strokeWidth={0.5} />

                <Mic2 className="absolute top-[6%] left-[40%] text-white/5 rotate-[8deg]" size={120} strokeWidth={0.5} />

                <Palette className="absolute bottom-[30%] left-[20%] text-white/5 -rotate-6" size={80} strokeWidth={0.5} />

                <div className="absolute top-20 right-20 w-64 h-64 bg-purple-900/20 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-20 left-10 w-80 h-80 bg-orange-900/10 rounded-full blur-[100px]"></div>

                <Sparkles className="absolute top-14 left-1/3 text-pink-500 animate-pulse" size={30} />
                
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-8">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
                            <Store size={14} className="text-yellow-500" />
                            <span className="text-xs font-bold text-yellow-500 tracking-widest uppercase">The Creator's Marketplace</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white font-playfair leading-snug md:leading-tight">
                            Trade Used Gear & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 italic">
                                Authentic Folk Art
                            </span>
                        </h2>
                        <p className="text-white/50 mt-4 max-w-lg text-sm md:text-base font-poppins ">
                            The perfect place to upgrade your studio. Buy and sell pre-loved instruments, recording gear, and handmade crafts from fellow artists.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <button className="group flex items-center gap-2 px-6 py-3 rounded-full bg-transparent border border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                            <Search size={18} className="text-white/70" />
                            Explore Market
                        </button>

                        <button className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            Sell Gear & Art
                            <Tag size={18} className="group-hover:rotate-12 transition-transform" />
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-9">
                    {marketItems.map((item, index) => (
                        <div
                            key={item.id}
                            className={`group relative flex flex-col h-full bg-[#0a0a0a] rounded-[2rem] p-3 border border-white/10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${item.borderColor} ${item.shadowColor}`}
                        >
                            <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-500 pointer-events-none`}></div>

                            <div className="relative h-64 rounded-[1.5rem] overflow-hidden bg-gray-900 shrink-0">
                                <ImageWithFallback
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80"></div>

                                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 text-white">
                                    <item.icon size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">{item.category}</span>
                                </div>

                                <button
                                    onClick={() => toggleLike(index)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-red-500 hover:border-red-500 transition-all z-20 cursor-pointer text-white"
                                >
                                    <Heart
                                        size={14}
                                        className={`${likedItems.includes(index) ? 'fill-white text-white' : 'text-white'}`}
                                    />
                                </button>

                                <div className="absolute bottom-3 left-3">
                                    <span className={`px-2 py-1 rounded-lg backdrop-blur-md border text-[10px] font-bold flex items-center gap-1
                                        ${item.tagColor === 'yellow' ? 'bg-yellow-500/25 border-yellow-500/30 text-yellow-200' : ''}
                                        ${item.tagColor === 'blue' ? 'bg-blue-500/25 border-blue-500/30 text-blue-200' : ''}
                                        ${item.tagColor === 'green' ? 'bg-emerald-500/25 border-emerald-500/30 text-emerald-200' : ''}
                                        ${item.tagColor === 'orange' ? 'bg-orange-500/25 border-orange-500/30 text-orange-200' : ''}
                                    `}>
                                        <Tag size={10} />
                                        {item.condition}
                                    </span>
                                </div>
                            </div>

                            <div className="px-3 pt-5 pb-3 flex flex-col flex-grow">

                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-white pr-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-colors">
                                        {item.name}
                                    </h3>
                                    <div className="flex flex-col items-end shrink-0">
                                        {item.originalPrice && (
                                            <span className="text-[10px] text-white/40 line-through">{item.originalPrice}</span>
                                        )}
                                        <span className="text-lg font-bold text-white">{item.price}</span>
                                    </div>
                                </div>

                                <p className="text-sm text-white/50 mb-6 leading-relaxed line-clamp-3">
                                    {item.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${item.tagColor === 'blue' ? 'bg-blue-500' : 'bg-yellow-500'}`}></div>
                                        <span className="text-xs text-white/60 font-medium">
                                            By <span className="text-white hover:underline cursor-pointer">{item.seller}</span>
                                        </span>
                                    </div>

                                    <button className={`p-2.5 rounded-full bg-white text-black hover:scale-110 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.1)] ${item.tagColor === 'blue' ? 'group-hover:bg-blue-400' : 'group-hover:bg-yellow-400'}`}>
                                        <ShoppingCart size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 flex justify-center">
                    <a
                        href="#"
                        className="group flex items-center gap-3 
                       text-sm font-semibold text-white/70
                      hover:text-white transition-colors"
                    >
                        <span className="relative tracking-wide">
                            View all 120+ Instruments & Art
                            <span className="absolute left-0 -bottom-1 w-full h-[1px] 
                           bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 
                           scale-x-0 origin-left group-hover:scale-x-100 
                           transition-transform duration-300"></span>
                        </span>

                        <ArrowRight
                            size={14}
                            className="opacity-70 group-hover:opacity-100 
                             group-hover:translate-x-2 transition-all duration-300"
                        />
                    </a>
                </div>


            </div>
            <div className="absolute bottom-0 left-0 w-full h-32 
            bg-gradient-to-t from-black to-transparent pointer-events-none" />
        </section>
    );
} 