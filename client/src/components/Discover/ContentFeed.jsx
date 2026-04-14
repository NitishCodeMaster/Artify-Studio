import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Camera, Brush, ArrowRight, Music, MessageSquare, Star, MapPin, Loader2, Edit3, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const StandardCard = ({ item, navigate }) => {

    const handleMessageArtist = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/messages/start/${item.id}`);
            navigate('/messages');
        } catch (error) {
            console.error("Chat initiation error:", error);
            navigate('/messages');
        }
    };

    return (
        <div className="group bg-[#0a0a0a] border border-white/[0.05] rounded-3xl p-5 shadow-xl hover:border-amber-500/20 transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 text-amber-500">
                     <Star size={14} />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">{item.category}</span>
            </div>

            <img src={item.img} alt={item.name} className="w-full h-40 object-cover rounded-2xl mb-5 group-hover:scale-105 transition-transform duration-500 relative z-10 shadow-lg" />

            <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="overflow-hidden pr-2">
                    <h4 className="font-bold text-white tracking-tight text-lg truncate group-hover:text-amber-400 transition-colors">{item.name}</h4>
                    <p className="text-xs text-white/50 truncate font-medium mt-0.5">{item.role}</p>
                </div>

                 <div className="flex items-center gap-2">
                     <button
                        onClick={handleMessageArtist}
                        title="Message Artist"
                        className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all shadow-lg hover:scale-110"
                    >
                        <MessageSquare size={16} />
                    </button>

                     <Link to={`/profile/${item.id}`} className="p-2.5 bg-white/5 border border-white/10 rounded-full text-white/40 hover:bg-amber-500 hover:text-black hover:scale-110 transition-all shadow-lg">
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-medium text-white/40 pt-4 mt-2 border-t border-white/[0.05] relative z-10">
                <MapPin size={12} className="text-red-400/70" /> {item.loc}
            </div>
        </div>
    );
};

const getOptimizedImage = (url, width = 600, height = 600) => {
    if (!url || !url.includes("res.cloudinary.com")) return url;
    const parts = url.split("/upload/");
    return `${parts[0]}/upload/w_${width},h_${height},c_lfill,g_face,q_auto,f_auto/${parts[1]}`;
};

const MyOwnPremiumProfileCard = ({ user }) => (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 p-[1px] bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 rounded-3xl shadow-[0_0_30px_rgba(245,158,11,0.1)] group overflow-hidden mb-8">
        <div className="bg-[#050505] p-6 sm:p-8 rounded-[23px] h-full flex flex-col sm:flex-row items-center gap-6 sm:gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px]"></div>

            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#050505] bg-[#111] overflow-hidden shadow-2xl shrink-0 -mt-10 sm:-mt-0 group-hover:scale-105 transition-transform duration-500 relative z-10">
                {user.img ? (
                    <img src={user.img} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-amber-500/10 text-amber-500 font-black text-4xl">
                        {user.name?.charAt(0).toUpperCase()}
                    </div>
                )}
            </div>

            <div className="flex-1 text-center sm:text-left relative z-10">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                    <Edit3 size={14} className="text-amber-400" />
                    <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">Your Creator Dashboard</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2 flex items-center justify-center sm:justify-start gap-3 flex-wrap">
                    Welcome back, {user.name}!
                    {user.role?.toLowerCase().includes('organizer') && (
                        <span className="bg-blue-500/20 text-blue-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Verified</span>
                    )}
                </h2>
                <p className="text-white/50 text-sm max-w-xl mx-auto md:mx-0 leading-relaxed">
                    This is your personalized creator experience. See how your profile shines on the community discover page.
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-medium text-white/50 mt-5">
                    {user.loc && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"><MapPin size={12} className="text-red-400" /> {user.loc}</span>}
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"><Brush size={12} className="text-green-400" /> {user.role || 'Artist'}</span>
                </div>
            </div>

            <Link
                to={`/profile/${user.id}`}
                className="flex items-center justify-center gap-2 w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-8 rounded-full transition-all border border-amber-500 group-hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.2)] relative z-10"
            >
                View Public Profile <ArrowRight size={18} />
            </Link>
        </div>
    </div>
);

const ContentFeed = ({ activeCategory, searchQuery, setActiveCategory }) => {
    const navigate = useNavigate();
    const [dynamicItems, setDynamicItems] = useState([]);
    const [myOwnCard, setMyOwnCard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscoverData = async () => {
            try {
                const res = await api.get('/users/top-creators');
                const users = res.data.creators || res.data.users || res.data;

                const currentUser = JSON.parse(localStorage.getItem('user')) || {};
                const myId = currentUser.id || currentUser._id;

                let mappedMyOwnCardData = null;
                const mappedOtherUsers = [];

                users.forEach(u => {
                    const r = (u.role || '').toLowerCase();
                    const s = (u.artStyle || '').toLowerCase();

                    let cat = "Event Organizers";

                    if (r.includes('painter') || r.includes('painting') || s.includes('art') || s.includes('canvas') || s.includes('craft') || s.includes('madhubani') || s.includes('sketch')) {
                        cat = "Painters & Crafters";
                    } else if (r.includes('music') || r.includes('singer') || r.includes('guitar') || r.includes('drum') || r.includes('vocal')) {
                        cat = "Musicians & Singers";
                    } else if (r.includes('dance') || r.includes('model') || r.includes('actor') || r.includes('perform')) {
                        cat = "Dancers & Actors";
                    } else if (r.includes('photo') || r.includes('camera') || r.includes('video') || r.includes('film') || r.includes('cinematograph')) {
                        cat = "Photographers & Video";
                    } else if (r.includes('organizer') || r.includes('manager') || r.includes('event')) {
                        cat = "Event Organizers";
                    }

                    const rawImg = u.profilePic || "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?q=80&w=2564";
                    const dynamicImg = getOptimizedImage(rawImg, 600, 600);

                    const mappedItem = {
                        id: u._id,
                        type: "artist",
                        category: cat,
                        name: u.name,
                        role: u.role || 'Artist',
                        loc: u.originLocation || 'World Citizen',
                        img: dynamicImg,
                    };

                    if (u._id === myId) {
                        mappedMyOwnCardData = mappedItem;
                    } else {
                        mappedOtherUsers.push(mappedItem);
                    }
                });

                setMyOwnCard(mappedMyOwnCardData);
                setDynamicItems(mappedOtherUsers);
            } catch (error) {
                console.error("Error fetching discover data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscoverData();
    }, []);

    const getCategoryItems = (cat) => dynamicItems.filter(i => i.category === cat);

    const Categories = ["Painters & Crafters", "Musicians & Singers", "Dancers & Actors", "Photographers & Video", "Event Organizers"];

    const CategoryIcons = {
        "Painters & Crafters": Palette,
        "Musicians & Singers": Music,
        "Dancers & Actors": Star,
        "Photographers & Video": Camera,
        "Event Organizers": Calendar
    };

    const renderContent = () => {
        if (loading) return <div className="flex justify-center items-center py-20"><Loader2 className="animate-spin text-amber-500" size={40} /></div>;

        if (searchQuery) {
            const results = dynamicItems.filter(i =>
                i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                i.role.toLowerCase().includes(searchQuery.toLowerCase())
            );
            return (
                <div className="space-y-6 pt-10">
                    <h2 className="text-2xl font-black text-white px-2">Search Results for "{searchQuery}"</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {results.map(item => <StandardCard key={item.id} item={item} navigate={navigate} />)}
                        {results.length === 0 && <p className="col-span-full text-center text-white/40 py-10 border border-dashed border-white/10 rounded-2xl">No creators found.</p>}
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-16">
                {myOwnCard && <MyOwnPremiumProfileCard user={myOwnCard} />}

                {Categories.map(cat => {
                    if (activeCategory !== "All" && activeCategory !== cat) return null;
                    const items = getCategoryItems(cat);
                    const Icon = CategoryIcons[cat];

                    if (items.length === 0) return null;

                    return (
                        <div key={cat} className="space-y-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-6 px-2">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-amber-500 border border-white/10 shadow-lg backdrop-blur-sm"><Icon size={24} /></div>
                                    <div>
                                        <h2 className="text-3xl font-black text-white tracking-tighter">{cat}</h2>
                                        <p className="text-sm text-white/40 font-medium mt-1">Discover top talent in this category</p>
                                    </div>
                                </div>
                                <button onClick={() => setActiveCategory(cat)} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/90 text-sm font-bold border border-white/10 active:scale-95 transition-all w-full sm:w-auto">Explore All <ArrowRight size={16} /></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {items.map(item => <StandardCard key={item.id} item={item} navigate={navigate} />)}
                            </div>
                        </div>
                    );
                })}

            </div>
        );
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                {renderContent()}
            </motion.div>
        </AnimatePresence>
    );
};

export default ContentFeed;