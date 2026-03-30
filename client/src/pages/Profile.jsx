import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Loader2, UserCircle2, MapPin, Calendar, Award, Brush, Edit3 } from 'lucide-react';
import PostCard from '../components/Community/postCard';
import ProductCard from '../components/MarketPlace/ProductCard';
import { motion } from 'framer-motion';

const Profile = () => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const myId = currentUser.id || currentUser._id;

    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');

    useEffect(() => {
        const fetchMyProfile = async () => {
            if (!myId) return setLoading(false);
            try {
                const res = await api.get(`/users/profile/${myId}`);
                setProfileData(res.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyProfile();
    }, [myId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <Loader2 className="animate-spin text-amber-500" size={40} />
            </div>
        );
    }

    if (!profileData || !profileData.user) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center">
                <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
                <Link to="/login" className="text-amber-500 underline">Go to Login</Link>
            </div>
        );
    }

    const { user, posts, products } = profileData;
    const joinedYear = user.createdAt ? new Date(user.createdAt).getFullYear() : '2024';

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-amber-500/30">
            <Navbar />

            <div className="relative w-full h-[160px] md:h-[200px] mt-20">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/50 to-black"></div>
            </div>

            <div className="max-w-[1000px] mx-auto px-4 sm:px-6 relative -mt-12 pb-12 z-10">

                <div className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">

                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-[#050505] bg-[#111] overflow-hidden shadow-xl shrink-0 -mt-12">
                        {user.profilePic ? (
                            <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <UserCircle2 size={100} className="text-white/20 -ml-1 -mt-1" />
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2 flex items-center justify-center md:justify-start gap-2">
                            {user.name}
                            {user.role?.toLowerCase().includes('organizer') && (
                                <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Verified</span>
                            )}
                        </h1>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3">
                            <span className="bg-amber-500 text-black px-3 py-1 rounded-full font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20">
                                {user.role || 'Artist'}
                            </span>
                            {user.artStyle && (
                                <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs border border-white/20">
                                    ✨ {user.artStyle}
                                </span>
                            )}
                        </div>

                        <p className="text-white/60 text-sm max-w-xl mx-auto md:mx-0 leading-relaxed mb-4">
                            {user.bio || "Update your bio in settings to tell people about your craft. 🎨✨"}
                        </p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-white/50">
                            {user.originLocation && <span className="flex items-center gap-1"><MapPin size={14} className="text-red-400" /> {user.originLocation}</span>}
                            {user.experience && <span className="flex items-center gap-1"><Award size={14} className="text-yellow-400" /> {user.experience}</span>}
                            <span className="flex items-center gap-1"><Calendar size={14} className="text-green-400" /> Joined {joinedYear}</span>
                        </div>
                    </div>

                    <div className="w-full md:w-auto mt-2 md:mt-0">
                        <Link to="/settings" className="flex items-center justify-center gap-2 w-full md:w-auto bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-5 rounded-xl transition-all border border-white/10">
                            <Edit3 size={16} /> Edit Profile
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-6 border-b border-white/10 mb-6">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'posts' ? 'border-amber-500 text-amber-500' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        My Posts ({posts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'products' ? 'border-amber-500 text-amber-500' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        Marketplace ({products.length})
                    </button>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {activeTab === 'posts' ? (
                        <div className="max-w-2xl mx-auto md:mx-0">
                            {posts.length > 0 ? (
                                <div className="space-y-4">
                                    {posts.map(post => <PostCard key={post._id} post={post} />)}
                                </div>
                            ) : (
                                <div className="py-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/30 bg-white/[0.02]">
                                    <Brush size={32} className="mb-2 opacity-50" />
                                    <p className="text-sm">You haven't posted anything yet.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-x-6">
                                {products.length > 0 ? (
                                    products.map(product => (
                                        <div key={product._id} className="break-inside-avoid mb-6">
                                            <ProductCard product={product} onDelete={() => { }} />
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/30 bg-white/[0.02] col-span-full w-full">
                                        <p className="text-sm">No items for sale right now.</p>
                                        <Link to="/add-product" className="mt-4 text-amber-500 hover:underline text-sm font-medium">Add a Product</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>

            </div>
            <Footer />
        </div>
    );
};

export default Profile;