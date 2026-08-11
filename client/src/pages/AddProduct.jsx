import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { Tag, AlertCircle, Feather, BookOpen, CheckCircle, ArrowLeft, Video, Image as ImageIcon, ShieldCheck, MapPin, Store, LocateFixed, Sparkles, Briefcase, Map } from 'lucide-react';
import { getCityCoordinates } from '../components/MarketPlace/SellerMap';
import LocationPickerMap from '../components/MarketPlace/LocationPickerMap';

const AddProduct = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const defaultStore = user?.sellerProfile?.storeName || (user?.name ? `${user.name}'s Music & Crafts` : 'Rahul Music Store');
    const defaultLoc = user?.sellerProfile?.location || user?.originLocation || 'Chandigarh';
    const defaultProfession = user?.sellerProfile?.sellerCategory || 'Visual Painter & Canvas Artist';

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        originalPrice: '',
        price: '',
        category: 'handcrafted',
        condition: 'brand_new',
        imageUrl: '',
        videoUrl: '',
        sellerStoreName: defaultStore,
        sellerProfession: defaultProfession,
        location: defaultLoc,
        latitude: user?.sellerProfile?.latitude || null,
        longitude: user?.sellerProfile?.longitude || null
    });

    const [preview, setPreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const navigate = useNavigate();

    const presetCities = [
        { name: 'Chandigarh', coords: [30.7333, 76.7794] },
        { name: 'Jaipur, Rajasthan', coords: [26.9124, 75.7873] },
        { name: 'Delhi Haat, Delhi', coords: [28.5733, 77.2090] },
        { name: 'Kolkata, West Bengal', coords: [22.5726, 88.3639] },
        { name: 'Mumbai, Maharashtra', coords: [19.0760, 72.8777] },
        { name: 'Haridwar, Uttarakhand', coords: [29.9457, 78.1642] },
        { name: 'Ranchi, Jharkhand (Tribal Hub)', coords: [23.3441, 85.3096] },
    ];

    const handleSelectPreset = (city) => {
        setFormData(prev => ({
            ...prev,
            location: city.name,
            latitude: city.coords[0],
            longitude: city.coords[1]
        }));
        toast.success(`Location set to ${city.name} 📍`);
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setFormData(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                    location: prev.location || 'Current GPS Location'
                }));
                setIsLocating(false);
                toast.success("GPS Coordinates Detected! 📍");
            },
            () => {
                setIsLocating(false);
                toast.error("Could not detect location. Selected default city.");
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

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
            toast.error(`Please upload a video smaller than ${maxSizeMb}MB.`);
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
            const currentUserId = user._id || user.id;

            let finalLat = formData.latitude;
            let finalLng = formData.longitude;
            if (!finalLat || !finalLng) {
                const cityCoords = getCityCoordinates(formData.location);
                finalLat = cityCoords[0];
                finalLng = cityCoords[1];
            }

            const productData = {
                ...formData,
                latitude: finalLat,
                longitude: finalLng,
                images: [{ url: formData.imageUrl }],
                videos: formData.videoUrl ? [{ url: formData.videoUrl }] : [],
                seller: currentUserId
            };

            await api.post('/products/new', productData);

            toast.success("Masterpiece & Seller Location Added! 🎉", {
                duration: 2200,
                style: { borderRadius: '10px', background: '#333', color: '#fff' }
            });
            setTimeout(() => navigate('/marketplace'), 350);
        } catch (err) {
            console.error(err);
            toast.error("Error adding product! Please try again. 🚨", {
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

            <div className="pt-20 pb-14 px-6 max-w-[1200px] mx-auto relative z-10">
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
                    <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                                Sell with proof, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">show your location.</span>
                            </h1>
                            <p className="text-white/60 text-lg leading-relaxed">
                                List your handmade art, tribal instruments, or second-hand gear with your store profile and map location.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                                    <Store className="text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-1">Seller Location & Profile</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">Add your shop name (e.g. Rahul Music Store) and city location (e.g. 📍 Chandigarh) so buyers nearby can find you.</p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                                    <Feather className="text-orange-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-1">Authentic Tribal & Folk Art</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">Connect with art lovers looking for genuine local craftsmanship and secondhand instruments.</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-500/20 shadow-lg shadow-amber-500/5">
                            <h4 className="text-amber-400 font-bold mb-3 flex items-center gap-2">
                                <CheckCircle size={18} /> Location & Trust Tip
                            </h4>
                            <p className="text-white/70 text-sm leading-relaxed">
                                Adding your city location and a short demo video builds high trust for instrument buyers and art collectors.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="bg-[#0a0a0a] p-4 sm:p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] pointer-events-none"></div>

                            <div className="relative z-10 mb-8">
                                <h2 className="text-2xl font-bold text-white">Item & Seller Details</h2>
                                <p className="text-white/50 mt-1 text-sm">Fill in details and set your location on the map.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                                {/* Seller Profile & Location Section */}
                                <div className="p-5 rounded-2xl bg-white/5 border border-amber-500/20 space-y-5">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                                            <Store size={16} /> Seller Profile, Profession & Interactive Map Location
                                        </h3>
                                        <div className="text-[11px] font-bold text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/10 flex items-center gap-1">
                                            <Sparkles size={12} className="text-amber-400" /> Real-world Seller Pin
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-white/60 mb-1">Store / Seller Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Rahul Music Store"
                                                value={formData.sellerStoreName}
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 text-sm"
                                                onChange={(e) => setFormData({ ...formData, sellerStoreName: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-amber-400 mb-1 flex items-center gap-1.5">
                                                <Briefcase size={14} /> Seller Profession Type
                                            </label>
                                            <select
                                                value={formData.sellerProfession}
                                                onChange={(e) => setFormData({ ...formData, sellerProfession: e.target.value })}
                                                className="w-full bg-black/40 border border-amber-500/30 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 text-sm appearance-none font-medium"
                                            >
                                                <option value="Visual Painter & Canvas Artist" className="bg-black text-white">🎨 Visual Painter & Canvas Artist</option>
                                                <option value="Luthier & Musical Instrument Maker" className="bg-black text-white">🪕 Luthier & Musical Instrument Craftsman</option>
                                                <option value="Wood Carver & Furniture Artisan" className="bg-black text-white">🪵 Wood Carver & Furniture Artisan</option>
                                                <option value="Potter & Ceramic Craftsman" className="bg-black text-white">🪴 Potter & Ceramic Craftsman</option>
                                                <option value="Sculptor & Statue Craftsman" className="bg-black text-white">🗿 Sculptor & Statue Craftsman</option>
                                                <option value="Traditional Folk & Tribal Artisan" className="bg-black text-white">🎭 Traditional Folk & Tribal Artisan (Madhubani, Warli)</option>
                                                <option value="Digital Artist & Designer" className="bg-black text-white">💻 Digital Artist & Designer</option>
                                                <option value="Vintage Gear & Antique Collector" className="bg-black text-white">🏺 Vintage Gear & Antique Collector</option>
                                                <option value="Textile & Handloom Artisan" className="bg-black text-white">🧵 Textile & Handloom Artisan</option>
                                                <option value="Fine Art Photographer" className="bg-black text-white">📸 Fine Art Photographer</option>
                                                <option value="Creator & Artisan" className="bg-black text-white">🛠️ General Creator & Artisan</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-white/60 mb-1">City / Address Location</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="e.g. 📍 Chandigarh, Sector 17"
                                                value={formData.location}
                                                required
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 pl-9 text-white focus:outline-none focus:border-amber-500 text-sm"
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                            <MapPin size={16} className="absolute left-3 top-3.5 text-amber-400" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-white/40 mb-2">Quick Select Popular Indian Hubs:</label>
                                        <div className="flex flex-wrap gap-2">
                                            {presetCities.map(city => (
                                                <button
                                                    key={city.name}
                                                    type="button"
                                                    onClick={() => handleSelectPreset(city)}
                                                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                                                        formData.location === city.name
                                                            ? 'bg-amber-500 text-black border-amber-400 font-bold'
                                                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                                                    }`}
                                                >
                                                    📍 {city.name.split(',')[0]}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interactive Leaflet Map Location Selection */}
                                    <div className="pt-2 border-t border-white/10">
                                        <label className="block text-xs font-bold text-amber-400 mb-2 flex items-center gap-2">
                                            <Map size={15} /> Select Exact Location on Interactive Map:
                                        </label>
                                        <LocationPickerMap
                                            selectedLat={formData.latitude}
                                            selectedLng={formData.longitude}
                                            locationName={formData.location}
                                            onLocationChange={({ latitude, longitude, location }) => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    latitude,
                                                    longitude,
                                                    location: location || prev.location
                                                }));
                                            }}
                                            height="280px"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Title</label>
                                        <input type="text" placeholder="e.g. Handmade Sitar / Bamboo Flute Set" required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Description & Story</label>
                                        <textarea placeholder="Share the history, timber, sound, or craftsmanship behind this piece..." required rows="4"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 focus:bg-white/10 transition-all resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Tag size={16} className="text-amber-400" /> Pricing</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-white/50 mb-1">Market Value (₹)</label>
                                            <input type="number" placeholder="e.g. 8000" required
                                                value={formData.originalPrice}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white/60 focus:outline-none focus:border-amber-500"
                                                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
                                        </div>

                                        <div className="relative">
                                            <label className="block text-xs font-bold text-amber-400 mb-1">Asking Price (₹)</label>
                                            <input type="number" placeholder="e.g. 5000" required
                                                value={formData.price}
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
                                        <select
                                            value={formData.category}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 appearance-none"
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                                            <option value="handcrafted" className="bg-black text-white">Handmade Crafts & Wood Art</option>
                                            <option value="traditional_art" className="bg-black text-white">Madhubani & Folk Art</option>
                                            <option value="tribal_instruments" className="bg-black text-white">Tribal Instruments</option>
                                            <option value="used_gear" className="bg-black text-white">Vintage & Used Gear</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Condition</label>
                                        <select
                                            value={formData.condition}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-amber-500 appearance-none"
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
                                                required={!preview}
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
                                    {loading ? <AlertCircle className="animate-spin" /> : 'List Item with Store Location'}
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
