import {
    MapPin, ChevronLeft, ChevronRight, Heart, Ticket, Sparkles,
    Music, Palette, Mic2, Star, CalendarDays
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';

import eventImg1 from '../../assets/Images/Events/image1.jpeg';
import eventImg2 from '../../assets/Images/Events/image2.jpeg';
import eventImg3 from '../../assets/Images/Events/image3.jpeg';
import eventImg4 from '../../assets/Images/Events/image4.jpeg';
import eventImg5 from '../../assets/Images/Events/image5.jpeg';

const fallbackImages = [eventImg1, eventImg2, eventImg3, eventImg4, eventImg5];

const categoryTheme = {
    Music: {
        icon: Music,
        color: 'from-cyan-500 to-blue-500',
        shadow: 'shadow-cyan-500/20',
        heartColor: 'hover:bg-cyan-500 hover:border-cyan-500',
    },
    Dance: {
        icon: Mic2,
        color: 'from-purple-500 to-pink-500',
        shadow: 'shadow-purple-500/20',
        heartColor: 'hover:bg-purple-500 hover:border-purple-500',
    },
    Art: {
        icon: Palette,
        color: 'from-yellow-400 to-orange-500',
        shadow: 'shadow-yellow-500/20',
        heartColor: 'hover:bg-yellow-500 hover:border-yellow-500',
    },
    General: {
        icon: Sparkles,
        color: 'from-pink-500 to-rose-500',
        shadow: 'shadow-pink-500/20',
        heartColor: 'hover:bg-pink-500 hover:border-pink-500',
    },
};

const formatPrice = (price) => {
    const amount = Number(price || 0);
    return amount > 0 ? `₹${amount}` : 'Free';
};

const EventSkeleton = () => (
    <div className="relative min-w-[320px] rounded-[1.8rem] border border-white/10 bg-[#0a0a0a] p-3 md:min-w-[400px]">
        <div className="h-[420px] animate-pulse overflow-hidden rounded-[1.5rem] bg-white/[0.03]">
            <div className="h-[55%] bg-white/[0.04]" />
            <div className="space-y-4 p-5">
                <div className="h-3 w-28 rounded-full bg-white/10" />
                <div className="h-7 w-48 rounded-md bg-white/10" />
                <div className="mt-20 flex items-center justify-between border-t border-white/10 pt-4">
                    <div className="space-y-2">
                        <div className="h-2 w-16 rounded bg-white/10" />
                        <div className="h-5 w-20 rounded bg-white/10" />
                    </div>
                    <div className="h-10 w-28 rounded-lg bg-white/10" />
                </div>
            </div>
        </div>
    </div>
);

function Events() {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get('/events/get-all');
                const incoming = res.data.events || [];

                const normalized = incoming.slice(0, 8).map((event, index) => {
                    const theme = categoryTheme[event.category] || categoryTheme.General;
                    const eventDate = new Date(event.date);

                    return {
                        _id: event._id,
                        title: event.title,
                        date: String(eventDate.getDate()).padStart(2, '0'),
                        month: eventDate.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
                        location: event.location,
                        image: event.bannerImage || fallbackImages[index % fallbackImages.length],
                        category: event.category || 'General',
                        icon: theme.icon,
                        price: formatPrice(event.price),
                        color: theme.color,
                        shadow: theme.shadow,
                        heartColor: theme.heartColor,
                    };
                });

                setEvents(normalized);
            } catch (error) {
                console.error('Failed to load home events:', error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const focusCard = (index) => {
        if (!scrollRef.current || !events.length) return;

        const safeIndex = Math.max(0, Math.min(index, events.length - 1));
        const cards = scrollRef.current.querySelectorAll('[data-event-card="true"]');
        const targetCard = cards[safeIndex];

        setActiveIndex(safeIndex);
        targetCard?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };

    const scroll = (direction) => {
        if (!events.length) return;

        if (direction === 'left') {
            focusCard(activeIndex - 1);
            return;
        }

        focusCard(activeIndex + 1);
    };

    const visibleEvents = useMemo(() => events, [events]);

    return (
        <section id="events" className="relative w-full overflow-hidden bg-black pb-20 pt-0">
            <div className="pointer-events-none absolute inset-0">
                <h1 className="pointer-events-none absolute -top-12 left-16 whitespace-nowrap font-playfair text-[15vw] font-black leading-none tracking-tighter text-white/[0.03] md:text-[18vw]">
                    EVENTS
                </h1>
                <div className="absolute right-[-5%] top-[-10%] h-[600px] w-[600px] rounded-full bg-purple-600/10 blur-[100px] animate-pulse" />
                <div className="absolute bottom-[0%] left-[-10%] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

                <Star className="absolute right-20 top-20 h-16 w-16 rotate-12 text-white/5" />
                <div className="absolute bottom-20 left-20 flex h-16 gap-1.5 opacity-30">
                    <div className="h-[40%] w-1.5 bg-indigo-500 animate-[bounce_1s_infinite]" />
                    <div className="h-[100%] w-1.5 bg-purple-500 animate-[bounce_1.2s_infinite]" />
                    <div className="h-[60%] w-1.5 bg-pink-500 animate-[bounce_0.8s_infinite]" />
                    <div className="h-[80%] w-1.5 bg-indigo-500 animate-[bounce_1.1s_infinite]" />
                    <div className="h-[50%] w-1.5 bg-purple-500 animate-[bounce_0.9s_infinite]" />
                </div>
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.55 }}
                    className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                >
                    <div className="pt-12">
                        <div className="mb-2 flex items-center gap-2 text-pink-500">
                            <motion.div
                                animate={{ rotate: [0, 10, -8, 0], scale: [1, 1.08, 1] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Sparkles size={16} className="text-yellow-400" />
                            </motion.div>
                            <span className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-pink-500">Don't Miss Out</span>
                        </div>
                        <h2 className="font-sans text-3xl font-black leading-none tracking-tight text-white md:text-5xl">
                            Live Events <br />
                            <motion.span
                                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="bg-[length:200%_200%] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic"
                            >
                                & Creative Gigs.
                            </motion.span>
                        </h2>
                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.45 }}
                            transition={{ duration: 0.45, delay: 0.08 }}
                            className="mt-4 max-w-xl text-sm leading-relaxed text-white/45 md:text-base"
                        >
                            Fresh shows, gallery nights, and creative drops moving through the city right now.
                        </motion.p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/55 md:flex md:items-center md:gap-2">
                            <motion.span
                                animate={{ opacity: [0.45, 1, 0.45], scale: [1, 1.15, 1] }}
                                transition={{ duration: 1.8, repeat: Infinity }}
                                className="h-2 w-2 rounded-full bg-pink-400"
                            />
                            Manual spotlight control
                        </div>
                        <button onClick={() => scroll('left')} className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-black">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => scroll('right')} className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-black">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </motion.div>

                <div
                    ref={scrollRef}
                    className="no-scrollbar flex gap-6 overflow-x-auto px-8 pb-4 snap-x snap-mandatory scroll-smooth [mask-image:linear-gradient(to_right,transparent,black_40px,black_calc(100%-40px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_40px,black_calc(100%-40px),transparent)]"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loading && [1, 2, 3].map((item) => <EventSkeleton key={item} />)}

                    {!loading && visibleEvents.map((event, index) => (
                        <motion.div
                            key={event._id}
                            data-event-card="true"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.25 }}
                            transition={{ duration: 0.45, delay: index * 0.08 }}
                            whileHover={{ y: -6 }}
                            className="group relative min-w-[320px] snap-start md:min-w-[400px]"
                        >
                            <div className={`absolute -inset-0.5 rounded-[2rem] bg-gradient-to-b ${event.color} blur-md transition duration-500 ${activeIndex === index ? "opacity-80" : "opacity-20 group-hover:opacity-100"}`} />

                            <div className={`relative flex h-[420px] flex-col overflow-hidden rounded-[1.8rem] border bg-[#0a0a0a] transition-transform duration-500 group-hover:translate-y-[-5px] ${activeIndex === index ? "border-white/20" : "border-white/10"}`}>
                                <motion.div
                                    animate={{ scaleX: activeIndex === index ? [0, 1] : 0 }}
                                    transition={{ duration: 2.3, ease: "linear" }}
                                    className={`absolute left-0 right-0 top-0 z-20 h-[2px] origin-left bg-gradient-to-r ${event.color}`}
                                />

                                <div className="relative h-[55%] overflow-hidden">
                                    <div className="absolute left-4 top-4 z-20 min-w-[50px] rounded-xl border border-white/10 bg-black/40 p-2 text-center backdrop-blur-md">
                                        <span className="block text-lg font-black leading-none text-white">{event.date}</span>
                                        <span className="block text-[9px] font-bold tracking-widest text-white/70">{event.month}</span>
                                    </div>

                                    <button className={`absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-black/40 p-2 text-white transition-all backdrop-blur-md ${event.heartColor}`}>
                                        <Heart size={16} />
                                    </button>

                                    <div className={`absolute bottom-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md ${event.shadow} shadow-lg`}>
                                        <event.icon size={16} className="text-white" />
                                    </div>

                                    <div className="absolute bottom-4 left-4 z-20">
                                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 backdrop-blur-md">
                                            <motion.span
                                                animate={{ opacity: [0.4, 1, 0.4] }}
                                                transition={{ duration: 1.7, repeat: Infinity }}
                                                className={`h-2 w-2 rounded-full bg-gradient-to-r ${event.color}`}
                                            />
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
                                                {event.category}
                                            </span>
                                        </div>
                                    </div>

                                    <ImageWithFallback
                                        src={event.image}
                                        alt={event.title}
                                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                                </div>

                                <div className="relative flex flex-grow flex-col justify-between p-5">
                                    <div>
                                        <div className="mb-1 flex items-center gap-2">
                                            <MapPin size={14} className="text-blue-500" />
                                            <span className="text-[11px] uppercase tracking-wide text-white/50">{event.location}</span>
                                        </div>

                                        <h3 className="mb-1 text-xl font-bold leading-tight text-white group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 group-hover:bg-clip-text group-hover:text-transparent">
                                            {event.title}
                                        </h3>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold uppercase text-white/40">Starting</span>
                                            <span className="text-base font-black text-white">{event.price}</span>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/event/${event._id}`)}
                                            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-black transition-all hover:scale-[1.04] hover:bg-gray-200"
                                        >
                                            <Ticket size={14} />
                                            Join Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {!loading && visibleEvents.length === 0 && (
                        <div className="flex min-h-[420px] min-w-full items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] px-8 text-center text-white/40">
                            No live events available right now.
                        </div>
                    )}

                    <div className="min-w-[10px]" />
                </div>

                {!loading && visibleEvents.length > 0 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                        {visibleEvents.map((event, index) => (
                            <button
                                key={event._id}
                                onClick={() => focusCard(index)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === index ? `w-10 bg-gradient-to-r ${event.color}` : "w-2 bg-white/20 hover:bg-white/40"}`}
                                aria-label={`Focus ${event.title}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default Events;
