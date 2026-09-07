import React from "react";
import { useNotifications } from "../context/NotificationContext";
import { CheckCircle2, Download, Bell, AlertTriangle, X, Sparkles } from "lucide-react";

export const NotificationToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isDownload = toast.type === "download";
        const isWarning = toast.type === "warning";

        return (
          <div
            key={toast.id}
            className="pointer-events-auto liquid-glass-card p-4 rounded-2xl shadow-xl border border-white/60 backdrop-blur-xl flex items-start gap-3 animate-slide-down transition-all"
            style={{
              background: isSuccess
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(236, 253, 245, 0.95))"
                : isDownload
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 253, 250, 0.95))"
                : isWarning
                ? "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 241, 242, 0.95))"
                : "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(241, 245, 249, 0.95))"
            }}
          >
            {/* Icon */}
            <div className={`p-2 rounded-xl flex-shrink-0 ${
              isSuccess 
                ? "bg-emerald-100 text-emerald-700" 
                : isDownload
                ? "bg-teal-100 text-teal-700"
                : isWarning
                ? "bg-rose-100 text-rose-700"
                : "bg-slate-100 text-slate-700"
            }`}>
              {isSuccess && <CheckCircle2 className="w-5 h-5" />}
              {isDownload && <Download className="w-5 h-5" />}
              {isWarning && <AlertTriangle className="w-5 h-5" />}
              {!isSuccess && !isDownload && !isWarning && <Bell className="w-5 h-5" />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-slate-900 font-display truncate">
                  {toast.title}
                </h4>
                <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed font-medium">
                {toast.message}
              </p>

              {toast.actionLabel && toast.onAction && (
                <button
                  type="button"
                  onClick={() => {
                    toast.onAction?.();
                    dismissToast(toast.id);
                  }}
                  className="mt-2 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-emerald-700 text-white shadow-xs hover:bg-emerald-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  {toast.actionLabel}
                </button>
              )}
            </div>

            {/* Close */}
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
