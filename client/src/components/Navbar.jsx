import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

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

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/10 border-b border-white/5">
            <div className="w-full mx-auto px-6 lg:px-12">
                <div className="flex items-center justify-between h-20">

                     <Link to="/" className="group relative z-50 flex items-center gap-3">
                        <div className="relative w-10 h-10">
                            <div className="absolute inset-0 bg-pink-500 blur-lg opacity-30"></div>
                            <div className="relative w-full h-full bg-black border border-white/20 rounded-lg flex items-center justify-center overflow-hidden">
                                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-indigo-500 via-purple-500 to-transparent opacity-60"></div>
                                <span className="relative z-10 font-black text-xl text-white font-sans">A</span>
                            </div>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-xl font-bold font-sans tracking-wide text-white bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text transition-all duration-500 ease-in-out group-hover:text-transparent group-hover:tracking-widest">
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
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className="relative py-2 group"
                                >
                                     <span className={`relative z-10 text-sm font-medium tracking-wide transition-all duration-300 ${isActive ? "text-white text-shadow-glow" : "text-white/40 group-hover:text-white/80"
                                        }`}>
                                        {link.name}
                                    </span>

                                     {isActive && (
                                        <>
                                             <motion.div
                                                layoutId="nav-spotlight"
                                                className="absolute -top-10 left-1/2 -translate-x-1/2 w-12 h-20 bg-gradient-to-b from-indigo-500/80 via-purple-500/20 to-transparent blur-xl"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />

                                             <motion.div
                                                layoutId="nav-underline"
                                                className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_10px_rgba(129,140,248,0.8)]"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />

                                             <motion.div
                                                layoutId="nav-haze"
                                                className="absolute inset-0 -z-10 bg-indigo-500/10 blur-md rounded-full"
                                                transition={{ duration: 0.3 }}
                                            />
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                     <div className="hidden md:flex items-center gap-6">
                        <Link
                            to="/login"
                            className="relative px-6 py-2.5 rounded-full text-white/80 hover:text-white border border-white/20 hover:border-indigo-400/60 bg-white/5 hover:bg-white/10 backdrop-blur-sm transition-all duration-300 ease-out text-sm font-medium"
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-150 ease-linear hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Sign Up
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;