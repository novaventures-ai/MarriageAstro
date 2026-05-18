/**
 * POST /api/v1/full-report
 * Tier: developer
 * Returns: complete CompatibilityReport — all sections the caller's tier allows
 * This is the most comprehensive endpoint; use specific endpoints for targeted data.
 */
import { validateApiKey, requireTier, parseBirthData } from './_auth.js';
import { generateFullCompatibilityReport } from '../../lib/reportGenerator.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });
  if (!requireTier(auth, 'developer', res)) return;

  const birthA = parseBirthData(req.body, 'person_a');
  const birthB = parseBirthData(req.body, 'person_b');

  if (!birthA.dateOfBirth || !birthB.dateOfBirth || isNaN(birthA.latitude) || isNaN(birthB.latitude)) {
    return res.status(400).json({ error: 'Required: person_a_* and person_b_* birth fields' });
  }

  try {
    const report = await generateFullCompatibilityReport(birthA, birthB);

    // Strip premium sections for non-premium tier
    if (auth.tier !== 'premium') {
      delete (report as any).riskAssessment;
      delete (report as any).sexualCompatibility;
      delete (report as any).sexualHealth;
      delete (report as any).mentalHealthAnalysis;
      delete (report as any).psychologicalProfile;
      delete (report as any).conflictZones;
      delete (report as any).vulnerabilityTimeline;
    }

    return res.status(200).json({ success: true, data: report });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
