import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/MarketPlace/ProductCard';
import { Loader2, Package } from 'lucide-react';

const Dashboard = () => {
    const [myProducts, setMyProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchMyProducts = async () => {
            if (!user) return;
            try { 
                const res = await axios.get(`http://localhost:5000/products/seller/${user._id || user.id}`);
                setMyProducts(res.data.products);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching my products", err);
                setLoading(false);
            }
        };
        fetchMyProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Delete this product permanently?")) {
            try {
                await axios.delete(`http://localhost:5000/products/${id}`);
                setMyProducts(myProducts.filter(p => p._id !== id));
            } catch (err) {
                alert("Failed to delete");
            }
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white pb-20">
            <Navbar />
            <div className="max-w-[1280px] mx-auto px-6 pt-32">
                <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold shadow-lg">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white">My Dashboard</h1>
                        <p className="text-white/50">Manage your uploaded products here</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>
                ) : myProducts.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl bg-white/5 flex flex-col items-center">
                        <Package size={48} className="text-white/20 mb-4" />
                        <h2 className="text-xl font-bold mb-2">No Products Uploaded</h2>
                        <p className="text-white/50 mb-6">You haven't added any products to the marketplace yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {myProducts.map(product => (
                            <ProductCard key={product._id} product={product} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;