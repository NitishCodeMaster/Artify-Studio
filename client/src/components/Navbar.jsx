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

    useEffect(() => {
        if (!userId) {
            return;
        }

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
            if (!active) {
                return;
            }

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

    useEffect(() => {
        const stored = localStorage.getItem("notifications");
        if (stored) {
            setNotifications(JSON.parse(stored));
        }
    }, []);

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
                                            className="absolute right-0 top-14 w-[320px] overflow-hidden rounded-3xl border border-white/10 bg-[#0b0b0f]/95 shadow-2xl backdrop-blur-2xl"
                                        >
                                            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-white">Notifications</p>
                                                    <p className="text-xs text-white/40">Latest artist and event updates</p>
                                                </div>
                                                {notifications.length > 0 && (
                                                    <button
                                                        onClick={() => setUnreadCount(0)}
                                                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${theme.accentSoftBg} ${theme.accentText}`}
                                                    >
                                                        Clear badge
                                                    </button>
                                                )}
                                            </div>

                                            <div className="max-h-[360px] overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <p className="px-4 py-8 text-center text-sm text-white/45">No notifications yet.</p>
                                                ) : (
                                                    notifications.map((n, index) => (
                                                        <button
                                                            key={index}
                                                            onClick={async () => {
                                                                if (!n.eventId) {
                                                                    navigate("/events");
                                                                    return;
                                                                }

                                                                try {
                                                                    await api.get(`/events/${n.eventId}`);
                                                                    navigate(`/event/${n.eventId}`);
                                                                } catch {
                                                                    toast("This event is no longer available");
                                                                    navigate("/events");

                                                                    setNotifications((prev) => {
                                                                        const updated = prev.filter((item) => item.eventId !== n.eventId);
                                                                        localStorage.setItem("notifications", JSON.stringify(updated));
                                                                        return updated;
                                                                    });
                                                                }

                                                                setShowNotifications(false);
                                                                setUnreadCount(0);
                                                            }}
                                                            className="block w-full border-b border-white/5 px-4 py-3 text-left transition-colors hover:bg-white/[0.04]"
                                                        >
                                                            <p className="text-sm font-semibold text-white">{n.title}</p>
                                                            <p className="mt-1 text-xs leading-relaxed text-white/45">{n.message}</p>
                                                        </button>
                                                    ))
                                                )}
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
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white transition-colors md:hidden"
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
                                className="overflow-hidden border-t border-white/10 md:hidden"
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
