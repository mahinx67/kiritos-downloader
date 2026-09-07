import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Bell, AlertTriangle, Flame, X, ArrowRight } from "lucide-react";
import { useAdminStore } from "../utils/adminStore";
import { AdminAnnouncement } from "../types";

export function SiteAnnouncementBanner() {
  const { announcements } = useAdminStore();
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    try {
      const stored = sessionStorage.getItem("kiritos_dismissed_announcements");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Find the first active announcement that has not been dismissed
  const activeItem = announcements.find(
    (a) => a.isActive && !dismissedIds.includes(a.id)
  );

  const handleDismiss = (id: string) => {
    const updated = [...dismissedIds, id];
    setDismissedIds(updated);
    try {
      sessionStorage.setItem("kiritos_dismissed_announcements", JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  if (!activeItem) return null;

  const renderBadge = (type: AdminAnnouncement["type"]) => {
    switch (type) {
      case "update":
        return {
          icon: <Sparkles className="w-3.5 h-3.5" />,
          label: "Update",
          style: "bg-emerald-600 text-white shadow-xs"
        };
      case "feature":
        return {
          icon: <Flame className="w-3.5 h-3.5" />,
          label: "New Feature",
          style: "bg-violet-600 text-white shadow-xs"
        };
      case "alert":
        return {
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: "Alert",
          style: "bg-amber-600 text-white shadow-xs"
        };
      case "notice":
      default:
        return {
          icon: <Bell className="w-3.5 h-3.5" />,
          label: "Notice",
          style: "bg-blue-600 text-white shadow-xs"
        };
    }
  };

  const badge = renderBadge(activeItem.type);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        className="w-full max-w-4xl mx-auto mb-4 px-2 select-none"
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 p-2.5 sm:p-3 shadow-md flex items-center justify-between gap-3 text-white">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badge.style} shrink-0`}>
              {badge.icon}
              <span className="hidden sm:inline">{badge.label}</span>
            </span>
            <p className="text-xs sm:text-sm font-medium text-emerald-100 truncate">
              {activeItem.text}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleDismiss(activeItem.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-emerald-300 hover:text-white transition-colors cursor-pointer"
              title="Dismiss announcement"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
