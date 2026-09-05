/**
 * shareUtils — helpers for dynamic social sharing text + OG image URLs
 */

const SITE_URL = 'https://marriage-astro.vercel.app';

// ─── OG Image URL ────────────────────────────────────────────────────────────

export interface OgImageParams {
  nameA: string;
  nameB: string;
  score: number;       // Ashtakoot (0–36)
  compat?: number;     // Overall % (0–100)
  risk?: string;       // Low / Moderate / High / Critical
  moonA?: string;      // Moon nakshatra / sign of partner A
  moonB?: string;
}

export function buildOgImageUrl(params: OgImageParams): string {
  const p = new URLSearchParams({
    nameA: params.nameA.slice(0, 20),
    nameB: params.nameB.slice(0, 20),
    score: String(params.score),
  });
  if (params.compat) p.set('compat', String(params.compat));
  if (params.risk) p.set('risk', params.risk);
  if (params.moonA) p.set('moonA', params.moonA);
  if (params.moonB) p.set('moonB', params.moonB);
  return `${SITE_URL}/api/og-image?${p.toString()}`;
}

/** Returns a 1080×1920 vertical image URL for Instagram Stories */
export function buildStoryImageUrl(params: OgImageParams): string {
  return buildOgImageUrl(params) + '&format=story';
}

// ─── Shared result link ──────────────────────────────────────────────────────

/**
 * Builds the link that goes out with every share.
 *
 * It points at /r (an edge-rendered page), NOT at the SPA, because WhatsApp,
 * Twitter/X, Facebook and Telegram crawlers do not run JavaScript — a link into
 * the SPA unfurls with the generic site card no matter what SEOHead sets at
 * runtime. /r returns real HTML carrying the personalised og:image.
 *
 * The payload is DISPLAY DATA ONLY (names, score, compatibility, risk, verdict).
 * Birth date, time and coordinates are deliberately excluded: a forwarded card
 * must not leak two people's exact birth details into a group chat, and base64
 * is encoding rather than encryption.
 */
export function buildResultShareUrl(data: ReportShareData): string {
  const payload: Record<string, unknown> = {
    a: data.nameA.slice(0, 20),
    b: data.nameB.slice(0, 20),
    s: data.ashtakootScore,
  };
  if (data.compatPercent) payload.c = Math.round(data.compatPercent);
  if (data.riskLevel) payload.k = data.riskLevel;
  if (data.matchVerdict) payload.v = data.matchVerdict;

  // btoa is latin1-only, so UTF-8 must be flattened to bytes first or any
  // non-ASCII name (Devanagari, Tamil, ...) is corrupted. api/r.ts reverses
  // this with TextDecoder — the two must stay in step.
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const b64 = btoa(String.fromCharCode(...bytes));
  const safeB64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${SITE_URL}/r?d=${safeB64}`;
}

// ─── Dynamic share text ──────────────────────────────────────────────────────

export interface ReportShareData {
  nameA: string;
  nameB: string;
  ashtakootScore: number;
  compatPercent?: number;
  riskLevel?: string;
  matchVerdict?: string;
}

export function buildShareText(data: ReportShareData): string {
  const { nameA, nameB, ashtakootScore, compatPercent, riskLevel, matchVerdict } = data;
  const verdict = matchVerdict || getDefaultVerdict(ashtakootScore);

  const lines = [
    `✨ ${nameA} & ${nameB} — Vedic Compatibility Analysis`,
    ``,
    `🔮 Ashtakoot Score: ${ashtakootScore}/36 (${verdict})`,
  ];

  if (compatPercent) lines.push(`💯 Overall Compatibility: ${compatPercent}%`);
  if (riskLevel) lines.push(`🛡️ Risk Level: ${riskLevel}`);

  lines.push(``, `See the card and check yours free:`, buildResultShareUrl(data));
  return lines.join('\n');
}

export function buildWhatsAppText(data: ReportShareData): string {
  // buildShareText already ends with the shareable /r link.
  return buildShareText(data);
}

export function buildTwitterText(data: ReportShareData): string {
  const { nameA, nameB, ashtakootScore } = data;
  const verdict = getDefaultVerdict(ashtakootScore);
  // Twitter: keep it short (≤280 chars)
  return `${nameA} & ${nameB} Vedic compatibility: ${ashtakootScore}/36 — ${verdict} 🔮 #KundaliMatching #VedicAstrology`;
}

function getDefaultVerdict(score: number): string {
  if (score >= 28) return 'Excellent Match 💚';
  if (score >= 21) return 'Good Match 💛';
  if (score >= 18) return 'Acceptable Match 🟠';
  return 'Caution Advised 🔴';
}

// ─── Viral Growth Features ───────────────────────────────────────────────────

export function generatePartnerInviteUrl(inviterChart: any): string {
  const payload = {
    n: inviterChart.name,
    g: inviterChart.gender,
    d: new Date(inviterChart.dateOfBirth).toISOString().split('T')[0],
    t: inviterChart.timeOfBirth,
    l: inviterChart.location,
    lat: inviterChart.latitude,
    lng: inviterChart.longitude,
    tz: inviterChart.timezone
  };
  const b64 = btoa(JSON.stringify(payload));
  // Safe base64url encode
  const safeB64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${SITE_URL}/add-partner?invite=${safeB64}`;
}

export function generateShareableReportUrl(chartA: any, chartB: any): string {
  const payload = {
    a: {
      n: chartA.name,
      g: chartA.gender,
      d: new Date(chartA.dateOfBirth).toISOString().split('T')[0],
      t: chartA.timeOfBirth,
      l: chartA.location,
      lat: chartA.latitude,
      lng: chartA.longitude,
      tz: chartA.timezone
    },
    b: {
      n: chartB.name,
      g: chartB.gender,
      d: new Date(chartB.dateOfBirth).toISOString().split('T')[0],
      t: chartB.timeOfBirth,
      l: chartB.location,
      lat: chartB.latitude,
      lng: chartB.longitude,
      tz: chartB.timezone
    }
  };
  const b64 = btoa(JSON.stringify(payload));
  const safeB64 = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${SITE_URL}/report?share=${safeB64}`;
}

// ─── Helpers for ReportPage ──────────────────────────────────────────────────

export function reportToShareData(report: any): ReportShareData {
  return {
    nameA: report.chartA?.name || 'Partner A',
    nameB: report.chartB?.name || 'Partner B',
    ashtakootScore: report.ashtakoot?.totalScore ?? 0,
    compatPercent: (report as any).overallCompatibilityScore,
    riskLevel: (report.riskAssessment as any)?.overallRisk?.level,
    matchVerdict: (report as any).overallVerdict,
  };
}

export function reportToOgParams(report: any): OgImageParams {
  return {
    nameA: report.chartA?.name || 'Partner A',
    nameB: report.chartB?.name || 'Partner B',
    score: report.ashtakoot?.totalScore ?? 0,
    compat: (report as any).overallCompatibilityScore,
    risk: (report.riskAssessment as any)?.overallRisk?.level,
    moonA: report.chartA?.moonNakshatra || report.chartA?.moonSign,
    moonB: report.chartB?.moonNakshatra || report.chartB?.moonSign,
  };
}
