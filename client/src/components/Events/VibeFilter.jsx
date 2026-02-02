import React from 'react';
import { Zap, Coffee, Heart, Briefcase, Music, PartyPopper } from 'lucide-react';

const vibes = [
    { id: 'all', label: 'All Vibes', icon: Music, color: 'text-white' },
    { id: 'hype', label: 'Electric', icon: Zap, color: 'text-yellow-400' },
    { id: 'chill', label: 'Chill & Cozy', icon: Coffee, color: 'text-orange-400' },
    { id: 'date', label: 'Romantic', icon: Heart, color: 'text-pink-500' },
    { id: 'network', label: 'Networking', icon: Briefcase, color: 'text-blue-400' },
    { id: 'party', label: 'After Party', icon: PartyPopper, color: 'text-purple-500' },
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
                        <Icon size={16} className={`${isActive ? vibe.color : 'text-current group-hover:text-white'} transition-colors`} />
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