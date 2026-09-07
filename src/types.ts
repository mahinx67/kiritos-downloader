export interface MediaItem {
  quality: string;
  type: 'video' | 'audio' | 'image' | 'file';
  url: string;
  size?: string;
}

export interface DownloadResult {
  success: boolean;
  platform: string;
  title: string;
  thumbnail?: string;
  author?: string;
  authorUsername?: string;
  shortcode?: string;
  duration?: string;
  caption?: string;
  description?: string;
  hashtags?: string[];
  media: MediaItem[];
  youtubeId?: string;
}

export interface PlatformConfig {
  id: string;
  name: string;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  domains: string[];
}

export interface RecentDownloadItem {
  id: string;
  title: string;
  platform: string;
  timestamp: number;
  thumbnailUrl?: string;
  url: string;
}

export type ActiveTab = 
  | 'home' 
  | 'downloader' 
  | 'tools' 
  | 'platforms' 
  | 'downloads' 
  | 'guides' 
  | 'about' 
  | 'privacy' 
  | 'terms' 
  | 'contact';

export type DownloaderSubTab = 'all' | 'video' | 'audio' | 'image' | 'thumbnail';

export type ToolSubTab = 'video-tools' | 'image-tools' | 'social-tools';

export type VideoToolType = 'mp3' | 'gif' | 'compressor' | 'trimmer' | 'metadata' | 'enhancer';

export type ImageToolType = 'compressor' | 'resizer' | 'converter' | 'webp';

export type SocialToolType = 'thumbnail' | 'profile' | 'analyzer' | 'qr';

export interface AdminAnnouncement {
  id: string;
  text: string;
  type: 'update' | 'notice' | 'alert' | 'feature';
  isActive: boolean;
  createdAt: string;
}

export interface AdminCustomPlatform {
  id: string;
  name: string;
  domain: string;
  category: 'video' | 'audio' | 'image' | 'social';
  badge: string;
  exampleUrl: string;
  isActive: boolean;
}

export interface AdminCustomFaq {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
}

export interface AdminSiteConfig {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  defaultAudioBitrate: string;
  serverSpeedBoost: boolean;
}
