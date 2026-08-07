import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, QrCode, Search, CheckCircle2, AlertTriangle, ShieldCheck, User, Clock, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const TicketScannerModal = ({ isOpen, onClose, eventId, eventTitle }) => {
    const [ticketCodeInput, setTicketCodeInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const videoRef = useRef(null);

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraActive(false);
    };

    // Stop camera stream when unmounting
    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    if (!isOpen) return null;

    const startCamera = async () => {
        try {
            setIsCameraActive(true);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            toast.success("Camera Gate Scanner Active 📷");
        } catch (error) {
            console.error("Camera access error:", error);
            setIsCameraActive(false);
            toast.error("Camera permission denied. Use Manual Code Entry below.");
        }
    };

    const handleVerifyTicket = async (codeToVerify) => {
        const code = codeToVerify || ticketCodeInput;
        if (!code.trim()) {
            toast.error("Please enter or scan a Ticket Code.");
            return;
        }

        try {
            setLoading(true);
            setScanResult(null);

            const res = await api.post('/events/verify-ticket', {
                ticketCode: code.trim(),
                eventId
            });

            if (res.data.success) {
                setScanResult({
                    status: 'granted',
                    message: res.data.message,
                    attendee: res.data.attendee,
                    ticket: res.data.ticket,
                    event: res.data.event
                });
                toast.success("🎉 ENTRY GRANTED!", { duration: 3000 });
            }
        } catch (error) {
            console.error("Ticket verify error:", error);
            const errData = error.response?.data;
            if (errData?.alreadyCheckedIn) {
                setScanResult({
                    status: 'already_used',
                    message: errData.message,
                    ticket: errData.ticket,
                    eventTitle: errData.eventTitle
                });
                toast.error("⚠️ ALREADY CHECKED IN!");
            } else {
                setScanResult({
                    status: 'invalid',
                    message: errData?.message || "Invalid ticket code or pass not found."
                });
                toast.error("❌ INVALID TICKET PASS!");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetScanner = () => {
        setScanResult(null);
        setTicketCodeInput('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-lg bg-[#0a0a0f] border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[90px] pointer-events-none"></div>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
                    <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                            <Camera size={20} />
                        </span>
                        <div>
                            <h3 className="text-base font-black text-white">Organizer Gate Scanner</h3>
                            <p className="text-[11px] text-cyan-300 font-bold">Verifying for: {eventTitle || 'Live Event'}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            stopCamera();
                            onClose();
                        }}
                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Main Scanner Section */}
                <div className="space-y-5 relative z-10">
                    {/* Camera Feed / Controls */}
                    <div className="relative h-48 w-full rounded-2xl bg-black border-2 border-white/15 overflow-hidden flex flex-col items-center justify-center">
                        {isCameraActive ? (
                            <>
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                <div className="absolute inset-0 border-2 border-cyan-400/60 rounded-2xl pointer-events-none animate-pulse"></div>
                                <div className="absolute bottom-2 px-3 py-1 bg-black/80 rounded-full text-[10px] text-cyan-300 font-bold border border-cyan-500/40">
                                    📸 Point camera at attendee's QR Code
                                </div>
                            </>
                        ) : (
                            <div className="text-center p-6 space-y-2">
                                <QrCode size={36} className="mx-auto text-cyan-400/60" />
                                <p className="text-xs text-white/50">Camera Gate Scanner is standby</p>
                                <button
                                    onClick={startCamera}
                                    className="px-4 py-2 bg-cyan-500 text-black font-extrabold text-xs rounded-xl hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
                                >
                                    Activate Camera Scanner
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Manual Code Input Form */}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-white/60 uppercase tracking-wider">
                            Manual Ticket Pass Search Code
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Enter Ticket Code (e.g. ART-EVT-89A4B2)"
                                    value={ticketCodeInput}
                                    onChange={(e) => setTicketCodeInput(e.target.value.toUpperCase())}
                                    onKeyDown={(e) => e.key === 'Enter' && handleVerifyTicket()}
                                    className="w-full bg-black/60 border border-white/15 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white font-mono placeholder-white/40 focus:border-cyan-500 focus:outline-none"
                                />
                                <Search size={15} className="absolute left-3 top-3 text-cyan-400" />
                            </div>

                            <button
                                onClick={() => handleVerifyTicket()}
                                disabled={loading}
                                className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-1.5 shrink-0"
                            >
                                {loading ? <Loader2 className="animate-spin" size={16} /> : 'Verify Pass'}
                            </button>
                        </div>
                    </div>

                    {/* Result Cards Display */}
                    {scanResult && (
                        <div className="pt-2">
                            {scanResult.status === 'granted' && (
                                <div className="p-5 rounded-2xl bg-emerald-950/60 border-2 border-emerald-500 text-white space-y-3 shadow-xl animate-pulse">
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-full bg-emerald-500 text-black font-black text-xs flex items-center gap-1 uppercase">
                                            <CheckCircle2 size={14} /> ENTRY GRANTED
                                        </span>
                                        <span className="text-[10px] font-mono text-emerald-300">Code: #{scanResult.ticket?.ticketCode}</span>
                                    </div>

                                    <div className="flex items-center gap-3 pt-1">
                                        <div className="w-12 h-12 rounded-xl bg-black border border-emerald-500/50 overflow-hidden flex items-center justify-center font-bold text-xl text-emerald-400">
                                            {scanResult.attendee?.name?.charAt(0) || 'G'}
                                        </div>
                                        <div>
                                            <h4 className="font-extrabold text-base text-white">{scanResult.attendee?.name || 'Verified Attendee'}</h4>
                                            <p className="text-xs text-emerald-200/80">{scanResult.attendee?.email}</p>
                                        </div>
                                    </div>

                                    <div className="text-[11px] text-emerald-300 font-medium border-t border-emerald-500/30 pt-2 flex items-center justify-between">
                                        <span>Status: Validated for Entry</span>
                                        <button onClick={handleResetScanner} className="text-white hover:underline flex items-center gap-1">
                                            <RefreshCw size={12} /> Scan Next Pass
                                        </button>
                                    </div>
                                </div>
                            )}

                            {scanResult.status === 'already_used' && (
                                <div className="p-5 rounded-2xl bg-red-950/70 border-2 border-red-500 text-white space-y-3 shadow-xl">
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-full bg-red-500 text-white font-black text-xs flex items-center gap-1 uppercase">
                                            <AlertTriangle size={14} /> TICKET ALREADY USED
                                        </span>
                                        <span className="text-[10px] font-mono text-red-300">Duplicate Entry Blocked</span>
                                    </div>

                                    <p className="text-xs text-red-200 font-medium leading-relaxed">
                                        {scanResult.message}
                                    </p>

                                    <div className="pt-2 border-t border-red-500/30 flex justify-end">
                                        <button onClick={handleResetScanner} className="text-xs font-bold text-white bg-red-500/30 hover:bg-red-500/50 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                            <RefreshCw size={12} /> Try Another Pass
                                        </button>
                                    </div>
                                </div>
                            )}

                            {scanResult.status === 'invalid' && (
                                <div className="p-5 rounded-2xl bg-zinc-900 border-2 border-red-500/50 text-white space-y-2">
                                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                                        <X size={18} /> <span>Invalid Ticket Pass</span>
                                    </div>
                                    <p className="text-xs text-white/50">{scanResult.message}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketScannerModal;
