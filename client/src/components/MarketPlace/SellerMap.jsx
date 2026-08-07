import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, ExternalLink, AlertCircle, LocateFixed, Store, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const KNOWN_CITY_COORDINATES = [
    { keywords: ['chandigarh'], coordinates: [30.7333, 76.7794] },
    { keywords: ['jaipur', 'rajasthan'], coordinates: [26.9124, 75.7873] },
    { keywords: ['delhi', 'new delhi', 'dilli', 'haat'], coordinates: [28.6139, 77.2090] },
    { keywords: ['mumbai', 'bandra'], coordinates: [19.0760, 72.8777] },
    { keywords: ['kolkata', 'bengal'], coordinates: [22.5726, 88.3639] },
    { keywords: ['bangalore', 'bengaluru'], coordinates: [12.9719, 77.5961] },
    { keywords: ['pune'], coordinates: [18.5204, 73.8567] },
    { keywords: ['haridwar', 'uttarakhand'], coordinates: [29.9457, 78.1642] },
    { keywords: ['varanasi', 'banaras'], coordinates: [25.3176, 82.9739] },
    { keywords: ['ranchi', 'jharkhand', 'tribal'], coordinates: [23.3441, 85.3096] },
    { keywords: ['guwahati', 'assam'], coordinates: [26.1445, 91.7362] },
];

export const getCityCoordinates = (locationStr = '') => {
    if (!locationStr) return [30.7333, 76.7794]; // Default Chandigarh
    const norm = String(locationStr).toLowerCase();
    const match = KNOWN_CITY_COORDINATES.find(({ keywords }) =>
        keywords.some(kw => norm.includes(kw))
    );
    return match ? match.coordinates : [30.7333, 76.7794];
};

