import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, ShoppingCart, MessageCircle, PlayCircle, ShieldCheck, Store, MapPin, ExternalLink, Sparkles, UserCheck, Briefcase, Navigation } from 'lucide-react';
import { ReviewSection } from '../components/Events/ReviewSection';
import SellerMap from '../components/MarketPlace/SellerMap';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { buildRazorpayPrefill, loadRazorpay } from '../utils/razorpay';

// Helper for Haversine distance in KM
function getDistanceKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;
    return dist < 1 ? '< 1 km' : `${dist.toFixed(1)} km`;
}

const ProductDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [buyerLocation, setBuyerLocation] = useState(null);
    const demoVideo = product?.videos?.[0]?.url;

    const sellerObj = typeof product?.seller === 'object' ? product.seller : null;
    const sellerId = sellerObj?._id || product?.seller;

    const storeName = product?.sellerStoreName || sellerObj?.sellerProfile?.storeName || (sellerObj?.name ? `${sellerObj.name}'s Store` : 'Rahul Music Store');
    const locationName = product?.location || sellerObj?.sellerProfile?.location || sellerObj?.originLocation || 'Chandigarh';
    const sellerLat = product?.latitude || sellerObj?.sellerProfile?.latitude;
    const sellerLng = product?.longitude || sellerObj?.sellerProfile?.longitude;
    const sellerProfession = product?.sellerProfession || sellerObj?.sellerProfile?.sellerCategory || sellerObj?.role || 'Creator & Artisan';

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setBuyerLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => {}
            );
        }
    }, []);

    const handleContactSeller = async () => {
        const userId = user?._id || user?.id;

        if (!userId) {
            toast.error("Please login to message the seller.");
            navigate('/login');
            return;
        }

        if (!sellerId || sellerId === userId) {
            toast.error("Seller chat is not available for your own item.");
            return;
        }

        try {
            const res = await api.post(`/messages/start/${sellerId}`);
            navigate('/messages', { state: { conversationId: res.data.conversation?._id } });
        } catch {
            toast.error("Could not start chat with seller.");
        }
    };

    const handleBuyNow = async () => {
        const isLoaded = await loadRazorpay();
        if (!isLoaded) {
            toast.error("Razorpay SDK fail to load. Please check your internet.");
            return;
        }

        try {
            setIsProcessing(true);

            const { data } = await api.post('/payments/create-order', {
                amount: product.price,
                productId: product._id
            });

            const options = {
                key: data.key || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: "Artify Marketplace",
                description: `Buying ${product.name}`,
                order_id: data.order.id,
                prefill: buildRazorpayPrefill(user),
                config: {
                    display: {
                        preferences: {
                            show_default_blocks: true
                        }
                    }
                },
                theme: { color: "#fbbf24" },
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/payments/verify-payment', {
                            ...response,
                            products: [product._id],
                            productSnapshots: [product],
                            totalAmount: product.price
                        });

                        if (verifyRes.data.success) {
                            toast.success("Order Placed Successfully! 🛍️");
                            navigate("/dashboard");
                        }
                    } catch {
                        toast.error("Payment verification failed!");
                    }
                },
                modal: { ondismiss: () => setIsProcessing(false) },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Marketplace Payment Error:", error);
            toast.error("Failed to initiate payment");
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products/${id}`);
                setProduct(res.data.product);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product:", err);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <Loader2 className="animate-spin text-amber-500 mr-3" size={30} />
                <span>Loading Details...</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white flex-col">
                <h2 className="text-2xl font-bold text-red-400 mb-4">Product Not Found!</h2>
                <button onClick={() => navigate('/marketplace')} className="text-amber-400 underline">Back to Marketplace</button>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen text-white pb-12">
            <div className="max-w-[1280px] mx-auto px-6 pt-20">
                <button
                    onClick={() => navigate('/marketplace')}
                    className="flex items-center gap-2 text-white/50 hover:text-white mb-5 transition-colors text-sm font-medium"
                >
                    <ArrowLeft size={18} /> Back to Marketplace
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-6 bg-white/5 p-5 md:p-6 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">

                    <div className="space-y-4 min-w-0">
                        <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-3">
                            <img
                                src={product.images?.[0]?.url || 'https://via.placeholder.com/600'}
                                alt={product.name}
                                className="w-full max-h-[360px] object-contain rounded-xl hover:scale-[1.02] transition-transform duration-500"
                            />
                        </div>

                        {demoVideo && (
                            <div className="rounded-2xl overflow-hidden bg-black/40 border border-green-500/20 p-3">
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 text-green-300 text-sm font-bold">
                                        <ShieldCheck size={17} /> Seller demo video
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/40">
                                        <PlayCircle size={14} /> Condition and sound proof
                                    </div>
                                </div>
                                <video src={demoVideo} controls preload="metadata" className="max-h-[240px] w-full rounded-xl bg-black object-contain" />
                            </div>
                        )}
                    </div>

                    <div className="flex min-w-0 flex-col justify-between rounded-2xl border border-white/5 bg-black/20 p-5 space-y-4">
                        <div>
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                                        {product.category}
                                    </span>
                                    <span className="text-xs font-bold text-amber-300 bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-2.5 py-1 rounded-md border border-amber-500/30 flex items-center gap-1.5">
                                        <Briefcase size={12} className="text-amber-400" />
                                        {sellerProfession}
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-white/70 flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                                        <MapPin size={12} className="text-amber-400" />
                                        📍 {locationName}
                                    </span>
                                    {buyerLocation && sellerLat && sellerLng && (
                                        <span className="text-xs font-bold text-green-300 bg-green-500/10 border border-green-500/30 px-2.5 py-1 rounded-md flex items-center gap-1">
                                            <Navigation size={11} /> {getDistanceKm(buyerLocation.lat, buyerLocation.lng, sellerLat, sellerLng)} away
                                        </span>
                                    )}
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                                {product.name}
                            </h1>

                            <div className="text-3xl font-bold text-amber-400 mb-5 border-b border-white/10 pb-5">
                                ₹{product.price}
                            </div>

                            <p className="text-white/60 text-base leading-relaxed mb-6 max-h-[190px] overflow-y-auto pr-2 custom-scrollbar">
                                {product.description}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                            <button
                                onClick={handleBuyNow}
                                disabled={isProcessing}
                                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <ShoppingCart size={20} /> Buy Now
                            </button>
                            <button onClick={handleContactSeller} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                                <MessageCircle size={20} /> Contact Seller
                            </button>
                        </div>
                    </div>
                </div>

                {/* Real-world Seller & Store Location Map Card */}
                <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-bold text-xl shadow-lg shadow-amber-500/20 shrink-0">
                                {sellerObj?.profilePic ? (
                                    <img src={sellerObj.profilePic} alt={storeName} className="w-full h-full object-cover rounded-2xl" />
                                ) : (
                                    <Store size={26} />
                                )}
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-xl font-bold text-white">{storeName}</h3>
                                    <span className="bg-amber-500/20 text-amber-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1">
                                        <Briefcase size={11} className="text-amber-400" /> {sellerProfession}
                                    </span>
                                    <span className="bg-green-500/20 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/30 flex items-center gap-1">
                                        <ShieldCheck size={11} /> Verified Seller
                                    </span>
                                </div>
                                <p className="text-xs text-white/60 flex flex-wrap items-center gap-2 mt-1.5">
                                    <span className="flex items-center gap-1"><MapPin size={13} className="text-amber-400" /> 📍 {locationName}</span>
                                    {sellerObj?.name && <span>• Owner: {sellerObj.name}</span>}
                                    {buyerLocation && sellerLat && sellerLng && (
                                        <span className="text-green-400 font-bold">• 📍 {getDistanceKm(buyerLocation.lat, buyerLocation.lng, sellerLat, sellerLng)} from you</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${sellerLat && sellerLng ? `${sellerLat},${sellerLng}` : encodeURIComponent(`${storeName} ${locationName}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border border-white/10 shrink-0"
                            >
                                <ExternalLink size={14} /> Get Directions
                            </a>

                            {sellerId && (
                                <button
                                    onClick={() => navigate(`/profile/${sellerId}`)}
                                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0 shadow-md shadow-amber-500/20"
                                >
                                    <UserCheck size={15} /> View Seller Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <SellerMap
                        locationName={locationName}
                        latitude={sellerLat}
                        longitude={sellerLng}
                        storeName={storeName}
                        sellerCategory={sellerProfession}
                        sellerId={sellerId}
                        onNavigateProfile={(id) => navigate(`/profile/${id}`)}
                        height="340px"
                    />
                </div>

                <div className="mt-10 pt-6 border-t border-white/10">
                    <ReviewSection
                        targetId={product._id}
                        onModel="Product"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
