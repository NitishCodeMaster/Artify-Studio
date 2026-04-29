import React from 'react';
import { Star, Video, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { ImageWithFallback } from '../placeholder/ImageWithFallback';


const mentors = [
    {
        id: 1,
        name: "Riya Sharma",
        skill: "Classical Vocals",
        rating: "4.9",
        students: "120+",
        price: "$25/hr",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
        color: "group-hover:shadow-pink-500/40 group-hover:border-pink-500/40"
    },
    {
        id: 2,
        name: "Arjun Mehta",
        skill: "Guitar & Music Theory",
        rating: "5.0",
        students: "300+",
        price: "$40/hr",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
        color: "group-hover:shadow-indigo-500/40 group-hover:border-indigo-500/40"
    },
    {
        id: 3,
        name: "Sofia Khan",
        skill: "Oil Painting Mastery",
        rating: "4.8",
        students: "85+",
        price: "$30/hr",
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80",
        color: "group-hover:shadow-yellow-500/40 group-hover:border-yellow-500/40"
    }
];

export function MentorGrid({ filter = '' }) {
    const visibleMentors = mentors.filter((mentor) => {
        const q = filter.toLowerCase();
        return !q || mentor.name.toLowerCase().includes(q) || mentor.skill.toLowerCase().includes(q);
    });

    return (
        <div className="mb-24">
            <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.45 }}
                className="flex justify-between items-end mb-10 px-4"
            >
                <h3 className="text-3xl font-bold text-white">Top Rated Mentors</h3>
                <button className="text-sm text-pink-400 hover:text-pink-300 font-bold uppercase tracking-wider">View All</button>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibleMentors.map((mentor, index) => (
                    <motion.div
                        key={mentor.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        whileHover={{ y: -8 }}
                        className={`group relative bg-[#0f0f0f] rounded-3xl p-4 border border-white/5 transition-all duration-300 hover:-translate-y-2 ${mentor.color}`}
                    >
                        <div className="relative h-64 rounded-2xl overflow-hidden mb-5">
                            <ImageWithFallback src={mentor.image} alt={mentor.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 border border-white/10">
                                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                <span className="text-xs font-bold text-white">{mentor.rating}</span>
                            </div>
                            <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[11px] text-white/75 backdrop-blur-md">
                                {mentor.students} learners
                            </div>
                        </div>
 
                        <div className="px-2">
                            <h4 className="text-xl font-bold text-white mb-1">{mentor.name}</h4>
                            <p className="text-sm text-white/50 mb-4">{mentor.skill}</p>

                            <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                <div className="text-white font-bold text-lg">{mentor.price}</div>
                                <button className="px-5 py-2 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                                    <Video size={16} /> Book
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {visibleMentors.length === 0 && (
                    <div className="col-span-full rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-8 py-16 text-center text-white/40">
                        No mentors matched your search yet.
                    </div>
                )}
            </div>
        </div>
    );
}
