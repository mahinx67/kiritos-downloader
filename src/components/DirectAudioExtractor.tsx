import { useState } from "react";
import { 
  Music, 
  Download, 
  Loader2, 
  Check, 
  AlertCircle,
  Headphones,
  Sparkles,
  Radio,
  FileAudio,
  Volume2,
  Share2
} from "lucide-react";
import { MediaItem } from "../types";
import { DownloadAnimationModal } from "./DownloadAnimationModal";
import { getApiUrl } from "../utils/api";

export function DirectAudioExtractor() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioResult, setAudioResult] = useState<any | null>(null);
  const [downloadingStream, setDownloadingStream] = useState<MediaItem | null>(null);

  const handleExtractAudio = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setAudioResult(null);

    try {
      const res = await fetch(getApiUrl("/api/audio-extract"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to extract high quality audio from link.");
      }

      const streams = data.audioStreams || [];
      const primaryAudioUrl = streams[0]?.url;

      if (!primaryAudioUrl) {
        throw new Error("No direct audio stream could be extracted from this URL.");
      }

      setAudioResult({
        title: data.title || "Audio Track",
        author: data.author || "Creator",
        thumbnail: data.thumbnail || "",
        platform: data.platform || "Social Media",
        playStreamUrl: primaryAudioUrl,
        audioStreams: streams
      });
    } catch (err: any) {
      console.error("Audio extract error:", err);
      // Fallback to /api/download if needed
      try {
        const fbRes = await fetch(getApiUrl("/api/download"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() })
        });
        const fbData = await fbRes.json();
        if (fbData.success && fbData.media?.length > 0) {
          const audioS = fbData.media.filter((m: any) => m.type === "audio" && m.url);
          const first = audioS[0] || fbData.media[0];
          setAudioResult({
            title: fbData.title || "Audio Track",
            author: fbData.author || "Creator",
            thumbnail: fbData.thumbnail || "",
            platform: fbData.platform || "Media",
            playStreamUrl: first.url,
            audioStreams: audioS.length > 0 ? audioS : [{ quality: "HQ MP3 Audio (320kbps)", type: "audio", url: first.url }]
          });
          return;
        }
      } catch {}
      setError(err.message || "Could not retrieve direct MP3. Please verify that the link is public.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
          <Music className="w-5 h-5 text-emerald-600" />
          <span>Universal Social Media → Direct MP3 Audio Downloader</span>
        </h3>
        <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
          Paste any link (YouTube, Facebook, TikTok, Reels, Instagram, SoundCloud, Spotify). It will not go to the main video download page — instead, it directly extracts the pure MP3 audio, lets you listen in the audio-only player, and gives you direct MP3 download buttons.
        </p>
      </div>

      {/* Input box */}
      <div className="p-5 bg-white/85 border border-emerald-100 rounded-2xl space-y-4 shadow-2xs">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Social Media Video or Audio Link
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              key="direct-audio-extractor-url-input"
              type="url"
              placeholder="Paste YouTube, TikTok, Reels, Spotify, or Facebook link..."
              value={url || ""}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-white border border-emerald-200 px-4 py-3 text-slate-800 text-sm rounded-xl outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 shadow-2xs placeholder-slate-400"
            />
            <button
              onClick={handleExtractAudio}
              disabled={isLoading || !url.trim()}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Extracting MP3...</span>
                </>
              ) : (
                <>
                  <Headphones className="w-4 h-4" />
                  <span>Get MP3 Audio</span>
                </>
              )}
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

      {/* Extracted Audio Player & Direct Download Cards */}
      {audioResult && (
        <div className="p-6 bg-white/95 border border-emerald-200 rounded-2xl space-y-5 shadow-sm animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-emerald-100">
            {audioResult.thumbnail ? (
              <img 
                src={audioResult.thumbnail} 
                alt="Audio Artwork" 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-emerald-200 shadow-sm" 
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
                <FileAudio className="w-8 h-8" />
              </div>
            )}

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-300">
                  {audioResult.platform} Pure Audio
                </span>
                <span className="text-[10px] font-bold text-emerald-700">320kbps Studio Audio</span>
              </div>
              <h4 className="text-base font-bold text-slate-900 leading-tight">
                {audioResult.title}
              </h4>
              <p className="text-xs text-slate-500 font-medium">
                {audioResult.author}
              </p>
            </div>
          </div>

          {/* Pure Audio Only Player */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-800 flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                Audio-Only Stream Preview:
              </span>
              <span className="text-[10px] text-slate-500 font-semibold">High Definition</span>
            </div>
            {audioResult.playStreamUrl && (
              <audio 
                controls 
                src={audioResult.playStreamUrl} 
                className="w-full h-10 rounded-lg accent-emerald-600"
              />
            )}
          </div>

          {/* Direct Download Buttons */}
          <div className="space-y-2.5 pt-1">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Audio Download Options:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {audioResult.audioStreams.map((stream: any, idx: number) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDownloadingStream({
                    quality: stream.quality || `High Quality Audio (${idx + 1})`,
                    type: "audio",
                    url: stream.url,
                    size: stream.size
                  })}
                  className="p-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center justify-between shadow-xs transition-all cursor-pointer group active:scale-95"
                >
                  <div className="flex items-center gap-2.5">
                    <Music className="w-4 h-4 text-emerald-200 group-hover:scale-110 transition-transform" />
                    <span>{stream.quality || `Direct MP3 Audio (${idx + 1})`}</span>
                  </div>
                  <Download className="w-4 h-4 text-white" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 🚀 In-App Professional Download Progress Animation Modal */}
      <DownloadAnimationModal
        isOpen={downloadingStream !== null}
        mediaItem={downloadingStream}
        mediaTitle={audioResult?.title || "Audio Stream"}
        platform="Audio"
        onClose={() => setDownloadingStream(null)}
      />
    </div>
  );
}
