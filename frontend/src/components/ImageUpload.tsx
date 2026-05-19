import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  value?: string;
  label: string;
  aspectRatio?: string;
}

const ImageUpload = ({ onUpload, value, label, aspectRatio = 'aspect-video' }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await api.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUpload(data.data.url);
      toast.success('Asset uploaded to the grid.');
    } catch (error: any) {
      // Fallback for development if Cloudinary is not configured
      if (error.response?.status === 500 && !import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
        console.warn('Cloudinary not configured, using mock upload.');
        const mockUrl = URL.createObjectURL(file);
        onUpload(mockUrl);
        toast.success('Simulation: Asset synced to local cache.');
      } else {
        toast.error('Failed to sync asset to the cloud.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-mono text-primary uppercase tracking-[0.2em] ml-1">{label}</label>
      
      <div 
        className={`relative ${aspectRatio} rounded-xl border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors overflow-hidden group bg-white/5`}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-white transition-all"
              >
                <Upload size={20} />
              </button>
              <button
                type="button"
                onClick={() => onUpload('')}
                className="p-2 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/30 hover:text-primary transition-colors"
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-8 h-8" />
                <span className="text-xs font-mono uppercase tracking-widest">Connect Asset</span>
              </>
            )}
          </button>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
