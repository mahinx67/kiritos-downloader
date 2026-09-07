import { useState, useEffect, useRef, ChangeEvent } from "react";
import { 
  Play, 
  Music, 
  Image as ImageIcon, 
  FileVideo, 
  Sparkles, 
  Settings, 
  Sliders, 
  Scissors, 
  Info, 
  QrCode, 
  Link as LinkIcon, 
  Check, 
  Clipboard, 
  Download, 
  Cpu, 
  Maximize2, 
  Minimize2, 
  AlertTriangle,
  RotateCcw,
  Loader2,
  Trash2,
  Lock,
  Compass,
  FileSpreadsheet
} from "lucide-react";
import { RealVideoTrimmer } from "./RealVideoTrimmer";
import { DirectAudioExtractor } from "./DirectAudioExtractor";
import { RealVideoToGif } from "./RealVideoToGif";
import { RealVideoCompressor } from "./RealVideoCompressor";
import { RealVideoMetadata } from "./RealVideoMetadata";
import { RealVideoEnhancer, HdIcon } from "./RealVideoEnhancer";
import { VideoToolType, ImageToolType, SocialToolType, ToolSubTab } from "../types";
import { getApiUrl } from "../utils/api";

interface ToolsSuiteProps {
  initialSubTab?: ToolSubTab;
  initialVideoTool?: VideoToolType;
  initialImageTool?: ImageToolType;
  initialSocialTool?: SocialToolType;
}

