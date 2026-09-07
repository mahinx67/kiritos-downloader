import { useState, useEffect } from "react";
import { 
  AdminAnnouncement, 
  AdminCustomPlatform, 
  AdminCustomFaq, 
  AdminSiteConfig 
} from "../types";
import { db } from "../firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const STORAGE_KEY_ANNOUNCEMENTS = "kiritos_admin_announcements";
const STORAGE_KEY_PLATFORMS = "kiritos_admin_custom_platforms";
const STORAGE_KEY_FAQS = "kiritos_admin_custom_faqs";
const STORAGE_KEY_CONFIG = "kiritos_admin_site_config";
const EVENT_SYNC = "kiritos_admin_sync";

const DEFAULT_ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    id: "ann-1",
    text: "⚡ Update: High-speed TikTok No-Watermark and YouTube 4K/MP3 downloads enabled!",
    type: "update",
    isActive: true,
    createdAt: new Date().toLocaleDateString()
  }
];

const DEFAULT_PLATFORMS: AdminCustomPlatform[] = [
  {
    id: "plat-capcut",
    name: "CapCut Pro",
    domain: "capcut.com",
    category: "video",
    badge: "1080p HD",
    exampleUrl: "https://www.capcut.com/template-detail/12345",
    isActive: true
  },
  {
    id: "plat-threads",
    name: "Threads Video",
    domain: "threads.net",
    category: "social",
    badge: "Lossless",
    exampleUrl: "https://www.threads.net/@user/post/12345",
    isActive: true
  }
];

const DEFAULT_FAQS: AdminCustomFaq[] = [
  {
    id: "faq-1",
    question: "Do I need to register or create an account to use KIRITOS?",
    answer: "Not at all! KIRITOS is 100% free with unlimited downloads and requires no accounts, passwords, or personal credentials.",
    createdAt: new Date().toLocaleDateString()
  },
  {
    id: "faq-2",
    question: "How can I download Facebook and Instagram Reels in highest quality?",
    answer: "Copy the Reel link from the share menu, paste it into KIRITOS, and click 'Download'. Select your preferred MP4 resolution to save it instantly.",
    createdAt: new Date().toLocaleDateString()
  }
];

const DEFAULT_CONFIG: AdminSiteConfig = {
  maintenanceMode: false,
  maintenanceMessage: "Scheduled server maintenance in progress. We'll be back shortly!",
  defaultAudioBitrate: "320kbps",
  serverSpeedBoost: true
};

function triggerSync() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT_SYNC));
  }
}

// 1. Announcements
export function getAdminAnnouncements(): AdminAnnouncement[] {
  if (typeof window === "undefined") return DEFAULT_ANNOUNCEMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ANNOUNCEMENTS);
    if (!raw || /[\u0980-\u09FF]/.test(raw)) {
      localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
      return DEFAULT_ANNOUNCEMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ANNOUNCEMENTS;
  }
}

export async function saveAdminAnnouncements(items: AdminAnnouncement[]): Promise<void> {
  await setDoc(doc(db, "site_config", "announcements"), { items }, { merge: true });
  try {
    localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(items));
    triggerSync();
  } catch (err) {
    console.warn("Firestore saved, but local announcement cache was unavailable:", err);
  }
}

export async function addAnnouncement(text: string, type: AdminAnnouncement["type"], isActive: boolean = true): Promise<AdminAnnouncement> {
  const current = getAdminAnnouncements();
  const newItem: AdminAnnouncement = {
    id: "ann-" + Date.now(),
    text: text.trim(),
    type,
    isActive,
    createdAt: new Date().toLocaleDateString()
  };
  await saveAdminAnnouncements([newItem, ...current]);
  return newItem;
}

export async function toggleAnnouncement(id: string): Promise<void> {
  const current = getAdminAnnouncements();
  const updated = current.map(item => item.id === id ? { ...item, isActive: !item.isActive } : item);
  await saveAdminAnnouncements(updated);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const current = getAdminAnnouncements();
  await saveAdminAnnouncements(current.filter(item => item.id !== id));
}

// 2. Custom Platforms
export function getAdminPlatforms(): AdminCustomPlatform[] {
  if (typeof window === "undefined") return DEFAULT_PLATFORMS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PLATFORMS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_PLATFORMS, JSON.stringify(DEFAULT_PLATFORMS));
      return DEFAULT_PLATFORMS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PLATFORMS;
  }
}

export async function saveAdminPlatforms(items: AdminCustomPlatform[]): Promise<void> {
  await setDoc(doc(db, "site_config", "platforms"), { items }, { merge: true });
  try {
    localStorage.setItem(STORAGE_KEY_PLATFORMS, JSON.stringify(items));
    triggerSync();
  } catch (err) {
    console.warn("Firestore saved, but local platform cache was unavailable:", err);
  }
}

export async function addCustomPlatform(
  name: string, 
  domain: string, 
  category: AdminCustomPlatform["category"] = "video", 
  badge: string = "HD", 
  exampleUrl: string = ""
): Promise<AdminCustomPlatform> {
  const current = getAdminPlatforms();
  const newItem: AdminCustomPlatform = {
    id: "plat-" + Date.now(),
    name: name.trim(),
    domain: domain.trim().toLowerCase(),
    category,
    badge: badge.trim() || "HD",
    exampleUrl: exampleUrl.trim() || `https://${domain.trim().toLowerCase()}`,
    isActive: true
  };
  await saveAdminPlatforms([...current, newItem]);
  return newItem;
}

