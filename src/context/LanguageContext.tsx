import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "bn";

export interface Translations {
  header: {
    brandSubtitle: string;
    tagline: string;
    mainHeading1: string;
    mainHeading2: string;
    mainHeadingLine1: string;
    mainHeadingHighlight: string;
    subDescription: string;
    translatorBtn: string;
    translatorBadge: string;
    translatorTooltip: string;
  };
  navigation: {
    downloader: string;
    hdEnhancer: string;
    mp3Studio: string;
    videoTrimmer: string;
    socialTools: string;
    imageTools: string;
    home: string;
    tools: string;
    platforms: string;
    recent: string;
    guides: string;
    apiDocs: string;
  };
  downloader: {
    inputPlaceholder: string;
    placeholder: string;
    clear: string;
    paste: string;
    pasted: string;
    emptyWarning: string;
    downloadBtn: string;
    download: string;
    fetching: string;
    fetchingDesc: string;
    footerNote: string;
    worksWithNote: string;
    tabAll: string;
    tabVideo: string;
    tabAudio: string;
    tabImage: string;
    tabThumbnail: string;
    platformPrefix: string;
    detectedPlatform: string;
  };
  platformChips: {
    supportedPlatforms: string;
    allSupportedPlatforms: string;
    clickToPasteSample: string;
    fullySupported: string;
    loadSampleLink: string;
    title: string;
    subtitle: string;
    directExtractionReady: string;
    pasteSampleLink: string;
    supportedBtn: string;
    allSupported: string;
    clickToPaste: string;
    samplePrefix: string;
  };
  platforms: {
    title: string;
    subtitle: string;
    directExtractionReady: string;
    pasteSampleLink: string;
    supportedPlatforms: string;
    allSupportedPlatforms: string;
    clickToPasteSample: string;
    fullySupported: string;
    loadSampleLink: string;
    supportedBtn: string;
    allSupported: string;
    clickToPaste: string;
    samplePrefix: string;
  };
  resultCard: {
    readyToDownload: string;
    mediaPreviewPlayer: string;
    previewDesc: string;
    previewNotAvailable: string;
    availableStreams: string;
    download: string;
    links: string;
    noStreamsFound: string;
    postCaption: string;
    postDescription: string;
    copyCaption: string;
    copyDescription: string;
    copyHashtags: string;
    copyAll: string;
    hashtagsLabel: string;
    copied: string;
    clearNewLink: string;
    videoPlayerUnsupported: string;
  };
  result: {
    readyToDownload: string;
    mediaPreviewPlayer: string;
    previewDesc: string;
    previewNotAvailable: string;
    availableStreams: string;
    download: string;
    links: string;
    noStreamsFound: string;
    postCaption: string;
    postDescription: string;
    copyCaption: string;
    copyDescription: string;
    copyHashtags: string;
    copyAll: string;
    hashtagsLabel: string;
    copied: string;
    clearNewLink: string;
    videoPlayerUnsupported: string;
  };
  recentDownloads: {
    title: string;
    desc: string;
    clearHistory: string;
    noDownloads: string;
    noDownloadsDesc: string;
    reopen: string;
  };
  history: {
    title: string;
    desc: string;
    clearHistory: string;
    noDownloads: string;
    noDownloadsDesc: string;
    reopen: string;
  };
  faq: {
    faqTitle: string;
    faqDesc: string;
    tutorialTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    questions: Array<{ q: string; a: string }>;
  };
  infoPages: {
    faqTitle: string;
    faqDesc: string;
    tutorialTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    faqs: Array<{ q: string; a: string }>;
  };
  maintenance: {
    badge: string;
    defaultMsg: string;
  };
  footer: {
    copyright: string;
    disclaimer: string;
    backToTop: string;
  };
}

const enPlatformData = {
  title: "Supported Platforms",
  subtitle: "Direct Stream Extraction Engine",
  directExtractionReady: "Ready to Extract",
  pasteSampleLink: "Paste sample link",
  supportedPlatforms: "Supported Platforms",
  allSupportedPlatforms: "All Supported Platforms",
  clickToPasteSample: "Click any platform to paste sample link",
  fullySupported: "Fully Supported",
  loadSampleLink: "Load Sample Link",
  supportedBtn: "Supported Platforms",
  allSupported: "All Supported Platforms",
  clickToPaste: "Click any platform to paste sample link",
  samplePrefix: "Paste sample"
};

