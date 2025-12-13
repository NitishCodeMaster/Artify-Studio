import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";

// OPTIONAL: Replace this with your own image fallback logic
export function ImageWithFallback({ src, alt, className }) {
    return <img src={src} alt={alt} className={className} />;
}

const performers = [

    {
        id: 1,
        type: "Guitarist",
        name: "Alex Rivera",
        description: "Indie rock guitarist with 5+ years of live performance experience.",
        image: "https://images.unsplash.com/photo-1574626550228-3fac41f33008?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMGd1aXRhciUyMG11c2ljaWFuJTIwcGVyZm9ybWluZ3xlbnwxfHx8fDE3NjU1NzY0ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        avatar: "https://images.unsplash.com/photo-1693835777292-cf103dcd2324?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxndWl0YXJpc3QlMjBwb3J0cmFpdCUyMG1hbGV8ZW58MXx8fHwxNzY1NTc2OTk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        eventTitle: "Rock Concert Tonight",
        eventLocation: "The Blue Room",
        eventTime: "9:00 PM"
    },
    {
        id: 2,
        type: "Singer",
        name: "Maya Chen",
        description: "Soulful vocalist specializing in jazz and R&B performances.",
        image: "https://images.unsplash.com/photo-1677947226901-5164b32d5cfe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        avatar: "https://images.unsplash.com/photo-1615748561835-cff146a0b3a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaW5nZXIlMjBwb3J0cmFpdCUyMGZlbWFsZXxlbnwxfHx8fDE3NjU1NzY5OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        eventTitle: "Jazz Night Live",
        eventLocation: "Soul Lounge",
        eventTime: "7:30 PM"
    },
    {
        id: 3,
        type: "Dancer",
        name: "Jordan Blake",
        description: "Contemporary dancer and choreographer for music videos.",
        image: "https://images.unsplash.com/photo-1758669919481-a965bde1abe4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        avatar: "https://images.unsplash.com/photo-1758063685635-5aa92329eed1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjU0NzcxOTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        eventTitle: "Dance Workshop",
        eventLocation: "Studio 5",
        eventTime: "6:00 PM",
    },
    {
        id: 4,
        type: "Painter",
        name: "Sofia Martinez",
        description: "Visual artist creating stunning contemporary paintings and murals.",
        image: "https://images.unsplash.com/photo-1606355555437-59e0b3f0a703?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGVyJTIwYXJ0aXN0JTIwcGFpbnRpbmclMjBjYW52YXN8ZW58MXx8fHwxNzY1NTc2NDgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        avatar: "https://images.unsplash.com/photo-1751003801857-30d275cc8243?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYWludGVyJTIwYXJ0aXN0JTIwcG9ydHJhaXQlMjBmZW1hbGV8ZW58MXx8fHwxNjU1NzY5OTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        eventTitle: "Art Exhibition",
        eventLocation: "Gallery District",
        eventTime: "5:00 PM",
    },

];

export function PerformerPanel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % performers.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const current = performers[currentIndex];

    return (
        <div className="relative w-full h-[700px] lg:h-[820px]">
            <div className="flex justify-end">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-[95%] lg:w-full h-[550px] rounded-3xl overflow-hidden shadow-2xl"
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <ImageWithFallback
                                src={current.image}
                                alt={current.type}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        </div>

                        {/* CONTENT */}
                        <div className="relative h-full flex flex-col justify-between p-6 lg:p-8">

                            {/* Badge */}
                            <div>
                                <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30">
                                    {current.type}
                                </span>
                            </div>

                            {/* Bottom Info */}
                            <div className="space-y-4 pb-10 lg:pb-16">
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

                                <div className="space-y-1">
                                    <h3 className="text-white text-2xl lg:text-3xl font-bold">
                                        {current.name}
                                    </h3>
                                    <p className="text-white/90 text-sm lg:text-base max-w-md">
                                        {current.description}
                                    </p>
                                </div>
                            </div>

                            {/* Floating Event Card */}
                            <div className="absolute bottom-6 left-6 right-6 lg:left-8 lg:bottom-8 lg:right-auto">
                                <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white shadow-lg max-w-full">
                                    <Calendar className="w-4 h-4 text-[#6D28D9] flex-shrink-0" />
                                    <span className="text-sm">
                                        <span className="font-semibold">{current.eventTitle}</span>
                                        <span className="text-gray-500 ml-1">•</span>
                                        <span className="text-gray-600 ml-1">{current.eventLocation}</span>
                                        <span className="text-gray-500 ml-1">•</span>
                                        <span className="text-gray-600 ml-1">{current.eventTime}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="mt-7 flex justify-center">
                <div className="flex gap-2">
                    {performers.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex
                                ? "bg-[#6D28D9] w-6"
                                : "bg-white/40 w-2 hover:bg-white/70"
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>

    );
}
