/**
 * POST /api/v1/mental-health
 * Tier: premium
 * Returns: anxiety, depression, narcissism, and other mental health markers from birth chart
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { analyzeMentalHealth } from '../../lib/mentalHealthCalculations';

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

    if (!requireTierOrTeaser(auth, 'premium', res, () => {
      const afflicted = chart.planetaryPositions.filter((p: any) =>
        ['Moon', 'Mercury'].includes(p.planet) && [6, 8, 12].includes(p.house)
      ).length;
      return {
        flags_detected: afflicted + chart.planetaryPositions.filter((p: any) => p.isRetrograde && ['Moon', 'Mercury', 'Saturn'].includes(p.planet)).length,
        top_area: afflicted > 0 ? 'Emotional stability' : 'General wellness',
        summary: `Mental health markers detected. ${afflicted} Moon/Mercury placements in challenging houses.`,
        note: 'Upgrade to Premium ($99/mo) to see: anxiety score, depression indicators, narcissism markers, and full emotional pattern analysis.',
      };
    })) return;

    const mentalHealth = analyzeMentalHealth(chart);
    return res.status(200).json({ success: true, data: mentalHealth });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