const bnPlatformData = {
  title: "সাপোর্টেড প্ল্যাটফর্মসমূহ",
  subtitle: "ডিরেক্ট স্ট্রিম এক্সট্র্যাক্টর ইঞ্জিন",
  directExtractionReady: "ডাউনলোডের জন্য প্রস্তুত",
  pasteSampleLink: "নমুনা লিঙ্ক বসান",
  supportedPlatforms: "সাপোর্টেড প্ল্যাটফর্মসমূহ",
  allSupportedPlatforms: "সকল সাপোর্টেড প্ল্যাটফর্ম",
  clickToPasteSample: "নমুনা লিঙ্ক বসাতে যেকোনো প্ল্যাটফর্মে ক্লিক করুন",
  fullySupported: "সম্পূর্ণ সাপোর্টেড",
  loadSampleLink: "নমুনা লিঙ্ক বসান",
  supportedBtn: "সাপোর্টেড প্ল্যাটফর্ম",
  allSupported: "সকল সাপোর্টেড প্ল্যাটফর্ম",
  clickToPaste: "নমুনা লিঙ্ক বসাতে যেকোনো প্ল্যাটফর্মে ক্লিক করুন",
  samplePrefix: "নমুনা লিঙ্ক"
};

const enResultData = {
  readyToDownload: "Ready to Play & Download",
  mediaPreviewPlayer: "Media Preview Player",
  previewDesc: "You can watch and listen to the video directly above before downloading.",
  previewNotAvailable: "Preview Stream Not Available",
  availableStreams: "Available Streams",
  download: "Download",
  links: "Links",
  noStreamsFound: "No direct streams found matching this category.",
  postCaption: "Post Caption",
  postDescription: "Full Description & Details",
  copyCaption: "Copy Caption",
  copyDescription: "Copy Description",
  copyHashtags: "Copy All Hashtags",
  copyAll: "Copy Everything",
  hashtagsLabel: "Extracted Hashtags",
  copied: "Copied!",
  clearNewLink: "New Link",
  videoPlayerUnsupported: "Your browser does not support inline video preview."
};

const bnResultData = {
  readyToDownload: "প্লে ও ডাউনলোড করতে প্রস্তুত",
  mediaPreviewPlayer: "মিডিয়া প্রিভিউ প্লেয়ার",
  previewDesc: "ডাউনলোড করার আগে উপরের প্লেয়ারে ভিডিও বা অডিও সরাসরি চালিয়ে দেখে নিতে পারেন।",
  previewNotAvailable: "সরাসরি প্রিভিউ পাওয়া যায়নি",
  availableStreams: "ডাউনলোডযোগ্য ফাইলসমূহ",
  download: "ডাউনলোড",
  links: "লিঙ্ক",
  noStreamsFound: "এই ক্যাটাগরির কোনো ফাইল খুঁজে পাওয়া যায়নি।",
  postCaption: "পোস্টের মূল ক্যাপশন",
  postDescription: "বিস্তারিত বিবরণ ও ডেসক্রিপশন",
  copyCaption: "ক্যাপশন কপি",
  copyDescription: "ডেসক্রিপশন কপি",
  copyHashtags: "সব হ্যাশট্যাগ কপি",
  copyAll: "সব কপি করুন",
  hashtagsLabel: "পোস্টের হ্যাশট্যাগসমূহ",
  copied: "কপি হয়েছে!",
  clearNewLink: "নতুন লিঙ্ক",
  videoPlayerUnsupported: "আপনার ব্রাউজার ইনলাইন ভিডিও প্রিভিউ সাপোর্ট করে না।"
};

const enHistoryData = {
  title: "Recent Downloads",
  desc: "Your stream extraction history for this session.",
  clearHistory: "Clear History",
  noDownloads: "No Downloads Found",
  noDownloadsDesc: "Once you extract media files, they will show up here for fast access.",
  reopen: "Re-open"
};

const bnHistoryData = {
  title: "সাম্প্রতিক ডাউনলোড তালিকা",
  desc: "এই সেশনে আপনার ডাউনলোড ও এক্সট্র্যাক্ট করা ফাইলসমূহ।",
  clearHistory: "হিস্ট্রি মুছুন",
  noDownloads: "কোনো ডাউনলোড রেকর্ড নেই",
  noDownloadsDesc: "মিডিয়া ফাইল ডাউনলোড করলেই দ্রুত পাওয়ার জন্য এখানে জমা হবে।",
  reopen: "পুনরায় খুলুন"
};

