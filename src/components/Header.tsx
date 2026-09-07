import { useState, useRef } from "react";
import { useLanguage } from "../context/LanguageContext";
import { LanguageTranslatorButton } from "./LanguageTranslatorButton";
import { NotificationToggle } from "./NotificationToggle";
import { ProfileDropdown } from "./ProfileDropdown";

interface HeaderProps {
  onLogoAdminTrigger?: () => void;
}

export default function Header({ onLogoAdminTrigger }: HeaderProps) {
  const [clickCount, setClickCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useLanguage();

  const handleLogoClick = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const nextCount = clickCount + 1;
    if (nextCount >= 6) {
      setClickCount(0);
      if (onLogoAdminTrigger) {
        onLogoAdminTrigger();
      }
    } else {
      setClickCount(nextCount);
      timerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 2500);
    }
  };

  return (
    <div id="header-container" className="text-center py-3 md:py-5 px-4 max-w-2xl mx-auto relative select-none">
      {/* Top Bar with Language Translator & Profile Dropdown */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-emerald-800">
            KIRITOS v2.5
          </span>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-2">
            {/* Browser Notification Alert Toggle */}
            <NotificationToggle />
            {/* 1-Click Language Translator Button */}
            <LanguageTranslatorButton />
          </div>

          {/* Profile Dropdown right below Language Translator Button */}
          <ProfileDropdown />
        </div>
      </div>

      {/* Brand Emblem & Logo */}
      <div className="flex items-center justify-center gap-3 mb-3">
        <button
          type="button"
          onClick={handleLogoClick}
          className="relative group cursor-pointer focus:outline-hidden transition-transform active:scale-90"
          title="KIRITOS"
          aria-label="KIRITOS Logo"
        >
          <img 
            src="https://i.ibb.co.com/QjdJGZk0/1c1c25d51409d1601e25b2cd0acd39f0.jpg" 
            alt="KIRITOS Logo" 
            className="w-12 h-12 md:w-14 md:h-14 rounded-2xl object-cover border border-emerald-300 shadow-md group-hover:border-emerald-500 transition-colors pointer-events-none"
          />
          {clickCount > 0 && clickCount < 6 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center border border-white shadow-xs animate-scale-in">
              {clickCount}
            </span>
          )}
        </button>

        <div className="text-left">
          <span className="font-display font-black text-2xl md:text-3xl text-slate-900 tracking-wider">KIRITOS</span>
          <p className="text-xs text-emerald-800 font-bold">{t.header.tagline}</p>
        </div>
      </div>
      
      {/* Clean Main Headline */}
      <h1 id="main-heading" className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight font-display">
        {t.header.mainHeadingLine1} <br className="hidden sm:inline" />
        <span className="text-emerald-800">
          {t.header.mainHeadingHighlight}
        </span>
      </h1>
      
      {/* Simple Clean Subtitle */}
      <p id="sub-description" className="mt-2 text-xs sm:text-sm text-slate-600 max-w-lg mx-auto font-medium">
        {t.header.subDescription}
      </p>
    </div>
  );
}
