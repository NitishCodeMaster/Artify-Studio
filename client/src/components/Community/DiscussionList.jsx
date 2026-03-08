import React from 'react';
import { Zap, MessageSquare, Heart } from 'lucide-react';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';

const discussions = [
    {
        id: 1,
        title: "Looking for a Bassist for Indie Rock Band",
        author: "Arjun Verma",
        category: "Collaboration",
        replies: 24,
        likes: 156,
        time: "2h ago",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80",
        tagColor: "text-blue-400 bg-blue-500/10 border-blue-500/20"
    },
    {
        id: 2,
        title: "Best budget acrylic paints for beginners?",
        author: "Sara Khan",
        category: "Art Talk",
        replies: 45,
        likes: 89,
        time: "5h ago",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
        tagColor: "text-pink-400 bg-pink-500/10 border-pink-500/20"
    },
    {
        id: 3,
        title: "Feedback on my latest Lo-Fi beat",
        author: "Rohan Beats",
        category: "Critique",
        replies: 12,
        likes: 230,
        time: "1d ago",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
        tagColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
    }
];

export function DiscussionList() {
    return (
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Zap size={24} className="text-yellow-500" /> Trending Now
                </h3>
                <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300">View All</a>
            </div>

            {discussions.map((item) => (
                <div key={item.id} className="group p-6 rounded-2xl bg-[#0f0f0f] border border-white/5 hover:border-indigo-500/30 transition-all hover:shadow-lg hover:shadow-indigo-500/5">
                    <div className="flex items-start gap-4">
                        <ImageWithFallback src={item.avatar} alt={item.author} className="w-12 h-12 rounded-full border border-white/10" />

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${item.tagColor}`}>
                                    {item.category}
                                </span>
                                <span className="text-xs text-white/30">{item.time}</span>
                            </div>

                            <h4 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors cursor-pointer">
                                {item.title}
                            </h4>

                            <div className="flex items-center gap-6 text-sm text-white/40 mt-4">
                                <div className="flex items-center gap-2">
                                    <MessageSquare size={16} /> {item.replies} Replies
                                </div>
                                <div className="flex items-center gap-2">
                                    <Heart size={16} /> {item.likes} Likes
                                </div>
                                <div className="ml-auto text-white/60 text-xs">
                                    Posted by <span className="text-white font-medium">{item.author}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}