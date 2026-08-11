import React, { useState } from 'react';
import { X, Briefcase, IndianRupee, Calendar, Send, Sparkles, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CommissionModal = ({ isOpen, onClose, artist }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        serviceType: 'Custom Artwork / Painting',
        budget: '5000',
        targetDate: '',
        requirements: '',
        contactPhone: ''
    });

    if (!isOpen || !artist) return null;

    const artistName = artist.name || 'Artist';
    const artistId = artist._id || artist.id;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const currentUserId = JSON.parse(localStorage.getItem('user'))?.id || JSON.parse(localStorage.getItem('user'))?._id;

        if (!currentUserId) {
            toast.error("Please login to request a commission.");
            setLoading(false);
            navigate('/login');
            return;
        }

        if (currentUserId === artistId) {
            toast.error("You cannot hire yourself for a commission.");
            setLoading(false);
            return;
        }

        try {
            // Send commission request message directly via conversation API
            const commissionText = `🎨 CUSTOM COMMISSION PROPOSAL\n\n📌 Type: ${formData.serviceType}\n💰 Budget: ₹${formData.budget}\n📅 Target Date: ${formData.targetDate || 'Flexible'}\n📞 Contact: ${formData.contactPhone || 'N/A'}\n\n📝 Details:\n${formData.requirements}`;

            const res = await api.post(`/messages/start/${artistId}`);
            const conversationId = res.data.conversation?._id;

            if (conversationId) {
                await api.post('/messages/send', {
                    conversationId,
                    text: commissionText
                });

                toast.success(`Commission proposal sent to ${artistName}! 🎨✨`, { duration: 2500 });
                onClose();
                navigate('/messages', { state: { conversationId } });
            }
        } catch (error) {
            console.error("Commission submit error:", error);
            toast.error("Error sending commission proposal. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
            <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0d0d12] border border-amber-500/30 rounded-3xl p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 shadow-2xl my-auto">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[90px] pointer-events-none"></div>

                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-black">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white leading-tight">Request Custom Commission</h3>
                            <p className="text-xs text-white/50">Hire <span className="text-amber-400 font-bold">{artistName}</span> for custom art or gigs</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    <div>
                        <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">
                            Commission / Work Type
                        </label>
                        <select
                            value={formData.serviceType}
                            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                            className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
                        >
                            <option value="Custom Artwork / Painting">🎨 Custom Canvas Artwork / Traditional Painting</option>
                            <option value="Handcrafted Instrument Build">🪕 Handcrafted Musical Instrument Build</option>
                            <option value="Live Event Performance / Gig Booking">🎤 Live Performance / Music Gig Booking</option>
                            <option value="Wood / Stone Carving Commission">🪵 Custom Wood / Sculpture Carving</option>
                            <option value="Digital Art & Illustration">💻 Digital Art & Illustration</option>
                            <option value="Private Art/Music Workshop">📚 Private Masterclass / Workshop Session</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-white/60 mb-1">Budget Offer (₹)</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="e.g. 5000"
                                    value={formData.budget}
                                    required
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    className="w-full bg-black/60 border border-white/15 rounded-xl p-3 pl-8 text-xs text-white focus:outline-none focus:border-amber-500"
                                />
                                <IndianRupee size={14} className="absolute left-2.5 top-3.5 text-amber-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-white/60 mb-1">Target Completion Date</label>
                            <input
                                type="date"
                                value={formData.targetDate}
                                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                                className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-white/60 mb-1">Your Requirements & Concept Details</label>
                        <textarea
                            rows="4"
                            placeholder="Describe your vision, dimensions, timber/canvas preferences, or gig details..."
                            required
                            value={formData.requirements}
                            onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                            className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-white/60 mb-1">Your Phone Number (Optional)</label>
                        <input
                            type="text"
                            placeholder="e.g. +91 9876543210"
                            value={formData.contactPhone}
                            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                            className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>

                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
                        <ShieldCheck size={16} className="shrink-0 text-amber-400" />
                        <span>Proposal will be sent directly to {artistName}'s chat inbox for instant review.</span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : (
                            <>
                                <Send size={16} /> Send Commission Proposal
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CommissionModal;
