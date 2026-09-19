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
  /**
   * Which monthly plans actually auto-renew in this visitor's currency, keyed
   * by planType. Reported by the server, which alone knows whether a Razorpay
   * Plan ID is configured for that currency. Absent until the region call
   * returns, and absent in the offline fallback.
   */
  recurring?: Record<string, boolean>;
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
    // Unknown offline. isRecurring treats that as "does not renew", because
    // promising a renewal that never happens is the costlier error.
    recurring: undefined,
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
      // GET /api/create-checkout serves double duty as region detector
      // (avoids a separate serverless function — Vercel Hobby plan limit is 12)
      const res = await fetch('/api/create-checkout', { method: 'GET', cache: 'no-store' });
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

/**
 * "/mo" is NOT a formatting choice — it is a promise that the plan renews
 * itself, so it may only be shown where a renewal will actually happen.
 *
 * This comment used to say that was possible in INR alone, reasoning that a
 * recurring mandate requires an India-issued card. That conflated two different
 * Razorpay products: e-mandate (NACH bank debits) is India-only, but recurring
 * CARD payments are supported in roughly a hundred currencies, and Razorpay's
 * own Plan form offers USD, EUR and SGD. The currency was never the constraint.
 *
 * What decides it is whether a Plan has been created for that currency and its
 * ID configured — see resolveRecurringPlanId below. periodLabel reads the live
 * answer from the server rather than assuming, so the copy can never promise a
 * renewal the configuration cannot deliver.
 */
export const PRICING_USD: Record<string, { amount: number; display: string }> = {
  section_unlock:      { amount: 499,   display: '$4.99' },
  full_report_unlock:  { amount: 1299,  display: '$12.99' },
  premium_monthly:     { amount: 1499,  display: '$14.99' },
  astrologer_monthly:  { amount: 3999,  display: '$39.99' },
};

export function getPricing(currency: 'INR' | 'USD') {
  return currency === 'USD' ? PRICING_USD : PRICING_INR;
}

const MONTHLY_PLANS = new Set(['premium_monthly', 'astrologer_monthly']);

/**
 * Whether this plan actually auto-renews for this visitor.
 *
 * This used to answer "only if INR", on the reading that a recurring mandate
 * needs an India-issued card. That conflated e-mandate (bank debits over NACH,
 * India-only) with recurring CARD payments, which Razorpay supports in many
 * currencies — its plan form offers EUR, SGD and USD alongside INR.
 *
 * The honest answer is not a property of the currency but of whether a Razorpay
 * Plan exists for it, which only the server knows. Until it has told us, this
 * returns false: showing "/ 30 days" on a plan that does renew is a small
 * understatement, while showing "/month" on one that does not is the bug that
 * sold a subscription which never existed.
 */
export function isRecurring(planType: string, currency: 'INR' | 'USD'): boolean {
  if (!MONTHLY_PLANS.has(planType)) return false;
  const region = getCachedRegion();
  if (!region || region.currency !== currency) return false;
  return Boolean(region.recurring?.[planType]);
}

/**
 * The period suffix shown next to a price. It is NOT cosmetic: "/month" is a
 * promise the plan renews itself, which is only true where a mandate can be
 * registered. Deriving it from the region stops the UI selling a subscription
 * that cannot exist.
 */
export function periodLabel(planType: string, currency: 'INR' | 'USD'): string | null {
  if (planType !== 'premium_monthly' && planType !== 'astrologer_monthly') return null;
  return isRecurring(planType, currency) ? '/month' : ' / 30 days';
}

/**
 * What to tell the customer about renewal, in their own region's terms.
 * Empty for one-off unlocks, which renew nothing.
 */
export function renewalNote(planType: string, currency: 'INR' | 'USD'): string {
  if (planType !== 'premium_monthly' && planType !== 'astrologer_monthly') return '';
  return isRecurring(planType, currency)
    ? 'Renews automatically each month. Cancel anytime.'
    : 'One-time payment for 30 days of access. It does not renew automatically — '
      + 'we will remind you before it ends.';
}
