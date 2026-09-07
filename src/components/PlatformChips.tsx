import React, { useState } from "react";
import { 
  Globe,
  ChevronDown,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { PlatformConfig } from "../types";
import { useAdminStore } from "../utils/adminStore";
import { useLanguage } from "../context/LanguageContext";

export interface PlatformItem extends PlatformConfig {
  brandColor: string;
  bgBadge: string;
  textClass: string;
  borderClass: string;
  badgeBg: string;
  badgeText: string;
  logoSvg: (className?: string) => React.ReactNode;
}

// Official Vector Brand Logos for Pixel-Perfect, High-Resolution Rendering
export const renderOfficialLogo = (id: string, className: string = "w-4 h-4") => {
  switch (id) {
    case "youtube":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000"/>
          <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF"/>
        </svg>
      );
    case "tiktok":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.88 2.896 2.896 0 0 1-2.891-2.88 2.896 2.896 0 0 1 2.891-2.88c.32 0 .626.052.912.147V9.45a6.326 6.326 0 0 0-.912-.066A6.34 6.34 0 0 0 3.14 15.722a6.34 6.34 0 0 0 6.343 6.338 6.34 6.34 0 0 0 6.343-6.338V8.718a8.204 8.204 0 0 0 5.027 1.705V6.982c-.443 0-.872-.102-1.264-.296z" fill="#000000"/>
          <circle cx="12" cy="12" r="1.5" fill="#25F4EE" className="opacity-0" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <defs>
            <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="5%" stopColor="#fdf497" />
              <stop offset="45%" stopColor="#fd5949" />
              <stop offset="60%" stopColor="#d6249f" />
              <stop offset="90%" stopColor="#285AEB" />
            </radialGradient>
          </defs>
          <rect width="24" height="24" rx="6.5" fill="url(#ig-grad)"/>
          <path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 7.35a2.85 2.85 0 1 1 0-5.7 2.85 2.85 0 0 1 0 5.7zm4.98-7.58a1.05 1.05 0 1 1-2.1 0 1.05 1.05 0 0 1 2.1 0z" fill="#FFFFFF"/>
          <path d="M17.2 3.6H6.8A3.2 3.2 0 0 0 3.6 6.8v10.4a3.2 3.2 0 0 0 3.2 3.2h10.4a3.2 3.2 0 0 0 3.2-3.2V6.8a3.2 3.2 0 0 0-3.2-3.2zm1.6 13.6a1.6 1.6 0 0 1-1.6 1.6H6.8a1.6 1.6 0 0 1-1.6-1.6V6.8a1.6 1.6 0 0 1 1.6-1.6h10.4a1.6 1.6 0 0 1 1.6 1.6v10.4z" fill="#FFFFFF"/>
        </svg>
      );
    case "facebook":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#1877F2"/>
          <path d="M15.5 12.05h-2.3V20h-3.3v-7.95H8.2V9.26h1.7V7.27C9.9 4.88 11.3 3.5 13.43 3.5c1.02 0 1.9.08 2.15.11v2.5h-1.48c-1.16 0-1.4.55-1.4 1.37v1.78h2.8l-.4 2.79z" fill="#FFFFFF"/>
        </svg>
      );
    case "twitter":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#000000"/>
          <path d="M18.244 3.25h3.068l-6.703 7.662 7.885 10.338h-6.174l-4.835-6.323-5.534 6.323H2.88l7.17-8.196L2.4 3.25h6.33l4.372 5.78 5.142-5.78zm-1.077 16.16h1.7L7.96 4.99H6.136l11.031 14.42z" fill="#FFFFFF"/>
        </svg>
      );
    case "reddit":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#FF4500"/>
          <path d="M19.2 11.4a1.8 1.8 0 0 0-3.06-1.27c-1.14-.78-2.67-1.28-4.37-1.34l.87-4.1 2.85.6a1.35 1.35 0 1 0 1.37-1.24 1.35 1.35 0 0 0-1.32 1.05l-3.18-.67a.45.45 0 0 0-.53.35l-.99 4.67c-1.74.05-3.31.55-4.47 1.34a1.8 1.8 0 1 0-2.45 2.5 3.7 3.7 0 0 0-.09.83c0 2.92 3.4 5.3 7.6 5.3s7.6-2.38 7.6-5.3c0-.28-.03-.56-.09-.83a1.8 1.8 0 0 0-.27-2.49zm-10.2 1.8a1.2 1.2 0 1 1 2.4 0 1.2 1.2 0 0 1-2.4 0zm6.65 3.3a4.2 4.2 0 0 1-3.65 1.05 4.2 4.2 0 0 1-3.65-1.05.3.3 0 0 1 .42-.42c.8.8 2.2.98 3.23.98s2.43-.18 3.23-.98a.3.3 0 0 1 .42.42zm-.45-2.1a1.2 1.2 0 1 1 2.4 0 1.2 1.2 0 0 1-2.4 0z" fill="#FFFFFF"/>
        </svg>
      );
    case "spotify":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#1DB954"/>
          <path d="M17.47 16.32a.75.75 0 0 1-1.03.25c-2.82-1.72-6.38-2.11-10.57-1.15a.75.75 0 1 1-.34-1.46c4.6-1.05 8.52-.61 11.69 1.33.37.22.48.71.25 1.03zm1.4-3.11a.94.94 0 0 1-1.29.31c-3.23-1.99-8.15-2.56-11.97-1.4a.94.94 0 1 1-.55-1.8c4.37-1.32 9.8-.69 13.5 1.6.43.26.56.84.31 1.29zm.12-3.24c-3.87-2.3-10.27-2.51-13.97-1.38a1.13 1.13 0 1 1-.65-2.16c4.25-1.29 11.31-1.04 15.77 1.6a1.13 1.13 0 0 1-1.15 1.94z" fill="#FFFFFF"/>
        </svg>
      );
    case "soundcloud":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#FF5500"/>
          <path d="M11.5 8.5v8m-2-7v6m-2-5v4m-2-3v2m8-8.5c1.8 0 3.3 1.2 3.8 2.8.4-.2.8-.3 1.3-.3 1.8 0 3.2 1.4 3.2 3.2 0 1.8-1.4 3.2-3.2 3.2H11.5V8.5z" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case "pinterest":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#BD081C"/>
          <path d="M12 4.5a7.5 7.5 0 0 0-2.74 14.48c-.02-.62-.04-1.58.12-2.26l.98-4.14s-.25-.5-.25-1.24c0-1.16.67-2.03 1.51-2.03.71 0 1.05.53 1.05 1.17 0 .71-.45 1.78-.69 2.77-.2.83.42 1.5 1.24 1.5 1.48 0 2.62-1.56 2.62-3.82 0-2-1.43-3.39-3.48-3.39-2.37 0-3.76 1.78-3.76 3.62 0 .72.28 1.48.62 1.9a.25.25 0 0 1 .06.24c-.06.27-.21.84-.24.96-.04.15-.13.18-.3.11-1.12-.52-1.82-2.16-1.82-3.48 0-2.83 2.06-5.43 5.94-5.43 3.12 0 5.54 2.22 5.54 5.19 0 3.1-1.95 5.59-4.66 5.59-.91 0-1.77-.47-2.06-1.03l-.56 2.14c-.2.78-.75 1.75-1.12 2.35A7.5 7.5 0 1 0 12 4.5z" fill="#FFFFFF"/>
        </svg>
      );
    case "threads":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#000000"/>
          <path d="M12 4.2c4.4 0 7.8 3.3 7.8 7.8 0 4.7-3.6 7.8-7.8 7.8-4.5 0-7.8-3.3-7.8-7.8 0-4.6 3.5-7.8 7.8-7.8zm0 13.8c3.2 0 5.8-2.4 5.8-6 0-3.4-2.4-5.8-5.8-5.8-3.3 0-5.8 2.4-5.8 5.8 0 3.5 2.5 6 5.8 6zm0-9.8c2.1 0 3.8 1.6 3.8 3.8 0 2.3-1.6 3.8-3.8 3.8-2.2 0-3.8-1.5-3.8-3.8 0-2.2 1.7-3.8 3.8-3.8z" fill="#FFFFFF"/>
        </svg>
      );
    case "capcut":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#000000"/>
          <path d="M6 7l6 5-6 5V7zm12 0l-6 5 6 5V7z" fill="#FFFFFF"/>
        </svg>
      );
    case "gdrive":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <path d="M7.71 3.5L1.29 14.63h6.42l6.42-11.13H7.71z" fill="#0066DA"/>
          <path d="M14.13 3.5H7.71l6.42 11.13h6.42L14.13 3.5z" fill="#00AC47"/>
          <path d="M1.29 14.63l3.21 5.56 3.21 5.56 6.42-11.12H1.29z" fill="#EA4335"/>
          <path d="M14.13 25.75H20.55l3.21-5.56-6.42-11.13-3.21 5.56 6.42 11.13z" fill="#FFBA00"/>
        </svg>
      );
    case "mediafire":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#0070F0"/>
          <path d="M6 13a4 4 0 0 1 4-4h.3A5.5 5.5 0 0 1 20 12.5a4.5 4.5 0 0 1-4.5 4.5H8a4 4 0 0 1-2-4z" fill="#FFFFFF"/>
        </svg>
      );
    case "xiaohongshu":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#FE2C55"/>
          <path d="M6.5 12h11M12 6.5v11" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      );
    case "douyin":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#1C1C1E"/>
          <path d="M17 7.5a4.5 4.5 0 0 1-3.5-3.5H11v11a2.5 2.5 0 1 1-2.5-2.5c.3 0 .6.05.9.14V9.8A5.5 5.5 0 1 0 14 15V8.8A7 7 0 0 0 17 9.5V7.5z" fill="#00F2FE"/>
        </svg>
      );
    case "kuaishou":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#FF5000"/>
          <circle cx="12" cy="12" r="5" fill="#FFFFFF"/>
          <path d="M11 9.5l3.5 2.5-3.5 2.5V9.5z" fill="#FF5000"/>
        </svg>
      );
    case "snackvideo":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="5" fill="#EA580C"/>
          <path d="M8 7l10 5-10 5V7z" fill="#FFFFFF"/>
        </svg>
      );
    case "cocofun":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="12" fill="#059669"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="9" cy="10" r="1.5" fill="#FFFFFF"/>
          <circle cx="15" cy="10" r="1.5" fill="#FFFFFF"/>
        </svg>
      );
    default:
      return <Globe className={className} />;
  }
};

