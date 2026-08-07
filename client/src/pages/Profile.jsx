import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Footer } from '../components/Footer';
import { Loader2, UserCircle2, MapPin, Calendar, Award, Brush, Edit3, Sparkles, Layers3, ShoppingBag, ExternalLink, Briefcase, History, CheckCircle2, Ticket } from 'lucide-react';
import PostCard from '../components/Community/postCard';
import ProductCard from '../components/MarketPlace/ProductCard';
import { motion } from 'framer-motion';

const Profile = () => {
    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const myId = currentUser.id || currentUser._id;

    const [profileData, setProfileData] = useState(null);
    const [selectedGigs, setSelectedGigs] = useState([]);
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

    useEffect(() => {
        const fetchSelectedGigs = async () => {
            try {
                const res = await api.get('/events');
                const allEvents = res.data.events || [];
                const matched = allEvents.filter(evt =>
                    evt.applicants?.some(a => {
                        const artistId = a.artist?._id || a.artist;
                        return artistId?.toString() === myId?.toString() && a.status === 'selected';
                    })
                );
                setSelectedGigs(matched);
            } catch (err) {
                console.error("Failed to load selected gigs:", err);
            }
        };
        if (myId) fetchSelectedGigs();
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
            <div className="relative h-[80px] w-full md:h-[110px]">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-purple-900/50 to-black"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_30%)]"></div>
            </div>

            <div className="relative z-10 mx-auto -mt-8 max-w-[1180px] px-4 pb-10 sm:px-6">

                <div className="mb-5 rounded-[1.35rem] border border-white/10 bg-[linear-gradient(180deg,rgba(17,17,19,0.95),rgba(12,12,14,0.98))] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.32)] md:p-5">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-white/60">
                        <Sparkles size={12} className="text-amber-400" />
                        My Creative Space
                    </div>

                    <div className="flex flex-col gap-5 md:flex-row md:items-start">
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[1.2rem] border border-white/15 bg-[#111] p-1 shadow-xl md:h-24 md:w-24">
                            <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.45rem] bg-[#0f0f0f]">
                                {user.profilePic ? (
                                    <img src={user.profilePic} alt={user.name} className="h-full w-full object-cover" />
                                ) : (
                                    <UserCircle2 size={100} className="-ml-1 -mt-1 text-white/20" />
                                )}
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="mb-2 flex items-center justify-center gap-2 text-2xl font-black tracking-tight text-white md:justify-start md:text-[2rem]">
                                {user.name}
                                {user.role?.toLowerCase().includes('organizer') && (
                                    <span className="rounded bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">Verified</span>
                                )}
                            </h1>

                            <div className="mb-3 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                                <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold tracking-wide text-black shadow-lg shadow-amber-500/20">
                                    {user.role || 'Artist'}
                                </span>
                                {user.artStyle && (
                                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white">
                                        {user.artStyle}
                                    </span>
                                )}
                            </div>

                            <p className="mx-auto mb-4 max-w-xl text-sm leading-relaxed text-white/60 md:mx-0">
                                {user.bio || "Update your bio in settings to tell people about your craft. 🎨✨"}
                            </p>

                            <div className="grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                                        <MapPin size={13} />
                                        Origin
                                    </div>
                                    <div className="font-semibold text-white">{user.originLocation || 'Not added yet'}</div>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                                        <Award size={13} />
                                        Experience
                                    </div>
                                    <div className="font-semibold text-white">{user.experience || 'Growing'}</div>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/35">
                                        <Calendar size={13} />
                                        Joined
                                    </div>
                                    <div className="font-semibold text-white">{joinedYear}</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:mt-1 md:w-auto flex flex-wrap md:flex-col gap-2">
                            <Link to={`/profile/${myId}`} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 font-bold text-black transition-all hover:from-amber-400 hover:to-orange-500 shadow-md text-xs">
                                <ExternalLink size={15} /> Public Creator Page
                            </Link>
                            <Link to="/trade-history" className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-2.5 font-medium text-white transition-all hover:bg-white/20 text-xs">
                                <History size={15} /> Trade & Sales History
                            </Link>
                            <Link to="/settings" className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 font-medium text-white/70 transition-all hover:bg-white/10 text-xs">
                                <Edit3 size={15} /> Edit Profile
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 border-b border-white/10 mb-5">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'posts' ? 'border-amber-500 text-amber-500' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        <span className="inline-flex items-center gap-2">
                            <Layers3 size={14} />
                            My Posts ({posts?.length || 0})
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'products' ? 'border-amber-500 text-amber-500' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        <span className="inline-flex items-center gap-2">
                            <ShoppingBag size={14} />
                            Marketplace ({products?.length || 0})
                        </span>
                    </button>
                    <button
                        onClick={() => setActiveTab('gigs')}
                        className={`pb-3 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'gigs' ? 'border-amber-500 text-amber-500' : 'border-transparent text-white/40 hover:text-white'}`}
                    >
                        <span className="inline-flex items-center gap-2">
                            <Briefcase size={14} />
                            Selected Gigs ({selectedGigs.length})
                        </span>
                    </button>
                </div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                    {activeTab === 'posts' ? (
                        <div className="max-w-2xl mx-auto md:mx-0">
                            {posts && posts.length > 0 ? (
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
                    ) : activeTab === 'products' ? (
                        <div>
                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-x-6">
                                {products && products.length > 0 ? (
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
                    ) : (
                        /* Selected Gigs & Bookings Tab */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedGigs.length > 0 ? (
                                selectedGigs.map(gig => (
                                    <div key={gig._id} className="bg-[#111] border border-emerald-500/30 p-5 rounded-3xl space-y-3 relative overflow-hidden shadow-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full border border-emerald-500/40 flex items-center gap-1">
                                                <CheckCircle2 size={13} /> SELECTED & CONFIRMED
                                            </span>
                                            {gig.artistPayout > 0 && (
                                                <span className="text-sm font-black text-amber-400">₹{gig.artistPayout} Payout</span>
                                            )}
                                        </div>

                                        <div>
                                            <h4 className="text-lg font-bold text-white leading-snug">{gig.title}</h4>
                                            <p className="text-xs text-white/60 line-clamp-2 mt-1">{gig.description}</p>
                                        </div>

                                        <div className="space-y-1 text-xs text-white/70 pt-2 border-t border-white/10">
                                            <p className="flex items-center gap-2">
                                                <Calendar size={13} className="text-amber-400" /> {new Date(gig.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} at {gig.time || 'TBA'}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <MapPin size={13} className="text-amber-400" /> {gig.location}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 pt-2">
                                            <Link
                                                to={`/events`}
                                                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl text-center shadow-md flex items-center justify-center gap-1.5"
                                            >
                                                <Ticket size={14} /> Event Pass & Details
                                            </Link>
                                            <Link
                                                to="/messages"
                                                className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs rounded-xl text-center border border-white/10 flex items-center justify-center gap-1.5"
                                            >
                                                Contact Organizer
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-12 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/30 bg-white/[0.02] col-span-full">
                                    <Briefcase size={36} className="mb-2 text-amber-500/50" />
                                    <p className="text-sm font-bold text-white/70">No Gig Selections Yet</p>
                                    <p className="text-xs text-white/40 mt-1">Apply for live gigs under the Events page to get selected by organizers!</p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

            </div>
            <Footer />
        </div>
    );
};

export default Profile;
