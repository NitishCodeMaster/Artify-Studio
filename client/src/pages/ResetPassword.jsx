import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../utils/api';

const bgImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

export const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post(`/users/reset-password/${token}`, { password });
            setIsSuccess(true);
            toast.success(res.data.message);

            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to reset password. Link might be expired.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden">
            <Toaster position="bottom-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' } }} />
            <Navbar />

            <div className="absolute inset-0 z-0">
                <img src={bgImage} alt="Art background" className="w-full h-full object-cover opacity-30 scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#050505]"></div>
            </div>

            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-green-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

            <div className="flex-1 flex items-center justify-center px-4 relative z-10 pt-20">
                <div className="w-full max-w-md bg-[#0f0f0f]/80 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-2xl">

                    {!isSuccess ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-block p-4 rounded-full bg-green-500/10 mb-4 border border-green-500/20">
                                    <Lock className="text-green-500" size={28} />
                                </div>
                                <h2 className="text-3xl font-black text-white font-playfair mb-2">New Password</h2>
                                <p className="text-white/40 text-sm">Create a strong new password for your Artify Studio account.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 text-white/30 group-focus-within:text-green-500 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="New Password"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-green-500/50 focus:bg-white/5 transition-all"
                                    />
                                </div>

                                <div className="relative group">
                                    <Lock className="absolute left-4 top-3.5 text-white/30 group-focus-within:text-green-500 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm New Password"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-green-500/50 focus:bg-white/5 transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-black font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] disabled:opacity-70 mt-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Password'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 size={40} className="text-green-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-3">All Set! 🎉</h2>
                            <p className="text-white/50 text-sm mb-8">Your password has been successfully updated. Redirecting to login...</p>

                            <Link to="/login" className="text-green-500 text-sm font-bold hover:underline flex items-center justify-center gap-2">
                                Go to Login <ArrowRight size={16} />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};