const enFaqQuestions = [
  {
    q: "How do I download videos using KIRITOS?",
    a: "It's super easy! First, copy the video link from any supported platform (such as YouTube, TikTok, Facebook, or Instagram). Next, paste the link into the KIRITOS input field and click 'Download'. Finally, pick your desired quality (1080p, 4K, MP3, etc.) to save it immediately."
  },
  {
    q: "Do I need to sign up or log in to use KIRITOS?",
    a: "Absolutely not. KIRITOS is designed with complete privacy in mind. We do not require registration, passwords, phone numbers, or any accounts. All downloads are 100% free and instantly accessible."
  },
  {
    q: "Can I download TikTok & Reels without watermark?",
    a: "Yes! When downloading TikTok videos or Instagram Reels, KIRITOS automatically fetches the clean HD stream without the platform watermark."
  },
  {
    q: "How can I convert videos to MP3 audio directly?",
    a: "Paste your video link and choose the 'Audio' tab from the stream list, or visit 'MP3 Studio' from our navigation bar to extract lossless 320kbps audio files."
  },
  {
    q: "Why do some links show an extraction error?",
    a: "This usually happens if the video is set to 'Private', deleted by its author, or restricted by region. Please verify that the post is public and viewable in an incognito window."
  }
];

const bnFaqQuestions = [
  {
    q: "KIRITOS দিয়ে কিভাবে যেকোনো ভিডিও ডাউনলোড করব?",
    a: "খুবই সহজ! প্রথমে যেকোনো সোশ্যাল প্ল্যাটফর্ম (YouTube, TikTok, Facebook, Instagram ইত্যাদি) থেকে ভিডিও লিঙ্ক কপি করুন। এরপর KIRITOS-এর ইনপুট বক্সে লিঙ্কটি পেস্ট করে 'ডাউনলোড' বাটনে চাপুন। সবশেষে পছন্দের কোয়ালিটি বেছে নিয়ে ডাউনলোড করুন।"
  },
  {
    q: "KIRITOS ব্যবহার করতে কি কোনো একাউন্ট বা রেজিস্ট্রেশন করতে হবে?",
    a: "একদমই না! KIRITOS সম্পূর্ণ গোপনীয়তা মেনে চলে। এখানে কোনো ইউজারনেম, পাসওয়ার্ড বা ফোন নম্বর লাগে না। আনলিমিটেড ডাউনলোড সম্পূর্ণ বিনামূল্যে করা যায়।"
  },
  {
    q: "টিকটক ও রিলস কি ওয়াটারমার্ক ছাড়া ডাউনলোড হবে?",
    a: "হ্যাঁ! টিকটক বা ইনস্টাগ্রাম রিলসের ক্ষেত্রে KIRITOS কোনো ওয়াটারমার্ক ছাড়াই সরাসরি অরিজিনাল এইচডি ভিডিও ফাইলটি সেভ করে দেয়।"
  },
  {
    q: "ভিডিও থেকে সরাসরি MP3 গান বের করব কিভাবে?",
    a: "ভিডিও লিঙ্কটি পেস্ট করে রেজাল্ট কার্ডের 'Audio' ট্যাব সিলেক্ট করুন অথবা আমাদের নেভিগেশন বার থেকে 'MP3 স্টুডিও' ব্যবহার করে হাই কোয়ালিটি ৩২০kbps MP3 ডাউনলোড করুন।"
  },
  {
    q: "মাঝে মাঝে লিঙ্কে এরর বা ব্যর্থ দেখায় কেন?",
    a: "ভিডিওটি যদি প্রাইভেট (Private) হয় অথবা ক্রিয়েটর ডিলিট করে দেয়, তাহলে ডাউনলোড হবে না। লিঙ্কটি পাবলিক কি না তা যাচাই করুন।"
  }
];

const enFaqData = {
  faqTitle: "Frequently Asked Questions",
  faqDesc: "Everything you need to know about downloading videos and audio safely.",
  tutorialTitle: "Quick 3-Step Download Guide",
  step1Title: "1. Copy Link",
  step1Desc: "Find your favorite video on YouTube, TikTok, Facebook, or Instagram and copy its link.",
  step2Title: "2. Paste in Box",
  step2Desc: "Paste the link into the KIRITOS search field and hit the Download button.",
  step3Title: "3. Save Instantly",
  step3Desc: "Pick your desired quality (1080p HD, 4K, 320kbps MP3) to download directly.",
  questions: enFaqQuestions
};

