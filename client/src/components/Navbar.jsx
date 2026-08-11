import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, ShoppingBag, Bell, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const navLinks = [
    { name: "Home", path: "/" },
    { name: "Discover", path: "/discover" },
    { name: "Events", path: "/events" },
    { name: "Marketplace", path: "/marketplace" },
    { name: "Community", path: "/community" },
    { name: "Learn", path: "/learn" },
];

const marketRoutes = [
    "/marketplace",
    "/add-product",
    "/product",
    "/dashboard",
    "/wallet",
    "/saved",
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
    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const notifRef = useRef(null);
    const profileRef = useRef(null);
    const lastScrollY = useRef(0);
    const userId = userProfile?._id || userProfile?.id;

    const isMarket = marketRoutes.some((route) => location.pathname.startsWith(route));

    const theme = useMemo(() => ({
        accentText: isMarket ? "text-amber-300" : "text-indigo-300",
        accentBorder: isMarket ? "border-amber-400/30" : "border-indigo-400/30",
        accentSoftBg: isMarket ? "bg-amber-500/10" : "bg-indigo-500/10",
        accentStrongBg: isMarket ? "bg-amber-400" : "bg-indigo-400",
        accentButton: isMarket
            ? "from-amber-400 via-amber-500 to-orange-500 text-black shadow-amber-500/25 hover:shadow-amber-500/40"
            : "from-indigo-400 via-indigo-500 to-violet-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40",
        accentGlow: isMarket ? "from-amber-500/20 to-orange-500/5" : "from-indigo-500/20 to-violet-500/5",
        activeChip: isMarket ? "bg-amber-400/14 text-amber-100" : "bg-indigo-400/14 text-indigo-50",
        avatar: isMarket ? "from-amber-400 to-orange-500 text-black" : "from-indigo-400 to-violet-500 text-white",
        badge: isMarket ? "bg-amber-400 text-black" : "bg-indigo-400 text-white",
        spotlight: isMarket ? "bg-amber-400/70" : "bg-indigo-400/75",
    }), [isMarket]);

    // Fetch persistent notifications from backend API
    const fetchBackendNotifications = async () => {
        if (!userId) return;
        try {
            const res = await api.get('/notifications?limit=15');
            if (res.data?.success) {
                setNotifications(res.data.notifications || []);
                setUnreadCount(res.data.unreadCount || 0);
            }
        } catch (err) {
            console.error("Failed to load notifications:", err);
        }
    };

    useEffect(() => {
        if (!userId) return;

        fetchBackendNotifications();

        let active = true;
        let activeSocket;
        let registerUser;

        const handleNewNotification = (data) => {
            setNotifications((prev) => [data, ...prev.filter(n => n._id !== data._id)]);
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
                if (registerUser) {
                    activeSocket.off("connect", registerUser);
                }
                activeSocket.off("new_notification", handleNewNotification);
            }
        };
    }, [userId]);

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (e) {
            console.error("Mark all read error:", e);
        }
    };

    const handleNotificationClick = async (n) => {
        if (!n.isRead) {
            try {
                await api.put(`/notifications/${n._id}/read`);
                setNotifications(prev => prev.map(item => item._id === n._id ? { ...item, isRead: true } : item));
                setUnreadCount(prev => Math.max(0, prev - 1));
            } catch (e) {
                console.error("Error marking read:", e);
            }
        }
        setShowNotifications(false);
        if (n.link) {
            navigate(n.link);
        } else if (n.eventId) {
            navigate(`/events/${n.eventId}`);
        } else {
            navigate('/events');
        }
    };

    useEffect(() => {
        const loadUser = () => {
            const storedUser = localStorage.getItem('user');
            setUserProfile(storedUser ? JSON.parse(storedUser) : null);
        };

        loadUser();
        window.addEventListener("userChanged", loadUser);

        return () => {
            window.removeEventListener("userChanged", loadUser);
        };
    }, []);

    useEffect(() => {
        setIsOpen(false);
        setIsDropdownOpen(false);
        setShowNotifications(false);
        setIsVisible(true);
        setIsScrolled(false);
        lastScrollY.current = 0;
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollingUp = currentScrollY < lastScrollY.current;

            setIsScrolled(currentScrollY > 24);

            if (currentScrollY <= 24) {
                setIsVisible(true);
            } else if (scrollingUp) {
                setIsVisible(true);
            } else if (currentScrollY - lastScrollY.current > 6) {
                setIsVisible(false);
                setIsDropdownOpen(false);
                setShowNotifications(false);
                setIsOpen(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
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

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setUserProfile(null);
        navigate('/login');
    };

    const iconButtonClass = "relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white";

    return (
        <nav className={`sticky top-0 z-50 px-0 transition-transform duration-500 ease-out ${isVisible ? "translate-y-0" : "-translate-y-[120%]"}`}>
            <div className="mx-auto max-w-none">
                <div className={`relative overflow-visible rounded-b-[28px] border-x-0 border-t-0 border-b border-white/10 backdrop-blur-2xl transition-all duration-300 ${isScrolled
                    ? "bg-[rgba(7,7,10,0.92)] shadow-[0_18px_70px_rgba(0,0,0,0.42)]"
                    : "bg-[rgba(7,7,10,0.82)] shadow-[0_14px_50px_rgba(0,0,0,0.32)]"
                    }`}>
                    <div className={`pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent ${theme.accentGlow} via-white/35 to-transparent`} />

                    <div className="flex h-[68px] items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link to="/" className="group flex items-center gap-3">
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

                        <div className="hidden items-center gap-2 lg:flex">
                            {navLinks.map((link) => {
                                const isActive = location.pathname === link.path;

                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative rounded-xl px-3.5 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${isActive ? theme.activeChip : "text-white/55 hover:bg-white/[0.05] hover:text-white"}`}
                                    >
                                        <span className="relative z-10">{link.name}</span>
                                        {isActive && (
                                            <>
                                                <motion.span
                                                    layoutId="nav-pill"
                                                    className="absolute inset-0 rounded-2xl border border-white/10 bg-white/[0.04]"
                                                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                                                />
                                                <motion.span
                                                    layoutId="nav-dot"
                                                    className={`absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${theme.spotlight}`}
                                                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                                                />
                                            </>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="hidden items-center gap-3 md:flex">
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => setShowNotifications((prev) => !prev)}
                                    className={iconButtonClass}
                                >
                                    <Bell size={18} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                            className="absolute right-0 top-14 w-[340px] max-w-[90vw] overflow-hidden rounded-3xl border border-white/15 bg-[#0b0b14]/98 shadow-2xl backdrop-blur-2xl z-[200]"
                                        >
                                            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 bg-white/[0.02]">
                                                <div>
                                                    <p className="text-sm font-extrabold text-white flex items-center gap-1.5">
                                                        Notifications
                                                        {unreadCount > 0 && (
                                                            <span className="text-[10px] font-bold bg-amber-500 text-black px-1.5 py-0.2 rounded-full">
                                                                {unreadCount}
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-[10px] text-white/40">Gigs, applications & payment updates</p>
                                                </div>
                                                {unreadCount > 0 && (
                                                    <button
                                                        onClick={handleMarkAllRead}
                                                        className="text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider cursor-pointer"
                                                    >
                                                        Mark all read
                                                    </button>
                                                )}
                                            </div>

                                            <div className="max-h-[340px] overflow-y-auto custom-scrollbar divide-y divide-white/5">
                                                {notifications.length === 0 ? (
                                                    <div className="p-8 text-center space-y-2">
                                                        <p className="text-sm font-semibold text-white/60">You're all caught up! 🔔</p>
                                                        <p className="text-xs text-white/40">New updates about gigs, selections & payments will appear here.</p>
                                                    </div>
                                                ) : (
                                                    notifications.map((n, index) => (
                                                        <div
                                                            key={n._id || index}
                                                            onClick={() => handleNotificationClick(n)}
                                                            className={`p-3.5 text-left transition-all cursor-pointer group flex items-start gap-3 ${!n.isRead ? 'bg-amber-500/10 hover:bg-amber-500/15' : 'hover:bg-white/[0.04]'}`}
                                                        >
                                                            <span className="text-base shrink-0 pt-0.5">
                                                                {n.type === 'selection' || n.type === 'gig' ? '🎤' : n.type === 'application' ? '📩' : n.type === 'payment' ? '💰' : n.type === 'ticket' ? '🎟️' : '🔔'}
                                                            </span>
                                                            <div className="min-w-0 flex-1 space-y-0.5">
                                                                <div className="flex items-center justify-between gap-1">
                                                                    <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                                                        {n.title}
                                                                    </p>
                                                                    {!n.isRead && (
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
                                                                    )}
                                                                </div>
                                                                <p className="text-[11px] text-white/60 leading-tight line-clamp-2">
                                                                    {n.message}
                                                                </p>
                                                                <span className="text-[9px] text-white/40 block font-medium pt-0.5">
                                                                    {n.createdAt ? new Date(n.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>

                                            <div className="border-t border-white/10 p-2.5 bg-white/[0.02] text-center">
                                                <button
                                                    onClick={() => {
                                                        setShowNotifications(false);
                                                        navigate('/notifications');
                                                    }}
                                                    className="w-full py-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                                >
                                                    View All Notifications ➔
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className={iconButtonClass}
                            >
                                <ShoppingBag size={18} />
                                {cart?.length > 0 && (
                                    <span className={`absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-bold ${theme.badge}`}>
                                        {cart.length}
                                    </span>
                                )}
                            </button>

                            {userProfile ? (
                                <div className="relative" ref={profileRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                                        className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] py-1.5 pl-1.5 pr-3 text-left transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
                                    >
                                        <div className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${theme.avatar} font-bold shadow-lg`}>
                                            {userProfile.profilePic ? (
                                                <img src={userProfile.profilePic} alt={userProfile.name} className="h-full w-full object-cover" />
                                            ) : userProfile.name ? (
                                                userProfile.name.charAt(0).toUpperCase()
                                            ) : (
                                                <User size={14} />
                                            )}
                                        </div>

                                        <div className="hidden min-w-0 sm:block">
                                            <p className="truncate text-sm font-semibold text-white">
                                                {userProfile.name?.split(' ')[0] || "Artist"}
                                            </p>
                                                    <p className="text-[11px] text-white/40">Manage account</p>
                                        </div>

                                        <ChevronDown size={16} className={`text-white/40 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                                className="absolute right-0 top-14 w-56 overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0f]/95 py-2 shadow-2xl backdrop-blur-2xl"
                                            >
                                                <Link to="/my-profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/[0.05] hover:text-white">
                                                    My Profile
                                                </Link>
                                                <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/[0.05] hover:text-white">
                                                    Dashboard
                                                </Link>
                                                <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className={`block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/[0.05] ${theme.accentText}`}>
                                                    Settings
                                                </Link>
                                                <div className="my-2 border-t border-white/10" />
                                                <button
                                                    onClick={() => {
                                                        handleLogout();
                                                        setIsDropdownOpen(false);
                                                    }}
                                                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-400 transition-colors hover:bg-white/[0.05]"
                                                >
                                                    <LogOut size={14} /> Logout
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login" className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/75 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white">
                                        Login
                                    </Link>
                                    <Link to="/signup" className={`rounded-2xl bg-gradient-to-r px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] ${theme.accentButton}`}>
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>

                        <button
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-colors lg:hidden"
                            onClick={() => setIsOpen((prev) => !prev)}
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="max-h-[calc(100vh-80px)] overflow-y-auto border-t border-white/10 lg:hidden"
                            >
                                <div className="space-y-5 px-4 pb-5 pt-3">
                                    <div className="grid gap-2">
                                        {navLinks.map((link) => {
                                            const isActive = location.pathname === link.path;

                                            return (
                                                <Link
                                                    key={link.path}
                                                    to={link.path}
                                                    onClick={() => setIsOpen(false)}
                                                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${isActive
                                                        ? `border-white/10 ${theme.activeChip}`
                                                        : "border-white/5 bg-white/[0.03] text-white/70 hover:bg-white/[0.06] hover:text-white"
                                                        }`}
                                                >
                                                    {link.name}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => {
                                                setIsCartOpen(true);
                                                setIsOpen(false);
                                            }}
                                            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/80"
                                        >
                                            <ShoppingBag size={16} />
                                            Cart {cart?.length > 0 ? `(${cart.length})` : ""}
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowNotifications(false);
                                                setUnreadCount(0);
                                                navigate("/events");
                                            }}
                                            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white/80"
                                        >
                                            <Bell size={16} />
                                            Alerts
                                        </button>
                                    </div>

                                    {userProfile ? (
                                        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
                                            <div className="mb-4 flex items-center gap-3">
                                                <div className={`flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${theme.avatar} font-bold`}>
                                                    {userProfile.profilePic ? (
                                                        <img src={userProfile.profilePic} alt={userProfile.name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        userProfile.name?.charAt(0).toUpperCase() || <User size={14} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-white">{userProfile.name}</p>
                                                    <p className="text-xs text-white/40">Signed in</p>
                                                </div>
                                            </div>

                                            <div className="grid gap-2">
                                                <Link to="/my-profile" onClick={() => setIsOpen(false)} className="rounded-2xl px-4 py-3 text-sm text-white/75 transition-colors hover:bg-white/[0.05] hover:text-white">
                                                    My Profile
                                                </Link>
                                                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="rounded-2xl px-4 py-3 text-sm text-white/75 transition-colors hover:bg-white/[0.05] hover:text-white">
                                                    Dashboard
                                                </Link>
                                                <Link to="/settings" onClick={() => setIsOpen(false)} className={`rounded-2xl px-4 py-3 text-sm font-medium ${theme.accentSoftBg} ${theme.accentText}`}>
                                                    Settings
                                                </Link>
                                                <button onClick={handleLogout} className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-white/[0.05]">
                                                    <LogOut size={16} /> Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link to="/login" onClick={() => setIsOpen(false)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm font-medium text-white/80">
                                                Login
                                            </Link>
                                            <Link to="/signup" onClick={() => setIsOpen(false)} className={`rounded-2xl bg-gradient-to-r px-4 py-3 text-center text-sm font-semibold ${theme.accentButton}`}>
                                                Sign Up
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
