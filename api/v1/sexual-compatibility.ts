/**
 * POST /api/v1/sexual-compatibility
 * Tier: premium
 * Returns: Venus/Mars synastry + sexual temperament + mutual satisfaction analysis
 */
import { validateApiKey, requireTier, parseBirthData } from './_auth';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { calculateSexualCompatibility } from '../../lib/compatibilityCalculations';
import { analyzeMutualSatisfaction } from '../../lib/sexualHealthCalculations';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });
  if (!requireTier(auth, 'premium', res)) return;

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
