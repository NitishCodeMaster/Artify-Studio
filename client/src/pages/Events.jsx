import React, { useState, useEffect } from 'react';
import { socket } from "../socket";
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, SlidersHorizontal } from 'lucide-react';

import EventHero from '../components/Events/EventHero';
import ArtistView from '../components/Events/ArtistView';
import AudienceView from '../components/Events/AudienceView';
import EventDetails from '../components/Events/EventDetails';
import { Footer } from '../components/Footer';

import LiveRadar from '../components/Events/LiveRadar';
import VibeFilter from '../components/Events/VibeFilter';
import CreateEventModal from '../components/Events/CreateEventModal';
import ProductionNearbyMap from '../components/Events/ProductionNearbyMap';
import api from "../utils/api";

const Events = () => {
    const [viewMode, setViewMode] = useState('artist');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeVibe, setActiveVibe] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = new Date().toDateString();
    const liveTodayCount = events.filter(event => new Date(event.date).toDateString() === today).length;

    const fetchEvents = async (showLoading = false) => {
        try {
            if (showLoading || events.length === 0) {
                setLoading(true);
            }
            const res = await api.get('/events/get-all');
            if (res.data.success) {
                setEvents(res.data.events);
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        socket.on("new_event", (event) => {
            console.log(" New Event:", event);
            setEvents(prev => [event, ...prev]);
        });

        socket.on("event_updated", (updatedEvent) => {
            console.log(" Event Updated:", updatedEvent);
            setEvents(prev => prev.map(e => e._id === updatedEvent._id ? updatedEvent : e));
            setSelectedEvent(prev => (prev && prev._id === updatedEvent._id ? updatedEvent : prev));
        });

        socket.on("event_deleted", ({ eventId }) => {
            setEvents(prev => prev.filter(e => e._id !== eventId));
        });

        return () => {
            socket.off("new_event");
            socket.off("event_updated");
            socket.off("event_deleted");
        };
    }, []);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const activeEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= startOfToday && event.status !== 'completed' && event.status !== 'cancelled';
    });

    const filteredEvents = activeEvents.filter(event => {
        const matchesVibe = activeVibe === 'all' || event.category === activeVibe;
        const matchesSearch = !searchQuery.trim() ||
            event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.category?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesVibe && matchesSearch;
    });

    return (
        <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-indigo-500/30">
            <AnimatePresence mode="wait">
                {selectedEvent ? (
                    <EventDetails
                        event={selectedEvent}
                        viewMode={viewMode}
                        onBack={() => setSelectedEvent(null)}
                        refresh={() => {
                            fetchEvents();
                            setSelectedEvent(null);
                        }}
                    />
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <EventHero
                            events={events}
                            onOpenModal={() => setIsModalOpen(true)}
                            onSelectEvent={(ev) => setSelectedEvent(ev)}
                        />

                        <AnimatePresence>
                            {isModalOpen && (
                                <CreateEventModal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    refresh={fetchEvents}
                                />
                            )}
                            {editingEvent && (
                                <CreateEventModal
                                    isOpen={Boolean(editingEvent)}
                                    onClose={() => setEditingEvent(null)}
                                    eventToEdit={editingEvent}
                                    refresh={fetchEvents}
                                />
                            )}
                        </AnimatePresence>

                        {/* Sticky Control & Search Bar */}
                        <div className="sticky top-16 z-40 bg-[#08080c]/95 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl">
                            <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xl font-extrabold text-white tracking-tight">
                                        {viewMode === 'artist' ? 'Artist Gig Opportunities' : 'Live Event Feed'}
                                    </h2>
                                    <LiveRadar count={liveTodayCount} />
                                </div>

                                {/* Instant Live Search Bar */}
                                <div className="flex-1 max-w-md relative">
                                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="Search cafes, gigs, cities, artists..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-white/40 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>

                                {/* Mode Switcher */}
                                <div className="relative flex bg-[#111] p-1 rounded-xl border border-white/10 shrink-0">
                                    <button
                                        onClick={() => setViewMode('artist')}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                            viewMode === 'artist'
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'text-white/60 hover:text-white'
                                        }`}
                                    >
                                        🎤 Perform (Artist)
                                    </button>
                                    <button
                                        onClick={() => setViewMode('audience')}
                                        className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                            viewMode === 'audience'
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'text-white/60 hover:text-white'
                                        }`}
                                    >
                                        🎟️ Attend (Audience)
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div id="event-list" className="scroll-mt-40">
                            <div className="max-w-[1400px] mx-auto px-4 md:px-6 mt-4">
                                <ProductionNearbyMap
                                    events={activeEvents}
                                    onSelectEvent={(ev) => setSelectedEvent(ev)}
                                />
                                <VibeFilter activeVibe={activeVibe} setActiveVibe={setActiveVibe} />
                            </div>

                            <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 min-h-[500px]">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                                        <Loader2 className="animate-spin text-indigo-500" size={40} />
                                        <p className="text-white/40 text-xs">Loading Gigs & Events...</p>
                                    </div>
                                ) : (
                                    <div key={viewMode + activeVibe + searchQuery}>
                                        {viewMode === 'artist' ? (
                                            <ArtistView
                                                events={filteredEvents}
                                                refresh={fetchEvents}
                                                onOpenModal={() => setIsModalOpen(true)}
                                                onOpenDetails={(ev) => setSelectedEvent(ev)}
                                                onEditEvent={(ev) => setEditingEvent(ev)}
                                            />
                                        ) : (
                                            <AudienceView
                                                events={filteredEvents}
                                                onOpenDetails={(ev) => setSelectedEvent(ev)}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default Events;
