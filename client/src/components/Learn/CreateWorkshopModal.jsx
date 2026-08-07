import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, CalendarDays, Clock3, ImagePlus, Tag, Users, Sparkles, Type, IndianRupee } from 'lucide-react';
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
    accessType: 'free',
    price: 0,
    coverImage: '',
    accentColor: 'from-purple-600 to-pink-600',
};

export default function CreateWorkshopModal({ isOpen, onClose, onCreated }) {
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [imageName, setImageName] = useState('');
    const fileInputRef = useRef(null);

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const handleImageUpload = (file) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file.');
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            toast.error('Image size must be less than 4MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            handleChange('coverImage', reader.result);
            setImageName(file.name);
        };
        reader.onerror = () => toast.error('Failed to read image file.');
        reader.readAsDataURL(file);
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
            toast.success('Workshop created successfully!');
            setFormData(initialState);
            setImageName('');
            onCreated?.(res.data.workshop);
            onClose?.();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create workshop.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center px-3 py-4 sm:px-4">
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
                className="relative max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0f0f12] shadow-2xl sm:rounded-[2rem]"
            >
                <div className="flex items-start justify-between gap-4 border-b border-white/5 bg-white/[0.02] px-4 py-4 sm:px-6 sm:py-5">
                    <div>
                        <p className="mb-1 text-xs font-bold uppercase tracking-[0.22em] text-pink-400">Mentor Workshop</p>
                        <h2 className="text-lg font-bold text-white sm:text-xl">Create Live Masterclass</h2>
                    </div>
                    <button type="button" onClick={onClose} className="shrink-0 rounded-full p-2 transition-colors hover:bg-white/5">
                        <X size={20} className="text-white/55" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid max-h-[calc(92vh-82px)] grid-cols-1 gap-5 overflow-y-auto p-4 sm:p-6 md:grid-cols-2 md:p-8">
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
                            onChange={(e) => handleChange('durationMinutes', Number(e.target.value))}
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
                            onChange={(e) => handleChange('attendeesCount', Number(e.target.value))}
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
                            <option value="Online">Online</option>
                            <option value="Live">Offline</option>
                            <option value="Hybrid">Hybrid</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-white/40">
                            <IndianRupee size={12} />
                            Class Access
                        </label>
                        <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1">
                            {[
                                { label: 'Free', value: 'free' },
                                { label: 'Paid', value: 'paid' },
                            ].map((item) => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => handleChange('accessType', item.value)}
                                    className={`rounded-lg px-3 py-2 text-sm font-bold transition-all ${formData.accessType === item.value ? 'bg-white text-black' : 'text-white/55 hover:bg-white/[0.05] hover:text-white'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {formData.accessType === 'paid' && (
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-bold uppercase text-white/40">
                                <IndianRupee size={12} />
                                Price (INR)
                            </label>
                            <input
                                required
                                type="number"
                                min="1"
                                value={formData.price}
                                onChange={(e) => handleChange('price', Number(e.target.value))}
                                placeholder="499"
                                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-all focus:border-indigo-500"
                            />
                        </div>
                    )}

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

                    <div className="space-y-3 md:col-span-2">
                        <label className="flex items-center gap-2 text-xs font-bold uppercase text-white/40">
                            <ImagePlus size={12} />
                            Cover Photo
                        </label>
                        <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex min-h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.035] px-4 py-5 text-center transition-all hover:border-indigo-400/50 hover:bg-indigo-500/10"
                            >
                                <ImagePlus size={26} className="mb-3 text-indigo-200" />
                                <span className="text-sm font-bold text-white">Upload Photo</span>
                                <span className="mt-1 text-xs text-white/40">JPG, PNG, WEBP up to 4MB</span>
                            </button>
                            <div className="relative min-h-36 overflow-hidden rounded-2xl border border-white/10 bg-[#08080a]">
                                {formData.coverImage ? (
                                    <>
                                        <img src={formData.coverImage} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-xl" />
                                        <img src={formData.coverImage} alt="Workshop cover preview" className="relative z-10 h-full max-h-56 w-full object-contain p-2" />
                                    </>
                                ) : (
                                    <div className="flex h-full min-h-36 items-center justify-center px-4 text-center text-sm text-white/35">
                                        Uploaded workshop cover preview yahan dikhega.
                                    </div>
                                )}
                            </div>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e.target.files?.[0])}
                        />
                        {imageName && <p className="truncate text-xs text-white/40">{imageName}</p>}
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
