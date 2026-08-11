import React, { useState } from 'react';
import axios from 'axios';
import { Upload, X, Loader2, RefreshCw, Crop } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CloudinaryUpload = ({ onUploadSuccess, currentImage }) => {
    const [uploading, setUploading] = useState(false);
    const [fitMode, setFitMode] = useState('cover'); // 'cover' | 'contain' | 'center'

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            return toast.error("File bohot badi hai! Max 5MB allowed.");
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'artify_community');

        setUploading(true);
        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/dinlyqk3c/image/upload`,
                formData
            );

            onUploadSuccess(res.data.secure_url);
            toast.success("Image Uploaded Successfully! 📸");
        } catch (error) {
            toast.error("Upload failed! Credentials check karein.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full space-y-2">
            {!currentImage ? (
                <label className="w-full h-36 border-2 border-dashed border-white/15 rounded-2xl flex flex-col items-center justify-center text-white/40 hover:border-indigo-500 hover:text-indigo-400 transition-all bg-white/[0.02] cursor-pointer group">
                    {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="animate-spin text-indigo-500" size={26} />
                            <span className="text-xs font-semibold text-indigo-400">Uploading to Cloud...</span>
                        </div>
                    ) : (
                        <>
                            <Upload size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-semibold">Upload Event / Gig Banner</span>
                            <span className="text-[10px] text-white/30 mt-1">PNG, JPG, WEBP up to 5MB</span>
                        </>
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
            ) : (
                <div className="space-y-2">
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/20 bg-black/60 group shadow-lg">
                        <img
                            src={currentImage}
                            className={`w-full h-full transition-all duration-300 ${
                                fitMode === 'cover' ? 'object-cover' : fitMode === 'contain' ? 'object-contain bg-black' : 'object-scale-down'
                            }`}
                            alt="Banner Preview"
                        />

                        {/* Top Action Controls overlay */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                            <label className="p-1.5 bg-black/75 backdrop-blur-md text-white rounded-xl hover:bg-indigo-600 transition-colors cursor-pointer title='Replace Photo'">
                                <RefreshCw size={13} className={uploading ? 'animate-spin' : ''} />
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                            </label>

                            <button
                                type="button"
                                onClick={() => onUploadSuccess('')}
                                className="p-1.5 bg-black/75 backdrop-blur-md text-white rounded-xl hover:bg-red-500 transition-colors"
                                title="Remove Photo"
                            >
                                <X size={13} />
                            </button>
                        </div>

                        {/* Bottom Fit Mode Selector */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 text-[10px]">
                            <span className="text-white/60 font-semibold px-2 flex items-center gap-1">
                                <Crop size={12} className="text-indigo-400" /> Photo Fit:
                            </span>
                            <div className="flex items-center gap-1">
                                {['cover', 'contain', 'center'].map((mode) => (
                                    <button
                                        key={mode}
                                        type="button"
                                        onClick={() => setFitMode(mode)}
                                        className={`px-2 py-0.5 rounded-lg capitalize font-bold transition-all ${
                                            fitMode === mode
                                                ? 'bg-indigo-600 text-white shadow'
                                                : 'text-white/50 hover:text-white hover:bg-white/10'
                                        }`}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CloudinaryUpload;