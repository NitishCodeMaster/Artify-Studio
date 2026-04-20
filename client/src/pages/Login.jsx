import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, ArrowRight, Loader2, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const leftSideImage = "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80";
const rightSideImage = "https://images.unsplash.com/photo-1554188248-986adbb73be0?w=600&q=80";

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', formData);
      console.log(res.data);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        const fixedUser = {
          ...res.data.user,
          _id: res.data.user._id || res.data.user.id
        };
        localStorage.setItem("user", JSON.stringify(fixedUser));
        window.dispatchEvent(new Event("userChanged"));
        login(fixedUser);
        toast.success('Welcome back to Artify! 🎨');

        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #333'
          }
        }}
      />

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

      <div className="w-full max-w-md bg-[#0f0f0f]/80 border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-2xl mx-4">

        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-white/5 mb-4">
            <LogIn className="text-pink-400" size={24} />
          </div>
          <h2 className="text-3xl font-black text-white font-playfair mb-2">Welcome Back</h2>
          <p className="text-white/40 text-sm">Log in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

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
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-pink-500/50 focus:bg-white/5 transition-all"
              onChange={handleChange}
            />
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
            {loading ? <Loader2 className="animate-spin" /> : <>Log In <ArrowRight size={20} /></>}
          </button>

        </form>

        <div className="mt-8 text-center text-sm text-white/40">
          Don't have an account? <Link to="/signup" className="text-pink-400 font-bold hover:underline">Sign Up</Link>
        </div>

      </div>
    </section>
  );
}