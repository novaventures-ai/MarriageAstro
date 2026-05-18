/**
 * POST /api/v1/conflict-zones
 * Tier: premium
 * Returns: conflict triggers, hot-button topics, and tension patterns between two people
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth.js';
import { generateChartFromBirthData, generateFullCompatibilityReport } from '../../lib/reportGenerator.js';
import { calculateConflictZones } from '../../lib/conflictCalculations.js';

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
    const chartA = await generateChartFromBirthData(birthA);

    if (!requireTierOrTeaser(auth, 'premium', res, () => {
      const marsA = chartA.planetaryPositions.find((p: any) => p.planet === 'Mars');
      const saturnA = chartA.planetaryPositions.find((p: any) => p.planet === 'Saturn');
      const zoneCount = [marsA?.house === 7, saturnA?.house === 7, marsA?.isRetrograde, saturnA?.isRetrograde].filter(Boolean).length + 2;
      const topZone = marsA?.house === 7 ? 'Behavior & Control' : 'Ideology & Values';
      return {
        conflict_zones_detected: zoneCount,
        top_conflict_category: topZone,
        summary: `${zoneCount} recurring conflict patterns identified between charts.`,
        note: 'Upgrade to Premium ($99/mo) to see: specific conflict triggers per category (People, Things, Ideology, Behavior), intensity ratings, and resolution strategies.',
      };
    })) return;

    const report = await generateFullCompatibilityReport(birthA, birthB);
    const conflictZones = calculateConflictZones(report.chartA, report.chartB, report);
    return res.status(200).json({ success: true, data: conflictZones });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
