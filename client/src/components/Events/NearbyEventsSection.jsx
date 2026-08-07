import React, { useState, useEffect, useMemo } from 'react';
import { MapPin, LocateFixed, Navigation, Compass, Calendar, ArrowRight, Music, Radio, Filter, ArrowDown, Sparkles, CheckCircle2, ChevronRight, Volume2 } from 'lucide-react';
import { calculateDistanceKm, getEventCoords, formatDistanceText } from '../../utils/geo';
import { toast } from 'react-hot-toast';

const NearbyEventsSection = ({ events = [], onSelectEvent }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [userCityName, setUserCityName] = useState('Detecting location...');
    const [isLocating, setIsLocating] = useState(false);
    const [radiusFilter, setRadiusFilter] = useState('all'); // 'all', '5', '10', '25', '50'
    const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'Music', 'Dance', 'Art'
    const [sortBy, setSortBy] = useState('distance'); // 'distance', 'date', 'payout'

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                setUserLocation({ lat, lng });
                setIsLocating(false);

                // Reverse geocode to get city name
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`, {
                        headers: { 'Accept-Language': 'en' }
                    });
                    const data = await res.json();
                    if (data && data.address) {
                        const city = data.address.city || data.address.town || data.address.state_district || data.address.state || 'Your City';
                        setUserCityName(city);
                    } else {
                        setUserCityName('Your Current GPS');
                    }
                } catch {
                    setUserCityName('Your GPS Location');
                }
                toast.success("Location updated! Showing nearest events 📍", { duration: 2000 });
            },
            () => {
                setIsLocating(false);
                // Default to Chandigarh coordinates if permission denied
                setUserLocation({ lat: 30.7333, lng: 76.7794 });
                setUserCityName('Chandigarh (Default)');
                toast.error("Could not access GPS. Using default location.");
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    useEffect(() => {
        handleDetectLocation();
    }, []);

    // Process & calculate distance for all events
    const processedEvents = useMemo(() => {
        if (!userLocation) return [];

        return events.map(event => {
            const [eLat, eLng] = getEventCoords(event);
            const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, eLat, eLng);
            return {
                ...event,
                distanceKm: dist,
                eventLat: eLat,
                eventLng: eLng
            };
        });
    }, [events, userLocation]);

    // Filter events by distance radius and category
    const filteredEvents = useMemo(() => {
        return processedEvents.filter(event => {
            // Category filter
            if (selectedCategory !== 'all' && event.category !== selectedCategory) {
                return false;
            }

            // Radius filter
            if (radiusFilter !== 'all' && event.distanceKm !== null) {
                const maxKm = Number(radiusFilter);
                if (event.distanceKm > maxKm) return false;
            }

            return true;
        });
    }, [processedEvents, selectedCategory, radiusFilter]);

    // Sort events
    const sortedEvents = useMemo(() => {
        return [...filteredEvents].sort((a, b) => {
            if (sortBy === 'distance') {
                if (a.distanceKm === null) return 1;
                if (b.distanceKm === null) return -1;
                return a.distanceKm - b.distanceKm;
            } else if (sortBy === 'date') {
                return new Date(a.date) - new Date(b.date);
            } else if (sortBy === 'payout') {
                const payoutA = Number(a.artistPayout || a.price || 0);
                const payoutB = Number(b.artistPayout || b.price || 0);
                return payoutB - payoutA;
            }
            return 0;
        });
    }, [filteredEvents, sortBy]);

    return (
        <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden my-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[120px] pointer-events-none"></div>

            {/* Header: Title & GPS Permission / Status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 relative z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                            <Radio size={20} className="animate-pulse" />
                        </span>
                        <h2 className="text-2xl font-black text-white tracking-tight">
                            Nearby Events & Live Gigs
                        </h2>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                            Live Radar 📍
                        </span>
                    </div>
                    <p className="text-xs text-white/50 pl-11">
                        Find live music, open mics, dance & art performances near your location sorted by distance.
                    </p>
                </div>

                {/* GPS Location Permission & Status */}
                <div className="flex items-center gap-3 shrink-0 bg-white/5 p-2 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 rounded-xl border border-white/10 text-xs font-bold text-white">
                        <MapPin size={15} className="text-indigo-400 shrink-0" />
                        <span className="text-white/60">📍 Location:</span>
                        <span className="text-indigo-300 font-extrabold truncate max-w-[150px]">{userCityName}</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleDetectLocation}
                        disabled={isLocating}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-md shadow-indigo-600/30 disabled:opacity-50"
                    >
                        <LocateFixed size={14} className={isLocating ? 'animate-spin' : ''} />
                        <span>{isLocating ? 'Locating...' : 'Update GPS'}</span>
                    </button>
                </div>
            </div>

            {/* Filter & Sort Bar */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 bg-black/40 p-4 rounded-2xl border border-white/10 relative z-10">
                {/* Distance Radius Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar w-full sm:w-auto">
                    <span className="text-xs font-bold text-white/50 uppercase tracking-wider shrink-0 flex items-center gap-1">
                        <Filter size={13} className="text-indigo-400" /> Radius:
                    </span>
                    {[
                        { id: 'all', label: 'All Distances' },
                        { id: '5', label: 'Within 5 km' },
                        { id: '10', label: 'Within 10 km' },
                        { id: '25', label: 'Within 25 km' },
                        { id: '50', label: 'Within 50 km' },
                    ].map(r => (
                        <button
                            key={r.id}
                            onClick={() => setRadiusFilter(r.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                                radiusFilter === r.id
                                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                                    : 'bg-white/5 text-white/60 border-white/10 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>

                {/* Category & Sort controls */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-indigo-300 focus:outline-none cursor-pointer"
                    >
                        <option value="all" className="bg-black text-white">🎶 All Categories</option>
                        <option value="Music" className="bg-black text-white">🎵 Music Gigs</option>
                        <option value="Dance" className="bg-black text-white">💃 Dance Events</option>
                        <option value="Art" className="bg-black text-white">🎨 Art Exhibits</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-none cursor-pointer"
                    >
                        <option value="distance" className="bg-black text-white">📍 Sort by Distance (Nearest First)</option>
                        <option value="date" className="bg-black text-white">📅 Sort by Date (Earliest First)</option>
                        <option value="payout" className="bg-black text-white">💰 Sort by Payout / Ticket</option>
                    </select>
                </div>
            </div>

            {/* Timeline Distance View (Step-by-Step Distance Feed requested by user) */}
            <div className="relative z-10 space-y-4 pt-2">
                {/* Starting Node: Your Location Pin */}
                <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-black p-4 rounded-2xl border border-indigo-500/40">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/40 shrink-0">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <div className="text-xs font-extrabold text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                            <Sparkles size={12} /> Starting Point
                        </div>
                        <h4 className="text-base font-black text-white">📍 Your Location ({userCityName})</h4>
                    </div>
                </div>

                {/* List of Nearby Events with Distance Arrow Connection */}
                {sortedEvents.length > 0 ? (
                    <div className="space-y-3 relative pl-4 md:pl-6 border-l-2 border-indigo-500/30 ml-5 my-2">
                        {sortedEvents.map((event) => {
                            const distanceLabel = formatDistanceText(event.distanceKm) || 'Nearby';
                            const eventDate = new Date(event.date).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            });

                            return (
                                <div key={event._id} className="relative group">
                                    {/* Distance Connection Arrow & Badge */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs -ml-[25px] border-2 border-[#0a0a0f] shadow-md shrink-0">
                                            <ArrowDown size={13} />
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-xs font-black text-indigo-300 flex items-center gap-1.5 shadow-md">
                                            <Navigation size={12} className="text-indigo-400" />
                                            <span>{distanceLabel} away</span>
                                        </div>
                                    </div>

                                    {/* Event Card Item */}
                                    <div
                                        onClick={() => onSelectEvent && onSelectEvent(event)}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 p-4 md:p-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg group-hover:scale-[1.01]"
                                    >
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                                                <img
                                                    src={event.bannerImage || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300'}
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="space-y-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
                                                        {event.category || 'Music'}
                                                    </span>
                                                    <span className="text-[11px] text-white/50 flex items-center gap-1">
                                                        <Calendar size={11} className="text-indigo-400" /> {eventDate} • {event.time}
                                                    </span>
                                                </div>
                                                <h4 className="text-base font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors truncate">
                                                    {event.title}
                                                </h4>
                                                <p className="text-xs text-white/50 flex items-center gap-1 truncate">
                                                    <MapPin size={12} className="text-indigo-400 shrink-0" />
                                                    <span className="truncate">{event.location}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-white/10 shrink-0">
                                            {event.artistPayout > 0 ? (
                                                <div className="text-left md:text-right">
                                                    <div className="text-[10px] text-emerald-400 font-bold uppercase">Artist Payout</div>
                                                    <div className="text-sm font-black text-emerald-300">₹{event.artistPayout}</div>
                                                </div>
                                            ) : event.price > 0 ? (
                                                <div className="text-left md:text-right">
                                                    <div className="text-[10px] text-indigo-400 font-bold uppercase">Ticket Price</div>
                                                    <div className="text-sm font-black text-indigo-300">₹{event.price}</div>
                                                </div>
                                            ) : (
                                                <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                                                    Free Event
                                                </span>
                                            )}

                                            <button className="px-4 py-2 bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-md shadow-indigo-600/30">
                                                <span>View Gig</span>
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
                        <Volume2 size={32} className="mx-auto text-white/30" />
                        <h4 className="text-lg font-bold text-white">No live events found within this distance radius</h4>
                        <p className="text-xs text-white/50">Try selecting "All Distances" or clicking "Update GPS".</p>
                        <button
                            onClick={() => { setRadiusFilter('all'); setSelectedCategory('all'); }}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NearbyEventsSection;
