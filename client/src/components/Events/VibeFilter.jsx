import React from 'react';
import { Zap, Heart, Music, PartyPopper, Mic, Radio, Sparkles } from 'lucide-react';

const vibes = [
    { id: 'all', label: 'All Shows', icon: Sparkles, color: 'group-hover:text-indigo-400', activeColor: 'text-indigo-400' },
    { id: 'Music', label: 'Music & Bands', icon: Music, color: 'group-hover:text-yellow-400', activeColor: 'text-yellow-400' },
    { id: 'Standup', label: 'Standup & Comedy', icon: Mic, color: 'group-hover:text-emerald-400', activeColor: 'text-emerald-400' },
    { id: 'Dance', label: 'Dance & Theater', icon: PartyPopper, color: 'group-hover:text-purple-400', activeColor: 'text-purple-400' },
    { id: 'Art', label: 'Art & Exhibitions', icon: Heart, color: 'group-hover:text-pink-400', activeColor: 'text-pink-400' },
    { id: 'DJ', label: 'DJ & Nightlife', icon: Radio, color: 'group-hover:text-cyan-400', activeColor: 'text-cyan-400' },
];

const VibeFilter = ({ activeVibe, setActiveVibe }) => {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
            {vibes.map((vibe) => {
                const isActive = activeVibe === vibe.id;
                const Icon = vibe.icon;

                return (
                    <button
                        key={vibe.id}
                        onClick={() => setActiveVibe(vibe.id)}
                        className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-200 min-w-max text-xs font-bold ${
                            isActive
                                ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                                : 'bg-[#111] border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                        }`}
                    >
                        <Icon
                            size={14}
                            className={`transition-colors duration-200 ${
                                isActive ? vibe.activeColor : `text-white/50 ${vibe.color}`
                            }`}
                        />
                        <span>{vibe.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default VibeFilter;