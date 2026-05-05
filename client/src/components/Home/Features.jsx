import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Music,
    Palette,
    Globe,
    Zap,
    ArrowUpRight,
    Star,
    Sparkles,
    Wand2
} from 'lucide-react';

import user1 from '../../assets/Images/features/user1.jpeg';
import user2 from '../../assets/Images/features/user2.jpeg';
import user3 from '../../assets/Images/features/user3.jpeg';
import user4 from '../../assets/Images/features/user4.jpeg';
import api from '../../utils/api';

const userImages = [user1, user2, user3, user4];

const features = [
    {
        icon: Palette,
        title: 'Showcase Your Art',
        description: 'Create a stunning profile to showcase paintings, digital art, sketches, and designs.',
        color: 'from-fuchsia-500 via-pink-500 to-rose-500',
        borderColor: 'group-hover:border-fuchsia-500/50',
        path: '/my-profile',
        metricLabel: 'Profile studio',
    },
    {
        icon: Music,
        title: 'Music & Collaboration',
        description: 'Jam with musicians, collaborate on projects, and build bands or creative teams.',
        color: 'from-violet-500 via-indigo-500 to-blue-500',
        borderColor: 'group-hover:border-indigo-500/50',
        path: '/community',
        metricLabel: 'Creative circles',
    },
    {
        icon: Globe,
        title: 'Artist Community',
        description: 'Connect with artists worldwide, share ideas, learn skills, and grow together.',
        color: 'from-cyan-400 via-teal-400 to-emerald-400',
        borderColor: 'group-hover:border-cyan-500/50',
        path: '/learn',
        metricLabel: 'Live mentors',
    },
    {
        icon: Zap,
        title: 'Gigs & Opportunities',
        description: 'Discover events, gigs, and paid opportunities matched to your creative skills.',
        color: 'from-amber-400 via-orange-400 to-red-400',
        borderColor: 'group-hover:border-amber-500/50',
        path: '/events',
        metricLabel: 'Open doors',
    },
];

const creativePrompts = [
    'Turn one unfinished idea into a 20-minute sketch today.',
    'Post a behind-the-scenes clip of your current practice.',
    'Collaborate with one creator outside your main art style.',
    'Rebuild an old artwork using only three colors.',
];