export const platforms: (PlatformConfig & { brandColor: string; bgBadge: string; textClass: string; borderClass: string })[] = [
  { 
    id: "youtube", 
    name: "YouTube", 
    iconName: "youtube", 
    color: "text-red-950 bg-red-50/95 border-red-200 hover:bg-red-100 hover:border-red-400", 
    badgeBg: "bg-red-600", 
    badgeText: "text-white", 
    domains: ["youtube.com", "youtu.be"],
    brandColor: "#FF0000",
    bgBadge: "bg-red-500 text-white",
    textClass: "text-red-950 font-bold",
    borderClass: "border-red-300"
  },
  { 
    id: "tiktok", 
    name: "TikTok", 
    iconName: "tiktok", 
    color: "text-slate-950 bg-slate-100/95 border-slate-300 hover:bg-slate-200 hover:border-slate-400", 
    badgeBg: "bg-black", 
    badgeText: "text-white", 
    domains: ["tiktok.com"],
    brandColor: "#000000",
    bgBadge: "bg-slate-900 text-white",
    textClass: "text-slate-950 font-bold",
    borderClass: "border-slate-300"
  },
  { 
    id: "instagram", 
    name: "Instagram", 
    iconName: "instagram", 
    color: "text-pink-950 bg-pink-50/95 border-pink-200 hover:bg-pink-100 hover:border-pink-400", 
    badgeBg: "bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600", 
    badgeText: "text-white", 
    domains: ["instagram.com", "instagr.am"],
    brandColor: "#E1306C",
    bgBadge: "bg-pink-600 text-white",
    textClass: "text-pink-950 font-bold",
    borderClass: "border-pink-300"
  },
  { 
    id: "facebook", 
    name: "Facebook", 
    iconName: "facebook", 
    color: "text-blue-950 bg-blue-50/95 border-blue-200 hover:bg-blue-100 hover:border-blue-400", 
    badgeBg: "bg-blue-600", 
    badgeText: "text-white", 
    domains: ["facebook.com", "fb.watch", "fb.com"],
    brandColor: "#1877F2",
    bgBadge: "bg-blue-600 text-white",
    textClass: "text-blue-950 font-bold",
    borderClass: "border-blue-300"
  },
  { 
    id: "twitter", 
    name: "Twitter / X", 
    iconName: "twitter", 
    color: "text-sky-950 bg-sky-50/95 border-sky-200 hover:bg-sky-100 hover:border-sky-400", 
    badgeBg: "bg-sky-600", 
    badgeText: "text-white", 
    domains: ["twitter.com", "x.com"],
    brandColor: "#1DA1F2",
    bgBadge: "bg-sky-600 text-white",
    textClass: "text-sky-950 font-bold",
    borderClass: "border-sky-300"
  },
  { 
    id: "reddit", 
    name: "Reddit", 
    iconName: "reddit", 
    color: "text-orange-950 bg-orange-50/95 border-orange-200 hover:bg-orange-100 hover:border-orange-400", 
    badgeBg: "bg-orange-600", 
    badgeText: "text-white", 
    domains: ["reddit.com", "redd.it"],
    brandColor: "#FF4500",
    bgBadge: "bg-orange-600 text-white",
    textClass: "text-orange-950 font-bold",
    borderClass: "border-orange-300"
  },
  { 
    id: "spotify", 
    name: "Spotify", 
    iconName: "spotify", 
    color: "text-emerald-950 bg-emerald-50/95 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400", 
    badgeBg: "bg-emerald-600", 
    badgeText: "text-white", 
    domains: ["spotify.com"],
    brandColor: "#1DB954",
    bgBadge: "bg-emerald-600 text-white",
    textClass: "text-emerald-950 font-bold",
    borderClass: "border-emerald-300"
  },
  { 
    id: "soundcloud", 
    name: "SoundCloud", 
    iconName: "soundcloud", 
    color: "text-amber-950 bg-amber-50/95 border-amber-200 hover:bg-amber-100 hover:border-amber-400", 
    badgeBg: "bg-amber-600", 
    badgeText: "text-white", 
    domains: ["soundcloud.com"],
    brandColor: "#FF5500",
    bgBadge: "bg-amber-600 text-white",
    textClass: "text-amber-950 font-bold",
    borderClass: "border-amber-300"
  },
  { 
    id: "pinterest", 
    name: "Pinterest", 
    iconName: "pinterest", 
    color: "text-rose-950 bg-rose-50/95 border-rose-200 hover:bg-rose-100 hover:border-rose-400", 
    badgeBg: "bg-rose-600", 
    badgeText: "text-white", 
    domains: ["pinterest.com", "pin.it"],
    brandColor: "#BD081C",
    bgBadge: "bg-rose-600 text-white",
    textClass: "text-rose-950 font-bold",
    borderClass: "border-rose-300"
  },
  { 
    id: "threads", 
    name: "Threads", 
    iconName: "threads", 
    color: "text-teal-950 bg-teal-50/95 border-teal-200 hover:bg-teal-100 hover:border-teal-400", 
    badgeBg: "bg-teal-700", 
    badgeText: "text-white", 
    domains: ["threads.net"],
    brandColor: "#008080",
    bgBadge: "bg-teal-700 text-white",
    textClass: "text-teal-950 font-bold",
    borderClass: "border-teal-300"
  },
  { 
    id: "capcut", 
    name: "CapCut", 
    iconName: "capcut", 
    color: "text-violet-950 bg-violet-50/95 border-violet-200 hover:bg-violet-100 hover:border-violet-400", 
    badgeBg: "bg-violet-700", 
    badgeText: "text-white", 
    domains: ["capcut.com"],
    brandColor: "#7C3AED",
    bgBadge: "bg-violet-700 text-white",
    textClass: "text-violet-950 font-bold",
    borderClass: "border-violet-300"
  },
  { 
    id: "gdrive", 
    name: "Google Drive", 
    iconName: "gdrive", 
    color: "text-amber-950 bg-amber-50/95 border-amber-300 hover:bg-amber-100 hover:border-amber-400", 
    badgeBg: "bg-amber-600", 
    badgeText: "text-white", 
    domains: ["drive.google.com"],
    brandColor: "#F4B400",
    bgBadge: "bg-amber-600 text-white",
    textClass: "text-amber-950 font-bold",
    borderClass: "border-amber-400"
  },
  { 
    id: "mediafire", 
    name: "MediaFire", 
    iconName: "mediafire", 
    color: "text-blue-950 bg-blue-50/95 border-blue-200 hover:bg-blue-100 hover:border-blue-400", 
    badgeBg: "bg-blue-500", 
    badgeText: "text-white", 
    domains: ["mediafire.com"],
    brandColor: "#0070F0",
    bgBadge: "bg-blue-600 text-white",
    textClass: "text-blue-950 font-bold",
    borderClass: "border-blue-300"
  },
  { 
    id: "xiaohongshu", 
    name: "RedNote", 
    iconName: "rednote", 
    color: "text-red-950 bg-red-50/95 border-red-200 hover:bg-red-100 hover:border-red-400", 
    badgeBg: "bg-red-600", 
    badgeText: "text-white", 
    domains: ["xiaohongshu.com", "xhslink.com"],
    brandColor: "#FE2C55",
    bgBadge: "bg-red-600 text-white",
    textClass: "text-red-950 font-bold",
    borderClass: "border-red-300"
  },
  { 
    id: "douyin", 
    name: "Douyin", 
    iconName: "douyin", 
    color: "text-cyan-950 bg-cyan-50/95 border-cyan-200 hover:bg-cyan-100 hover:border-cyan-400", 
    badgeBg: "bg-cyan-700", 
    badgeText: "text-white", 
    domains: ["douyin.com"],
    brandColor: "#06B6D4",
    bgBadge: "bg-cyan-700 text-white",
    textClass: "text-cyan-950 font-bold",
    borderClass: "border-cyan-300"
  },
  { 
    id: "kuaishou", 
    name: "Kuaishou", 
    iconName: "kuaishou", 
    color: "text-orange-950 bg-orange-50/95 border-orange-200 hover:bg-orange-100 hover:border-orange-400", 
    badgeBg: "bg-orange-500", 
    badgeText: "text-slate-950 font-black", 
    domains: ["kuaishou.com"],
    brandColor: "#F97316",
    bgBadge: "bg-orange-500 text-white",
    textClass: "text-orange-950 font-bold",
    borderClass: "border-orange-300"
  },
  { 
    id: "snackvideo", 
    name: "SnackVideo", 
    iconName: "snackvideo", 
    color: "text-orange-950 bg-orange-50/95 border-orange-200 hover:bg-orange-100 hover:border-orange-400", 
    badgeBg: "bg-orange-600", 
    badgeText: "text-white", 
    domains: ["snackvideo.com"],
    brandColor: "#EA580C",
    bgBadge: "bg-orange-600 text-white",
    textClass: "text-orange-950 font-bold",
    borderClass: "border-orange-300"
  },
  { 
    id: "cocofun", 
    name: "Cocofun", 
    iconName: "cocofun", 
    color: "text-emerald-950 bg-emerald-50/95 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400", 
    badgeBg: "bg-emerald-600", 
    badgeText: "text-white", 
    domains: ["icocofun.com", "cocofun"],
    brandColor: "#059669",
    bgBadge: "bg-emerald-600 text-white",
    textClass: "text-emerald-950 font-bold",
    borderClass: "border-emerald-300"
  }
];

