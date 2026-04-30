import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, ShoppingCart, MessageCircle, PlayCircle, ShieldCheck } from 'lucide-react';
import { ReviewSection } from '../components/Events/ReviewSection';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { buildRazorpayPrefill, loadRazorpay } from '../utils/razorpay';

const ProductDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const demoVideo = product?.videos?.[0]?.url;

    const handleContactSeller = async () => {
        const sellerId = product?.seller?._id || product?.seller;
        const userId = user?._id || user?.id;

        if (!userId) {
            toast.error("Please login to message the seller.");
            navigate('/login');
            return;
        }

        if (!sellerId || sellerId === userId) {
            toast.error("Seller chat is not available for this item.");
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
                <Loader2 className="animate-spin text-indigo-500 mr-3" size={30} />
                <span>Loading Details...</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white flex-col">
                <h2 className="text-2xl font-bold text-red-400 mb-4">Product Not Found!</h2>
                <button onClick={() => navigate('/marketplace')} className="text-indigo-400 underline">Back to Marketplace</button>
            </div>
        );
    }

    return (
        <div className="bg-[#050505] min-h-screen text-white pb-20">
            <div className="max-w-[1100px] mx-auto px-6 pt-32">
                <button
                    onClick={() => navigate('/marketplace')}
                    className="flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={18} /> Back to Marketplace
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/5 p-6 md:p-10 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">

                    <div className="rounded-2xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center p-4">
                        <img
                            src={product.images?.[0]?.url || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            className="w-full max-h-[500px] object-contain rounded-xl hover:scale-105 transition-transform duration-500"
                        />
                    </div>

                    {demoVideo && (
                        <div className="md:col-span-2 rounded-2xl overflow-hidden bg-black/40 border border-green-500/20 p-4">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-green-300 text-sm font-bold">
                                    <ShieldCheck size={18} /> Seller demo video
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-white/40">
                                    <PlayCircle size={14} /> Condition and sound proof
                                </div>
                            </div>
                            <video src={demoVideo} controls preload="metadata" className="max-h-[460px] w-full rounded-xl bg-black object-contain" />
                        </div>
                    )}

                    <div className="flex flex-col justify-center">
                        <span className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-3">
                            {product.category}
                        </span>

                        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                            {product.name}
                        </h1>

                        <div className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-6">
                            ₹{product.price}
                        </div>

                        <p className="text-white/60 text-lg leading-relaxed mb-8">
                            {product.description}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                            <button
                                onClick={handleBuyNow}
                                disabled={isProcessing}
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <ShoppingCart size={20} /> Buy Now
                            </button>
                            <button onClick={handleContactSeller} className="flex-1 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                                <MessageCircle size={20} /> Contact Seller
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-white/10">
                    <ReviewSection
                        targetId={product._id}
                        onModel="Product"
                    />
                </div>
            </div>
        </div >
    );
};

export default ProductDetails;