export default function Features() {
    const navigate = useNavigate();
    const [overview, setOverview] = useState({ mentors: 0, workshops: 0 });
    const [marketCount, setMarketCount] = useState(0);
    const [promptIndex, setPromptIndex] = useState(0);
    const [activeFeature, setActiveFeature] = useState(0);

    useEffect(() => {
        let mounted = true;
        const loadDynamicHighlights = async () => {
            try {
                const [learnRes, productRes] = await Promise.allSettled([
                    api.get('/learn/overview'),
                    api.get('/products')
                ]);

                if (!mounted) return;

                if (learnRes.status === 'fulfilled') {
                    setOverview(learnRes.value.data.stats || { mentors: 0, workshops: 0 });
                }

                if (productRes.status === 'fulfilled') {
                    const products = productRes.value.data.products || productRes.value.data || [];
                    setMarketCount(Array.isArray(products) ? products.length : 0);
                }
            } catch (error) {
                console.error('Failed to load feature highlights:', error);
            }
        };

        loadDynamicHighlights();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % features.length);
        }, 4200);
        return () => clearInterval(interval);
    }, []);

    const dynamicStats = useMemo(() => ([
        { label: 'Live mentors', value: `${overview.mentors || 2}+` },
        { label: 'Workshops', value: `${overview.workshops || 0}+` },
        { label: 'Marketplace finds', value: `${marketCount || 7}+` },
    ]), [overview, marketCount]);

    const dynamicFeatures = useMemo(() => features.map((feature, index) => {
        const metrics = [
            `${Math.max(marketCount, 1)} pieces listed`,
            `${Math.max(overview.workshops, 1)} live sessions`,
            `${Math.max(overview.mentors, 2)} mentors ready`,
            `${Math.max(marketCount + overview.workshops, 3)} fresh leads`,
        ];

        return {
            ...feature,
            liveMetric: metrics[index],
            pulse: Math.min(88, 38 + ((index + 1) * 9) + (overview.mentors || 0) + (marketCount % 12)),
        };
    }), [marketCount, overview]);

    const active = dynamicFeatures[activeFeature] || dynamicFeatures[0];
    const ActiveIcon = active.icon;

    return (
        <section id="features" className="relative w-full flex flex-col justify-center py-20 pb-0 bg-black overflow-hidden">

            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px]"></div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20"></div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-0">
                    <h1 className="text-[15vw] md:text-[18vw] font-black text-white/[0.02] tracking-tighter leading-none select-none font-playfair">
                        CREATIVE
                    </h1>
                </div>

                <Star className="absolute top-20 right-20 text-white/5 w-24 h-24 rotate-12 animate-pulse" />
                <div className="absolute bottom-40 left-10 w-32 h-32 border-2 border-white/5 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full h-full flex flex-col justify-center">

                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.55 }}
                    className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 border-b border-white/10 pb-12 relative"
                >

                    <svg className="absolute -top-16 left-0 w-24 h-24 text-white/20 hidden md:block" viewBox="0 0 100 100" fill="none" stroke="currentColor">
                        <path d="M10 50 Q 50 10 90 50" strokeWidth="2" strokeDasharray="5,5" />
                        <path d="M80 40 L 90 50 L 80 60" strokeWidth="2" />
                    </svg>

                    <div className="max-w-2xl relative">
                        <div className="flex items-center gap-2 mb-2 text-indigo-400">
                            <motion.div
                                animate={{ rotate: [0, 10, -8, 0], scale: [1, 1.08, 1] }}
                                transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Sparkles size={16} />
                            </motion.div>
                            <span className="text-xs font-mono uppercase tracking-widest">Discover Your Potential</span>
                        </div>
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-playfair leading-[1.1]">
                            Crafted for <br />
                            <motion.span
                                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="ml-2 md:ml-20 bg-[length:200%_200%] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic"
                            >
                                Creative Souls
                            </motion.span>
                        </h2>
                        <p className="text-white/50 text-md font-poppins max-w-lg leading-relaxed">
                            Artify empowers artists to showcase their talent, collaborate with creatives,
                            discover events, and turn passion into real opportunities.
                        </p>

                        <div className="mt-7 flex items-start gap-5">
                            <div className="hidden -space-x-8 transition-all duration-500 hover:space-x-2 md:flex">
                                {userImages.map((img, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, rotate: i % 2 === 0 ? -12 : 12, y: 18 }}
                                        whileInView={{ opacity: 1, rotate: i % 2 === 0 ? -6 : 6, y: i % 2 === 0 ? 8 : -4 }}
                                        viewport={{ once: true, amount: 0.4 }}
                                        transition={{ duration: 0.45, delay: i * 0.06 }}
                                        whileHover={{ scale: 1.12, rotate: 0, y: 0 }}
                                        className={`relative group h-16 w-14 bg-white p-1 shadow-lg transition-transform duration-300 hover:z-20 hover:scale-125 hover:rotate-0
                                        ${i % 2 === 0 ? '-rotate-6 translate-y-2' : 'rotate-6 -translate-y-1'}`}
                                    >
                                        <img
                                            src={img}
                                            alt="Artist"
                                            className="h-full w-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                                        />
                                    </motion.div>
                                ))}

                                <div className="z-10 flex h-16 w-14 rotate-12 flex-col items-center justify-center border border-white/20 bg-black text-white shadow-xl">
                                    <span className="text-[10px] font-bold uppercase text-gray-400">Join</span>
                                    <span className="bg-gradient-to-tr from-yellow-400 to-orange-500 bg-clip-text text-sm font-black text-transparent">{overview.mentors || 50}+</span>
                                </div>
                            </div>

                            <motion.button
                                type="button"
                                whileHover={{ y: -3 }}
                                onClick={() => setPromptIndex((prev) => (prev + 1) % creativePrompts.length)}
                                className="group hidden max-w-[260px] rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-left shadow-[0_0_30px_rgba(245,158,11,0.08)] transition-all hover:bg-amber-400/15 lg:block"
                            >
                                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200">
                                    <Wand2 size={14} />
                                    Creative Spark
                                </div>
                                <p className="text-sm leading-relaxed text-white/70 group-hover:text-white">{creativePrompts[promptIndex]}</p>
                            </motion.button>
                        </div>
                    </div>

                    <div className="hidden md:block py-4">
                        <div className="mb-5 grid grid-cols-3 gap-3">
                            {dynamicStats.map((stat) => (
                                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-right backdrop-blur-md">
                                    <div className="text-xl font-black text-white">{stat.value}</div>
                                    <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                        <motion.div
                            key={active.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 text-left backdrop-blur-md"
                        >
                            <div className="mb-3 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${active.color} text-white`}>
                                        <ActiveIcon size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">Now Highlighting</p>
                                        <p className="font-bold text-white">{active.title}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(active.path)}
                                    className="rounded-full border border-white/10 bg-white px-4 py-2 text-xs font-bold text-black transition-all hover:bg-gray-200"
                                >
                                    Open
                                </button>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${active.pulse}%` }}
                                    transition={{ duration: 0.6 }}
                                    className={`h-full rounded-full bg-gradient-to-r ${active.color}`}
                                />
                            </div>
                            <p className="mt-3 text-sm text-white/50">{active.liveMetric} • {active.metricLabel}</p>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {dynamicFeatures.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.45, delay: index * 0.08 }}
                            whileHover={{ y: -8 }}
                            onMouseEnter={() => setActiveFeature(index)}
                            onClick={() => setActiveFeature(index)}
                            className={`group relative h-full cursor-pointer rounded-[2rem] bg-white/5 p-1 transition-all duration-500 hover:-translate-y-2 ${activeFeature === index ? 'ring-1 ring-white/20' : ''}`}
                        >
                            <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${feature.color} blur-sm transition-opacity duration-500 ${activeFeature === index ? 'opacity-80' : 'opacity-0 group-hover:opacity-100'}`}></div>

                            <div className={`relative h-full bg-black rounded-[1.9rem] p-6 border border-white/10 ${feature.borderColor} transition-colors duration-300 overflow-hidden`}>

                                <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${feature.color}`}></div>

                                <div className="flex justify-between items-start mb-8 relative z-10">
                                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                                        <feature.icon size={26} className="text-white group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            navigate(feature.path);
                                        }}
                                        className="rounded-full p-1 text-white/30 transition-colors hover:bg-white/10 hover:text-white"
                                        aria-label={`Open ${feature.title}`}
                                    >
                                        <ArrowUpRight />
                                    </button>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold text-white mb-3 font-playfair group-hover:tracking-wide transition-all">
                                        {feature.title}
                                    </h3>
                                    <p className="text-white/50 text-sm leading-relaxed font-poppins group-hover:text-white/70 transition-colors">
                                        {feature.description}
                                    </p>
                                    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                                        <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.18em] text-white/35">
                                            <span>{feature.metricLabel}</span>
                                            <span>{feature.pulse}%</span>
                                        </div>
                                        <div className="h-1 overflow-hidden rounded-full bg-white/10">
                                            <div className={`h-full rounded-full bg-gradient-to-r ${feature.color}`} style={{ width: `${feature.pulse}%` }} />
                                        </div>
                                        <p className="mt-2 text-xs text-white/45">{feature.liveMetric}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
