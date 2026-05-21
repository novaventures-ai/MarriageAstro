/**
 * POST /api/v1/full-report
 * Tier: premium (teaser for free)
 * Returns: complete CompatibilityReport — all sections the caller's tier allows
 * This is the most comprehensive endpoint; use specific endpoints for targeted data.
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth.js';
import { generateFullCompatibilityReport } from '../../lib/reportGenerator.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });
  const birthA = parseBirthData(req.body, 'person_a');
  const birthB = parseBirthData(req.body, 'person_b');

  if (!birthA.dateOfBirth || !birthB.dateOfBirth || isNaN(birthA.latitude) || isNaN(birthB.latitude)) {
    return res.status(400).json({ error: 'Required: person_a_* and person_b_* birth fields' });
  }

  try {
    const report = await generateFullCompatibilityReport(birthA, birthB);

    if (!requireTierOrTeaser(auth, 'premium', res, () => ({
      ashtakoot_score: (report as any).ashtakootMilan?.totalScore ?? null,
      overall_compatibility: (report as any).overallCompatibility ?? null,
      summary: 'Full compatibility report includes 15+ sections: synastry, navamsa, dasha overlap, risk analysis, sexual compatibility, mental health, remedies and more.',
      note: 'Upgrade to Premium (₹399/mo or $14.99/mo) to unlock the complete report.',
      upgrade_url: 'https://marriage-astro.vercel.app/pricing',
    }))) return;

    return res.status(200).json({ success: true, data: report });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
