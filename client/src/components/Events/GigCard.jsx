import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Clock, ArrowUpRight, MapPin, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';

const GigCard = ({ event, refresh, onOpenDetails }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
    });

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await api.delete(`/events/delete/${event._id}`);
            if (res.data.success) {
                toast.success("Event removed!");
                setShowDeleteModal(false);
                refresh();
            }
        } catch (error) {
            toast.error("Error deleting event");
        }
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -5 }}
                onClick={() => onOpenDetails(event)}
                className="relative bg-[#111] border border-white/10 rounded-2xl p-5 hover:border-indigo-500/50 transition-all duration-300 group overflow-hidden"
            >
                <div className="flex justify-between items-start mb-4 mt-2">
                    <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-indigo-400 border border-white/5">
                            <Briefcase size={18} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-base line-clamp-1">{event.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-white/50">
                                <span className="flex items-center gap-1 capitalize">
                                    <MapPin size={10} /> {event.location}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded">
                        {event.category}
                    </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 uppercase tracking-wide">Ticket Price</span>
                        <span className="text-sm font-bold text-white">
                            {event.price === 0 ? "FREE" : `₹${event.price}`}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDeleteClick}
                            className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete Gig"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="h-8 w-[1px] bg-white/5"></div>

                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-white/40 flex items-center gap-1">
                                <Clock size={10} /> {eventDate} • {event.time}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onOpenDetails(event);
                                }} className="mt-1 flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-white transition-colors"
                            >
                                View Gig <ArrowUpRight size={12} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteConfirmModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={confirmDelete}
                        title={event.title}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default GigCard;