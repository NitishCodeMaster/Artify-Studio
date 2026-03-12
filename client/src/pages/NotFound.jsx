import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white px-6 relative overflow-hidden">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-600/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 text-center max-w-md">
                <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                    <Compass size={48} className="text-amber-500" />
                </div>

                <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-4">
                    404
                </h1>
                <h2 className="text-2xl font-bold mb-3">Lost in the Woods?</h2>
                <p className="text-white/50 mb-8 leading-relaxed">
                    The artifact, instrument, or page you are looking for doesn't exist or has been moved.
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="flex items-center justify-center gap-2 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-3.5 rounded-xl transition-all"
                >
                    <Home size={18} /> Return to Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;