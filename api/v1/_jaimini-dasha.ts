/**
 * POST /api/v1/jaimini-dasha
 * Tier: premium (teaser for free)
 * Returns: Jaimini/Chara Dasha analysis with Darakaraka and Upapada Lagna
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth.js';
import { generateChartFromBirthData } from '../../lib/reportGenerator.js';
import { calculateCharaKarakasUnified, analyzeDarakaraka, calculateUpapadaLagna } from '../../lib/jaiminiCalculations.js';

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
    const karakas = calculateCharaKarakasUnified(chart.planetaryPositions);

    const dkPlanet = chart.specialPoints.darakaraka;
    const dkPos = chart.planetaryPositions.find((p: any) => p.planet === dkPlanet);
    const darakaraka = analyzeDarakaraka(dkPlanet, {
      sign: dkPos?.sign || 'Libra',
      house: dkPos?.house || 7,
    });

    const upapada = calculateUpapadaLagna(chart.ascendantDegree || 0, chart.houses);

    if (!requireTierOrTeaser(auth, 'premium', res, () => ({
      darakaraka_planet: dkPlanet ?? null,
      note: 'Upgrade to Premium (₹399/mo or $14.99/mo) to see full Jaimini analysis: all Chara Karakas, Darakaraka interpretation, Upapada Lagna, and marriage timing via Jaimini dasha.',
      upgrade_url: 'https://marriage-astro.vercel.app/pricing',
    }))) return;

    return res.status(200).json({
      success: true,
      data: { karakas, darakaraka, upapada_lagna: upapada },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
