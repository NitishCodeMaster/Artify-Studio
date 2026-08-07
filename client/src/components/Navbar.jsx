import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, ShoppingBag, Bell, ChevronDown, Home, Compass, Calendar, Store, MessageSquare, BookOpen, Wallet, History, ShieldCheck, Settings, LayoutDashboard, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const navLinks = [
    { name: "Home", path: "/", icon: Home },
    { name: "Discover", path: "/discover", icon: Compass },
    { name: "Events", path: "/events", icon: Calendar },
    { name: "Marketplace", path: "/marketplace", icon: Store },
    { name: "Community", path: "/community", icon: MessageSquare },
    { name: "Learn", path: "/learn", icon: BookOpen },
];

const marketRoutes = [
    "/marketplace",
    "/add-product",
    "/product",
    "/dashboard",
    "/wallet",
    "/saved",
    "/trade-history"
];

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userProfile, setUserProfile] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const { cart, setIsCartOpen } = useCart();
    const { logout } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [isScrolled, setIsScrolled] = useState(false);

    const notifRef = useRef(null);
    const profileRef = useRef(null);
    const userId = userProfile?._id || userProfile?.id;

    const isMarket = marketRoutes.some((route) => location.pathname.startsWith(route));

    // Dynamic Color Palette
    const theme = useMemo(() => ({
        accentText: isMarket ? "text-amber-300" : "text-indigo-300",
        accentBorder: isMarket ? "border-amber-400/40" : "border-indigo-400/40",
        accentSoftBg: isMarket ? "bg-amber-500/10" : "bg-indigo-500/10",
        accentButton: isMarket
            ? "from-amber-400 via-amber-500 to-orange-500 text-black shadow-amber-500/30 hover:shadow-amber-500/50"
            : "from-indigo-400 via-indigo-500 to-violet-500 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50",
        pillBg: isMarket
            ? "bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-amber-500/20 border-amber-500/40 shadow-amber-500/20"
            : "bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-indigo-500/20 border-indigo-500/40 shadow-indigo-500/20",
        barGlow: isMarket
            ? "bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400 shadow-amber-400/80"
            : "bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 shadow-indigo-400/80",
    }), [isMarket]);

    useEffect(() => {
        if (!userId) return;

        let active = true;
        let activeSocket;
        let registerUser;

        const handleNewNotification = (data) => {
            setNotifications((prev) => {
                const updated = [data, ...prev];
                localStorage.setItem("notifications", JSON.stringify(updated));
                return updated;
            });
            setUnreadCount((prev) => prev + 1);
        };

        import("../socket").then(({ socket }) => {
            if (!active) return;
            activeSocket = socket;
            registerUser = () => socket.emit("register_user", userId);

            socket.connect();
            socket.on("connect", registerUser);
            socket.on("new_notification", handleNewNotification);

            if (socket.connected) {
                registerUser();
            }
        });

        return () => {
            active = false;
            if (activeSocket) {
                if (registerUser) activeSocket.off("connect", registerUser);
                activeSocket.off("new_notification", handleNewNotification);
            }
        };
    }, [userId]);

    useEffect(() => {
        const stored = localStorage.getItem("notifications");
        if (stored) {
            try { setNotifications(JSON.parse(stored)); } catch {}
        }
    }, []);

    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem('user');
            setUserProfile(storedUser ? JSON.parse(storedUser) : null);
        };
        loadUser();
        window.addEventListener("userChanged", loadUser);
        return () => window.removeEventListener("userChanged", loadUser);
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setIsDropdownOpen(false);
        setShowNotifications(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setUserProfile(null);
        navigate('/login');
        toast.success("Logged out safely 👋");
    };

    const cartCount = cart?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

    return (
        <nav className="sticky top-0 z-50 transition-all duration-300">
            <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-3">
                <div className={`relative rounded-3xl border border-white/15 backdrop-blur-2xl transition-all duration-300 ${
                    isScrolled
                        ? "bg-black/90 shadow-[0_20px_80px_rgba(0,0,0,0.6)] border-white/20"
                        : "bg-[#09090e]/85 shadow-[0_15px_60px_rgba(0,0,0,0.4)]"
                }`}>

                    <div className="flex h-[72px] items-center justify-between px-4 sm:px-6">

                        {/* Brand Logo & Tag */}
                        <Link to="/" className="group flex items-center gap-3 shrink-0">
                            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-inner shadow-black/30">
                                <div className={`absolute inset-[1px] rounded-[14px] bg-gradient-to-br ${theme.accentGlow}`} />
                                <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-white/10 blur-md" />
                                <span className="relative z-10 text-base font-black tracking-wide text-white">A</span>
                            </div>

                            <div className="leading-none">
                                <div className="flex items-center gap-2">
                                    <span className="text-base font-black tracking-[0.24em] text-white transition-all duration-300 group-hover:tracking-[0.3em]">
                                        ARTIFY
                                    </span>
                                    <span className={`hidden rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] sm:inline-flex ${theme.accentBorder} ${theme.accentText} ${theme.accentSoftBg}`}>
                                        Studio
                                    </span>
                                </div>
                                <p className="mt-1 text-[9px] uppercase tracking-[0.32em] text-white/35">
                                    Creative Network
                                </p>
                            </div>
                        </Link>

                        {/* Desktop Navigation Links with Clean Professional Active Indicator */}
                        <div className="hidden lg:flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/10">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative px-4 py-2 text-xs font-bold tracking-wide transition-all duration-200 flex items-center gap-2 rounded-xl ${
                                            isActive
                                                ? "text-white font-extrabold bg-white/10 border border-white/15 shadow-sm"
                                                : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
                                        }`}
                                    >
                                        <Icon size={14} className={isActive ? (isMarket ? "text-amber-400 font-bold" : "text-indigo-400 font-bold") : "text-white/40"} />
                                        <span className="relative z-10">{link.name}</span>

                                        {/* Clean Animated Bottom Accent Underline */}
                                        {isActive && (
                                            <motion.span
                                                layoutId="active-tab-bar"
                                                className={`absolute -bottom-1 left-3 right-3 h-[2px] rounded-full ${
                                                    isMarket
                                                        ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-md shadow-amber-500/50"
                                                        : "bg-gradient-to-r from-indigo-400 to-purple-500 shadow-md shadow-indigo-500/50"
                                                }`}
                                                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Right Actions: Cart, Messages, Notifications, Profile Dropdown */}
                        <div className="flex items-center gap-2.5">
                            {/* Messages Shortcut */}
                            {userProfile && (
                                <Link
                                    to="/messages"
                                    className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all relative"
                                    title="Messages"
                                >
                                    <MessageSquare size={18} />
                                </Link>
                            )}

                            {/* Marketplace Cart Button */}
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-amber-400 hover:bg-white/10 hover:border-amber-500/30 transition-all relative"
                                title="Cart"
                            >
                                <ShoppingBag size={18} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 bg-amber-400 text-black text-[10px] font-black rounded-full shadow-lg shadow-amber-400/50 animate-bounce">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Popup Dropdown */}
                            {userProfile && (
                                <div className="relative" ref={notifRef}>
                                    <button
                                        onClick={() => setShowNotifications(!showNotifications)}
                                        className="p-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all relative"
                                    >
                                        <Bell size={18} />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {showNotifications && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 top-14 w-80 bg-[#0d0d14] border border-white/15 rounded-3xl p-4 shadow-2xl z-50 backdrop-blur-2xl space-y-3"
                                            >
                                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">Notifications</h4>
                                                    {unreadCount > 0 && (
                                                        <button onClick={() => setUnreadCount(0)} className="text-[10px] text-amber-400 hover:underline font-bold">
                                                            Clear
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
                                                    {notifications.length === 0 ? (
                                                        <p className="text-xs text-white/40 text-center py-6">No notifications yet.</p>
                                                    ) : (
                                                        notifications.map((n, i) => (
                                                            <div key={i} className="p-3 bg-white/5 rounded-xl text-xs text-white/80 border border-white/5">
                                                                <p className="font-bold text-amber-300">{n.title || 'Notification'}</p>
                                                                <p className="text-white/60 text-[11px] mt-0.5">{n.message || n.text}</p>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* User Profile Dropdown / Login Button */}
                            {userProfile ? (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 p-1.5 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-all"
                                    >
                                        {userProfile.profilePic ? (
                                            <img src={userProfile.profilePic} alt={userProfile.name} className="w-8 h-8 rounded-xl object-cover border border-amber-500/40" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-black font-black text-xs">
                                                {userProfile.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        )}
                                        <ChevronDown size={14} className="text-white/60" />
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 top-14 w-60 bg-[#0d0d14] border border-white/15 rounded-3xl p-3 shadow-2xl z-50 space-y-1 backdrop-blur-2xl"
                                            >
                                                {/* User Info Header */}
                                                <div className="p-3 border-b border-white/10 mb-1">
                                                    <p className="text-xs font-extrabold text-white truncate">{userProfile.name}</p>
                                                    <p className="text-[10px] text-amber-400 font-bold uppercase">{userProfile.role || 'Artify Creator'}</p>
                                                </div>

                                                <Link to="/my-profile" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                                    <User size={15} className="text-amber-400" /> My Profile
                                                </Link>

                                                <Link to="/trade-history" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                                    <History size={15} className="text-green-400" /> Trade & Sales History
                                                </Link>

                                                <Link to="/dashboard" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                                    <LayoutDashboard size={15} className="text-indigo-400" /> Collector Dashboard
                                                </Link>

                                                <Link to="/wallet" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                                    <Wallet size={15} className="text-amber-400" /> Wallet Balance
                                                </Link>

                                                <Link to="/settings" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                                                    <Settings size={15} className="text-white/60" /> Account Settings
                                                </Link>

                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all border-t border-white/10 mt-1 pt-2"
                                                >
                                                    <LogOut size={15} /> Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className={`px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r ${theme.accentButton} transition-all shadow-lg active:scale-95`}
                                >
                                    Sign In
                                </Link>
                            )}

                            {/* Mobile Hamburger Menu Toggle */}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="lg:hidden p-2.5 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white"
                            >
                                {isOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation Drawer */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="lg:hidden border-t border-white/10 p-4 space-y-2 bg-[#09090e] rounded-b-3xl overflow-hidden"
                            >
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = location.pathname === link.path;

                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                                                isActive
                                                    ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20 font-black"
                                                    : "text-white/70 hover:bg-white/5 hover:text-white"
                                            }`}
                                        >
                                            <Icon size={16} />
                                            <span>{link.name}</span>
                                        </Link>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;
