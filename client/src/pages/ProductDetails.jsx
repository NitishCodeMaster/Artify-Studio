import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Loader2, ArrowLeft, ShoppingCart, MessageCircle } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try { 
                const res = await axios.get(`http://localhost:5000/products/${id}`);
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
            <Navbar />

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
                            <button className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2">
                                <ShoppingCart size={20} /> Buy Now
                            </button>
                            <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                                <MessageCircle size={20} /> Contact Seller
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;