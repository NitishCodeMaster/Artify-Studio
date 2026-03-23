import React, { useState, useRef } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Loader2, Camera, Mail, Phone, UserCircle2, Sparkles, Tag, MapPin, Brush, Award } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export function Settings() {
    const user = JSON.parse(localStorage.getItem('user'));

    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [role, setRole] = useState(user?.role || 'Artist');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');

    const [originLocation, setOriginLocation] = useState(user?.originLocation || '');
    const [artStyle, setArtStyle] = useState(user?.artStyle || '');
    const [experience, setExperience] = useState(user?.experience || '');

    const [uploadingImage, setUploadingImage] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'YOUR_UPLOAD_PRESET');

        try {
            const res = await fetch('https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (data.secure_url) {
                setAvatar(data.secure_url);
                toast.success("Photo uploaded! Click 'Save Changes' to apply.");
            }
        } catch (err) {
            toast.error("Photo upload failed!");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.put('/users/update-profile', {
                name, bio, role, phoneNumber, avatar, originLocation, artStyle, experience
            });

            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                toast.success("Profile details updated magically! 🪄");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#030303] min-h-screen text-white font-sans relative">
            <Toaster position="bottom-right" />
            <Navbar />

            <div className="max-w-[900px] mx-auto px-6 pt-32 pb-24 relative z-10">
                <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    Artist Dashboard
                </h1>
                <p className="text-white/50 mb-12">Showcase your true identity, heritage, and art to the world.</p>

                <form onSubmit={handleUpdate} className="space-y-12">

                    <div className="flex items-center gap-8 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                        <div className="relative group shrink-0">
                            <div className="w-28 h-28 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center overflow-hidden">
                                {avatar ? <img src={avatar} alt="Profile" className="w-full h-full object-cover" /> : <UserCircle2 size={70} className="text-white/10" />}
                            </div>
                            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                            <button type="button" onClick={() => fileInputRef.current.click()} disabled={uploadingImage} className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center hover:bg-amber-400 transition-all">
                                {uploadingImage ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
                            </button>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold mb-1">Profile Picture</h3>
                            <p className="text-sm text-white/50">Upload a clear picture of you or your artwork.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="text-amber-500" /> Core Identity</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-white/60 mb-2 block">Display Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/[0.03] p-4 rounded-xl border border-white/10 focus:border-amber-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-sm text-white/60 mb-2 flex items-center gap-1.5"><Tag size={16} /> Artist Type / Role</label>
                                <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g., Guitarist, Singer, Event Organizer" className="w-full bg-white/[0.03] p-4 rounded-xl border border-white/10 focus:border-amber-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-white/60 mb-2 block">Artist Bio</label>
                            <textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={200} rows={3} placeholder="Tell the community your story..." className="w-full bg-white/[0.03] p-4 rounded-xl border border-white/10 focus:border-amber-500 outline-none resize-none" />
                        </div>
                    </div>

                    <div className="space-y-6 p-8 rounded-3xl bg-amber-500/5 border border-amber-500/20">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-amber-500"><MapPin /> Heritage & Craft</h2>
                        <p className="text-sm text-white/50 mb-4">Let buyers know where your art comes from. Great for traditional and local artists.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-white/60 mb-2 flex items-center gap-1.5"><MapPin size={16} /> Origin / Village / City</label>
                                <input type="text" value={originLocation} onChange={e => setOriginLocation(e.target.value)} placeholder="e.g., Mithila, Bihar or Bastar, CG" className="w-full bg-black/40 p-4 rounded-xl border border-white/10 focus:border-amber-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-sm text-white/60 mb-2 flex items-center gap-1.5"><Brush size={16} /> Specific Art Style</label>
                                <input type="text" value={artStyle} onChange={e => setArtStyle(e.target.value)} placeholder="e.g., Madhubani, Tribal Bamboo Craft, Rock Music" className="w-full bg-black/40 p-4 rounded-xl border border-white/10 focus:border-amber-500 outline-none" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm text-white/60 mb-2 flex items-center gap-1.5"><Award size={16} /> Years of Experience</label>
                                <input type="text" value={experience} onChange={e => setExperience(e.target.value)} placeholder="e.g., 10 Years, or Since Childhood" className="w-full bg-black/40 p-4 rounded-xl border border-white/10 focus:border-amber-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-white/80"><Phone className="text-green-500" /> Contact Info (Private)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm text-white/60 mb-2 flex items-center gap-1.5"><Mail size={16} /> Email (Cannot Change)</label>
                                <input type="email" value={user?.email || ''} disabled className="w-full bg-white/[0.01] p-4 rounded-xl border border-white/5 text-white/30 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="text-sm text-white/60 mb-2 flex items-center gap-1.5"><Phone size={16} /> Phone Number</label>
                                <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="+91 9876543210" className="w-full bg-white/[0.03] p-4 rounded-xl border border-white/10 focus:border-amber-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-10 flex justify-end">
                        <button type="submit" disabled={submitting || uploadingImage} className="px-10 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-lg font-black transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}