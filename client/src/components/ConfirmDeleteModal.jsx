import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title = "Delete Item?", message = "Are you sure you want to delete this? This action cannot be undone." }) => {

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-[#0f0f0f] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-red-500/20 rounded-full blur-[50px] pointer-events-none"></div>

                    <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
                        <X size={20} />
                    </button>

                    <div className="flex flex-col items-center text-center mt-4 relative z-10">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                            <AlertTriangle size={32} className="text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                        <p className="text-white/60 text-sm mb-8 leading-relaxed">
                            {message}
                        </p>

                        <div className="flex gap-4 w-full">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConfirmDeleteModal;