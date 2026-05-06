/**
 * POST /api/v1/spouse-prediction
 * Tier: premium
 * Returns: predicted spouse appearance, nature, profession, and meeting prediction
 */
import { validateApiKey, requireTier, parseBirthData } from './_auth';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { calculateSpousePrediction, calculateSpouseMeeting } from '../../lib/spouseCalculations';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });
  if (!requireTier(auth, 'premium', res)) return;

  const birth = parseBirthData(req.body);
  if (!birth.dateOfBirth || isNaN(birth.latitude)) {
    return res.status(400).json({ error: 'Required: date, latitude, longitude' });
  }

  try {
    const chart = await generateChartFromBirthData(birth);
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
