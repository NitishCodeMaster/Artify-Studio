import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-[#111] border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center"
            >
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={30} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Delete Gig?</h3>
                <p className="text-white/50 text-sm mb-8 leading-relaxed">
                    Kya aap sach mein "<span className="text-white font-medium">{title}</span>" ko remove karna chahte hain? Ye action undo nahi hoga.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-500 shadow-lg shadow-red-600/20 transition-all"
                    >
                        Delete
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default DeleteConfirmModal;