import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MapPin, Brush, Award, Calendar, Mail, Phone, Loader2, ArrowLeft, Share2, Star } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const getCoverImage = (role, style, name) => {
    const r = (role || '').toLowerCase();
    const s = (style || '').toLowerCase();
    const index = name ? name.length % 3 : 0;

    const fashion = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=2564&auto=format&fit=crop"
    ];
    const music = [
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1470229722913-7c092bb4ace4?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2564&auto=format&fit=crop"
    ];
    const art = [
        "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2564&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=2564&auto=format&fit=crop"
    ];

    if (r.includes('model') || s.includes('fashion') || r.includes('actor')) return fashion[index];
    if (r.includes('music') || r.includes('singer') || r.includes('band')) return music[index];
    return art[index];
};

export const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user')) || {};
    const isMyProfile = currentUser.id === id || currentUser._id === id;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/users/profile/${id}`);
                setProfile(res.data.user);
                setPosts(res.data.posts || []);
            } catch (err) {
                setError("Artist not found or wandering in the woods.");
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

    const handleCallout = () => {
        toast.success(`Callout sent! ${profile?.name} has been notified. 📣`, { icon: '🔥' });
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Profile link copied to clipboard! 📋");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030303] flex items-center justify-center">
                <Loader2 className="animate-spin text-amber-500" size={40} />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-[#030303] text-white flex flex-col items-center justify-center">
                <Navbar />
                <h2 className="text-2xl font-bold text-white/50 mb-4">{error}</h2>
                <button onClick={() => navigate(-1)} className="text-amber-500 hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="bg-[#030303] min-h-screen text-white font-sans overflow-x-hidden">
            <Navbar />
            <div className="w-full h-[300px] md:h-[400px] relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-20 md:top-24 left-4 md:left-8 z-20 flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/80 text-white font-medium rounded-full backdrop-blur-md transition-all border border-white/20 shadow-lg"
                >
                    <ArrowLeft size={18} /> Back
                </button>

                <img
                    src={getCoverImage(profile.role, profile.artStyle, profile.name)}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/40 to-transparent"></div>
            </div>

            <div className="max-w-[1000px] mx-auto px-6 relative -mt-32 pb-24 z-10">

                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8 text-center md:text-left">
                    <div className="w-40 h-40 rounded-full border-4 border-[#030303] bg-[#111] overflow-hidden shadow-2xl shadow-amber-500/20">
                        {profile.profilePic ? (
                            <img src={profile.profilePic} alt={profile.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-500 font-black text-5xl">
                                {profile.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    <div className="flex-1 mb-2">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
                            {profile.name}
                        </h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            {profile.role && (
                                <span className="px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sm font-semibold text-white/90 shadow-sm">
                                    {profile.role}
                                </span>
                            )}
                            {profile.artStyle && (
                                <span className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-sm font-bold text-amber-400 flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                                    <Star size={14} className="fill-amber-400" /> {profile.artStyle}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full md:w-auto mt-4 md:mt-0">
                        {!isMyProfile ? (
                            <>
                                <button
                                    onClick={handleFollow}
                                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 border ${isFollowing
                                        ? 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                                        : 'bg-amber-500 text-black border-amber-500 hover:bg-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                        }`}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>

                                <button
                                    onClick={handleCallout}
                                    className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                                >
                                    📣 Send Callout
                                </button>
                            </>
                        ) : (
                            <Link to="/settings" className="flex-1 md:flex-none px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all border border-white/10 flex items-center justify-center">
                                Edit Profile
                            </Link>
                        )}

                        <button onClick={handleShare} className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all active:scale-95">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">

                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-3xl p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Brush className="text-amber-500" /> The Artist's Story
                            </h3>
                            <p className="text-white/70 leading-relaxed text-lg whitespace-pre-wrap">
                                {profile.bio || "This artist is busy creating their next masterpiece. Check back later for their story!"}
                            </p>
                        </div>

                        <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-3xl p-8 shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Award className="text-amber-500" /> Recent Artworks
                            </h3>

                            {posts && posts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {posts.map((post) => (
                                        <div key={post._id} className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#111] aspect-square">
                                            {post.image ? (
                                                <img
                                                    src={post.image}
                                                    alt="Artwork"
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center p-6 text-center text-white/70">
                                                    <p className="line-clamp-4">{post.content}</p>
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                                <p className="text-white font-medium text-sm line-clamp-2">{post.content}</p>
                                                <p className="text-amber-500 text-xs mt-2 font-bold">
                                                    {new Date(post.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/30 bg-white/[0.02]">
                                    <Brush size={32} className="mb-2 opacity-50" />
                                    <p>No artworks posted yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">

                        <div className="bg-gradient-to-br from-[#111] to-[#050505] border border-white/[0.05] rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-[50px]"></div>
                            <h4 className="text-sm text-white/40 font-bold tracking-wider uppercase mb-5">Heritage & Stats</h4>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60"><MapPin size={18} /></div>
                                    <div>
                                        <p className="text-xs text-white/40">Origin</p>
                                        <p className="font-medium text-white/90">{profile.originLocation || 'World Citizen'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60"><Award size={18} /></div>
                                    <div>
                                        <p className="text-xs text-white/40">Experience</p>
                                        <p className="font-medium text-white/90">{profile.experience || 'Rising Talent'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60"><Calendar size={18} /></div>
                                    <div>
                                        <p className="text-xs text-white/40">Joined Artify</p>
                                        <p className="font-medium text-white/90">{new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a] border border-white/[0.05] rounded-3xl p-6 shadow-xl">
                            <h4 className="text-sm text-white/40 font-bold tracking-wider uppercase mb-5">Connect</h4>
                            <div className="space-y-3">
                                <a href={`mailto:${profile.email}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
                                    <Mail size={18} className="text-white/40 group-hover:text-amber-500 transition-colors" />
                                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">Send an Email</span>
                                </a>
                                {profile.phoneNumber && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer">
                                        <Phone size={18} className="text-white/40 group-hover:text-green-500 transition-colors" />
                                        <span className="text-sm text-white/70 group-hover:text-white transition-colors">{profile.phoneNumber}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};