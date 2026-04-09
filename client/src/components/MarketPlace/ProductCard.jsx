import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import api from '../../utils/api';
import Swal from 'sweetalert2';

const ProductCard = ({ product, onDelete }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [isSaved, setIsSaved] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const currentUserId = currentUser?._id || currentUser?.id;
    const sellerId = product.seller?._id || product.seller;

    const isOwner = currentUserId && sellerId && (currentUserId === sellerId);

    useEffect(() => {
        if (currentUser?.savedItems?.includes(product._id)) {
            setIsSaved(true);
        }
    }, [product._id, currentUser?.savedItems]);

    const handleSave = async (e) => {
        e.stopPropagation();
        if (!currentUserId) {
            return Swal.fire({
                title: 'Login Required',
                text: 'Please login to save items to your collection.',
                icon: 'info',
                background: '#0a0a0a',
                color: '#fff',
                confirmButtonColor: '#f59e0b'
            });
        }

        try {
            const res = await api.post(`/users/save-product/${product._id}`);
            setIsSaved(res.data.saved);

            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1500,
                background: '#111',
                color: '#fff'
            });
            Toast.fire({
                icon: 'success',
                title: res.data.saved ? 'Added to Saved' : 'Removed from Saved'
            });
        } catch (error) {
            console.error("Save error:", error);
        }
    };

    const discount = (product.originalPrice && product.price && product.originalPrice > product.price)
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    const getCategoryName = (cat) => {
        const categories = {
            'handcrafted': 'Wood Art',
            'traditional_art': 'Folk Art',
            'tribal_instruments': 'Instrument',
            'used_gear': 'Vintage'
        };
        return categories[cat] || 'Authentic';
    };

    return (
        <div className="group mb-8 break-inside-avoid-column bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/[0.05] hover:border-amber-500/30 transition-all duration-300 relative">

            <button
                onClick={handleSave}
                className="absolute top-3 right-3 z-20 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:scale-110 transition-all"
                title={isSaved ? "Remove from Saved" : "Save to Collection"}
            >
                <Heart
                    size={16}
                    fill={isSaved ? "#f59e0b" : "none"}
                    className={isSaved ? "text-amber-500" : "text-white/70"}
                />
            </button>

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
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider rounded">
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
                    <div className="flex flex-col">
                        <span className="text-lg font-medium text-amber-500">
                            ₹{product.price}
                        </span>
                        {discount > 0 && (
                            <span className="text-[10px] text-white/30 line-through">
                                ₹{product.originalPrice}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                         {isOwner && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(product._id); }}
                                className="flex items-center justify-center p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"
                                title="Delete Artwork"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}

                         <button
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(product);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-white px-3 py-2 rounded-lg transition-colors text-xs font-bold border border-amber-500/20"
                        >
                            <ShoppingBag size={14} /> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;