import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowUpRight, MapPin } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <motion.div 
            whileHover={{ y: -8 }}
            className="group relative bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300"
        >
            {/* --- 1. Image Section (Wahi same rakha hai) --- */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#111]">
                <img 
                    src={product.image} 
                    alt={product.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                />
                
                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {product.type === 'Used' && (
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 text-white/80 text-[10px] font-bold uppercase tracking-wider rounded-md">
                            Pre-Loved
                        </span>
                    )}
                    {product.type === 'Handmade' && (
                        <span className="px-2.5 py-1 bg-emerald-900/80 backdrop-blur-md border border-emerald-500/20 text-emerald-200 text-[10px] font-bold uppercase tracking-wider rounded-md">
                            Tribal Art
                        </span>
                    )}
                </div>

                {/* Like Button (Hidden until hover) */}
                <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:border-red-500">
                    <Heart size={14} />
                </button>
            </div>

            {/* --- 2. Details Section (Isme Sudhaar kiya hai) --- */}
            <div className="p-5"> {/* Padding badha di */}
                
                {/* Category Label */}
                <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
                    {product.category === 'tribal' ? 'Artifact' : 'Studio Gear'}
                </div>

                {/* Title */}
                <h3 className="text-white text-lg font-medium leading-tight mb-2 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {product.title}
                </h3>

                {/* Metadata (Location & Condition) */}
                <div className="flex items-center gap-3 text-xs text-white/40 mb-5 font-light">
                    <span className="flex items-center gap-1">
                        <MapPin size={12} /> {product.location}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span>{product.condition} Condition</span>
                </div>

                {/* Footer: Price & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                        {product.originalPrice && (
                            <span className="text-[10px] text-white/30 line-through">
                                {product.originalPrice}
                            </span>
                        )}
                        <span className="text-xl font-bold text-white tracking-tight">
                            {product.price}
                        </span>
                    </div>

                    {/* Button slides in on hover */}
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <ArrowUpRight size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;