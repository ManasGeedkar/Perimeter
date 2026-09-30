import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, X, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose?: () => void;
  className?: string;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose, className }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    let active = true;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not supported in this browser.');
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.play();
          
          const tick = () => {
            if (!active) return;
            const video = videoRef.current;
            const canvas = canvasRef.current;

            if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
              if (isScanning) {
                animationFrameRef.current = requestAnimationFrame(tick);
              }
              return;
            }

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
              });

              if (code && code.data) {
                stopCamera();
                onScanSuccess(code.data);
                return;
              }
            }

            if (isScanning) {
              animationFrameRef.current = requestAnimationFrame(tick);
            }
          };
          
          animationFrameRef.current = requestAnimationFrame(tick);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Camera access denied or unavailable.');
          setIsScanning(false);
        }
      }
    };

    startCamera();

    return () => {
      active = false;
      stopCamera();
    };
  }, [isScanning, onScanSuccess]);

  const stopCamera = () => {
    setIsScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return (
    <div className={twMerge('relative rounded-2xl overflow-hidden bg-black flex flex-col', className)}>
      {error ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="h-10 w-10 text-red-500 mb-3" />
          <p className="text-white text-sm font-bold">{error}</p>
          <p className="text-gray-400 text-xs mt-1">Please try manual entry below.</p>
        </div>
      ) : (
        <>
          <video ref={videoRef} className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="absolute inset-0 border-[40px] border-black/40 flex items-center justify-center pointer-events-none">
            <div className="w-full aspect-square max-w-[250px] border-2 border-[#2F8FCC] rounded-xl relative">
               <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#2F8FCC] -ml-[2px] -mt-[2px]" />
               <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#2F8FCC] -mr-[2px] -mt-[2px]" />
               <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#2F8FCC] -ml-[2px] -mb-[2px]" />
               <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#2F8FCC] -mr-[2px] -mb-[2px]" />
            </div>
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 px-4 py-2 rounded-full backdrop-blur-sm pointer-events-none">
            <p className="text-white text-xs font-bold whitespace-nowrap">Align QR Code within frame</p>
          </div>
        </>
      )}

      {onClose && (
        <button
          type="button"
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 z-10 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
