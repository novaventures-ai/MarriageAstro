/**
 * GET /api/v1/birth-chart
 * Tier: free
 * Returns: planets, houses, nakshatras, ascendant, yogas for one person
 */
import { validateApiKey, parseBirthData } from './_auth';
import { generateChartFromBirthData } from '../../lib/reportGenerator';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });

  const birth = parseBirthData(req.body);
  if (!birth.dateOfBirth || isNaN(birth.latitude) || isNaN(birth.longitude)) {
    return res.status(400).json({
      error: 'Required: date (YYYY-MM-DD), latitude, longitude',
      example: {
        date: '1990-01-15',
        time: '10:30',
        latitude: 19.076,
        longitude: 72.8777,
        timezone: 'Asia/Kolkata',
        name: 'Person A',
        gender: 'male',
      },
    });
  }

  try {
    const chart = await generateChartFromBirthData(birth);
    const seventhMalefics = chart.planetaryPositions.filter((p: any) =>
      ['Mars', 'Saturn', 'Rahu'].includes(p.planet) && [7, 2, 8].includes(p.house)
    ).length;
    const moonAfflicted = chart.planetaryPositions.some((p: any) => p.planet === 'Moon' && [6, 8, 12].includes(p.house));
    const afflictedCount = chart.planetaryPositions.filter((p: any) => p.dignity === 'debilitated').length;

    return res.status(200).json({
      success: true,
      data: {
        ascendant: chart.ascendant,
        planets: chart.planetaryPositions,
        houses: chart.houses,
        yogas: chart.yogas,
        dashas: chart.dashas,
        birthData: { name: birth.name, date: birth.dateOfBirth, time: birth.timeOfBirth },
        _premium_preview: {
          divorce_risk: seventhMalefics >= 2 ? 'HIGH — upgrade to see full analysis' : seventhMalefics === 1 ? 'MODERATE — upgrade to see details' : 'LOW — upgrade to confirm',
          mental_health: moonAfflicted ? '1+ indicators detected — upgrade to see full report' : 'Analysis available — upgrade to view',
          remedies_available: afflictedCount + 3,
          spouse_prediction: 'Full spouse profile available — upgrade to view',
          upgrade_url: 'https://marriage-astro.vercel.app/api-keys',
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
