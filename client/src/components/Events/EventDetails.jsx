import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Clock, PlayCircle, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import DeleteConfirmModal from './DeleteConfirmModal';

const EventDetails = ({ event, onBack, refresh, viewMode }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = async () => {
        try {
            const res = await api.delete(`/events/delete/${event._id}`);
            if (res.data.success) {
                toast.success("Event deleted successfully!");
                refresh();
            }
        } catch (error) {
            toast.error("Failed to delete event");
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[100] bg-[#050505] text-white p-6 pb-20 overflow-y-auto custom-scrollbar"        >
            <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Gigs</span>
                </button>
                {viewMode === 'artist' && (
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="p-3 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5"
                    >
                        <Trash2 size={20} />
                    </button>
                )}
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl group">
                        <img
                            src={event.bannerImage}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            alt={event.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>

                    {event.trailerUrl && (
                        <button
                            onClick={() => window.open(event.trailerUrl, '_blank')}
                            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 hover:bg-white hover:text-black transition-all font-bold group"
                        >
                            <PlayCircle size={24} className="group-hover:scale-110 transition-transform" />
                            Watch Official Trailer
                        </button>
                    )}
                </div>

                <div className="space-y-8">
                    <div>
                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/30">
                            {event.category}
                        </span>
                        <h1 className="text-5xl font-black mt-4 leading-tight tracking-tight">{event.title}</h1>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <Calendar className="text-indigo-400 mb-2" size={20} />
                            <p className="text-xs text-white/40 uppercase font-bold tracking-tighter">Date</p>
                            <p className="font-medium">{new Date(event.date).toDateString()}</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                            <MapPin className="text-indigo-400 mb-2" size={20} />
                            <p className="text-xs text-white/40 uppercase font-bold tracking-tighter">Location</p>
                            <p className="font-medium capitalize">{event.location}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white/40 uppercase mb-3 tracking-widest">About this Event</h4>
                        <p className="text-lg text-white/70 leading-relaxed font-light italic">
                            {event.description || "No description provided for this gig."}
                        </p>
                    </div>

                    <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-white/40 uppercase font-bold">Ticket Price</p>
                            <p className="text-3xl font-black text-emerald-400">
                                {event.price === 0 ? "FREE" : `₹${event.price}`}
                            </p>
                        </div>
                        <button className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all">
                            Book Tickets
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showDeleteModal && (
                    <DeleteConfirmModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={handleDelete}
                        title={event.title}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default EventDetails;