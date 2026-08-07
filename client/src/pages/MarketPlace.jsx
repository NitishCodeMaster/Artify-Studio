import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Footer } from '../components/Footer';
import MarketHero from '../components/MarketPlace/MarketHero';
import ProductCard from '../components/MarketPlace/ProductCard';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import SellerMap from '../components/MarketPlace/SellerMap';
import { Search, PackageX, Sparkles, Filter, Plus, ShieldCheck, Video, BadgeIndianRupee, MapPin, X, Map } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ProductSkeleton = () => (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden animate-pulse backdrop-blur-sm">
        <div className="aspect-[4/5] bg-white/[0.03]"></div>
        <div className="p-6 space-y-4">
            <div className="w-24 h-3 bg-white/10 rounded-full"></div>
            <div className="w-full h-6 bg-white/10 rounded-md"></div>
            <div className="w-2/3 h-4 bg-white/10 rounded-md"></div>
            <div className="pt-4 mt-4 border-t border-white/5 flex justify-between items-center">
                <div className="w-20 h-6 bg-white/10 rounded-md"></div>
                <div className="w-8 h-8 bg-white/10 rounded-full"></div>
            </div>
        </div>
    </div>
);

const categories = [
    { id: 'all', label: 'Explore All' },
    { id: 'traditional_art', label: 'Madhubani & Folk Art' },
    { id: 'tribal_instruments', label: 'Tribal Instruments' },
    { id: 'used_gear', label: 'Vintage & Used Gear' },
    { id: 'handcrafted', label: 'Handmade Crafts' },
];

const popularLocations = [
    'All Locations',
    'Chandigarh',
    'Jaipur',
    'Delhi',
    'Kolkata',
    'Mumbai',
    'Haridwar',
    'Ranchi'
];

