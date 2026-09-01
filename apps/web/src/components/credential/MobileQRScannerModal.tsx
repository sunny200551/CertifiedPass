import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  X,
  Upload,
  RefreshCw,
  Zap,
  ZapOff,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Smartphone,
  ShieldCheck,
} from "lucide-react";
import { parseCertificateId } from "@certifiedpass/utils";

interface MobileQRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (parsedCertId: string, rawText: string) => void;
  title?: string;
  subtitle?: string;
}

export const MobileQRScannerModal: React.FC<MobileQRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
  title = "Scan Certificate QR Code",
  subtitle = "Point your camera at any CertifiedPass or PolyLance certificate QR code",
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<"environment" | "user">("environment");
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Audio confirmation beep using Web Audio API
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // Audio not permitted or not supported
    }
  };

  // Start camera stream
  const startCamera = async (facing: "environment" | "user") => {
    stopCamera();
    setErrorMsg(null);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute("playsinline", "true"); // Critical for iOS Safari
        await videoRef.current.play();
      }

      // Check for torch/flashlight capability on mobile
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities?.() || {}) as any;
        if (capabilities.torch) {
          setHasTorch(true);
        }
      }
    } catch (err: any) {
      console.warn("Camera access failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setErrorMsg("Camera permission was denied. Please allow camera access in browser settings or upload an image.");
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        setErrorMsg("No camera device was detected on your device. You can upload a QR image below.");
      } else {
        setErrorMsg("Unable to access camera. You can select an image or screenshot from your device.");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Toggle Torch/Flashlight
  const toggleTorch = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track) {
      try {
        await (track as any).applyConstraints({
          advanced: [{ torch: !torchOn }],
        });
        setTorchOn(!torchOn);
      } catch (e) {
        console.warn("Could not toggle torch", e);
      }
    }
  };

  // Toggle front/rear camera
  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === "environment" ? "user" : "environment";
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  // Handle successful detection
  const handleDecodedText = (rawText: string) => {
    if (!rawText || isProcessing) return;
    setIsProcessing(true);
    setScannedResult(rawText);

    // Haptic vibration
    if (navigator.vibrate) {
      try {
        navigator.vibrate([100, 50, 100]);
      } catch {}
    }

    playBeep();

    const parsedId = parseCertificateId(rawText);

    setTimeout(() => {
      stopCamera();
      onScanSuccess(parsedId, rawText);
      onClose();
      setIsProcessing(false);
      setScannedResult(null);
    }, 600);
  };

  // Main QR Detection Loop
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setScannedResult(null);
      setIsProcessing(false);
      return;
    }

    startCamera(cameraFacing);

    let animationFrameId: number;
    let detector: any = null;

    // Check if BarcodeDetector is available natively
    if ("BarcodeDetector" in window) {
      try {
        detector = new (window as any).BarcodeDetector({
          formats: ["qr_code", "data_matrix", "aztec"],
        });
      } catch {
        detector = null;
      }
    }

    const scanFrame = async () => {
      if (
        !isProcessing &&
        videoRef.current &&
        videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA
      ) {
        const video = videoRef.current;

        // 1. Try Native BarcodeDetector
        if (detector) {
          try {
            const barcodes = await detector.detect(video);
            if (barcodes && barcodes.length > 0) {
              const text = barcodes[0].rawValue;
              if (text) {
                handleDecodedText(text);
                return;
              }
            }
          } catch {
            // Fallback to canvas inspection
          }
        }

        // 2. Canvas-based Frame Decoder fallback
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d", { willReadFrequently: true });
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // If barcode detector wasn't available or didn't trigger, detect via canvas image if detector supported
            if (detector) {
              try {
                const barcodes = await detector.detect(canvas);
                if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
                  handleDecodedText(barcodes[0].rawValue);
                  return;
                }
              } catch {}
            }
          }
        }
      }

      if (isOpen && !isProcessing) {
        animationFrameId = requestAnimationFrame(scanFrame);
      }
    };

    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(scanFrame);
    }, 400);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      stopCamera();
    };
  }, [isOpen, cameraFacing, isProcessing]);

  // Handle Photo / Gallery Image Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Try BarcodeDetector
        if ("BarcodeDetector" in window) {
          try {
            const detector = new (window as any).BarcodeDetector({
              formats: ["qr_code", "data_matrix"],
            });
            const barcodes = await detector.detect(canvas);
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              handleDecodedText(barcodes[0].rawValue);
              return;
            }
          } catch {}
        }

        setErrorMsg(
          "Could not detect a clear QR code in this image. Please ensure the QR code is centered and well-lit."
        );
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden text-white my-auto flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">{title}</h3>
              <p className="text-[11px] text-slate-400">Mobile & Camera Scanner</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative w-full aspect-square bg-black overflow-hidden flex items-center justify-center">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            muted
          />

          <canvas ref={canvasRef} className="hidden" />

          {/* Scanner Overlay Box & Laser */}
          <div className="relative z-10 w-64 h-64 border-2 border-indigo-500/80 rounded-2xl flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
            {/* Corner Targeting Accents */}
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-xl" />
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-xl" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-xl" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-xl" />

            {/* Scanning Laser Animation */}
            {!scannedResult && (
              <div className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_#818cf8] animate-pulse transition-all" />
            )}

            {/* Detected Match Confirmation */}
            {scannedResult && (
              <div className="flex flex-col items-center gap-2 bg-emerald-950/90 border border-emerald-500 rounded-xl p-4 text-emerald-300 animate-in zoom-in-95 duration-150">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 animate-bounce" />
                <span className="text-xs font-bold font-mono text-center truncate max-w-[200px]">
                  {scannedResult}
                </span>
              </div>
            )}
          </div>

          {/* Camera Controls Overlay */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between px-2">
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                className={`rounded-full p-2.5 backdrop-blur-md border transition-all ${
                  torchOn
                    ? "bg-amber-500/30 text-amber-300 border-amber-500/50"
                    : "bg-slate-900/60 text-slate-300 border-slate-700/60"
                }`}
                title="Toggle Torch"
              >
                {torchOn ? <Zap className="h-4 w-4" /> : <ZapOff className="h-4 w-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={toggleCameraFacing}
              className="rounded-full p-2.5 bg-slate-900/60 text-slate-300 border border-slate-700/60 backdrop-blur-md hover:text-white transition-all ml-auto"
              title="Flip Camera"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mx-4 mt-3 rounded-2xl bg-amber-950/60 border border-amber-700/60 p-3 text-xs text-amber-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Bottom Actions & Upload Option */}
        <div className="p-4 space-y-3 bg-slate-900">
          <p className="text-center text-xs text-slate-400 leading-relaxed px-2">
            {subtitle}
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:text-white transition-colors shadow-sm"
          >
            <ImageIcon className="h-4 w-4 text-indigo-400" />
            Upload Certificate Photo or Screenshot
          </button>
        </div>
      </div>
    </div>
  );
};
