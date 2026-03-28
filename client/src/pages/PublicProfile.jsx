import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { MapPin, Brush, Award, Calendar, Mail, Phone, Loader2, ArrowLeft, Share2, Star } from 'lucide-react';
import api from '../utils/api';

const defaultCover = "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=2564&auto=format&fit=crop";

export const PublicProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                setProfile(res.data.user);
            } catch (err) {
                setError("Artist not found or wandering in the woods.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

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
                <Link to="/community" className="text-amber-500 hover:underline flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Community
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#030303] min-h-screen text-white font-sans">
            <Navbar />

            <div className="w-full h-[300px] md:h-[400px] relative">
                <img
                    src={defaultCover}
                    alt="Cover"
                    className="w-full h-full object-cover opacity-60"
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

                    <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                            Connect
                        </button>
                        <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all">
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
                            <h3 className="text-xl font-bold mb-4">Recent Artworks</h3>
                            <div className="h-40 border-2 border-dashed border-white/10 rounded-2xl flex items-center justify-center text-white/30">
                                Portfolio integration coming soon...
                            </div>
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