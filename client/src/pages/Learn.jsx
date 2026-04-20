import React from 'react';
import { LearnHero } from '../components/Learn/LearnHero';
import { MentorGrid } from '../components/Learn/MentorGrid';
import { LiveWorkshops } from '../components/Learn/LiveWorkShops';
import { Footer } from '../components/Footer';

export default function Learn() {
  return (
    <>
      <section className="relative py-24 bg-[#050505] min-h-screen overflow-hidden">

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

          <LearnHero />

          <MentorGrid />

          <LiveWorkshops />

          <div className="mt-24 p-8 rounded-3xl bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/10 text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Are you an expert?</h3>
            <p className="text-white/50 mb-6">Share your knowledge and earn money by becoming a mentor.</p>
            <button className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition-all">
              Apply as Mentor
            </button>
          </div>

        </div>
      </section>
      <Footer />
    </>
  );
}