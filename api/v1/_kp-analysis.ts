/**
 * POST /api/v1/kp-analysis
 * Tier: premium (teaser for free)
 * Returns: KP (Krishnamurti Paddhati) stellar astrology analysis with sub-lords
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth.js';
import { generateChartFromBirthData } from '../../lib/reportGenerator.js';
import { calculateKPAnalysis } from '../../lib/extendedCalculations.js';

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
    const kp = calculateKPAnalysis(chart);

    if (!requireTierOrTeaser(auth, 'premium', res, () => ({
      ascendant_sub_lord: (kp as any).ascendantSubLord ?? null,
      seventh_house_sub_lord: (kp as any).seventhHouseSubLord ?? null,
      note: 'Upgrade to Premium (₹399/mo or $14.99/mo) to see the full KP analysis: all 249 sub-lords, significators for marriage, timing via KP ruling planets.',
      upgrade_url: 'https://marriage-astro.vercel.app/pricing',
    }))) return;

    return res.status(200).json({ success: true, data: kp });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
