import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CalendarDays, Clock3, ImagePlus, Tag, Users, Sparkles, Type } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

const initialState = {
    title: '',
    summary: '',
    startAt: '',
    durationMinutes: 75,
    attendeesCount: 0,
    tags: '',
    mode: 'Live',
    coverImage: '',
    accentColor: 'from-purple-600 to-pink-600',
};

export default function CreateWorkshopModal({ isOpen, onClose, onCreated }) {
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                tags: formData.tags.split(',').map((item) => item.trim()).filter(Boolean),
                startAt: new Date(formData.startAt).toISOString(),
            };

            const res = await api.post('/learn/workshops', payload);
            toast.success('Workshop live ho gaya!');
            setFormData(initialState);
            onCreated?.(res.data.workshop);
            onClose?.();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Workshop create nahi ho paya.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.96, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0f0f12] shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-5">
                    <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-pink-400">Mentor Workshop</p>
                        <h2 className="text-xl font-bold text-white">Create Live Masterclass</h2>
                    </div>
                    <button onClick={onClose} className="rounded-full p-2 transition-colors hover:bg-white/5">
                        <X size={20} className="text-white/55" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid max-h-[78vh] grid-cols-1 gap-6 overflow-y-auto p-8 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-white/40">
                            <Type size={12} />
                            Workshop Title
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="e.g. Fingerstyle Guitar for Live Performance"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold uppercase text-white/40">Summary</label>
                        <textarea
                            required
                            rows="4"
                            value={formData.summary}
                            onChange={(e) => handleChange('summary', e.target.value)}
                            placeholder="Tell students what they will learn in this session."
                            className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-white/40">
                            <CalendarDays size={12} />
                            Start Date & Time
                        </label>
                        <input
                            required
                            type="datetime-local"
                            style={{ colorScheme: 'dark' }}
                            value={formData.startAt}
                            onChange={(e) => handleChange('startAt', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-white/40">
                            <Clock3 size={12} />
                            Duration (Minutes)
                        </label>
                        <input
                            required
                            type="number"
                            min="15"
                            value={formData.durationMinutes}
                            onChange={(e) => handleChange('durationMinutes', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-white/40">
                            <Users size={12} />
                            Expected Attendees
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.attendeesCount}
                            onChange={(e) => handleChange('attendeesCount', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-white/40">
                            <Sparkles size={12} />
                            Mode
                        </label>
                        <select
                            value={formData.mode}
                            onChange={(e) => handleChange('mode', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition-all focus:border-indigo-500"
                        >
                            <option value="Live">Live</option>
                            <option value="Online">Online</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-white/40">
                            <Tag size={12} />
                            Tags
                        </label>
                        <input
                            value={formData.tags}
                            onChange={(e) => handleChange('tags', e.target.value)}
                            placeholder="Guitar, Live, Beginner"
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-white/40">
                            <ImagePlus size={12} />
                            Cover Image URL
                        </label>
                        <input
                            value={formData.coverImage}
                            onChange={(e) => handleChange('coverImage', e.target.value)}
                            placeholder="https://..."
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold uppercase text-white/40">Accent Gradient</label>
                        <select
                            value={formData.accentColor}
                            onChange={(e) => handleChange('accentColor', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#151515] px-4 py-3 text-white outline-none transition-all focus:border-indigo-500"
                        >
                            <option value="from-purple-600 to-pink-600">Purple Pink</option>
                            <option value="from-blue-600 to-cyan-600">Blue Cyan</option>
                            <option value="from-amber-500 to-orange-600">Amber Orange</option>
                            <option value="from-emerald-600 to-teal-600">Emerald Teal</option>
                        </select>
                    </div>

                    <div className="md:col-span-2 pt-2">
                        <button
                            disabled={loading}
                            className="w-full rounded-2xl bg-indigo-600 py-4 font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Publishing Workshop...' : 'Publish Workshop'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
