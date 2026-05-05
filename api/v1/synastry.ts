/**
 * POST /api/v1/synastry
 * Tier: developer
 * Returns: cross-chart planetary aspects, house overlays, sexual chemistry aspects
 */
import { validateApiKey, requireTier, parseBirthData } from './_auth';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { calculateHouseOverlays, calculatePlanetaryConjunctions } from '../../lib/synastryCalculations';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });
  if (!requireTier(auth, 'developer', res)) return;

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

    const houseOverlays = calculateHouseOverlays(chartA, chartB);
    const conjunctions = calculatePlanetaryConjunctions(chartA, chartB);

    return res.status(200).json({
      success: true,
      data: {
        house_overlays: houseOverlays,
        planetary_conjunctions: conjunctions,
        summary: {
          total_overlays: houseOverlays.length,
          total_conjunctions: conjunctions.length,
          harmonious: conjunctions.filter((c: any) => c.nature === 'harmonious').length,
          challenging: conjunctions.filter((c: any) => c.nature === 'challenging').length,
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