const Marketplace = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('all');
    const [selectedLocation, setSelectedLocation] = useState('All Locations');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [showMapModal, setShowMapModal] = useState(false);

    const productGridRef = useRef(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await api.get('/products/all');
                setProducts(res.data.products || res.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Server might be down.");
                toast.error("Failed to load marketplace!");
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const initiateDelete = (id) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDeleteAction = async () => {
        if (!itemToDelete) return;

        try {
            await api.delete(`/products/${itemToDelete}`);
            setProducts(products.filter(product => product._id !== itemToDelete));
            toast.success("Item removed from marketplace! 🗑️");
        } catch (err) {
            console.error("Error deleting product", err);
            toast.error("Failed to remove item!");
        } finally {
            setDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    const executeSearch = () => {
        if (productGridRef.current) {
            productGridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const filteredProducts = products.filter(product => {
        const searchLower = searchQuery.toLowerCase();
        const prodLocation = product.location || product.seller?.sellerProfile?.location || product.seller?.originLocation || 'Chandigarh';
        const prodStore = product.sellerStoreName || product.seller?.sellerProfile?.storeName || '';
        const prodProfession = product.sellerProfession || product.seller?.sellerProfile?.sellerCategory || product.seller?.role || '';

        const matchesSearch =
            (product.name?.toLowerCase().includes(searchLower)) ||
            (product.description?.toLowerCase().includes(searchLower)) ||
            (prodLocation.toLowerCase().includes(searchLower)) ||
            (prodStore.toLowerCase().includes(searchLower)) ||
            (prodProfession.toLowerCase().includes(searchLower));

        const matchesCategory = activeCategory === 'all' || product.category === activeCategory;

        const matchesLocation = selectedLocation === 'All Locations' ||
            prodLocation.toLowerCase().includes(selectedLocation.toLowerCase());

        return matchesSearch && matchesCategory && matchesLocation;
    });

    // Format products list into seller pins for the map
    const sellerMapData = filteredProducts.map(p => ({
        id: p._id,
        productName: p.name,
        storeName: p.sellerStoreName || p.seller?.sellerProfile?.storeName || (p.seller?.name ? `${p.seller.name}'s Store` : 'Rahul Music Store'),
        sellerLocation: p.location || p.seller?.sellerProfile?.location || 'Chandigarh',
        location: p.location || p.seller?.sellerProfile?.location || 'Chandigarh',
        latitude: p.latitude || p.seller?.sellerProfile?.latitude,
        longitude: p.longitude || p.seller?.sellerProfile?.longitude,
        category: p.sellerProfession || p.category,
        sellerId: p.seller?._id || p.seller
    }));

    return (
        <div className="bg-[#030303] min-h-screen text-white font-sans selection:bg-amber-500/30 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[420px] bg-amber-600/10 blur-[120px] pointer-events-none rounded-full"></div>
            <div className="absolute left-0 top-[420px] h-[520px] w-[360px] bg-gradient-to-br from-amber-500/10 to-transparent blur-3xl pointer-events-none"></div>
            <div className="absolute right-0 top-[260px] h-[620px] w-[420px] bg-gradient-to-bl from-orange-500/10 to-transparent blur-3xl pointer-events-none"></div>

            <Toaster position="bottom-right" toastOptions={{
                style: { background: '#111', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }
            }} />

            <div className="relative z-10">
                <MarketHero
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    onSearch={executeSearch}
                />
            </div>

            <div className="max-w-[1760px] mx-auto px-6 lg:px-8 pb-20 relative z-10" ref={productGridRef}>
                <div className="sticky top-24 z-30 bg-[#030303]/90 backdrop-blur-xl border-b border-white/5 pt-4 pb-6 mb-8 -mx-6 px-6 lg:mx-0 lg:px-6 lg:rounded-2xl lg:border lg:mt-[-18px] shadow-2xl">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

                        {/* Category Buttons */}
                        <div className="flex overflow-x-auto hide-scrollbar w-full lg:w-auto gap-8 pb-2 lg:pb-0">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`relative py-2 text-sm font-bold tracking-wide transition-colors whitespace-nowrap ${activeCategory === cat.id ? 'text-amber-500' : 'text-white/40 hover:text-white/80'
                                        }`}
                                >
                                    {cat.label}
                                    {activeCategory === cat.id && (
                                        <motion.div
                                            layoutId="activeCategoryLine"
                                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Right Bar: Location Filter, Map Toggle, Search & Sell Button */}
                        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap sm:flex-nowrap">
                            {/* Location Filter Dropdown */}
                            <div className="relative shrink-0">
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="bg-white/5 border border-white/10 hover:border-amber-500/40 rounded-full px-4 py-2.5 text-xs font-bold text-amber-400 focus:outline-none cursor-pointer appearance-none pr-8"
                                >
                                    {popularLocations.map(loc => (
                                        <option key={loc} value={loc} className="bg-black text-white">
                                            📍 {loc}
                                        </option>
                                    ))}
                                </select>
                                <MapPin size={14} className="absolute right-3 top-3 text-amber-400 pointer-events-none" />
                            </div>

                            {/* Open Nearby Sellers Map Modal */}
                            <button
                                onClick={() => setShowMapModal(true)}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-amber-500/20 border border-white/10 hover:border-amber-500/40 text-xs font-bold text-white transition-all shrink-0 active:scale-95"
                            >
                                <Map size={15} className="text-amber-400" />
                                <span>Nearby Map</span>
                            </button>

                            <div className="relative group w-full lg:w-[220px]">
                                <div className="relative flex items-center bg-white/[0.03] border border-white/10 hover:border-amber-500/50 rounded-full p-1 transition-colors">
                                    <div className="pl-3 pr-1.5 text-white/40 group-focus-within:text-amber-400 transition-colors">
                                        <Search size={16} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Quick search..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent py-2 text-xs text-white placeholder-white/30 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <Link
                                to="/add-product"
                                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                            >
                                <Plus size={16} /> Sell
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-amber-500/15 bg-amber-500/[0.06] p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-300"><ShieldCheck size={16} /> Verified Store Locations</div>
                        <p className="text-xs leading-relaxed text-white/45">Every listing displays the seller's store name (e.g. Rahul Music Store) and city location (e.g. 📍 Chandigarh).</p>
                    </div>
                    <div className="rounded-2xl border border-green-500/15 bg-green-500/[0.05] p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-green-300"><Video size={16} /> Video Proof</div>
                        <p className="text-xs leading-relaxed text-white/45">Used instruments with demo videos stand out faster in the collection.</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="mb-2 flex items-center gap-2 text-sm font-bold text-white"><BadgeIndianRupee size={16} /> Fair Deals</div>
                        <p className="text-xs leading-relaxed text-white/45">Compare market value and asking price before adding anything to cart.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-7">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => <ProductSkeleton key={n} />)}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4 text-red-400">
                            <PackageX size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h3>
                        <p className="text-white/50 max-w-md">{error}</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Sparkles className="text-amber-400" size={20} />
                                {activeCategory === 'all' ? 'Rare & Authentic Finds' : `${categories.find(c => c.id === activeCategory)?.label}`}
                                {selectedLocation !== 'All Locations' && (
                                    <span className="text-amber-400 text-sm font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                                        📍 {selectedLocation}
                                    </span>
                                )}
                            </h2>
                            <span className="text-sm font-medium text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                                {filteredProducts.length} authentic pieces found
                            </span>
                        </div>

                        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-x-7">
                            <AnimatePresence>
                                {filteredProducts.map(product => (
                                    <motion.div
                                        key={product._id || product.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="break-inside-avoid"
                                    >
                                        <ProductCard product={product} onDelete={initiateDelete} />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {filteredProducts.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.02]"
                            >
                                <PackageX size={56} className="text-white/10 mb-6" />
                                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">No authentic pieces found</h2>
                                <p className="text-white/40 text-sm max-w-sm">We couldn't find anything matching your search or location filter. Be the first to list an item in this area!</p>
                            </motion.div>
                        )}
                    </>
                )}
            </div>

            {/* Nearby Sellers & Store Map Modal */}
            <AnimatePresence>
                {showMapModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.95 }}
                            className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 max-w-4xl w-full relative shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <Map className="text-amber-400" size={22} />
                                        Explore Nearby Sellers & Artisan Stores Map
                                    </h3>
                                    <p className="text-xs text-white/50">
                                        Interactive map of verified instrument luthiers, secondhand music stores, and tribal artisans across India.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowMapModal(false)}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <SellerMap
                                multipleSellers={sellerMapData}
                                onNavigateProfile={(id) => {
                                    setShowMapModal(false);
                                    navigate(`/profile/${id}`);
                                }}
                                height="420px"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmDeleteModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDeleteAction}
                title="Remove Masterpiece?"
                message="Are you sure you want to remove this authentic piece from the marketplace? This action is permanent."
            />

            <Footer />
        </div>
    );
};

export default Marketplace;
