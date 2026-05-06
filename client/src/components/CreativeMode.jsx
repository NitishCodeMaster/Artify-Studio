import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CloudRain, Moon, Music2, Pause, Play, Sparkles, Sun, Volume2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const getTimeMood = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
        return {
            key: 'morning',
            label: 'Morning Acoustic',
            icon: Sun,
            gradient: 'from-amber-500/18 via-orange-400/10 to-transparent',
            notes: [196, 246.94, 293.66, 329.63, 392],
            interval: 680,
            wave: 'triangle',
        };
    }
    if (hour >= 19 || hour < 5) {
        return {
            key: 'night',
            label: 'Night Lo-fi',
            icon: Moon,
            gradient: 'from-indigo-500/16 via-fuchsia-500/10 to-transparent',
            notes: [146.83, 196, 220, 293.66, 329.63],
            interval: 820,
            wave: 'sine',
        };
    }
    return {
        key: 'day',
        label: 'Soft Ambient',
        icon: Sparkles,
        gradient: 'from-cyan-400/12 via-indigo-400/10 to-transparent',
        notes: [174.61, 220, 261.63, 349.23, 392],
        interval: 760,
        wave: 'sine',
    };
};

const routeProfiles = {
    '/learn': {
        label: 'Learn Focus',
        notes: [164.81, 196, 246.94, 293.66, 329.63],
        bass: 82.41,
    },
    '/community': {
        label: 'Community Flow',
        notes: [130.81, 174.61, 196, 261.63, 293.66],
        bass: 65.41,
    },
};

