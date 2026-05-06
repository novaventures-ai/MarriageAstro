/**
 * POST /api/v1/sexual-compatibility
 * Tier: premium
 * Returns: Venus/Mars synastry + sexual temperament + mutual satisfaction analysis
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { calculateSexualCompatibility } from '../../lib/compatibilityCalculations';
import { analyzeMutualSatisfaction } from '../../lib/sexualHealthCalculations';

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

    if (!requireTierOrTeaser(auth, 'premium', res, () => {
      const venusA = chartA.planetaryPositions.find((p: any) => p.planet === 'Venus');
      const marsB = chartB.planetaryPositions.find((p: any) => p.planet === 'Mars');
      const inHarmony = venusA && marsB && Math.abs(venusA.house - marsB.house) <= 2;
      return {
        compatibility_level: inHarmony ? 'HARMONIOUS' : 'NEEDS_ATTENTION',
        venus_mars_aspect: `${birthA.name}'s Venus in house ${venusA?.house || '?'} vs ${birthB.name}'s Mars in house ${marsB?.house || '?'}`,
        summary: `Initial Venus-Mars analysis suggests ${inHarmony ? 'natural attraction and harmony' : 'some tension requiring understanding'}.`,
        note: 'Upgrade to Premium ($99/mo) to see: Yoni match score, sexual temperament comparison, libido compatibility, and mutual satisfaction analysis.',
      };
    })) return;

    const sexualCompat = calculateSexualCompatibility(chartA, chartB);
    const mutualSatisfaction = analyzeMutualSatisfaction(chartA, chartB);

    return res.status(200).json({
      success: true,
      data: { ...sexualCompat, mutual_satisfaction: mutualSatisfaction },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
