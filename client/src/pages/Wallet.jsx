import React, { useState, useEffect } from 'react';
import { Footer } from '../components/Footer';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, History, Plus, Loader2, ShoppingBag } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Wallet = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const res = await api.get('/users/wallet');
                setBalance(res.data.balance || 0);
                setTransactions(res.data.transactions || []);
            } catch (error) {
                console.error("Wallet data fetch failed:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWallet();
    }, []);

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-amber-500/30">
            <div className="max-w-[800px] mx-auto px-6 pt-20 pb-14">
                <button onClick={() => navigate(-1)} className="text-white/50 hover:text-amber-500 mb-8 font-medium transition-colors text-sm">
                    ← Back
                </button>

                <div className="flex items-center justify-between gap-3 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500"><WalletIcon size={24} /></div>
                        <h1 className="text-3xl font-black tracking-tight">Your Wallet</h1>
                    </div>

                    <Link
                        to="/trade-history"
                        className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                    >
                        <ShoppingBag size={14} /> Full Trade History
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-amber-500" size={40} /></div>
                ) : (
                    <>
                        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 mb-10 shadow-[0_0_30px_rgba(245,158,11,0.2)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[50px]"></div>
                            <p className="text-black/70 font-bold uppercase tracking-widest text-sm mb-2 relative z-10">Available Balance</p>
                            <h2 className="text-5xl font-black text-black tracking-tight mb-8 relative z-10">₹{balance.toLocaleString()}</h2>

                            <div className="flex flex-wrap gap-4 relative z-10">
                                <button className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-black/80 transition-all"><Plus size={16} /> Top Up</button>
                                <button className="bg-white/20 text-black border border-black/10 px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/30 transition-all">Withdraw</button>
                                <button onClick={() => navigate('/trade-history')} className="bg-black/90 text-amber-300 border border-amber-500/40 px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all flex items-center gap-2">
                                    <History size={16} /> Purchases & Sales History
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 p-6 md:p-8 shadow-xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><History size={20} className="text-amber-500" /> Recent Transactions</h3>
                            <div className="space-y-4">
                                {transactions.length > 0 ? transactions.map(t => (
                                    <div key={t._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'credit' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                {t.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm">{t.title}</p>
                                                <p className="text-xs text-white/40">{new Date(t.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <p className={`font-black tracking-wide ${t.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                                            {t.type === 'credit' ? '+' : '-'}₹{t.amount}
                                        </p>
                                    </div>
                                )) : (
                                    <p className="text-white/40 text-center py-6">No transactions found.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};
export default Wallet;
