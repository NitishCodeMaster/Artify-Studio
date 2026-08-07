import React, { useState, useEffect, useRef } from 'react';
import { X, QrCode, Calendar, MapPin, CheckCircle2, ShieldCheck, Download, Printer, User, Clock, Sparkles, Loader2, Share2 } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const EventTicketModal = ({ isOpen, onClose, eventId, eventData }) => {
    const [loading, setLoading] = useState(true);
    const [ticketDetails, setTicketDetails] = useState(null);
    const passRef = useRef(null);

    useEffect(() => {
        if (!isOpen || !eventId) return;

        const fetchTicket = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/events/${eventId}/my-ticket`);
                if (res.data.success) {
                    setTicketDetails(res.data);
                }
            } catch (error) {
                console.error("Fetch ticket pass error:", error);
                toast.error("Could not fetch ticket pass.");
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, [isOpen, eventId]);

    if (!isOpen) return null;

    const event = ticketDetails?.event || eventData || {};
    const ticket = ticketDetails?.ticket || {};
    const attendee = ticketDetails?.attendee || {};

    const ticketCode = ticket.ticketCode || 'ART-EVT-PASS';
    const isCheckedIn = ticket.status === 'checked_in';

    // Generate QR payload string containing ticket token & code
    const qrDataPayload = JSON.stringify({
        code: ticketCode,
        token: ticket.qrToken || 'token',
        eventId: event._id || eventId,
        attendee: attendee.name || 'Attendee'
    });

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrDataPayload)}&color=000000&bgcolor=ffffff`;

    const handlePrintPass = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-md bg-[#0a0a0f] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[90px] pointer-events-none"></div>

                {/* Close Button */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            <QrCode size={20} />
                        </span>
                        <div>
                            <h3 className="text-base font-black text-white">Digital VIP Gate Pass</h3>
                            <p className="text-[11px] text-white/50">Official Scannable Event Pass</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                        <Loader2 className="animate-spin text-amber-500" size={36} />
                        <p className="text-xs text-white/40 font-medium">Generating your official QR Pass...</p>
                    </div>
                ) : (
                    <div ref={passRef} className="space-y-6 relative z-10">
                        {/* Status Banner */}
                        <div className={`p-3 rounded-2xl border text-center flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider ${
                            isCheckedIn
                                ? 'bg-red-500/10 border-red-500/30 text-red-400'
                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}>
                            {isCheckedIn ? (
                                <>
                                    <Clock size={16} className="text-red-400 animate-pulse" />
                                    <span>Checked In on {new Date(ticket.checkedInAt).toLocaleTimeString('en-IN')}</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 size={16} className="text-emerald-400" />
                                    <span>🟢 Valid Pass — Ready for Gate Entry</span>
                                </>
                            )}
                        </div>

                        {/* Ticket Card Container */}
                        <div className="bg-gradient-to-b from-[#14141d] to-[#0d0d14] border border-white/15 rounded-2xl p-5 space-y-5 shadow-2xl relative overflow-hidden">
                            {/* Top Badge & Title */}
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase border border-amber-500/30">
                                        {event.category || 'Event Pass'}
                                    </span>
                                    <span className="text-[11px] font-mono text-white/40 font-bold">
                                        #{ticketCode}
                                    </span>
                                </div>
                                <h4 className="text-lg font-black text-white leading-snug line-clamp-1">
                                    {event.title || 'Live Artify Event'}
                                </h4>
                            </div>

                            {/* Center High-Res Scannable QR Code */}
                            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl border-4 border-amber-500/40 shadow-inner">
                                <img
                                    src={qrImageUrl}
                                    alt="Event Ticket QR Code"
                                    className="w-48 h-48 object-contain"
                                />
                                <div className="mt-2 text-[11px] font-mono font-bold text-black uppercase tracking-widest">
                                    {ticketCode}
                                </div>
                            </div>

                            {/* Event Metadata: Date, Location, Attendee */}
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Attendee</span>
                                    <span className="font-bold text-white truncate block">{attendee.name || 'Registered Guest'}</span>
                                </div>

                                <div>
                                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Date & Time</span>
                                    <span className="font-bold text-white truncate block">
                                        {event.date ? new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Today'} • {event.time || '7:00 PM'}
                                    </span>
                                </div>

                                <div className="col-span-2">
                                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider block">Venue Location</span>
                                    <span className="font-bold text-amber-300 truncate block">📍 {event.location || 'Chandigarh Venue'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Security Note & Print Action */}
                        <div className="flex items-center justify-between gap-3 pt-2">
                            <div className="text-[10px] text-white/40 flex items-center gap-1.5">
                                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                                <span>Present this QR Code to the organizer gatekeeper upon arrival.</span>
                            </div>

                            <button
                                onClick={handlePrintPass}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border border-white/15 shrink-0"
                            >
                                <Printer size={14} /> Print / Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventTicketModal;
