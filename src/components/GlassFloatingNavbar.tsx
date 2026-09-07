import React from "react";
import { motion } from "motion/react";
import { 
  Download, 
  SlidersHorizontal, 
  Scissors, 
  Music, 
  Sparkles, 
  Crop
} from "lucide-react";
import { HdIcon } from "./RealVideoEnhancer";
import { ActiveTab, DownloaderSubTab, ToolSubTab, VideoToolType, ImageToolType, SocialToolType } from "../types";
import { useLanguage } from "../context/LanguageContext";

export interface GlassFloatingNavbarProps {
  activeTab: ActiveTab;
  downloaderSubTab: DownloaderSubTab;
  currentToolSubTab?: ToolSubTab;
  currentVideoTool?: VideoToolType;
  currentImageTool?: ImageToolType;
  currentSocialTool?: SocialToolType;
  onNavigateTab: (tab: ActiveTab, subtab?: DownloaderSubTab) => void;
  onNavigateTool: (category: ToolSubTab, toolName?: string) => void;
}

export const GlassFloatingNavbar: React.FC<GlassFloatingNavbarProps> = ({
  activeTab,
  downloaderSubTab,
  currentToolSubTab = "video-tools",
  currentVideoTool = "mp3",
  currentImageTool = "compressor",
  currentSocialTool = "qr",
  onNavigateTab,
  onNavigateTool
}) => {
  const { t } = useLanguage();
  const isHome = activeTab === "home" || activeTab === "downloader";
  const isTools = activeTab === "tools";

  const items = [
    {
      id: "downloader",
      label: t.navigation.downloader,
      icon: Download,
      action: () => onNavigateTab("downloader", "all"),
      isActive: isHome
    },
    {
      id: "hd-enhancer",
      label: t.navigation.hdEnhancer,
      icon: HdIcon,
      action: () => onNavigateTool("video-tools", "enhancer"),
      isActive: isTools && currentToolSubTab === "video-tools" && currentVideoTool === "enhancer"
    },
    {
      id: "audio-tools",
      label: t.navigation.mp3Studio,
      icon: Music,
      action: () => onNavigateTool("video-tools", "mp3"),
      isActive: isTools && currentToolSubTab === "video-tools" && currentVideoTool === "mp3"
    },
    {
      id: "trimmer",
      label: t.navigation.videoTrimmer,
      icon: Scissors,
      action: () => onNavigateTool("video-tools", "trimmer"),
      isActive: isTools && currentToolSubTab === "video-tools" && currentVideoTool === "trimmer"
    },
    {
      id: "social-tools",
      label: t.navigation.socialTools,
      icon: Sparkles,
      action: () => onNavigateTool("social-tools", "qr"),
      isActive: isTools && currentToolSubTab === "social-tools"
    },
    {
      id: "image-tools",
      label: t.navigation.imageTools,
      icon: Crop,
      action: () => onNavigateTool("image-tools", "compressor"),
      isActive: isTools && currentToolSubTab === "image-tools"
    }
  ];

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-0 right-0 z-50 flex items-center justify-center px-4 pointer-events-none">
      {/* 🫧 Floating Liquid Glass Capsule Bar at Bottom */}
      <nav 
        id="glass-pill-menubar"
        aria-label="Main Navigation Bar"
        className="pointer-events-auto relative inline-flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-2xl border border-white/95 shadow-[0_16px_40px_-6px_rgba(16,185,129,0.25),0_6px_18px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.95)] transition-all duration-300 hover:shadow-[0_20px_48px_-4px_rgba(16,185,129,0.32)] hover:bg-white"
      >
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;

          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              type="button"
              onClick={item.action}
              title={item.label}
              aria-label={item.label}
              className="relative group p-2.5 sm:px-3.5 sm:py-2.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer select-none active:scale-90 focus:outline-hidden"
            >
              {/* Active Green Pill Bubble */}
              {active && (
                <motion.div
                  layoutId="glass-nav-active-pill"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  className="absolute inset-0 rounded-full bg-emerald-600 shadow-[0_4px_14px_rgba(5,150,105,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]"
                />
              )}

              {/* Hover highlight for inactive buttons */}
              {!active && (
                <div className="absolute inset-0 rounded-full bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors duration-150" />
              )}

              {/* Icon */}
              <Icon 
                className={`relative z-10 w-5 h-5 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110 ${
                  active 
                    ? "text-white stroke-[2.2]" 
                    : "text-slate-700 hover:text-emerald-950 stroke-[1.8]"
                }`} 
              />

              {/* Floating Tooltip above button */}
              <span className="absolute -top-9 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 text-[11px] font-bold bg-slate-900/90 text-white px-2.5 py-1 rounded-lg backdrop-blur-xs whitespace-nowrap shadow-md z-30">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
