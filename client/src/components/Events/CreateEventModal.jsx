import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Calendar, Clock, MapPin, IndianRupee, Tag } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import CloudinaryUpload from './CloudinaryUpload';

const CreateEventModal = ({ isOpen, onClose, refresh }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        price: '',
        location: '',
        category: 'General',
        bannerImage: '',
        maxSeats: 100
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log("Token sending:", localStorage.getItem('token'));
            const res = await api.post('/events/create', formData);
            if (res.data.success) {
                toast.success("Event Live ho gaya! ");
                refresh();
                onClose();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Kuch error aaya!");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative bg-[#0f0f0f] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h2 className="text-xl font-bold text-white">Post New Gig</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} className="text-white/50" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Event Title</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Midnight Jazz Session"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Description</label>
                        <textarea
                            required
                            rows="3"
                            placeholder="What's the vibe of the event?"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all resize-none"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                            <Calendar size={12} /> Date
                        </label>
                        <input
                            required
                            type="date"
                            style={{ colorScheme: 'dark' }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:bg-indigo-500/5 outline-none transition-all cursor-pointer"
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                            <Clock size={12} /> Time
                        </label>
                        <input
                            required
                            type="time"
                            style={{ colorScheme: 'dark' }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:bg-indigo-500/5 outline-none transition-all cursor-pointer"
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2"><IndianRupee size={12} /> Price (0 for Free)</label>
                        <input
                            type="number"
                            placeholder="499"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2"><MapPin size={12} /> Venue / Online</label>
                        <input
                            required
                            type="text"
                            placeholder="Location name"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                            <Tag size={12} /> Category
                        </label>
                        <select
                            required
                            className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all cursor-pointer appearance-none"
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="Music">Music Gig</option>
                            <option value="Dance">Dance Performance</option>
                            <option value="Art">Art Gallery / Painting</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Event Poster</label>
                        <CloudinaryUpload
                            onUploadSuccess={(url) => setFormData({ ...formData, bannerImage: url })}
                            currentImage={formData.bannerImage}
                        />
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
                        >
                            {loading ? "Publishing..." : "Launch Event "}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default CreateEventModal;