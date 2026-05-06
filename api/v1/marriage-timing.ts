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
    const moonPos = chart.planetaryPositions.find((p: any) => p.planet === 'Moon');
    const dasha = calculateVimshottariDasha(
      chart.nakshatra as any,
      moonPos?.longitude || 0,
      new Date(chart.dateOfBirth),
    );
    const chartData = {
      seventhLord: chart.houses[6]?.lord || 'Venus' as any,
      venusPosition: { house: chart.planetaryPositions.find((p: any) => p.planet === 'Venus')?.house || 0 },
      jupiterPosition: { house: chart.planetaryPositions.find((p: any) => p.planet === 'Jupiter')?.house || 0 },
    };
    const windows = findMarriageWindows(dasha, [], chartData);
    const currentDasha = dasha.mahaDashas.find((d: any) => d.isCurrent);

    return res.status(200).json({
      success: true,
      data: {
        marriage_windows: windows,
        current_dasha: currentDasha,
        upcoming_periods: dasha.mahaDashas.slice(0, 10),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
