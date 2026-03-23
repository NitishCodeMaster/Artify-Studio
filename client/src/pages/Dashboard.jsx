import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Package, Clock, ShieldCheck, ChevronRight, Loader2, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/payment/my-orders');
                setOrders(res.data.orders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

     const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="bg-[#030303] min-h-screen text-white font-sans selection:bg-amber-500/30 relative">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-600/10 blur-[120px] pointer-events-none rounded-full"></div>

            <Navbar />

            <div className="max-w-[1000px] mx-auto px-6 pt-32 pb-24 relative z-10">

                 <div className="flex items-center gap-6 mb-12 p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-4xl font-black text-black shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-1">
                            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{user?.name?.split(' ')[0]}</span>
                        </h1>
                        <p className="text-white/50 flex items-center gap-2">
                            <ShieldCheck size={16} className="text-green-400" /> Verified Collector Account
                        </p>
                    </div>
                </div>

                 <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                    <Package className="text-amber-500" size={24} /> My Collection (Orders)
                </h2>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="animate-spin text-amber-500" size={40} />
                        <p className="text-white/50 font-medium">Fetching your masterpieces...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02]"
                    >
                        <Package size={64} className="text-white/10 mb-6" />
                        <h3 className="text-2xl font-bold text-white mb-2">No masterpieces yet</h3>
                        <p className="text-white/40 mb-8 max-w-md">Your collection is currently empty. Explore the marketplace to find unique traditional art and instruments.</p>
                        <Link to="/marketplace" className="bg-amber-500 text-black px-8 py-3 rounded-full font-bold hover:bg-amber-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                            Explore Marketplace
                        </Link>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={order._id}
                                className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-colors"
                            >
                                 <div className="bg-white/[0.03] px-6 py-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center gap-6">
                                        <div>
                                            <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">Order Placed</p>
                                            <p className="text-sm text-white/90 font-medium flex items-center gap-1">
                                                <Clock size={14} className="text-amber-500" /> {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block w-[1px] h-8 bg-white/10"></div>
                                        <div>
                                            <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">Total Amount</p>
                                            <p className="text-sm text-white/90 font-bold flex items-center">
                                                <IndianRupee size={14} className="text-amber-500 mr-1" /> {order.totalAmount}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-white/40 font-bold uppercase tracking-wider mb-1">Order ID</p>
                                        <p className="text-sm text-white/60 font-mono">#{order.razorpay_order_id?.slice(-8)}</p>
                                    </div>
                                </div>

                                 <div className="p-6">
                                    {order.products.map((product) => (
                                        <div key={product._id} className="flex items-center gap-6 py-4 first:pt-0 last:pb-0 border-b border-white/5 last:border-0 group">
                                            <div className="w-24 h-24 rounded-2xl bg-black border border-white/10 overflow-hidden shrink-0 relative">
                                                <img
                                                    src={product.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-white/90 mb-1 group-hover:text-amber-400 transition-colors cursor-pointer">
                                                    {product.name}
                                                </h4>
                                                <p className="text-sm text-white/50 line-clamp-1 mb-2">{product.description}</p>
                                                <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider rounded-lg border border-amber-500/20">
                                                    {order.status}
                                                </span>
                                            </div>
                                            <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-white/40 group-hover:bg-amber-500 group-hover:text-black transition-all">
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default Dashboard;