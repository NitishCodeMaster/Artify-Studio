 import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock } from "lucide-react";

export function ImageWithFallback({ src, alt, className }) {
    return <img src={src} alt={alt} className={className} />;
}

import performerImg1 from '../../assets/Images/PerformerPanel/image1.jpeg';
import performerImg2 from '../../assets/Images/PerformerPanel/image2.jpeg';
import performerImg3 from '../../assets/Images/PerformerPanel/image3.jpeg';
import performerImg4 from '../../assets/Images/PerformerPanel/image4.jpeg';
import avatarImg1 from '../../assets/Images/PerformerPanel/avatar1.jpeg';
import avatarImg2 from '../../assets/Images/PerformerPanel/avatar2.jpeg';
import avatarImg3 from '../../assets/Images/PerformerPanel/avatar3.jpeg';
import avatarImg4 from '../../assets/Images/PerformerPanel/avatar4.jpeg';

const performers = [
    {
        id: 1,
        type: "Guitarist",
        name: "Alex Rivera",
        description: "Indie rock guitarist with 5+ years of live performance experience.",
        image: performerImg1,
        avatar: avatarImg1,
        eventTitle: "Rock Concert Tonight",
        eventLocation: "The Blue Room",
        eventTime: "9:00 PM",
        rightCard: { label: "Live Now", value: "Rock Show" }
    },
    {
        id: 2,
        type: "Singer",
        name: "Maya Chen",
        description: "Soulful vocalist specializing in jazz and R&B performances.",
        image: performerImg2,
        avatar: avatarImg2,
        eventTitle: "Jazz Night Live",
        eventLocation: "Soul Lounge",
        eventTime: "7:30 PM",
        rightCard: { label: "Genre", value: "Jazz • R&B" }
    },
    {
        id: 3,
        type: "Dancer",
        name: "Jordan Blake",
        description: "Contemporary dancer and choreographer for music videos.",
        image: performerImg3,
        avatar: avatarImg3,
        eventTitle: "Dance Workshop",
        eventLocation: "Studio 5",
        eventTime: "6:00 PM",
        rightCard: { label: "Workshop", value: "Today" }
    },
    {
        id: 4,
        type: "Painter",
        name: "Sofia Martinez",
        description: "Visual artist creating stunning contemporary paintings and murals.",
        image: performerImg4,
        avatar: avatarImg4,
        eventTitle: "Art Exhibition",
        eventLocation: "Gallery District",
        eventTime: "5:00 PM",
        rightCard: { label: "Exhibition", value: "Open" }
    },
];

export default function PerformerPanel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % performers.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const current = performers[currentIndex];

    // --- COLOR LOGIC FOR THE DOT ---
    const getDotColor = (type) => {
        switch (type) {
            case "Guitarist": return "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]";
            case "Singer": return "bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]";
            case "Dancer": return "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]";
            case "Painter": return "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]";
            default: return "bg-white";
        }
    };

    return (
        <div className="relative w-full h-[560px] lg:h-[620px]">
            <div className="flex justify-end h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-[95%] lg:w-full h-full rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <ImageWithFallback
                                src={current.image}
                                alt={current.type}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        </div>

                        {/* Content Container */}
                        <div className="relative h-full flex flex-col justify-between p-6 lg:p-8 z-10">
                            
                            {/* Top Tag */}
                            <div>
                                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-sm font-medium">
                                    {current.type}
                                </span>
                            </div>

                            {/* Main Info */}
                            <div className="space-y-4 pb-20 lg:pb-16">
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-full border-4 border-white shadow-lg overflow-hidden"
                                >
                                    <ImageWithFallback
                                        src={current.avatar}
                                        alt={current.name}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>

                                <div className="space-y-2">
                                    <h3 className="text-white text-2xl lg:text-4xl font-bold font-playfair tracking-wide">
                                        {current.name}
                                    </h3>
                                    <p className="text-white/80 text-sm lg:text-base max-w-md font-light leading-relaxed line-clamp-2">
                                        {current.description}
                                    </p>
                                </div>
                            </div>

                            {/* Event Card (Bottom Left) */}
                            <div className="absolute bottom-6 left-6 right-6 lg:left-8 lg:bottom-8 lg:right-auto z-20">
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5 rounded-2xl bg-white shadow-xl w-full lg:w-auto max-w-full border border-gray-100">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <Calendar className="w-4 h-4 text-[#6D28D9] flex-shrink-0" />
                                        <span className="font-bold text-gray-900 text-sm truncate">
                                            {current.eventTitle}
                                        </span>
                                    </div>
                                    <div className="hidden sm:block w-px h-4 bg-gray-300"></div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                                            <span className="truncate max-w-[100px] sm:max-w-none">{current.eventLocation}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-gray-400 flex-shrink-0" />
                                            <span className="font-medium text-[#6D28D9] whitespace-nowrap">{current.eventTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* --- UPDATED RIGHT CARD WITH COLORFUL DOT --- */}
                            <div className="absolute top-8 right-6 z-20">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/10 shadow-lg">
                                    
                                    {/* Label */}
                                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider">
                                        {current.rightCard.label}
                                    </span>
                                    
                                    {/* Dynamic Color Dot */}
                                    <div className={`w-1.5 h-1.5 rounded-full ${getDotColor(current.type)}`}></div>
                                    
                                    {/* Value */}
                                    <span className="text-xs font-bold text-white tracking-wide">
                                        {current.rightCard.value}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Color Glow Effect (Bottom Right) */}
                            <div className={`absolute bottom-10 right-8 w-32 h-32 rounded-full blur-[80px] -z-10
                                ${current.type === "Guitarist" && "bg-indigo-500/40"}
                                ${current.type === "Singer" && "bg-pink-500/40"}
                                ${current.type === "Dancer" && "bg-purple-500/40"}
                                ${current.type === "Painter" && "bg-emerald-500/40"}
                            `}></div>

                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            
            {/* Pagination Dots */}
            <div className="mt-6 flex justify-center">
                <div className="flex gap-2">
                    {performers.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex
                                ? "bg-[#6D28D9] w-8"
                                : "bg-white/20 w-2 hover:bg-white/50"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}