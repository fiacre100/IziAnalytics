import { Site, SiteStats, ProLicense, PlanType, PaymentGatewayType } from "@/types/analytics";

export const STORAGE_KEYS = {
  SITES: "izi_analytics_sites",
  ACTIVE_SITE_ID: "izi_analytics_active_site_id",
  PRO_LICENSE: "izi_analytics_pro_license",
  PLAN: "izi_analytics_plan",
} as const;

/**
 * Nettoie une chaîne d'entrée pour en extraire un nom de domaine valide.
 * Exemple: "https://monsaas.com/app?ref=1" -> "monsaas.com"
 */
export function sanitizeDomain(input: string): string {
  if (!input || typeof input !== "string") return "";
  let domain = input.trim().toLowerCase();
  domain = domain.replace(/^[a-z0-9+.-]+:\/\//i, ""); // strip any protocol
  domain = domain.split(/[/?#]/)[0];                  // strip path, query, and hash
  domain = domain.replace(/:\d+$/, "");               // strip port
  return domain.trim();
}

/**
 * Génère un identifiant de tracking unique sous la forme izi_live_[8-char-hex]
 * Exemple: "izi_live_89a7fb3c"
 */
export function generateTrackingId(): string {
  const chars = "abcdef0123456789";
  let hash = "";
  for (let i = 0; i < 8; i++) {
    hash += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `izi_live_${hash}`;
}

/**
 * Génère une clé de licence PRO sous la forme IZI-PRO-[4chars]-[4chars]-2026
 * Exemple: "IZI-PRO-89AF-77B2-2026"
 */
export function generateProLicenseKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const block = (len = 4) => {
    let res = "";
    for (let i = 0; i < len; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return res;
  };
  return `IZI-PRO-${block()}-${block()}-2026`;
}

/**
 * Vérifie si une chaîne a le format valide d'une clé de licence IziAnalytics
 */
export function validateLicenseKey(key: string): boolean {
  if (!key || typeof key !== "string") return false;
  const cleaned = key.trim().toUpperCase();
  const pattern = /^IZI-PRO-[A-Z0-9]{4}-[A-Z0-9]{4}-(2025|2026|2027)$/;
  return pattern.test(cleaned);
}

// Stats initiales par défaut pour les 3 sites de mock
export const DEFAULT_SITES: Site[] = [
  {
    id: "site_calfood",
    name: "CalFood Africa",
    domain: "calfood.africa",
    trackingId: "izi_live_89a7fb3c",
    currency: "FCFA",
    createdAt: "2026-01-15T10:00:00.000Z",
    isConnected: true,
    stats: {
      uniqueVisitors: 2840,
      visitorsChangePct: 54,
      yesterdayVisitors: 1840,
      topSource: "TikTok (68%)",
      topSourceClicks: 1931,
      revenue: 384500,
      currency: "FCFA",
      salesCount: 42,
      conversionRate: 1.48,
      gateways: [
        { name: "Wave", sharePct: 62, color: "#00d2ff" },
        { name: "Orange Money", sharePct: 28, color: "#ff7900" },
        { name: "CB / Stripe", sharePct: 10, color: "#6366f1" },
      ],
      hourlyTraffic: [
        { label: "08h", time: "08:00", visitors: 45, sales: 2 },
        { label: "10h", time: "10:00", visitors: 120, sales: 5 },
        { label: "12h", time: "12:00", visitors: 280, sales: 8 },
        { label: "14h", time: "14:00", visitors: 890, sales: 24 },
        { label: "16h", time: "16:00", visitors: 540, sales: 15 },
        { label: "18h", time: "18:00", visitors: 620, sales: 18 },
        { label: "20h", time: "20:00", visitors: 345, sales: 9 },
      ],
    },
  },
  {
    id: "site_izisaas",
    name: "IziSaas Bio",
    domain: "izisaas.bio",
    trackingId: "izi_live_bio44721",
    currency: "FCFA",
    createdAt: "2026-02-01T14:30:00.000Z",
    isConnected: true,
    stats: {
      uniqueVisitors: 1420,
      visitorsChangePct: 32,
      yesterdayVisitors: 1075,
      topSource: "Instagram (52%)",
      topSourceClicks: 738,
      revenue: 142000,
      currency: "FCFA",
      salesCount: 19,
      conversionRate: 1.34,
      gateways: [
        { name: "Wave", sharePct: 75, color: "#00d2ff" },
        { name: "Orange Money", sharePct: 20, color: "#ff7900" },
        { name: "CB / Stripe", sharePct: 5, color: "#6366f1" },
      ],
      hourlyTraffic: [
        { label: "08h", time: "08:00", visitors: 20, sales: 1 },
        { label: "10h", time: "10:00", visitors: 65, sales: 2 },
        { label: "12h", time: "12:00", visitors: 150, sales: 4 },
        { label: "14h", time: "14:00", visitors: 420, sales: 7 },
        { label: "16h", time: "16:00", visitors: 310, sales: 3 },
        { label: "18h", time: "18:00", visitors: 290, sales: 2 },
        { label: "20h", time: "20:00", visitors: 165, sales: 0 },
      ],
    },
  },
  {
    id: "site_dakartech",
    name: "Dakar Tech Hub",
    domain: "dakartech.io",
    trackingId: "izi_live_dk9038aa",
    currency: "FCFA",
    createdAt: "2026-02-10T09:15:00.000Z",
    isConnected: false,
    stats: {
      uniqueVisitors: 890,
      visitorsChangePct: 18,
      yesterdayVisitors: 754,
      topSource: "WhatsApp (61%)",
      topSourceClicks: 543,
      revenue: 85000,
      currency: "FCFA",
      salesCount: 8,
      conversionRate: 0.9,
      gateways: [
        { name: "Orange Money", sharePct: 55, color: "#ff7900" },
        { name: "Wave", sharePct: 35, color: "#00d2ff" },
        { name: "MTN MoMo", sharePct: 10, color: "#ffcc00" },
      ],
      hourlyTraffic: [
        { label: "08h", time: "08:00", visitors: 15, sales: 0 },
        { label: "10h", time: "10:00", visitors: 45, sales: 1 },
        { label: "12h", time: "12:00", visitors: 90, sales: 1 },
        { label: "14h", time: "14:00", visitors: 280, sales: 3 },
        { label: "16h", time: "16:00", visitors: 210, sales: 2 },
        { label: "18h", time: "18:00", visitors: 160, sales: 1 },
        { label: "20h", time: "20:00", visitors: 90, sales: 0 },
      ],
    },
  },
];

/**
 * Helpers SSR-safe pour accéder à localStorage
 */
function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetItem(key: string, value: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore les erreurs de quota ou mode navigation privée
  }
}

/**
 * Récupère la liste des sites enregistrés
 */
export function getStoredSites(): Site[] {
  const raw = safeGetItem(STORAGE_KEYS.SITES);
  if (!raw) {
    // Initialise avec les sites par défaut
    saveStoredSites(DEFAULT_SITES);
    return DEFAULT_SITES;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const validSites = parsed.filter(
        (s): s is Site => Boolean(s && typeof s === "object" && s.id && s.name)
      );
      if (validSites.length > 0) return validSites;
    }
    return DEFAULT_SITES;
  } catch {
    return DEFAULT_SITES;
  }
}

/**
 * Enregistre la liste des sites
 */
export function saveStoredSites(sites: Site[]): void {
  safeSetItem(STORAGE_KEYS.SITES, JSON.stringify(sites));
}

/**
 * Ajoute un nouveau site et le persiste
 */
export function addStoredSite(params: {
  name: string;
  domain: string;
  currency?: string;
  trackingId?: string;
}): Site {
  const sanitized = sanitizeDomain(params.domain);
  const currentSites = getStoredSites();

  let finalTrackingId = params.trackingId || generateTrackingId();
  while (currentSites.some((s) => s.trackingId === finalTrackingId)) {
    finalTrackingId = generateTrackingId();
  }

  const currency = params.currency || "FCFA";
  const randomSuffix = Math.random().toString(36).substring(2, 9);

  const newSite: Site = {
    id: `site_${Date.now()}_${randomSuffix}`,
    name: params.name.trim(),
    domain: sanitized,
    trackingId: finalTrackingId,
    currency,
    createdAt: new Date().toISOString(),
    isConnected: false,
    stats: {
      uniqueVisitors: 0,
      visitorsChangePct: 0,
      yesterdayVisitors: 0,
      topSource: "Direct (100%)",
      topSourceClicks: 0,
      revenue: 0,
      currency,
      salesCount: 0,
      conversionRate: 0,
      gateways: [
        { name: "Wave", sharePct: 50, color: "#00d2ff" },
        { name: "Orange Money", sharePct: 35, color: "#ff7900" },
        { name: "CB / Stripe", sharePct: 15, color: "#6366f1" },
      ],
      hourlyTraffic: [
        { label: "08h", time: "08:00", visitors: 0, sales: 0 },
        { label: "10h", time: "10:00", visitors: 0, sales: 0 },
        { label: "12h", time: "12:00", visitors: 0, sales: 0 },
        { label: "14h", time: "14:00", visitors: 0, sales: 0 },
        { label: "16h", time: "16:00", visitors: 0, sales: 0 },
        { label: "18h", time: "18:00", visitors: 0, sales: 0 },
        { label: "20h", time: "20:00", visitors: 0, sales: 0 },
      ],
    },
  };

  const updated = [...currentSites, newSite];
  saveStoredSites(updated);
  setActiveSiteId(newSite.id);
  return newSite;
}

/**
 * Récupère l'ID du site actif
 */
export function getActiveSiteId(): string {
  const saved = safeGetItem(STORAGE_KEYS.ACTIVE_SITE_ID);
  if (saved) return saved;
  const sites = getStoredSites();
  const firstId = sites[0]?.id || DEFAULT_SITES[0].id;
  setActiveSiteId(firstId);
  return firstId;
}

/**
 * Définit l'ID du site actif
 */
export function setActiveSiteId(id: string): void {
  safeSetItem(STORAGE_KEYS.ACTIVE_SITE_ID, id);
}

/**
 * Récupère l'objet Site actuellement actif
 */
export function getActiveSite(): Site {
  const sites = getStoredSites();
  const activeId = getActiveSiteId();
  const found = sites.find((s) => s && s.id === activeId);
  return found || sites[0] || DEFAULT_SITES[0];
}

/**
 * Récupère la licence PRO stockée
 */
export function getProLicense(): ProLicense | null {
  const raw = safeGetItem(STORAGE_KEYS.PRO_LICENSE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ProLicense;
  } catch {
    return null;
  }
}

/**
 * Enregistre la licence PRO et active le plan
 */
export function saveProLicense(license: ProLicense): void {
  safeSetItem(STORAGE_KEYS.PRO_LICENSE, JSON.stringify(license));
  safeSetItem(STORAGE_KEYS.PLAN, "pro");
}

/**
 * Vérifie si le compte est actuellement en mode PRO
 */
export function isProPlan(): boolean {
  const plan = safeGetItem(STORAGE_KEYS.PLAN);
  if (plan === "pro") return true;
  const license = getProLicense();
  return Boolean(license?.key);
}

/**
 * Active manuellement une clé de licence PRO existante
 */
export function activateLicenseKey(key: string): {
  success: boolean;
  license?: ProLicense;
  error?: string;
} {
  if (!validateLicenseKey(key)) {
    return {
      success: false,
      error: "Format de clé invalide. Le format attendu est IZI-PRO-XXXX-XXXX-2026",
    };
  }

  const license: ProLicense = {
    key: key.trim().toUpperCase(),
    plan: "founder_annual",
    orderBump: true,
    amountPaid: 39000,
    currency: "FCFA",
    paymentMethod: "stripe",
    activatedAt: new Date().toISOString(),
  };

  saveProLicense(license);
  return { success: true, license };
}

/**
 * Réinitialise aux données par défaut
 */
export function resetDefaultSites(): Site[] {
  saveStoredSites(DEFAULT_SITES);
  setActiveSiteId(DEFAULT_SITES[0].id);
  return DEFAULT_SITES;
}
