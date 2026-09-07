import { useState, useEffect, FormEvent, ChangeEvent, useRef } from "react";
import { 
  Link as LinkIcon, 
  Clipboard, 
  X, 
  Check, 
  AlertCircle, 
  Download, 
  Loader2,
  Layers,
  Video,
  Music,
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import { platforms, getPlatformIcon } from "./PlatformChips";
import { PlatformConfig, DownloaderSubTab } from "../types";
import { useLanguage } from "../context/LanguageContext";

interface DownloaderFormProps {
  onSubmit: (url: string, type: DownloaderSubTab) => void;
  isLoading: boolean;
  externalUrl?: string; // To allow filling from platform chips
  onClearExternal?: () => void;
  activeSubTab: DownloaderSubTab;
  setActiveSubTab: (tab: DownloaderSubTab) => void;
}

export default function DownloaderForm({ 
  onSubmit, 
  isLoading, 
  externalUrl, 
  onClearExternal,
  activeSubTab,
  setActiveSubTab
}: DownloaderFormProps) {
  const { t } = useLanguage();
  const [url, setUrl] = useState("");
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformConfig | null>(null);
  const [isPasted, setIsPasted] = useState(false);
  const [showEmptyWarning, setShowEmptyWarning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync externalUrl if passed from parent
  useEffect(() => {
    if (externalUrl) {
      setUrl(externalUrl);
      detectPlatform(externalUrl);
      if (onClearExternal) onClearExternal();
    }
  }, [externalUrl]);

  // Real-time platform detection as user types
  const detectPlatform = (input: string) => {
    if (!input) {
      setDetectedPlatform(null);
      return;
    }

    try {
      const match = platforms.find((platform) => {
        return platform.domains.some((domain) => {
          return input.toLowerCase().includes(domain);
        });
      });
      setDetectedPlatform(match || null);
    } catch {
      setDetectedPlatform(null);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrl(val);
    detectPlatform(val);
    if (showEmptyWarning) setShowEmptyWarning(false);
  };

  const handleClear = () => {
    setUrl("");
    setDetectedPlatform(null);
    setShowEmptyWarning(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        detectPlatform(text);
        setIsPasted(true);
        setShowEmptyWarning(false);
        setTimeout(() => setIsPasted(false), 2000);
      }
    } catch (err) {
      console.warn("Clipboard access denied or unavailable in iframe", err);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim(), activeSubTab);
    } else {
      setShowEmptyWarning(true);
      if (inputRef.current) inputRef.current.focus();
      setTimeout(() => setShowEmptyWarning(false), 3000);
    }
  };

  const subTabs: { id: DownloaderSubTab; label: string; icon: typeof Layers }[] = [
    { id: "all", label: "All Media", icon: Layers },
    { id: "video", label: "Video", icon: Video },
    { id: "audio", label: "Audio (MP3)", icon: Music },
    { id: "image", label: "Images", icon: ImageIcon },
    { id: "thumbnail", label: "Thumbnails", icon: Sparkles },
  ];

  return (
    <div id="downloader-form-card" className="w-full max-w-3xl mx-auto px-2 sm:px-4 mt-2">
      <div className="liquid-glass-card rounded-3xl p-5 sm:p-7 relative overflow-hidden border border-white/90 shadow-xl">
        {/* Soft water-glow accent beneath */}
        <div className="absolute -top-24 -left-24 w-56 h-56 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-teal-200/35 blur-3xl pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative flex items-center">
            {/* Input Prefix: Minimal clean link icon */}
            <div className="absolute left-4 text-emerald-800 pointer-events-none flex items-center justify-center">
              <LinkIcon className="w-5 h-5 stroke-[2]" />
            </div>

            {/* Input Element */}
            <input
              key="main-video-url-input"
              ref={inputRef}
              id="video-url-input"
              type="url"
              placeholder={t.downloader.placeholder}
              value={url || ""}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-full pl-11 pr-24 sm:pr-28 py-3.5 sm:py-4 liquid-glass-input text-slate-900 placeholder:text-slate-500 text-xs sm:text-sm md:text-base rounded-2xl outline-hidden font-bold transition-all focus:border-emerald-600 focus:ring-4 focus:ring-emerald-500/20 focus:bg-white shadow-inner"
            />

            {/* Actions inside the input box */}
            <div className="absolute right-2.5 flex items-center gap-1">
              {url ? (
                <button
                  type="button"
                  id="btn-clear-input"
                  onClick={handleClear}
                  className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-200/80 cursor-pointer transition-colors"
                  title={t.downloader.clear}
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-paste-clipboard"
                  onClick={handlePaste}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 rounded-xl text-xs font-extrabold transition-all cursor-pointer border border-emerald-300 shadow-2xs"
                  title={t.downloader.paste}
                >
                  {isPasted ? <Check className="w-3.5 h-3.5 text-emerald-800" /> : <Clipboard className="w-3.5 h-3.5 text-emerald-800" />}
                  <span>{isPasted ? t.downloader.pasted : t.downloader.paste}</span>
                </button>
              )}
            </div>
          </div>

          {/* Real-time platform detected pill */}
          {detectedPlatform && (
            <div id="detection-pill" className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-950 w-fit animate-fade-in shadow-2xs">
              {getPlatformIcon(detectedPlatform.iconName, "w-4 h-4 text-emerald-800")}
              <span>{t.downloader.detectedPlatform}: {detectedPlatform.name}</span>
            </div>
          )}

          {/* Empty link notification reminder */}
          {showEmptyWarning && (
            <div className="text-xs text-amber-900 font-bold bg-amber-100 border border-amber-300 px-3 py-2 rounded-xl flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>{t.downloader.emptyWarning}</span>
            </div>
          )}

          {/* Download Button with Vivid Emerald Theme - ALWAYS Visible, Crisp and High Contrast */}
          <button
            type="submit"
            id="btn-extract-links"
            disabled={isLoading}
            className="relative group w-full flex items-center justify-center gap-2.5 py-4 px-6 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:from-emerald-700 active:to-teal-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer select-none overflow-hidden active:scale-[0.99]"
          >
            {/* Live glowing pulse ring when URL is provided */}
            {!isLoading && url.trim() && (
              <span className="absolute inset-0 rounded-2xl bg-emerald-400/30 animate-ping pointer-events-none"></span>
            )}

            {/* Live shimmer sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></span>

            <span className="relative flex items-center gap-2.5">
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                  <span className="font-bold text-white tracking-wide">{t.downloader.fetching}</span>
                </>
              ) : (
                <>
                  {/* Live pulsing indicator beacon */}
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  <span className="tracking-wider font-black font-display uppercase text-sm text-white drop-shadow-xs">
                    {t.downloader.download}
                  </span>
                  <Download className="w-4 h-4 text-white group-hover:translate-y-0.5 transition-transform duration-200" />
                </>
              )}
            </span>
          </button>
        </form>

        {/* Clean Footer note with high legibility */}
        <div className="flex items-center justify-center gap-2 mt-3.5 text-xs text-slate-700 font-semibold text-center">
          <AlertCircle className="w-4 h-4 text-emerald-700" />
          <span>{t.downloader.worksWithNote}</span>
        </div>
      </div>
    </div>
  );
}
