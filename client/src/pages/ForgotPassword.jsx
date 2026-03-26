import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Mail, ArrowLeft, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../utils/api';

const bgImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

export const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/users/forgot-password', { email });
            setIsSent(true);
            toast.success("Magic link sent to your email! ✨");
        } catch (error) {
            toast.error(error.response?.data?.message || "Backend API missing! (Hum isko next step me banayenge 🚀)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden">
            <Toaster position="bottom-right" toastOptions={{ style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' } }} />
            <Navbar />

            {/* 🌟 Artistic Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <img src={bgImage} alt="Art background" className="w-full h-full object-cover opacity-30 scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#050505]"></div>
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-amber-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

            <div className="flex-1 flex items-center justify-center px-4 relative z-10 pt-20">
                <div className="w-full max-w-md bg-[#0f0f0f]/80 border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-2xl">

                    {!isSent ? (
                        <>
                            <div className="text-center mb-8">
                                <div className="inline-block p-4 rounded-full bg-amber-500/10 mb-4 border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                                    <KeyRound className="text-amber-500" size={28} />
                                </div>
                                <h2 className="text-3xl font-black text-white font-playfair mb-2">Reset Password</h2>
                                <p className="text-white/40 text-sm">Enter your email and we'll send you a secure magic link to get back into your studio.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-3.5 text-white/30 group-focus-within:text-amber-500 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="artist@studio.com"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-amber-500/50 focus:bg-white/5 transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Magic Link ✨'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                <CheckCircle2 size={40} className="text-green-500" />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-3">Check your Inbox! 📩</h2>
                            <p className="text-white/50 text-sm mb-8 leading-relaxed">
                                We've sent a secure password reset link to <br /> <strong className="text-white bg-white/5 px-2 py-1 rounded-md mt-2 inline-block border border-white/10">{email}</strong>
                            </p>
                            <button
                                onClick={() => setIsSent(false)}
                                className="text-amber-500 text-sm font-bold hover:underline"
                            >
                                Didn't receive it? Try again
                            </button>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <Link to="/login" className="text-white/40 hover:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};