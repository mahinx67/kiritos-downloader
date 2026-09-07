import { useState, useEffect, FormEvent } from "react";
import { 
  Check, 
  Mail, 
  ShieldCheck, 
  FileText, 
  BookOpen, 
  Info, 
  Layers, 
  HelpCircle, 
  Globe, 
  ExternalLink,
  ChevronDown,
  Trash2,
  Send,
  AlertCircle,
  CornerDownRight,
  Sparkles,
  Download
} from "lucide-react";
import { platforms, getPlatformIcon } from "./PlatformChips";
import { RecentDownloadItem } from "../types";
import { useAdminStore } from "../utils/adminStore";
import { useLanguage } from "../context/LanguageContext";

/* ============================================================================
   1. SUPPORTED PLATFORMS VIEW
   ============================================================================ */
interface SupportedPlatformsProps {
  onSelectPlatform: (url: string) => void;
  initialFilter?: string;
}

export function SupportedPlatforms({ onSelectPlatform, initialFilter = "all" }: SupportedPlatformsProps) {
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);

  useEffect(() => {
    if (initialFilter) {
      setSelectedFilter(initialFilter);
    }
  }, [initialFilter]);

  const getExampleUrl = (id: string) => {
    switch (id) {
      case "youtube": return "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      case "tiktok": return "https://www.tiktok.com/@scout2015/video/6768111090023435526";
      case "instagram": return "https://www.instagram.com/reel/C35_P56v1aR/";
      case "facebook": return "https://www.facebook.com/watch/?v=123456789";
      case "twitter": return "https://x.com/SpaceX/status/123456789";
      case "reddit": return "https://www.reddit.com/r/funny/comments/1234567";
      case "spotify": return "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT";
      case "pinterest": return "https://www.pinterest.com/pin/123456789/";
      default: return "";
    }
  };

  const platformGuides: Record<string, { formats: string[]; steps: string[] }> = {
    youtube: {
      formats: ["4K Ultra HD MP4", "1080p 60fps Full HD", "720p HD", "320kbps MP3 Audio", "YouTube Shorts", "Cover Thumbnails"],
      steps: ["Open YouTube app or web page", "Click Share button under the video or Short", "Select 'Copy link'", "Paste in Kiritos and click Extract Streams"]
    },
    facebook: {
      formats: ["1080p HD Video", "720p Video", "Facebook Reels", "Facebook Watch Streams", "Public MP3 Audio"],
      steps: ["Navigate to any public Facebook video post or Reel", "Click the 3 dots (...) or Share icon", "Click 'Copy link'", "Paste in Kiritos Downloader"]
    },
    instagram: {
      formats: ["Instagram Reels (Audio + Video)", "Instagram Stories", "Carousel Photo Slides", "IGTV & Feed Videos"],
      steps: ["Open Instagram and find the Reel or Post", "Tap the Paper Airplane (Share) or 3 dots", "Tap 'Copy link'", "Paste in Kiritos and click Extract Streams"]
    },
    tiktok: {
      formats: ["HD Video (No Watermark)", "Original Video with Watermark", "TikTok Original MP3 Audio", "TikTok Slide Images"],
      steps: ["Open TikTok and tap the Share arrow", "Tap 'Copy link'", "Paste in Kiritos Downloader", "Download high-speed stream without watermark"]
    },
    twitter: {
      formats: ["Full HD MP4 Video", "High Resolution GIF Stream", "Audio Streams"],
      steps: ["Click Share icon below any tweet with video", "Choose 'Copy link to Post'", "Paste link in Kiritos", "Save video locally"]
    },
    reddit: {
      formats: ["Merged Audio + Video MP4", "Soundless MP4", "High Res Images", "GIF animations"],
      steps: ["Open the Reddit post", "Click Share -> Copy Link", "Paste in Kiritos", "Download audio-synchronized video"]
    }
  };

  const filterTabs = [
    { id: "all", label: "All Platforms" },
    { id: "youtube", label: "YouTube" },
    { id: "facebook", label: "Facebook" },
    { id: "instagram", label: "Instagram" },
    { id: "tiktok", label: "TikTok" },
    { id: "twitter", label: "X (Twitter)" },
    { id: "reddit", label: "Reddit" },
    { id: "others", label: "Other Platforms" }
  ];

  const filteredPlatforms = platforms.filter((p) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "others") {
      return !["youtube", "facebook", "instagram", "tiktok", "twitter", "reddit"].includes(p.id);
    }
    return p.id === selectedFilter;
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-4">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-slate-900 font-display flex items-center justify-center gap-2">
          <Globe className="w-6 h-6 text-emerald-600" />
          <span>Supported Platforms Suite</span>
        </h3>
        <p className="text-slate-600 text-xs max-w-md mx-auto">
          Universal media extraction engine supporting 17+ global social networks, streaming sites, and video hosts.
        </p>
      </div>

      {/* Platform Category Selector */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-white/70 backdrop-blur-md border border-emerald-100 rounded-2xl max-w-3xl mx-auto shadow-xs">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedFilter === tab.id
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-emerald-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Specific Platform Guide if one is chosen */}
      {selectedFilter !== "all" && selectedFilter !== "others" && platformGuides[selectedFilter] && (
        <div className="p-6 liquid-glass-card rounded-2xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                {selectedFilter.toUpperCase()} OPTIMIZED EXTRACTION
              </h4>
              <p className="text-xs text-slate-600">High-speed resolution & audio stripping guidelines</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block">
                Available Stream Types:
              </span>
              <ul className="space-y-1">
                {platformGuides[selectedFilter].formats.map((fmt, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>{fmt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 block">
                How to copy stream link:
              </span>
              <ol className="space-y-1 text-xs text-slate-600">
                {platformGuides[selectedFilter].steps.map((st, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold">{i + 1}.</span>
                    <span>{st}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {getExampleUrl(selectedFilter) && (
            <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
              <span className="text-xs text-slate-600">Test with a verified public media asset:</span>
              <button
                onClick={() => onSelectPlatform(getExampleUrl(selectedFilter))}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 cursor-pointer transition-all"
              >
                <span>Launch Test Downloader</span>
                <CornerDownRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Grid of Platforms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlatforms.map((platform) => {
          const sample = getExampleUrl(platform.id);
          return (
            <div 
              key={platform.id}
              className="p-5 liquid-glass-card rounded-2xl flex flex-col justify-between hover:scale-[1.01] transition-all group shadow-xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-white border border-emerald-200 text-slate-800 group-hover:text-emerald-700 transition-colors shadow-2xs">
                  {getPlatformIcon(platform.iconName, "w-5 h-5")}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    {platform.name}
                  </h4>
                  <p className="text-[10px] text-slate-600 font-extrabold tracking-wider mt-1 block uppercase">
                    Domains: {platform.domains.slice(0, 2).join(", ")}
                  </p>
                </div>
              </div>

              {sample ? (
                <button
                  onClick={() => onSelectPlatform(sample)}
                  className="mt-4 w-full py-2 bg-white hover:bg-emerald-50 border border-emerald-300 hover:border-emerald-400 rounded-xl text-[10px] font-extrabold uppercase tracking-widest text-emerald-900 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>Load Sample Link</span>
                  <CornerDownRight className="w-3 h-3 text-emerald-700" />
                </button>
              ) : (
                <div className="mt-4 w-full py-2 bg-emerald-50/80 border border-emerald-200 rounded-xl text-center text-[9px] font-extrabold uppercase tracking-widest text-emerald-800">
                  Fully Supported
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   2. RECENT DOWNLOADS LIST VIEW
   ============================================================================ */
interface RecentDownloadsProps {
  downloads: RecentDownloadItem[];
  onClear: () => void;
  onSelect: (url: string) => void;
}

export function RecentDownloads({ downloads, onClear, onSelect }: RecentDownloadsProps) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4">
      <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-600" />
            <span>{t.history.title}</span>
          </h3>
          <p className="text-slate-600 text-xs mt-1 font-medium">{t.history.desc}</p>
        </div>
        {downloads.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.history.clearHistory}</span>
          </button>
        )}
      </div>

      {downloads.length === 0 ? (
        <div className="p-12 text-center liquid-glass-card rounded-2xl">
          <Download className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <span className="block text-xs font-bold text-slate-800 uppercase tracking-widest">{t.history.noDownloads}</span>
          <p className="text-[11px] text-slate-600 font-medium mt-1 max-w-xs mx-auto">
            {t.history.noDownloadsDesc}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {downloads.map((item) => (
            <div 
              key={item.id}
              className="p-4 liquid-glass-card rounded-xl flex items-center justify-between gap-4 hover:border-emerald-300 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-emerald-50 rounded-lg overflow-hidden flex-shrink-0 border border-emerald-200">
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-emerald-600 bg-emerald-50">
                      <Download className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div>
                  <span className="block text-xs font-bold text-slate-900 line-clamp-1">{item.title}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider border border-emerald-200">
                      {item.platform}
                    </span>
                    <span className="text-[9px] text-slate-500 font-medium">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelect(item.url)}
                className="px-3 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-300 text-emerald-800 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                {t.history.reopen}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   3. GUIDES & FAQ VIEW
   ============================================================================ */
export function GuidesSection() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const { faqs: customFaqs } = useAdminStore();
  const { t, language } = useLanguage();

  const standardFaqs = language === "bn" ? t.infoPages.faqs : [
    {
      q: "How do I download videos using KIRITOS?",
      a: "It is super simple! First, copy the video link from any social platform (YouTube, TikTok, Facebook, Instagram, etc.). Then paste the URL into the input field above and click 'Download'. Finally, pick your preferred quality and save the file."
    },
    {
      q: "Do I need to sign up or log in to use Kiritos?",
      a: "Absolutely not. KIRITOS is designed with a deep focus on privacy. We do not require usernames, passwords, or personal credentials. Unlimited downloads are completely free."
    },
    {
      q: "Can I download TikTok & Reels without watermark?",
      a: "Yes! KIRITOS downloads original high-definition videos from TikTok and Instagram Reels without any watermark."
    },
    {
      q: "How can I convert videos to MP3 audio directly?",
      a: "Paste your video link and choose the 'Audio (MP3)' option in the results card, or use the MP3 Converter in the Tools section."
    },
    {
      q: "Why do some downloads fail with a parsing error?",
      a: "This typically occurs if the original social media creator set their post to 'Private' or deleted it. Please verify that the post is public."
    }
  ];

  const allFaqs = [
    ...customFaqs.map(cf => ({ q: cf.question, a: cf.answer, isCustom: true })),
    ...standardFaqs
  ];

  const formats = [
    { ext: "MP4", desc: "Ultra HD / Full HD / Standard Video streams with variable quality outputs" },
    { ext: "MP3", desc: "Premium studio resolution audio files encoded with lossy-to-lossless parameters" },
    { ext: "WebP", desc: "Highly optimized modern imagery streams engineered for blazing speeds on standard browsers" },
    { ext: "JPG", desc: "Lossless extraction of social posts cover graphics, avatars, and timeline metadata imagery" }
  ];

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-4">
      {/* 1. Tutorial Block */}
      <div className="p-6 liquid-glass-card rounded-2xl space-y-4 shadow-xs">
        <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>{t.infoPages.tutorialTitle}</span>
        </h3>
        <ol className="space-y-3.5 text-xs text-slate-700">
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">1</span>
            <div>
              <span className="font-bold text-slate-900">{t.infoPages.step1Title}:</span> {t.infoPages.step1Desc}
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">2</span>
            <div>
              <span className="font-bold text-slate-900">{t.infoPages.step2Title}:</span> {t.infoPages.step2Desc}
            </div>
          </li>
          <li className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">3</span>
            <div>
              <span className="font-bold text-slate-900">{t.infoPages.step3Title}:</span> {t.infoPages.step3Desc}
            </div>
          </li>
        </ol>
      </div>

      {/* 2. Format Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <span>Supported Formats</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formats.map((f, i) => (
            <div key={i} className="p-4 liquid-glass-card rounded-xl shadow-2xs">
              <span className="px-2 py-0.5 bg-emerald-100 border border-emerald-200 rounded-md text-[10px] font-extrabold text-emerald-800 block w-fit mb-1.5 uppercase">
                {f.ext} FORMAT
              </span>
              <p className="text-xs text-slate-700 font-medium">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Interactive FAQ Accordion */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <span>Frequently Asked Questions</span>
        </h3>
        <div className="space-y-2.5">
          {allFaqs.map((f, index) => (
            <div 
              key={index}
              className="border border-emerald-100 rounded-xl bg-white/80 overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-xs md:text-sm text-slate-900 hover:text-emerald-800 hover:bg-emerald-50/50 cursor-pointer transition-colors gap-2"
              >
                <div className="flex items-center gap-2">
                  <span>{f.q}</span>
                  {f.isCustom && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      Admin
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-700 transition-transform shrink-0 ${activeFaq === index ? 'rotate-180 text-emerald-700' : ''}`} />
              </button>
              {activeFaq === index && (
                <div className="px-5 pb-4 text-xs text-slate-700 font-medium leading-relaxed border-t border-emerald-100 pt-3 bg-emerald-50/40 whitespace-pre-line">
                  {f.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   4. ABOUT PAGE VIEW
   ============================================================================ */
export function AboutPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4 text-slate-700 text-xs md:text-sm leading-relaxed">
      <div className="text-center space-y-2 mb-4">
        <h3 className="text-2xl font-bold text-slate-900 font-display flex items-center justify-center gap-2">
          <Info className="w-6 h-6 text-emerald-600" />
          <span>About Kiritos</span>
        </h3>
        <p className="text-slate-600 text-xs">Premium Media Ecosystem & Engineering Workspace</p>
      </div>

      <div className="p-6 liquid-glass-card rounded-2xl space-y-4 shadow-xs">
        <p>
          <span className="font-extrabold text-slate-900">KIRITOS</span> is an educational open-source software project engineered to parse complex visual and audio metadata and organize them neatly under a universal liquid glass user interface dashboard.
        </p>

        <p>
          We believe that individuals should be allowed to view their content offline, on secondary devices, and integrate them safely inside personal production workflow templates. Our platform uses standard public scraping routines to construct clean, accessible file pointers on-demand.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="p-5 liquid-glass-card rounded-2xl shadow-xs">
          <span className="font-bold text-slate-900 text-sm block mb-1">Our Engineering Vision</span>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminating bloat, tracking scripts, and pop-up advertisements common in media utility wrappers. Promoting true design craftsmanship.
          </p>
        </div>
        <div className="p-5 liquid-glass-card rounded-2xl shadow-xs">
          <span className="font-bold text-slate-900 text-sm block mb-1">Educational Mandate</span>
          <p className="text-xs text-slate-600 leading-relaxed">
            All code remains open source. All direct integrations respect original platform copyrights and content creator terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   5. PRIVACY POLICY VIEW
   ============================================================================ */
export function PrivacyPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4 text-slate-700 text-xs leading-relaxed">
      <div className="text-center space-y-2 mb-4">
        <h3 className="text-xl font-bold text-slate-900 font-display flex items-center justify-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Privacy Protocol</span>
        </h3>
        <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-widest">Secure Client-Centric Operation</p>
      </div>

      <div className="p-6 liquid-glass-card rounded-2xl space-y-4 shadow-xs">
        <p className="font-semibold text-slate-900">
          Your security is our primary priority. We adhere strictly to zero-logging and zero-tracking parameters:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-xs">
          <li>
            <span className="font-bold text-slate-900">No Link Storage:</span> We do not store, database, or cache the media links you input inside our network hosts.
          </li>
          <li>
            <span className="font-bold text-slate-900">No Cookie Auditing:</span> KIRITOS does not employ tracking cookies, advertisement pixels, or Google telemetry engines.
          </li>
          <li>
            <span className="font-bold text-slate-900">Local Tools Execution:</span> All tools inside the 'Image Tools' segment execute client-side directly within your browser's HTML5 Canvas, ensuring your photos never touch external servers.
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ============================================================================
   6. TERMS & DMCA VIEW
   ============================================================================ */
export function TermsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4 text-slate-700 text-xs leading-relaxed">
      <div className="text-center space-y-2 mb-4">
        <h3 className="text-xl font-bold text-slate-900 font-display flex items-center justify-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          <span>Terms of Agreement</span>
        </h3>
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Educational Fair-Use Guidelines</p>
      </div>

      <div className="p-6 liquid-glass-card rounded-2xl space-y-4 shadow-xs">
        <p>
          By utilizing <span className="font-bold text-slate-900">KIRITOS</span>, you agree to access, download, and utilize media assets strictly for educational, research, and non-commercial personal viewing purposes.
        </p>

        <p className="border-l-2 border-emerald-500 pl-4 py-1 italic text-slate-600 bg-emerald-50/40 rounded-r-lg">
          "Users are solely responsible for ensuring they possess the right, license, or copyright permission to save media files locally. Kiritos does not host, upload, or claim copyright authority over any third-party streaming resources."
        </p>

        <p>
          If you represent a copyright holder or platform and want to request a domain restriction or DMCA content block, please dispatch a formal query via our Contact panel. We process block commands in less than 48 hours.
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
   7. CONTACT & FEEDBACK FORM
   ============================================================================ */
export function ContactPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Support / Feedback");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setEmail("");
      setMessage("");
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto py-4">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-bold text-slate-900 font-display flex items-center justify-center gap-2">
          <Mail className="w-5 h-5 text-emerald-600" />
          <span>Get in Touch</span>
        </h3>
        <p className="text-slate-600 text-xs">Have questions, feedback, or need system support? Write us directly.</p>
      </div>

      {submitted ? (
        <div className="p-6 liquid-glass-card border-emerald-300 rounded-2xl text-center space-y-3 shadow-md animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700">
            <Check className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Message Transmitted successfully!</h4>
          <p className="text-xs text-slate-600">
            Thank you for reaching out to the Kiritos Engineering Team. We will review your correspondence shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 liquid-glass-card rounded-2xl space-y-4 shadow-sm">
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-700 mb-1.5">
              Your Email Address
            </label>
            <input 
              key="contact-email-input"
              type="email"
              required
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., alex@kiritos.app"
              className="w-full bg-white border border-emerald-200 px-4 py-2.5 text-xs text-slate-800 rounded-xl outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 shadow-2xs transition-all"
            />
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-700 mb-1.5">
              Subject Type
            </label>
            <select
              key="contact-subject-select"
              value={subject || "General Support / Feedback"}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-white border border-emerald-200 px-4 py-2.5 text-xs text-slate-800 rounded-xl outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 shadow-2xs cursor-pointer transition-all"
            >
              <option value="General Support / Feedback">General Support / Feedback</option>
              <option value="Platform Bug / Parsing Issue">Platform Bug / Parsing Issue</option>
              <option value="Partnership Inquiry">Partnership Inquiry</option>
              <option value="Copyright / DMCA Notice">Copyright / DMCA Notice</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-700 mb-1.5">
              Correspondence Message
            </label>
            <textarea
              key="contact-message-textarea"
              required
              rows={4}
              value={message || ""}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your feedback details here..."
              className="w-full bg-white border border-emerald-200 px-4 py-2.5 text-xs text-slate-800 rounded-xl outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 shadow-2xs resize-none transition-all"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white disabled:opacity-50 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5 text-white" />
                <span>Transmit Message</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
