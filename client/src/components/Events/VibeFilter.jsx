import React from 'react';
import { Zap, Heart, Music, PartyPopper } from 'lucide-react';

const vibes = [
    { id: 'all', label: 'All Shows', icon: Music, color: 'group-hover:text-white', activeColor: 'text-white' },
    { id: 'Music', label: 'Music Gigs', icon: Zap, color: 'group-hover:text-yellow-400', activeColor: 'text-yellow-400' },
    { id: 'Dance', label: 'Dance Shows', icon: PartyPopper, color: 'group-hover:text-purple-500', activeColor: 'text-purple-500' },
    { id: 'Art', label: 'Art & Painting', icon: Heart, color: 'group-hover:text-pink-500', activeColor: 'text-pink-500' },
];

const VibeFilter = ({ activeVibe, setActiveVibe }) => {
    return (
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar">
            {vibes.map((vibe) => {
                const isActive = activeVibe === vibe.id;
                const Icon = vibe.icon;

                return (
                    <button
                        key={vibe.id}
                        onClick={() => setActiveVibe(vibe.id)} 
                        className={`group relative flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 min-w-max ${isActive
                                ? 'bg-white/10 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                : 'bg-[#111] border-white/10 text-white/50 hover:border-white/30 hover:text-white'
                            }`}
                    >
                        <Icon
                            size={16}
                            className={`transition-colors duration-300 ${isActive
                                    ? vibe.activeColor
                                    : `text-white/50 ${vibe.color}` // Hover par ye color trigger hoga
                                }`}
                        />

                        <span className="text-xs font-bold uppercase tracking-wider">{vibe.label}</span>

                        {isActive && (
                            <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default VibeFilter;