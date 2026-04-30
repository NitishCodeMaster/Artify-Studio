import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LearnHero } from '../components/Learn/LearnHero';
import { MentorGrid } from '../components/Learn/MentorGrid';
import { LiveWorkshops } from '../components/Learn/LiveWorkshops';
import CreateWorkshopModal from '../components/Learn/CreateWorkshopModal';
import { Footer } from '../components/Footer';
import api from '../utils/api';

export default function Learn() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mentors, setMentors] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [stats, setStats] = useState({ mentors: 0, workshops: 0 });
  const [loading, setLoading] = useState(true);
  const [isWorkshopModalOpen, setIsWorkshopModalOpen] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user')) || {};
  const canCreateWorkshop = Boolean(currentUser?.mentorProfile?.isMentor);

  const filters = useMemo(() => ({
    mentor: searchQuery,
    workshop: searchQuery,
  }), [searchQuery]);

  useEffect(() => {
    const fetchLearnContent = async () => {
      setLoading(true);
      try {
        const [mentorRes, workshopRes, overviewRes] = await Promise.all([
          api.get('/learn/mentors', { params: { q: searchQuery || undefined, limit: 9 } }),
          api.get('/learn/workshops', { params: { q: searchQuery || undefined, limit: 6 } }),
          api.get('/learn/overview'),
        ]);

        setMentors(mentorRes.data.mentors || []);
        setWorkshops(workshopRes.data.workshops || []);
        setStats(overviewRes.data.stats || { mentors: 0, workshops: 0 });
      } catch (error) {
        console.error('Failed to load learn content:', error);
        setMentors([]);
        setWorkshops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLearnContent();
  }, [searchQuery]);

  return (
    <>
      <section className="relative py-16 bg-[#050505] min-h-screen overflow-hidden">

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-[1680px] mx-auto px-6 lg:px-8">

          <LearnHero
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stats={stats}
            onFindMentor={() => {
              document.getElementById('mentor-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          />

          <MentorGrid mentors={mentors} filter={filters.mentor} loading={loading} />

          <LiveWorkshops
            workshops={workshops}
            filter={filters.workshop}
            loading={loading}
            canCreateWorkshop={canCreateWorkshop}
            onCreateWorkshop={() => setIsWorkshopModalOpen(true)}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.5 }}
            className="mt-16 p-8 rounded-[2rem] bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-white/10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.1),transparent_45%)] pointer-events-none"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Are you an expert?</h3>
            <p className="text-white/50 mb-6">Create your mentor identity, get a unique mentor slug, and start listing sessions for the community.</p>
            <button
              onClick={() => navigate('/settings')}
              className="px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 hover:scale-[1.02] transition-all"
            >
              Apply as Mentor
            </button>
          </motion.div>

        </div>
      </section>
      <CreateWorkshopModal
        isOpen={isWorkshopModalOpen}
        onClose={() => setIsWorkshopModalOpen(false)}
        onCreated={(createdWorkshop) => {
          setWorkshops((prev) => [createdWorkshop, ...prev]);
          setStats((prev) => ({ ...prev, workshops: prev.workshops + 1 }));
        }}
      />
      <Footer />
    </>
  );
}
