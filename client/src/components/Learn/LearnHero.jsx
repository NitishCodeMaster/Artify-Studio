import React from 'react';
import { Search, Sparkles } from 'lucide-react';

export function LearnHero() {
    return (
        <div className="text-center max-w-4xl mx-auto mb-20 px-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md animate-fade-in">
                <Sparkles size={16} className="text-pink-400" />
                <span className="text-xs font-bold text-pink-400 tracking-widest uppercase">Master Your Craft</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-white font-playfair mb-8 leading-tight">
                Learn from the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                    Legends of Art
                </span>
            </h2>

            <p className="text-lg text-white/40 leading-relaxed max-w-2xl mx-auto mb-10">
                Book 1-on-1 mentorship sessions, join live masterclasses, and level up your skills with verified pros.
            </p>
 
            <div className="relative max-w-xl mx-auto group">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-full p-2 pl-6 shadow-2xl">
                    <Search className="text-white/40 mr-3" size={20} />
                    <input
                        type="text"
                        placeholder="What do you want to learn? (e.g. Guitar, Oil Painting)"
                        className="bg-transparent text-white w-full focus:outline-none placeholder-white/30"
                    />
                    <button className="bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors">
                        Find Mentor
                    </button>
                </div>
            </div>
        </div>
    );
}