import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'gear',
        imageUrl: '' 
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           
            const productData = {
                ...formData,
                images: [{ url: formData.imageUrl }]
            };
            await axios.post('http://localhost:5000/products/new', productData);

            alert("Product Added Successfully! 🎉");
            navigate('/marketplace'); 
        } catch (err) {
            alert("Error adding product! Backend chalu hai na?");
            console.log(err);
        }
    };

    return (
        <div className="bg-[#050505] min-h-screen text-white">
            <Navbar />
            <div className="pt-32 pb-20 px-6 max-w-lg mx-auto">
                <div className="bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl">
                    <h2 className="text-3xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                        Add New Product
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input type="text" placeholder="Product Name" required
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

                        <textarea placeholder="Description" required rows="3"
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

                        <input type="number" placeholder="Price ($)" required
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })} />

                        <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                            <option value="gear" className="bg-black text-white">Vintage Gear</option>
                            <option value="tribal" className="bg-black text-white">Tribal Artifacts</option>
                            <option value="digital" className="bg-black text-white">Studio Assets</option>
                        </select>

                        <input type="url" placeholder="Image URL (e.g., https://...)" required
                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} />

                        <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-500/30">
                            Upload Product
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddProduct;