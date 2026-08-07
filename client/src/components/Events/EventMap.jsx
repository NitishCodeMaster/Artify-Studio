import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ExternalLink, AlertCircle, LocateFixed } from 'lucide-react';
import { toast } from 'react-hot-toast';

const KNOWN_LOCATION_COORDINATES = [
    { keywords: ['delhi haat', 'dilli haat'], coordinates: [28.5733, 77.2090] },
    { keywords: ['lodhi gardens', 'lodhi garden'], coordinates: [28.5916, 77.2209] },
    { keywords: ['bkc', 'bandra kurla', 'mumbai arena'], coordinates: [19.0650, 72.8676] },
    { keywords: ['ub city', 'bangalore', 'bengaluru'], coordinates: [12.9719, 77.5961] },
    { keywords: ['hard rock cafe', 'pune', 'kp', 'koregaon park'], coordinates: [18.5362, 73.8937] },
    { keywords: ['piano man'], coordinates: [28.5494, 77.2038] },
    { keywords: ['chandigarh'], coordinates: [30.7333, 76.7794] },
    { keywords: ['jaipur'], coordinates: [26.9124, 75.7873] },
    { keywords: ['haridwar'], coordinates: [29.9457, 78.1642] },
    { keywords: ['mumbai'], coordinates: [19.0760, 72.8777] },
    { keywords: ['delhi', 'new delhi'], coordinates: [28.6139, 77.2090] }
];

const getCoordinatesFromVenue = (venue = '') => {
    const normalizedVenue = venue.toLowerCase();
    const match = KNOWN_LOCATION_COORDINATES.find(({ keywords }) =>
        keywords.some((keyword) => normalizedVenue.includes(keyword))
    );

    return match?.coordinates || null;
};

// Custom Leaflet DivIcon for Event Marker (Indigo Glowing Pin)
const createEventMarkerIcon = () => {
    return L.divIcon({
        className: 'custom-event-marker',
        html: `
            <div class="relative flex items-center justify-center w-10 h-10 -translate-x-1/2 -translate-y-full cursor-pointer group">
                <div class="absolute inset-0 rounded-full bg-indigo-500/40 animate-ping"></div>
                <div class="relative z-10 w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50 border-2 border-white text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                </div>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-600 rotate-45"></div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

// Custom Leaflet DivIcon for User Location Marker (Cyan Pulsing Dot)
const createUserMarkerIcon = () => {
    return L.divIcon({
        className: 'custom-user-marker',
        html: `
            <div class="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-1/2">
                <div class="absolute w-8 h-8 rounded-full bg-cyan-400/40 animate-ping"></div>
                <div class="relative z-10 w-4 h-4 rounded-full bg-cyan-400 border-2 border-white shadow-md shadow-cyan-400/60"></div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    });
};

// Helper component to control map position dynamically
const RecenterMap = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, zoom || 15, { duration: 1.5 });
        }
    }, [center, zoom, map]);
    return null;
};

const EventMap = ({ latitude, longitude, title, venue, date }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    const lat = Number(latitude);
    const lng = Number(longitude);
    const hasCoordinateLocation =
        latitude !== null &&
        latitude !== undefined &&
        longitude !== null &&
        longitude !== undefined &&
        !isNaN(lat) &&
        !isNaN(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180 &&
        !(lat === 0 && lng === 0);
    const inferredCoordinates = hasCoordinateLocation ? null : getCoordinatesFromVenue(venue);
    const eventCoordinates = hasCoordinateLocation ? [lat, lng] : inferredCoordinates;
    const isValidLocation = Boolean(eventCoordinates);
    const [eventLat, eventLng] = eventCoordinates || [];

    // Handle "Locate Me" button click
    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const userCoords = [userLat, userLng];
                setUserLocation(userCoords);
                setMapCenter(userCoords);
                setIsLocating(false);
                toast.success("Current location detected!");
            },
            (error) => {
                setIsLocating(false);
                console.error("Geolocation error:", error);
                toast.error("Unable to retrieve your location. Please check browser permissions.");
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    // Handle "Open in Google Maps" button click
    const handleOpenGoogleMaps = () => {
        if (isValidLocation) {
            const googleMapsUrl = `https://www.google.com/maps?q=${eventLat},${eventLng}`;
            window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
        }
    };

    // Format date string for display
    const formattedDate = date
        ? new Date(date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
          })
        : 'Upcoming Event';

    // Fallback UI when latitude or longitude is missing/invalid
    if (!isValidLocation) {
        return (
            <div className="space-y-3">
                <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <MapPin size={14} /> Location Map
                </h5>
                <div className="bg-[#0c0c0c] border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-3 min-h-[220px]">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-1">
                        <AlertCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-white">Location not available</h3>
                    <p className="text-xs text-white/40 max-w-sm">
                        Coordinates for this event have not been specified. Please contact the event organizer for exact directions.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <MapPin size={14} /> Event Location Map
                </h5>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={handleLocateMe}
                        disabled={isLocating}
                        className="px-3.5 py-1.5 bg-white/5 hover:bg-indigo-600/20 border border-white/10 hover:border-indigo-500/40 rounded-xl text-xs font-bold text-white/80 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
                        title="Locate My Position"
                    >
                        <LocateFixed size={14} className={isLocating ? 'animate-spin text-cyan-400' : 'text-cyan-400'} />
                        <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
                    </button>

                    {userLocation && (
                        <button
                            onClick={() => setMapCenter(eventCoordinates)}
                            className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white/80 hover:text-white transition-all flex items-center gap-2 active:scale-95"
                            title="Reset view to event marker"
                        >
                            <Navigation size={14} className="text-indigo-400" />
                            <span>Event Venue</span>
                        </button>
                    )}

                    <button
                        onClick={handleOpenGoogleMaps}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 active:scale-95"
                        title="Open in Google Maps"
                    >
                        <span>Open in Google Maps</span>
                        <ExternalLink size={13} />
                    </button>
                </div>
            </div>

            <div className="relative w-full h-[320px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl z-0 group">
                <MapContainer
                    center={eventCoordinates}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="w-full h-full z-0"
                    style={{ background: '#111' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <RecenterMap center={mapCenter || eventCoordinates} zoom={15} />

                    {/* Event Marker */}
                    <Marker position={eventCoordinates} icon={createEventMarkerIcon()}>
                        <Popup className="custom-leaflet-popup">
                            <div className="p-1 max-w-[220px] text-zinc-900 font-sans">
                                <h4 className="font-bold text-sm leading-tight text-indigo-950 mb-1">
                                    {title || 'Event Location'}
                                </h4>
                                <p className="text-xs text-zinc-600 flex items-center gap-1 font-medium mb-1">
                                    <MapPin size={12} className="text-indigo-600 shrink-0" />
                                    <span>{venue || 'Venue Location'}</span>
                                </p>
                                <p className="text-[11px] text-zinc-500 font-semibold bg-zinc-100 px-2 py-0.5 rounded-md inline-block">
                                    {formattedDate}
                                </p>
                            </div>
                        </Popup>
                    </Marker>

                    {/* User Location Marker */}
                    {userLocation && (
                        <Marker position={userLocation} icon={createUserMarkerIcon()}>
                            <Popup className="custom-leaflet-popup">
                                <div className="p-1 text-zinc-900 font-sans">
                                    <p className="font-bold text-xs text-cyan-900 flex items-center gap-1">
                                        <LocateFixed size={12} className="text-cyan-600" />
                                        Your Current Location
                                    </p>
                                </div>
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default EventMap;
