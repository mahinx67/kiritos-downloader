import { useState, useEffect, FormEvent } from "react";
import { 
  Shield, 
  Lock, 
  Key, 
  X, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Activity, 
  Trash2, 
  RefreshCw, 
  Terminal, 
  Cpu, 
  Database,
  Radio,
  Play,
  Loader2,
  Sliders,
  Plus,
  Bell,
  Sparkles,
  Flame,
  Globe,
  HelpCircle,
  Settings,
  ToggleLeft,
  ToggleRight,
  Check,
  Zap,
  MessageSquare,
  Download
} from "lucide-react";
import { RecentDownloadItem, AdminAnnouncement, AdminCustomPlatform } from "../types";
import { useAdminStore } from "../utils/adminStore";
import { getApiUrl } from "../utils/api";
import { auth } from "../firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentDownloads: RecentDownloadItem[];
  onClearHistory: () => void;
}

export function AdminPanelModal({ 
  isOpen, 
  onClose, 
  recentDownloads,
  onClearHistory
}: AdminPanelModalProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<"overview" | "add-manager" | "tester" | "platforms" | "logs">("add-manager");
  const [addSection, setAddSection] = useState<"notices" | "config">("notices");

  // Admin Store
  const {
    announcements,
    config,
    addAnnouncement,
    toggleAnnouncement,
    deleteAnnouncement,
    saveAdminConfig
  } = useAdminStore();

  // New Notice Form State
  const [newNoticeText, setNewNoticeText] = useState("");
  const [newNoticeType, setNewNoticeType] = useState<AdminAnnouncement["type"]>("update");
  const [noticeAddedSuccess, setNoticeAddedSuccess] = useState(false);
  const [noticeError, setNoticeError] = useState<string | null>(null);

  // Config form state
  const [maintMode, setMaintMode] = useState(config.maintenanceMode);
  const [maintMsg, setMaintMsg] = useState(config.maintenanceMessage);
  const [audioBitrate, setAudioBitrate] = useState(config.defaultAudioBitrate);
  const [speedBoost, setSpeedBoost] = useState(config.serverSpeedBoost);
  const [configSavedSuccess, setConfigSavedSuccess] = useState(false);

  // Diagnostics state
  const [testUrl, setTestUrl] = useState("");
  const [testEndpoint, setTestEndpoint] = useState<"/api/download" | "/api/audio-extract">("/api/download");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<any | null>(null);

  // Built-in Platform statuses state
  const [platformStatuses, setPlatformStatuses] = useState<Record<string, boolean>>({
    YouTube: true,
    Spotify: true,
    TikTok: true,
    Instagram: true,
    Facebook: true,
    "Twitter / X": true,
    SoundCloud: true,
    Reddit: true,
    Pinterest: true
  });

  useEffect(() => {
    if (isOpen) {
      setAuthError(null);
      setMaintMode(config.maintenanceMode);
      setMaintMsg(config.maintenanceMessage);
      setAudioBitrate(config.defaultAudioBitrate);
      setSpeedBoost(config.serverSpeedBoost);
    }
  }, [isOpen, config]);

  useEffect(() => {
    const allowedAdminEmails = new Set([
      "mahin@mail.com",
      "mhamodulhasnat.mhmahin@gmail.com"
    ]);

    return onAuthStateChanged(auth, (user) => {
      const email = user?.email?.trim().toLowerCase() || "";
      const isAdmin = allowedAdminEmails.has(email);
      setIsAuthenticated(isAdmin);

      if (isAdmin) {
        sessionStorage.setItem("kiritos_admin_auth", "true");
      } else {
        sessionStorage.removeItem("kiritos_admin_auth");
      }
    });
  }, []);

  if (!isOpen) return null;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const cleanEmail = email.trim().toLowerCase();
    const allowedAdminEmails = new Set([
      "mahin@mail.com",
      "mhamodulhasnat.mhmahin@gmail.com"
    ]);

    if (!allowedAdminEmails.has(cleanEmail)) {
      setAuthError("This Firebase account is not authorized for the admin panel.");
      return;
    }

    try {
      const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const signedInEmail = credential.user.email?.trim().toLowerCase() || "";
      if (!allowedAdminEmails.has(signedInEmail)) {
        await signOut(auth);
        throw new Error("Unauthorized admin account");
      }
      setIsAuthenticated(true);
      sessionStorage.setItem("kiritos_admin_auth", "true");
      setAuthError(null);
    } catch {
      setAuthError("Invalid credentials. Please verify your admin email and password.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("kiritos_admin_auth");
    signOut(auth).catch(() => {});
    setEmail("");
    setPassword("");
  };

  // Add Notice Handler
  const handleAddNotice = async (e: FormEvent) => {
    e.preventDefault();
    if (!newNoticeText.trim()) return;
    setNoticeError(null);
    try {
      await addAnnouncement(newNoticeText, newNoticeType, true);
      setNewNoticeText("");
      setNoticeAddedSuccess(true);
      setTimeout(() => setNoticeAddedSuccess(false), 2500);
    } catch (err: any) {
      console.error("[ANNOUNCEMENT FIRESTORE SAVE ERROR]", err);
      setNoticeError("Announcement was not saved to Firebase. Check Firestore rules and admin login.");
    }
  };

  // Save Settings Handler
  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    saveAdminConfig({
      maintenanceMode: maintMode,
      maintenanceMessage: maintMsg,
      defaultAudioBitrate: audioBitrate,
      serverSpeedBoost: speedBoost
    });
    setConfigSavedSuccess(true);
    setTimeout(() => setConfigSavedSuccess(false), 2500);
  };

  const runApiTest = async () => {
    if (!testUrl.trim()) return;
    setIsTesting(true);
    setTestResult(null);

    const startTime = performance.now();
    try {
      const res = await fetch(getApiUrl(testEndpoint), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: testUrl.trim() })
      });
      const data = await res.json();
      const durationMs = Math.round(performance.now() - startTime);

      setTestResult({
        status: res.status,
        ok: res.ok,
        durationMs,
        data
      });
    } catch (err: any) {
      setTestResult({
        status: 500,
        ok: false,
        durationMs: Math.round(performance.now() - startTime),
        error: err.message || "Network request failed"
      });
    } finally {
      setIsTesting(false);
    }
  };

  const togglePlatform = (name: string) => {
    setPlatformStatuses(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl border border-emerald-300/80 shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white border-b border-emerald-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-xs">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-wide font-display text-white flex items-center gap-2">
                <span>KIRITOS Admin Master Control</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  v2.5
                </span>
              </h3>
              <p className="text-[10px] text-emerald-300 font-semibold">
                {isAuthenticated ? "Authenticated: mahin@mail.com" : "Restricted Master Access"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                title="Logout"
                className="px-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-red-500/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {!isAuthenticated ? (
            /* LOGIN SCREEN */
            <div className="py-6 max-w-md mx-auto space-y-5">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
                  <Lock className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-black text-slate-900 font-display">
                  Administrator Authentication
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Enter master administrative credentials to access server health, download diagnostics, and system controls.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Admin Email
                  </label>
                  <input
                    key="admin-login-email-input"
                    type="email"
                    required
                    value={email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="mahin@mail.com"
                    className="w-full px-4 py-3 bg-slate-50 border border-emerald-200 rounded-xl text-sm font-semibold text-slate-900 outline-hidden focus:border-emerald-600 focus:bg-white focus:ring-3 focus:ring-emerald-500/20 transition-all shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Admin Password
                  </label>
                  <input
                    key="admin-login-password-input"
                    type="password"
                    required
                    value={password || ""}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 border border-emerald-200 rounded-xl text-sm font-semibold text-slate-900 outline-hidden focus:border-emerald-600 focus:bg-white focus:ring-3 focus:ring-emerald-500/20 transition-all shadow-inner"
                  />
                </div>

                {authError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md shadow-emerald-600/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Verify & Unlock Dashboard</span>
                </button>
              </form>
            </div>
          ) : (
            /* AUTHENTICATED ADMIN DASHBOARD */
            <div className="space-y-5">
              {/* Primary Tab navigation */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold overflow-x-auto">
                <button
                  onClick={() => setActiveTab("add-manager")}
                  className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                    activeTab === "add-manager" 
                      ? "bg-emerald-600 text-white font-extrabold shadow-sm" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add & Manage</span>
                </button>
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "overview" 
                      ? "bg-white text-emerald-950 font-extrabold shadow-xs" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("platforms")}
                  className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "platforms" 
                      ? "bg-white text-emerald-950 font-extrabold shadow-xs" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Platform Feeds
                </button>
                <button
                  onClick={() => setActiveTab("tester")}
                  className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "tester" 
                      ? "bg-white text-emerald-950 font-extrabold shadow-xs" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  API Diagnostic
                </button>
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === "logs" 
                      ? "bg-white text-emerald-950 font-extrabold shadow-xs" 
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Logs ({recentDownloads.length})
                </button>
              </div>

              {/* ============================================================
                  TAB 1: ADD & MANAGE SUITE (NEW FEATURE)
                  ============================================================ */}
              {activeTab === "add-manager" && (
                <div className="space-y-4">
                  {/* Secondary Sub-Tabs for Adding Content */}
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                    <button
                      onClick={() => setAddSection("notices")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        addSection === "notices"
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Live Notices ({announcements.length})</span>
                    </button>

                    <button
                      onClick={() => setAddSection("config")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        addSection === "config"
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Settings className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Site Settings</span>
                    </button>
                  </div>

                  {/* SUB-SECTION 1: NOTICES / ANNOUNCEMENTS */}
                  {addSection === "notices" && (
                    <div className="space-y-4">
                      {/* Notice Creation Box */}
                      <form onSubmit={handleAddNotice} className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-700" />
                            <span>Add New Live Notice / Announcement</span>
                          </h5>
                          {noticeAddedSuccess && (
                            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 animate-scale-in">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Notice Published!
                            </span>
                          )}
                          {noticeError && (
                            <span className="text-xs text-red-700 font-bold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5" /> {noticeError}
                            </span>
                          )}
                        </div>

                        <div>
                          <input
                            key="admin-notice-text-input"
                            type="text"
                            required
                            placeholder="e.g. ⚡ TikTok No-Watermark & YouTube 4K download speed boosted!"
                            value={newNoticeText || ""}
                            onChange={(e) => setNewNoticeText(e.target.value)}
                            className="w-full px-3.5 py-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-medium text-slate-900 outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
                          />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-600">Notice Type:</span>
                            <select
                              key="admin-notice-type-select"
                              value={newNoticeType || "update"}
                              onChange={(e) => setNewNoticeType(e.target.value as any)}
                              className="px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-slate-800 outline-hidden"
                            >
                              <option value="update">⚡ Update</option>
                              <option value="feature">🔥 Hot Feature</option>
                              <option value="notice">📢 Announcement</option>
                              <option value="alert">⚠️ Alert</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Publish Notice</span>
                          </button>
                        </div>
                      </form>

                      {/* Current Announcements List */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                          Existing Live Notices (Active ones display on website header)
                        </span>

                        {announcements.length === 0 ? (
                          <div className="p-4 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-400">
                            No notices created yet.
                          </div>
                        ) : (
                          announcements.map((ann) => (
                            <div
                              key={ann.id}
                              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                                ann.isActive
                                  ? "bg-white border-emerald-300 shadow-xs"
                                  : "bg-slate-50 border-slate-200 opacity-60"
                              }`}
                            >
                              <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                    ann.type === "update" ? "bg-emerald-100 text-emerald-800" :
                                    ann.type === "feature" ? "bg-violet-100 text-violet-800" :
                                    ann.type === "alert" ? "bg-amber-100 text-amber-900" : "bg-blue-100 text-blue-800"
                                  }`}>
                                    {ann.type}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-semibold">{ann.createdAt}</span>
                                  {ann.isActive && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
                                      LIVE
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-medium text-slate-900 break-words">{ann.text}</p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => toggleAnnouncement(ann.id)}
                                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    ann.isActive
                                      ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-900"
                                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                                  }`}
                                >
                                  {ann.isActive ? "Active" : "Disabled"}
                                </button>
                                <button
                                  onClick={() => deleteAnnouncement(ann.id)}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* SUB-SECTION 2: SITE CONFIG & SPEED SETTINGS */}
                  {addSection === "config" && (
                    <form onSubmit={handleSaveSettings} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <Settings className="w-4 h-4 text-emerald-700" />
                          <span>System & Downloader Configuration</span>
                        </h5>
                        {configSavedSuccess && (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 animate-scale-in">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Settings Saved!
                          </span>
                        )}
                      </div>

                      {/* Maintenance mode */}
                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 block">Maintenance Flag</span>
                          <span className="text-[11px] text-slate-500">Temporarily displays server maintenance alert</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMaintMode(!maintMode)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase cursor-pointer transition-all ${
                            maintMode ? "bg-amber-200 text-amber-900" : "bg-emerald-100 text-emerald-900"
                          }`}
                        >
                          {maintMode ? "ENABLED" : "DISABLED"}
                        </button>
                      </div>

                      {maintMode && (
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Maintenance Banner Message</label>
                          <input
                            key="admin-maint-msg-input"
                            type="text"
                            value={maintMsg || ""}
                            onChange={(e) => setMaintMsg(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-amber-300 rounded-xl text-xs font-medium text-slate-900 outline-hidden shadow-inner"
                          />
                        </div>
                      )}

                      {/* Server proxy speed boost */}
                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 block flex items-center gap-1.5">
                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                            <span>High-Speed Proxy Stream Engine</span>
                          </span>
                          <span className="text-[11px] text-slate-500">Directly pipes streams through /api/proxy-download for instant downloads</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSpeedBoost(!speedBoost)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase cursor-pointer transition-all ${
                            speedBoost ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {speedBoost ? "ACTIVE" : "BYPASSED"}
                        </button>
                      </div>

                      {/* Audio Bitrate Preference */}
                      <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-slate-900 block">Default Studio Bitrate</span>
                          <span className="text-[11px] text-slate-500">Preferred target bitrate for MP3 extractions</span>
                        </div>
                        <select
                          key="admin-audio-bitrate-select"
                          value={audioBitrate || "320kbps"}
                          onChange={(e) => setAudioBitrate(e.target.value)}
                          className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-hidden"
                        >
                          <option value="320kbps">320 kbps (Lossless)</option>
                          <option value="256kbps">256 kbps (High Quality)</option>
                          <option value="192kbps">192 kbps (Balanced)</option>
                        </select>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
                        >
                          <Check className="w-4 h-4" />
                          <span>Save Settings</span>
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* ============================================================
                  TAB 2: OVERVIEW
                  ============================================================ */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* Status Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
                      <div className="flex items-center justify-between text-emerald-800 mb-1">
                        <Server className="w-4 h-4" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Node.js Server</span>
                      <span className="text-sm font-extrabold text-slate-900">Port 3000 Active</span>
                    </div>

                    <div className="p-3.5 bg-teal-50/80 border border-teal-200 rounded-2xl">
                      <div className="flex items-center justify-between text-teal-800 mb-1">
                        <Activity className="w-4 h-4" />
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Audio API</span>
                      <span className="text-sm font-extrabold text-slate-900">{config.defaultAudioBitrate} Ready</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="flex items-center justify-between text-slate-700 mb-1">
                        <Database className="w-4 h-4" />
                        <span className="text-[10px] font-bold text-slate-400">Local</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Session Items</span>
                      <span className="text-sm font-extrabold text-slate-900">{recentDownloads.length} Saved</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                      <div className="flex items-center justify-between text-slate-700 mb-1">
                        <Radio className="w-4 h-4" />
                        <span className="text-[10px] font-bold text-emerald-600">Online</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Platforms</span>
                      <span className="text-sm font-extrabold text-slate-900">18 Connected</span>
                    </div>
                  </div>

                  {/* System Quick Controls */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Quick Administrative Actions
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        onClick={onClearHistory}
                        className="p-3 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-red-700 block">Purge Download Cache</span>
                          <span className="text-[10px] text-slate-500">Deletes client-side recent downloads</span>
                        </div>
                        <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
                      </button>

                      <button
                        onClick={() => setActiveTab("add-manager")}
                        className="p-3 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer group"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 block">Manage & Add Items</span>
                          <span className="text-[10px] text-slate-500">{announcements.length} Live Notices & Settings</span>
                        </div>
                        <Plus className="w-4 h-4 text-emerald-600" />
                      </button>

                      <a
                        href={getApiUrl("/api/admin/download-source-code")}
                        download="kiritos-downloader-source.zip"
                        className="p-3 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20 border border-emerald-300/40 hover:border-emerald-400 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer group shadow-xs active:scale-98"
                      >
                        <div>
                          <span className="text-xs font-black text-emerald-950 group-hover:text-emerald-700 block flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-emerald-500 animate-pulse" />
                            <span>Download Source ZIP</span>
                          </span>
                          <span className="text-[10px] text-slate-500">1-Click full website source download</span>
                        </div>
                        <Download className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================================
                  TAB 3: API TESTER
                  ============================================================ */}
              {activeTab === "tester" && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2">
                      <select
                        key="admin-test-endpoint-select"
                        value={testEndpoint || "/api/download"}
                        onChange={(e) => setTestEndpoint(e.target.value as any)}
                        className="bg-white border border-slate-300 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 outline-hidden"
                      >
                        <option value="/api/download">POST /api/download</option>
                        <option value="/api/audio-extract">POST /api/audio-extract (MP3)</option>
                      </select>
                      <input
                        key="admin-test-url-input"
                        type="url"
                        placeholder="Enter URL to test (e.g., YouTube, TikTok, Spotify)..."
                        value={testUrl || ""}
                        onChange={(e) => setTestUrl(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 px-3 py-2 rounded-xl text-xs font-medium text-slate-800 outline-hidden focus:border-emerald-500"
                      />
                      <button
                        onClick={runApiTest}
                        disabled={isTesting || !testUrl.trim()}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
                      >
                        {isTesting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                        <span>Ping</span>
                      </button>
                    </div>

                    {testResult && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700">Response Status:</span>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                              testResult.ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                            }`}>
                              HTTP {testResult.status}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold">{testResult.durationMs}ms</span>
                          </div>
                        </div>

                        <div className="max-h-56 overflow-y-auto p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl border border-slate-800 shadow-inner">
                          <pre>{JSON.stringify(testResult.data || testResult.error, null, 2)}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ============================================================
                  TAB 4: PLATFORMS
                  ============================================================ */}
              {activeTab === "platforms" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">
                      Active extractor pipelines for supported social media platforms:
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab("add-manager");
                        setAddSection("platforms");
                      }}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add New Platform</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Object.entries(platformStatuses).map(([name, isOnline]) => (
                      <div
                        key={name}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-red-500"}`}></span>
                          <span className="text-xs font-bold text-slate-800">{name}</span>
                        </div>
                        <button
                          onClick={() => togglePlatform(name)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all ${
                            isOnline
                              ? "bg-emerald-100 hover:bg-emerald-200 text-emerald-900"
                              : "bg-red-100 hover:bg-red-200 text-red-900"
                          }`}
                        >
                          {isOnline ? "Active" : "Disabled"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ============================================================
                  TAB 5: LOGS
                  ============================================================ */}
              {activeTab === "logs" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Recent User Extraction Queries</span>
                    {recentDownloads.length > 0 && (
                      <button
                        onClick={onClearHistory}
                        className="text-[11px] text-red-600 hover:text-red-700 font-bold cursor-pointer"
                      >
                        Clear All Logs
                      </button>
                    )}
                  </div>

                  {recentDownloads.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 text-xs">
                      No downloads recorded in current local session.
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                      {recentDownloads.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="min-w-0 flex-1">
                            <h6 className="font-bold text-slate-900 truncate">{item.title}</h6>
                            <p className="text-[10px] text-slate-500 truncate">{item.url}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-300 shrink-0">
                            {item.platform}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>KIRITOS Admin Master Control</span>
          <span>Access: mahin@mail.com</span>
        </div>
      </div>
    </div>
  );
}
