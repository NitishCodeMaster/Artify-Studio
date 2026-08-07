import React, { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Clipboard, Compass, Flame, Handshake, Lightbulb, MessageSquare, Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const MISSIONS = [
    {
        id: 'feedback-sprint',
        label: 'Need Feedback',
        title: 'Share unfinished work and ask people for 3 clear suggestions.',
        description: 'Best when you want help improving a song, design, artwork, or idea.',
        category: 'Art Feedback',
        time: '15 min',
        reward: 'Better draft',
        icon: Lightbulb,
        accent: 'from-amber-400/20 to-pink-500/10',
    },
    {
        id: 'collab-call',
        label: 'Find Partner',
        title: 'Tell creators what skill you need and what you want to build.',
        description: 'Best when you need a singer, guitarist, designer, editor, or teammate.',
        category: 'Looking for Band',
        time: '10 min',
        reward: 'New partner',
        icon: Handshake,
        accent: 'from-indigo-400/20 to-cyan-500/10',
    },
    {
        id: 'gig-signal',
        label: 'Find Gig',
        title: 'Post what kind of gig, event, or paid work you are looking for.',
        description: 'Best when you want people to connect you with real opportunities.',
        category: 'Gigs',
        time: '8 min',
        reward: 'Useful leads',
        icon: Flame,
        accent: 'from-rose-400/20 to-orange-500/10',
    },
];

export function CreativeMissions({ onUseMission, discussionRef }) {
    const [activeId, setActiveId] = useState(MISSIONS[0].id);
    const activeMission = useMemo(() => MISSIONS.find((mission) => mission.id === activeId) || MISSIONS[0], [activeId]);

    const handleUseMission = () => {
        localStorage.setItem('artify_active_mission', activeMission.id);
        onUseMission?.({
            id: `${activeMission.id}-${Date.now()}`,
            category: activeMission.category,
            text: `${activeMission.title}\n\nDetails:\n- I am working on:\n- I need help with:\n- People can contact me by: `,
        });
        discussionRef?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toast.success('Mission draft ready in discussion composer.');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(activeMission.title);
            toast.success('Mission prompt copied.');
        } catch {
            toast.error('Failed to copy prompt.');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45 }}
            className="mb-10 rounded-[1.5rem] border border-white/10 bg-[#090909] p-4 shadow-2xl shadow-indigo-500/5 sm:p-5"
        >
            <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-500/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-100">
                        <Compass size={14} />
                        What to do here?
                    </div>
                    <h3 className="text-2xl font-black leading-tight text-white sm:text-3xl">Choose a goal before you post.</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/45">
                        This section helps users understand what to post. Pick one goal and Artify fills the discussion box with a useful starter.
                    </p>
                    <div className="mt-5 grid gap-2 text-sm text-white/55 sm:grid-cols-3 lg:grid-cols-1">
                        {['Choose your goal', 'Review the starter text', 'Post it for the community'].map((step, index) => (
                            <div key={step} className="flex items-center gap-2 rounded-xl bg-white/[0.035] px-3 py-2">
                                <CheckCircle2 size={15} className="text-emerald-300" />
                                <span>{index + 1}. {step}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[0.95fr_1.05fr]">
                    <div className="space-y-3">
                        {MISSIONS.map((mission) => {
                            const Icon = mission.icon;
                            const isActive = mission.id === activeId;
                            return (
                                <button
                                    key={mission.id}
                                    onClick={() => setActiveId(mission.id)}
                                    className={`w-full rounded-2xl border p-4 text-left transition-all ${isActive ? 'border-indigo-300/40 bg-indigo-500/10 text-white' : 'border-white/10 bg-white/[0.025] text-white/55 hover:bg-white/[0.05] hover:text-white'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${mission.accent}`}>
                                            <Icon size={18} />
                                        </span>
                                        <span>
                                            <span className="block text-sm font-bold">{mission.label}</span>
                                            <span className="mt-1 block text-xs text-white/40">{mission.category}</span>
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className={`flex min-h-[270px] flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-br ${activeMission.accent} p-5`}>
                        <div>
                            <div className="mb-4 flex flex-wrap gap-2 text-xs font-bold text-white/65">
                                <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-3 py-1">
                                    <Timer size={13} />
                                    {activeMission.time}
                                </span>
                                <span className="rounded-full bg-black/25 px-3 py-1">{activeMission.reward}</span>
                            </div>
                            <p className="text-xl font-black leading-snug text-white">{activeMission.title}</p>
                            <p className="mt-3 text-sm leading-relaxed text-white/55">{activeMission.description}</p>
                            <p className="mt-3 text-sm text-white/45">Category: {activeMission.category}</p>
                        </div>

                        <div className="mt-6 grid gap-3 sm:grid-cols-2">
                            <button
                                onClick={handleUseMission}
                                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-black transition-all hover:bg-indigo-50"
                            >
                                <MessageSquare size={16} />
                                Fill Post Box
                                <ArrowRight size={15} />
                            </button>
                            <button
                                onClick={handleCopy}
                                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-white transition-all hover:bg-black/40"
                            >
                                <Clipboard size={16} />
                                Copy Prompt
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