// Custom Leaflet Icon for Seller Store Pin (Amber Glowing Store Pin)
const createSellerMarkerIcon = (storeName = '', category = '') => {
    const isTribal = category.toLowerCase().includes('tribal') || category.toLowerCase().includes('craft');
    const isInstrument = category.toLowerCase().includes('instrument') || category.toLowerCase().includes('gear') || category.toLowerCase().includes('luthier');

    const badgeColor = isTribal ? 'from-amber-600 to-red-600 shadow-amber-600/50' :
                       isInstrument ? 'from-orange-500 to-amber-600 shadow-orange-500/50' :
                       'from-amber-500 to-yellow-600 shadow-amber-500/50';

    return L.divIcon({
        className: 'custom-seller-marker',
        html: `
            <div class="relative flex items-center justify-center w-10 h-10 -translate-x-1/2 -translate-y-full cursor-pointer group">
                <div class="absolute inset-0 rounded-full bg-amber-500/30 animate-ping"></div>
                <div class="relative z-10 w-10 h-10 rounded-2xl bg-gradient-to-br ${badgeColor} flex items-center justify-center shadow-lg border-2 border-white text-white font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
                        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
                        <path d="M2 7h20"/>
                    </svg>
                </div>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-amber-600 rotate-45 border-r border-b border-white/40"></div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

// Custom User Location Pin
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

const RecenterMap = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
            map.flyTo(center, zoom || 14, { duration: 1.2 });
        }
    }, [center, zoom, map]);
    return null;
};

const SellerMap = ({
    locationName = 'Chandigarh',
    latitude = null,
    longitude = null,
    storeName = 'Rahul Music Store',
    sellerCategory = 'Instrument & Craft Store',
    sellerId = null,
    onNavigateProfile = null,
    multipleSellers = [],
    height = '320px'
}) => {
    const [userLocation, setUserLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    const lat = Number(latitude);
    const lng = Number(longitude);
    const hasCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0 && lat >= -90 && lat <= 90;

    const initialCenter = hasCoords
        ? [lat, lng]
        : getCityCoordinates(locationName);

    useEffect(() => {
        setMapCenter(initialCenter);
    }, [locationName, latitude, longitude]);

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
                toast.success("Location detected!");
            },
            (error) => {
                setIsLocating(false);
                toast.error("Unable to get location. Using default city map.");
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    const handleOpenGoogleMaps = () => {
        const query = hasCoords ? `${lat},${lng}` : encodeURIComponent(`${storeName} ${locationName}`);
        window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Store size={15} />
                    </div>
                    <div>
                        <h5 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                            Seller Location & Store Map
                        </h5>
                        <p className="text-[11px] text-white/50 flex items-center gap-1">
                            <MapPin size={12} className="text-amber-400" />
                            <span>📍 {locationName || 'Chandigarh'}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        type="button"
                        onClick={handleLocateMe}
                        disabled={isLocating}
                        className="px-3 py-1.5 bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 rounded-xl text-xs font-bold text-white/80 hover:text-white transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                    >
                        <LocateFixed size={13} className={isLocating ? 'animate-spin text-cyan-400' : 'text-cyan-400'} />
                        <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleOpenGoogleMaps}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95"
                    >
                        <span>Open in Google Maps</span>
                        <ExternalLink size={12} />
                    </button>
                </div>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-0 group" style={{ height }}>
                <MapContainer
                    center={mapCenter || initialCenter}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="w-full h-full z-0"
                    style={{ background: '#0a0a0a' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <RecenterMap center={mapCenter || initialCenter} zoom={13} />

                    {/* Single Seller Pin */}
                    {multipleSellers.length === 0 && (
                        <Marker position={initialCenter} icon={createSellerMarkerIcon(storeName, sellerCategory)}>
                            <Popup className="custom-leaflet-popup">
                                <div className="p-1 max-w-[220px] text-zinc-900 font-sans">
                                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-amber-700 mb-1">
                                        <Sparkles size={11} /> {sellerCategory || 'Verified Seller'}
                                    </div>
                                    <h4 className="font-bold text-sm leading-tight text-zinc-900 mb-1">
                                        {storeName || 'Seller Store'}
                                    </h4>
                                    <p className="text-xs text-zinc-600 flex items-center gap-1 font-medium mb-2">
                                        <MapPin size={12} className="text-amber-600 shrink-0" />
                                        <span>📍 {locationName || 'Chandigarh'}</span>
                                    </p>
                                    {sellerId && onNavigateProfile && (
                                        <button
                                            onClick={() => onNavigateProfile(sellerId)}
                                            className="w-full py-1 px-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded transition-colors text-center block"
                                        >
                                            View Seller Profile
                                        </button>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    )}

                    {/* Multi Sellers Pins */}
                    {multipleSellers.length > 0 && multipleSellers.map((item, index) => {
                        const sellerCoords = item.latitude && item.longitude
                            ? [Number(item.latitude), Number(item.longitude)]
                            : getCityCoordinates(item.location || item.sellerLocation);

                        const displayStore = item.sellerStoreName || item.storeName || item.sellerName || 'Artisan Seller';

                        return (
                            <Marker
                                key={item.id || item._id || index}
                                position={sellerCoords}
                                icon={createSellerMarkerIcon(displayStore, item.category || '')}
                            >
                                <Popup className="custom-leaflet-popup">
                                    <div className="p-1 max-w-[220px] text-zinc-900 font-sans">
                                        <h4 className="font-bold text-sm leading-tight text-zinc-900 mb-1">
                                            {displayStore}
                                        </h4>
                                        {item.productName && (
                                            <p className="text-xs text-amber-700 font-semibold mb-1 line-clamp-1">
                                                Item: {item.productName}
                                            </p>
                                        )}
                                        <p className="text-xs text-zinc-600 flex items-center gap-1 font-medium mb-2">
                                            <MapPin size={12} className="text-amber-600 shrink-0" />
                                            <span>📍 {item.location || item.sellerLocation || 'Chandigarh'}</span>
                                        </p>
                                        {item.sellerId && onNavigateProfile && (
                                            <button
                                                onClick={() => onNavigateProfile(item.sellerId)}
                                                className="w-full py-1 px-2 bg-amber-500 text-black text-xs font-bold rounded transition-colors text-center block"
                                            >
                                                View Seller Profile
                                            </button>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}

                    {/* User Pin */}
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

export default SellerMap;
