/**
 * regionService — detect visitor's region for currency switching.
 *
 * Primary: /api/detect-region (Vercel x-vercel-ip-country header — authoritative)
 * Fallback: timezone check (works in dev where Vercel header isn't present)
 *
 * Result is cached in sessionStorage so we only call the API once per tab.
 */

export interface RegionInfo {
  country: string;       // ISO 2-letter code, e.g. "IN", "US", "GB"
  currency: 'INR' | 'USD';
  isInternational: boolean;
}

const CACHE_KEY = 'ma_region';

/** Indian timezones — used as client-side fallback in dev */
const INDIA_TIMEZONES = new Set(['Asia/Kolkata', 'Asia/Calcutta']);

function timezoneBasedFallback(): RegionInfo {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isInternational = !INDIA_TIMEZONES.has(tz);
  return {
    country: isInternational ? 'UNKNOWN' : 'IN',
    currency: isInternational ? 'USD' : 'INR',
    isInternational,
  };
}

let inFlight: Promise<RegionInfo> | null = null;

export async function detectRegion(): Promise<RegionInfo> {
  // Return cached result if available
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached) as RegionInfo;
  } catch { /* ignore */ }

  // Deduplicate concurrent calls
  if (inFlight) return inFlight;

  inFlight = (async (): Promise<RegionInfo> => {
    try {
      const res = await fetch('/api/detect-region', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json() as RegionInfo;
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch { /* ignore */ }
        return data;
      }
    } catch { /* fall through */ }

    // Fallback: timezone-based detection (dev / API failure)
    const fallback = timezoneBasedFallback();
    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(fallback)); } catch { /* ignore */ }
    return fallback;
  })();

  try {
    return await inFlight;
  } finally {
    inFlight = null;
  }
}

/** Synchronous read — returns null if not yet detected */
export function getCachedRegion(): RegionInfo | null {
  try {
    const cached = sessionStorage.getItem(CACHE_KEY);
    return cached ? (JSON.parse(cached) as RegionInfo) : null;
  } catch {
    return null;
  }
}

// ─── Pricing ──────────────────────────────────────────────────────────────────

export const PRICING_INR: Record<string, { amount: number; display: string }> = {
  section_unlock:      { amount: 4900,   display: '₹49' },
  full_report_unlock:  { amount: 16900,  display: '₹169' },
  premium_monthly:     { amount: 39900,  display: '₹399/mo' },
  astrologer_monthly:  { amount: 149900, display: '₹1,499/mo' },
};

export const PRICING_USD: Record<string, { amount: number; display: string }> = {
  section_unlock:      { amount: 499,   display: '$4.99' },
  full_report_unlock:  { amount: 1299,  display: '$12.99' },
  premium_monthly:     { amount: 1499,  display: '$14.99/mo' },
  astrologer_monthly:  { amount: 3999,  display: '$39.99/mo' },
};

export function getPricing(currency: 'INR' | 'USD') {
  return currency === 'USD' ? PRICING_USD : PRICING_INR;
}
