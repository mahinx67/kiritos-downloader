import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ShieldAlert, 
  Loader2, 
  ArrowLeft
} from "lucide-react";
import Header from "./components/Header";
import DownloaderForm from "./components/DownloaderForm";
import PlatformChips from "./components/PlatformChips";
import ResultCard from "./components/ResultCard";
import ToolsSuite from "./components/ToolsSuite";
import { LiquidGlassBackground } from "./components/LiquidGlassBackground";
import { GlassFloatingNavbar } from "./components/GlassFloatingNavbar";
import { AdminPanelModal } from "./components/AdminPanelModal";
import { SiteAnnouncementBanner } from "./components/SiteAnnouncementBanner";
import { NotificationToastContainer } from "./components/NotificationToast";
import { useAdminStore } from "./utils/adminStore";
import { getApiUrl } from "./utils/api";
import { 
  SupportedPlatforms, 
  RecentDownloads, 
  GuidesSection, 
  AboutPage, 
  PrivacyPage, 
  TermsPage, 
  ContactPage 
} from "./components/InfoPages";
import { 
  DownloadResult, 
  ActiveTab, 
  DownloaderSubTab, 
  RecentDownloadItem,
  ToolSubTab,
  VideoToolType,
  ImageToolType,
  SocialToolType
} from "./types";
import { useLanguage } from "./context/LanguageContext";

