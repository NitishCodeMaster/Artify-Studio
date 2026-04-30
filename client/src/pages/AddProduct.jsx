import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Tag, AlertCircle, Feather, BookOpen, CheckCircle, ArrowLeft, Video, Image as ImageIcon, ShieldCheck } from 'lucide-react';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        originalPrice: '',
        price: '',
        category: 'handcrafted',
        condition: 'brand_new',
        imageUrl: '',
        videoUrl: ''
    });
    const [preview, setPreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setFormData({ ...formData, imageUrl: reader.result });
                setPreview(reader.result);
            };
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const maxSizeMb = 30;
        if (file.size > maxSizeMb * 1024 * 1024) {
            toast.error(`Video ${maxSizeMb}MB se chhota upload karo.`);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setFormData({ ...formData, videoUrl: reader.result });
            setVideoPreview(reader.result);
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const productData = {
                ...formData,
                images: [{ url: formData.imageUrl }],
                videos: formData.videoUrl ? [{ url: formData.videoUrl }] : [],
                seller: user._id || user.id
            };

            await api.post('/products/new', productData);

            toast.success("Masterpiece Added Successfully! 🎉", {
                style: { borderRadius: '10px', background: '#333', color: '#fff' }
            });
             navigate('/marketplace');
        } catch (err) {
            console.log(err);
            toast.error("Error adding product! Backend check karo. 🚨", {
                style: { borderRadius: '10px', background: '#333', color: '#fff' }
            });
        } finally {
            setLoading(false);
        }
    };

    const calculateDiscount = () => {
        if (formData.originalPrice && formData.price) {
            const orig = Number(formData.originalPrice);
            const sell = Number(formData.price);
            if (orig > sell) {
                return Math.round(((orig - sell) / orig) * 100);
            }
        }
        return 0;
    };

    const discount = calculateDiscount();

    return (
        <div className="bg-[#030303] min-h-screen text-white relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/20 via-[#030303] to-[#030303] pointer-events-none"></div>

            <div className="pt-32 pb-20 px-6 max-w-[1200px] mx-auto relative z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-2 text-white/50 hover:text-amber-400 font-medium text-sm mb-8 transition-colors w-fit"
                >
                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    Back to Marketplace
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                                Sell with proof, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">build buyer trust.</span>
                            </h1>
                            <p className="text-white/60 text-lg leading-relaxed">
                                List your handmade art, cultural pieces, or second-hand instruments with photo and optional video demo.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                    <BookOpen className="text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-1">Show The Sound</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">For used instruments, add a short video so buyers can see condition and hear tone.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                    <Feather className="text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-1">Authentic Makers</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">Connect with art lovers who appreciate genuine tribal and traditional craftsmanship.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                            <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                                    <CheckCircle size={18} /> Seller Tip
                                </h4>
                                <p className="text-white/70 text-sm leading-relaxed">
                                Record 10-20 seconds in good light. Show scratches, brand, sound test, and accessories honestly.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="bg-[#0a0a0a] p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">

                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none"></div>

                            <div className="relative z-10 mb-8">
                                <h2 className="text-2xl font-bold text-white">Artwork Details</h2>
                                <p className="text-white/50 mt-1 text-sm">List your item on the marketplace.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Title</label>
                                        <input type="text" placeholder="e.g. Bamboo Flute Set" required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all"
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Description & Story</label>
                                        <textarea placeholder="Share the story, materials, and history behind this piece..." required rows="4"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all resize-none"
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Tag size={16} className="text-amber-400" /> Pricing</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-white/50 mb-1">Market Value (₹)</label>
                                            <input type="number" placeholder="e.g. 8000" required
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white/60 focus:outline-none focus:border-amber-500"
                                                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
                                        </div>

                                        <div className="relative">
                                            <label className="block text-xs font-bold text-amber-400 mb-1">Asking Price (₹)</label>
                                            <input type="number" placeholder="e.g. 5000" required
                                                className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-white font-bold focus:outline-none focus:border-amber-400"
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })} />

                                            {discount > 0 && (
                                                <div className="absolute right-3 top-9 bg-green-500/20 text-green-400 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                                    {discount}% OFF
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Category</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 appearance-none"
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                            <option value="handcrafted" className="bg-black text-white">Handmade Crafts & Wood Art</option>
                                            <option value="traditional_art" className="bg-black text-white">Madhubani & Folk Art</option>
                                            <option value="tribal_instruments" className="bg-black text-white">Tribal Instruments</option>
                                            <option value="used_gear" className="bg-black text-white">Vintage & Used Gear</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Condition</label>
                                        <select className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 appearance-none"
                                            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}>
                                            <option value="brand_new" className="bg-black text-white">Newly Crafted / Authentic</option>
                                            <option value="antique" className="bg-black text-white">Antique / Heritage</option>
                                            <option value="like_new" className="bg-black text-white">Like New</option>
                                            <option value="used" className="bg-black text-white">Vintage Used</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Photo</label>
                                        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-amber-500 transition-colors relative bg-black/40 overflow-hidden group min-h-[260px]">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            required
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />

                                        {preview ? (
                                            <div className="relative z-0">
                                                <img src={preview} alt="Preview" className="h-48 w-full object-contain mx-auto rounded-lg" />
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <p className="text-white font-bold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">Change photo</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center py-6">
                                                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                    <ImageIcon className="w-8 h-8 text-amber-400" />
                                                </div>
                                                <p className="text-sm text-white font-medium">Upload Item Photo</p>
                                                <p className="text-xs text-white/40 mt-1">Clear, well-lit photos sell faster</p>
                                            </div>
                                        )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Video demo optional</label>
                                        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-amber-500 transition-colors relative bg-black/40 overflow-hidden group min-h-[260px]">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />

                                            {videoPreview ? (
                                                <div className="relative z-0">
                                                    <video src={videoPreview} controls className="h-48 w-full object-contain mx-auto rounded-lg" />
                                                    <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-300">
                                                        <ShieldCheck size={14} /> Trust video ready
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center py-6">
                                                    <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                        <Video className="w-8 h-8 text-amber-400" />
                                                    </div>
                                                    <p className="text-sm text-white font-medium">Upload Demo Video</p>
                                                    <p className="text-xs text-white/40 mt-1">Best for second-hand instruments. Max 30MB.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" disabled={loading} className="w-full mt-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] disabled:opacity-50 flex items-center justify-center gap-2">
                                    {loading ? <AlertCircle className="animate-spin" /> : 'List Item'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;
