import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowUpRight, QrCode } from 'lucide-react';
import { calculateDistanceKm, getEventCoords, formatDistanceText } from '../../utils/geo';

const TicketCard = ({ event, onOpenDetails, userLocation = null }) => {
    const [computedDistance, setComputedDistance] = useState(event.distanceKm || null);

    useEffect(() => {
        if (event.distanceKm !== undefined && event.distanceKm !== null) {
            setComputedDistance(event.distanceKm);
            return;
        }

        if (userLocation && userLocation.lat && userLocation.lng) {
            const [eLat, eLng] = getEventCoords(event);
            const dist = calculateDistanceKm(userLocation.lat, userLocation.lng, eLat, eLng);
            setComputedDistance(dist);
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const [eLat, eLng] = getEventCoords(event);
                    const dist = calculateDistanceKm(pos.coords.latitude, pos.coords.longitude, eLat, eLng);
                    setComputedDistance(dist);
                },
                () => {}
            );
        }
    }, [event, userLocation]);

    const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const isPaidArtistGig = event.gigType === 'paid_gig' || (Number(event.artistPayout) > 0 && Number(event.price) === 0);

    return (
        <motion.div
            whileHover={{ y: -4 }}
            onClick={() => onOpenDetails(event)}
            className="group relative bg-[#0a0a0f] border border-white/10 hover:border-indigo-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer flex flex-col h-full"
        >
            {/* Event Banner Image */}
            <div className="relative h-44 w-full overflow-hidden bg-black">
                <img
                    src={event.bannerImage || 'https://via.placeholder.com/400x200'}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-transparent"></div>

                {/* Category & Payout Tag */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-extrabold uppercase text-white border border-white/15">
                        {event.category || 'Event'}
                    </span>
                    {event.artistPayout > 0 && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-black text-[10px] font-black uppercase shadow-md">
                            ₹{event.artistPayout} Payout
                        </span>
                    )}
                </div>

                {/* Price / Entry Badge */}
                <div className="absolute bottom-3 right-3">
                    {isPaidArtistGig ? (
                        <span className="px-3 py-1 rounded-xl bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-black border border-emerald-500/40">
                            ⭐ Performer Gig
                        </span>
                    ) : event.price > 0 ? (
                        <span className="px-3 py-1 rounded-xl bg-indigo-600 backdrop-blur-md text-white text-xs font-black shadow-lg">
                            ₹{event.price} Ticket
                        </span>
                    ) : (
                        <span className="px-3 py-1 rounded-xl bg-purple-500/30 backdrop-blur-md text-purple-200 text-xs font-black border border-purple-500/40">
                            🎁 Free Entry
                        </span>
                    )}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-4 flex flex-col justify-between flex-1 space-y-3">
                <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-white leading-snug line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {event.title}
                    </h3>
                    <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                        {event.description || "Join this live performance on Artify."}
                    </p>
                </div>

                <div className="pt-3 border-t border-white/5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-white/60">
                        <span className="flex items-center gap-1.5 font-medium">
                            <Calendar size={12} className="text-indigo-400" /> {formattedDate}
                        </span>
                        <div className="flex items-center gap-2">
                            {!isPaidArtistGig && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                                    <QrCode size={11} /> Pass
                                </span>
                            )}
                            <span className="flex items-center gap-1 font-semibold text-indigo-400 group-hover:text-white transition-colors">
                                View <ArrowUpRight size={12} />
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/40 gap-2">
                        <div className="flex items-center gap-1.5 truncate max-w-[60%]">
                            <MapPin size={12} className="shrink-0 text-indigo-400" />
                            <span className="truncate">{event.location}</span>
                        </div>
                        {computedDistance !== null && (
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 shrink-0">
                                📍 {formatDistanceText(computedDistance)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default TicketCard;