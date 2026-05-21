/**
 * POST /api/v1/self-analysis
 * Tier: premium (teaser for free)
 * Returns: single-person marriage readiness, personality profile, timing forecast
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth.js';
import { generateChartFromBirthData } from '../../lib/reportGenerator.js';
import { generateSelfAnalysisReport } from '../../lib/selfReportGenerator.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });
  const birth = parseBirthData(req.body);
  if (!birth.dateOfBirth || isNaN(birth.latitude)) {
    return res.status(400).json({ error: 'Required: date, latitude, longitude' });
  }

  try {
    const chart = await generateChartFromBirthData(birth);
    const report = await generateSelfAnalysisReport(birth, chart);

    if (!requireTierOrTeaser(auth, 'premium', res, () => ({
      marriage_readiness_score: (report as any).marriageReadiness?.score ?? null,
      personality_type: (report as any).personalityProfile?.type ?? null,
      note: 'Upgrade to Premium (₹399/mo or $14.99/mo) to see: full marriage readiness breakdown, timing forecast, personality deep-dive, sexual profile, and mental health analysis.',
      upgrade_url: 'https://marriage-astro.vercel.app/pricing',
    }))) return;

    // Remove sensitive sections if still not premium (safety net)
    if (auth.tier !== 'premium') {
      delete (report as any).sexualProfile;
      delete (report as any).sexualHealth;
      delete (report as any).mentalHealth;
    }

    return res.status(200).json({ success: true, data: report });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
