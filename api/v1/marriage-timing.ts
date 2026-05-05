/**
 * POST /api/v1/marriage-timing
 * Tier: developer
 * Returns: auspicious marriage windows from Dasha + Transit analysis
 */
import { validateApiKey, requireTier, parseBirthData } from './_auth';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { calculateVimshottariDasha, findMarriageWindows } from '../../lib/dashaCalculations';

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
    const dasha = calculateVimshottariDasha(chart);
    const windows = findMarriageWindows(dasha, chart);

    return res.status(200).json({
      success: true,
      data: {
        marriage_windows: windows,
        current_dasha: dasha.currentPeriod,
        upcoming_periods: dasha.periods?.slice(0, 10),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
