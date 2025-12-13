import React, { useState } from "react";
import { Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";
import logo from "../assets/Images/artify-logo.png";

const Navbar = () => {
    // const [open, setOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/20 border-b border-white/5 ">
            <div className="max-w-7xl mx-auto px-8 lg:px-12">
                <div className="flex items-center justify-between h-20 ">

                    <Link to="/" className="flex items-center gap-2 ml-2">
                        <img
                            src={logo}
                            alt="Artify Logo"
                            className=" w-[200px] h-[110px] object-contain mix-blend-lighten opacity-100 brightness-125 contrast-125 drop-shadow-[0_0_20px_rgba(139,92,246,0.55)] relative top-2"
                        />
                    </Link>

                    <nav className="hidden md:flex items-center gap-12">
                        <Link
                            to="/"
                            className="text-white/80 hover:text-indigo-400 transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/discover"
                            className="text-white/80 hover:text-indigo-400 transition-colors"
                        >
                            Discover
                        </Link>
                        <Link
                            to="/events"
                            className="text-white/80 hover:text-indigo-400 transition-colors"
                        >
                            Events
                        </Link>
                        <Link
                            to="/marketplace"
                            className="text-white/80 hover:text-indigo-400 transition-colors"
                        >
                            Marketplace
                        </Link>
                        <Link
                            to="/community"
                            className="text-white/80 hover:text-indigo-400 transition-colors"
                        >
                            Community
                        </Link>
                        <Link
                            to="/learn"
                            className="text-white/80 hover:text-indigo-400 transition-colors"
                        >
                            Learn
                        </Link>
                    </nav>

                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/login" className="px-6 py-2.5 text-white/80 hover:text-white transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="px-6 py-2.5  rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all">
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    {/* <button
                        className="md:hidden text-white p-2"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button> */}
                </div>
            </div>

            {/* Mobile Menu */}
            {/* {open && (
                <div className="md:hidden absolute top-20 left-0 right-0 backdrop-blur-md bg-black/90 border-b border-white/10 shadow-xl">
                    <nav className="flex flex-col px-6 py-6 gap-4">
                        <a
                            href="#home"
                            className="text-white/80 hover:text-indigo-400 transition-colors py-2"
                        >
                            Home
                        </a>
                        <a
                            href="#features"
                            className="text-white/80 hover:text-indigo-400 transition-colors py-2"
                        >
                            Features
                        </a>
                        <a
                            href="#events"
                            className="text-white/80 hover:text-indigo-400 transition-colors py-2"
                        >
                            Events
                        </a>
                        <a
                            href="#marketplace"
                            className="text-white/80 hover:text-indigo-400 transition-colors py-2"
                        >
                            Marketplace
                        </a>
                        <a
                            href="#community"
                            className="text-white/80 hover:text-indigo-400 transition-colors py-2"
                        >
                            Community
                        </a>
                        <div className="flex flex-col gap-3 mt-4">
                            <button className="px-6 py-2.5 text-white/80 border border-white/20 rounded-full hover:border-indigo-500 transition-colors">
                                Login
                            </button>
                            <button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
                                Sign Up
                            </button>
                        </div>
                    </nav>
                </div>
            )} */}

        </nav>
    );
};

export default Navbar;
