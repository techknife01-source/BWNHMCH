import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ImageUploadProps {
  onImageSelected?: (file: File) => void;
  previewUrl?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, previewUrl: initialPreview, className }) => {
  const [preview, setPreview] = useState<string | null>(initialPreview || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      if (onImageSelected) onImageSelected(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
  };

  return (
    <div className={cn('relative w-full', className)}>
      {preview ? (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <img src={preview} alt="Upload Preview" className="h-48 w-full object-cover" />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 rounded-full bg-slate-900/70 p-1.5 text-white hover:bg-slate-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900/50 transition-all">
          <UploadCloud className="h-10 w-10 text-slate-400 mb-2" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click or drag image to upload</p>
          <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  );
};