export default function App() {
  const { config } = useAdminStore();
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [downloaderSubTab, setDownloaderSubTab] = useState<DownloaderSubTab>("all");
  
  // Specific tool navigation states
  const [toolInitialSubTab, setToolInitialSubTab] = useState<ToolSubTab>("video-tools");
  const [toolInitialVideo, setToolInitialVideo] = useState<VideoToolType>("mp3");
  const [toolInitialImage, setToolInitialImage] = useState<ImageToolType>("compressor");
  const [toolInitialSocial, setToolInitialSocial] = useState<SocialToolType>("qr");
  const [platformInitialFilter, setPlatformInitialFilter] = useState<string>("all");
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DownloadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedExample, setSelectedExample] = useState("");

  // Persistence of recent downloads
  const [recentDownloads, setRecentDownloads] = useState<RecentDownloadItem[]>(() => {
    try {
      const stored = localStorage.getItem("kiritos_downloads");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("kiritos_downloads", JSON.stringify(recentDownloads));
    } catch (err) {
      console.warn("Storage limits or iframe restrictions prevented saving downloads history", err);
    }
  }, [recentDownloads]);

  const [footerClicks, setFooterClicks] = useState(0);

  const handleFooterLogoClick = () => {
    const next = footerClicks + 1;
    if (next >= 6) {
      setFooterClicks(0);
      setIsAdminModalOpen(true);
    } else {
      setFooterClicks(next);
      setTimeout(() => setFooterClicks(0), 2500);
    }
  };

  const handleDownloadSubmit = async (url: string, type: DownloaderSubTab) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(getApiUrl("/api/download"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not retrieve media streams. Please check the URL format and verify that the content is public.");
      }

      setResult(data);

      // Track inside session downloads
      const newHistoryItem: RecentDownloadItem = {
        id: Math.random().toString(36).substring(7),
        title: data.title || "Social Media Stream",
        platform: data.platform || "media",
        timestamp: Date.now(),
        thumbnailUrl: data.thumbnail || "",
        url: url
      };
      setRecentDownloads((prev) => [newHistoryItem, ...prev].slice(0, 30));

    } catch (err: any) {
      console.error("[FETCH ERROR]", err);
      setError(err.message || "An unexpected network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlatformExample = (exampleUrl: string) => {
    setSelectedExample(exampleUrl);
    setActiveTab("downloader");
    setDownloaderSubTab("all");
    setResult(null);
    setError(null);
  };

  const handleClearHistory = () => {
    setRecentDownloads([]);
  };

  const handleSelectRecent = (url: string) => {
    setSelectedExample(url);
    setActiveTab("downloader");
    setDownloaderSubTab("all");
    setResult(null);
    setError(null);
  };

  const navigateToTab = (tab: ActiveTab, subtab: DownloaderSubTab = "all") => {
    setActiveTab(tab);
    setDownloaderSubTab(subtab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToTool = (category: ToolSubTab, toolName?: string) => {
    setActiveTab("tools");
    setToolInitialSubTab(category);
    if (category === "video-tools" && toolName) {
      setToolInitialVideo(toolName as VideoToolType);
    } else if (category === "image-tools" && toolName) {
      setToolInitialImage(toolName as ImageToolType);
    } else if (category === "social-tools" && toolName) {
      setToolInitialSocial(toolName as SocialToolType);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative selection:bg-emerald-200 selection:text-emerald-950 flex flex-col justify-between pb-24 sm:pb-28">
      {/* 🌊 Sophisticated Clean Background */}
      <LiquidGlassBackground />

      {/* 🚀 MAIN CONTENT BODY */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-4 sm:py-6 flex-1 w-full">
        
        {/* 📢 Live Announcement Banner from Admin Panel */}
        <SiteAnnouncementBanner />

        {/* 🛠️ Maintenance Banner if Enabled by Admin */}
        {config.maintenanceMode && (
          <div className="w-full max-w-4xl mx-auto mb-4 p-3 bg-amber-500/15 border border-amber-500/40 rounded-2xl flex items-center gap-3 text-amber-900 text-xs font-bold shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
            <div className="flex-1">
              <span className="uppercase text-[10px] tracking-wider text-amber-800 mr-2 font-black">Maintenance Alert:</span>
              <span>{config.maintenanceMessage}</span>
            </div>
          </div>
        )}

        {/* Universal Back Navigation Button for Sub-pages */}
        {activeTab !== "home" && activeTab !== "downloader" && (
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <button
              id="btn-back-to-home"
              onClick={() => navigateToTab("home")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 hover:bg-white text-emerald-800 hover:text-emerald-950 border border-emerald-200 hover:border-emerald-400 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs group active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 group-hover:-translate-x-1.5 transition-transform" />
              <span>Back to Downloader</span>
            </button>
            <span className="text-xs font-bold text-emerald-700/70 uppercase tracking-widest font-display">
              {activeTab}
            </span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {(activeTab === "home" || activeTab === "downloader") && (
            <motion.div
              key="home-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-5"
            >
              {/* Header Hero with 6-click admin panel trigger */}
              <Header onLogoAdminTrigger={() => setIsAdminModalOpen(true)} />

              {/* Universal Downloader Form */}
              <DownloaderForm 
                onSubmit={handleDownloadSubmit} 
                isLoading={isLoading} 
                externalUrl={selectedExample}
                onClearExternal={() => setSelectedExample("")}
                activeSubTab={downloaderSubTab}
                setActiveSubTab={setDownloaderSubTab}
              />

              {/* Status Loading Spinner */}
              {isLoading && (
                <div id="loading-spinner-container" className="w-full max-w-3xl mx-auto mt-6 p-8 liquid-glass-card rounded-3xl flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-9 h-9 text-emerald-600 animate-spin" />
                  <h3 className="text-sm font-extrabold text-slate-900 mt-4 font-display uppercase tracking-wider">
                    {t.downloader.fetching}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 max-w-xs">
                    {t.downloader.fetchingDesc}
                  </p>
                </div>
              )}

              {/* Parser Error message */}
              {error && (
                <div id="error-banner" className="w-full max-w-3xl mx-auto mt-6 p-4 bg-red-50/90 border border-red-200 rounded-2xl flex items-start gap-3.5 text-red-800 shadow-lg relative backdrop-blur-md">
                  <ShieldAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-0.5">
                    <h4 className="font-bold text-red-900 text-xs">Could not fetch media</h4>
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                  <button onClick={() => setError(null)} className="p-1 rounded-full hover:bg-red-100 text-red-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Extraction result card */}
              {result && (
                <ResultCard 
                  result={result} 
                  onClear={() => setResult(null)} 
                  activeSubTab={downloaderSubTab} 
                />
              )}

              {/* Supported Platforms chips with 1-click test links and official logos */}
              <PlatformChips onSelectPlatform={handleSelectPlatformExample} />
            </motion.div>
          )}

          {activeTab === "tools" && (
            <motion.div
              key="tools-screen"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              <ToolsSuite 
                initialSubTab={toolInitialSubTab}
                initialVideoTool={toolInitialVideo}
                initialImageTool={toolInitialImage}
                initialSocialTool={toolInitialSocial}
              />
            </motion.div>
          )}

          {activeTab === "platforms" && (
            <motion.div
              key="platforms-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <SupportedPlatforms 
                onSelectPlatform={handleSelectPlatformExample} 
                initialFilter={platformInitialFilter}
              />
            </motion.div>
          )}

          {activeTab === "downloads" && (
            <motion.div
              key="downloads-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RecentDownloads 
                downloads={recentDownloads} 
                onClear={handleClearHistory} 
                onSelect={handleSelectRecent} 
              />
            </motion.div>
          )}

          {activeTab === "guides" && (
            <motion.div
              key="guides-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GuidesSection />
            </motion.div>
          )}

          {activeTab === "about" && (
            <motion.div key="about-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AboutPage />
            </motion.div>
          )}

          {activeTab === "privacy" && (
            <motion.div key="privacy-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PrivacyPage />
            </motion.div>
          )}

          {activeTab === "terms" && (
            <motion.div key="terms-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TermsPage />
            </motion.div>
          )}

          {activeTab === "contact" && (
            <motion.div key="contact-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ContactPage />
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 🚀 CLEAN MINIMAL FOOTER */}
      <footer id="master-footer" className="mt-8 border-t border-emerald-200/80 bg-white/80 py-4 px-6 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div 
            onClick={handleFooterLogoClick}
            className="flex items-center gap-2 font-black text-slate-900 text-sm tracking-tight select-none cursor-pointer active:scale-95 transition-transform"
          >
            <img 
              src="https://i.ibb.co.com/QjdJGZk0/1c1c25d51409d1601e25b2cd0acd39f0.jpg" 
              alt="KIRITOS Logo" 
              className="w-6 h-6 rounded-lg object-cover border border-emerald-300" 
            />
            <span className="font-display tracking-widest uppercase text-emerald-950 font-bold">KIRITOS</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <button onClick={() => navigateToTab("platforms")} className="hover:text-emerald-800 transition-colors">{language === "bn" ? "সাইটসমূহ" : "Sites"}</button>
            <button onClick={() => navigateToTab("downloads")} className="hover:text-emerald-800 transition-colors">{language === "bn" ? "হিস্ট্রি" : "History"}</button>
            <button onClick={() => navigateToTab("guides")} className="hover:text-emerald-800 transition-colors">{language === "bn" ? "জিজ্ঞাসা" : "FAQ"}</button>
            <button onClick={() => navigateToTab("privacy")} className="hover:text-emerald-800 transition-colors">{language === "bn" ? "গোপনীয়তা" : "Privacy"}</button>
          </div>
          
          <p className="text-xs text-slate-500 font-medium">
            © mhxmahin. All rights reserved.
          </p>
        </div>
      </footer>

      {/* 🫧 Liquid Glass Floating Menu Bar at the BOTTOM */}
      <GlassFloatingNavbar
        activeTab={activeTab}
        downloaderSubTab={downloaderSubTab}
        currentToolSubTab={toolInitialSubTab}
        currentVideoTool={toolInitialVideo}
        currentImageTool={toolInitialImage}
        currentSocialTool={toolInitialSocial}
        onNavigateTab={navigateToTab}
        onNavigateTool={navigateToTool}
      />

      {/* 🛡️ Secure Admin Panel Modal (Opened by clicking logo 6 times) */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        recentDownloads={recentDownloads}
        onClearHistory={handleClearHistory}
      />

      {/* 🔔 Toast & Desktop Notifications Container */}
      <NotificationToastContainer />
    </div>
  );
}
