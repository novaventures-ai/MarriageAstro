/**
 * POST /api/v1/jaimini-dasha
 * Tier: developer
 * Returns: Jaimini/Chara Dasha analysis with Darakaraka and Upapada Lagna
 */
import { validateApiKey, requireTier, parseBirthData } from './_auth';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { calculateCharaKarakasUnified, analyzeDarakaraka, calculateUpapadaLagna } from '../../lib/jaiminiCalculations';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });
  if (!requireTier(auth, 'developer', res)) return;

  const birth = parseBirthData(req.body);
  if (!birth.dateOfBirth || isNaN(birth.latitude)) {
    return res.status(400).json({ error: 'Required: date, latitude, longitude' });
  }

  try {
    const chart = await generateChartFromBirthData(birth);
    const karakas = calculateCharaKarakasUnified(chart.planetaryPositions);

    const dkPlanet = chart.specialPoints.darakaraka;
    const dkPos = chart.planetaryPositions.find((p: any) => p.planet === dkPlanet);
    const darakaraka = analyzeDarakaraka(dkPlanet, {
      sign: dkPos?.sign || 'Libra',
      house: dkPos?.house || 7,
    });

    const upapada = calculateUpapadaLagna(chart.ascendantDegree || 0, chart.houses);

    return res.status(200).json({
      success: true,
      data: { karakas, darakaraka, upapada_lagna: upapada },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
