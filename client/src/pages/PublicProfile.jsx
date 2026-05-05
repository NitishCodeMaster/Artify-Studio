import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { MapPin, Brush, Award, Calendar, Mail, Phone, Loader2, ArrowLeft, Share2, Star, Sparkles, Users, Layers3 } from 'lucide-react';
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
                <h2 className="text-2xl font-bold text-white/50 mb-4">{error}</h2>
                <button onClick={() => navigate(-1)} className="text-amber-500 hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Go Back
                </button>
            </div>
        );
    }

    const coverImage = getCoverImage(profile.role, profile.artStyle, profile.name);
    const joinedLabel = new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen overflow-x-hidden bg-[#030303] font-sans text-white">
            <div className="relative overflow-hidden border-b border-white/10 bg-[#050506]">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:54px_54px]" />
                <div className="absolute left-1/2 top-0 h-72 w-[min(900px,90vw)] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[110px]" />

                <div className="relative z-10 mx-auto max-w-[1180px] px-4 pb-10 pt-5 sm:px-6 lg:pt-7">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-5 flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white"
                    >
                        <ArrowLeft size={17} /> Back
                    </button>

                    <div className="grid overflow-hidden rounded-[1.6rem] border border-white/10 bg-[linear-gradient(135deg,rgba(18,18,20,0.96),rgba(7,7,9,0.98))] shadow-[0_24px_80px_rgba(0,0,0,0.42)] lg:grid-cols-[0.72fr_1fr]">
                        <div className="relative min-h-[260px] border-b border-white/10 bg-[#111] lg:min-h-[420px] lg:border-b-0 lg:border-r">
                            <img src={coverImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/30 to-transparent" />
                            <div className="absolute bottom-5 left-5 right-5 flex items-end gap-4">
                                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[1.4rem] border border-white/20 bg-[#111] p-1 shadow-2xl shadow-black/50">
                                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[1.05rem] bg-[#0d0d0f]">
                                        {profile.profilePic ? (
                                            <img src={profile.profilePic} alt={profile.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-amber-500/10 text-4xl font-black text-amber-500">
                                                {profile.name?.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="mb-2 inline-flex rounded-full border border-amber-400/25 bg-black/35 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200 backdrop-blur-md">
                                        Artist Identity
                                    </p>
                                    <p className="truncate text-sm text-white/65">{profile.originLocation || 'Creative Network'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 sm:p-7 lg:p-8">
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                                <Sparkles size={12} className="text-amber-400" />
                                Creative Profile
                            </div>
                            <h1 className="mb-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                                {profile.name}
                            </h1>
                            <div className="mb-5 flex flex-wrap items-center gap-2">
                                {profile.role && (
                                    <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-sm font-semibold text-white/90 shadow-sm">
                                        {profile.role}
                                    </span>
                                )}
                                {profile.artStyle && (
                                    <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-sm font-bold text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                                        <Star size={14} className="fill-amber-400" /> {profile.artStyle}
                                    </span>
                                )}
                            </div>

                            <p className="mb-6 max-w-2xl text-base leading-relaxed text-white/58">
                                {profile.bio || 'This artist is shaping their creative story on Artify.'}
                            </p>

                            <div className="mb-6 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
                                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
                                        <MapPin size={13} />
                                        Origin
                                    </div>
                                    <div className="font-semibold text-white">{profile.originLocation || 'World Citizen'}</div>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
                                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
                                        <Award size={13} />
                                        Experience
                                    </div>
                                    <div className="font-semibold text-white">{profile.experience || 'Rising Talent'}</div>
                                </div>
                                <div className="rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3">
                                    <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
                                        <Calendar size={13} />
                                        Joined
                                    </div>
                                    <div className="font-semibold text-white">{joinedLabel}</div>
                                </div>
                            </div>

                            <div className="flex w-full flex-wrap gap-2">
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
                                    className="flex-1 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all active:scale-95 hover:bg-indigo-500 md:flex-none"
                                >
                                    Send Callout
                                </button>
                            </>
                        ) : (
                            <Link to="/settings" className="flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/10 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/20 md:flex-none">
                                Edit Profile
                            </Link>
                        )}

                        <button onClick={handleShare} className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-white transition-all active:scale-95 hover:bg-white/10">
                            <Share2 size={20} />
                        </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-[1180px] px-4 pb-16 pt-8 sm:px-6">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                    <div className="space-y-5 lg:col-span-2">
                        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5 shadow-xl md:p-6">
                            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
                                <Brush className="text-amber-500" /> The Artist's Story
                            </h3>
                            <p className="whitespace-pre-wrap text-base leading-relaxed text-white/70">
                                {profile.bio || "This artist is busy creating their next masterpiece. Check back later for their story!"}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5 shadow-xl md:p-6">
                            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold">
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

                    <div className="space-y-5">

                        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-[#111] to-[#050505] p-5 shadow-xl">
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
                                        <p className="font-medium text-white/90">{joinedLabel}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5 shadow-xl">
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

                        <div className="rounded-2xl border border-white/[0.06] bg-[#0a0a0a] p-5 shadow-xl">
                            <h4 className="mb-5 text-sm font-bold uppercase tracking-wider text-white/40">Creative Pulse</h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-amber-400">
                                        <Layers3 size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/40">Posts Shared</p>
                                        <p className="font-semibold text-white">{posts.length}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-indigo-400">
                                        <Users size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-white/40">Community Presence</p>
                                        <p className="font-semibold text-white">{profile.role || 'Creative Member'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};
