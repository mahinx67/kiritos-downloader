/**
 * Resolve API endpoints for local development and separately hosted frontends.
 *
 * Set VITE_API_BASE_URL when the UI and API are deployed on different hosts.
 * The historical Cloud Run URL remains as a backwards-compatible fallback for
 * the known static-host deployments.
 */
const DEFAULT_API_BASE = "https://kiritos-downloader.onrender.com";

export const getApiBaseUrl = (): string => {
  const viteEnv = (import.meta as ImportMeta & { env?: { VITE_API_BASE_URL?: string } }).env;
  const configured = (viteEnv?.VITE_API_BASE_URL || "").trim().replace(/\/$/, "");
  if (configured) return configured;

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (
      hostname.includes("netlify.app") ||
      hostname.includes("vercel.app") ||
      hostname.includes("github.io")
    ) {
      return DEFAULT_API_BASE;
    }
  }

  return "";
};

export const getApiUrl = (endpoint: string): string => {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${getApiBaseUrl()}${cleanEndpoint}`;
};