export default function CreativeMode() {
    const { pathname } = useLocation();
    const isVisible = pathname.startsWith('/learn') || pathname.startsWith('/community');
    const [enabled, setEnabled] = useState(() => localStorage.getItem('artify_creative_mode') === 'on');
    const [soundMode, setSoundMode] = useState('time');
    const audioRef = useRef({ context: null, interval: null, drone: null, master: null });
    const startedFromClickRef = useRef(false);
    const mood = useMemo(() => getTimeMood(), [pathname]);
    const routeProfile = routeProfiles[pathname] || routeProfiles[`/${pathname.split('/')[1]}`] || routeProfiles['/community'];
    const isRainMode = soundMode === 'rain';
    const Icon = isRainMode ? CloudRain : mood.icon;

    const stopAudio = () => {
        const current = audioRef.current;
        if (current.interval) clearInterval(current.interval);
        if (current.drone) {
            try { current.drone.stop(); } catch { /* already stopped */ }
        }
        if (current.context) {
            current.context.close().catch(() => {});
        }
        audioRef.current = { context: null, interval: null, drone: null, master: null };
    };

    const startAudio = async () => {
        stopAudio();
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const context = new AudioContext();
        await context.resume();

        const master = context.createGain();
        master.gain.value = 0.095;
        master.connect(context.destination);

        const filter = context.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = isRainMode ? 950 : mood.key === 'night' ? 980 : 1450;
        filter.connect(master);

        const drone = context.createOscillator();
        const droneGain = context.createGain();
        drone.type = isRainMode ? 'sine' : 'triangle';
        drone.frequency.value = isRainMode ? 110 : routeProfile.bass;
        droneGain.gain.value = 0.025;
        drone.connect(droneGain);
        droneGain.connect(filter);
        drone.start();

        const notes = isRainMode ? [261.63, 329.63, 392, 523.25] : [...new Set([...(mood.notes || []), ...(routeProfile.notes || [])])];
        let step = 0;
        const playNote = (isConfirmTone = false) => {
            const now = context.currentTime;
            const root = notes[step % notes.length];
            const chord = isConfirmTone ? [523.25, 659.25, 783.99] : isRainMode ? [root] : [root, notes[(step + 2) % notes.length], notes[(step + 4) % notes.length]];
            step += 1;

            chord.forEach((frequency, index) => {
                const osc = context.createOscillator();
                const gain = context.createGain();
                osc.type = isRainMode ? 'sine' : mood.wave;
                osc.frequency.value = frequency;
                const start = now + index * 0.08;
                gain.gain.setValueAtTime(0, start);
                gain.gain.linearRampToValueAtTime(isConfirmTone ? 0.075 : isRainMode ? 0.03 : 0.052, start + 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, start + (isConfirmTone ? 0.9 : isRainMode ? 1.2 : 1.6));
                osc.connect(gain);
                gain.connect(filter);
                osc.start(start);
                osc.stop(start + (isConfirmTone ? 0.95 : isRainMode ? 1.25 : 1.7));
            });

            if (isRainMode) {
                const noiseBuffer = context.createBuffer(1, context.sampleRate * 0.35, context.sampleRate);
                const output = noiseBuffer.getChannelData(0);
                for (let i = 0; i < output.length; i += 1) {
                    output[i] = (Math.random() * 2 - 1) * 0.18;
                }
                const noise = context.createBufferSource();
                const noiseGain = context.createGain();
                noise.buffer = noiseBuffer;
                noiseGain.gain.setValueAtTime(0.018, now);
                noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                noise.connect(noiseGain);
                noiseGain.connect(filter);
                noise.start(now);
            }
        };

        playNote(true);
        window.setTimeout(() => playNote(false), 520);
        const interval = setInterval(playNote, isRainMode ? 520 : mood.interval);
        audioRef.current = { context, interval, drone, master };
    };

    useEffect(() => {
        if (!enabled || !isVisible) {
            stopAudio();
            return;
        }
        if (startedFromClickRef.current) {
            startedFromClickRef.current = false;
            return;
        }
        startAudio().catch(() => {
            setEnabled(false);
            localStorage.setItem('artify_creative_mode', 'off');
        });

        return stopAudio;
    }, [enabled, isVisible, pathname, soundMode]);

    const toggleEnabled = () => {
        const next = !enabled;
        setEnabled(next);
        localStorage.setItem('artify_creative_mode', next ? 'on' : 'off');
        if (next) {
            startedFromClickRef.current = true;
            startAudio().catch(() => {
                setEnabled(false);
                localStorage.setItem('artify_creative_mode', 'off');
            });
        } else {
            stopAudio();
        }
    };

    if (!isVisible) return null;

    return (
        <>
            {enabled && (
                <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${isRainMode ? 'from-sky-400/12 via-white/5 to-indigo-500/10' : mood.gradient}`} />
                    {isRainMode && (
                        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.22)_48%,transparent_52%)] [background-size:90px_180px] animate-[pulse_2.8s_ease-in-out_infinite]" />
                    )}
                </div>
            )}

            <div className="fixed bottom-5 left-5 z-[10000] w-[min(320px,calc(100vw-2.5rem))] rounded-2xl border border-white/10 bg-[#0b0b0d]/90 p-3 text-white shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${enabled ? 'bg-indigo-500 text-white' : 'bg-white/10 text-white/60'}`}>
                            <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">Creative Mode</p>
                            <p className="truncate text-sm font-bold">{isRainMode ? 'Rainy Glass Mood' : mood.label} • {routeProfile.label}</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleEnabled}
                        className={`flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-xs font-bold transition-all ${enabled ? 'bg-white text-black' : 'bg-white/10 text-white hover:bg-white/15'}`}
                    >
                        {enabled ? <Pause size={14} /> : <Play size={14} />}
                        {enabled ? 'ON' : 'OFF'}
                    </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                    <button
                        onClick={() => setSoundMode('time')}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${soundMode === 'time' ? 'border-indigo-300/40 bg-indigo-500/15 text-white' : 'border-white/10 bg-white/[0.03] text-white/45'}`}
                    >
                        <Music2 size={13} />
                        Mood
                    </button>
                    <button
                        onClick={() => setSoundMode('rain')}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${soundMode === 'rain' ? 'border-sky-300/40 bg-sky-500/15 text-white' : 'border-white/10 bg-white/[0.03] text-white/45'}`}
                    >
                        <CloudRain size={13} />
                        Rainy
                    </button>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-white/35">
                    <Volume2 size={12} />
                    Browser needs one click on ON to start sound.
                </p>
            </div>
        </>
    );
}
