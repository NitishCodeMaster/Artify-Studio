import React, { useState, useRef } from 'react';
import api from '../utils/api';
import { Footer } from '../components/Footer';
import { Loader2, Camera, Mail, Phone, UserCircle2, Sparkles, Tag, MapPin, Brush, Award } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AvatarEditor from 'react-avatar-editor';

export function Settings() {
    const user = JSON.parse(localStorage.getItem('user'));

    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [role, setRole] = useState(user?.role || 'Artist');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [profilePic, setProfilePic] = useState(user?.profilePic || '');
    const [originLocation, setOriginLocation] = useState(user?.originLocation || '');
    const [artStyle, setArtStyle] = useState(user?.artStyle || '');
    const [experience, setExperience] = useState(user?.experience || '');

    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [scale, setScale] = useState(1);
    const [uploadingImage, setUploadingImage] = useState(false);
    const editorRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setScale(1);
        }
    };

    const handleCropAndUpload = async () => {
        if (!editorRef.current) return;
        setUploadingImage(true);

        const canvas = editorRef.current.getImageScaledToCanvas();

        canvas.toBlob(async (blob) => {
            const formData = new FormData();
            formData.append('file', blob);

            formData.append('upload_preset', 'artify_community');

            try {
                const res = await fetch('https://api.cloudinary.com/v1_1/dinlyqk3c/image/upload', { 
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();

                if (data.secure_url) {
                    setProfilePic(data.secure_url);
                    toast.success("Photo cropped & uploaded magically! ✨");
                    setSelectedImage(null); 
                }
            } catch (err) {
                toast.error("Photo upload failed!");
            } finally {
                setUploadingImage(false);
            }
        }, 'image/jpeg', 0.9);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await api.put('/users/profile', {
                name, bio, role, phoneNumber, profilePic, originLocation, artStyle, experience
            });

            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.user));
                toast.success("Profile details updated! 🪄");
                setTimeout(() => window.location.reload(), 1500);
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
            {selectedImage && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#111] border border-white/10 p-6 md:p-8 rounded-3xl w-full max-w-md flex flex-col items-center shadow-2xl shadow-amber-500/10">
                        <h3 className="text-2xl font-black text-white mb-2">Adjust Photo</h3>
                        <p className="text-white/50 text-sm mb-6 text-center">Drag to move and use the slider to zoom.</p>

                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-inner">
                            <AvatarEditor
                                ref={editorRef}
                                image={selectedImage}
                                width={250}
                                height={250}
                                border={40}
                                borderRadius={125}
                                color={[0, 0, 0, 0.8]}
                                scale={scale}
                                rotate={0}
                            />
                        </div>

                        <div className="w-full mt-6 mb-8 flex items-center gap-4 px-4">
                            <span className="text-white/50 text-sm font-bold">Zoom</span>
                            <input
                                type="range"
                                min="1"
                                max="2"
                                step="0.01"
                                value={scale}
                                onChange={(e) => setScale(parseFloat(e.target.value))}
                                className="w-full accent-amber-500 h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="flex gap-4 w-full">
                            <button
                                type="button"
                                onClick={() => setSelectedImage(null)}
                                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleCropAndUpload}
                                disabled={uploadingImage}
                                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-black transition-all flex justify-center items-center shadow-lg shadow-amber-500/20"
                            >
                                {uploadingImage ? <Loader2 className="animate-spin" size={20} /> : 'Crop & Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-[900px] mx-auto px-6 pt-32 pb-24 relative z-10">
                <h1 className="text-4xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    Artist Dashboard
                </h1>
                <p className="text-white/50 mb-12">Showcase your true identity, heritage, and art to the world.</p>

                <form onSubmit={handleUpdate} className="space-y-12">

                    <div className="flex flex-col sm:flex-row items-center gap-8 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                        <div className="relative group shrink-0">
                            <div className="w-28 h-28 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center overflow-hidden">
                                {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : <UserCircle2 size={70} className="text-white/10" />}
                            </div>
                            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileSelect} />

                            <button type="button" onClick={() => fileInputRef.current.click()} className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center hover:bg-amber-400 transition-all shadow-lg shadow-black">
                                <Camera size={18} />
                            </button>
                        </div>
                        <div className="text-center sm:text-left">
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
                        <button type="submit" disabled={submitting} className="px-10 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-lg font-black transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : 'Save Profile'}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}
