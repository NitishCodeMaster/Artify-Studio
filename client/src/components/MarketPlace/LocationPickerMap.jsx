import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Search, LocateFixed, Check, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getCityCoordinates } from './SellerMap';

// Custom Glowing Pin Marker for Location Picker
const createPickerPinIcon = () => {
    return L.divIcon({
        className: 'custom-picker-pin',
        html: `
            <div class="relative flex items-center justify-center w-10 h-10 -translate-x-1/2 -translate-y-full cursor-pointer">
                <div class="absolute inset-0 rounded-full bg-amber-500/40 animate-ping"></div>
                <div class="relative z-10 w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl border-2 border-white text-black font-black">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                </div>
                <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-orange-600 rotate-45 border-r border-b border-white"></div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });
};

// Component to handle map clicks & center updates
const MapEventsHandler = ({ onPinSelect, position }) => {
    const map = useMap();

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            onPinSelect(lat, lng);
        }
    });

    useEffect(() => {
        if (position && Array.isArray(position) && position[0] && position[1]) {
            map.flyTo(position, map.getZoom() || 14, { duration: 1 });
        }
    }, [position, map]);

    return null;
};

const LocationPickerMap = ({
    selectedLat,
    selectedLng,
    locationName = '',
    onLocationChange,
    height = '320px'
}) => {
    const defaultCenter = useMemo(() => {
        if (selectedLat && selectedLng && !isNaN(selectedLat) && !isNaN(selectedLng)) {
            return [Number(selectedLat), Number(selectedLng)];
        }
        return getCityCoordinates(locationName);
    }, [selectedLat, selectedLng, locationName]);

    const [markerPos, setMarkerPos] = useState(defaultCenter);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [detectedAddress, setDetectedAddress] = useState(locationName || '');

    useEffect(() => {
        if (selectedLat && selectedLng && !isNaN(selectedLat) && !isNaN(selectedLng)) {
            setMarkerPos([Number(selectedLat), Number(selectedLng)]);
        }
    }, [selectedLat, selectedLng]);

    // Reverse geocode lat, lng to fetch readable city/address name
    const fetchAddressFromCoords = async (lat, lng) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`, {
                headers: { 'Accept-Language': 'en' }
            });
            const data = await res.json();
            if (data && data.address) {
                const city = data.address.city || data.address.town || data.address.village || data.address.state_district || data.address.county || data.address.state || 'Selected Location';
                const state = data.address.state ? `, ${data.address.state}` : '';
                const fullLoc = `${city}${state}`;
                setDetectedAddress(fullLoc);
                return fullLoc;
            }
        } catch {
            // Ignore fetch errors, fallback to coordinates label
        }
        return null;
    };

    const handlePinSelect = async (lat, lng) => {
        const roundedLat = parseFloat(lat.toFixed(6));
        const roundedLng = parseFloat(lng.toFixed(6));
        setMarkerPos([roundedLat, roundedLng]);

        const fetchedAddr = await fetchAddressFromCoords(roundedLat, roundedLng);
        const finalLocName = fetchedAddr || locationName || `Location (${roundedLat}, ${roundedLng})`;

        onLocationChange({
            latitude: roundedLat,
            longitude: roundedLng,
            location: finalLocName
        });
        toast.success(`Location set on map! 📍`, { duration: 1500 });
    };

    const handleSearchLocation = async (e) => {
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
                const displayName = data[0].display_name.split(',').slice(0, 2).join(',');

                setMarkerPos([lat, lng]);
                setDetectedAddress(displayName);

                onLocationChange({
                    latitude: lat,
                    longitude: lng,
                    location: displayName
                });
                toast.success(`Found: ${displayName} 📍`);
            } else {
                toast.error("Location not found on map. Try another search.");
            }
        } catch {
            toast.error("Error searching location. Please click on map.");
        } finally {
            setIsSearching(false);
        }
    };

    const handleDetectGPS = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = parseFloat(position.coords.latitude.toFixed(6));
                const lng = parseFloat(position.coords.longitude.toFixed(6));

                setMarkerPos([lat, lng]);
                setIsLocating(false);

                const addr = await fetchAddressFromCoords(lat, lng);
                const finalLoc = addr || 'My Current GPS Location';
                setDetectedAddress(finalLoc);

                onLocationChange({
                    latitude: lat,
                    longitude: lng,
                    location: finalLoc
                });
                toast.success("GPS Location Pinned! 🎯");
            },
            () => {
                setIsLocating(false);
                toast.error("GPS access denied. Click on map to place your pin.");
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    return (
        <div className="space-y-3">
            {/* Top Toolbar: Search & GPS Detect */}
            <div className="flex flex-col sm:flex-row gap-2">
                <form onSubmit={handleSearchLocation} className="flex-1 flex items-center bg-black/60 border border-white/15 rounded-xl p-1.5 focus-within:border-amber-500 transition-colors">
                    <Search size={16} className="text-amber-400 ml-2 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search city/area on map..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent px-2.5 py-1 text-xs text-white placeholder-white/40 focus:outline-none"
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                        {isSearching ? <Loader2 size={12} className="animate-spin" /> : 'Search'}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={handleDetectGPS}
                    disabled={isLocating}
                    className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-300 transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                    <LocateFixed size={14} className={isLocating ? 'animate-spin text-amber-400' : 'text-amber-400'} />
                    <span>{isLocating ? 'Locating...' : 'Use GPS Pin'}</span>
                </button>
            </div>

            {/* Interactive Map Container */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl" style={{ height }}>
                <MapContainer
                    center={markerPos}
                    zoom={13}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%', background: '#111' }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEventsHandler onPinSelect={handlePinSelect} position={markerPos} />
                    <Marker
                        position={markerPos}
                        icon={createPickerPinIcon()}
                        draggable={true}
                        eventHandlers={{
                            dragend: (e) => {
                                const latlng = e.target.getLatLng();
                                handlePinSelect(latlng.lat, latlng.lng);
                            }
                        }}
                    />
                </MapContainer>

                {/* Overlay Instruction Banner */}
                <div className="absolute top-3 left-3 right-3 z-[400] pointer-events-none flex justify-center">
                    <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 text-[11px] font-bold text-amber-300 shadow-lg flex items-center gap-1.5">
                        <MapPin size={13} className="text-amber-400" />
                        <span>Click map or drag pin to set exact seller location</span>
                    </div>
                </div>

                {/* Selected Location Banner at bottom */}
                <div className="absolute bottom-3 left-3 right-3 z-[400] bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs flex items-center justify-between gap-2 shadow-lg">
                    <div className="flex items-center gap-2 truncate">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                            <Check size={12} />
                        </div>
                        <div className="truncate text-white/90 font-medium text-[11px]">
                            <span className="text-white/50">Pin Location:</span> {detectedAddress || locationName || 'Selected Pin'}
                            <span className="text-white/40 ml-1 text-[10px]">({markerPos[0]}, {markerPos[1]})</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPickerMap;
