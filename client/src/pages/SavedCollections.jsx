import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Bookmark, Brush, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const SavedCollections = () => {
    const navigate = useNavigate();
    const [savedItems, setSavedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        fetchSaved();
    }, []);

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans">
            <Navbar />
            <div className="max-w-[1200px] mx-auto px-6 pt-32 pb-20">
                <button onClick={() => navigate(-1)} className="text-white/50 hover:text-amber-500 mb-8 font-medium transition-colors text-sm">← Back</button>

                <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400"><Bookmark size={24} /></div>
                    <h1 className="text-3xl font-black tracking-tight">Saved Collections</h1>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={40} /></div>
                ) : savedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {savedItems.map(item => (
                            <div key={item._id} className="bg-[#0a0a0a] p-4 rounded-3xl border border-white/10">
                                <img src={item.image} alt="Saved" className="w-full h-40 object-cover rounded-2xl mb-4" />
                                <h3 className="text-lg font-bold">{item.title}</h3>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-64 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center bg-[#0a0a0a]">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/30 mb-4"><Brush size={30} /></div>
                        <h3 className="text-xl font-bold text-white mb-2">Your Vault is Empty</h3>
                        <p className="text-white/50 text-sm max-w-sm">When you discover amazing artworks or events, save them here for later.</p>
                        <button onClick={() => navigate('/discover')} className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20">Explore Discover Page</button>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};
export default SavedCollections;