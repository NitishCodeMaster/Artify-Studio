import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Bookmark, Brush, Loader2, Trash2, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Swal from 'sweetalert2';

const SavedCollections = () => {
    const navigate = useNavigate();
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSaved = async () => {
        try {
            const res = await api.get('/users/saved-items');
            setSavedItems(res.data.savedItems || []);
        } catch (error) {
            console.error("Failed to fetch saved collections:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaved();
    }, []);

    const handleUnsave = async (e, productId) => {
        e.stopPropagation();
        try {
            const res = await api.post(`/users/save-product/${productId}`);
            if (res.data.success) {
                setSavedItems(prev => prev.filter(item => item._id !== productId));

                const user = JSON.parse(localStorage.getItem('user')) || {};
                user.savedItems = (user.savedItems || []).filter(id => id !== productId);
                localStorage.setItem('user', JSON.stringify(user));

                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 1500,
                    background: '#111',
                    color: '#fff'
                });
                Toast.fire({ icon: 'success', title: 'Removed from Vault' });
            }
        } catch (error) {
            console.error("Unsave error:", error);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans">
            <Navbar />
            <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-20">
                <button onClick={() => navigate(-1)} className="text-white/50 hover:text-amber-500 mb-8 font-medium transition-colors text-sm">← Back</button>

                <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <Bookmark size={24} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">Saved Collections</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={40} /></div>
                ) : savedItems.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {savedItems.map(item => (
                            <div
                                key={item._id}
                                className="group bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden hover:border-amber-500/10 transition-all cursor-pointer"
                                onClick={() => navigate(`/product/${item._id}`)}
                            >
                                <div className="relative aspect-square overflow-hidden bg-[#111]">
                                    <img
                                        src={item.images?.[0]?.url || item.image || 'https://via.placeholder.com/400'}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div
                                            className="p-1.5 bg-black/60 text-white/70 backdrop-blur-sm rounded-lg hover:text-amber-500 transition-colors"
                                            title="View Details"
                                        >
                                            <ExternalLink size={15} />
                                        </div>
                                        <div
                                            onClick={(e) => handleUnsave(e, item._id)}
                                            className="p-1.5 bg-black/60 text-red-400 backdrop-blur-sm rounded-lg hover:text-red-500 transition-all"
                                            title="Remove from Saved"
                                        >
                                            <Trash2 size={15} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <h3 className="text-sm font-semibold text-white/90 line-clamp-1 mb-1 group-hover:text-amber-500 transition-colors">{item.name || item.title}</h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-amber-500 font-medium text-sm">₹{item.price}</span>
                                        <span className="text-white/30 text-xs capitalize line-clamp-1">{item.category}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-80 border-2 border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-center bg-[#0a0a0a] px-6">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-6">
                            <Brush size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Your Vault is Empty</h3>
                        <p className="text-white/40 text-sm max-w-xs leading-relaxed">Save artworks you love to build your personal collection and revisit them anytime.</p>
                        <button
                            onClick={() => navigate('/market-place')}
                            className="mt-8 px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-black text-sm transition-all shadow-xl shadow-amber-500/10 active:scale-95"
                        >
                            Explore Marketplace
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default SavedCollections;