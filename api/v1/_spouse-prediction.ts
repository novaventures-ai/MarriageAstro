/**
 * POST /api/v1/spouse-prediction
 * Tier: premium
 * Returns: predicted spouse appearance, nature, profession, and meeting prediction
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth.js';
import { generateChartFromBirthData } from '../../lib/reportGenerator.js';
import { calculateSpousePrediction, calculateSpouseMeeting } from '../../lib/spouseCalculations.js';

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

    if (!requireTierOrTeaser(auth, 'premium', res, () => {
      const seventhLord = chart.houses[6]?.lord || 'Venus';
      const professionMap: Record<string, string> = {
        Sun: 'Government/Leadership/Medicine', Moon: 'Hospitality/Nursing/Arts',
        Mars: 'Military/Engineering/Sports', Mercury: 'Communication/Business/Tech',
        Jupiter: 'Teaching/Law/Finance', Venus: 'Arts/Fashion/Luxury',
        Saturn: 'Engineering/Labor/Research', Rahu: 'Foreign/Technology/Unconventional',
        Ketu: 'Spiritual/Research/Alternative',
      };
      return {
        spouse_profession_category: professionMap[seventhLord] || 'Business/Professional',
        seventh_house_lord: seventhLord,
        seventh_house_sign: chart.houses[6]?.sign || 'Unknown',
        summary: `7th house lord ${seventhLord} suggests spouse likely in: ${professionMap[seventhLord] || 'professional field'}.`,
        note: 'Upgrade to Premium ($99/mo) to see: appearance, personality traits, meeting timing, how/where you will meet, and full spouse profile.',
      };
    })) return;
    const prediction = calculateSpousePrediction(chart);
    const meeting = calculateSpouseMeeting(chart);

    return res.status(200).json({
      success: true,
      data: { spouse_prediction: prediction, meeting_prediction: meeting },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
