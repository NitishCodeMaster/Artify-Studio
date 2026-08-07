import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, LocateFixed, Search, Navigation, Radio, Filter, Sparkles, ExternalLink, Calendar, ChevronRight, Maximize2, Minimize2, Layers, Sliders, Volume2, CheckCircle2, ArrowRight, Compass } from 'lucide-react';
import { calculateDistanceKm, getEventCoords, formatDistanceText } from '../../utils/geo';
import { toast } from 'react-hot-toast';
import api from '../../utils/api';

// Custom Glowing Marker Icon for User GPS Location
const createUserGpsMarkerIcon = () => {
    return L.divIcon({
        className: 'user-gps-pulse-marker',
        html: `
            <div class="relative flex items-center justify-center w-10 h-10 -translate-x-1/2 -translate-y-1/2">
                <div class="absolute w-10 h-10 rounded-full bg-cyan-400/40 animate-ping"></div>
                <div class="relative z-10 w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-lg shadow-cyan-400/60 flex items-center justify-center">
                    <div class="w-2 h-2 rounded-full bg-white"></div>
                </div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });
};

// Custom Venue Marker Icon for Events
const createVenueMarkerIcon = (category = 'General', isSelected = false, payoutOrPrice = '') => {
    const isMusic = category.toLowerCase().includes('music') || category.toLowerCase().includes('open mic') || category.toLowerCase().includes('concert');
    const isDance = category.toLowerCase().includes('dance');
    const isArt = category.toLowerCase().includes('art');

    const badgeGradient = isSelected
        ? 'from-amber-400 to-orange-500 scale-125 border-yellow-300 z-50 shadow-amber-500/80'
        : isMusic
            ? 'from-indigo-500 to-purple-600 border-white shadow-indigo-500/50'
            : isDance
                ? 'from-pink-500 to-rose-600 border-white shadow-pink-500/50'
                : isArt
                    ? 'from-emerald-500 to-teal-600 border-white shadow-emerald-500/50'
                    : 'from-blue-500 to-indigo-600 border-white shadow-blue-500/50';

    const iconSymbol = isMusic ? '🎵' : isDance ? '💃' : isArt ? '🎨' : '📍';

    return L.divIcon({
        className: `venue-marker-${isSelected ? 'selected' : 'normal'}`,
        html: `
            <div class="relative flex flex-col items-center justify-center -translate-x-1/2 -translate-y-full cursor-pointer group">
                ${payoutOrPrice ? `
                    <div class="px-2 py-0.5 mb-1 rounded-full bg-black/90 text-[10px] font-black text-amber-300 border border-amber-500/40 shadow-md whitespace-nowrap">
                        ${payoutOrPrice}
                    </div>
                ` : ''}
                <div class="relative z-10 w-9 h-9 rounded-2xl bg-gradient-to-br ${badgeGradient} flex items-center justify-center shadow-xl border-2 text-white font-bold transition-transform duration-300 group-hover:scale-110">
                    <span class="text-sm">${iconSymbol}</span>
                </div>
                <div class="w-2.5 h-2.5 bg-indigo-600 rotate-45 -mt-1 border-r border-b border-white"></div>
            </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50]
    });
};

// Map controller component for smooth flying to coordinates
const MapFlyToController = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
            map.flyTo(center, zoom || 13, { duration: 1.2 });
        }
    }, [center, zoom, map]);
    return null;
};

