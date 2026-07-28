import React, { useState, useRef, useEffect } from 'react';
import { Modal } from './Modal';
import { Camera, ZoomIn, ZoomOut, RotateCw, Check, X, Upload, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProfilePictureCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl?: string;
  onSaveAvatar: (newAvatarDataUrl: string) => void;
}

export const ProfilePictureCropperModal: React.FC<ProfilePictureCropperModalProps> = ({
  isOpen,
  onClose,
  currentAvatarUrl,
  onSaveAvatar,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(currentAvatarUrl || null);
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setImageSrc(currentAvatarUrl || null);
      setZoom(1);
      setRotation(0);
      setSelectedFile(null);
    }
  }, [isOpen, currentAvatarUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file (PNG, JPG, WEBP)');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setZoom(1);
        setRotation(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropAndSave = () => {
    if (!imageSrc) {
      toast.error('Please select or upload an image first');
      return;
    }

    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 300; // Output dimension 300x300
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setIsProcessing(false);
        toast.error('Canvas context rendering failed');
        return;
      }

      // Draw background
      ctx.clearRect(0, 0, size, size);

      ctx.save();
      // Move origin to center
      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(zoom, zoom);

      // Draw cropped image centered
      const aspect = img.width / img.height;
      let drawWidth = size;
      let drawHeight = size;

      if (aspect > 1) {
        drawWidth = size * aspect;
      } else {
        drawHeight = size / aspect;
      }

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
      onSaveAvatar(croppedDataUrl);
      setIsProcessing(false);
      toast.success('Profile picture updated successfully!');
      onClose();
    };

    img.onerror = () => {
      setIsProcessing(false);
      toast.error('Failed to load image for processing');
    };

    img.src = imageSrc;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Profile Picture">
      <div className="space-y-5 text-xs">
        {/* Upload Drop Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-center space-y-2"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center mx-auto">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">
              Click to select or drag & drop new photo
            </p>
            <p className="text-[11px] text-slate-500">Supports PNG, JPG, JPEG or WEBP (Max 10MB)</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Interactive Cropper Preview Canvas */}
        {imageSrc && (
          <div className="space-y-4 bg-slate-900 p-4 rounded-2xl text-white">
            <div className="text-center font-semibold text-slate-300 text-[11px] flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Interactive Circular Avatar Preview</span>
            </div>

            <div className="flex justify-center items-center py-2">
              <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-emerald-500 shadow-2xl bg-black flex items-center justify-center">
                <img
                  src={imageSrc}
                  alt="Avatar Preview"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    transition: 'transform 0.1s ease-out',
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Adjustments Controls */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              {/* Zoom Control */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <ZoomOut className="w-3.5 h-3.5" /> Zoom
                </span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Rotation Control */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                  <RotateCw className="w-3.5 h-3.5" /> Rotate
                </span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="5"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-400 w-10 text-right">{rotation}°</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleCropAndSave}
            disabled={!imageSrc || isProcessing}
            className="px-5 py-2 bg-[#00A651] hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'Processing Image...' : 'Save Profile Picture'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
