/**
 * POST /api/v1/sexual-health
 * Tier: premium
 * Returns: individual sexual health analysis (PME/ED/Frigidity risk indicators)
 */
import { validateApiKey, requireTier, parseBirthData } from './_auth';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { analyzeMaleSexualHealth, analyzeFemaleSexualHealth, analyzeLibido } from '../../lib/sexualHealthCalculations';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });
  if (!requireTier(auth, 'premium', res)) return;

  const birth = parseBirthData(req.body);
  if (!birth.dateOfBirth || isNaN(birth.latitude)) {
    return res.status(400).json({ error: 'Required: date, latitude, longitude, gender' });
  }

  try {
    const chart = await generateChartFromBirthData(birth);
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
