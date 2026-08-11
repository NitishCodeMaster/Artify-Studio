import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { X, Calendar, Clock, MapPin, IndianRupee, Tag, Navigation, Pencil, Touchpad, Search, Loader2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../../utils/api';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CloudinaryUpload from './CloudinaryUpload';
import LocationPickerMap from '../MarketPlace/LocationPickerMap';

// Custom Leaflet DivIcon for Event Marker
const createEventMarkerIcon = () => {
    return L.divIcon({
        className: 'custom-event-marker-picker',
        html: `
            <div class="relative flex items-center justify-center w-8 h-8 -translate-x-1/2 -translate-y-full cursor-pointer">
                <div class="absolute inset-0 rounded-full bg-indigo-500/40 animate-ping"></div>
                <div class="relative z-10 w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg border-2 border-white text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                        <circle cx="12" cy="10" r="3"/>
                    </svg>
                </div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });
};

const LocationMarker = ({ selectedLat, selectedLng, onLocationPicked }) => {
    const map = useMap();

    useMapEvents({
        click(e) {
            const { lat, lng } = e.latlng;
            onLocationPicked(lat, lng);
        },
    });

    useEffect(() => {
        if (selectedLat && selectedLng && !isNaN(Number(selectedLat)) && !isNaN(Number(selectedLng))) {
            map.flyTo([Number(selectedLat), Number(selectedLng)], Math.max(map.getZoom(), 14), { duration: 1 });
        }
    }, [selectedLat, selectedLng, map]);

    const hasValidPos = selectedLat && selectedLng && !isNaN(Number(selectedLat)) && !isNaN(Number(selectedLng));

    return hasValidPos ? (
        <Marker position={[Number(selectedLat), Number(selectedLng)]} icon={createEventMarkerIcon()} />
    ) : null;
};

const MapLocationPicker = ({ selectedLat, selectedLng, onLocationPicked }) => {
    const defaultCenter = [
        selectedLat && !isNaN(Number(selectedLat)) ? Number(selectedLat) : 20.5937,
        selectedLng && !isNaN(Number(selectedLng)) ? Number(selectedLng) : 78.9629
    ];
    const zoomLevel = selectedLat && selectedLng ? 14 : 5;

    return (
        <div className="relative w-full h-[220px] rounded-2xl overflow-hidden border border-white/10 shadow-inner z-0">
            <MapContainer
                center={defaultCenter}
                zoom={zoomLevel}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
                style={{ background: '#111' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                    selectedLat={selectedLat}
                    selectedLng={selectedLng}
                    onLocationPicked={onLocationPicked}
                />
            </MapContainer>
            <div className="absolute top-2 right-2 z-[400] bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-white/80 flex items-center gap-1.5 pointer-events-none">
                <Touchpad size={12} className="text-indigo-400" />
                <span>Click map to pin point</span>
            </div>
        </div>
    );
};

const formatDateForInput = (d) => {
    if (!d) return '';
    const dateObj = new Date(d);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toISOString().split('T')[0];
};

const CreateEventModal = ({ isOpen, onClose, refresh, eventToEdit = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        price: '',
        artistPayout: '5000',
        gigType: 'paid_gig',
        location: '',
        latitude: '',
        longitude: '',
        category: 'General',
        bannerImage: '',
        maxSeats: 100
    });

    const [loading, setLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Location search states
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (eventToEdit) {
            const payout = Number(eventToEdit.artistPayout || 0);
            const ticket = Number(eventToEdit.price || 0);
            let type = eventToEdit.gigType;
            if (!type || !['free', 'paid_gig', 'ticketed'].includes(type)) {
                if (payout > 0) type = 'paid_gig';
                else if (ticket > 0) type = 'ticketed';
                else type = 'free';
            }

            setFormData({
                title: eventToEdit.title || '',
                description: eventToEdit.description || '',
                date: formatDateForInput(eventToEdit.date),
                time: eventToEdit.time || '',
                price: ticket > 0 ? String(ticket) : '',
                artistPayout: payout > 0 ? String(payout) : '5000',
                gigType: type,
                location: eventToEdit.location || '',
                latitude: eventToEdit.latitude !== undefined && eventToEdit.latitude !== null ? eventToEdit.latitude : '',
                longitude: eventToEdit.longitude !== undefined && eventToEdit.longitude !== null ? eventToEdit.longitude : '',
                category: eventToEdit.category || 'General',
                bannerImage: eventToEdit.bannerImage || '',
                maxSeats: eventToEdit.maxSeats || 100
            });
            if (eventToEdit.location) {
                setSearchQuery(eventToEdit.location);
            }
        } else {
            setFormData({
                title: '',
                description: '',
                date: '',
                time: '',
                price: '',
                artistPayout: '5000',
                gigType: 'paid_gig',
                location: '',
                latitude: '',
                longitude: '',
                category: 'General',
                bannerImage: '',
                maxSeats: 100
            });
            setSearchQuery('');
        }
    }, [eventToEdit, isOpen]);

    // Handle map click reverse geocoding
    const handleMapLocationPicked = async (lat, lng) => {
        const formattedLat = lat.toFixed(6);
        const formattedLng = lng.toFixed(6);

        setFormData(prev => ({
            ...prev,
            latitude: formattedLat,
            longitude: formattedLng
        }));

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
            const data = await res.json();
            if (data && data.display_name) {
                const placeName = data.address?.amenity || data.address?.building || data.address?.road || data.address?.suburb || data.address?.city || data.display_name.split(',')[0];
                const city = data.address?.city || data.address?.town || data.address?.county || '';
                const shortLocation = placeName ? (city ? `${placeName}, ${city}` : placeName) : data.display_name;

                setFormData(prev => ({
                    ...prev,
                    location: prev.location.trim() ? prev.location : shortLocation
                }));
                setSearchQuery(shortLocation);
            }
        } catch {
            // Ignore geocoding error
        }
    };

    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        if (isOpen && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                () => {},
                { timeout: 5000 }
            );
        }
    }, [isOpen]);

    // Helper to categorize searched locations (Cafe, Restaurant, Club, Studio, Place)
    const getPlaceCategoryInfo = (item) => {
        const amenity = (item.extratags?.amenity || item.address?.amenity || item.type || item.class || '').toLowerCase();
        const category = (item.category || item.class || '').toLowerCase();
        const displayName = (item.namedetails?.name || item.name || item.display_name || '').toLowerCase();

        if (amenity.includes('cafe') || amenity.includes('coffee') || displayName.includes('cafe') || displayName.includes('coffee') || displayName.includes('chai') || displayName.includes('starbucks')) {
            return { icon: '☕', label: 'Cafe / Coffee', badgeClass: 'text-amber-300 bg-amber-500/10 border-amber-500/30' };
        }
        if (amenity.includes('restaurant') || amenity.includes('food') || amenity.includes('fast_food') || amenity.includes('bistro') || amenity.includes('diner')) {
            return { icon: '🍽️', label: 'Restaurant', badgeClass: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30' };
        }
        if (amenity.includes('bar') || amenity.includes('pub') || amenity.includes('nightclub') || amenity.includes('club') || amenity.includes('lounge')) {
            return { icon: '🍺', label: 'Club / Bar', badgeClass: 'text-purple-300 bg-purple-500/10 border-purple-500/30' };
        }
        if (amenity.includes('theatre') || amenity.includes('studio') || category.includes('leisure') || amenity.includes('cinema') || amenity.includes('auditorium') || displayName.includes('hall') || displayName.includes('center')) {
            return { icon: '🎵', label: 'Venue / Studio', badgeClass: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30' };
        }
        return { icon: '📍', label: 'Place / Landmark', badgeClass: 'text-blue-300 bg-blue-500/10 border-blue-500/30' };
    };

    // Location search lookup (Local Cafes, Restaurants, Venues, Places)
    const handleSearchLocation = async (query) => {
        if (!query || query.trim().length < 2) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }
        setIsSearching(true);
        try {
            const currentLat = formData.latitude || userLocation?.lat;
            const currentLng = formData.longitude || userLocation?.lng;

            // 1. Nominatim Direct POI & Location Search (with India country bias)
            let nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&extratags=1&namedetails=1&q=${encodeURIComponent(query)}&countrycodes=in&limit=10`;
            if (currentLat && currentLng) {
                nominatimUrl += `&lat=${currentLat}&lon=${currentLng}`;
            }

            // 2. Photon POI API (Instant local cafe & venue search)
            let photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=10`;
            if (currentLat && currentLng) {
                photonUrl += `&lat=${currentLat}&lon=${currentLng}`;
            }

            // 3. Fallback Sub-query (e.g. if "Bella Ciao Greater Kailash 2", search "Greater Kailash 2 Delhi")
            let fallbackUrl = null;
            const parts = query.trim().split(' ');
            if (parts.length >= 2) {
                const subQuery = parts.slice(1).join(' ');
                fallbackUrl = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&extratags=1&namedetails=1&q=${encodeURIComponent(subQuery + ', Delhi India')}&countrycodes=in&limit=5`;
            }

            const fetchPromises = [
                fetch(nominatimUrl).then(r => r.json()).catch(() => []),
                fetch(photonUrl).then(r => r.json()).catch(() => ({ features: [] }))
            ];
            if (fallbackUrl) {
                fetchPromises.push(fetch(fallbackUrl).then(r => r.json()).catch(() => []));
            }

            const [nominatimData, photonData, fallbackData] = await Promise.all(fetchPromises);

            let combined = [];

            if (Array.isArray(nominatimData)) {
                combined.push(...nominatimData);
            }

            if (photonData?.features) {
                const photonPlaces = photonData.features.map(f => {
                    const props = f.properties || {};
                    const coords = f.geometry?.coordinates || [0, 0];
                    const placeName = props.name || props.street || query;
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

            if (Array.isArray(fallbackData)) {
                combined.push(...fallbackData);
            }

            // Deduplicate results
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

            // Custom Entry Fallback Option so ANY typed Cafe Name can be selected instantly
            const customEntry = {
                isCustom: true,
                name: query.trim(),
                display_name: `Use "${query.trim()}" as Venue Location`,
                lat: (uniqueResults[0] ? parseFloat(uniqueResults[0].lat) : (currentLat || 28.5355)),
                lon: (uniqueResults[0] ? parseFloat(uniqueResults[0].lon) : (currentLng || 77.2633))
            };

            setSearchResults([customEntry, ...uniqueResults.slice(0, 10)]);
            setShowDropdown(true);
        } catch (err) {
            console.error("Location search error:", err);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle selecting a place/cafe result from dropdown
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

        setFormData(prev => ({
            ...prev,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6),
            location: formattedLocation
        }));
        setShowDropdown(false);
        setSearchQuery(formattedLocation);
        toast.success(`📍 Location set: ${formattedLocation}`);
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Browser location is not supported.");
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                handleMapLocationPicked(lat, lng);
                toast.success("Current location set successfully.");
                setIsLocating(false);
            },
            () => {
                toast.error("Please allow location permission or select from map/search.");
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation for Gig Models
        if (formData.gigType === 'paid_gig' && (!formData.artistPayout || Number(formData.artistPayout) <= 0)) {
            toast.error("Please enter the Artist Payment / Budget for this Paid Gig!");
            return;
        }

        if (formData.gigType === 'ticketed' && (!formData.price || Number(formData.price) <= 0)) {
            toast.error("Please enter the Ticket Price for this Ticketed Event!");
            return;
        }

        setLoading(true);
        const isEditing = Boolean(eventToEdit);
        const eventId = eventToEdit?._id || eventToEdit?.id;

        const payload = {
            ...formData,
            gigType: formData.gigType || 'paid_gig',
            artistPayout: formData.gigType === 'paid_gig' ? Number(formData.artistPayout || 0) : 0,
            price: formData.gigType === 'ticketed' ? Number(formData.price || 0) : 0,
            maxSeats: Number(formData.maxSeats || 100)
        };

        try {
            let res;
            if (isEditing) {
                try {
                    res = await api.put(`/events/update/${eventId}`, payload);
                } catch (err1) {
                    try {
                        res = await api.put(`/events/${eventId}`, payload);
                    } catch (err2) {
                        try {
                            res = await api.post(`/events/update/${eventId}`, payload);
                        } catch (err3) {
                            const token = localStorage.getItem('token');
                            const headers = {
                                'Content-Type': 'application/json',
                                ...(token ? { Authorization: `Bearer ${token}` } : {})
                            };
                            res = await api.put(`/events/update/${eventId}`, payload);
                        }
                    }
                }
            } else {
                res = await api.post('/events/create', payload);
            }

            if (res && res.data && res.data.success) {
                toast.success(isEditing ? "Event updated successfully! ✏️" : "Event is now Live! 🎉");
                if (refresh) refresh(res.data.event);
                onClose();
            }
        } catch (error) {
            const message = error.response?.data?.message || error.message || "An error occurred!";
            if (message.toLowerCase().includes('session expired') || message.toLowerCase().includes('invalid token')) {
                toast.error("Session expired. Please login again to post the event.");
                onClose();
                return;
            }
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const isEditing = Boolean(eventToEdit);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
            <Motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <Motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="relative bg-[#0f0f0f] border border-white/10 w-full max-w-2xl max-h-[88vh] rounded-3xl overflow-hidden shadow-2xl z-10 my-auto flex flex-col"
            >
                <div className="p-4 sm:p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
                    <div className="flex items-center gap-2">
                        {isEditing && <Pencil size={20} className="text-indigo-400" />}
                        <h2 className="text-lg sm:text-xl font-bold text-white">{isEditing ? "Edit Gig Details" : "Post New Gig"}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 min-w-[40px] min-h-[40px] flex items-center justify-center hover:bg-white/5 rounded-full transition-colors">
                        <X size={20} className="text-white/50" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 overflow-y-auto custom-scrollbar flex-1">
                    {/* Commercial Gig Model Selector */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Select Gig Model Type</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {/* 1. Free Gig */}
                            <div
                                onClick={() => setFormData(prev => ({ ...prev, gigType: 'free', price: '0', artistPayout: '0' }))}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                    formData.gigType === 'free'
                                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                                }`}
                            >
                                <div className="text-xl mb-1">🎁</div>
                                <h4 className="font-bold text-sm text-white">1. Free Gig</h4>
                                <p className="text-[10px] text-white/50 leading-tight mt-1">Open Mic, College, NGO, Community Event (Free Entry & Pay: ₹0)</p>
                            </div>

                            {/* 2. Paid Gig ⭐ */}
                            <div
                                onClick={() => setFormData(prev => ({ ...prev, gigType: 'paid_gig', price: '0', artistPayout: prev.artistPayout && Number(prev.artistPayout) > 0 ? prev.artistPayout : '5000' }))}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                    formData.gigType === 'paid_gig'
                                        ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xl">⭐</span>
                                    <span className="text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">POPULAR</span>
                                </div>
                                <h4 className="font-bold text-sm text-white">2. Paid Gig</h4>
                                <p className="text-[10px] text-white/50 leading-tight mt-1">Organizer pays Artist (Cafe, Wedding, Hotel Band)</p>
                            </div>

                            {/* 3. Ticketed Event */}
                            <div
                                onClick={() => setFormData(prev => ({ ...prev, gigType: 'ticketed', artistPayout: '0', price: prev.price && Number(prev.price) > 0 ? prev.price : '500' }))}
                                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                                    formData.gigType === 'ticketed'
                                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                                }`}
                            >
                                <div className="text-xl mb-1">🎟️</div>
                                <h4 className="font-bold text-sm text-white">3. Ticketed Event</h4>
                                <p className="text-[10px] text-white/50 leading-tight mt-1">Audience buys ticket to enter (e.g. ₹500/ticket)</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Event / Gig Title</label>
                        <input
                            required
                            type="text"
                            placeholder={formData.gigType === 'paid_gig' ? "e.g. Saturday Night Singer Needed for Cafe" : (formData.gigType === 'ticketed' ? "e.g. Live Standup Comedy Special" : "e.g. Open Mic Acoustic Session")}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase">Description</label>
                        <textarea
                            required
                            rows="3"
                            placeholder="What's the vibe and requirements of the gig?"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                            <Calendar size={12} /> Date
                        </label>
                        <input
                            required
                            type="date"
                            style={{ colorScheme: 'dark' }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:bg-indigo-500/5 outline-none transition-all cursor-pointer"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                            <Clock size={12} /> Time
                        </label>
                        <input
                            required
                            type="time"
                            style={{ colorScheme: 'dark' }}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:bg-indigo-500/5 outline-none transition-all cursor-pointer"
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        />
                    </div>

                    {/* Commercial Dynamic Fields based on Gig Model */}
                    {formData.gigType === 'paid_gig' && (
                        <div className="space-y-2 md:col-span-2 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                            <label className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-2">
                                <IndianRupee size={14} /> Artist Payment / Budget (Organizer pays Artist)
                            </label>
                            <input
                                required
                                type="number"
                                placeholder="5000"
                                className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-4 py-3 text-emerald-300 font-bold outline-none focus:border-emerald-400"
                                value={formData.artistPayout}
                                onChange={(e) => setFormData({ ...formData, artistPayout: e.target.value })}
                            />
                            <p className="text-[10px] text-white/50">Artists will see this payout when applying for your gig (e.g. ₹5,000).</p>
                        </div>
                    )}

                    {formData.gigType === 'ticketed' && (
                        <>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-2">
                                    <IndianRupee size={12} /> Audience Ticket Price (₹)
                                </label>
                                <input
                                    required
                                    type="number"
                                    placeholder="500"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-indigo-400 uppercase flex items-center gap-2">
                                    Capacity / Total Audience Seats
                                </label>
                                <input
                                    required
                                    type="number"
                                    placeholder="200"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                                    value={formData.maxSeats}
                                    onChange={(e) => setFormData({ ...formData, maxSeats: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {formData.gigType === 'free' && (
                        <div className="md:col-span-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-between text-xs text-purple-300 font-medium">
                            <span>🎁 Free Gig Registration</span>
                            <span className="font-bold">Entry Fee: ₹0 • Performer Pay: ₹0</span>
                        </div>
                    )}
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2"><MapPin size={12} /> Venue / Location Name</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. Starbucks Bandra, Hard Rock Cafe, BKC Mumbai"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    {/* Interactive Map Location Search & Geocoding Picker */}
                    <div className="md:col-span-2 space-y-3">
                        <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                            <MapPin size={14} className="text-amber-400" /> Interactive Venue Search & Map Picker
                        </label>
                        <LocationPickerMap
                            selectedLat={formData.latitude}
                            selectedLng={formData.longitude}
                            locationName={formData.location}
                            placeholder="Search venue (e.g. Starbucks Bandra Mumbai, Hard Rock Cafe)..."
                            onLocationChange={({ latitude, longitude, location }) => {
                                setFormData(prev => ({
                                    ...prev,
                                    latitude: typeof latitude === 'number' ? latitude.toFixed(6) : latitude,
                                    longitude: typeof longitude === 'number' ? longitude.toFixed(6) : longitude,
                                    location: location || prev.location
                                }));
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                            <Navigation size={12} /> Latitude (Auto-Generated)
                        </label>
                        <input
                            type="text"
                            readOnly
                            placeholder="e.g. 19.0760"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-amber-300 font-mono text-xs outline-none cursor-default"
                            value={formData.latitude}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                            <Navigation size={12} /> Longitude (Auto-Generated)
                        </label>
                        <input
                            type="text"
                            readOnly
                            placeholder="e.g. 72.8777"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-amber-300 font-mono text-xs outline-none cursor-default"
                            value={formData.longitude}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase flex items-center gap-2">
                            <Tag size={12} /> Category
                        </label>
                        <select
                            required
                            className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none transition-all cursor-pointer appearance-none"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="General">General</option>
                            <option value="Music">Music Gig</option>
                            <option value="Dance">Dance Performance</option>
                            <option value="Art">Art Gallery / Painting</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Event Poster</label>
                        <CloudinaryUpload
                            onUploadSuccess={(url) => setFormData({ ...formData, bannerImage: url })}
                            currentImage={formData.bannerImage}
                        />
                    </div>

                    <div className="md:col-span-2 pt-4">
                        <button
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? (isEditing ? "Saving..." : "Publishing...") : (isEditing ? "Save Changes ✏️" : "Launch Event 🚀")}
                        </button>
                    </div>
                </form>
            </Motion.div>
        </div>
    );
};

export default CreateEventModal;
