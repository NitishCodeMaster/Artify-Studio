import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Clock, ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';

const GigCard = ({ gig }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="relative bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 transition-all duration-300 group overflow-hidden"
        >
             {gig.matchScore && (
                <div className="absolute top-0 right-0 bg-[#1a1a1a] border-l border-b border-white/10 rounded-bl-xl px-3 py-1 flex items-center gap-1">
                    <Zap size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-[10px] font-bold text-white">{gig.matchScore}% Match</span>
                </div>
            )}

            <div className="flex justify-between items-start mb-4 mt-2">
                <div className="flex gap-3">
                     <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-indigo-400 border border-white/5">
                        <Briefcase size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-base">{gig.role}</h3>
                        <div className="flex items-center gap-2 text-xs text-white/50">
                            <span className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                                {gig.venue}
                            </span>
                            {gig.verified && (
                                <span className="flex items-center gap-0.5 text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[9px] border border-emerald-500/20">
                                    <ShieldCheck size={9} /> Verified Payout
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

             <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded">{gig.type}</span>
                {gig.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] uppercase border border-white/10 px-2 py-1 rounded text-white/40">{tag}</span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex flex-col">
                    <span className="text-[10px] text-white/40 uppercase tracking-wide">Est. Pay</span>
                    <span className="text-sm font-bold text-white">{gig.pay}</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-white/40 flex items-center gap-1"><Clock size={10} /> {gig.deadline}</span>
                    <button
                        onClick={() => alert("Applied Successfully! 🚀")}
                        className="mt-1 flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-white transition-colors"
                    >
                        Easy Apply <ArrowUpRight size={12} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default GigCard;