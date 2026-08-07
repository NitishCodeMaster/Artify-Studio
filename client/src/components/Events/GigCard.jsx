import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Clock, ArrowUpRight, MapPin, Trash2, Pencil } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';

const GigCard = ({ event, refresh, onOpenDetails, onEdit }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("user")) || JSON.parse(localStorage.getItem("artify_user"));
    const currentUserId = currentUser?._id || currentUser?.id;
    const organizerId = event.organizer?._id || event.organizer;

    const isOwner = Boolean(
        currentUserId &&
        organizerId &&
        currentUserId.toString() === organizerId.toString()
    );

    const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short'
    });

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setShowDeleteModal(true);
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (onEdit) {
            onEdit(event);
        }
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
                whileHover={{ y: -4 }}
                onClick={() => onOpenDetails(event)}
                className="relative bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 group cursor-pointer flex flex-col h-full shadow-xl"
            >
                {/* Banner Thumbnail */}
                <div className="relative h-40 w-full overflow-hidden bg-zinc-900 shrink-0">
                    <img
                        src={event.bannerImage || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800"}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-90" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider">
                            {event.category}
                        </span>

                        {event.gigType === 'paid_gig' || (Number(event.artistPayout) > 0 && event.gigType !== 'free' && event.gigType !== 'ticketed') ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-black font-extrabold text-[10px] shadow-lg">
                                ⭐ ₹{event.artistPayout || 5000} Payout
                            </span>
                        ) : event.gigType === 'ticketed' || (Number(event.price) > 0 && event.gigType !== 'free') ? (
                            <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white font-extrabold text-[10px] shadow-lg">
                                🎟️ ₹{event.price || 500} Ticket
                            </span>
                        ) : (
                            <span className="px-2.5 py-1 rounded-full bg-purple-600 text-white font-extrabold text-[10px] shadow-lg">
                                🎁 Free Gig
                            </span>
                        )}
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                    <div>
                        <h3 className="font-bold text-white text-base line-clamp-1 group-hover:text-indigo-400 transition-colors">
                            {event.title}
                        </h3>
                        <p className="text-xs text-white/50 flex items-center gap-1 mt-1 truncate">
                            <MapPin size={12} className="text-indigo-400 shrink-0" />
                            <span className="truncate">{event.location}</span>
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-xs text-white/60 font-medium">
                            <Clock size={12} className="text-indigo-400" />
                            <span>{eventDate} • {event.time || "7:00 PM"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            {isOwner && (
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={handleEditClick}
                                        className="p-1.5 text-white/50 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
                                        title="Edit Gig"
                                    >
                                        <Pencil size={14} />
                                    </button>
                                    <button
                                        onClick={handleDeleteClick}
                                        className="p-1.5 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        title="Delete Gig"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}

                            <span className="flex items-center gap-0.5 text-xs font-bold text-indigo-400 group-hover:text-white transition-colors">
                                Details <ArrowUpRight size={12} />
                            </span>
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