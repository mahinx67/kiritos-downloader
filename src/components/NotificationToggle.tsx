import React from "react";
import { useNotifications } from "../context/NotificationContext";
import { Bell, BellRing, Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export const NotificationToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { browserNotificationsEnabled, toggleBrowserNotifications } = useNotifications();
  const { isBangla } = useLanguage();

  return (
    <button
      type="button"
      onClick={() => toggleBrowserNotifications()}
      title={browserNotificationsEnabled ? "Browser Alerts Enabled" : "Enable Browser Alerts"}
      className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer select-none active:scale-95 ${
        browserNotificationsEnabled
          ? "bg-emerald-100/90 hover:bg-emerald-200/90 text-emerald-900 border-emerald-300 font-extrabold shadow-xs"
          : "bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border-slate-300/80 font-bold"
      }`}
    >
      {browserNotificationsEnabled ? (
        <>
          <BellRing className="w-3.5 h-3.5 text-emerald-700 animate-bounce" />
          {!compact && (
            <span className="text-[11px] font-extrabold flex items-center gap-1">
              {isBangla ? "নোটিফিকেশন অন" : "Alerts On"}
              <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
            </span>
          )}
        </>
      ) : (
        <>
          <Bell className="w-3.5 h-3.5 text-slate-500" />
          {!compact && (
            <span className="text-[11px] text-slate-600 font-bold">
              {isBangla ? "নোটিফিকেশন অ্যালার্ট" : "Alerts Off"}
            </span>
          )}
        </>
      )}
    </button>
  );
};
