/**
 * POST /api/v1/divorce-risk
 * Tier: premium
 * Returns: divorce probability analysis from 7th/2nd house afflictions
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth.js';
import { generateChartFromBirthData } from '../../lib/reportGenerator.js';
import { assessDivorceRisk } from '../../lib/riskCalculations.js';

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
      const malefics = chartA.planetaryPositions.filter((p: any) =>
        ['Mars', 'Saturn', 'Rahu'].includes(p.planet) && [7, 2, 8].includes(p.house)
      ).length;
      const level = malefics >= 3 ? 'HIGH' : malefics >= 1 ? 'MODERATE' : 'LOW';
      return {
        divorce_risk_level: level,
        afflictions_detected: malefics,
        summary: `${malefics} malefic influence${malefics !== 1 ? 's' : ''} on marriage houses detected for ${birthA.name}.`,
        note: 'Upgrade to Premium ($99/mo) to see: probability %, specific planetary triggers, protective cancellations, and high-risk time periods.',
      };
    })) return;

    const riskA = assessDivorceRisk(chartA, birthA.name);
    const result: any = { person_a: riskA };

    if (!singleMode && !isNaN(birthB.latitude)) {
      const chartB = await generateChartFromBirthData(birthB);
      result.person_b = assessDivorceRisk(chartB, birthB.name);
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
