import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
      const { confirmPassword, ...dataToSend } = formData;

      const res = await axios.post('http://localhost:5000/users/register', dataToSend);

      alert('Account created successfully! Please Login.');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Signup Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      <div className="hidden lg:block absolute top-0 left-0 w-1/3 h-full overflow-hidden opacity-50">
        <img src={leftSideImage} alt="Art background left" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-[#050505]/80 to-[#050505]"></div>
      </div>
      <div className="hidden lg:block absolute top-0 right-0 w-1/3 h-full overflow-hidden opacity-50">
        <img src={rightSideImage} alt="Art background right" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-110" />
        <div className="absolute inset-0 bg-gradient-to-l from-black/20 via-[#050505]/80 to-[#050505]"></div>
      </div>

      <div className="w-full max-w-md bg-[#0f0f0f]/80 border border-white/10 p-8 rounded-3xl shadow-2xl relative z-10 backdrop-blur-2xl mx-4 my-10">

        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-full bg-white/5 mb-4">
            <User className="text-indigo-400" size={24} />
          </div>
          <h2 className="text-3xl font-black text-white font-playfair mb-2">Create Account</h2>
          <p className="text-white/40 text-sm">Join the Artify community today</p>
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
            <input type="tel" name="phone" placeholder="Phone Number" required
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

          <button disabled={loading} className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 mt-6 shadow-lg shadow-indigo-500/20">
            {loading ? <Loader2 className="animate-spin" /> : <>Sign Up <ArrowRight size={20} /></>}
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-white/40">
          Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Log In</Link>
        </div>

      </div>
    </section>
  );
}