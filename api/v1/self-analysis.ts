/**
 * POST /api/v1/self-analysis
 * Tier: developer
 * Returns: single-person marriage readiness, personality profile, timing forecast
 */
import { validateApiKey, requireTier, parseBirthData } from './_auth';
import { generateSelfAnalysisReport } from '../../lib/selfReportGenerator';

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
    const report = await generateSelfAnalysisReport(birth);

    // Strip premium sections for non-premium tier
    if (auth.tier !== 'premium') {
      delete (report as any).sexualProfile;
      delete (report as any).sexualHealth;
      delete (report as any).mentalHealth;
    }

    return res.status(200).json({ success: true, data: report });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
