import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Compass, Lightbulb, MessageCircle, RotateCcw, Sparkles, X } from 'lucide-react';

const routePulse = {
    '/': {
        title: 'Creative Spark',
        prompt: 'Pick one idea and turn it into a tiny public draft today.',
        action: 'Explore',
        path: '/discover',
    },
    '/discover': {
        title: 'Discovery Cue',
        prompt: 'Save one creator style you would remix in your own voice.',
        action: 'Community',
        path: '/community',
    },
    '/events': {
        title: 'Stage Cue',
        prompt: 'Find one event that could become your next collaboration.',
        action: 'Learn',
        path: '/learn',
    },
    '/marketplace': {
        title: 'Studio Cue',
        prompt: 'List or bookmark one piece that tells a real story.',
        action: 'Add Product',
        path: '/add-product',
    },
    '/community': {
        title: 'Community Cue',
        prompt: 'Reply to one artist with a useful, specific thought.',
        action: 'Messages',
        path: '/messages',
    },
    '/learn': {
        title: 'Learning Cue',
        prompt: 'Book time with a mentor or create a workshop around one skill.',
        action: 'Settings',
        path: '/settings',
    },
};

const fallbackPulse = {
    title: 'Artify Pulse',
    prompt: 'Move one creative task forward before you leave this page.',
    action: 'Home',
    path: '/',
};

export default function CreativePulse() {
    const location = useLocation();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [hidden, setHidden] = useState(() => localStorage.getItem('artify_pulse_hidden') === 'true');

    const pulse = useMemo(() => {
        const key = Object.keys(routePulse).find((path) => path !== '/' && location.pathname.startsWith(path));
        return routePulse[key] || routePulse[location.pathname] || fallbackPulse;
    }, [location.pathname]);

    if (location.pathname === '/login' || location.pathname === '/signup') {
        return null;
    }

    if (hidden) {
        return (
            <button
                onClick={() => {
                    localStorage.removeItem('artify_pulse_hidden');
                    setHidden(false);
                    setOpen(true);
                }}
                className="fixed bottom-5 right-5 z-[90] flex h-11 items-center gap-2 rounded-full border border-white/10 bg-[#09090c]/85 px-3 text-xs font-bold uppercase tracking-[0.14em] text-white/45 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-all hover:border-indigo-300/40 hover:text-white"
                title="Restore Creative Pulse"
            >
                <RotateCcw size={14} />
                Pulse
            </button>
        );
    }

    return (
        <div className="fixed bottom-5 right-5 z-[90]">
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.97 }}
                        className="mb-3 w-[min(340px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-white/10 bg-[#08080b]/95 shadow-2xl shadow-black/40 backdrop-blur-2xl"
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-4">
                            <div>
                                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-indigo-100">
                                    <Sparkles size={12} />
                                    Live Nudge
                                </div>
                                <h3 className="font-bold text-white">{pulse.title}</h3>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="rounded-full p-1.5 text-white/45 transition-all hover:bg-white/10 hover:text-white"
                                aria-label="Close Creative Pulse"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-4">
                            <div className="mb-4 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                <Lightbulb size={18} className="mt-0.5 shrink-0 text-amber-300" />
                                <p className="text-sm leading-relaxed text-white/65">{pulse.prompt}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        navigate(pulse.path);
                                        setOpen(false);
                                    }}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black transition-all hover:bg-gray-200"
                                >
                                    <Compass size={15} />
                                    {pulse.action}
                                </button>
                                <button
                                    onClick={() => {
                                        localStorage.setItem('artify_pulse_hidden', 'true');
                                        setHidden(true);
                                    }}
                                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-bold text-white/60 transition-all hover:bg-white/[0.08] hover:text-white"
                                >
                                    Hide
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setOpen((prev) => !prev)}
                className="group flex min-h-[52px] items-center gap-3 rounded-full border border-white/10 bg-[#09090c]/90 px-4 py-3 text-white shadow-2xl shadow-black/40 backdrop-blur-2xl transition-all hover:border-indigo-300/40 hover:bg-[#111118]"
            >
                <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-200">
                    <span className="absolute inset-0 rounded-full bg-indigo-400/20 blur-md transition-opacity group-hover:opacity-100" />
                    <MessageCircle size={17} className="relative z-10" />
                </span>
                <span className="hidden text-left sm:block">
                    <span className="block text-xs font-bold uppercase tracking-[0.18em] text-white/35">Pulse</span>
                    <span className="block text-sm font-bold">Need a spark?</span>
                </span>
            </button>
        </div>
    );
}
