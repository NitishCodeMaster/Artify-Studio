import React from 'react';
import { Calendar, Users, ArrowRight } from 'lucide-react';

const workshops = [
    {
        id: 1,
        title: "Mastering Watercolor Textures",
        tutor: "With Elena R.",
        date: "Tomorrow, 5:00 PM",
        attendees: 140,
        tags: ["Art", "Live"],
        color: "from-blue-600 to-cyan-600"
    },
    {
        id: 2,
        title: "Music Production 101: FL Studio",
        tutor: "With DJ Kronik",
        date: "Sat, 24 Feb, 8:00 PM",
        attendees: 320,
        tags: ["Music", "Tech"],
        color: "from-purple-600 to-pink-600"
    }
];

export function LiveWorkshops() {
    return (
        <div>
            <h3 className="text-3xl font-bold text-white mb-10 px-4">Upcoming Live Masterclasses</h3>

            <div className="grid md:grid-cols-2 gap-6">
                {workshops.map((ws) => (
                    <div key={ws.id} className="relative overflow-hidden rounded-3xl border border-white/10 group cursor-pointer">
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${ws.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>

                        <div className="relative p-8 flex flex-col h-full">
                            <div className="flex gap-2 mb-4">
                                {ws.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <h4 className="text-2xl font-bold text-white mb-2 max-w-sm">{ws.title}</h4>
                            <p className="text-white/60 mb-8">{ws.tutor}</p>

                            <div className="mt-auto flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2 text-sm text-white/80">
                                        <Calendar size={16} className="text-pink-400" /> {ws.date}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-white/50">
                                        <Users size={16} /> {ws.attendees} Registered
                                    </div>
                                </div>

                                <button className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}