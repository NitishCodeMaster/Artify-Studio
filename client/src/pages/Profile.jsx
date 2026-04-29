import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Footer } from '../components/Footer';
import { Loader2, UserCircle2, MapPin, Calendar, Award, Brush, Edit3, Sparkles, Layers3, ShoppingBag } from 'lucide-react';
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
            <div className="relative mt-20 h-[180px] w-full md:h-[220px]">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/50 to-black"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%)]"></div>
            </div>

            <div className="relative z-10 mx-auto -mt-16 max-w-[1080px] px-4 pb-12 sm:px-6">

                <div className="mb-10 rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,17,19,0.95),rgba(12,12,14,0.98))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-8">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/60">
                        <Sparkles size={12} className="text-amber-400" />
                        My Creative Space
                    </div>

                    <div className="flex flex-col gap-6 md:flex-row md:items-start">
                        <div className="h-24 w-24 shrink-0 overflow-hidden rounded-[1.8rem] border border-white/15 bg-[#111] p-1 shadow-xl md:h-28 md:w-28">
                            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.45rem] bg-[#0f0f0f]">
                                {user.profilePic ? (
                                    <img src={user.profilePic} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    <UserCircle2 size={100} className="-ml-1 -mt-1 text-white/20" />
                                )}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="mb-2 flex items-center justify-center gap-2 text-2xl font-black tracking-tight text-white md:justify-start md:text-4xl">
                                {user.name}
                                {user.role?.toLowerCase().includes('organizer') && (
                                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">Verified</span>
                                )}
                            </h1>

                            <div className="mb-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                                <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold tracking-wide text-black shadow-lg shadow-amber-500/20">
                                    {user.role || 'Artist'}
                                </span>
                                {user.artStyle && (
                                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white">
                                        {user.artStyle}
                                    </span>
                                )}
                            </div>

                            <p className="mx-auto mb-5 max-w-xl text-sm leading-relaxed text-white/60 md:mx-0">
                                {user.bio || "Update your bio in settings to tell people about your craft. 🎨✨"}
                            </p>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                                        <MapPin size={13} />
                                        Origin
                                    </div>
                                    <div className="font-semibold text-white">{user.originLocation || 'Not added yet'}</div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                                        <Award size={13} />
                                        Experience
                                    </div>
                                    <div className="font-semibold text-white">{user.experience || 'Growing'}</div>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                                        <Calendar size={13} />
                                        Joined
                                    </div>
                                    <div className="font-semibold text-white">{joinedYear}</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:mt-1 md:w-auto">
                            <Link to="/settings" className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-2.5 font-medium text-white transition-all hover:bg-white/20 md:w-auto">
                                <Edit3 size={16} /> Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6 border-b border-white/10 mb-6">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'posts' ? 'border-amber-500 text-amber-500' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        <span className="inline-flex items-center gap-2">
                            <Layers3 size={14} />
                            My Posts ({posts.length})
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'products' ? 'border-amber-500 text-amber-500' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        <span className="inline-flex items-center gap-2">
                            <ShoppingBag size={14} />
                            Marketplace ({products.length})
                        </span>
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