export default function ToolsSuite({
  initialSubTab = "video-tools",
  initialVideoTool = "mp3",
  initialImageTool = "compressor",
  initialSocialTool = "qr"
}: ToolsSuiteProps) {
  const [activeSubTab, setActiveSubTab] = useState<ToolSubTab>(initialSubTab);
  
  // Selection of specific tool
  const [activeVideoTool, setActiveVideoTool] = useState<VideoToolType>(initialVideoTool);
  const [activeImageTool, setActiveImageTool] = useState<ImageToolType>(initialImageTool);
  const [activeSocialTool, setActiveSocialTool] = useState<SocialToolType>(initialSocialTool);

  useEffect(() => {
    if (initialSubTab) setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  useEffect(() => {
    if (initialVideoTool) setActiveVideoTool(initialVideoTool);
  }, [initialVideoTool]);

  useEffect(() => {
    if (initialImageTool) setActiveImageTool(initialImageTool);
  }, [initialImageTool]);

  useEffect(() => {
    if (initialSocialTool) setActiveSocialTool(initialSocialTool);
  }, [initialSocialTool]);

  return (
    <div id="tools-suite-container" className="w-full max-w-5xl mx-auto mt-2 px-4">
      {/* Main Tool Shell */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Submenu */}
        <div className="lg:col-span-1 liquid-glass-card rounded-2xl p-4 space-y-1.5 h-fit">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 px-3 block mb-3">
            Select Utility
          </span>

          {activeSubTab === "video-tools" && (
            <>
              <button
                onClick={() => setActiveVideoTool("gif")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeVideoTool === "gif"
                    ? "bg-emerald-100/90 text-emerald-950 border-l-2 border-emerald-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60"
                }`}
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Video → GIF Animation</span>
              </button>
              <button
                onClick={() => setActiveVideoTool("compressor")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeVideoTool === "compressor"
                    ? "bg-emerald-100/90 text-emerald-950 border-l-2 border-emerald-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60"
                }`}
              >
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Video Compressor</span>
              </button>
              <button
                onClick={() => setActiveVideoTool("metadata")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeVideoTool === "metadata"
                    ? "bg-emerald-100/90 text-emerald-950 border-l-2 border-emerald-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60"
                }`}
              >
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Video Metadata Scan</span>
              </button>
            </>
          )}

          {activeSubTab === "image-tools" && (
            <>
              <button
                onClick={() => setActiveImageTool("compressor")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeImageTool === "compressor"
                    ? "bg-emerald-100/90 text-emerald-950 border-l-2 border-emerald-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60"
                }`}
              >
                <Sliders className="w-4 h-4 text-emerald-600" />
                <span>Image Compressor</span>
              </button>
              <button
                onClick={() => setActiveImageTool("resizer")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeImageTool === "resizer"
                    ? "bg-emerald-100/90 text-emerald-950 border-l-2 border-emerald-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60"
                }`}
              >
                <Maximize2 className="w-4 h-4 text-emerald-600" />
                <span>Image Resizer</span>
              </button>
              <button
                onClick={() => setActiveImageTool("converter")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeImageTool === "converter"
                    ? "bg-emerald-100/90 text-emerald-950 border-l-2 border-emerald-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60"
                }`}
              >
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Image Format Converter</span>
              </button>
              <button
                onClick={() => setActiveImageTool("webp")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeImageTool === "webp"
                    ? "bg-emerald-100/90 text-emerald-950 border-l-2 border-emerald-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60"
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Image → WebP Instant</span>
              </button>
            </>
          )}

          {activeSubTab === "social-tools" && (
            <>
              <button
                onClick={() => setActiveSocialTool("qr")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeSocialTool === "qr"
                    ? "bg-emerald-100/90 text-emerald-950 border-l-2 border-emerald-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60"
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>QR Code Generator</span>
              </button>
              <button
                onClick={() => setActiveSocialTool("thumbnail")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeSocialTool === "thumbnail"
                    ? "bg-emerald-100/90 text-emerald-950 border-l-2 border-emerald-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60"
                }`}
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>YouTube Thumbnail Grabber</span>
              </button>
              <button
                onClick={() => setActiveSocialTool("profile")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeSocialTool === "profile"
                    ? "bg-emerald-100/90 text-emerald-950 border-l-2 border-emerald-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60"
                }`}
              >
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Profile Photo Downloader</span>
              </button>
              <button
                onClick={() => setActiveSocialTool("analyzer")}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                  activeSocialTool === "analyzer"
                    ? "bg-emerald-100/90 text-emerald-950 border-l-2 border-emerald-600 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50/60"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Social URL Analyzer</span>
              </button>
            </>
          )}
        </div>

        {/* Right Active Workspace Panel */}
        <div className="lg:col-span-3 liquid-glass-card rounded-3xl p-6 md:p-8">
          {activeSubTab === "video-tools" && activeVideoTool === "enhancer" && (
            <RealVideoEnhancer />
          )}

          {activeSubTab === "video-tools" && activeVideoTool === "mp3" && (
            <DirectAudioExtractor />
          )}

          {activeSubTab === "video-tools" && activeVideoTool === "trimmer" && (
            <RealVideoTrimmer />
          )}

          {activeSubTab === "video-tools" && activeVideoTool === "gif" && (
            <RealVideoToGif />
          )}

          {activeSubTab === "video-tools" && activeVideoTool === "compressor" && (
            <RealVideoCompressor />
          )}

          {activeSubTab === "video-tools" && activeVideoTool === "metadata" && (
            <RealVideoMetadata />
          )}

          {activeSubTab === "image-tools" && (
            <ImageToolsWorkspace activeTool={activeImageTool} />
          )}

          {activeSubTab === "social-tools" && (
            <SocialToolsWorkspace activeTool={activeSocialTool} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   VIDEO TOOLS SUB-WIDGET
   ============================================================================ */
function VideoToolsWorkspace({ activeTool }: { activeTool: VideoToolType }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultReady, setResultReady] = useState(false);

  // Compressor specifics
  const [compressPercent, setCompressPercent] = useState(50);

  // Trimmer specifics
  const [startTime, setStartTime] = useState(10);
  const [endTime, setEndTime] = useState(45);

  // GIF specifics
  const [gifFps, setGifFps] = useState("15 FPS (Standard)");
  const [gifRes, setGifRes] = useState("480p Medium (Optimized)");

  const startDemoProcess = () => {
    setIsProcessing(true);
    setProgress(0);
    setResultReady(false);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          setResultReady(true);
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };

  const getToolTitle = () => {
    switch (activeTool) {
      case "mp3": return "Video → MP3 Audio Converter";
      case "gif": return "Video → Animated GIF Creator";
      case "compressor": return "Intelligent Video Compressor";
      case "trimmer": return "Online Video Trimmer & Splitter";
      case "metadata": return "Video File Metadata Analyzer";
    }
  };

  const getToolDesc = () => {
    switch (activeTool) {
      case "mp3": return "Convert any online streaming video or direct video link to premium 320kbps MP3 audio.";
      case "gif": return "Cut a segment of online video and render it as an animated GIF loop.";
      case "compressor": return "Reduce MP4 file sizes without sacrificing human visual fidelity using high-efficiency H.265 compression presets.";
      case "trimmer": return "Trim or clip any video to precise sub-second ranges and generate instant download wrappers.";
      case "metadata": return "Scan media streams, codec parameters, bitrate distributions, and container header atoms.";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
          <span>{getToolTitle()}</span>
        </h3>
        <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">{getToolDesc()}</p>
      </div>

      <div className="p-5 bg-white/85 border border-emerald-100 rounded-2xl space-y-4 shadow-2xs">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Target Video Link
          </label>
          <div className="relative flex">
            <input
              key="tools-video-url-input"
              type="url"
              placeholder="Paste a video URL (e.g., YouTube, Facebook, TikTok)..."
              value={videoUrl || ""}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full bg-white border border-emerald-200 px-4 py-3 text-slate-800 text-sm rounded-xl outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 shadow-2xs placeholder-slate-400"
            />
          </div>
        </div>

        {/* Dynamic configurations based on tool type */}
        {activeTool === "compressor" && (
          <div className="pt-2 border-t border-emerald-100 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700">TARGET COMPRESSION SIZE:</span>
              <span className="font-extrabold text-emerald-700">{compressPercent}% of Original</span>
            </div>
            <input 
              key="tools-video-compress-range"
              type="range" 
              min="20" 
              max="80" 
              value={isNaN(compressPercent) ? 50 : compressPercent}
              onChange={(e) => setCompressPercent(Number(e.target.value) || 50)}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
              <span>Max Quality (Large File)</span>
              <span>Balanced</span>
              <span>Ultra Compress (Small File)</span>
            </div>
          </div>
        )}

        {activeTool === "trimmer" && (
          <div className="pt-2 border-t border-emerald-100 space-y-4">
            <span className="block text-xs font-bold text-slate-700">TRIM DURATION (SECONDS)</span>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-600 font-bold mb-1">START POINT (s)</label>
                <input 
                  key="tools-video-trim-start"
                  type="number" 
                  value={isNaN(startTime) ? "" : startTime}
                  onChange={(e) => setStartTime(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="w-full bg-white border border-emerald-200 px-3 py-2 text-xs rounded-lg text-slate-800 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-600 font-bold mb-1">END POINT (s)</label>
                <input 
                  key="tools-video-trim-end"
                  type="number" 
                  value={isNaN(endTime) ? "" : endTime}
                  onChange={(e) => setEndTime(e.target.value === "" ? 0 : Number(e.target.value))}
                  className="w-full bg-white border border-emerald-200 px-3 py-2 text-xs rounded-lg text-slate-800 outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {activeTool === "gif" && (
          <div className="pt-2 border-t border-emerald-100 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">FPS PRESET</label>
              <select 
                key="tools-gif-fps-select"
                value={gifFps || "15 FPS (Standard)"}
                onChange={(e) => setGifFps(e.target.value)}
                className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs text-slate-800 outline-hidden"
              >
                <option value="15 FPS (Standard)">15 FPS (Standard)</option>
                <option value="24 FPS (Cinematic Smooth)">24 FPS (Cinematic Smooth)</option>
                <option value="10 FPS (Low Bandwidth)">10 FPS (Low Bandwidth)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">RESOLUTION</label>
              <select 
                key="tools-gif-res-select"
                value={gifRes || "480p Medium (Optimized)"}
                onChange={(e) => setGifRes(e.target.value)}
                className="w-full bg-white border border-emerald-200 p-2.5 rounded-xl text-xs text-slate-800 outline-hidden"
              >
                <option value="480p Medium (Optimized)">480p Medium (Optimized)</option>
                <option value="720p HD (High Quality)">720p HD (High Quality)</option>
                <option value="320p Mobile Small">320p Mobile Small</option>
              </select>
            </div>
          </div>
        )}

        <button
          onClick={startDemoProcess}
          disabled={isProcessing || !videoUrl}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white disabled:opacity-60 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-98 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Processing Chunk ({progress}%)</span>
            </>
          ) : (
            <span>Execute Utility Process</span>
          )}
        </button>
      </div>

      {resultReady && (
        <div className="p-5 bg-white/90 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fade-in shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-2xs">
            <Check className="w-6 h-6 text-emerald-700" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Rendering Completed successfully!</h4>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your customized media output has been packaged. You can now download the converted file to your local drive.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => {
                alert("Simulated file downloaded successfully!");
                setResultReady(false);
                setVideoUrl("");
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Download File Output</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   IMAGE TOOLS SUB-WIDGET (FULLY WORKING USING CANVAS!!!)
   ============================================================================ */
function ImageToolsWorkspace({ activeTool }: { activeTool: ImageToolType }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [originalSizeKB, setOriginalSizeKB] = useState<number>(0);
  const [newSizeKB, setNewSizeKB] = useState<number>(0);

  // States for compressor / resizer
  const [quality, setQuality] = useState(0.7);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [format, setFormat] = useState<"image/jpeg" | "image/png" | "image/webp">("image/webp");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setOriginalSizeKB(Math.round(file.size / 1024));
      setDownloadLink(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setWidth(img.width);
          setHeight(img.height);
          setPreviewUrl(event.target?.result as string);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    if (!previewUrl) return;
    setIsProcessing(true);

    setTimeout(() => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        // Apply resizer or default sizes
        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          const outputFormat = activeTool === "webp" ? "image/webp" : format;
          const compressionQuality = activeTool === "compressor" ? quality : 0.9;
          
          const dataUrl = canvas.toDataURL(outputFormat, compressionQuality);
          setDownloadLink(dataUrl);

          // Calculate output size roughly
          const head = dataUrl.split(",")[0];
          const fileLength = dataUrl.length - head.length - 1;
          const sizeInBytes = Math.round(fileLength * 3 / 4);
          setNewSizeKB(Math.round(sizeInBytes / 1024));
        }
        setIsProcessing(false);
      };
      img.src = previewUrl;
    }, 600);
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setDownloadLink(null);
  };

  const getToolTitle = () => {
    switch (activeTool) {
      case "compressor": return "Dynamic Image Compressor";
      case "resizer": return "Precision Image Resizer";
      case "converter": return "Instant Format Converter";
      case "webp": return "Superfast Image → WebP";
    }
  };

  const getToolDesc = () => {
    switch (activeTool) {
      case "compressor": return "Compress large PNG/JPG photos locally inside your browser instantly using advanced HTML5 scaling parameters.";
      case "resizer": return "Resize pixel dimensions with aspect ratio lock constraints for banner or profile requirements.";
      case "converter": return "Interchange file formats seamlessly between JPEG, PNG, and WebP instantly.";
      case "webp": return "Targeted compression converting heavy PNG/JPG files to next-generation Google WebP for high performance web loading.";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
          <span>{getToolTitle()}</span>
        </h3>
        <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">{getToolDesc()}</p>
      </div>

      <div className="p-5 bg-white/85 border border-emerald-100 rounded-2xl space-y-4 shadow-2xs">
        {!previewUrl ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-200 hover:border-emerald-500 bg-emerald-50/30 p-8 rounded-2xl text-center cursor-pointer transition-colors duration-150"
          >
            <ImageIcon className="w-10 h-10 text-emerald-600/70 mx-auto mb-3" />
            <span className="block text-xs font-bold text-slate-800">Choose Image or Drag & Drop</span>
            <span className="block text-[10px] text-emerald-700/70 mt-1 uppercase tracking-wider font-semibold">Supports JPG, PNG, WEBP</span>
            <input 
              key="tools-image-file-input"
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div className="flex items-center gap-3">
                <img src={previewUrl} className="w-12 h-12 rounded-lg object-cover border border-emerald-100 shadow-2xs" />
                <div>
                  <span className="block text-xs font-bold text-slate-900 line-clamp-1">{selectedFile?.name}</span>
                  <span className="block text-[10px] text-slate-500 font-semibold uppercase">Size: {originalSizeKB} KB</span>
                </div>
              </div>
              <button 
                onClick={clearImage}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer transition-colors"
                title="Remove image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Config parameters dynamically visible */}
            {activeTool === "compressor" && (
              <div className="space-y-2 border-t border-emerald-100 pt-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">QUALITY COEFFICIENT:</span>
                  <span className="font-extrabold text-emerald-700">{Math.round(quality * 100)}% Quality</span>
                </div>
                <input 
                  key="tools-image-quality-range"
                  type="range" 
                  min="0.1" 
                  max="0.95" 
                  step="0.05"
                  value={isNaN(quality) ? 0.7 : quality}
                  onChange={(e) => setQuality(Number(e.target.value) || 0.7)}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>
            )}

            {activeTool === "resizer" && (
              <div className="space-y-4 border-t border-emerald-100 pt-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-1">WIDTH (PX)</label>
                    <input 
                      key="tools-image-width-input"
                      type="number" 
                      value={isNaN(width) ? "" : width}
                      onChange={(e) => setWidth(e.target.value === "" ? 0 : Number(e.target.value))}
                      className="w-full bg-white border border-emerald-200 px-3 py-2 text-xs rounded-lg text-slate-800 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-600 font-bold mb-1">HEIGHT (PX)</label>
                    <input 
                      key="tools-image-height-input"
                      type="number" 
                      value={isNaN(height) ? "" : height}
                      onChange={(e) => setHeight(e.target.value === "" ? 0 : Number(e.target.value))}
                      className="w-full bg-white border border-emerald-200 px-3 py-2 text-xs rounded-lg text-slate-800 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTool === "converter" && (
              <div className="space-y-2 border-t border-emerald-100 pt-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">TARGET CONVERSION FORMAT</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["image/jpeg", "image/png", "image/webp"] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`py-2 px-3 rounded-lg text-[10px] font-extrabold uppercase tracking-wider border cursor-pointer transition-all ${
                        format === fmt 
                          ? "bg-emerald-100 text-emerald-950 border-emerald-300 font-bold" 
                          : "bg-white border-emerald-100 text-slate-600 hover:text-slate-900 hover:bg-emerald-50"
                      }`}
                    >
                      {fmt.replace("image/", "")}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={processImage}
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white disabled:opacity-60 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-98 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Processing Engine...</span>
                </>
              ) : (
                <span>Optimize Image Stream</span>
              )}
            </button>
          </div>
        )}
      </div>

      {downloadLink && (
        <div className="p-5 bg-white/90 border border-emerald-200 rounded-2xl text-center space-y-4 animate-fade-in shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-2xs">
            <Check className="w-6 h-6 text-emerald-700" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Image Optimized successfully!</h4>
          
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-left">
            <div>
              <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">Before Size</span>
              <span className="block text-xs font-bold text-slate-700">{originalSizeKB} KB</span>
            </div>
            <div>
              <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider font-display">After Size</span>
              <span className="block text-xs font-bold text-emerald-700">{newSizeKB} KB ({Math.round(((originalSizeKB - newSizeKB) / originalSizeKB) * 100)}% smaller!)</span>
            </div>
          </div>

          <div className="pt-2">
            <a 
              href={downloadLink}
              download={`kiritos_optimized_${Date.now()}.${activeTool === "webp" ? "webp" : format.replace("image/", "")}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-emerald-600/20"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Download Processed Image</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   SOCIAL MEDIA SPECIFIC TOOLS (INCLUDING FUNCTIONAL QR GENERATOR & REAL PROFILE EXTRACTOR!)
   ============================================================================ */
function SocialToolsWorkspace({ activeTool }: { activeTool: SocialToolType }) {
  const [urlInput, setUrlInput] = useState("");
  const [qrColor, setQrColor] = useState("#059669");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const extractUsername = (input: string): { handle: string; detectedPlatform: string } => {
    const trimmed = input.trim();
    if (!trimmed) return { handle: "", detectedPlatform: "Auto" };

    try {
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        const u = new URL(trimmed);
        const host = u.hostname.toLowerCase();
        const parts = u.pathname.split("/").filter(Boolean);

        if (host.includes("instagram.com")) {
          return { handle: parts[0]?.replace("@", "") || "user", detectedPlatform: "Instagram" };
        } else if (host.includes("facebook.com") || host.includes("fb.com")) {
          return { handle: parts[0]?.replace("@", "") || "user", detectedPlatform: "Facebook" };
        } else if (host.includes("tiktok.com")) {
          return { handle: parts[0]?.replace("@", "") || "user", detectedPlatform: "TikTok" };
        } else if (host.includes("youtube.com") || host.includes("youtu.be")) {
          const handle = parts[0] || u.searchParams.get("v") || "channel";
          return { handle: handle.startsWith("@") ? handle : `@${handle}`, detectedPlatform: "YouTube" };
        } else if (host.includes("twitter.com") || host.includes("x.com")) {
          return { handle: parts[0]?.replace("@", "") || "user", detectedPlatform: "Twitter / X" };
        } else if (host.includes("github.com")) {
          return { handle: parts[0] || "user", detectedPlatform: "GitHub" };
        } else if (host.includes("t.me") || host.includes("telegram.me")) {
          return { handle: parts[0] || "user", detectedPlatform: "Telegram" };
        } else {
          return { handle: host, detectedPlatform: "Website" };
        }
      }
    } catch {}

    const clean = trimmed.replace("@", "");
    return { handle: clean, detectedPlatform: "Social Profile" };
  };

  const triggerProcess = async () => {
    if (!urlInput.trim()) return;
    setIsProcessing(true);
    setResult(null);

    if (activeTool === "profile") {
      try {
        const res = await fetch(getApiUrl("/api/profile-pic"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: urlInput.trim() })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setResult(data);
        } else {
          throw new Error(data.message || "Failed to extract profile picture.");
        }
      } catch (err: any) {
        setResult({
          error: true,
          message: err.message || "Could not retrieve HD profile picture."
        });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (activeTool === "analyzer") {
      try {
        const res = await fetch(getApiUrl("/api/analyze-url"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlInput.trim() })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setResult(data);
        } else {
          throw new Error(data.message || "Failed to analyze URL headers.");
        }
      } catch (err: any) {
        setResult({
          error: true,
          message: err.message || "Could not analyze the target URL."
        });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    setTimeout(() => {
      if (activeTool === "qr") {
        setResult({
          qrUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=${qrColor.replace("#", "")}&data=${encodeURIComponent(urlInput.trim())}`
        });
      } else if (activeTool === "thumbnail") {
        let ytId = "dQw4w9WgXcQ";
        try {
          const u = new URL(urlInput);
          if (u.hostname.includes("youtube.com")) {
            ytId = u.searchParams.get("v") || ytId;
          } else if (u.hostname.includes("youtu.be")) {
            ytId = u.pathname.substring(1) || ytId;
          }
        } catch {}
        setResult({
          max: `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`,
          hq: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
          mq: `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
        });
      }
      setIsProcessing(false);
    }, 500);
  };

  const handleDownloadProfileImage = async (imgUrl: string) => {
    try {
      const response = await fetch(imgUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `profile_picture_hd_${Date.now()}.jpg`;
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(imgUrl, "_blank");
    }
  };

  const getToolTitle = () => {
    switch (activeTool) {
      case "qr": return "Stunning QR Code Generator";
      case "thumbnail": return "YouTube HD Thumbnail Extractor";
      case "profile": return "Platform Profile Picture Extractor (HD)";
      case "analyzer": return "Link & Header Response Analyzer";
    }
  };

  const getToolDesc = () => {
    switch (activeTool) {
      case "qr": return "Generate high resolution vector QR codes for any website URL, payment handle, or custom text parameter.";
      case "thumbnail": return "Retrieve maximum high definition cover images directly from YouTube servers by supplying a valid video link.";
      case "profile": return "Fetch and download full HD profile avatar pictures from Instagram, TikTok, YouTube, Twitter/X, GitHub, Telegram & more automatically.";
      case "analyzer": return "Real-time network inspection of HTTP response codes, Content-Types, server headers, SSL certificates, and stream bitrates.";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
          <span>{getToolTitle()}</span>
        </h3>
        <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">{getToolDesc()}</p>
      </div>

      <div className="p-5 bg-white/85 border border-emerald-100 rounded-2xl space-y-4 shadow-2xs">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            {activeTool === "qr" ? "QR Payload Text / URL" : activeTool === "profile" ? "Profile Link or @Username Handle" : "Target URL Link"}
          </label>
          <input
            key="tools-social-url-input"
            type="text"
            placeholder={
              activeTool === "qr" 
                ? "e.g., https://kiritos.downloader.app..." 
                : activeTool === "profile" 
                ? "Paste any Instagram, TikTok, YouTube, Twitter or GitHub profile link..."
                : "e.g., https://youtube.com/watch?v=... or any social URL"
            }
            value={urlInput || ""}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full bg-white border border-emerald-200 px-4 py-3 text-slate-800 text-sm rounded-xl outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 shadow-2xs placeholder-slate-400"
          />
        </div>

        {activeTool === "qr" && (
          <div className="pt-2 border-t border-emerald-100 flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">ACCENT FOREGROUND COLOR</label>
              <div className="flex items-center gap-2">
                <input 
                  key="tools-social-qr-color"
                  type="color" 
                  value={qrColor || "#059669"}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="w-8 h-8 rounded-lg bg-transparent border border-emerald-200 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">{qrColor || "#059669"}</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={triggerProcess}
          disabled={isProcessing || !urlInput.trim()}
          className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white disabled:opacity-60 disabled:cursor-not-allowed font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-98 transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>{activeTool === "analyzer" ? "Inspecting Network Headers..." : "Processing Query..."}</span>
            </>
          ) : (
            <span>{activeTool === "profile" ? "Extract HD Profile Photo" : activeTool === "analyzer" ? "Analyze URL Headers & Host" : "Run Generator Engine"}</span>
          )}
        </button>
      </div>

      {result && (
        <div className="p-5 bg-white/90 border border-emerald-200 rounded-2xl text-center space-y-4 animate-fade-in shadow-sm">
          {result.error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 text-left font-semibold">
              ⚠️ {result.message}
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200 shadow-2xs">
                <Check className="w-6 h-6 text-emerald-700" />
              </div>

              {activeTool === "qr" && (
                <div className="space-y-4">
                  <div className="w-44 h-44 mx-auto p-2.5 bg-white rounded-xl shadow-md border border-emerald-200">
                    <img src={result.qrUrl} alt="Generated QR" className="w-full h-full object-contain" />
                  </div>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Scan this custom generated code. Ready to use immediately.
                  </p>
                  <a 
                    href={result.qrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-emerald-600/20"
                  >
                    <Download className="w-3.5 h-3.5 text-white" />
                    <span>Download QR Code</span>
                  </a>
                </div>
              )}

              {activeTool === "thumbnail" && (
                <div className="space-y-4">
                  <div className="aspect-video max-w-md mx-auto rounded-xl overflow-hidden border border-emerald-200 shadow-md">
                    <img src={result.max} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                    <a href={result.max} target="_blank" rel="noreferrer" className="py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 transition-colors">
                      MAX RESOLUTION (1080p)
                    </a>
                    <a href={result.hq} target="_blank" rel="noreferrer" className="py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 transition-colors">
                      HIGH RES (720p)
                    </a>
                    <a href={result.mq} target="_blank" rel="noreferrer" className="py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 transition-colors">
                      STANDARD (480p)
                    </a>
                  </div>
                </div>
              )}

              {activeTool === "profile" && (
                <div className="space-y-4">
                  <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-4 border-emerald-500 shadow-xl relative group">
                    <img 
                      src={result.profileUrl} 
                      alt="Profile Avatar HD" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600";
                      }}
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <span className="font-extrabold text-slate-900 block text-base">{result.handle}</span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {result.platform}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {result.resolution}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDownloadProfileImage(result.profileUrl)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                  >
                    <Download className="w-4 h-4 text-white" />
                    <span>Save HD Profile Picture</span>
                  </button>
                </div>
              )}

              {activeTool === "analyzer" && (
                <div className="max-w-md mx-auto p-4 bg-white/95 border border-emerald-200 rounded-2xl text-left space-y-3 shadow-2xs">
                  <div className="flex justify-between items-center text-xs border-b border-emerald-100 pb-2">
                    <span className="text-slate-500 font-semibold uppercase">Host Domain:</span>
                    <span className="text-slate-900 font-extrabold truncate max-w-[200px]">{result.hostname}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-emerald-100 pb-2">
                    <span className="text-slate-500 font-semibold uppercase">Platform Network:</span>
                    <span className="text-emerald-800 font-extrabold">{result.detectedPlatform}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-emerald-100 pb-2">
                    <span className="text-slate-500 font-semibold uppercase">Response Code:</span>
                    <span className="text-emerald-700 font-black px-2 py-0.5 bg-emerald-100 rounded">{result.responseCode}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-emerald-100 pb-2">
                    <span className="text-slate-500 font-semibold uppercase">Content Type:</span>
                    <span className="text-slate-800 font-bold truncate max-w-[180px]">{result.contentType}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-emerald-100 pb-2">
                    <span className="text-slate-500 font-semibold uppercase">Content Length:</span>
                    <span className="text-slate-800 font-bold">{result.fileSizeFormatted}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-emerald-100 pb-2">
                    <span className="text-slate-500 font-semibold uppercase">Server / CDN Node:</span>
                    <span className="text-slate-800 font-bold">{result.serverHeader}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold uppercase">SSL Encryption:</span>
                    <span className="text-emerald-700 font-bold">{result.sslSecure ? "🔒 Secure (256-bit HTTPS)" : "⚠️ Insecure HTTP"}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
