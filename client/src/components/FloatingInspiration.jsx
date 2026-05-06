import React, { useMemo, useState } from 'react';
import { Lightbulb, RefreshCw, Sparkles, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const QUOTES = [
    'Create even when nobody is watching.',
    'One honest draft is better than ten perfect excuses.',
    'Make the first version small enough to finish today.',
    'Your next idea is hiding inside the work you keep postponing.',
    'A rough note can become a signature sound.',
    'Share the process. The right people notice effort.',
];

const CHALLENGES = [
    'Write a melody in 15 minutes.',
    'Post one unfinished work and ask for 3 specific notes.',
    'Record a 20 second voice intro for your next collaboration.',
    'Remix one old idea with a new mood.',
    'Find one creator and send a clear collaboration idea.',
    'Sketch, hum, or write one thing before scrolling.',
];

const hiddenRoutes = ['/login', '/signup', '/forgot-password'];

export default function FloatingInspiration() {
    const { pathname } = useLocation();
    const [dismissed, setDismissed] = useState(false);
    const [seed, setSeed] = useState(() => Date.now());
    const content = useMemo(() => {
        const quoteIndex = Math.abs(seed) % QUOTES.length;
        const challengeIndex = Math.abs(Math.floor(seed / 7)) % CHALLENGES.length;
        return {
            quote: QUOTES[quoteIndex],
            challenge: CHALLENGES[challengeIndex],
        };
    }, [seed]);

    if (dismissed || hiddenRoutes.some((route) => pathname.startsWith(route))) return null;

    return (
        <div className="fixed right-5 top-[5.8rem] z-[9998] hidden w-[min(340px,calc(100vw-2.5rem))] rounded-2xl border border-white/10 bg-[#0b0b0d]/88 p-4 text-white shadow-2xl shadow-black/35 backdrop-blur-xl lg:block">
            <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/15 text-pink-200">
                        <Sparkles size={17} />
                    </span>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Creative Spark</p>
                        <p className="text-sm font-bold text-white">Fresh on every visit</p>
                    </div>
                </div>
                <button
                    onClick={() => setDismissed(true)}
                    className="rounded-full p-1.5 text-white/35 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Hide creative inspiration"
                >
                    <X size={15} />
                </button>
            </div>

            <p className="text-sm leading-relaxed text-white/72">{content.quote}</p>

            <div className="mt-4 rounded-2xl border border-amber-300/15 bg-amber-400/10 p-3">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                    <Lightbulb size={14} />
                    Today's Creative Challenge
                </div>
                <p className="text-sm font-semibold leading-relaxed text-white">{content.challenge}</p>
            </div>

            <button
                onClick={() => setSeed(Date.now() + Math.floor(Math.random() * 9999))}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-white/65 transition-all hover:bg-white/[0.08] hover:text-white"
            >
                <RefreshCw size={14} />
                New Spark
            </button>
        </div>
    );
}
