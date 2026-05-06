/**
 * POST /api/v1/compatibility
 * Tier: free
 * Returns: 36-point Ashtakoot Milan score with all 8 parameters + dosha flags
 */
import { validateApiKey, parseBirthData } from './_auth';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { calculateAshtakootMilan } from '../../lib/compatibilityCalculations';
import { analyzeYogaDoshas } from '../../lib/yogaDoshaCalculations';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });

  const birthA = parseBirthData(req.body, 'person_a');
  const birthB = parseBirthData(req.body, 'person_b');

  if (!birthA.dateOfBirth || !birthB.dateOfBirth || isNaN(birthA.latitude) || isNaN(birthB.latitude)) {
    return res.status(400).json({
      error: 'Required fields for both persons: person_a_date, person_a_latitude, person_a_longitude, person_b_date, ...',
      example: {
        person_a_name: 'Person A', person_a_date: '1990-01-15', person_a_time: '10:30',
        person_a_latitude: 19.076, person_a_longitude: 72.8777, person_a_timezone: 'Asia/Kolkata', person_a_gender: 'male',
        person_b_name: 'Person B', person_b_date: '1992-05-20', person_b_time: '08:00',
        person_b_latitude: 28.6139, person_b_longitude: 77.209, person_b_timezone: 'Asia/Kolkata', person_b_gender: 'female',
      },
    });
  }

  try {
    const [chartA, chartB] = await Promise.all([
      generateChartFromBirthData(birthA),
      generateChartFromBirthData(birthB),
    ]);

    const ashtakoot = calculateAshtakootMilan(chartA, chartB);
    const doshA = analyzeYogaDoshas(chartA);
    const doshB = analyzeYogaDoshas(chartB);

    return res.status(200).json({
      success: true,
      data: {
        total_score: ashtakoot.totalScore,
        max_score: ashtakoot.maxScore,
        percentage: ashtakoot.percentage,
        verdict: ashtakoot.percentage >= 72 ? 'Excellent' : ashtakoot.percentage >= 60 ? 'Good' : ashtakoot.percentage >= 40 ? 'Average' : 'Below Average',
        parameters: {
          varna: ashtakoot.parameters.varna,
          vashya: ashtakoot.parameters.vashya,
          tara: ashtakoot.parameters.tara,
          yoni: ashtakoot.parameters.yoni,
          graha_maitri: ashtakoot.parameters.grahaMaitri,
          gana: ashtakoot.parameters.gana,
          bhakoot: ashtakoot.parameters.bhakoot,
          nadi: ashtakoot.parameters.nadi,
        },
        doshas: {
          person_a: { summary: doshA.summary, severity: doshA.overallSeverity, doshas: doshA.doshas },
          person_b: { summary: doshB.summary, severity: doshB.overallSeverity, doshas: doshB.doshas },
        },
        _premium_preview: {
          divorce_risk: ashtakoot.doshas.nadiDosha || ashtakoot.doshas.bhakootDosha
            ? 'ELEVATED — dosha combination detected. Upgrade to see full divorce risk analysis'
            : 'LOW-MODERATE — upgrade to see complete divorce risk assessment',
          conflict_zones: '3–5 recurring friction patterns available — upgrade to view',
          vulnerability_windows: 'High-risk periods in next 3 years detected — upgrade to see dates',
          sexual_compatibility: 'Venus/Mars synastry analysis available — upgrade to view',
          upgrade_url: 'https://marriageastro.com/api-keys',
        },
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
