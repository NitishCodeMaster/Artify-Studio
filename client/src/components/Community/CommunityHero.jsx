import React from 'react';
import { Users, MessageSquare } from 'lucide-react';

export function CommunityHero() {
    return (
        <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                <Users size={16} className="text-indigo-400" />
                <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">The Tribe</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white font-playfair mb-6 leading-tight">
                Connect, Collaborate <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    & Create Together
                </span>
            </h2>
            <p className="text-lg text-white/40 leading-relaxed">
                Join 10,000+ artists sharing knowledge, finding gig partners, and building the future of art.
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-indigo-50 transition-all flex items-center gap-2">
                    Join Discussion
                    <MessageSquare size={18} />
                </button>
                <button className="px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all">
                    Explore Groups
                </button>
            </div>
        </div>
    );
}