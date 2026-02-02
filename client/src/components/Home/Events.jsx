import {
    MapPin, ChevronLeft, ChevronRight,
    Heart, Ticket, Sparkles, Music, Palette, Mic2, Star
} from 'lucide-react';
import { useRef } from 'react';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';

import eventImg1 from '../../assets/Images/Events/image1.jpeg';
import eventImg2 from '../../assets/Images/Events/image2.jpeg';
import eventImg3 from '../../assets/Images/Events/image3.jpeg';
import eventImg4 from '../../assets/Images/Events/image4.jpeg';
import eventImg5 from '../../assets/Images/Events/image5.jpeg';

const events = [
    {
        title: 'Neon Symphony',
        date: '20',
        month: 'DEC',
        location: 'Brooklyn, NY',
        image: eventImg1,
        category: 'Music',
        icon: Music,
        price: '$150',
        color: 'from-cyan-500 to-blue-500',
        shadow: 'shadow-cyan-500/20',
        heartColor: 'hover:bg-cyan-500 hover:border-cyan-500'
    },
    {
        title: 'Digital Soul',
        date: '22',
        month: 'DEC',
        location: 'Los Angeles, CA',
        image: eventImg2,
        category: 'Dance',
        icon: Mic2,
        price: '$85',
        color: 'from-purple-500 to-pink-500',
        shadow: 'shadow-purple-500/20',
        heartColor: 'hover:bg-purple-500 hover:border-purple-500'
    },
    {
        title: 'Abstract Minds',
        date: '25',
        month: 'DEC',
        location: 'Chicago, IL',
        image: eventImg3,
        category: 'Exhibition',
        icon: Palette,
        price: '$40',
        color: 'from-yellow-400 to-orange-500',
        shadow: 'shadow-yellow-500/20',
        heartColor: 'hover:bg-yellow-500 hover:border-yellow-500'
    },
    {
        title: 'Jazz & Wine',
        date: '28',
        month: 'DEC',
        location: 'Nashville, TN',
        image: eventImg4,
        category: 'Live Music',
        icon: Music,
        price: '$60',
        color: 'from-emerald-400 to-green-500',
        shadow: 'shadow-emerald-500/20',
        heartColor: 'hover:bg-emerald-500 hover:border-emerald-500'
    },
    {
        title: 'Cyber Punk Night',
        date: '31',
        month: 'DEC',
        location: 'Miami, FL',
        image: eventImg5,
        category: 'Party',
        icon: Sparkles,
        price: '$120',
        color: 'from-pink-500 to-rose-500',
        shadow: 'shadow-pink-500/20',
        heartColor: 'hover:bg-pink-500 hover:border-pink-500'
    },
];

function Events() {
    const scrollRef = useRef(null);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 420;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    return (
        <section id="events" className="relative w-full pt-0 pb-20 bg-black overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <h1 className="absolute -top-12 left-16 text-[15vw] md:text-[18vw] font-black text-white/[0.03] leading-none select-none font-playfair tracking-tighter whitespace-nowrap pointer-events-none">
                    EVENTS
                </h1>
                <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[0%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

                <Star className="absolute top-20 right-20 text-white/5 w-16 h-16 rotate-12" />
                <div className="absolute bottom-20 left-20 flex gap-1.5 h-16 opacity-30">
                    <div className="w-1.5 bg-indigo-500 h-[40%] animate-[bounce_1s_infinite]"></div>
                    <div className="w-1.5 bg-purple-500 h-[100%] animate-[bounce_1.2s_infinite]"></div>
                    <div className="w-1.5 bg-pink-500 h-[60%] animate-[bounce_0.8s_infinite]"></div>
                    <div className="w-1.5 bg-indigo-500 h-[80%] animate-[bounce_1.1s_infinite]"></div>
                    <div className="w-1.5 bg-purple-500 h-[50%] animate-[bounce_0.9s_infinite]"></div>
                </div>
            </div>
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
                    <div className='pt-12'>
                        <div className="flex items-center gap-2 mb-2 text-pink-500">
                            <Sparkles size={16} className="text-yellow-400 animate-pulse" />
                            <span className="text-xs font-bold text-pink-500 tracking-[0.2em] uppercase font-sans">Don't Miss Out</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-none font-sans tracking-tight">
                            Live Events  <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 italic">
                                & Creative Gigs.
                            </span>
                        </h2>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => scroll('left')} className="group w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => scroll('right')} className="group w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar px-8  [mask-image:linear-gradient(to right,transparent,black_40px,black_calc(100%-40px),transparent)]
                    [-webkit-mask-image:linear-gradient(to right,transparent,black_40px,black_calc(100%-40px),transparent)]"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {events.map((event, index) => (
                        <div
                            key={index}
                            className="group relative min-w-[320px] md:min-w-[400px] snap-start"
                        >
                            <div className={`absolute -inset-0.5 bg-gradient-to-b ${event.color} rounded-[2rem] opacity-20 group-hover:opacity-100 blur-md transition duration-500`}></div>

                            <div className="relative h-[420px] bg-[#0a0a0a] rounded-[1.8rem] overflow-hidden border border-white/10 flex flex-col group-hover:translate-y-[-5px] transition-transform duration-500">

                                <div className="relative h-[55%] overflow-hidden">
                                    <div className="absolute top-4 left-4 z-20 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-2 text-center min-w-[50px]">
                                        <span className="block text-lg font-black text-white leading-none">{event.date}</span>
                                        <span className="block text-[9px] font-bold text-white/70 tracking-widest">{event.month}</span>
                                    </div>

                                    <button className={`absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white transition-all ${event.heartColor}`}>
                                        <Heart size={16} />
                                    </button>

                                    <div className={`absolute bottom-4 right-4 z-20 w-9 h-9 bg-black/50 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center ${event.shadow} shadow-lg`}>
                                        <event.icon size={16} className="text-white" />
                                    </div>

                                    <ImageWithFallback
                                        src={event.image}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                                </div>

                                <div className="relative p-5 flex flex-col justify-between flex-grow">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <MapPin size={14} className="text-blue-500" />
                                            <span className="text-[11px] text-white/50 uppercase tracking-wide">{event.location}</span>
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-1 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400">
                                            {event.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/10">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-white/40 uppercase font-bold">Starting</span>
                                            <span className="text-base font-black text-white">{event.price}</span>
                                        </div>
                                        <button className="px-4 py-2 rounded-lg bg-white text-black font-bold text-xs flex items-center gap-2 hover:bg-gray-200 transition-colors">
                                            <Ticket size={14} />
                                            Join Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="min-w-[10px]"></div>
                </div>
            </div>
        </section>
    );
}
export default Events;