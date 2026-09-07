import { useState } from "react";
import { 
  Download, 
  Play, 
  Music, 
  Image as ImageIcon, 
  File, 
  User, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
  Hash,
  FileText,
  Volume2,
  Eye,
  AlignLeft,
  Sparkles,
  CheckCheck,
  Tag,
  ChevronDown,
  ChevronUp,
  AtSign,
  ExternalLink
} from "lucide-react";
import { DownloadResult, DownloaderSubTab, MediaItem } from "../types";
import { getPlatformIcon, platforms } from "./PlatformChips";
import { useLanguage } from "../context/LanguageContext";
import { DownloadAnimationModal } from "./DownloadAnimationModal";
import { getApiUrl } from "../utils/api";

interface ResultCardProps {
  result: DownloadResult;
  onClear: () => void;
  activeSubTab: DownloaderSubTab;
}

export default function ResultCard({ result, onClear, activeSubTab }: ResultCardProps) {
  const { t } = useLanguage();
  const activePlatform = platforms.find((p) => p.id === result.platform);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedSingleTag, setCopiedSingleTag] = useState<string | null>(null);
  const [activeMetaTab, setActiveMetaTab] = useState<"caption" | "description" | "hashtags">("caption");
  const [isExpanded, setIsExpanded] = useState(false);
  const [downloadingItem, setDownloadingItem] = useState<MediaItem | null>(null);

  // Find first streamable video or audio for preview
  const videoMedia = result.media.filter((m) => m.type === "video");
  const audioMedia = result.media.filter((m) => m.type === "audio");
  const imageMedia = result.media.filter((m) => m.type === "image");

  const [selectedPreviewStream, setSelectedPreviewStream] = useState<string>(
    videoMedia[0]?.url || audioMedia[0]?.url || ""
  );

  const isVideoAvailable = videoMedia.length > 0;
  const isAudioAvailable = !isVideoAvailable && audioMedia.length > 0;

  const youtubeVideoId = result.youtubeId || (() => {
    if (result.thumbnail) {
      const m = result.thumbnail.match(/\/vi\/([a-zA-Z0-9_-]{11})\//);
      if (m) return m[1];
    }
    for (const m of result.media) {
      if (m.url && typeof m.url === "string") {
        const match = m.url.match(/(?:youtu\.be\/|v=|\/watch\?v=|\/embed\/|\/shorts\/)([a-zA-Z0-9_-]{11})/);
        if (match) return match[1];
      }
    }
    return null;
  })();

  const instagramShortcode = result.shortcode || (result.platform === "instagram" ? (() => {
    if (result.thumbnail) {
      const match = result.thumbnail.match(/\/(?:p|reel|reels)\/([a-zA-Z0-9_-]+)/);
      if (match) return match[1];
    }
    for (const m of result.media) {
      if (m.url && typeof m.url === "string") {
        const match = m.url.match(/(?:shortcode=|\/p\/|\/reel\/)([a-zA-Z0-9_-]+)/);
        if (match) return match[1];
      }
    }
    return undefined;
  })() : undefined);

  const getStreamUrl = (url: any) => {
    if (!url || typeof url !== "string") return "";
    if (url.startsWith("blob:") || url.startsWith("data:")) return url;
    if (url.startsWith("/api/")) return getApiUrl(url);
    return getApiUrl(`/api/stream-preview?url=${encodeURIComponent(url)}`);
  };

  const getPosterUrl = (url: any) => {
    if (!url || typeof url !== "string") return undefined;
    if (url.startsWith("blob:") || url.startsWith("data:")) return url;
    if (url.includes("instagram.com") || url.includes("cdninstagram") || url.includes("facebook.com") || url.includes("fbcdn")) {
      return getApiUrl(`/api/proxy-image?url=${encodeURIComponent(url)}&name=Preview`);
    }
    return url;
  };

  // Caption, Description & Hashtag parsing
  const fullCaption = (result.caption || result.title || "").trim();
  const fullDescription = (result.description || result.caption || result.title || "").trim();
  const hashtags = (result.hashtags && result.hashtags.length > 0)
    ? result.hashtags
    : Array.from(new Set(`${fullCaption} ${fullDescription}`.match(/#[a-zA-Z0-9_\u0980-\u09FF]+/g) || []));

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    }
  };

  const handleCopyCaption = async () => {
    if (!fullCaption) return;
    await copyToClipboard(fullCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyDescription = async () => {
    if (!fullDescription) return;
    await copyToClipboard(fullDescription);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  const handleCopyHashtags = async () => {
    if (hashtags.length === 0) return;
    const tagsString = hashtags.join(" ");
    await copyToClipboard(tagsString);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const handleCopySingleTag = async (tag: string) => {
    await copyToClipboard(tag);
    setCopiedSingleTag(tag);
    setTimeout(() => setCopiedSingleTag(null), 2000);
  };

  const handleCopyAll = async () => {
    const parts: string[] = [];
    if (fullCaption) parts.push(`[CAPTION]\n${fullCaption}`);
    if (fullDescription && fullDescription !== fullCaption) parts.push(`[DESCRIPTION]\n${fullDescription}`);
    if (hashtags.length > 0) parts.push(`[HASHTAGS]\n${hashtags.join(" ")}`);
    const combined = parts.join("\n\n");
    if (!combined) return;
    await copyToClipboard(combined);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const getMediaBadgeColor = (type: string) => {
    switch (type) {
      case "video":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "audio":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "image":
        return "bg-cyan-50 text-cyan-700 border-cyan-200";
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  const getMediaIcon = (type: string, className: string = "w-4 h-4") => {
    switch (type) {
      case "video":
        return <Play className={className} />;
      case "audio":
        return <Music className={className} />;
      case "image":
        return <ImageIcon className={className} />;
      default:
        return <File className={className} />;
    }
  };

  // Filter media items according to active sub-tab
  const filteredMedia = result.media.filter((item) => {
    if (activeSubTab === "all") return true;
    if (activeSubTab === "video" && item.type === "video") return true;
    if (activeSubTab === "audio" && item.type === "audio") return true;
    if (activeSubTab === "image" && item.type === "image") return true;
    if (activeSubTab === "thumbnail" && item.type === "image") return true;
    return true;
  });

  return (
    <div id="result-card-container" className="w-full max-w-4xl mx-auto mt-6 liquid-glass-card rounded-3xl shadow-xl overflow-hidden transition-all duration-300">
      
      {/* 🚀 Header Ribbon */}
      <div 
        id="result-header-ribbon" 
        className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-emerald-100/90 bg-white/80 backdrop-blur-md"
      >
        <div className="flex items-center gap-2.5">
          {activePlatform ? (
            <div className={`p-1.5 rounded-xl ${activePlatform.badgeBg} ${activePlatform.badgeText} flex items-center justify-center border border-white shadow-2xs`}>
              {getPlatformIcon(activePlatform.iconName, "w-4 h-4")}
            </div>
          ) : (
            <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center border border-emerald-200">
              <Download className="w-4 h-4" />
            </div>
          )}
          <span className="text-xs font-black text-slate-900 uppercase tracking-widest font-display">
            {activePlatform?.name || "Detected Platform"} • {t.result.readyToDownload}
          </span>
        </div>

        <button
          id="btn-clear-result"
          onClick={onClear}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-emerald-950 transition-colors py-1.5 px-3 rounded-xl hover:bg-emerald-50 cursor-pointer border border-transparent hover:border-emerald-200"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t.result.clearNewLink}</span>
        </button>
      </div>

      <div id="result-body-grid" className="p-5 sm:p-7 space-y-6">
        
        {/* 🎬 Top Section: Live Video / Audio Player Preview System */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Player & Preview Canvas */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                </span>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-display flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.result.mediaPreviewPlayer}</span>
                </span>
              </div>

              {/* Stream Switcher if multiple video streams */}
              {videoMedia.length > 1 && (
                <select
                  value={selectedPreviewStream || ""}
                  onChange={(e) => setSelectedPreviewStream(e.target.value)}
                  className="bg-white border border-emerald-200 text-[11px] font-semibold text-emerald-900 rounded-lg px-2.5 py-1 outline-hidden cursor-pointer shadow-2xs"
                >
                  {videoMedia.map((m, i) => (
                    <option key={i} value={m.url || ""}>
                      {m.quality || `Stream ${i + 1}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Video / Audio Player Container */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-emerald-100 shadow-md flex items-center justify-center group">
              {youtubeVideoId ? (
                <iframe
                  key={youtubeVideoId}
                  src={`https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`}
                  title={result.title}
                  className="w-full h-full border-0 rounded-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : result.platform === "instagram" && instagramShortcode ? (
                <iframe
                  key={instagramShortcode}
                  src={`https://www.instagram.com/p/${instagramShortcode}/embed/`}
                  title={result.title || "Instagram Video Preview"}
                  className="w-full h-full border-0 rounded-2xl bg-black"
                  allowFullScreen
                  scrolling="no"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              ) : isVideoAvailable && (selectedPreviewStream || videoMedia[0]?.url) ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <video 
                    id="media-preview-player"
                    key={selectedPreviewStream || videoMedia[0]?.url}
                    controls 
                    playsInline 
                    poster={getPosterUrl(result.thumbnail) || undefined} 
                    src={getStreamUrl(selectedPreviewStream || videoMedia[0]?.url) || undefined} 
                    className="w-full h-full object-contain bg-black"
                    preload="metadata"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  >
                    {t.result.videoPlayerUnsupported}
                  </video>
                  <div className="hidden absolute inset-0 flex-col items-center justify-center p-4 bg-slate-900/95 text-center">
                    {result.thumbnail && (
                      <img 
                        src={getPosterUrl(result.thumbnail) || result.thumbnail} 
                        alt={result.title} 
                        className="absolute inset-0 w-full h-full object-cover opacity-30" 
                      />
                    )}
                    <div className="relative z-10 space-y-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center mx-auto text-emerald-400">
                        <Play className="w-6 h-6 fill-emerald-400" />
                      </div>
                      <p className="text-xs font-bold text-white">{result.title || "Instagram Video Preview"}</p>
                      <p className="text-[11px] text-emerald-300">Video link ready for download below.</p>
                    </div>
                  </div>
                </div>
              ) : isAudioAvailable ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-emerald-50/80 to-teal-50/80 text-center relative overflow-hidden">
                  {result.thumbnail && (
                    <img 
                      src={getPosterUrl(result.thumbnail) || result.thumbnail} 
                      alt={result.title} 
                      className="absolute inset-0 w-full h-full object-cover opacity-20 blur-md pointer-events-none" 
                    />
                  )}
                  <div className="relative z-10 space-y-3 w-full max-w-sm flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 shadow-sm">
                      <Volume2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{result.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">{result.author || "Audio Track"}</p>
                    </div>
                    {audioMedia[0]?.url && (
                      <audio 
                        controls 
                        src={getStreamUrl(audioMedia[0].url)} 
                        className="w-full mt-2" 
                        preload="metadata"
                      />
                    )}
                  </div>
                </div>
              ) : result.thumbnail ? (
                <img 
                  src={getPosterUrl(result.thumbnail) || result.thumbnail} 
                  alt={result.title} 
                  className="w-full h-full object-cover" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <Play className="w-10 h-10 text-emerald-600 mb-2" />
                  <span className="text-xs font-medium text-slate-500">{t.result.previewNotAvailable}</span>
                </div>
              )}

              {result.duration && !isVideoAvailable && (
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/85 text-[10px] font-bold text-white tracking-wider flex items-center gap-1 border border-white/10">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{result.duration}</span>
                </div>
              )}
            </div>
            
            <p className="text-[11px] text-slate-500 text-center sm:text-left flex items-center gap-1.5">
              <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
              <span>{t.result.previewDesc}</span>
            </p>
          </div>

          {/* Right Column: Title, Author & Stream Downloads */}
          <div className="lg:col-span-5 space-y-4">
            {/* Title & Author Info */}
            <div className="space-y-2 p-4 bg-white/80 border border-emerald-100 rounded-2xl shadow-2xs">
              <h2 id="result-title" className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2" title={result.title}>
                {result.title || "Social Media Video"}
              </h2>
              
              {result.author && (
                <div id="result-author" className="flex items-center justify-between text-xs text-emerald-800 font-medium pt-1 border-t border-emerald-50">
                  <div className="flex items-center gap-2 truncate min-w-0">
                    <User className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{result.author}</span>
                  </div>
                  {result.authorUsername && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md flex-shrink-0 flex items-center gap-1">
                      <AtSign className="w-2.5 h-2.5" />
                      <span>{result.authorUsername.replace(/^@/, '')}</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Available Download Links */}
            <div id="download-options-block" className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-800">
                  {activeSubTab === "all" ? t.result.availableStreams : `${activeSubTab.toUpperCase()} STREAMS`}
                </span>
                <span className="text-[10px] font-semibold text-slate-500">
                  {filteredMedia.length} {t.result.links}
                </span>
              </div>

              {filteredMedia.length === 0 ? (
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-amber-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{t.result.noStreamsFound}</span>
                </div>
              ) : (
                <div className="grid gap-2 max-h-64 overflow-y-auto pr-1">
                  {filteredMedia.map((item, index) => (
                    <div 
                      key={index}
                      id={`download-option-${index}`}
                      className="flex items-center justify-between p-3 bg-white/90 hover:bg-white border border-emerald-100 hover:border-emerald-300 rounded-xl transition-all gap-2 shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-lg border flex-shrink-0 flex items-center justify-center ${getMediaBadgeColor(item.type)}`}>
                          {getMediaIcon(item.type, "w-3.5 h-3.5")}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 truncate block">
                            {item.quality}
                          </span>
                          {item.size && (
                            <span className="text-[9px] font-medium text-slate-500 block">
                              {item.size}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setDownloadingItem(item)}
                          className="flex items-center gap-1.5 py-1.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5 text-white" />
                          <span>{t.result.download}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 📝 Bottom Section: Comprehensive Post Caption, Description & Hashtags Engine */}
        {(fullCaption || fullDescription || hashtags.length > 0) && (
          <div id="caption-hashtags-section" className="p-4 sm:p-5 bg-white/90 border border-emerald-100 rounded-2xl space-y-3.5 shadow-2xs">
            {/* Header with View Tabs & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-emerald-50">
              
              {/* Tabs: Caption | Description | Hashtags */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/70">
                <button
                  type="button"
                  onClick={() => setActiveMetaTab("caption")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeMetaTab === "caption"
                      ? "bg-white text-emerald-800 shadow-2xs border border-emerald-100"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.result.postCaption}</span>
                </button>

                {fullDescription && fullDescription !== fullCaption && (
                  <button
                    type="button"
                    onClick={() => setActiveMetaTab("description")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeMetaTab === "description"
                        ? "bg-white text-emerald-800 shadow-2xs border border-emerald-100"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <AlignLeft className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.result.postDescription}</span>
                  </button>
                )}

                {hashtags.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveMetaTab("hashtags")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeMetaTab === "hashtags"
                        ? "bg-white text-emerald-800 shadow-2xs border border-emerald-100"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.result.hashtagsLabel}</span>
                    <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-emerald-100 text-emerald-800 font-extrabold">
                      {hashtags.length}
                    </span>
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center flex-wrap gap-2">
                {/* Copy Everything Button */}
                <button
                  type="button"
                  onClick={handleCopyAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all cursor-pointer border border-slate-200"
                  title="Copy Caption, Description, and all Hashtags together"
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{copiedAll ? t.result.copied : t.result.copyAll}</span>
                </button>

                {/* Tab Specific Copy */}
                {activeMetaTab === "caption" && fullCaption && (
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    {copiedCaption ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                    <span>{copiedCaption ? t.result.copied : t.result.copyCaption}</span>
                  </button>
                )}

                {activeMetaTab === "description" && fullDescription && (
                  <button
                    type="button"
                    onClick={handleCopyDescription}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    {copiedDesc ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5 text-white" />}
                    <span>{copiedDesc ? t.result.copied : t.result.copyDescription}</span>
                  </button>
                )}

                {activeMetaTab === "hashtags" && hashtags.length > 0 && (
                  <button
                    type="button"
                    onClick={handleCopyHashtags}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    {copiedTags ? <Check className="w-3.5 h-3.5 text-white" /> : <Hash className="w-3.5 h-3.5 text-white" />}
                    <span>{copiedTags ? t.result.copied : t.result.copyHashtags}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Active Tab Content Area */}
            {activeMetaTab === "caption" && (
              <div className="space-y-2">
                <div className={`p-4 bg-slate-50/90 rounded-xl border border-slate-200/80 text-xs text-slate-800 font-normal leading-relaxed whitespace-pre-wrap select-text transition-all ${
                  isExpanded ? "max-h-none" : "max-h-36 overflow-y-auto"
                }`}>
                  {fullCaption}
                </div>
                {fullCaption.length > 250 && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        <span>Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        <span>Show Full Text</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {activeMetaTab === "description" && (
              <div className="space-y-2">
                <div className={`p-4 bg-slate-50/90 rounded-xl border border-slate-200/80 text-xs text-slate-800 font-normal leading-relaxed whitespace-pre-wrap select-text transition-all ${
                  isExpanded ? "max-h-none" : "max-h-48 overflow-y-auto"
                }`}>
                  {fullDescription}
                </div>
                {fullDescription.length > 250 && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="w-3 h-3" />
                        <span>Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3 h-3" />
                        <span>Show Full Text</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {activeMetaTab === "hashtags" && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 max-h-48 overflow-y-auto">
                  {hashtags.map((tag, idx) => {
                    const isJustCopied = copiedSingleTag === tag;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleCopySingleTag(tag)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer active:scale-95 border ${
                          isJustCopied
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                            : "bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200/90 hover:border-emerald-300"
                        }`}
                        title="Click to copy this hashtag"
                      >
                        {isJustCopied ? <Check className="w-3 h-3 text-white" /> : <Hash className="w-3 h-3 text-emerald-600" />}
                        <span>{tag}</span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 italic">
                  💡 Tip: Click on any hashtag above to copy it individually, or use the copy buttons to get all tags at once.
                </p>
              </div>
            )}

            {/* Quick Hashtag Preview (when on Caption or Description tab) */}
            {activeMetaTab !== "hashtags" && hashtags.length > 0 && (
              <div className="pt-2 border-t border-emerald-50/80 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-emerald-600" />
                  <span>Hashtags:</span>
                </span>
                {hashtags.slice(0, 10).map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleCopySingleTag(tag)}
                    className="px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-800 text-[11px] font-medium transition-colors cursor-pointer"
                    title="Click to copy hashtag"
                  >
                    {copiedSingleTag === tag ? "Copied!" : tag}
                  </button>
                ))}
                {hashtags.length > 10 && (
                  <button
                    type="button"
                    onClick={() => setActiveMetaTab("hashtags")}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold cursor-pointer"
                  >
                    +{hashtags.length - 10} more
                  </button>
                )}
              </div>
            )}

            {/* Footer: Character, Word Count & Metadata Info */}
            <div className="pt-2 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span>
                  <strong>{(activeMetaTab === "description" ? fullDescription : fullCaption).length}</strong> characters
                </span>
                <span>•</span>
                <span>
                  <strong>{(activeMetaTab === "description" ? fullDescription : fullCaption).split(/\s+/).filter(Boolean).length}</strong> words
                </span>
                {hashtags.length > 0 && (
                  <>
                    <span>•</span>
                    <span>
                      <strong>{hashtags.length}</strong> hashtags
                    </span>
                  </>
                )}
              </div>

              {result.author && (
                <div className="flex items-center gap-1 text-emerald-800 font-medium">
                  <span>Author:</span>
                  <strong>{result.author}</strong>
                  {result.authorUsername && (
                    <span className="text-emerald-600">{result.authorUsername}</span>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

      </div>

      {/* 🚀 In-App Professional Download Progress Animation Modal (Zero Redirects) */}
      <DownloadAnimationModal
        isOpen={downloadingItem !== null}
        mediaItem={downloadingItem}
        mediaTitle={result.title}
        platform={result.platform}
        onClose={() => setDownloadingItem(null)}
      />
    </div>
  );
}
