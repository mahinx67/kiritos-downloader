import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause,
  Scissors, 
  Download, 
  Loader2, 
  Check, 
  AlertCircle,
  Video,
  Upload,
  RefreshCw,
  Clock,
  Sparkles,
  Film
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useNotifications } from "../context/NotificationContext";
import { getApiUrl } from "../utils/api";

export function RealVideoTrimmer() {
  const { isBangla } = useLanguage();
  const { notifyTaskComplete } = useNotifications();

  // Input mode: "url" or "file"
  const [inputMode, setInputMode] = useState<"url" | "file">("url");

  const [videoUrl, setVideoUrl] = useState("");
  const [isFetchingMedia, setIsFetchingMedia] = useState(false);
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaStreamUrl, setMediaStreamUrl] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);

  // File upload ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video playback & duration tracking
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Trimming parameters (in seconds)
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(10);

  // Trimming & Exporting state
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [trimmedBlobSize, setTrimmedBlobSize] = useState<number>(0);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setFetchError(isBangla ? "দয়া করে একটি সঠিক ভিডিও ফাইল নির্বাচন করুন।" : "Please select a valid video file.");
      return;
    }

    setFetchError(null);
    if (downloadLink) {
      URL.revokeObjectURL(downloadLink);
      setDownloadLink(null);
    }

    const localUrl = URL.createObjectURL(file);
    setMediaStreamUrl(localUrl);
    setMediaTitle(file.name);
  };

  // Fetch real media stream from API URL
  const handleFetchVideo = async () => {
    if (!videoUrl.trim()) return;

    setIsFetchingMedia(true);
    setFetchError(null);
    setMediaStreamUrl("");
    setMediaTitle("");
    if (downloadLink) {
      URL.revokeObjectURL(downloadLink);
      setDownloadLink(null);
    }

    const trimmed = videoUrl.trim();

    // Check if URL is a direct media file (.mp4, .webm, .mov, .mkv, .m3u8, etc.)
    if (trimmed.match(/\.(mp4|webm|mov|mkv|ogv|m3u8|avi)(\?.*)?$/i) || trimmed.startsWith("blob:") || trimmed.startsWith("data:video")) {
      setMediaStreamUrl(trimmed);
      setMediaTitle("Direct Video Stream");
      setIsFetchingMedia(false);
      return;
    }

    try {
      const res = await fetch(getApiUrl("/api/download"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed })
      });

      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        // If server returns HTML error page (e.g., 404/500 HTML), do not fail with JSON SyntaxError
        const rawText = await res.text();
        console.warn("[TRIMMER] Non-JSON API response received:", rawText.substring(0, 150));
        
        // Fallback: try using the input URL directly as a video source
        setMediaStreamUrl(trimmed);
        setMediaTitle("Media Stream");
        setIsFetchingMedia(false);
        return;
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || (isBangla ? "ভিডিও স্ট্রিম লোড করা যায়নি।" : "Failed to load video stream from link."));
      }

      // Look for mp4 / video stream
      const videoStream = data.media?.find((m: any) => m.type === "video" && m.url);
      if (videoStream) {
        setMediaStreamUrl(videoStream.url);
        setMediaTitle(data.title || "Target Video");
      } else if (data.media?.[0]?.url) {
        setMediaStreamUrl(data.media[0].url);
        setMediaTitle(data.title || "Target Video");
      } else {
        // Fallback to direct input URL if no media stream array returned
        setMediaStreamUrl(trimmed);
        setMediaTitle(data.title || "Direct Media Link");
      }
    } catch (err: any) {
      console.error("Trimmer fetch error:", err);
      // If error occurs, attempt direct HTML5 video load fallback
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        setMediaStreamUrl(trimmed);
        setMediaTitle("Direct Video Link");
      } else {
        setFetchError(err.message || (isBangla ? "ভিডিও লোড করতে সমস্যা হয়েছে। সঠিক ভিডিও লিঙ্ক প্রদান করুন।" : "Could not retrieve video stream. Please verify the URL or upload a video file."));
      }
    } finally {
      setIsFetchingMedia(false);
    }
  };

  // Video loaded metadata
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = Math.floor(videoRef.current.duration) || 30;
      setDuration(dur);
      setStartTime(0);
      setEndTime(Math.min(dur, Math.max(5, Math.floor(dur / 2))));
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const curr = videoRef.current.currentTime;
      setCurrentTime(curr);

      // Loop within the trimmed range if playing
      if (curr >= endTime) {
        videoRef.current.currentTime = startTime;
      }
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime < startTime || videoRef.current.currentTime >= endTime) {
        videoRef.current.currentTime = startTime;
      }
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.warn("Video playback paused by browser:", err.message);
            setIsPlaying(false);
          });
      }
    }
  };

  const setRangeStart = (val: number) => {
    const clamped = Math.max(0, Math.min(val, endTime - 0.5));
    setStartTime(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  const setRangeEnd = (val: number) => {
    const clamped = Math.min(duration || 100, Math.max(val, startTime + 0.5));
    setEndTime(clamped);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m}:${s < 10 ? "0" : ""}${s}.${ms}`;
  };

  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // REAL MediaRecorder Canvas Video Trimming Engine
  const handleExportTrim = async () => {
    const video = videoRef.current;
    if (!video) return;

    setIsExporting(true);
    setExportProgress(0);
    setFetchError(null);

    if (downloadLink) {
      URL.revokeObjectURL(downloadLink);
      setDownloadLink(null);
    }

    try {
      const renderCanvas = document.createElement("canvas");
      renderCanvas.width = video.videoWidth || 1280;
      renderCanvas.height = video.videoHeight || 720;
      const ctx = renderCanvas.getContext("2d");
      if (!ctx) throw new Error("Could not initialize 2D canvas");

      // High FPS stream capture
      const stream = renderCanvas.captureStream(30);

      // Try capturing audio tracks
      try {
        // @ts-ignore
        if (typeof video.captureStream === "function") {
          // @ts-ignore
          const videoStream = video.captureStream();
          const audioTracks = videoStream.getAudioTracks();
          if (audioTracks.length > 0) {
            stream.addTrack(audioTracks[0]);
          }
        }
      } catch (aErr) {
        console.warn("Audio track capture warning:", aErr);
      }

      const mimeType = MediaRecorder.isTypeSupported("video/mp4;codecs=avc1")
        ? "video/mp4;codecs=avc1"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : "video/webm";

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 15000000 // 15 Mbps HQ
      });

      const recordedChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          recordedChunks.push(ev.data);
        }
      };

      const trimDuration = Math.max(0.5, endTime - startTime);

      mediaRecorder.onstop = () => {
        // Reset playback rate and audio state
        video.playbackRate = 1.0;
        video.muted = false;

        const fullBlob = new Blob(recordedChunks, { type: mimeType });
        const url = URL.createObjectURL(fullBlob);
        setDownloadLink(url);
        setTrimmedBlobSize(fullBlob.size);
        setIsExporting(false);
        setExportProgress(100);

        notifyTaskComplete({
          title: isBangla ? "ভিডিও ট্রিম সম্পন্ন হয়েছে! 🎉" : "Video Trim Completed! 🎉",
          message: isBangla ? `আপনার নির্দিষ্ট ট্রিমকৃত অংশ (${formatSeconds(endTime - startTime)}) তৈরি হয়ে গেছে।` : `Trimmed clip (${formatSeconds(endTime - startTime)}) is ready for download.`,
          type: "success",
          actionLabel: isBangla ? "ডাউনলোড করুন" : "Download Now",
          onAction: () => {
            const a = document.createElement("a");
            a.href = url;
            a.download = `trimmed_clip_${Date.now()}.${mimeType.includes("mp4") ? "mp4" : "webm"}`;
            a.click();
          }
        });
      };

      // Seek to start position
      video.pause();
      setIsPlaying(false);
      video.currentTime = startTime;

      await new Promise<void>((resolve) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          resolve();
        };
        video.addEventListener("seeked", onSeeked);
      });

      mediaRecorder.start(100);
      
      // Ensure normal 1.0x playback speed so exported video plays at 1x speed
      video.playbackRate = 1.0;
      video.muted = false;
      await video.play();

      const processInterval = setInterval(() => {
        const current = video.currentTime;
        const elapsed = Math.max(0, current - startTime);
        const pct = Math.min(99, Math.max(0, Math.round((elapsed / trimDuration) * 100)));
        setExportProgress(pct);

        if (video.ended || current >= endTime) {
          clearInterval(processInterval);
          mediaRecorder.stop();
          video.pause();
          setIsPlaying(false);
        } else {
          ctx.drawImage(video, 0, 0, renderCanvas.width, renderCanvas.height);
        }
      }, 30);

    } catch (err: any) {
      console.error("[TRIMMER ERROR]", err);
      setIsExporting(false);
      setFetchError(err.message || (isBangla ? "ভিডিও ট্রিম করতে সমস্যা হয়েছে।" : "Failed to trim video."));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
          <Scissors className="w-5 h-5 text-emerald-600" />
          <span>{isBangla ? "স্মার্ট অনলাইন ভিডিও ট্রিমার ও কাটার" : "Interactive Online Video Trimmer & Cutter"}</span>
        </h3>
        <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
          {isBangla 
            ? "সোশ্যাল মিডিয়া ভিডিও লিঙ্ক পেস্ট করুন অথবা আপনার কম্পিউটার/মোবাইল থেকে ভিডিও ফাইল আপলোড করে নির্দিষ্ট সময় কাটিং ও ট্রিম করুন।" 
            : "Paste any social video URL or upload a video file, preview playback in real-time, select exact start/end cut points, and download your trimmed clip."}
        </p>
      </div>

      {/* Input Mode Selector & Box */}
      <div className="p-5 bg-white/85 border border-emerald-100 rounded-2xl space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <button
            type="button"
            onClick={() => setInputMode("url")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              inputMode === "url" 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {isBangla ? "ভিডিও লিঙ্ক দ্বারা" : "Paste Video Link"}
          </button>
          <button
            type="button"
            onClick={() => setInputMode("file")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              inputMode === "file" 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {isBangla ? "ডিভাইস থেকে ফাইল আপলোড" : "Upload Local File"}
          </button>
        </div>

        {inputMode === "url" ? (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {isBangla ? "সোশ্যাল মিডিয়া বা ডাইরেক্ট ভিডিও লিঙ্ক" : "Social Media or Direct Video Link"}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                key="trimmer-url-input"
                type="url"
                placeholder={isBangla ? "ইউটিউব, টিকটক, রিলস বা ভিডিও লিঙ্ক এখানে পেস্ট করুন..." : "Paste YouTube, TikTok, Reels, or video link here..."}
                value={videoUrl || ""}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 bg-white border border-emerald-200 px-4 py-3 text-slate-800 text-sm rounded-xl outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 shadow-2xs placeholder-slate-400"
              />
              <button
                onClick={handleFetchVideo}
                disabled={isFetchingMedia || !videoUrl.trim()}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isFetchingMedia ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{isBangla ? "স্ট্রিম লোড হচ্ছে..." : "Loading Stream..."}</span>
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4" />
                    <span>{isBangla ? "ফেচ ও প্রিভিউ" : "Fetch & Preview"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {isBangla ? "ভিডিও ফাইল নির্বাচন করুন" : "Select Video File"}
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 p-6 rounded-2xl text-center cursor-pointer transition-colors flex flex-col items-center justify-center gap-2"
            >
              <input
                key="trimmer-file-input"
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Film className="w-8 h-8 text-emerald-600" />
              <span className="text-xs font-extrabold text-slate-800">
                {isBangla ? "এখানে ভিডিও ড্রপ করুন অথবা ক্লিক করে ব্রাউজ করুন" : "Click to browse or drag video here"}
              </span>
              <span className="text-[10px] text-slate-500">Supports MP4, MOV, WebM, MKV</span>
            </div>
          </div>
        )}

        {fetchError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{fetchError}</span>
          </div>
        )}
      </div>

      {/* Video Preview & Trimming Controls */}
      {mediaStreamUrl && (
        <div className="p-5 bg-white/95 border border-emerald-200 rounded-2xl space-y-5 shadow-sm animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-emerald-100 min-w-0 overflow-hidden">
            <div className="space-y-0.5 min-w-0 flex-1 overflow-hidden">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block">
                {isBangla ? "একটিভ ভিডিও স্ট্রিম" : "Active Video Stream"}
              </span>
              <h4 className="text-sm font-bold text-slate-900 truncate max-w-full break-all" title={mediaTitle}>
                {mediaTitle || "Stream Preview"}
              </h4>
            </div>
            <span className="shrink-0 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 border border-emerald-300 self-start sm:self-auto">
              {isBangla ? `মোট সময়: ${formatSeconds(duration)}` : `Duration: ${formatSeconds(duration)}`}
            </span>
          </div>

          {/* HTML5 Video Player */}
          <div className="relative rounded-2xl overflow-hidden bg-black/90 aspect-video max-h-[380px] flex items-center justify-center mx-auto shadow-inner border border-slate-800">
            <video
              ref={videoRef}
              src={mediaStreamUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain"
              playsInline
              crossOrigin="anonymous"
            />
            
            {/* Overlay Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-emerald-600/80 hover:bg-emerald-600 text-white flex items-center justify-center backdrop-blur-xs transition-transform transform active:scale-90 cursor-pointer shadow-lg"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>
          </div>

          {/* Trimmer Sliders */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between text-xs font-bold text-slate-800 gap-2">
              <span className="flex items-center gap-1.5 text-emerald-900">
                <Clock className="w-4 h-4 text-emerald-600" />
                {isBangla ? "ট্রিমকৃত কাটিং সেগমেন্ট নির্বাচন করুন:" : "Select Trimmed Segment:"}
              </span>
              <span className="text-emerald-800 font-extrabold text-sm bg-emerald-100/90 px-3 py-1 rounded-lg border border-emerald-300">
                {formatSeconds(startTime)} ➔ {formatSeconds(endTime)} ({formatSeconds(Math.max(0, endTime - startTime))} {isBangla ? "কাট" : "cut"})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Time slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>{isBangla ? "শুরুর সময় (Start Position):" : "Start Position:"}</span>
                  <span className="text-emerald-700 font-extrabold">{formatSeconds(startTime)}</span>
                </div>
                <input
                  key="trimmer-start-range"
                  type="range"
                  min="0"
                  max={duration || 60}
                  step="0.1"
                  value={isNaN(startTime) ? 0 : startTime}
                  onChange={(e) => setRangeStart(Number(e.target.value) || 0)}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              {/* End Time slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-700">
                  <span>{isBangla ? "শেষের সময় (End Position):" : "End Position:"}</span>
                  <span className="text-emerald-700 font-extrabold">{formatSeconds(endTime)}</span>
                </div>
                <input
                  key="trimmer-end-range"
                  type="range"
                  min="0"
                  max={duration || 60}
                  step="0.1"
                  value={isNaN(endTime) ? 0 : endTime}
                  onChange={(e) => setRangeEnd(Number(e.target.value) || 0)}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-emerald-200/60">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = startTime;
                    videoRef.current.play();
                    setIsPlaying(true);
                  }
                }}
                className="text-emerald-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <Play className="w-3 h-3" /> {isBangla ? "কাট করা ক্লিপের প্লেব্যাক টেস্ট করুন" : "Preview Trimmed Clip"}
              </button>
              <span>{isBangla ? "প্লেহেইড টাইম: " : "Current Playhead: "}{formatSeconds(currentTime)}</span>
            </div>
          </div>

          {/* Export / Download Trigger */}
          <div className="pt-2">
            <button
              onClick={handleExportTrim}
              disabled={isExporting}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-98 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>{isBangla ? `ভিডিও কাটিং প্রসেসিং হচ্ছে (${exportProgress}%)...` : `Trimming & Encoding Cut Clip (${exportProgress}%)...`}</span>
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  <span>{isBangla ? "কাট করে রেন্ডার করুন ও ডাউনলোড প্রস্তুত করুন" : "Trim & Prepare Download Clip"}</span>
                </>
              )}
            </button>
          </div>

          {/* Ready Download Card */}
          {downloadLink && !isExporting && (
            <div className="p-4 bg-emerald-950 text-white border border-emerald-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left shadow-lg animate-in fade-in duration-300">
              <div className="space-y-0.5">
                <h5 className="text-xs font-bold text-emerald-200 flex items-center gap-1.5 justify-center sm:justify-start">
                  <Check className="w-4 h-4 text-emerald-400" />
                  {isBangla ? "ট্রিমকৃত আউটপুট সম্পূর্ণ প্রস্তুত!" : "Trimmed Output Ready!"}
                </h5>
                <p className="text-[11px] text-emerald-300/80">
                  Duration: {formatSeconds(endTime - startTime)} • Size: {formatBytes(trimmedBlobSize)}
                </p>
              </div>

              <a
                href={downloadLink}
                download={`trimmed_video_${Date.now()}.mp4`}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Download className="w-4 h-4 text-slate-950" />
                <span>{isBangla ? "ট্রিম করা ভিডিও ডাউনলোড করুন" : "Download Trimmed MP4"}</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