const ProductionNearbyMap = ({ events = [], onSelectEvent }) => {
    const [userCoords, setUserCoords] = useState([30.7333, 76.7794]); // Default Chandigarh
    const [userCityName, setUserCityName] = useState('Detecting GPS...');
    const [isLocating, setIsLocating] = useState(false);

    const [mapCenter, setMapCenter] = useState([30.7333, 76.7794]);
    const [mapZoom, setMapZoom] = useState(13);

    const [radiusKm, setRadiusKm] = useState(25); // Default 25km radius
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('distance');

    const [selectedEventId, setSelectedEventId] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const cardRefs = useRef({});

    // Detect user GPS location
    const handleDetectGps = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const coords = [lat, lng];

                setUserCoords(coords);
                setMapCenter(coords);
                setIsLocating(false);

                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=11`, {
                        headers: { 'Accept-Language': 'en' }
                    });
                    const data = await res.json();
                    if (data && data.address) {
                        const city = data.address.city || data.address.town || data.address.state_district || data.address.state || 'Current Location';
                        setUserCityName(city);
                    } else {
                        setUserCityName('Your GPS Pin');
                    }
                } catch {
                    setUserCityName('GPS Coordinates Pin');
                }
                toast.success("GPS Location Pinned! 🎯", { duration: 1800 });
            },
            () => {
                setIsLocating(false);
                setUserCoords([30.7333, 76.7794]);
                setUserCityName('Chandigarh (Default)');
                toast.error("GPS access denied. Showing default region map.");
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    useEffect(() => {
        handleDetectGps();
    }, []);

    // Process & calculate distances
    const processedEvents = useMemo(() => {
        return events.map(ev => {
            const [eLat, eLng] = getEventCoords(ev);
            const dist = calculateDistanceKm(userCoords[0], userCoords[1], eLat, eLng);
            return {
                ...ev,
                eventLat: eLat,
                eventLng: eLng,
                distanceKm: dist
            };
        });
    }, [events, userCoords]);

    // Filter by radius & category
    const filteredEvents = useMemo(() => {
        return processedEvents.filter(ev => {
            if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
                return false;
            }
            if (radiusKm && ev.distanceKm !== null && ev.distanceKm > radiusKm) {
                return false;
            }
            return true;
        });
    }, [processedEvents, selectedCategory, radiusKm]);

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

    // When an event pin or card is selected
    const handleSelectVenue = (event) => {
        setSelectedEventId(event._id);
        const coords = [event.eventLat, event.eventLng];
        setMapCenter(coords);
        setMapZoom(14);

        // Scroll to card in list if visible
        if (cardRefs.current[event._id]) {
            cardRefs.current[event._id].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Search region on map
    const handleSearchMapRegion = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`, {
                headers: { 'Accept-Language': 'en' }
            });
            const data = await res.json();
            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                setMapCenter([lat, lng]);
                setMapZoom(13);
                toast.success(`Map centered on: ${data[0].display_name.split(',')[0]} 📍`);
            } else {
                toast.error("Location not found on map.");
            }
        } catch {
            toast.error("Error searching location.");
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="space-y-6 my-6">
            {/* Top Toolbar: Title, GPS Status, Search & Radius Slider */}
            <div className="bg-[#08080d] border border-white/10 p-5 md:p-6 rounded-3xl space-y-4 shadow-2xl">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                <Radio size={20} className="animate-pulse" />
                            </span>
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                Live Interactive Events Map 📍
                            </h2>
                        </div>
                        <p className="text-xs text-white/50 pl-11 mt-1">
                            Production-grade radar map. Zoom, filter by distance radius, and tap pins to view live gigs.
                        </p>
                    </div>

                    {/* GPS Status & Search */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 bg-black/60 px-3.5 py-2 rounded-xl border border-white/10 text-xs font-bold text-white">
                            <MapPin size={14} className="text-cyan-400 shrink-0" />
                            <span className="text-white/60">Center:</span>
                            <span className="text-cyan-300 font-extrabold truncate max-w-[140px]">{userCityName}</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleDetectGps}
                            disabled={isLocating}
                            className="px-3.5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
                        >
                            <LocateFixed size={14} className={isLocating ? 'animate-spin' : ''} />
                            <span>{isLocating ? 'Locating...' : 'Recenter GPS'}</span>
                        </button>
                    </div>
                </div>

                {/* Controls Bar: Search Map, Radius Slider, Category, View Switcher */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-white/10 items-center">
                    {/* Search Location Input */}
                    <form onSubmit={handleSearchMapRegion} className="md:col-span-4 flex items-center bg-black/50 border border-white/15 rounded-xl p-1 focus-within:border-indigo-500">
                        <Search size={15} className="text-indigo-400 ml-2.5 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search region on map..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent px-2 py-1 text-xs text-white placeholder-white/40 focus:outline-none"
                        />
                        <button type="submit" disabled={isSearching} className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-500 transition-colors">
                            {isSearching ? '...' : 'Go'}
                        </button>
                    </form>

                    {/* Radius Slider */}
                    <div className="md:col-span-4 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2">
                        <div className="text-xs font-bold text-indigo-300 shrink-0 flex items-center gap-1">
                            <Sliders size={14} /> Radius: <span className="text-white font-extrabold">{radiusKm} km</span>
                        </div>
                        <input
                            type="range"
                            min="2"
                            max="100"
                            step="1"
                            value={radiusKm}
                            onChange={(e) => setRadiusKm(Number(e.target.value))}
                            className="w-full accent-indigo-500 cursor-pointer"
                        />
                    </div>

                    {/* Category Select & View Toggle */}
                    <div className="md:col-span-4 flex items-center justify-end gap-2">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold text-indigo-300 focus:outline-none cursor-pointer flex-1 md:flex-none"
                        >
                            <option value="all" className="bg-black text-white">🎶 All Categories ({sortedEvents.length})</option>
                            <option value="Music" className="bg-black text-white">🎵 Live Music</option>
                            <option value="Dance" className="bg-black text-white">💃 Dance</option>
                            <option value="Art" className="bg-black text-white">🎨 Art</option>
                        </select>

                        <button
                            type="button"
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/80 hover:text-white transition-colors"
                            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Map"}
                        >
                            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Split View Container: Map + Event Feed Grid */}
            <div className={`grid grid-cols-1 ${isFullscreen ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-6 items-start`}>

                {/* Left Side: Interactive Leaflet Map Component */}
                <div className={`${isFullscreen ? 'lg:col-span-12 h-[700px]' : 'lg:col-span-7 h-[540px]'} relative rounded-3xl overflow-hidden border border-indigo-500/30 shadow-2xl transition-all duration-300 z-0`}>
                    <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        scrollWheelZoom={true}
                        style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <MapFlyToController center={mapCenter} zoom={mapZoom} />

                        {/* Pulsing User GPS Marker */}
                        {userCoords && (
                            <Marker position={userCoords} icon={createUserGpsMarkerIcon()}>
                                <Popup className="custom-leaflet-popup">
                                    <div className="p-1 text-center font-sans">
                                        <span className="text-xs font-bold text-cyan-600 block">📍 Your GPS Location</span>
                                        <span className="text-[10px] text-zinc-500">{userCityName}</span>
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {/* Interactive Radar Search Circle (radius in meters) */}
                        {userCoords && radiusKm && (
                            <Circle
                                center={userCoords}
                                radius={radiusKm * 1000}
                                pathOptions={{
                                    color: '#6366f1',
                                    fillColor: '#6366f1',
                                    fillOpacity: 0.08,
                                    weight: 1.5,
                                    dashArray: '6, 8'
                                }}
                            />
                        )}

                        {/* Venue Event Pin Markers */}
                        {sortedEvents.map(event => {
                            const isSelected = selectedEventId === event._id;
                            const tagPrice = event.artistPayout ? `₹${event.artistPayout} Payout` : event.price ? `₹${event.price}` : 'Free';

                            return (
                                <Marker
                                    key={event._id}
                                    position={[event.eventLat, event.eventLng]}
                                    icon={createVenueMarkerIcon(event.category, isSelected, tagPrice)}
                                    eventHandlers={{
                                        click: () => handleSelectVenue(event)
                                    }}
                                >
                                    <Popup className="custom-leaflet-popup">
                                        <div className="p-1 max-w-[240px] text-zinc-900 font-sans space-y-2">
                                            <div className="relative h-28 w-full rounded-lg overflow-hidden bg-black">
                                                <img src={event.bannerImage || 'https://via.placeholder.com/300'} alt={event.title} className="w-full h-full object-cover" />
                                                <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">
                                                    {event.category}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-bold text-sm leading-tight text-zinc-900 line-clamp-1">{event.title}</h4>
                                                <p className="text-[11px] text-zinc-600 flex items-center gap-1 font-medium mt-1">
                                                    <MapPin size={12} className="text-indigo-600 shrink-0" />
                                                    <span>📍 {event.location}</span>
                                                </p>
                                                {event.distanceKm !== null && (
                                                    <p className="text-[10px] font-bold text-emerald-700 mt-0.5">
                                                        📍 {formatDistanceText(event.distanceKm)} from you
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 pt-1 border-t border-zinc-200">
                                                <a
                                                    href={`https://www.google.com/maps/search/?api=1&query=${event.eventLat},${event.eventLng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1 py-1 px-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-[11px] font-bold rounded text-center flex items-center justify-center gap-1"
                                                >
                                                    <ExternalLink size={12} /> Directions
                                                </a>
                                                <button
                                                    onClick={() => onSelectEvent && onSelectEvent(event)}
                                                    className="flex-1 py-1 px-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded text-center flex items-center justify-center gap-1"
                                                >
                                                    View Gig
                                                </button>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>

                    {/* Top Overlay Badge */}
                    <div className="absolute top-3 left-3 z-[400] pointer-events-none">
                        <div className="bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-indigo-500/40 text-xs font-bold text-indigo-300 shadow-xl flex items-center gap-2">
                            <Radio size={14} className="animate-pulse text-indigo-400" />
                            <span>Showing {sortedEvents.length} live venues inside {radiusKm}km radar</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Interactive Event Cards Feed (Sync with Map) */}
                {!isFullscreen && (
                    <div className="lg:col-span-5 space-y-3 h-[540px] overflow-y-auto pr-1 custom-scrollbar">
                        <div className="flex items-center justify-between px-1 mb-2">
                            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wider">
                                <Compass size={16} className="text-indigo-400" /> Nearest Venues List ({sortedEvents.length})
                            </h3>
                            <span className="text-[11px] text-white/40">Tap card to focus map</span>
                        </div>

                        {sortedEvents.length > 0 ? (
                            sortedEvents.map((ev, index) => {
                                const isSelected = selectedEventId === ev._id;
                                const formattedDate = new Date(ev.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short'
                                });

                                return (
                                    <div
                                        key={ev._id}
                                        ref={el => cardRefs.current[ev._id] = el}
                                        onClick={() => handleSelectVenue(ev)}
                                        className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer space-y-3 relative ${
                                            isSelected
                                                ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.01]'
                                                : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-indigo-500/30'
                                        }`}
                                    >
                                        {/* Step number badge */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                                                    #{index + 1}
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase border border-indigo-500/30">
                                                    {ev.category}
                                                </span>
                                            </div>

                                            {ev.distanceKm !== null && (
                                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                                                    <Navigation size={11} /> {formatDistanceText(ev.distanceKm)} away
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-3">
                                            <img
                                                src={ev.bannerImage || 'https://via.placeholder.com/150'}
                                                alt={ev.title}
                                                className="w-16 h-16 rounded-xl object-cover bg-black shrink-0 border border-white/10"
                                            />
                                            <div className="space-y-1 min-w-0 flex-1">
                                                <h4 className="text-sm font-bold text-white leading-snug line-clamp-1 hover:text-indigo-400 transition-colors">
                                                    {ev.title}
                                                </h4>
                                                <p className="text-xs text-white/50 truncate flex items-center gap-1">
                                                    <MapPin size={12} className="text-indigo-400 shrink-0" />
                                                    <span className="truncate">{ev.location}</span>
                                                </p>
                                                <div className="text-[11px] text-white/40 flex items-center gap-1">
                                                    <Calendar size={11} className="text-indigo-400" /> {formattedDate} • {ev.time}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                            {ev.artistPayout > 0 ? (
                                                <span className="text-xs font-black text-emerald-400">⭐ ₹{ev.artistPayout} Payout</span>
                                            ) : ev.price > 0 ? (
                                                <span className="text-xs font-black text-indigo-300">🎟️ ₹{ev.price} Ticket</span>
                                            ) : (
                                                <span className="text-xs font-bold text-purple-300">🎁 Free Entry</span>
                                            )}

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onSelectEvent && onSelectEvent(ev);
                                                }}
                                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                            >
                                                <span>Details</span>
                                                <ChevronRight size={13} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
                                <Volume2 size={28} className="mx-auto text-white/30" />
                                <p className="text-xs text-white/40">No venues found within {radiusKm} km radius.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductionNearbyMap;
