import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import {
    MapPin, Star, Sparkles, Briefcase, Calendar, Clock, ArrowRight,
    Share2, Mail, Phone, ExternalLink, CheckCircle2, Play, MessageSquare,
    UserCircle2, ShieldCheck, Heart, Award, ArrowLeft, Loader2, Pencil
} from 'lucide-react';
import CommissionModal from '../components/CommissionModal';
import ProductCard from '../components/MarketPlace/ProductCard';
import SellerMap from '../components/MarketPlace/SellerMap';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const PublicProfile = ({ overrideUserId }) => {
    const { id: routeId } = useParams();
    const id = overrideUserId || routeId;
    const navigate = useNavigate();

    const [profile, setProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [posts, setPosts] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedGigs, setSelectedGigs] = useState([]);
    const [upcomingGigs, setUpcomingGigs] = useState([]);
    const [pastGigs, setPastGigs] = useState([]);
    const [stats, setStats] = useState({});
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const currentUserId = currentUser.id || currentUser._id || currentUser.userId;
    const isMyProfile = Boolean(currentUserId && id && currentUserId.toString() === id.toString());

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/users/profile/${id}`);
                setProfile(res.data.user);
                setPosts(res.data.posts || []);
                setProducts(res.data.products || []);
                setSelectedGigs(res.data.selectedGigs || []);
                setUpcomingGigs(res.data.upcomingGigs || []);
                setPastGigs(res.data.pastGigs || []);
                setStats(res.data.stats || {});
            } catch (err) {
                setError("Artist profile not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        if (!isFollowing) {
            toast.success(`You are now following ${profile?.name}! 🌟`);
        } else {
            toast.success(`Unfollowed ${profile?.name}.`);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Profile link copied to clipboard! 📋");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#07070c] flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-500" size={40} />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-[#07070c] text-white flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-2xl font-black text-white/60 mb-4">{error || "Profile unavailable"}</h2>
                <button
                    onClick={() => navigate('/events')}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2"
                >
                    <ArrowLeft size={16} /> Explore Events & Gigs
                </button>
            </div>
        );
    }

    // Default hero performance background image
    const heroBg = profile.portfolio?.coverImage ||
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2000&auto=format&fit=crop";

    const artistHeadline = profile.portfolio?.headline || profile.artStyle || profile.role || "Acoustic Singer & Live Performer";
    const artistLocation = profile.originLocation || profile.sellerProfile?.location || "New Delhi, India";
    const artistBio = profile.bio || profile.portfolio?.about || "Acoustic artist passionate about creating soulful musical experiences through guitar and live vocals.";

    // Sample fallback portfolio highlights if featured works are empty
    const portfolioHighlights = (profile.portfolio?.featuredWorks && profile.portfolio.featuredWorks.length > 0)
        ? profile.portfolio.featuredWorks.slice(0, 3)
        : [
            {
                title: "Acoustic Cover",
                image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500",
                duration: "03:45",
                link: "#"
            },
            {
                title: "Unplugged Mashup",
                image: "https://images.unsplash.com/photo-1470229722913-7c092bb4ace4?q=80&w=500",
                duration: "04:12",
                link: "#"
            },
            {
                title: "Indie Acoustic Session",
                image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=500",
                duration: "03:20",
                link: "#"
            }
        ];

    // Skills & Genres array
    const skillsList = profile.portfolio?.skills?.length > 0
        ? profile.portfolio.skills
        : ["Acoustic", "Bollywood", "Indie", "Rock", "Pop", "Soulful", "Guitar", "Vocals"];

    return (
        <div className="min-h-screen bg-[#06060a] font-sans text-white selection:bg-purple-500/30">
            {/* 1. HERO / PROFILE HEADER */}
            <div className="relative bg-[#090912] border-b border-white/10 overflow-hidden">
                {/* Hero Backdrop Image with Dark Overlay Gradient */}
                <div className="absolute inset-0 z-0 opacity-25">
                    <img src={heroBg} alt="" className="w-full h-full object-cover grayscale-[20%]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#06060a] via-[#06060a]/90 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#06060a] via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:py-10">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                        {/* Avatar & Main Info */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                            <div className="relative shrink-0">
                                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 shadow-2xl shadow-purple-500/30">
                                    <div className="w-full h-full rounded-full overflow-hidden bg-[#0d0d15] border-2 border-[#06060a]">
                                        {profile.profilePic ? (
                                            <img src={profile.profilePic} alt={profile.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-purple-900/30 text-4xl font-black text-purple-300">
                                                {profile.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-3 border-[#06060a] shadow-lg" title="Open for Gigs"></span>
                            </div>

                            <div className="space-y-2 max-w-xl">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2">
                                        {profile.name}
                                        <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-[10px] font-black shrink-0" title="Verified Artist">✓</span>
                                    </h1>
                                </div>

                                <p className="text-sm font-bold text-purple-300 tracking-wide">
                                    {artistHeadline}
                                </p>

                                <p className="text-xs text-white/50 flex items-center justify-center sm:justify-start gap-1 font-medium">
                                    <MapPin size={13} className="text-purple-400 shrink-0" />
                                    <span>{artistLocation}</span>
                                </p>

                                <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal italic pt-1">
                                    "{artistBio}"
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-3">
                                    {!isMyProfile ? (
                                        <>
                                            <button
                                                onClick={() => setIsCommissionModalOpen(true)}
                                                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                                            >
                                                <Sparkles size={15} /> Hire Artist
                                            </button>

                                            <button
                                                onClick={() => navigate('/messages')}
                                                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                                            >
                                                <MessageSquare size={15} /> Message
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/settings"
                                                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all active:scale-95 flex items-center gap-2"
                                            >
                                                <Pencil size={15} /> Edit Profile
                                            </Link>
                                            <Link
                                                to="/portfolio/edit"
                                                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-xs rounded-xl transition-all active:scale-95 flex items-center gap-2"
                                            >
                                                <Award size={15} /> Manage Portfolio
                                            </Link>
                                        </>
                                    )}

                                    <button
                                        onClick={handleShare}
                                        className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 rounded-xl transition-all active:scale-95 cursor-pointer"
                                        title="Share Profile"
                                    >
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Minimal Stats Card (Right Side of Hero) */}
                        <div className="flex items-center gap-6 bg-[#0c0c16]/80 border border-purple-500/20 backdrop-blur-md p-4 sm:p-5 rounded-2xl shrink-0">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-purple-400 font-black text-xl">
                                    <span>🎵</span> {stats.selectedGigsCount || selectedGigs.length || 7}
                                </div>
                                <p className="text-[10px] font-extrabold uppercase text-white/40 tracking-wider mt-1">Performances</p>
                            </div>
                            <div className="w-[1px] h-8 bg-white/10"></div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-amber-400 font-black text-xl">
                                    <Star size={16} className="fill-amber-400" /> {stats.rating || profile.mentorProfile?.rating || 4.8}
                                </div>
                                <p className="text-[10px] font-extrabold uppercase text-white/40 tracking-wider mt-1">Rating</p>
                            </div>
                            <div className="w-[1px] h-8 bg-white/10"></div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-purple-300 font-black text-xl">
                                    <span>👤</span> 120
                                </div>
                                <p className="text-[10px] font-extrabold uppercase text-white/40 tracking-wider mt-1">Followers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN TABS NAVIGATION BAR */}
            <div className="bg-[#08080f] border-b border-white/10 sticky top-0 z-30 backdrop-blur-md">
                <div className="mx-auto max-w-[1240px] px-4 sm:px-6 flex items-center gap-2 sm:gap-6 overflow-x-auto custom-scrollbar">
                    {[
                        { id: 'overview', label: 'Overview', icon: '⚡' },
                        { id: 'gigs', label: `Gigs & History (${selectedGigs.length})`, icon: '📅' },
                        { id: 'portfolio', label: `Portfolio (${posts.length})`, icon: '🎨' },
                        { id: 'reviews', label: 'Reviews', icon: '⭐' },
                        { id: 'about', label: 'About', icon: 'ℹ️' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-4 px-3 text-xs sm:text-sm font-extrabold transition-all border-b-2 flex items-center gap-2 whitespace-nowrap cursor-pointer ${activeTab === tab.id
                                    ? 'border-purple-500 text-purple-300'
                                    : 'border-transparent text-white/40 hover:text-white'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. CONTENT LAYOUT (Main Column + Right Sidebar) */}
            <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT / MAIN COLUMN (2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">
                        {activeTab === 'overview' && (
                            <>
                                {/* A. Upcoming Performances */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                                            <Calendar size={18} className="text-purple-400" /> Upcoming Performances
                                        </h3>
                                        <button onClick={() => setActiveTab('gigs')} className="text-xs font-bold text-purple-400 hover:underline">
                                            View All
                                        </button>
                                    </div>

                                    {upcomingGigs.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {upcomingGigs.map(gig => (
                                                <div
                                                    key={gig._id}
                                                    onClick={() => navigate(`/events`)}
                                                    className="bg-[#0f0f18] border border-purple-500/20 hover:border-purple-500/50 p-4 rounded-2xl transition-all cursor-pointer group space-y-3 shadow-lg"
                                                >
                                                    <div className="relative h-32 rounded-xl overflow-hidden bg-black/40">
                                                        <img
                                                            src={gig.bannerImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600"}
                                                            alt={gig.title}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                        <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-purple-600 text-white font-extrabold text-[10px] shadow-lg">
                                                            Selected
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-extrabold text-white text-sm line-clamp-1 group-hover:text-purple-300 transition-colors">
                                                            {gig.title}
                                                        </h4>
                                                        <p className="text-xs text-purple-300 font-bold mt-0.5">
                                                            {artistHeadline}
                                                        </p>
                                                    </div>

                                                    <div className="space-y-1 text-[11px] text-white/50 border-t border-white/5 pt-2">
                                                        <p className="flex items-center gap-1.5 font-medium">
                                                            <Calendar size={12} className="text-purple-400 shrink-0" />
                                                            <span>{new Date(gig.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} • {gig.time || "7:30 PM"}</span>
                                                        </p>
                                                        <p className="flex items-center gap-1.5 font-medium truncate">
                                                            <MapPin size={12} className="text-purple-400 shrink-0" />
                                                            <span className="truncate">{gig.location}</span>
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center justify-between pt-1">
                                                        {gig.artistPayout > 0 && (
                                                            <span className="text-xs font-black text-emerald-400">
                                                                ₹{gig.artistPayout}
                                                            </span>
                                                        )}
                                                        <span className="text-xs font-bold text-purple-400 group-hover:text-white transition-colors flex items-center gap-1 ml-auto">
                                                            View Details <ArrowRight size={12} />
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 bg-[#0f0f18] border border-white/5 rounded-2xl text-center space-y-2">
                                            <Calendar size={28} className="mx-auto text-white/20" />
                                            <p className="text-xs text-white/50 font-medium">No upcoming scheduled performances.</p>
                                        </div>
                                    )}
                                </div>

                                {/* B. Past Performances & Portfolio Highlights (Split 2-Column) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {/* Past Performances */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                                <span>🏆</span> Past Performances
                                            </h3>
                                            <button onClick={() => setActiveTab('gigs')} className="text-xs font-bold text-purple-400 hover:underline">
                                                View All
                                            </button>
                                        </div>

                                        {pastGigs.length > 0 ? (
                                            <div className="space-y-3">
                                                {pastGigs.slice(0, 2).map(gig => (
                                                    <div key={gig._id} className="p-3.5 bg-[#0f0f18] border border-white/10 rounded-2xl flex items-center gap-3">
                                                        <img
                                                            src={gig.bannerImage || "https://images.unsplash.com/photo-1470229722913-7c092bb4ace4?q=80&w=300"}
                                                            alt=""
                                                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                                                        />
                                                        <div className="min-w-0 flex-1">
                                                            <h5 className="font-extrabold text-white text-xs truncate">{gig.title}</h5>
                                                            <p className="text-[10px] text-white/50 truncate mt-0.5">{gig.location}</p>
                                                            <span className="text-[10px] font-bold text-emerald-400 mt-1 inline-block">✓ Completed</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-[#0f0f18] border border-white/5 rounded-2xl text-xs text-white/40 italic text-center">
                                                Past performance records will appear here after events pass.
                                            </div>
                                        )}
                                    </div>

                                    {/* Portfolio Highlights */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                                                <span>🎨</span> Portfolio Highlights
                                            </h3>
                                            <button onClick={() => setActiveTab('portfolio')} className="text-xs font-bold text-purple-400 hover:underline">
                                                View All
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2">
                                            {portfolioHighlights.map((work, idx) => (
                                                <div key={idx} className="relative group rounded-xl overflow-hidden bg-black/40 aspect-square border border-white/10 cursor-pointer">
                                                    <img src={work.image} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-purple-900/40 transition-colors">
                                                        <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg">
                                                            <Play size={12} className="ml-0.5 fill-white" />
                                                        </div>
                                                    </div>
                                                    <p className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white truncate px-1 text-center bg-black/60 rounded">
                                                        {work.title}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* C. Creative Bottom Hire CTA Card */}
                                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-purple-900/40 border border-purple-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="space-y-1 text-center sm:text-left">
                                        <h4 className="text-lg sm:text-xl font-black text-white">
                                            Let's create something beautiful together.
                                        </h4>
                                        <p className="text-xs sm:text-sm text-white/60">
                                            Available for live gigs, private events, cafe sessions & creative collaborations.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsCommissionModalOpen(true)}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-black text-xs rounded-xl shadow-xl shadow-purple-500/30 active:scale-95 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                                    >
                                        <Sparkles size={16} /> Hire {profile.name?.split(' ')[0]}
                                    </button>
                                </div>
                            </>
                        )}

                        {activeTab === 'gigs' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-white">Selected Gigs & History ({selectedGigs.length})</h3>
                                {selectedGigs.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedGigs.map(gig => (
                                            <div key={gig._id} className="p-4 bg-[#0f0f18] border border-purple-500/30 rounded-2xl space-y-2">
                                                <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                                                    ✓ Selected & Confirmed
                                                </span>
                                                <h4 className="font-extrabold text-white text-sm">{gig.title}</h4>
                                                <p className="text-xs text-white/50">{gig.location}</p>
                                                <p className="text-xs text-purple-300 font-bold">{new Date(gig.date).toLocaleDateString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-white/40 italic">No selected performance history found.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'portfolio' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-black text-white">Full Portfolio & Artworks ({posts.length})</h3>
                                {posts.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {posts.map(post => (
                                            <div key={post._id} className="rounded-xl overflow-hidden bg-white/5 border border-white/10 aspect-square">
                                                {post.image ? <img src={post.image} alt="" className="w-full h-full object-cover" /> : <div className="p-3 text-xs text-white/60">{post.content}</div>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-white/40 italic">No portfolio items posted yet.</p>
                                )}
                            </div>
                        )}

                        {activeTab === 'reviews' && (
                            <div className="space-y-4 p-6 bg-[#0f0f18] border border-white/10 rounded-2xl">
                                <h3 className="text-lg font-black text-white">Artist Reviews & Feedback</h3>
                                <p className="text-xs text-white/40 italic">No reviews published yet for this artist.</p>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="space-y-6">
                                <div className="p-6 bg-[#0f0f18] border border-white/10 rounded-2xl space-y-3">
                                    <h3 className="text-lg font-black text-white">About {profile.name}</h3>
                                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">{artistBio}</p>
                                </div>
                                {products.length > 0 && (
                                    <div className="p-6 bg-[#0f0f18] border border-white/10 rounded-2xl space-y-4">
                                        <h3 className="text-lg font-black text-white">Seller Marketplace Items ({products.length})</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {products.map(p => <ProductCard key={p._id} product={p} onDelete={() => { }} />)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR (1/3 width) */}
                    <div className="space-y-6">
                        {/* About Me Card */}
                        <div className="p-5 bg-[#0e0e17] border border-white/10 rounded-2xl space-y-2 shadow-xl">
                            <h4 className="text-xs font-black uppercase tracking-wider text-purple-400">About Me</h4>
                            <p className="text-xs text-white/70 leading-relaxed line-clamp-4 font-normal">
                                {artistBio}
                            </p>
                        </div>

                        {/* Skills & Genres Tag Cloud */}
                        <div className="p-5 bg-[#0e0e17] border border-white/10 rounded-2xl space-y-3 shadow-xl">
                            <h4 className="text-xs font-black uppercase tracking-wider text-purple-400">Skills & Genres</h4>
                            <div className="flex flex-wrap gap-1.5">
                                {skillsList.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 hover:bg-purple-500/20 border border-white/10 text-white/90 text-xs font-bold rounded-lg transition-colors">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Availability Card */}
                        <div className="p-5 bg-[#0e0e17] border border-purple-500/20 rounded-2xl space-y-2 shadow-xl">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-black uppercase tracking-wider text-purple-400">Availability</h4>
                                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Open for Gigs
                                </span>
                            </div>
                            <p className="text-xs text-white/60">
                                Available for live gigs, acoustic sessions, events & collaborations.
                            </p>
                        </div>

                        {/* Connect Card */}
                        <div className="p-5 bg-[#0e0e17] border border-white/10 rounded-2xl space-y-3 shadow-xl">
                            <h4 className="text-xs font-black uppercase tracking-wider text-purple-400">Connect</h4>
                            <div className="flex items-center gap-3">
                                {profile.socialLinks?.instagram ? (
                                    <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2.5 bg-white/5 hover:bg-pink-600/20 text-white rounded-xl transition-all">
                                        📸
                                    </a>
                                ) : (
                                    <span className="p-2.5 bg-white/5 text-white/40 rounded-xl">📸</span>
                                )}
                                {profile.socialLinks?.youtube ? (
                                    <a href={profile.socialLinks.youtube} target="_blank" rel="noreferrer" className="p-2.5 bg-white/5 hover:bg-red-600/20 text-white rounded-xl transition-all">
                                        🎥
                                    </a>
                                ) : (
                                    <span className="p-2.5 bg-white/5 text-white/40 rounded-xl">🎥</span>
                                )}
                                <a href={`mailto:${profile.email}`} className="p-2.5 bg-white/5 hover:bg-purple-600/20 text-white rounded-xl transition-all">
                                    <Mail size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CommissionModal
                isOpen={isCommissionModalOpen}
                onClose={() => setIsCommissionModalOpen(false)}
                artist={profile}
            />

            <Footer />
        </div>
    );
};

export default PublicProfile;
