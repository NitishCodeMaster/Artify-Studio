import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { ShoppingBag, TrendingUp, History, ArrowDownLeft, ArrowUpRight, Search, ShieldCheck, Clock, IndianRupee, Store, User, CreditCard, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const TradeHistory = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('purchases'); // 'purchases', 'sales', 'ledger'
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [data, setData] = useState({
        walletBalance: 0,
        purchases: [],
        sales: [],
        transactions: []
    });

    const user = JSON.parse(localStorage.getItem('user')) || {};

    const fetchTradeHistory = async () => {
        try {
            setLoading(true);
            const res = await api.get('/payments/trade-history');
            if (res.data.success) {
                setData({
                    walletBalance: res.data.walletBalance || 0,
                    purchases: res.data.purchases || [],
                    sales: res.data.sales || [],
                    transactions: res.data.transactions || []
                });
            }
        } catch (error) {
            console.error("Fetch trade history error:", error);
            toast.error("Could not load trade history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTradeHistory();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Recent';
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter purchases
    const filteredPurchases = data.purchases.filter(item => {
        const query = searchQuery.toLowerCase();
        const prodName = item.products?.[0]?.name || item.eventId?.title || item.workshopId?.title || '';
        const seller = item.products?.[0]?.seller?.name || item.products?.[0]?.seller?.sellerProfile?.storeName || '';
        const orderId = item.razorpay_order_id || '';
        const paymentId = item.razorpay_payment_id || '';
        return prodName.toLowerCase().includes(query) || seller.toLowerCase().includes(query) || orderId.toLowerCase().includes(query) || paymentId.toLowerCase().includes(query);
    });

    // Filter sales
    const filteredSales = data.sales.filter(item => {
        const query = searchQuery.toLowerCase();
        const prodName = item.products?.[0]?.name || '';
        const buyer = item.user?.name || item.user?.email || '';
        const orderId = item.razorpay_order_id || '';
        const paymentId = item.razorpay_payment_id || '';
        return prodName.toLowerCase().includes(query) || buyer.toLowerCase().includes(query) || orderId.toLowerCase().includes(query) || paymentId.toLowerCase().includes(query);
    });

    // Total earnings calculation from sales
    const totalSalesRevenue = data.sales.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0);

    return (
        <div className="bg-[#030303] min-h-screen text-white font-sans selection:bg-amber-500/30 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-600/10 blur-[130px] pointer-events-none rounded-full"></div>

            <div className="max-w-[1100px] mx-auto px-6 pt-20 pb-16 relative z-10">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-white/50 hover:text-amber-400 font-medium text-xs mb-6 transition-colors w-fit"
                >
                    <ArrowLeft size={16} /> Back
                </button>

                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl mb-8">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
                            <History size={30} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight">
                                Trade & Orders History
                            </h1>
                            <p className="text-xs text-white/50 mt-1 flex items-center gap-1.5">
                                <ShieldCheck size={14} className="text-green-400" />
                                Real-time ledger of your purchases, sales, and wallet transactions.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-black/60 p-4 rounded-2xl border border-white/10 shrink-0">
                        <div className="text-right">
                            <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Wallet Balance</div>
                            <div className="text-2xl font-black text-amber-400">₹{data.walletBalance.toLocaleString()}</div>
                        </div>
                        <button
                            onClick={() => navigate('/wallet')}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20"
                        >
                            Open Wallet
                        </button>
                    </div>
                </div>

                {/* Stats Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                            <ShoppingBag size={22} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white/40 uppercase tracking-wider">Items Bought</div>
                            <div className="text-2xl font-black text-white">{data.purchases.length} Orders</div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center shrink-0">
                            <TrendingUp size={22} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white/40 uppercase tracking-wider">Sales Revenue</div>
                            <div className="text-2xl font-black text-green-400">₹{totalSalesRevenue.toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                            <CreditCard size={22} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-white/40 uppercase tracking-wider">Total Transactions</div>
                            <div className="text-2xl font-black text-white">{data.transactions.length} Activity</div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs & Search */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
                        <button
                            onClick={() => setActiveTab('purchases')}
                            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'purchases'
                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            <ShoppingBag size={15} />
                            <span>My Purchases ({data.purchases.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('sales')}
                            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'sales'
                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            <TrendingUp size={15} />
                            <span>My Sales & Earnings ({data.sales.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('ledger')}
                            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                activeTab === 'ledger'
                                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                                    : 'text-white/60 hover:text-white'
                            }`}
                        >
                            <CreditCard size={15} />
                            <span>Wallet Ledger</span>
                        </button>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search size={15} className="absolute left-3.5 top-3 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search orders, IDs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/40 focus:border-amber-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Tab Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="animate-spin text-amber-500 mb-3" size={40} />
                        <p className="text-xs text-white/40">Fetching trade history...</p>
                    </div>
                ) : (
                    <div>
                        {/* TAB 1: PURCHASES */}
                        {activeTab === 'purchases' && (
                            <div className="space-y-4">
                                {filteredPurchases.length > 0 ? (
                                    filteredPurchases.map((order) => {
                                        const firstProduct = order.products?.[0];
                                        const sellerObj = firstProduct?.seller;
                                        const sellerName = sellerObj?.sellerProfile?.storeName || sellerObj?.name || 'Artify Verified Seller';

                                        return (
                                            <div
                                                key={order._id}
                                                className="bg-[#0a0a0a] border border-white/10 hover:border-amber-500/30 rounded-2xl overflow-hidden transition-all duration-300 p-5 space-y-4 shadow-xl"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold uppercase tracking-wider">
                                                            ✓ {order.status || 'Paid & Verified'}
                                                        </span>
                                                        <span className="text-xs text-white/50 flex items-center gap-1">
                                                            <Clock size={13} className="text-amber-400" /> {formatDate(order.createdAt)}
                                                        </span>
                                                    </div>

                                                    <div className="text-right">
                                                        <span className="text-[11px] font-mono text-white/40">Pay ID: {order.razorpay_payment_id || 'pay_verified'}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0">
                                                            <img
                                                                src={firstProduct?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                                                alt={firstProduct?.name || 'Order Item'}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-base font-bold text-white leading-tight">
                                                                {firstProduct?.name || order.eventId?.title || order.workshopId?.title || 'Artify Item'}
                                                            </h4>
                                                            <p className="text-xs text-amber-400 flex items-center gap-1 mt-1 font-medium">
                                                                <Store size={12} /> Seller: {sellerName}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="text-left sm:text-right shrink-0">
                                                        <div className="text-xs text-white/40 font-semibold">Total Paid</div>
                                                        <div className="text-xl font-black text-amber-400">₹{order.totalAmount}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-12 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl space-y-3">
                                        <ShoppingBag size={36} className="mx-auto text-white/20" />
                                        <h4 className="text-base font-bold text-white">No purchases found</h4>
                                        <p className="text-xs text-white/40">Explore the marketplace to make your first purchase.</p>
                                        <Link to="/marketplace" className="inline-block px-5 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl mt-2">
                                            Go to Marketplace
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 2: SALES */}
                        {activeTab === 'sales' && (
                            <div className="space-y-4">
                                {filteredSales.length > 0 ? (
                                    filteredSales.map((order) => {
                                        const firstProduct = order.products?.[0];
                                        const buyerObj = order.user;

                                        return (
                                            <div
                                                key={order._id}
                                                className="bg-[#0a0a0a] border border-white/10 hover:border-green-500/30 rounded-2xl overflow-hidden transition-all duration-300 p-5 space-y-4 shadow-xl"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className="px-2.5 py-1 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 text-[10px] font-bold uppercase tracking-wider">
                                                            💰 Sale Credited
                                                        </span>
                                                        <span className="text-xs text-white/50 flex items-center gap-1">
                                                            <Clock size={13} className="text-amber-400" /> {formatDate(order.createdAt)}
                                                        </span>
                                                    </div>

                                                    <span className="text-[11px] font-mono text-white/40">Pay ID: {order.razorpay_payment_id || 'pay_verified'}</span>
                                                </div>

                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0">
                                                            <img
                                                                src={firstProduct?.images?.[0]?.url || 'https://via.placeholder.com/150'}
                                                                alt={firstProduct?.name || 'Sold Item'}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-base font-bold text-white leading-tight">
                                                                {firstProduct?.name || 'Sold Artwork/Instrument'}
                                                            </h4>
                                                            <p className="text-xs text-green-300 flex items-center gap-1 mt-1 font-medium">
                                                                <User size={12} /> Buyer: {buyerObj?.name || buyerObj?.email || 'Registered Buyer'}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="text-left sm:text-right shrink-0">
                                                        <div className="text-xs text-white/40 font-semibold">Revenue Earned</div>
                                                        <div className="text-xl font-black text-green-400">+₹{order.totalAmount}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="p-12 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl space-y-3">
                                        <TrendingUp size={36} className="mx-auto text-white/20" />
                                        <h4 className="text-base font-bold text-white">No sales recorded yet</h4>
                                        <p className="text-xs text-white/40">When buyers purchase your items, sales will appear here.</p>
                                        <Link to="/add-product" className="inline-block px-5 py-2 bg-amber-500 text-black text-xs font-bold rounded-xl mt-2">
                                            List New Item
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* TAB 3: WALLET LEDGER */}
                        {activeTab === 'ledger' && (
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                                    <CreditCard size={18} className="text-amber-400" /> Wallet Transactions Activity
                                </h3>

                                {data.transactions.length > 0 ? (
                                    data.transactions.map((t, i) => (
                                        <div key={t._id || i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${t.type === 'credit' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                    {t.type === 'credit' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white">{t.title}</p>
                                                    <p className="text-[11px] text-white/40">{formatDate(t.date)}</p>
                                                </div>
                                            </div>
                                            <div className={`text-base font-black ${t.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                                {t.type === 'credit' ? '+' : '-'}₹{t.amount}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-white/40 text-center py-6">No transaction activity recorded yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default TradeHistory;
