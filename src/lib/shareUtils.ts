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

  lines.push(``, `Get your free Kundali matching at:`);
  return lines.join('\n');
}

export function buildWhatsAppText(data: ReportShareData): string {
  const text = buildShareText(data);
  return `${text}\n${SITE_URL}`;
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
