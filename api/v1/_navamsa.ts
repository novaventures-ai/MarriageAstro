/**
 * POST /api/v1/navamsa
 * Tier: premium (teaser for free)
 * Returns: D9 Navamsa chart compatibility analysis
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth.js';
import { generateChartFromBirthData } from '../../lib/reportGenerator.js';
import { calculateNavamsaMatching } from '../../lib/compatibilityCalculations.js';

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
    const [chartA, chartB] = await Promise.all([
      generateChartFromBirthData(birthA),
      generateChartFromBirthData(birthB),
    ]);

    const navamsa = calculateNavamsaMatching(chartA, chartB);

    if (!requireTierOrTeaser(auth, 'premium', res, () => ({
      person_a_navamsa_ascendant: (navamsa as any).personA?.navamsaAscendant ?? null,
      person_b_navamsa_ascendant: (navamsa as any).personB?.navamsaAscendant ?? null,
      note: 'Upgrade to Premium (₹399/mo or $14.99/mo) to see the full D9 Navamsa compatibility: all divisional placements, Navamsa lord matching, and marriage karma analysis.',
      upgrade_url: 'https://marriage-astro.vercel.app/pricing',
    }))) return;

    return res.status(200).json({ success: true, data: navamsa });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
