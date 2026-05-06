/**
 * POST /api/v1/inlaw-analysis
 * Tier: premium
 * Returns: compatibility with partner's family (in-law analysis from chart indicators)
 */
import { validateApiKey, requireTier, parseBirthData } from './_auth';
import { generateFullCompatibilityReport } from '../../lib/reportGenerator';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });
  if (!requireTier(auth, 'premium', res)) return;

  const birthA = parseBirthData(req.body, 'person_a');
  const birthB = parseBirthData(req.body, 'person_b');

  if (!birthA.dateOfBirth || !birthB.dateOfBirth || isNaN(birthA.latitude) || isNaN(birthB.latitude)) {
    return res.status(400).json({ error: 'Required: person_a_* and person_b_* birth fields' });
  }

  try {
    const report = await generateFullCompatibilityReport(birthA, birthB);
    return res.status(200).json({
      success: true,
      data: (report as any).inLawAnalysis || null,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
