import { motion } from 'framer-motion';
import { Search, TrendingUp, Star } from 'lucide-react';

import img1 from '../../assets/Images/PerformerPanel/image1.jpeg';
import img3 from '../../assets/Images/PerformerPanel/image3.jpeg';
import spot1 from '../../assets/Images/ArtistSpotlight/acoustic.jpeg';
import spot2 from '../../assets/Images/ArtistSpotlight/dancer.avif';

const HeroSection = ({ searchQuery, setSearchQuery }) => {
    return (
        <section className="relative pt-24 pb-12 border-b border-white/5 bg-black overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none opacity-50 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none opacity-30"></div>

            <div className="max-w-[1680px] mx-auto px-6 lg:px-8 grid lg:grid-cols-12 gap-10 xl:gap-16 items-center relative z-10">

                <div className="lg:col-span-6 xl:col-span-5">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative z-20">

                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1A1A] border border-white/10 mb-6 shadow-xl">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[11px] font-bold tracking-widest uppercase text-white/80"><span className="text-white">120+</span> Gigs Posted Today</span>
                        </motion.div>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-5 leading-[1.05] font-playfair">
                            Discover the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 italic pr-2 animate-pulse">Extraordinary.</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-xl mb-7 leading-relaxed font-light">Join the ecosystem where <strong>15k+ creators</strong> scout talent, book live performers, and trade premium gear securely.</p>

                        <div className="flex items-center gap-4 mb-7">
                            <div className="flex -space-x-3">
                                {[img1, img3, spot1].map((img, i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black overflow-hidden relative"><img src={img} className="w-full h-full object-cover" alt="user" /></div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-black bg-white/10 backdrop-blur-md flex items-center justify-center text-[10px] font-bold text-white">+2k</div>
                            </div>
                            <div className="text-xs text-white/50">
                                <div className="flex text-yellow-500 mb-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
                                <p>Trusted by Artists</p>
                            </div>
                        </div>

                        <div className="w-full max-w-xl relative group z-30">
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-700"></div>
                            <div className="relative flex items-center bg-[#0a0a0a] rounded-full px-2 py-2 shadow-2xl border border-white/10 group-hover:border-white/30 transition-all">
                                <div className="pl-4 pr-3 text-white/40 group-focus-within:text-indigo-400 transition-colors"><Search size={20} /></div>
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Try 'Jazz Band' or 'Vintage Gibson'..." className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-white/30 text-base h-10" />
                                <button className="bg-white text-black h-10 px-6 rounded-full font-bold text-sm hover:scale-105 hover:bg-indigo-50 transition-all shadow-lg flex items-center gap-2">Search</button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3 flex items-center gap-2"><TrendingUp size={12} className="text-indigo-400" /> Trending Searches:</p>
                            <div className="flex flex-wrap gap-2">
                                 {['Painter', 'Singer', 'Model', 'Guitar'].map((tag, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSearchQuery(tag)} // Click karte hi search ho jayega!
                                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-white/60 hover:bg-white/10 hover:text-white hover:border-indigo-500/30 transition-all"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                </div>

                <div className="hidden lg:block lg:col-span-6 xl:col-span-7 relative h-[430px] xl:h-[470px] w-full perspective-1000">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-[100px] animate-pulse"></div>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-0 right-10 w-32 h-32 border-2 border-white/5 rounded-full border-dashed z-0"></motion.div>

                    <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute right-0 top-4 w-[340px] xl:w-[390px] h-[360px] xl:h-[410px] rounded-[40px] rotate-6 overflow-hidden border border-white/20 shadow-2xl shadow-indigo-500/20 z-10 group">
                        <img src={spot2} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="visual" />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-transparent to-transparent mix-blend-multiply"></div>
                    </motion.div>

                    <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute right-32 xl:right-44 top-12 w-[300px] xl:w-[340px] h-[340px] xl:h-[380px] rounded-[30px] -rotate-6 overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#1a1a1a] z-20 group">
                        <div className="absolute inset-0 bg-[#1a1a1a] animate-pulse"></div>
                        <img src={img1} className="relative w-full h-full object-cover z-10" alt="Main Visual" />
                        <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-between shadow-2xl z-20">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[9px] font-bold text-emerald-100 tracking-wider uppercase">LIVE</span>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <p className="text-sm font-bold text-white leading-tight truncate max-w-[130px]">Riya's Jazz Room</p>
                                    <p className="text-[10px] text-white/50 truncate">Streaming Now</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5 h-4 items-end flex-shrink-0 opacity-80">
                                <motion.div animate={{ height: [4, 16, 8, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-emerald-400 rounded-full"></motion.div>
                                <motion.div animate={{ height: [8, 4, 12, 6, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-emerald-400 rounded-full"></motion.div>
                                <motion.div animate={{ height: [12, 8, 4, 14, 12] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-emerald-400 rounded-full"></motion.div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0, y: [0, -8, 0] }} transition={{ opacity: { duration: 0.5, delay: 1 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }} className="absolute top-24 left-2 z-30">
                        <div className="flex items-center gap-3 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 py-2.5 pl-2.5 pr-5 rounded-full shadow-[0_8px_32px_0_rgba(34,211,238,0.15)] ring-1 ring-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group">
                            <div className="relative">
                                <div className="absolute inset-0 bg-cyan-500/30 blur-md rounded-full group-hover:bg-cyan-400/50 transition-all duration-500"></div>
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="relative w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/60 to-transparent"></div>
                                    <div className="absolute inset-[3px] rounded-full border border-white/10"></div>
                                    <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,1)] z-10"></div>
                                </motion.div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider">Now Playing</p>
                                    <div className="flex gap-0.5 h-2 items-end">
                                        {
                                            [1, 2, 3].map(i => <motion.div key={i} animate={{ height: ['20%', '100%', '20%'] }}
                                                transition={{ duration: 0.4 + (i * 0.1), repeat: Infinity }} className="w-0.5 bg-cyan-400 rounded-full">
                                            </motion.div>)
                                        }
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-white leading-none">Midnight Blues</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-20 right-2 z-30">
                        <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full opacity-40"></div>
                        <div className="flex items-center gap-3 bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-2xl shadow-2xl ring-1 ring-white/5 hover:border-yellow-500/30 transition-colors">
                            <div className="flex -space-x-3">
                                <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] overflow-hidden"><img src={img3} className="w-full h-full object-cover" alt="R1" /></div>
                                <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] overflow-hidden"><img src={spot1} className="w-full h-full object-cover" alt="R2" /></div>
                                <div className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-yellow-500 flex items-center justify-center text-[8px] font-bold text-black">+50</div>
                            </div>
                            <div>
                                <div className="flex gap-0.5 text-yellow-400 mb-0.5">{[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} fill="currentColor" />)}</div>
                                <p className="text-[10px] font-bold text-white leading-none">"Found my band!"</p>
                            </div>
                        </div>
                    </motion.div>

                    <div className="absolute bottom-0 left-0 right-0 px-6">
                        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4"></div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                </div>
                                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Happening Now</span>
                            </div>
                            <div className="flex-1 overflow-hidden relative h-6 mask-linear-gradient">
                                <motion.div animate={{ x: ["100%", "-100%"] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-0 whitespace-nowrap flex items-center gap-8">
                                    <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                        <img src={img3} className="w-4 h-4 rounded-full border border-white/30" alt="u1" />
                                        <span className="text-xs text-white"><span className="font-bold text-white">Rahul</span> just booked <span className="text-indigo-400">The Jazz Trio</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                        <div className="w-4 h-4 rounded-full bg-pink-500 flex items-center justify-center text-[8px] font-bold">S</div>
                                        <span className="text-xs text-white"><span className="font-bold text-white">Sarah</span> listed <span className="text-pink-400">Vintage Piano</span> for ₹20k</span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                                        <img src={spot1} className="w-4 h-4 rounded-full border border-white/30" alt="u2" />
                                        <span className="text-xs text-white"><span className="font-bold text-white">Vikram</span> is live in <span className="text-emerald-400">Mumbai</span></span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