const bnFaqData = {
  faqTitle: "সাধারণ প্রশ্নোত্তর ও সাহায্য",
  faqDesc: "নিরাপদে ভিডিও এবং অডিও ডাউনলোড করার সহজ নিয়মাবলী।",
  tutorialTitle: "সহজ ৩-ধাপে ডাউনলোড করার নিয়ম",
  step1Title: "১. লিঙ্ক কপি করুন",
  step1Desc: "YouTube, TikTok, Facebook বা Instagram থেকে পছন্দের ভিডিও বা অডিওর লিঙ্ক কপি করুন।",
  step2Title: "২. বক্সে পেস্ট করুন",
  step2Desc: "KIRITOS-এর ইনপুট বক্সে লিঙ্কটি পেস্ট করে সবুজ 'ডাউনলোড' বাটনে চাপুন।",
  step3Title: "৩. সাথে সাথে সেভ করুন",
  step3Desc: "পছন্দসই কোয়ালিটি (HD, 4K, MP3) বেছে নিয়ে এক ক্লিকেই মোবাইলে বা কম্পিউটারে সেভ করে নিন।",
  questions: bnFaqQuestions
};

const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    header: {
      brandSubtitle: "Fast Media Downloader",
      tagline: "Fast Media Downloader",
      mainHeading1: "Download Videos & Audio",
      mainHeading2: "From Any Platform",
      mainHeadingLine1: "Download Videos & Audio",
      mainHeadingHighlight: "From Any Platform",
      subDescription: "Paste any link to instantly download MP4 videos, MP3 audio, and images.",
      translatorBtn: "বাংলা অনুবাদক",
      translatorBadge: "১ ক্লিকে বাংলা",
      translatorTooltip: "Click to translate entire website to Bangla"
    },
    navigation: {
      downloader: "Downloader",
      hdEnhancer: "HD Enhancer",
      mp3Studio: "MP3 Studio",
      videoTrimmer: "Video Trimmer",
      socialTools: "Social Tools",
      imageTools: "Image Tools",
      home: "Home",
      tools: "Tools",
      platforms: "Supported Platforms",
      recent: "Recent Downloads",
      guides: "Guides & FAQ",
      apiDocs: "API Docs"
    },
    downloader: {
      inputPlaceholder: "Paste YouTube, TikTok, Instagram, Facebook, or X link...",
      placeholder: "Paste YouTube, TikTok, Instagram, Facebook, or X link...",
      clear: "Clear link",
      paste: "Paste",
      pasted: "Pasted",
      emptyWarning: "Please paste a valid video or media link in the box above!",
      downloadBtn: "Download",
      download: "Download",
      fetching: "Fetching Media Streams...",
      fetchingDesc: "Detecting available video resolutions and audio streams.",
      footerNote: "Works with public posts, reels, shorts & audio tracks. 100% Free & No signup.",
      worksWithNote: "Works with public posts, reels, shorts & audio tracks. 100% Free & No signup.",
      tabAll: "All Media",
      tabVideo: "Video",
      tabAudio: "Audio (MP3)",
      tabImage: "Images",
      tabThumbnail: "Thumbnails",
      platformPrefix: "Platform",
      detectedPlatform: "Platform"
    },
    platformChips: enPlatformData,
    platforms: enPlatformData,
    resultCard: enResultData,
    result: enResultData,
    recentDownloads: enHistoryData,
    history: enHistoryData,
    faq: enFaqData,
    infoPages: {
      ...enFaqData,
      faqs: enFaqQuestions
    },
    maintenance: {
      badge: "Server Maintenance",
      defaultMsg: "Scheduled server maintenance in progress. We'll be back shortly!"
    },
    footer: {
      copyright: "Fast, Private & Unlimited Media Downloader.",
      disclaimer: "All trademarks, logos, and brand names are the property of their respective owners. KIRITOS does not host any pirated files on its servers.",
      backToTop: "Back to top"
    }
  },
  bn: {
    header: {
      brandSubtitle: "দ্রুত মিডিয়া ডাউনলোডার",
      tagline: "দ্রুত মিডিয়া ডাউনলোডার",
      mainHeading1: "ভিডিও ও অডিও ডাউনলোড করুন",
      mainHeading2: "যেকোনো সোশ্যাল প্ল্যাটফর্ম থেকে",
      mainHeadingLine1: "ভিডিও ও অডিও ডাউনলোড করুন",
      mainHeadingHighlight: "যেকোনো সোশ্যাল প্ল্যাটফর্ম থেকে",
      subDescription: "যেকোনো লিঙ্ক পেস্ট করে সাথে সাথে MP4 ভিডিও, MP3 গান এবং ছবি ডাউনলোড করে নিন।",
      translatorBtn: "English / ইংরেজি",
      translatorBadge: "1-Click English",
      translatorTooltip: "সম্পূর্ণ ওয়েবসাইট পুনরায় ইংরেজিতে দেখতে ক্লিক করুন"
    },
    navigation: {
      downloader: "ডাউনলোডার",
      hdEnhancer: "HD এনহ্যান্সার",
      mp3Studio: "MP3 স্টুডিও",
      videoTrimmer: "ভিডিও ট্রিমার",
      socialTools: "সোশ্যাল টুলস",
      imageTools: "ছবি এডিটর",
      home: "হোম",
      tools: "টুলস",
      platforms: "সাপোর্টেড প্ল্যাটফর্ম",
      recent: "সাম্প্রতিক ডাউনলোড",
      guides: "গাইড ও প্রশ্নোত্তর",
      apiDocs: "এপিআই ডক্স"
    },
    downloader: {
      inputPlaceholder: "ইউটিউব, টিকটক, ইনস্টাগ্রাম, ফেসবুক বা যেকোনো লিঙ্ক পেস্ট করুন...",
      placeholder: "ইউটিউব, টিকটক, ইনস্টাগ্রাম, ফেসবুক বা যেকোনো লিঙ্ক পেস্ট করুন...",
      clear: "মুছুন",
      paste: "পেস্ট",
      pasted: "পেস্ট হয়েছে",
      emptyWarning: "দয়া করে উপরের বক্সে একটি সঠিক মিডিয়া লিঙ্ক পেস্ট করুন!",
      downloadBtn: "ডাউনলোড",
      download: "ডাউনলোড",
      fetching: "মিডিয়া ফাইল লোড হচ্ছে...",
      fetchingDesc: "বিভিন্ন রেজোলিউশনের ভিডিও ও অডিও স্ট্রিম প্রস্তুত করা হচ্ছে।",
      footerNote: "পাবলিক পোস্ট, রিলস, শর্টস ও গানের জন্য ১০০% কার্যকর। কোনো অ্যাকাউন্ট বা রেজিস্ট্রেশন লাগবে না।",
      worksWithNote: "পাবলিক পোস্ট, রিলস, শর্টস ও গানের জন্য ১০০% কার্যকর। কোনো অ্যাকাউন্ট বা রেজিস্ট্রেশন লাগবে না।",
      tabAll: "সব মিডিয়া",
      tabVideo: "ভিডিও",
      tabAudio: "অডিও (MP3)",
      tabImage: "ছবি",
      tabThumbnail: "থাম্বনেইল",
      platformPrefix: "প্ল্যাটফর্ম",
      detectedPlatform: "প্ল্যাটফর্ম"
    },
    platformChips: bnPlatformData,
    platforms: bnPlatformData,
    resultCard: bnResultData,
    result: bnResultData,
    recentDownloads: bnHistoryData,
    history: bnHistoryData,
    faq: bnFaqData,
    infoPages: {
      ...bnFaqData,
      faqs: bnFaqQuestions
    },
    maintenance: {
      badge: "সার্ভার মেইনটেন্যান্স",
      defaultMsg: "সার্ভার আপগ্রেড চলছে। খুব দ্রুত আমরা ফিরে আসছি!"
    },
    footer: {
      copyright: "দ্রুত, সুরক্ষিত এবং আনলিমিটেড সোশ্যাল মিডিয়া ডাউনলোডার।",
      disclaimer: "সকল ট্রেডমার্ক ও লোগো তাদের নিজ নিজ স্বত্বাধিকারীর সম্পত্তি। KIRITOS কোনো কপিরাইটযুক্ত ফাইল নিজস্ব সার্ভারে জমা রাখে না।",
      backToTop: "উপরে যান"
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isBangla: boolean;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "kiritos_site_language";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to English ("en") as explicitly requested by user
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "bn" || stored === "en") return stored;
    } catch {
      // ignore
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en");
  };

  useEffect(() => {
    // Synchronize HTML lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    toggleLanguage,
    isBangla: language === "bn",
    t: TRANSLATIONS[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
