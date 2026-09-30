import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, RefreshCw, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ImageCaptureUploadProps {
  label?: string;
  onImageSelected: (file: File | Blob) => void;
  onImageRemoved?: () => void;
  initialImageUrl?: string;
  className?: string;
}

export const ImageCaptureUpload: React.FC<ImageCaptureUploadProps> = ({
  label,
  onImageSelected,
  onImageRemoved,
  initialImageUrl,
  className,
}) => {
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image size exceeds 10MB limit.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onImageSelected(file);
  };

  const startCamera = async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setError(err.message || 'Camera access denied or unavailable.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const objectUrl = URL.createObjectURL(blob);
        setPreview(objectUrl);
        onImageSelected(blob);
        stopCamera();
      }
    }, 'image/jpeg', 0.8);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onImageRemoved) onImageRemoved();
  };

  return (
    <div className={twMerge('space-y-2', className)}>
      {label && <label className="font-bold text-[#123F63] block text-xs mb-1">{label}</label>}
      
      {error && (
        <div className="flex items-center gap-1.5 text-red-600 text-xs bg-red-50 p-2 rounded-lg border border-red-100">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {!preview && !isCameraActive && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#CFE5F5] rounded-xl bg-[#F8FBFE] hover:bg-[#EDF8FE] text-[#527290] hover:text-[#123F63] hover:border-[#2F8FCC] transition-colors cursor-pointer"
          >
            <Upload className="w-6 h-6 mb-2" />
            <span className="text-xs font-semibold">Upload Photo</span>
          </button>
          <button
            type="button"
            onClick={startCamera}
            className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#CFE5F5] rounded-xl bg-[#F8FBFE] hover:bg-[#EDF8FE] text-[#527290] hover:text-[#123F63] hover:border-[#2F8FCC] transition-colors cursor-pointer"
          >
            <Camera className="w-6 h-6 mb-2" />
            <span className="text-xs font-semibold">Open Camera</span>
          </button>
        </div>
      )}

      {isCameraActive && (
        <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex flex-col items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4 px-4">
            <button
              type="button"
              onClick={stopCamera}
              className="bg-white/90 text-red-600 px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={capturePhoto}
              className="bg-[#2F8FCC] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-lg"
            >
              Capture
            </button>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {preview && !isCameraActive && (
        <div className="relative rounded-xl border border-[#CFE5F5] overflow-hidden group">
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                handleRemove();
                fileInputRef.current?.click();
              }}
              className="bg-white text-[#123F63] p-2 rounded-lg hover:bg-[#EDF8FE] transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-xs font-bold">Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-white text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span className="text-xs font-bold">Remove</span>
            </button>
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
