 import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Loader2, UserCircle2, MapPin, Calendar, Mail, Brush, Award } from 'lucide-react';
import PostCard from '../components/Community/postCard';
import ProductCard from '../components/MarketPlace/ProductCard';
import { motion } from 'framer-motion';

const Profile = () => {
    const { id } = useParams();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/users/profile/${id}`);
                setProfileData(res.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030303] flex items-center justify-center">
                <Loader2 className="animate-spin text-amber-500" size={50} />
            </div>
        );
    }

    if (!profileData || !profileData.user) {
        return (
            <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center text-2xl font-bold">
                User not found! 🕵️‍♂️
            </div>
        );
    }

    const { user, posts, products } = profileData;

     const joinedYear = user.createdAt ? new Date(user.createdAt).getFullYear() : '2024';

    return (
        <div className="bg-[#030303] min-h-screen text-white font-sans selection:bg-amber-500/30">
            <Navbar />

             <div className="relative w-full h-[300px] lg:h-[400px]">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900/50 to-black">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                </div>

                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 lg:left-24 lg:translate-x-0">
                    <div className="w-32 h-32 rounded-full border-4 border-[#030303] bg-[#0f0f0f] flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] relative group">
                        {user.profilePic ? (
                            <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <UserCircle2 size={80} className="text-white/20" />
                        )}
                    </div>
                </div>
            </div>

             <div className="max-w-[1200px] mx-auto px-6 pt-20 pb-12">
                <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
                    <div className="text-center lg:text-left flex-1">
                        <h1 className="text-4xl lg:text-5xl font-black text-white mb-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                            {user.name}
                            {user.role?.toLowerCase().includes('organizer') && (
                                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                                    Verified
                                </span>
                            )}
                        </h1>

                         <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mt-3 mb-6">
                            <span className="bg-amber-500 text-black px-4 py-1.5 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20">
                                {user.role || 'Artist'}
                            </span>
                            {user.artStyle && (
                                <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-sm border border-white/20 flex items-center gap-1.5">
                                    ✨ {user.artStyle}
                                </span>
                            )}
                        </div>

                        <p className="text-white/70 max-w-2xl mx-auto lg:mx-0 mb-6 leading-relaxed text-lg">
                            {user.bio || "An incredible artist sharing their craft with the world. 🎨✨"}
                        </p>

                         <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-white/50 mb-8 bg-white/5 p-4 rounded-2xl border border-white/5 w-fit mx-auto lg:mx-0">
                            {user.originLocation ? (
                                <span className="flex items-center gap-2"><MapPin size={18} className="text-red-400" /> {user.originLocation}</span>
                            ) : (
                                <span className="flex items-center gap-2"><MapPin size={18} className="text-white/20" /> Location Unknown</span>
                            )}
                            
                            {user.experience && (
                                <span className="flex items-center gap-2"><Award size={18} className="text-yellow-400" /> {user.experience}</span>
                            )}
                            
                            <span className="flex items-center gap-2"><Calendar size={18} className="text-green-400" /> Joined {joinedYear}</span>
                            <span className="flex items-center gap-2"><Brush size={18} className="text-indigo-400" /> {posts.length} Posts</span>
                        </div>
                    </div>

                     <div className="flex flex-col gap-3 w-full lg:w-auto min-w-[200px]">
                        <button className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-amber-500/20">
                            {user.role?.toLowerCase().includes('organizer') ? 'Book for Event' : 'Commission Artwork'}
                        </button>
                        <button className="w-full bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-6 rounded-xl transition-all border border-white/10">
                            Message Artist
                        </button>
                    </div>
                </div>

                 <div className="flex items-center gap-6 border-b border-white/10 mb-8 mt-4">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'posts' ? 'border-amber-500 text-amber-500' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        Community Posts ({posts.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'products' ? 'border-amber-500 text-amber-500' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        Marketplace ({products.length})
                    </button>
                </div>

                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'posts' ? (
                        <div className="max-w-2xl">
                            {posts.length > 0 ? (
                                <div className="space-y-6">
                                    {posts.map(post => <PostCard key={post._id} post={post} />)}
                                </div>
                            ) : (
                                <p className="text-white/40 py-10 text-center border border-dashed border-white/10 rounded-2xl">No posts yet.</p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-2">Artworks & Instruments for Sale</h3>
                                <p className="text-white/50 text-sm">Support the artist directly by purchasing their authentic work.</p>
                            </div>
                            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-x-8">
                                {products.length > 0 ? (
                                    products.map(product => (
                                        <div key={product._id} className="break-inside-avoid">
                                            <ProductCard product={product} onDelete={() => { }} />
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-white/40 py-10 text-center border border-dashed border-white/10 rounded-2xl col-span-full">No items for sale right now.</p>
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