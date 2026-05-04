import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, CheckCircle, GraduationCap, Sparkles, BadgeCheck, UserRound } from 'lucide-react';
import api from '../utils/api';
import { getIndianPhone10 } from '../utils/razorpay';

const leftSideImage = "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80";
const rightSideImage = "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [signupMode, setSignupMode] = useState('artist');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.name === 'phone'
      ? getIndianPhone10(e.target.value)
      : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match! Please check again.");
      return;
    }
    setLoading(true);

    try {
      const dataToSend = { ...formData, signupAs: signupMode };
      delete dataToSend.confirmPassword;

      await api.post('/users/register', dataToSend);

      alert(signupMode === 'mentor' ? 'Mentor account created! Login as Mentor to start.' : 'Account created successfully! Please Login.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Signup Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-72px)] bg-[#050505] flex items-start justify-center relative overflow-hidden px-6 pt-10 pb-12">
      <div className="hidden lg:block absolute top-0 left-0 w-1/3 h-full overflow-hidden opacity-50">
        <img src={leftSideImage} alt="Art background left" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-[#050505]/80 to-[#050505]"></div>
      </div>
      <div className="hidden lg:block absolute top-0 right-0 w-1/3 h-full overflow-hidden opacity-50">
        <img src={rightSideImage} alt="Art background right" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-[#050505]/80 to-[#050505]"></div>
      </div>

      <div className="relative z-10 grid w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d10]/85 shadow-2xl backdrop-blur-2xl lg:grid-cols-[0.95fr_1.05fr]">
        <div className="hidden min-h-[640px] border-r border-white/10 bg-white/[0.025] p-8 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-indigo-200">
              <Sparkles size={14} />
              New Studio Pass
            </div>
            <h1 className="mt-8 max-w-sm font-playfair text-5xl font-black leading-tight text-white">
              Build your Artify identity from day one.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/50">
              Join as an artist for community, marketplace and gigs, or start as a mentor with Learn tools ready after login.
            </p>
          </div>

          <div className="grid gap-3">
            {[
              ['Artist Account', 'Perfect for showcasing work, buying gear, joining events, and chatting.'],
              ['Mentor Account', 'Creates a mentor identity so you can publish learning sessions faster.'],
              ['Same Artify Profile', 'You can still edit everything later from settings.'],
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
          <div className="text-center mb-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 mb-4">
              <User className="text-indigo-400" size={24} />
            </div>
            <h2 className="text-3xl font-black text-white font-playfair mb-2">Create Account</h2>
            <p className="text-white/40 text-sm">Choose the workspace you want first.</p>
          </div>

          <div className="mb-6 grid grid-cols-2 gap-3">
            {[
              { id: 'artist', title: 'Artist', icon: UserRound, text: 'Create, sell, connect' },
              { id: 'mentor', title: 'Mentor', icon: GraduationCap, text: 'Teach, host, guide' },
            ].map((mode) => {
              const Icon = mode.icon;
              const active = signupMode === mode.id;
              return (
                <button
                  type="button"
                  key={mode.id}
                  onClick={() => setSignupMode(mode.id)}
                  className={`rounded-2xl border p-4 text-left transition-all ${active
                    ? 'border-indigo-400/50 bg-indigo-500/10 shadow-[0_0_24px_rgba(99,102,241,0.16)]'
                    : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                    }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/50'}`}>
                      <Icon size={18} />
                    </div>
                    <span className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-indigo-400' : 'bg-white/20'}`} />
                  </div>
                  <div className="font-bold text-white">{mode.title}</div>
                  <div className="mt-1 text-xs text-white/45">{mode.text}</div>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

          <div className="relative group">
            <User className="absolute left-4 top-3.5 text-white/30 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input type="text" name="name" placeholder="Full Name" required
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all"
              onChange={handleChange} />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 text-white/30 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input type="email" name="email" placeholder="Email Address" required
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all"
              onChange={handleChange} />
          </div>

          <div className="relative group">
            <Phone className="absolute left-4 top-3.5 text-white/30 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input type="tel" name="phone" placeholder="10-digit phone number" required value={formData.phone} maxLength={10} pattern="[0-9]{10}"
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all"
              onChange={handleChange} />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 text-white/30 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input type="password" name="password" placeholder="Password (Min 6 chars)" required minLength={6}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all"
              onChange={handleChange} />
          </div>

          <div className="relative group">
            <CheckCircle className="absolute left-4 top-3.5 text-white/30 group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" required
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500/50 focus:bg-white/5 transition-all"
              onChange={handleChange} />
          </div>

          <button disabled={loading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-indigo-500/20">
            {loading ? <Loader2 className="animate-spin" /> : <>Create {signupMode === 'mentor' ? 'Mentor' : 'Artist'} Account <ArrowRight size={20} /></>}
          </button>

          </form>

          <div className="mt-6 text-center text-sm text-white/40">
            Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Log In</Link>
          </div>

        </div>
      </div>
    </section>
  );
}
