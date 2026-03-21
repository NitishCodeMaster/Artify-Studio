 import React from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product, onDelete }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const currentUser = JSON.parse(localStorage.getItem('user')) || {};

    const sellerId = product.seller?._id || product.seller;
    const currentUserId = currentUser?._id || currentUser?.id;
    const isOwner = currentUserId && sellerId && (currentUserId === sellerId);

    const discount = (product.originalPrice && product.price && product.originalPrice > product.price)
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const getCategoryName = (cat) => {
        switch (cat) {
            case 'handcrafted': return 'Wood Art';
            case 'traditional_art': return 'Folk Art';
            case 'tribal_instruments': return 'Instrument';
            case 'used_gear': return 'Vintage';
            default: return 'Authentic';
        }
    };

    return (
        <div className="group mb-8 break-inside-avoid-column bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/[0.05]">
            <div
                onClick={() => navigate(`/product/${product._id}`)}
                className="relative cursor-pointer bg-[#111]"
            >
                <img
                    src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] uppercase tracking-widest rounded">
                        {getCategoryName(product.category)}
                    </span>
                </div>

                {discount > 0 && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider rounded">
                        {discount}% OFF
                    </div>
                )}
            </div>

            <div className="p-5">
                <h3
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="text-white/90 text-base font-medium leading-tight mb-2 cursor-pointer hover:text-amber-500 transition-colors line-clamp-1"
                >
                    {product.name}
                </h3>

                <p className="text-white/40 text-xs line-clamp-2 mb-5 font-light leading-relaxed">
                    {product.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-medium text-amber-500">
                            ₹{product.price}
                        </span>
                        {discount > 0 && (
                            <span className="text-xs text-white/30 line-through">
                                ₹{product.originalPrice}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2.5">
                        {isOwner && (
                            <button
                                onClick={() => onDelete(product._id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors text-xs font-medium border border-red-500/20"
                                title="Remove your artwork"
                            >
                                <Trash2 size={14} /> Remove
                            </button>
                        )}

                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                addToCart(product);
                            }}
                            className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white px-3 py-1.5 rounded-lg transition-colors text-xs font-bold border border-amber-500/20"
                        >
                            <ShoppingBag size={14} /> Add
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default ProductCard;