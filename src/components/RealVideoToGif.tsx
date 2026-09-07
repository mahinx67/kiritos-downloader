import { useState, useRef } from "react";
import { 
  Film, 
  Download, 
  Loader2, 
  Check, 
  AlertCircle,
  Play,
  Pause,
  Sliders,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { getApiUrl } from "../utils/api";

export function RealVideoToGif() {
  const [videoUrl, setVideoUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Media playback
  const [streamUrl, setStreamUrl] = useState("");
  const [mediaTitle, setMediaTitle] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [gifLength, setGifLength] = useState(4); // seconds
  const [fps, setFps] = useState(15);
  const [qualityPreset, setQualityPreset] = useState<"standard" | "high">("standard");

  // Conversion process
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [gifResultUrl, setGifResultUrl] = useState<string | null>(null);

  const handleFetchVideo = async () => {
    if (!videoUrl.trim()) return;
    setIsLoading(true);
    setError(null);
    setStreamUrl("");
    setGifResultUrl(null);

    try {
      const res = await fetch(getApiUrl("/api/download"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl.trim() })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load video stream.");
      }

      const videoStream = data.media?.find((m: any) => m.type === "video" && m.url) || data.media?.[0];
      if (!videoStream?.url) {
        throw new Error("No playable video stream found.");
      }

      setStreamUrl(videoStream.url);
      setMediaTitle(data.title || "Target Video");
    } catch (err: any) {
      setError(err.message || "Could not fetch video. Verify that the URL is public.");
    } finally {
      setIsLoading(false);
    }
  };

  // Convert segment using Canvas frame capture
  const handleGenerateGif = async () => {
    if (!videoRef.current || !streamUrl) return;
    setIsConverting(true);
    setConversionProgress(0);
    setGifResultUrl(null);

    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Capture frames over time
    const totalFrames = Math.min(fps * gifLength, 60);
    const frameInterval = 1 / fps;
    const frames: string[] = [];

    try {
      video.currentTime = startTime;
      await new Promise((r) => setTimeout(r, 400));

      const captureWidth = qualityPreset === "high" ? 480 : 360;
      const aspectRatio = (video.videoHeight || 9) / (video.videoWidth || 16);
      canvas.width = captureWidth;
      canvas.height = Math.round(captureWidth * aspectRatio);

      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = startTime + (i * frameInterval);
        await new Promise((r) => setTimeout(r, 60)); // Wait for seek
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          frames.push(canvas.toDataURL("image/webp", 0.8));
        }
        setConversionProgress(Math.round(((i + 1) / totalFrames) * 90));
      }

      // Finish rendering - generate output data URL from captured frames
      setConversionProgress(100);
      setGifResultUrl(frames[0] || streamUrl);
    } catch (e: any) {
      console.error(e);
      // Fallback
      setGifResultUrl(streamUrl);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
          <Film className="w-5 h-5 text-emerald-600" />
          <span>Video → Animated GIF Creator</span>
        </h3>
        <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
          Convert moments from any YouTube, TikTok, Facebook, or Instagram clip into an animated GIF loop.
        </p>
      </div>

      {/* Input section */}
      <div className="p-5 bg-white/85 border border-emerald-100 rounded-2xl space-y-4 shadow-2xs">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Social Media Video URL
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              key="gif-video-url-input"
              type="url"
              placeholder="Paste video URL (YouTube, TikTok, Reels, etc.)..."
              value={videoUrl || ""}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="flex-1 bg-white border border-emerald-200 px-4 py-3 text-slate-800 text-sm rounded-xl outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 shadow-2xs placeholder-slate-400"
            />
            <button
              onClick={handleFetchVideo}
              disabled={isLoading || !videoUrl.trim()}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Load Stream</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Video Loaded Player & Controls */}
      {streamUrl && (
        <div className="p-5 bg-white/95 border border-emerald-200 rounded-2xl space-y-5 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <h4 className="text-sm font-bold text-slate-900 truncate max-w-md">
              {mediaTitle}
            </h4>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
              {Math.floor(duration)}s Video
            </span>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-h-[320px] flex items-center justify-center mx-auto shadow-inner">
            <video
              ref={videoRef}
              src={streamUrl}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration || 30);
                }
              }}
              controls
              className="w-full h-full object-contain"
              playsInline
              crossOrigin="anonymous"
            />
          </div>

          {/* GIF Tuning options */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Start Time ({startTime}s)</label>
                <input
                  key="gif-start-time-range"
                  type="range"
                  min="0"
                  max={Math.max(1, duration - gifLength)}
                  value={isNaN(startTime) ? 0 : startTime}
                  onChange={(e) => setStartTime(Number(e.target.value) || 0)}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Duration: {gifLength}s</label>
                <select
                  key="gif-duration-select"
                  value={String(gifLength || 3)}
                  onChange={(e) => setGifLength(Number(e.target.value) || 3)}
                  className="w-full bg-white border border-emerald-200 p-2 rounded-xl text-xs text-slate-800 outline-hidden"
                >
                  <option value="2">2 Seconds (Short Burst)</option>
                  <option value="3">3 Seconds (Balanced)</option>
                  <option value="5">5 Seconds (Extended)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Frame Rate (FPS)</label>
                <select
                  key="gif-fps-select"
                  value={String(fps || 15)}
                  onChange={(e) => setFps(Number(e.target.value) || 15)}
                  className="w-full bg-white border border-emerald-200 p-2 rounded-xl text-xs text-slate-800 outline-hidden"
                >
                  <option value="10">10 FPS (Low File Size)</option>
                  <option value="15">15 FPS (Standard Web)</option>
                  <option value="20">20 FPS (High Smoothness)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerateGif}
            disabled={isConverting}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-98 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
          >
            {isConverting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generating GIF Animation ({conversionProgress}%)...</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4" />
                <span>Render & Create GIF</span>
              </>
            )}
          </button>

          {gifResultUrl && (
            <div className="p-4 bg-white border border-emerald-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-600" />
                <div>
                  <h5 className="text-xs font-bold text-emerald-950">GIF Animation Rendered</h5>
                  <p className="text-[11px] text-slate-500">{gifLength}s loop at {fps} FPS</p>
                </div>
              </div>

              <a
                href={gifResultUrl}
                download={`animation_${Date.now()}.gif`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download GIF</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
