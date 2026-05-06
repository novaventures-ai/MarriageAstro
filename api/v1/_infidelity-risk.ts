/**
 * POST /api/v1/infidelity-risk
 * Tier: premium
 * Returns: infidelity risk indicators and protective factors
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { assessInfidelityRisk, assessInfidelityProtections } from '../../lib/riskCalculations';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });

  const birthA = parseBirthData(req.body, 'person_a');
  const birthB = parseBirthData(req.body, 'person_b');
  const singleMode = !birthB.dateOfBirth;

  if (!birthA.dateOfBirth || isNaN(birthA.latitude)) {
    return res.status(400).json({ error: 'Required: person_a_date, person_a_latitude, person_a_longitude' });
  }

  try {
    const chartA = await generateChartFromBirthData(birthA);

    if (!requireTierOrTeaser(auth, 'premium', res, () => {
      const indicators = chartA.planetaryPositions.filter((p: any) =>
        ['Venus', 'Mars', 'Rahu'].includes(p.planet) && [5, 8, 12].includes(p.house)
      ).length;
      const level = indicators >= 2 ? 'ELEVATED' : indicators === 1 ? 'MODERATE' : 'LOW';
      return {
        infidelity_risk_level: level,
        indicators_detected: indicators,
        summary: `${indicators} risk indicator${indicators !== 1 ? 's' : ''} detected for ${birthA.name}.`,
        note: 'Upgrade to Premium ($99/mo) to see: full risk breakdown, protective factors, specific house patterns, and partner comparison.',
      };
    })) return;

    const riskA = assessInfidelityRisk(chartA, birthA.name);
    const protectionsA = assessInfidelityProtections(chartA, birthA.name);
    const result: any = { person_a: { ...riskA, protections: protectionsA } };

    if (!singleMode && !isNaN(birthB.latitude)) {
      const chartB = await generateChartFromBirthData(birthB);
      const riskB = assessInfidelityRisk(chartB, birthB.name);
      const protectionsB = assessInfidelityProtections(chartB, birthB.name);
      result.person_b = { ...riskB, protections: protectionsB };
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
