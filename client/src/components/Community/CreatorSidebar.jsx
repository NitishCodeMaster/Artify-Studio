import React, { useState, useEffect } from 'react';
import { Award, Music, PenTool, Mic, MessageSquarePlus, Search, Sparkles, UserCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const POST_TEMPLATES = [
    {
        title: 'Find a collaborator',
        category: 'Looking for Band',
        text: 'I am looking for a collaborator for: \n\nSkill needed: \nTimeline: \nReference/inspiration: ',
        icon: Search,
    },
    {
        title: 'Ask for feedback',
        category: 'Art Feedback',
        text: 'I need feedback on this work.\n\nWhat I want feedback on:\n1. \n2. \n3. ',
        icon: MessageSquarePlus,
    },
    {
        title: 'Share an opportunity',
        category: 'Gigs',
        text: 'Opportunity/Gig available:\n\nRole needed: \nDate/location: \nHow to apply: ',
        icon: Sparkles,
    },
];

export function CreatorSidebar({ onUseTemplate, discussionRef }) {
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
            toast(`Unfollowed ${creatorName}`, { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
        } else {
            toast.success(`You are now following ${creatorName}.`);
        }

        setFollowingArtists(prev => ({
            ...prev,
            [creatorId]: !isCurrentlyFollowing
        }));
    };

    const handleLeaderboard = () => {
        toast("Top Artists Leaderboard is updating live.", { style: { borderRadius: '10px', background: '#333', color: '#fff' } });
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

            <div className="rounded-3xl border border-white/10 bg-[#0a0a0a] p-5">
                <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">Quick Post Helper</p>
                    <h3 className="mt-2 text-xl font-black text-white">Not sure what to post?</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/45">
                        Pick a ready format. It will fill the discussion box with the right category and structure.
                    </p>
                </div>

                <div className="space-y-2">
                    {POST_TEMPLATES.map((template) => {
                        const Icon = template.icon;
                        return (
                            <button
                                key={template.title}
                                onClick={() => {
                                    onUseTemplate?.({
                                        id: `${template.category}-${Date.now()}`,
                                        category: template.category,
                                        text: template.text,
                                    });
                                    discussionRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    toast.success('Post format ready in composer.');
                                }}
                                className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3 text-left transition-all hover:border-amber-300/30 hover:bg-amber-400/10"
                            >
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300">
                                    <Icon size={18} />
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-sm font-bold text-white">{template.title}</span>
                                    <span className="block text-xs text-white/40">{template.category}</span>
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