export function getPlatformIcon(iconName: string, className: string = "w-4 h-4") {
  return renderOfficialLogo(iconName, className);
}

export default function PlatformChips({ onSelectPlatform }: { onSelectPlatform?: (exampleUrl: string) => void }) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { platforms: customPlatforms } = useAdminStore();
  const activeCustom = customPlatforms.filter(p => p.isActive);
  const totalCount = platforms.length + activeCustom.length;

  // Helpful sample links
  const getExampleUrl = (id: string) => {
    switch (id) {
      case "youtube": return "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      case "tiktok": return "https://www.tiktok.com/@scout2015/video/6768111090023435526";
      case "instagram": return "https://www.instagram.com/reel/C35_P56v1aR/";
      case "facebook": return "https://www.facebook.com/watch/?v=123456789";
      case "twitter": return "https://x.com/space/status/123456789";
      case "reddit": return "https://reddit.com/r/videos/comments/test";
      case "spotify": return "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT";
      case "capcut": return "https://www.capcut.com/template-detail/12345";
      default: return "";
    }
  };

  return (
    <div id="platform-showcase" className="mt-5 max-w-4xl mx-auto px-4">
      {/* 🔘 "Supported Platforms" Interactive Button with Logo Icon */}
      <div className="flex items-center justify-center">
        <button
          type="button"
          id="supported-platforms-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="group inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-full bg-white/95 hover:bg-white text-slate-900 border border-emerald-300 hover:border-emerald-500 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer active:scale-95 select-none"
          title="Click to view all supported platforms with official logos"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs group-hover:bg-emerald-700 transition-colors">
            <Globe className="w-3.5 h-3.5" />
          </div>
          
          <span className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900">
            {t.platforms.supportedBtn}
          </span>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
            {totalCount}+
          </span>

          <ChevronDown 
            className={`w-4 h-4 text-emerald-800 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-emerald-950" : ""
            }`} 
          />
        </button>
      </div>

      {/* 🌟 Professional Grid with Official Brand Logos + Platform Names */}
      {isOpen && (
        <div 
          id="platforms-name-list" 
          className="mt-4 p-4 sm:p-5 rounded-3xl bg-white/95 backdrop-blur-2xl border border-emerald-200/90 shadow-xl animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-emerald-100">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              {t.platforms.allSupported} ({totalCount})
            </span>
            <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
              {t.platforms.clickToPaste}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-2.5">
            {platforms.map((platform) => {
              const exampleUrl = getExampleUrl(platform.id);
              return (
                <button
                  key={platform.id}
                  id={`platform-name-tag-${platform.id}`}
                  onClick={() => {
                    if (onSelectPlatform && exampleUrl) {
                      onSelectPlatform(exampleUrl);
                    }
                  }}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-2xl border transition-all duration-150 shadow-2xs select-none ${platform.color} ${
                    exampleUrl ? 'cursor-pointer hover:scale-103 hover:shadow-sm active:scale-97' : 'cursor-default'
                  }`}
                  title={exampleUrl ? `${t.platforms.samplePrefix} ${platform.name}` : `${platform.name}`}
                >
                  <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center drop-shadow-xs">
                    {renderOfficialLogo(platform.id, "w-4.5 h-4.5")}
                  </div>
                  <span className={`text-xs font-bold truncate ${platform.textClass}`}>
                    {platform.name}
                  </span>
                </button>
              );
            })}

            {/* Custom Admin Added Platforms */}
            {activeCustom.map((cp) => (
              <button
                key={cp.id}
                id={`custom-platform-${cp.id}`}
                onClick={() => {
                  if (onSelectPlatform && cp.exampleUrl) {
                    onSelectPlatform(cp.exampleUrl);
                  }
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-2xl border border-emerald-300 bg-emerald-50/90 hover:bg-emerald-100 transition-all duration-150 shadow-2xs cursor-pointer hover:scale-103 active:scale-97 text-slate-900"
                title={`Click to paste sample ${cp.name} link`}
              >
                <div className="w-5 h-5 flex-shrink-0 rounded-full bg-emerald-600 text-white flex items-center justify-center drop-shadow-xs">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <span className="text-xs font-bold text-slate-900 truncate block">
                    {cp.name}
                  </span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 shrink-0">
                  {cp.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
