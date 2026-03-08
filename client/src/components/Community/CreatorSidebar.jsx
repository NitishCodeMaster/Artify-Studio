import React from 'react';
import { Award, Music, PenTool, Mic, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../placeholder/ImageWithFallback'; // Path check karein

const topCreators = [
    { name: "Priya Art", role: "Visual Artist", icon: PenTool, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" },
    { name: "Sam Drummer", role: "Musician", icon: Music, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
    { name: "Vicky Vox", role: "Vocalist", icon: Mic, img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&q=80" },
];

export function CreatorSidebar() {
    return (
        <div className="space-y-8">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-6">
                    <Award size={20} className="text-indigo-400" />
                    <h3 className="text-lg font-bold text-white">Top Creators</h3>
                </div>
                
                <div className="space-y-4">
                    {topCreators.map((creator, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="relative">
                                <ImageWithFallback src={creator.img} alt={creator.name} className="w-10 h-10 rounded-full" />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black flex items-center justify-center border border-white/10">
                                    <creator.icon size={10} className="text-white" />
                                </div>
                            </div>
                            <div>
                                <h5 className="text-sm font-bold text-white">{creator.name}</h5>
                                <p className="text-xs text-white/40">{creator.role}</p>
                            </div>
                            <button className="ml-auto text-xs font-bold text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all">
                                Follow
                            </button>
                        </div>
                    ))}
                </div>
                
                <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-white/20 text-white/40 text-sm hover:text-white hover:border-white transition-all">
                    View Leaderboard
                </button>
            </div>

            {/* CTA Box */}
            <div className="p-6 rounded-3xl bg-[#0f0f0f] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all"></div>
                
                <h3 className="text-2xl font-bold text-white mb-2 relative z-10">Start a Project?</h3>
                <p className="text-sm text-white/50 mb-6 relative z-10">
                    Find collaborators for your next big art piece or music album.
                </p>
                
                <button className="w-full py-3 rounded-full bg-white text-black font-bold flex items-center justify-center gap-2 group-hover:scale-105 transition-transform relative z-10">
                    Create Post <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );
}