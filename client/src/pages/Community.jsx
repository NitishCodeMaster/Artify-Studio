import React from 'react';
import { Users, MessageSquare, Heart, Share2, Award, Zap, ArrowRight, Music, PenTool, Mic } from 'lucide-react';
<img
  src={item.avatar}
  alt={item.author}
  className="w-12 h-12 rounded-full border border-white/10"
/>

// --- DUMMY DATA ---
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

const topCreators = [
  { name: "Priya Art", role: "Visual Artist", icon: PenTool, img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" },
  { name: "Sam Drummer", role: "Musician", icon: Music, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name: "Vicky Vox", role: "Vocalist", icon: Mic, img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&q=80" },
];

function Community() {
  return (
    <section className="relative py-24 bg-[#050505] overflow-hidden">

      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* --- HEADER --- */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <Users size={16} className="text-indigo-400" />
            <span className="text-xs font-bold text-indigo-400 tracking-widest uppercase">The Tribe</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white font-playfair mb-6">
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

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid lg:grid-cols-3 gap-10">

          {/* LEFT COLUMN: Trending Discussions (Takes 2 columns space) */}
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

          {/* RIGHT COLUMN: Sidebar (Top Creators & Stats) */}
          <div className="space-y-8">

            {/* Featured Creators Card */}
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

              <button className="w-full py-3 rounded-full bg-white text-black font-bold flex items-center justify-center gap-2 group-hover:scale-105 transition-transform">
                Create Post <ArrowRight size={16} />
              </button>
            </div>

          </div>
        </div>

        {/* --- STATS STRIP --- */}
        <div className="mt-20 border-t border-white/10 pt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Artists", value: "10k+" },
              { label: "Daily Discussions", value: "500+" },
              { label: "Collabs Formed", value: "1.2k" },
              { label: "Countries", value: "15+" },
            ].map((stat, index) => (
              <div key={index}>
                <h4 className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</h4>
                <p className="text-sm text-white/40 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}a
          </div>
        </div>

      </div>
    </section>
  );
}
export default Community;