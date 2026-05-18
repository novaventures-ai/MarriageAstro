/**
 * POST /api/v1/psychological-profile
 * Tier: premium
 * Returns: attachment style, emotional patterns, personality profile from chart
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth.js';
import { generateChartFromBirthData } from '../../lib/reportGenerator.js';
import { calculatePsychologicalProfile } from '../../lib/selfReportGenerator.js';

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
      const moonHouse = chart.planetaryPositions.find((p: any) => p.planet === 'Moon')?.house || 0;
      const attachmentMap: Record<number, string> = {
        1: 'Secure-Independent', 2: 'Secure', 3: 'Anxious-Avoidant', 4: 'Anxious',
        5: 'Secure', 6: 'Avoidant', 7: 'Secure-Dependent', 8: 'Fearful-Avoidant',
        9: 'Secure-Philosophical', 10: 'Avoidant', 11: 'Secure-Social', 12: 'Fearful-Avoidant',
      };
      return {
        attachment_style_preview: attachmentMap[moonHouse] || 'Secure',
        moon_house: moonHouse,
        summary: `Moon in house ${moonHouse} suggests ${attachmentMap[moonHouse] || 'Secure'} attachment tendencies.`,
        note: 'Upgrade to Premium ($99/mo) to see: full attachment style report, emotional triggers, relationship patterns, and compatibility dynamics.',
      };
    })) return;

    const profile = calculatePsychologicalProfile(chart);
    return res.status(200).json({ success: true, data: profile });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
