/**
 * POST /api/v1/sexual-health
 * Tier: premium
 * Returns: individual sexual health analysis (PME/ED/Frigidity risk indicators)
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth.js';
import { generateChartFromBirthData } from '../../lib/reportGenerator.js';
import { analyzeMaleSexualHealth, analyzeFemaleSexualHealth, analyzeLibido } from '../../lib/sexualHealthCalculations.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });

  const birth = parseBirthData(req.body);
  if (!birth.dateOfBirth || isNaN(birth.latitude)) {
    return res.status(400).json({ error: 'Required: date, latitude, longitude, gender' });
  }

  try {
    const chart = await generateChartFromBirthData(birth);

    if (!requireTierOrTeaser(auth, 'premium', res, () => {
      const venus = chart.planetaryPositions.find((p: any) => p.planet === 'Venus');
      const mars = chart.planetaryPositions.find((p: any) => p.planet === 'Mars');
      const libidoLevel = (mars?.dignity === 'exalted' || mars?.dignity === 'own_house') ? 'HIGH'
        : (mars?.dignity === 'debilitated') ? 'LOW' : 'MODERATE';
      return {
        libido_level_preview: libidoLevel,
        venus_placement: `Venus in ${venus?.sign || 'unknown'} (house ${venus?.house || '?'})`,
        summary: `Mars dignity (${mars?.dignity || 'neutral'}) suggests ${libidoLevel.toLowerCase()} energy levels.`,
        note: 'Upgrade to Premium ($99/mo) to see: complete sexual health markers, PME/ED/Frigidity risk indicators, and specific remedial recommendations.',
      };
    })) return;
    const libido = analyzeLibido(chart);
    const genderSpecific = birth.gender === 'female'
      ? analyzeFemaleSexualHealth(chart)
      : analyzeMaleSexualHealth(chart);

    return res.status(200).json({
      success: true,
      data: { libido, ...genderSpecific },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