export async function toggleCustomPlatform(id: string): Promise<void> {
  const current = getAdminPlatforms();
  await saveAdminPlatforms(current.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
}

export async function deleteCustomPlatform(id: string): Promise<void> {
  const current = getAdminPlatforms();
  await saveAdminPlatforms(current.filter(p => p.id !== id));
}

// 3. Custom FAQs
export function getAdminFaqs(): AdminCustomFaq[] {
  if (typeof window === "undefined") return DEFAULT_FAQS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FAQS);
    if (!raw || /[\u0980-\u09FF]/.test(raw)) {
      localStorage.setItem(STORAGE_KEY_FAQS, JSON.stringify(DEFAULT_FAQS));
      return DEFAULT_FAQS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_FAQS;
  }
}

export async function saveAdminFaqs(items: AdminCustomFaq[]): Promise<void> {
  await setDoc(doc(db, "site_config", "faqs"), { items }, { merge: true });
  try {
    localStorage.setItem(STORAGE_KEY_FAQS, JSON.stringify(items));
    triggerSync();
  } catch (err) {
    console.warn("Firestore saved, but local FAQ cache was unavailable:", err);
  }
}

export async function addCustomFaq(question: string, answer: string): Promise<AdminCustomFaq> {
  const current = getAdminFaqs();
  const newItem: AdminCustomFaq = {
    id: "faq-" + Date.now(),
    question: question.trim(),
    answer: answer.trim(),
    createdAt: new Date().toLocaleDateString()
  };
  await saveAdminFaqs([...current, newItem]);
  return newItem;
}

export async function deleteCustomFaq(id: string): Promise<void> {
  const current = getAdminFaqs();
  await saveAdminFaqs(current.filter(f => f.id !== id));
}

// 4. Site Config
export function getAdminConfig(): AdminSiteConfig {
  if (typeof window === "undefined") return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (!raw || /[\u0980-\u09FF]/.test(raw)) {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(DEFAULT_CONFIG));
      return DEFAULT_CONFIG;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function saveAdminConfig(config: AdminSiteConfig): Promise<void> {
  await setDoc(doc(db, "site_config", "general"), config, { merge: true });
  try {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    triggerSync();
  } catch (err) {
    console.warn("Firestore saved, but local config cache was unavailable:", err);
  }
}

// Custom React Hook for live synchronization
export function useAdminStore() {
  const [announcements, setAnnouncements] = useState<AdminAnnouncement[]>(getAdminAnnouncements);
  const [platforms, setPlatforms] = useState<AdminCustomPlatform[]>(getAdminPlatforms);
  const [faqs, setFaqs] = useState<AdminCustomFaq[]>(getAdminFaqs);
  const [config, setConfig] = useState<AdminSiteConfig>(getAdminConfig);

  const refreshAll = () => {
    setAnnouncements(getAdminAnnouncements());
    setPlatforms(getAdminPlatforms());
    setFaqs(getAdminFaqs());
    setConfig(getAdminConfig());
  };

  useEffect(() => {
    const handleStorageOrSync = () => {
      refreshAll();
    };

    window.addEventListener(EVENT_SYNC, handleStorageOrSync);
    window.addEventListener("storage", handleStorageOrSync);

    // Live Real-Time Firestore listeners
    let unsubConfig: (() => void) | null = null;
    let unsubAnn: (() => void) | null = null;
    let unsubPlat: (() => void) | null = null;
    let unsubFaq: (() => void) | null = null;

    try {
      unsubConfig = onSnapshot(doc(db, "site_config", "general"), (snapshot) => {
        if (snapshot.exists()) {
          const cloudConfig = snapshot.data() as AdminSiteConfig;
          setConfig(prev => ({ ...prev, ...cloudConfig }));
          localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(cloudConfig));
        }
      }, (err) => {
        console.log("Config listener fallback to local:", err.message);
      });

      unsubAnn = onSnapshot(doc(db, "site_config", "announcements"), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data?.items)) {
            setAnnouncements(data.items);
            localStorage.setItem(STORAGE_KEY_ANNOUNCEMENTS, JSON.stringify(data.items));
          }
        }
      }, (err) => {
        console.log("Announcements listener fallback to local:", err.message);
      });

      unsubPlat = onSnapshot(doc(db, "site_config", "platforms"), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data?.items)) {
            setPlatforms(data.items);
            localStorage.setItem(STORAGE_KEY_PLATFORMS, JSON.stringify(data.items));
          }
        }
      }, (err) => {
        console.log("Platforms listener fallback to local:", err.message);
      });

      unsubFaq = onSnapshot(doc(db, "site_config", "faqs"), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data?.items)) {
            setFaqs(data.items);
            localStorage.setItem(STORAGE_KEY_FAQS, JSON.stringify(data.items));
          }
        }
      }, (err) => {
        console.log("FAQs listener fallback to local:", err.message);
      });
    } catch (err) {
      console.log("Firestore sync initialization note:", err);
    }

    return () => {
      window.removeEventListener(EVENT_SYNC, handleStorageOrSync);
      window.removeEventListener("storage", handleStorageOrSync);
      if (unsubConfig) unsubConfig();
      if (unsubAnn) unsubAnn();
      if (unsubPlat) unsubPlat();
      if (unsubFaq) unsubFaq();
    };
  }, []);

  return {
    announcements,
    platforms,
    faqs,
    config,
    refreshAll,
    addAnnouncement,
    toggleAnnouncement,
    deleteAnnouncement,
    addCustomPlatform,
    toggleCustomPlatform,
    deleteCustomPlatform,
    addCustomFaq,
    deleteCustomFaq,
    saveAdminConfig
  };
}
