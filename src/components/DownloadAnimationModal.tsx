import React, { useState, useEffect, useRef } from "react";
import { 
  Download, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  Sparkles, 
  HardDrive, 
  ShieldCheck, 
  RefreshCw, 
  Film, 
  Music, 
  FileText,
  AlertTriangle
} from "lucide-react";
import { MediaItem } from "../types";
import { useLanguage } from "../context/LanguageContext";
import { useNotifications } from "../context/NotificationContext";
import { getApiUrl } from "../utils/api";

interface DownloadAnimationModalProps {
  isOpen: boolean;
  mediaItem: MediaItem | null;
  mediaTitle: string;
  platform?: string;
  onClose: () => void;
}

export const DownloadAnimationModal: React.FC<DownloadAnimationModalProps> = ({
  isOpen,
  mediaItem,
  mediaTitle,
  platform = "Media",
  onClose
}) => {
  const { isBangla } = useLanguage();
  const { notifyTaskComplete } = useNotifications();
  const isSandbox = typeof window !== "undefined" && (window.location.hostname.includes("run.app") || window.location.hostname.includes("ai.studio"));
  const [status, setStatus] = useState<"preparing" | "downloading" | "finishing" | "completed" | "error">("preparing");
  const [progress, setProgress] = useState(0);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [speed, setSpeed] = useState<string>("0 MB/s");
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastLoadedRef = useRef<number>(0);
  const speedIntervalRef = useRef<any>(null);

  const cleanFilename = () => {
    const ext = mediaItem?.type === "audio" ? ".mp3" : mediaItem?.type === "image" ? ".jpg" : ".mp4";
    const safeTitle = (mediaTitle || "kiritos_media")
      .replace(/[^a-zA-Z0-9_\-\s]/g, "")
      .trim()
      .replace(/\s+/g, "_")
      .slice(0, 60);
    return `${safeTitle || "media"}${ext}`;
  };

  const triggerSaveFile = (url: string, filename: string) => {
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        document.body.removeChild(a);
      } catch (e) {
        // ignore
      }
    }, 1000);
  };

  const startDownload = async () => {
    if (!mediaItem) return;

    setStatus("preparing");
    setProgress(5);
    setDownloadedBytes(0);
    setTotalBytes(0);
    setSpeed("0 MB/s");
    setErrorMsg("");
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      setBlobUrl(null);
    }

    const filename = cleanFilename();
    const isUrlString = mediaItem.url && typeof mediaItem.url === "string";
    const proxyUrl = isUrlString && mediaItem.url.startsWith("/")
      ? getApiUrl(mediaItem.url)
      : getApiUrl(`/api/proxy-download?url=${encodeURIComponent(isUrlString ? mediaItem.url : "")}&filename=${encodeURIComponent(filename)}`);

    abortControllerRef.current = new AbortController();
    startTimeRef.current = Date.now();
    lastLoadedRef.current = 0;

    // Smooth multi-stage progress timer that NEVER stalls at 90% or 92%!
    let simulatedProgress = 10;
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 35) {
          // Rapid connection stage: 10% -> 35%
          return Math.min(prev + Math.floor(Math.random() * 6) + 4, 35);
        } else if (prev < 88) {
          // Server stream conversion & preparation stage: 35% -> 88%
          // Continuous smooth increments every tick so the user sees live motion
          const step = Math.random() < 0.6 ? 1 : 2;
          return Math.min(prev + step, 88);
        } else if (prev < 96) {
          // Stream buffering / transfer stage: 88% -> 96%
          return Math.min(prev + 1, 96);
        }
        return prev;
      });
    }, 450);

    try {
      const response = await fetch(proxyUrl, {
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        let message = `Server returned status ${response.status}`;
        try {
          const payload = await response.json();
          if (payload?.error) message = payload.error;
          else if (payload?.message) message = payload.message;
        } catch {
          // Keep the HTTP status when the server did not return JSON.
        }
        throw new Error(message);
      }

      const contentLengthHeader = response.headers.get("content-length");
      const total = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;
      if (total > 0) {
        setTotalBytes(total);
      }

      setStatus("downloading");

      if (!response.body) {
        clearInterval(progressTimer);
        const blob = await response.blob();
        handleBlobSuccess(blob, filename);
        return;
      }

      const reader = response.body.getReader();
      const chunks: Uint8Array[] = [];
      let received = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        if (value) {
          chunks.push(value);
          received += value.length;
          setDownloadedBytes(received);

          // Calculate real speed
          const elapsedSec = (Date.now() - startTimeRef.current) / 1000;
          if (elapsedSec > 0.3) {
            const mbps = (received / 1024 / 1024 / elapsedSec).toFixed(1);
            setSpeed(`${mbps} MB/s`);
          }

          if (total > 0) {
            const pct = Math.min(Math.round((received / total) * 100), 99);
            setProgress(Math.max(pct, simulatedProgress));
          } else {
            // Adaptive estimation for streams without content-length
            simulatedProgress = Math.min(Math.max(simulatedProgress, 88) + 1, 98);
            setProgress(simulatedProgress);
          }
        }
      }

      clearInterval(progressTimer);
      setStatus("finishing");
      setProgress(100);

      const mime = mediaItem.type === "audio" ? "audio/mpeg" : mediaItem.type === "image" ? "image/jpeg" : "video/mp4";
      const fullBlob = new Blob(chunks, { type: mime });
      handleBlobSuccess(fullBlob, filename);
    } catch (err: any) {
      clearInterval(progressTimer);
      if (err.name === "AbortError") {
        return;
      }

      console.warn("[DOWNLOAD ERROR]", err);
      setErrorMsg(err?.message || (isBangla ? "ডাউনলোড ব্যর্থ হয়েছে।" : "The media server could not return this file."));
      setStatus("error");
    }
  };

  const handleBlobSuccess = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    setStatus("completed");
    setProgress(100);
    triggerSaveFile(url, filename);

    notifyTaskComplete({
      title: isBangla ? "ডাউনলোড সম্পন্ন হয়েছে! 🎉" : "Download Task Completed! 🎉",
      message: `${filename} (${formatSize(blob.size)}) - ${isBangla ? "আপনার ফাইল সফলভাবে সেভ হয়েছে।" : "Your media file is ready and saved."}`,
      type: "download"
    });
  };

  useEffect(() => {
    if (isOpen && mediaItem) {
      startDownload();
    }
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (speedIntervalRef.current) {
        clearInterval(speedIntervalRef.current);
      }
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [isOpen, mediaItem]);

  if (!isOpen || !mediaItem) return null;

  const formatSize = (bytes: number) => {
    if (!bytes || bytes <= 0) return "0 MB";
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      id="kiritos-download-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div 
        id="kiritos-download-modal-content"
        className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(16,185,129,0.35),0_10px_30px_rgba(0,0,0,0.12)] border border-emerald-200/90 text-center overflow-hidden transition-all select-none"
      >
        {/* Glow ambient background pill */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-400/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Type Icon & Platform Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1.5">
            {mediaItem.type === "audio" ? (
              <Music className="w-3 h-3 text-emerald-700" />
            ) : (
              <Film className="w-3 h-3 text-emerald-700" />
            )}
            <span>{platform} • {mediaItem.quality}</span>
          </span>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-600">
            {mediaItem.type === "audio" ? "MP3 Audio" : "MP4 Video"}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-display line-clamp-2 mb-5 px-2">
          {mediaTitle || "Media Stream"}
        </h3>

        {/* Circular Progress & Animation Graphic */}
        <div className="relative w-32 h-32 mx-auto mb-5 flex items-center justify-center">
          {/* Radial SVG Ring */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="46"
              stroke="currentColor"
              strokeWidth="7"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="64"
              cy="64"
              r="46"
              stroke="url(#download-gradient)"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-300 ease-out"
            />
            <defs>
              <linearGradient id="download-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
            </defs>
          </svg>

          {/* Central Animated Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {status === "completed" ? (
              <div className="flex flex-col items-center animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 mt-1">
                  {isBangla ? "সম্পন্ন!" : "Done!"}
                </span>
              </div>
            ) : status === "error" ? (
              <div className="flex flex-col items-center">
                <AlertCircle className="w-10 h-10 text-rose-500" />
                <span className="text-[11px] font-bold text-rose-600 mt-1">
                  {isBangla ? "ত্রুটি" : "Error"}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900 font-display">
                  {progress}%
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {status === "finishing" 
                    ? (isBangla ? "সেভ হচ্ছে" : "Saving...") 
                    : (isBangla ? "ডাউনলোড" : "Transferring")}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Audio/Video Wave Equalizer Graphic while downloading */}
        {status === "downloading" && (
          <div className="flex items-center justify-center gap-1 mb-4 h-5">
            {[40, 70, 95, 60, 85, 50, 90, 65, 45].map((height, i) => (
              <span
                key={i}
                className="w-1 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-full animate-pulse"
                style={{
                  height: `${height}%`,
                  animationDelay: `${i * 120}ms`,
                  animationDuration: "700ms"
                }}
              ></span>
            ))}
          </div>
        )}

        {/* Live Metrics: Downloaded Bytes & Transfer Speed */}
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 mb-5 flex items-center justify-around text-xs">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
              {isBangla ? "সাইজ" : "Transferred"}
            </span>
            <span className="font-bold text-slate-900">
              {totalBytes > 0 
                ? `${formatSize(downloadedBytes)} / ${formatSize(totalBytes)}`
                : formatSize(downloadedBytes)}
            </span>
          </div>

          <div className="h-6 w-px bg-emerald-200"></div>

          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
              {isBangla ? "গতি" : "Speed"}
            </span>
            <span className="font-bold text-emerald-700">
              {status === "completed" ? (isBangla ? "সংরক্ষিত" : "Saved") : speed}
            </span>
          </div>

          <div className="h-6 w-px bg-emerald-200"></div>

          <div>
            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
              {isBangla ? "নিরাপত্তা" : "Security"}
            </span>
            <span className="font-bold text-emerald-700 flex items-center gap-1 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Direct SSL</span>
            </span>
          </div>
        </div>

        {/* Status Message Text */}
        <p className="text-xs text-slate-600 font-medium mb-5">
          {status === "preparing" && (
            progress < 35 
              ? (isBangla ? "হাই-স্পিড মিডিয়া সার্ভারের সাথে সংযোগ করা হচ্ছে..." : "Connecting to high-speed stream server...")
              : progress < 85
              ? (isBangla ? "ভিডিও/অডিও স্ট্রিম কনভার্ট ও প্রসেস করা হচ্ছে..." : "Processing & converting HD media stream... Please wait...")
              : (isBangla ? "মিডিয়া স্ট্রিম ট্রান্সফার প্রস্তুত করা হচ্ছে..." : "Preparing stream transfer to device...")
          )}
          {status === "downloading" && (isBangla ? "ফাইল ডাউনলোড ও ডিভাইসে সেভ হচ্ছে..." : "Downloading media stream directly to your device...")}
          {status === "finishing" && (isBangla ? "ফাইল প্রসেসিং সম্পন্ন ও সেভ করা হচ্ছে..." : "Packaging and saving media file...")}
          {status === "completed" && (isBangla ? "সফলভাবে ডাউনলোড সম্পন্ন হয়েছে এবং ডিভাইসে সেভ হয়েছে!" : "Download complete! Your file has been saved to your device.")}
          {status === "error" && (isBangla ? "ডাউনলোডে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।" : errorMsg || "Download failed. Please try again.")}
        </p>

        {isSandbox && (
          <div className="mb-5 p-3 rounded-2xl bg-amber-50/90 border border-amber-200 text-left animate-in fade-in duration-200">
            <span className="text-[10px] font-extrabold uppercase text-amber-800 flex items-center gap-1 mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              {isBangla ? "ডেভেলপমেন্ট স্যান্ডবক্স নোটিশ" : "Development Sandbox Notice"}
            </span>
            <p className="text-[10px] leading-relaxed text-amber-700 font-semibold">
              {isBangla 
                ? "ফেসবুক, মেসেঞ্জার বা ইনস্টাগ্রাম ইন-অ্যাপ ব্রাউজারে ডেভেলপমেন্ট কুকি ব্লক হওয়ায় সরাসরি ফাইল ডাউনলোড করতে সমস্যা হতে পারে। সম্পূর্ণ নিরবচ্ছিন্ন ডাউনলোডের জন্য অ্যাপ লিংকটি কপি করে সরাসরি Chrome বা Safari ব্রাউজারে ওপেন করুন।"
                : "In-app browsers (Facebook, Messenger, Instagram) block development sandbox session cookies. For smooth downloads, copy the URL and open it directly in Chrome or Safari."}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {status === "completed" ? (
            <>
              <button
                onClick={() => {
                  if (blobUrl) {
                    triggerSaveFile(blobUrl, cleanFilename());
                  } else {
                    startDownload();
                  }
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isBangla ? "পুনরায় সেভ করুন" : "Save Again"}</span>
              </button>
              <button
                onClick={onClose}
                className="py-3 px-5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                {isBangla ? "বন্ধ করুন" : "Close"}
              </button>
            </>
          ) : status === "error" ? (
            <>
              <button
                onClick={startDownload}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isBangla ? "আবার চেষ্টা করুন" : "Try Again"}</span>
              </button>
              <button
                onClick={onClose}
                className="py-3 px-5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs cursor-pointer active:scale-95 transition-all"
              >
                {isBangla ? "বাতিল" : "Cancel"}
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                if (abortControllerRef.current) {
                  abortControllerRef.current.abort();
                }
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer active:scale-95 transition-all"
            >
              {isBangla ? "ডাউনলোড বাতিল করুন" : "Cancel Download"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadAnimationModal;
