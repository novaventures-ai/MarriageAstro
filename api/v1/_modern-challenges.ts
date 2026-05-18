/**
 * POST /api/v1/modern-challenges
 * Tier: premium
 * Returns: digital age relationship challenges, modern planet analysis for couple
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth.js';
import { generateChartFromBirthData } from '../../lib/reportGenerator.js';
import { analyzeModernInsightsEnhanced } from '../../lib/modernInsightsCalculations.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });

  const birthA = parseBirthData(req.body, 'person_a');
  const birthB = parseBirthData(req.body, 'person_b');

  if (!birthA.dateOfBirth || !birthB.dateOfBirth || isNaN(birthA.latitude) || isNaN(birthB.latitude)) {
    return res.status(400).json({ error: 'Required: person_a_* and person_b_* birth fields' });
  }

  try {
    const [chartA, chartB] = await Promise.all([
      generateChartFromBirthData(birthA),
      generateChartFromBirthData(birthB),
    ]);

    if (!requireTierOrTeaser(auth, 'premium', res, () => {
      const uranusA = chartA.planetaryPositions.find((p: any) => p.planet === 'Uranus');
      const neptuneB = chartB.planetaryPositions.find((p: any) => p.planet === 'Neptune');
      const challenges = [uranusA?.house === 7 || uranusA?.house === 11, neptuneB?.house === 7 || neptuneB?.house === 12].filter(Boolean).length + 2;
      return {
        modern_challenge_patterns: challenges,
        primary_challenge: uranusA?.house === 11 ? 'Social media & digital boundaries' : 'Work-life balance in digital age',
        summary: `${challenges} modern relationship challenge patterns detected from outer planet analysis.`,
        note: 'Upgrade to Premium ($99/mo) to see: social media dynamics, long-distance compatibility, digital communication patterns, and Uranus/Neptune/Pluto influence on your relationship.',
      };
    })) return;

    const insights = analyzeModernInsightsEnhanced(chartA, chartB, birthA.name, birthB.name);
    return res.status(200).json({ success: true, data: insights });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
