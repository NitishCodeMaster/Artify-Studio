import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MessageSquare, Palette, Mic2, Handshake } from 'lucide-react';

export function CommunityHero({ discussionRef, groupsRef }) {
    const navigate = useNavigate();

    const handleJoinClick = () => {
        if (discussionRef?.current) {
            discussionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleExploreClick = () => {
        navigate('/discover');
    };

    return (
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] mb-14">

            <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-5 backdrop-blur-md">
                    <Users size={16} className="text-indigo-400" />
                    <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">The Tribe</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black text-white font-playfair mb-5 leading-tight">
                    Connect, Collaborate <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                        & Create Together
                    </span>
                </h2>
                <p className="text-lg text-white/40 leading-relaxed max-w-2xl">
                    Join artists sharing knowledge, finding gig partners, and building the future of art.
                </p>

                <div className="mt-7 flex flex-wrap gap-4">

                    <button
                        onClick={handleJoinClick}
                        className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-indigo-50 transition-all flex items-center gap-2"
                    >
                        Join Discussion
                        <MessageSquare size={18} />
                    </button>
                    <button
                        onClick={() => navigate('/discover')}
                        className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                    >
                        Explore Groups
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {[
                    { icon: Palette, title: 'Art Feedback', text: 'Share drafts and get practical notes.' },
                    { icon: Mic2, title: 'Gig Partners', text: 'Find singers, players, and creators nearby.' },
                    { icon: Handshake, title: 'Collab Calls', text: 'Post a callout and build together.' },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 backdrop-blur-md">
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
                                <Icon size={20} />
                            </div>
                            <h3 className="font-bold text-white">{item.title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-white/45">{item.text}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
