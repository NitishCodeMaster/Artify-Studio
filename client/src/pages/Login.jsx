import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, LogIn, UserRound, GraduationCap, Sparkles, BadgeCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const leftSideImage = "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80";
const rightSideImage = "https://images.unsplash.com/photo-1554188248-986adbb73be0?w=600&q=80";

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState('artist');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/users/login', { ...formData, loginAs: loginMode });
      console.log(res.data);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        const fixedUser = {
          ...res.data.user,
          _id: res.data.user._id || res.data.user.id
        };
        login(fixedUser);
        toast.dismiss();
        navigate(loginMode === 'mentor' ? '/learn' : '/', { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-[#050505] flex items-start justify-center relative overflow-hidden px-6 pt-10 pb-12">
      <div className="hidden lg:block absolute top-0 left-0 w-1/3 h-full overflow-hidden opacity-40">
        <img src={leftSideImage} alt="Art background left" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-[#050505]/90 to-[#050505]"></div>
      </div>

      <div className="hidden lg:block absolute top-0 right-0 w-1/3 h-full overflow-hidden opacity-40">
        <img src={rightSideImage} alt="Art background right" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-[#050505]/90 to-[#050505]"></div>
      </div>

      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d10]/85 shadow-2xl backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden min-h-[590px] border-r border-white/10 bg-white/[0.025] p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-indigo-200">
              <Sparkles size={14} />
              Studio Access
            </div>
            <h1 className="mt-8 max-w-sm font-playfair text-5xl font-black leading-tight text-white">
              Enter your creative control room.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">
              Switch between your artist identity and mentor workspace from the first step. Artify adapts the experience after login.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              ['Artist Mode', 'Explore gigs, marketplace, community, and profile tools.'],
              ['Mentor Mode', 'Open Learn tools and publish workshops after login.'],
              ['Live Studio', 'Realtime chat, saved items, wallet, and creator actions stay synced.'],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="mb-1 flex items-center gap-2 text-sm font-bold text-white">
                  <BadgeCheck size={16} className="text-indigo-300" />
                  {title}
                </div>
                <p className="text-xs leading-relaxed text-white/45">{text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-7 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <LogIn className="text-pink-400" size={24} />
            </div>
            <h2 className="mb-2 font-playfair text-3xl font-black text-white">Welcome Back</h2>
            <p className="text-sm text-white/40">Choose how you want to enter Artify today.</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            {[
              { id: 'artist', title: 'Artist', icon: UserRound, text: 'Create, buy, chat' },
              { id: 'mentor', title: 'Mentor', icon: GraduationCap, text: 'Teach, host, guide' },
            ].map((mode) => {
              const Icon = mode.icon;
              const active = loginMode === mode.id;
              return (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => setLoginMode(mode.id)}
                  className={`rounded-2xl border p-4 text-left transition-all ${active
                    ? 'border-pink-400/50 bg-pink-500/10 shadow-[0_0_24px_rgba(236,72,153,0.16)]'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                    }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? 'bg-pink-500 text-white' : 'bg-white/5 text-white/50'}`}>
                      <Icon size={18} />
                    </div>
                    <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-pink-400' : 'bg-white/20'}`} />
                  </div>
                  <div className="font-bold text-white">{mode.title}</div>
                  <div className="mt-1 text-xs text-white/45">{mode.text}</div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-white/30 group-focus-within:text-pink-400 transition-colors" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/5 transition-all"
                onChange={handleChange}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-white/30 group-focus-within:text-pink-400 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/5 transition-all"
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-white/30 hover:text-white transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-white/40 hover:text-white transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Enter as {loginMode === 'mentor' ? 'Mentor' : 'Artist'} <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-7 text-center text-sm text-white/40">
            Don't have an account? <Link to="/signup" className="text-pink-400 font-bold hover:underline">Sign Up</Link>
          </div>

        </div>
      </div>
    </section>
  );
}
