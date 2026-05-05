/**
 * POST /api/v1/dosha-check
 * Tier: free
 * Returns: full dosha analysis for one or two people (Mangal, Nadi, Kaal Sarpa, etc.)
 */
import { validateApiKey, parseBirthData } from './_auth';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { analyzeYogaDoshas } from '../../lib/yogaDoshaCalculations';
import { calculateManglikDosha, checkNadiCancellation } from '../../lib/compatibilityCalculations';

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
    const chartB = singleMode ? null : await generateChartFromBirthData(birthB);

    const yogaDoshA = analyzeYogaDoshas(chartA);
    const manglikA = calculateManglikDosha(chartA, chartB || undefined);

    const result: any = {
      person_a: {
        name: birthA.name,
        manglik_dosha: manglikA,
        yogas: yogaDoshA.yogas,
        doshas: yogaDoshA.doshas,
        auspicious_yogas: yogaDoshA.auspiciousYogas,
        summary: yogaDoshA.summary,
        overall_severity: yogaDoshA.overallSeverity,
      },
    };

    if (chartB) {
      const yogaDoshB = analyzeYogaDoshas(chartB);
      const manglikB = calculateManglikDosha(chartB, chartA);
      const nadiCancelled = checkNadiCancellation(
        chartA.planets.find((p: any) => p.planet === 'Moon')?.sign || '',
        chartB.planets.find((p: any) => p.planet === 'Moon')?.sign || '',
        chartA.planets.find((p: any) => p.planet === 'Moon')?.nakshatra || '',
        chartB.planets.find((p: any) => p.planet === 'Moon')?.nakshatra || '',
      );
      result.person_b = {
        name: birthB.name,
        manglik_dosha: manglikB,
        yogas: yogaDoshB.yogas,
        doshas: yogaDoshB.doshas,
        auspicious_yogas: yogaDoshB.auspiciousYogas,
        summary: yogaDoshB.summary,
        overall_severity: yogaDoshB.overallSeverity,
      };
      result.nadi_cancellation = nadiCancelled;
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
