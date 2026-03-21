import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Discover", path: "/discover" },
    { name: "Events", path: "/events" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Community", path: "/community" },
    { name: "Learn", path: "/learn" },
];

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const { cart, setIsCartOpen } = useCart();

    const isMarket = location.pathname === '/marketplace';

    const theme = {
        glow: isMarket ? "bg-amber-500" : "bg-pink-500",
        logoSquare: isMarket ? "from-amber-500 via-orange-500" : "from-indigo-500 via-purple-500",
        logoText: isMarket ? "from-amber-400 via-orange-400 to-amber-600" : "from-indigo-400 via-purple-400 to-pink-500",
        spotlight: isMarket ? "from-amber-500/80 via-orange-500/20" : "from-indigo-500/80 via-purple-500/20",
        underline: isMarket ? "via-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]" : "via-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]",
        haze: isMarket ? "bg-amber-500/10" : "bg-indigo-500/10",
        btnPrimary: isMarket ? "from-amber-500 to-orange-600 shadow-amber-500/30 hover:shadow-amber-500/50 text-black" : "from-indigo-500 to-purple-600 shadow-indigo-500/30 hover:shadow-indigo-500/50 text-white",
        avatar: isMarket ? "bg-amber-500 text-black" : "bg-indigo-500 text-white",
        cartBadge: isMarket ? "bg-amber-500 text-black" : "bg-indigo-500 text-white",
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUserProfile(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUserProfile(null);
        navigate('/login');
        window.location.reload();
    }

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/10 border-b border-white/5">
            <div className="w-full mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-20">

                    <Link to="/" className="group relative z-50 flex items-center gap-3">
                        <div className="relative w-10 h-10">
                            <div className={`absolute inset-0 ${theme.glow} blur-lg opacity-30 transition-colors duration-500`}></div>
                            <div className="relative w-full h-full bg-black border border-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                                <div className={`absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl ${theme.logoSquare} to-transparent opacity-60 transition-colors duration-500`}></div>
                                <span className="relative z-10 font-black text-xl text-white font-sans">A</span>
                            </div>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className={`text-xl font-bold font-sans tracking-wide text-transparent bg-gradient-to-r ${theme.logoText} bg-clip-text transition-all duration-500 ease-in-out group-hover:tracking-widest`}>
                                ARTIFY
                            </span>
                            <span className="text-[9px] text-gray-500 tracking-[0.2em] uppercase transition-colors duration-300 group-hover:text-white">
                                Studio
                            </span>
                        </div>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link key={link.path} to={link.path} className="relative py-2 group">
                                    <span className={`relative z-10 text-sm font-medium tracking-wide transition-all duration-300 ${isActive ? "text-white text-shadow-glow" : "text-white/40 group-hover:text-white/80"}`}>
                                        {link.name}
                                    </span>
                                    {isActive && (
                                        <>
                                            <motion.div layoutId="nav-spotlight" className={`absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-20 bg-gradient-to-b ${theme.spotlight} to-transparent blur-xl`} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                                            <motion.div layoutId="nav-underline" className={`absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${theme.underline} to-transparent`} transition={{ type: "spring", stiffness: 300, damping: 30 }} />
                                            <motion.div layoutId="nav-haze" className={`absolute inset-0 -z-10 ${theme.haze} blur-md rounded-full`} transition={{ duration: 0.3 }} />
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="hidden md:flex items-center gap-6">
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative text-white/80 hover:text-white transition-colors"
                        >
                            <ShoppingBag size={20} />
                            {cart?.length > 0 && (
                                <span className={`absolute -top-1.5 -right-1.5 ${theme.cartBadge} text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-500`}>
                                    {cart.length}
                                </span>
                            )}
                        </button>

                        {userProfile ? (
                            <div className="flex items-center gap-2 p-1.5 rounded-full bg-black/40 border border-white/10">
                                <div className={`w-8 h-8 rounded-full ${theme.avatar} flex items-center justify-center font-bold text-sm transition-colors duration-500`}>
                                    {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : <User size={14} />}
                                </div>
                                <span className="px-2 text-sm font-semibold text-white/90">
                                    {userProfile.name?.split(' ')[0]}
                                </span>
                                <div className="w-[1px] h-5 bg-white/10 mx-1"></div>
                                <Link to="/dashboard" className="px-3 py-1.5 rounded-full bg-white/5 text-white/80 hover:bg-white/10 text-xs font-bold transition-all">
                                    Dashboard
                                </Link>
                                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 ease-out group">
                                    <LogOut size={14} className="group-hover:scale-110 transition-transform" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className={`px-6 py-2.5 rounded-full text-white/80 hover:text-white border border-white/20 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 ease-out text-sm font-medium ${isMarket ? 'hover:border-amber-400/60' : 'hover:border-indigo-400/60'}`}>
                                    Login
                                </Link>
                                <Link to="/signup" className={`px-6 py-2.5 rounded-full bg-gradient-to-r ${theme.btnPrimary} text-sm font-bold transition-all duration-300 ease-linear hover:scale-[1.02] active:scale-[0.98]`}>
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    <button className="md:hidden text-white p-2" onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#050505] border-b border-white/10 overflow-hidden">
                        <div className="p-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`text-lg font-medium ${location.pathname === link.path ? (isMarket ? 'text-amber-500' : 'text-indigo-400') : 'text-white/60'}`}>
                                    {link.name}
                                </Link>
                            ))}
                            <div className="h-[1px] bg-white/10 my-2"></div>
                            {userProfile ? (
                                <div className="p-4 mt-2 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold flex items-center justify-center gap-2 transition-all">
                                        Dashboard
                                    </Link>
                                    <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 font-bold flex items-center justify-center gap-2 transition-all">
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="py-3 text-center rounded-lg bg-white/5 border border-white/10 text-white font-medium">Login</Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)} className={`py-3 text-center rounded-lg bg-gradient-to-r ${theme.btnPrimary} font-bold`}>Sign Up</Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;