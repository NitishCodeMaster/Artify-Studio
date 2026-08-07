import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, Heart, PlayCircle, MapPin, Store, Briefcase, Sparkles } from 'lucide-react';
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
    const sellerObj = typeof product.seller === 'object' ? product.seller : null;
    const sellerId = sellerObj?._id || product.seller;

    const isOwner = currentUserId && sellerId && (currentUserId === sellerId);
    const hasVideo = Boolean(product.videos?.[0]?.url);

    const storeName = product.sellerStoreName || sellerObj?.sellerProfile?.storeName || (sellerObj?.name ? `${sellerObj.name}'s Store` : 'Rahul Music Store');
    const locationName = product.location || sellerObj?.sellerProfile?.location || sellerObj?.originLocation || 'Chandigarh';
    const sellerProfession = product.sellerProfession || sellerObj?.sellerProfile?.sellerCategory || sellerObj?.role || 'Creator & Artisan';

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.savedItems?.includes(product._id)) {
            setIsSaved(true);
        } else {
            setIsSaved(false);
        }
    }, [product._id]);

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
            const newStatus = res.data.saved;
            setIsSaved(newStatus);

            const user = JSON.parse(localStorage.getItem('user')) || {};
            if (newStatus) {
                user.savedItems = [...(user.savedItems || []), product._id];
            } else {
                user.savedItems = (user.savedItems || []).filter(id => id !== product._id);
            }
            localStorage.setItem('user', JSON.stringify(user));

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

    const handleProfileClick = (e) => {
        e.stopPropagation();
        if (sellerId) {
            navigate(`/profile/${sellerId}`);
        }
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

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className="px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white/90 text-[10px] uppercase tracking-widest rounded">
                        {getCategoryName(product.category)}
                    </span>
                </div>

                {discount > 0 && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-wider rounded">
                        {discount}% OFF
                    </div>
                )}

                {hasVideo && (
                    <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-500/90 text-black text-[10px] font-black uppercase tracking-wider rounded">
                        <PlayCircle size={13} /> Video Proof
                    </div>
                )}
            </div>

            <div className="p-5 space-y-3">
                {/* Seller Store Name & Location Badge */}
                <div
                    onClick={handleProfileClick}
                    className="flex items-center justify-between text-xs text-amber-400/90 hover:text-amber-300 font-semibold cursor-pointer group/seller"
                >
                    <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                        <Store size={13} className="shrink-0 text-amber-400 group-hover/seller:scale-110 transition-transform" />
                        <span className="truncate">{storeName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-white/60 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full shrink-0">
                        <MapPin size={11} className="text-amber-400" />
                        <span>📍 {locationName}</span>
                    </div>
                </div>

                {/* Seller Profession Badge */}
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-md w-fit">
                    <Briefcase size={12} className="text-amber-400 shrink-0" />
                    <span className="truncate">{sellerProfession}</span>
                </div>

                <h3
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="text-white/90 text-base font-bold leading-tight cursor-pointer hover:text-amber-400 transition-colors line-clamp-1"
                >
                    {product.name}
                </h3>

                <p className="text-white/40 text-xs line-clamp-2 font-light leading-relaxed">
                    {product.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/[0.05]">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-amber-400">
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
