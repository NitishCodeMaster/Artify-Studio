import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import api from '../../utils/api';
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
    const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        try {
            const orderRes = await api.post('/payments/create-order', { amount: cartTotal });
            const order = orderRes.data.order;

            const options = {
                key: "rzp_test_STXE15b8MhnWM5",
                amount: order.amount,
                currency: "INR",
                name: "Artify Studio",
                description: "Purchase Unique Masterpieces",
                order_id: order.id,
                theme: { color: "#f59e0b" },

                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/payments/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            products: cart.map(item => item._id),
                            totalAmount: cartTotal
                        });


                        if (verifyRes.data.success) {
                            alert("Payment Successful! 🎉 Your masterpiece is on its way.");
                            clearCart();
                            setIsCartOpen(false);
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Payment Verification Failed! Hack attempt blocked 🛡️");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error("Checkout Error:", error);
            alert("Please login first to proceed to checkout!");
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    <motion.div
                        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#0a0a0a] border-l border-white/10 z-[101] flex flex-col shadow-2xl"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <ShoppingBag className="text-amber-500" />
                                Your Collection
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-white/40 space-y-4">
                                    <ShoppingBag size={48} className="opacity-20" />
                                    <p>Your cart is empty.</p>
                                    <button onClick={() => {
                                        setIsCartOpen(false);
                                        navigate('/marketplace');
                                    }} className="text-amber-500 font-medium hover:underline">
                                        Explore Marketplace
                                    </button>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item._id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 relative group">
                                        <img src={item.images?.[0]?.url || 'https://via.placeholder.com/100'} alt={item.name} className="w-20 h-20 object-cover rounded-lg bg-black" />
                                        <div className="flex-1 pr-6">
                                            <h3 className="text-white/90 font-medium text-sm line-clamp-2 leading-tight mb-2">{item.name}</h3>
                                            <p className="text-amber-500 font-bold">₹{item.price}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item._id)} className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-[#050505]">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-white/60 font-medium">Total Value</span>
                                    <span className="text-2xl font-bold text-white">₹{cartTotal}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 group"
                                >
                                    Proceed to Checkout
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
};

export default CartDrawer;