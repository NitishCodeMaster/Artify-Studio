import React, { useState, useEffect } from 'react';
import { Award, Music, PenTool, Mic, ArrowRight, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export function CreatorSidebar() {
    const [creators, setCreators] = useState([]);
    const [followingArtists, setFollowingArtists] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                const res = await api.get('/users/top-creators');
                setCreators(res.data.creators);
            } catch (error) {
                console.error("Error fetching top creators:", error);
            }
        };
        fetchCreators();
    }, []);

    const getIcon = (role) => {
        if (role?.toLowerCase().includes('music')) return Music;
        if (role?.toLowerCase().includes('vocal')) return Mic;
        return PenTool;
    };

    const handleFollowToggle = (e, creatorId, creatorName) => {
        e.stopPropagation();

        const isCurrentlyFollowing = followingArtists[creatorId];

        if (isCurrentlyFollowing) {
            toast(`Unfollowed ${creatorName}`, { icon: '👋', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
        } else {
            toast.success(`You are now following ${creatorName}! 🌟`);
        }

        setFollowingArtists(prev => ({
            ...prev,
            [creatorId]: !isCurrentlyFollowing
        }));
    };

    const handleLeaderboard = () => {
        toast("Top Artists Leaderboard is updating live! 🏆", { icon: '🔥', style: { borderRadius: '10px', background: '#333', color: '#fff' } });
    };

    const handleCallout = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.success("Ready to Collab? Type your Callout and post it! 📣", {
            style: { borderRadius: '10px', background: '#4f46e5', color: '#fff', border: '1px solid #6366f1' }
        });
    };

    return (
        <div className="space-y-8 sticky top-24">

            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/10 backdrop-blur-md shadow-xl shadow-indigo-500/5">
                <div className="flex items-center gap-2 mb-6">
                    <Award size={20} className="text-amber-500" />
                    <h3 className="text-lg font-bold text-white">Suggested Artists</h3>
                </div>

                <div className="space-y-4">
                    {creators.length > 0 ? creators.map((creator, i) => {
                        const Icon = getIcon(creator.role);
                        const isFollowing = followingArtists[creator._id];

                        return (
                            <div
                                key={creator._id || i}
                                onClick={() => navigate(`/profile/${creator._id}`)}
                                className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group border border-transparent hover:border-white/10"
                            >
                                <div className="relative">
                                    {creator.profilePic ? (
                                        <img src={creator.profilePic} alt={creator.name} className="w-10 h-10 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                            <UserCircle2 size={24} className="text-indigo-400" />
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0f0f0f] flex items-center justify-center border border-white/10">
                                        <Icon size={10} className="text-amber-500" />
                                    </div>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h5 className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors">{creator.name}</h5>
                                    <p className="text-xs text-white/40 truncate">{creator.role || "Community Member"}</p>
                                </div>

                                <button
                                    onClick={(e) => handleFollowToggle(e, creator._id, creator.name)}
                                    className={`text-[11px] font-bold px-3 py-1.5 rounded-full transition-all shadow-lg active:scale-95 ${isFollowing
                                        ? 'bg-white/10 text-white/70 border border-white/20'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20 border border-transparent'
                                        }`}
                                >
                                    {isFollowing ? 'Following' : 'Follow'}
                                </button>
                            </div>
                        )
                    }) : (
                        <p className="text-white/40 text-sm text-center py-4">No top creators found yet.</p>
                    )}
                </div>

                <button
                    onClick={handleLeaderboard}
                    className="w-full mt-6 py-3 rounded-xl border border-dashed border-white/10 text-white/40 text-sm hover:text-white hover:border-white/30 transition-all bg-black/20"
                >
                    View Leaderboard
                </button>
            </div>

            <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
                <h3 className="text-2xl font-black text-white mb-2 relative z-10 tracking-tight">Collab?</h3>
                <p className="text-sm text-white/50 mb-6 relative z-10 leading-relaxed">
                    Find perfect collaborators for your next big masterpiece.
                </p>
                <button
                    onClick={handleCallout}
                    className="w-full py-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold flex items-center justify-center gap-2 group-hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] relative z-10"
                >
                    Create a Callout <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}