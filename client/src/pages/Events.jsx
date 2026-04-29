import React, { useState, useEffect } from 'react';
import { socket } from "../socket";
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

import EventHero from '../components/Events/EventHero';
import ArtistView from '../components/Events/ArtistView';
import AudienceView from '../components/Events/AudienceView';
import EventDetails from '../components/Events/EventDetails';
import { Footer } from '../components/Footer';

import LiveRadar from '../components/Events/LiveRadar';
import VibeFilter from '../components/Events/VibeFilter';
import CreateEventModal from '../components/Events/CreateEventModal';
import api from "../utils/api";

const Events = () => {
    const [viewMode, setViewMode] = useState('audience');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeVibe, setActiveVibe] = useState('all');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const today = new Date().toDateString();
    const liveTodayCount = events.filter(event => new Date(event.date).toDateString() === today).length;

    const fetchEvents = async () => {
        try {
            setLoading(true);
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

        socket.on("event_deleted", ({ eventId }) => {
            setEvents(prev => prev.filter(e => e._id !== eventId));
        });

        return () => {
            socket.off("new_event");
            socket.off("event_deleted");
        };
    }, []);

    const filteredEvents = activeVibe === 'all'
        ? events
        : events.filter(event => event.category === activeVibe);

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
                        <EventHero events={events} />

                        <AnimatePresence>
                            {isModalOpen && (
                                <CreateEventModal
                                    isOpen={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                    refresh={fetchEvents}
                                />
                            )}
                        </AnimatePresence>

                        <div className="sticky top-20 z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl">
                            <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <h2 className="text-2xl font-bold text-white">
                                        {viewMode === 'artist' ? 'Artist Workspace' : 'Box Office'}
                                    </h2>
                                    <LiveRadar count={liveTodayCount} />
                                </div>

                                <div className="relative flex bg-[#111] p-1 rounded-lg border border-white/10">
                                    <motion.div
                                        className="absolute top-1 bottom-1 w-[100px] bg-indigo-600 rounded-md"
                                        animate={{ x: viewMode === 'artist' ? 0 : 100 }}
                                    />
                                    <button onClick={() => setViewMode('artist')} className="relative z-10 w-[100px] py-2 text-xs font-bold">Perform</button>
                                    <button onClick={() => setViewMode('audience')} className="relative z-10 w-[100px] py-2 text-xs font-bold">Attend</button>
                                </div>
                            </div>
                        </div>
                        <div id="event-list" className="scroll-mt-48">
                            <div className="max-w-[1400px] mx-auto px-6 mt-8">
                                <VibeFilter activeVibe={activeVibe} setActiveVibe={setActiveVibe} />
                            </div>

                            <div className="max-w-[1400px] mx-auto px-6 py-8 min-h-[600px]">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                                        <Loader2 className="animate-spin text-indigo-500" size={40} />
                                        <p className="text-white/40">Loading Gigs...</p>
                                    </div>
                                ) : (
                                    <div key={viewMode + activeVibe}>
                                        {viewMode === 'artist' ? (
                                            <ArtistView
                                                events={filteredEvents}
                                                refresh={fetchEvents}
                                                onOpenModal={() => setIsModalOpen(true)}
                                                onOpenDetails={(ev) => setSelectedEvent(ev)} // Detail handler
                                            />
                                        ) : (
                                            <AudienceView
                                                events={filteredEvents}
                                                onOpenDetails={(ev) => setSelectedEvent(ev)} // Detail handler
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
