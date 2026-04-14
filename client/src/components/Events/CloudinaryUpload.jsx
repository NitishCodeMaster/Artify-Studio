import React, { useState } from 'react';
import axios from 'axios';
import { Upload, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CloudinaryUpload = ({ onUploadSuccess, currentImage }) => {
    const [uploading, setUploading] = useState(false);

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
            toast.success("Image Ready");
        } catch (error) {
            toast.error("Upload failed! Credentials check karein.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            {!currentImage ? (
                <label className="w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/40 hover:border-indigo-500 hover:text-indigo-400 transition-all bg-white/[0.02] cursor-pointer group">
                    {uploading ? (
                        <Loader2 className="animate-spin text-indigo-500" size={24} />
                    ) : (
                        <>
                            <Upload size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-medium">Upload Event Banner</span>
                        </>
                    )}
                    <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
            ) : (
                <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-white/10 group">
                    <img src={currentImage} className="w-full h-full object-cover" alt="Banner" />
                    <button
                        type="button"
                        onClick={() => onUploadSuccess('')}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 backdrop-blur-md text-white rounded-full hover:bg-red-500 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default CloudinaryUpload;