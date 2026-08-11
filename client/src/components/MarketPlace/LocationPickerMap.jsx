import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Search, LocateFixed, Check, Loader2, X } from 'lucide-react';
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

// Component to handle map clicks & camera animation
const MapEventsHandler = ({ onPinSelect, position }) => {
    const map = useMap();

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            onPinSelect(lat, lng);
        }
    });

    useEffect(() => {
        if (position && Array.isArray(position) && position[0] && position[1] && !isNaN(position[0]) && !isNaN(position[1])) {
            map.flyTo(position, Math.max(map.getZoom() || 14, 15), { duration: 1.2 });
        }
    }, [position, map]);

    return null;
};

// Place category analyzer for badge labels & icons
const getPlaceCategoryInfo = (item) => {
    if (item.isCustom) {
        return { icon: '🎯', label: 'Custom Venue', badgeClass: 'text-amber-300 bg-amber-500/20 border-amber-500/40 font-black' };
    }
    const amenity = (item.extratags?.amenity || item.address?.amenity || item.type || item.class || '').toLowerCase();
    const displayName = (item.namedetails?.name || item.name || item.display_name || '').toLowerCase();

    if (amenity.includes('cafe') || amenity.includes('coffee') || displayName.includes('cafe') || displayName.includes('coffee') || displayName.includes('starbucks')) {
        return { icon: '☕', label: 'Cafe / Coffee', badgeClass: 'text-amber-300 bg-amber-500/10 border-amber-500/30' };
    }
    if (amenity.includes('restaurant') || amenity.includes('food') || amenity.includes('bistro') || amenity.includes('diner')) {
        return { icon: '🍽️', label: 'Restaurant', badgeClass: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' };
    }
    if (amenity.includes('bar') || amenity.includes('pub') || amenity.includes('nightclub') || amenity.includes('club') || amenity.includes('lounge')) {
        return { icon: '🍺', label: 'Club / Bar', badgeClass: 'text-purple-300 bg-purple-500/10 border-purple-500/30' };
    }
    if (amenity.includes('theatre') || amenity.includes('studio') || amenity.includes('cinema') || amenity.includes('auditorium') || displayName.includes('hall')) {
        return { icon: '🎵', label: 'Venue / Studio', badgeClass: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30' };
    }
    return { icon: '📍', label: 'Landmark / Location', badgeClass: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30' };
};

const LocationPickerMap = ({
    selectedLat,
    selectedLng,
    locationName = '',
    onLocationChange,
    height = '340px',
    placeholder = 'Search cafe, venue, landmark (e.g. Bella Ciao Greater Kailash 2 Delhi)...'
}) => {
    const defaultCenter = useMemo(() => {
        if (selectedLat && selectedLng && !isNaN(Number(selectedLat)) && !isNaN(Number(selectedLng))) {
            return [Number(selectedLat), Number(selectedLng)];
        }
        return getCityCoordinates(locationName);
    }, [selectedLat, selectedLng, locationName]);

    const [markerPos, setMarkerPos] = useState(defaultCenter);
    const [searchQuery, setSearchQuery] = useState(locationName || '');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [detectedAddress, setDetectedAddress] = useState(locationName || '');
    const searchContainerRef = useRef(null);

    useEffect(() => {
        if (selectedLat && selectedLng && !isNaN(Number(selectedLat)) && !isNaN(Number(selectedLng))) {
            setMarkerPos([Number(selectedLat), Number(selectedLng)]);
        }
    }, [selectedLat, selectedLng]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reverse geocode lat, lng to fetch readable address
    const fetchAddressFromCoords = async (lat, lng) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`, {
                headers: { 'Accept-Language': 'en' }
            });
            const data = await res.json();
            if (data && data.display_name) {
                const placeName = data.address?.amenity || data.address?.building || data.address?.road || data.address?.suburb || data.address?.city || data.display_name.split(',')[0];
                const city = data.address?.city || data.address?.town || data.address?.county || data.address?.state || '';
                const fullLoc = placeName ? (city && !placeName.toLowerCase().includes(city.toLowerCase()) ? `${placeName}, ${city}` : placeName) : data.display_name;
                setDetectedAddress(fullLoc);
                return fullLoc;
            }
        } catch {
            // Ignore reverse geocode fetch errors
        }
        return null;
    };

    // Handle manual pin placement on map click or drag
    const handlePinSelect = async (lat, lng) => {
        const roundedLat = parseFloat(lat.toFixed(6));
        const roundedLng = parseFloat(lng.toFixed(6));
        setMarkerPos([roundedLat, roundedLng]);

        const fetchedAddr = await fetchAddressFromCoords(roundedLat, roundedLng);
        const finalLocName = fetchedAddr || locationName || `Location (${roundedLat}, ${roundedLng})`;

        if (onLocationChange) {
            onLocationChange({
                latitude: roundedLat,
                longitude: roundedLng,
                location: finalLocName
            });
        }
        toast.success(`Location set on map! 📍`, { duration: 1500 });
    };

    // Real Geocoding Search using Nominatim & Photon APIs with smart sub-query fallbacks
    const handlePerformGeocodeSearch = async (queryText) => {
        const rawQuery = (queryText !== undefined ? queryText : searchQuery).trim();
        if (!rawQuery || rawQuery.length < 2) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        setIsSearching(true);
        try {
            const currentLat = markerPos[0];
            const currentLng = markerPos[1];

            // Build query variations (1. Full Query, 2. Cleaned without block/unit numbers, 3. Locality/City fallback)
            const cleanedQuery = rawQuery.replace(/M-\d+|[A-Z]-\d+|Block \w+|Market|Shop \d+|No\.\d+/gi, '').replace(/\s+/g, ' ').trim();
            const words = rawQuery.split(/\s+/);
            const localityFallback = words.length >= 3 ? words.slice(-3).join(' ') : null;

            const searchQueries = [rawQuery];
            if (cleanedQuery && cleanedQuery !== rawQuery) searchQueries.push(cleanedQuery);
            if (localityFallback && !searchQueries.includes(localityFallback)) searchQueries.push(localityFallback);

            const fetchPromises = [];
            for (const q of searchQueries) {
                let nomUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&extratags=1&namedetails=1&q=${encodeURIComponent(q)}&limit=6`;
                if (currentLat && currentLng) nomUrl += `&lat=${currentLat}&lon=${currentLng}`;
                fetchPromises.push(fetch(nomUrl, { headers: { 'Accept-Language': 'en' } }).then(r => r.json()).catch(() => []));

                let photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6`;
                if (currentLat && currentLng) photonUrl += `&lat=${currentLat}&lon=${currentLng}`;
                fetchPromises.push(fetch(photonUrl).then(r => r.json()).catch(() => ({ features: [] })));
            }

            const resultsArray = await Promise.all(fetchPromises);
            let combined = [];

            for (const item of resultsArray) {
                if (Array.isArray(item)) {
                    combined.push(...item);
                } else if (item?.features) {
                    const photonPlaces = item.features.map(f => {
                        const props = f.properties || {};
                        const coords = f.geometry?.coordinates || [0, 0];
                        const placeName = props.name || props.street || rawQuery;
                        const addressParts = [props.street, props.district || props.suburb, props.city || props.state].filter(Boolean);

                        return {
                            name: placeName,
                            display_name: `${placeName}${addressParts.length ? ', ' + addressParts.join(', ') : ''}`,
                            lat: coords[1],
                            lon: coords[0],
                            extratags: { amenity: props.osm_value || props.osm_key || props.type || '' },
                            address: {
                                suburb: props.district || props.suburb || props.street || '',
                                city: props.city || props.state || ''
                            }
                        };
                    });
                    combined.push(...photonPlaces);
                }
            }

            // Deduplicate search results
            const uniqueResults = [];
            const seen = new Set();
            for (const item of combined) {
                if (!item || !item.lat || !item.lon) continue;
                const placeName = (item.name || item.namedetails?.name || item.display_name?.split(',')[0] || '').toLowerCase();
                const key = `${placeName}_${parseFloat(item.lat).toFixed(3)}_${parseFloat(item.lon).toFixed(3)}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    uniqueResults.push(item);
                }
            }

            // Always add Custom Venue entry at top so user can use exact typed address
            const customEntry = {
                isCustom: true,
                name: rawQuery,
                display_name: `Use "${rawQuery}" as Venue Location`,
                lat: uniqueResults[0] ? parseFloat(uniqueResults[0].lat) : currentLat,
                lon: uniqueResults[0] ? parseFloat(uniqueResults[0].lon) : currentLng
            };

            const finalResults = [customEntry, ...uniqueResults.slice(0, 8)];
            setSearchResults(finalResults);
            setShowDropdown(true);
        } catch {
            toast.error("Error searching location. Click on map directly.");
        } finally {
            setIsSearching(false);
        }
    };

    // Selecting a place/venue from search results
    const handleSelectSearchResult = (result) => {
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        let formattedLocation = result.isCustom ? result.name : (result.namedetails?.name || result.name || result.display_name.split(',')[0]);
        const address = result.address || {};
        const subLocality = address.suburb || address.neighbourhood || address.residential || address.road || '';
        const city = address.city || address.town || address.village || address.county || address.state || '';

        if (!result.isCustom) {
            if (subLocality && !formattedLocation.toLowerCase().includes(subLocality.toLowerCase())) {
                formattedLocation += `, ${subLocality}`;
            }
            if (city && !formattedLocation.toLowerCase().includes(city.toLowerCase())) {
                formattedLocation += `, ${city}`;
            }
        }

        const roundedLat = parseFloat(lat.toFixed(6));
        const roundedLng = parseFloat(lng.toFixed(6));

        setMarkerPos([roundedLat, roundedLng]);
        setDetectedAddress(formattedLocation);
        setSearchQuery(formattedLocation);
        setShowDropdown(false);

        if (onLocationChange) {
            onLocationChange({
                latitude: roundedLat,
                longitude: roundedLng,
                location: formattedLocation
            });
        }
        toast.success(`📍 Found: ${formattedLocation}`);
    };

    // GPS Current Location Detection
    const handleDetectGPS = (isSilent = false) => {
        if (!navigator.geolocation) {
            if (!isSilent) toast.error("Geolocation is not supported by your browser");
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

                if (onLocationChange) {
                    onLocationChange({
                        latitude: lat,
                        longitude: lng,
                        location: finalLoc
                    });
                }
                if (!isSilent) {
                    toast.success("GPS Location Pinned! 🎯");
                }
            },
            () => {
                setIsLocating(false);
                if (!isSilent) {
                    toast.error("GPS access denied. Click on map to place your pin.");
                }
            },
            { enableHighAccuracy: true, timeout: 8000 }
        );
    };

    return (
        <div className="space-y-3">
            {/* Top Toolbar: Search & GPS Detect (Using div container to prevent parent form submission) */}
            <div className="flex flex-col sm:flex-row gap-2" ref={searchContainerRef}>
                <div className="relative flex-1">
                    <div className="flex items-center bg-black/70 border border-white/15 rounded-xl p-1.5 focus-within:border-amber-500 transition-colors shadow-md">
                        <Search size={16} className="text-amber-400 ml-2 shrink-0" />
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={searchQuery}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (searchResults.length > 0) {
                                        handleSelectSearchResult(searchResults[0]);
                                    } else {
                                        handlePerformGeocodeSearch(searchQuery);
                                    }
                                }
                            }}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                handlePerformGeocodeSearch(e.target.value);
                            }}
                            onFocus={() => {
                                if (searchResults.length > 0) setShowDropdown(true);
                            }}
                            className="w-full bg-transparent px-2.5 py-1 text-xs text-white placeholder-white/40 focus:outline-none"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setSearchQuery('');
                                    setSearchResults([]);
                                    setShowDropdown(false);
                                }}
                                className="p-1 text-white/40 hover:text-white shrink-0 mr-1"
                            >
                                <X size={14} />
                            </button>
                        )}
                        <button
                            type="button"
                            disabled={isSearching}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (searchResults.length > 0) {
                                    handleSelectSearchResult(searchResults[0]);
                                } else {
                                    handlePerformGeocodeSearch(searchQuery);
                                }
                            }}
                            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0 active:scale-95 cursor-pointer"
                        >
                            {isSearching ? <Loader2 size={13} className="animate-spin" /> : 'Search'}
                        </button>
                    </div>

                    {/* Geocoding Dropdown Suggestions */}
                    {showDropdown && searchResults.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#0f0f17] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden z-[500] max-h-60 overflow-y-auto custom-scrollbar text-left">
                            <div className="px-3 py-1.5 bg-amber-500/10 border-b border-amber-500/20 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                                Select Searched Location:
                            </div>
                            {searchResults.map((item, index) => {
                                const cat = getPlaceCategoryInfo(item);
                                const placeName = item.isCustom ? item.name : (item.namedetails?.name || item.name || item.display_name.split(',')[0]);
                                const addressSnippet = item.isCustom ? item.display_name : item.display_name.split(',').slice(1, 4).join(',').trim();

                                return (
                                    <div
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleSelectSearchResult(item);
                                        }}
                                        className="px-3.5 py-2.5 hover:bg-amber-500/15 cursor-pointer border-b border-white/5 last:border-0 transition-colors flex items-start justify-between gap-2.5 text-left group"
                                    >
                                        <div className="flex items-start gap-2 min-w-0">
                                            <span className="text-sm shrink-0 mt-0.5">{cat.icon}</span>
                                            <div className="text-xs min-w-0">
                                                <p className="text-white font-semibold line-clamp-1 group-hover:text-amber-300 transition-colors">{placeName}</p>
                                                <p className="text-[10px] text-white/50 line-clamp-1">{addressSnippet || item.display_name}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${cat.badgeClass}`}>
                                            {cat.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* GPS Pin Button */}
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDetectGPS(false);
                    }}
                    disabled={isLocating}
                    className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-xs font-bold text-amber-300 transition-colors flex items-center justify-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
                >
                    <LocateFixed size={14} className={isLocating ? 'animate-spin text-amber-400' : 'text-amber-400'} />
                    <span>{isLocating ? 'Locating...' : 'Use GPS Pin'}</span>
                </button>
            </div>

            {/* Interactive Map Container */}
            <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 shadow-xl z-0" style={{ height }}>
                <MapContainer
                    center={markerPos}
                    zoom={15}
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
                    >
                        <Popup>
                            <div className="text-xs space-y-1 p-1 text-black">
                                <p className="font-bold">{detectedAddress || locationName || 'Selected Location'}</p>
                                <p className="text-[10px] text-gray-600">Lat: {markerPos[0]}, Lng: {markerPos[1]}</p>
                            </div>
                        </Popup>
                    </Marker>
                </MapContainer>

                {/* Overlay Instruction Banner */}
                <div className="absolute top-3 left-3 right-3 z-[400] pointer-events-none flex justify-center">
                    <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-500/40 text-[11px] font-bold text-amber-300 shadow-lg flex items-center gap-1.5">
                        <MapPin size={13} className="text-amber-400" />
                        <span>Click map or drag pin to set exact location</span>
                    </div>
                </div>

                {/* Selected Location Banner at bottom */}
                <div className="absolute bottom-3 left-3 right-3 z-[400] bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 text-xs flex items-center justify-between gap-2 shadow-lg">
                    <div className="flex items-center gap-2 truncate">
                        <div className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">
                            <Check size={12} />
                        </div>
                        <div className="truncate text-white/90 font-medium text-[11px]">
                            <span className="text-white/50">Selected Location:</span> {detectedAddress || locationName || 'Selected Pin'}
                            <span className="text-amber-400/80 font-mono ml-1 text-[10px]">({markerPos[0]}, {markerPos[1]})</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPickerMap;
