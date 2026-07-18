/**
 * POST /api/v1/navamsa
 * Tier: premium (teaser for free)
 * Returns: D9 Navamsa analysis.
 *  - Both persons provided: D9 compatibility matching.
 *  - Person A only: individual D9 chart analysis (marriage karma reading).
 */
import { validateApiKey, requireTierOrTeaser, parseBirthData } from './_auth.js';
import { generateChartFromBirthData } from '../../lib/reportGenerator.js';
import { calculateNavamsaMatching, getSignAtHouse } from '../../lib/compatibilityCalculations.js';
import { getSignLord } from '../../lib/coreCalculations.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });
  const birthA = parseBirthData(req.body, 'person_a');
  const birthB = parseBirthData(req.body, 'person_b');

  if (!birthA.dateOfBirth || isNaN(birthA.latitude)) {
    return res.status(400).json({ error: 'Required: person_a_* birth fields (person_b_* optional — omit for individual D9 analysis)' });
  }

  const hasPersonB = Boolean(birthB.dateOfBirth) && !isNaN(birthB.latitude);

  try {
    // ── Single-person: individual D9 chart analysis ──────────────────────────
    if (!hasPersonB) {
      const chartA = await generateChartFromBirthData(birthA);
      const d9 = chartA.vargaCharts.D9;

      // Vargottama: same sign in D1 and D9 — a planet's significations are
      // considered strong and stable in marriage matters.
      const vargottamaPlanets = d9.planetaryPositions
        .filter((p9: any) => {
          const p1 = chartA.planetaryPositions.find((p: any) => p.planet === p9.planet);
          return p1 && p1.sign === p9.sign;
        })
        .map((p: any) => p.planet);

      const seventhSign = getSignAtHouse(d9, 7);
      const seventhLord = getSignLord(seventhSign as any);
      const seventhLordInD9 = d9.planetaryPositions.find((p: any) => p.planet === seventhLord);

      const analysis = {
        mode: 'individual',
        navamsa_ascendant: d9.ascendant,
        navamsa_placements: d9.planetaryPositions.map((p: any) => ({
          planet: p.planet,
          sign: p.sign,
          house: p.house,
        })),
        vargottama_planets: vargottamaPlanets,
        marriage_house_d9: {
          seventh_sign: seventhSign,
          seventh_lord: seventhLord,
          seventh_lord_placement: seventhLordInD9
            ? { sign: seventhLordInD9.sign, house: seventhLordInD9.house }
            : null,
        },
        note: 'Individual D9 analysis. Provide person_b_* fields for partner matching.',
      };

      if (!requireTierOrTeaser(auth, 'premium', res, () => ({
        mode: 'individual',
        navamsa_ascendant: d9.ascendant,
        vargottama_planets: vargottamaPlanets,
        note: 'Upgrade to Premium (₹399/mo or $14.99/mo) to see the full individual D9 analysis: all navamsa placements, 7th house marriage karma, and lord placements.',
        upgrade_url: 'https://marriage-astro.vercel.app/pricing',
      }))) return;

      return res.status(200).json({ success: true, data: analysis });
    }

    // ── Two persons: D9 compatibility matching ───────────────────────────────
    const [chartA, chartB] = await Promise.all([
      generateChartFromBirthData(birthA),
      generateChartFromBirthData(birthB),
    ]);

    const navamsa = calculateNavamsaMatching(chartA, chartB);
    const d9A = chartA.vargaCharts.D9;
    const d9B = chartB.vargaCharts.D9;

    const matching = {
      mode: 'matching',
      ...navamsa,
      person_a_d9: {
        navamsa_ascendant: d9A.ascendant,
        placements: d9A.planetaryPositions.map((p: any) => ({ planet: p.planet, sign: p.sign, house: p.house })),
      },
      person_b_d9: {
        navamsa_ascendant: d9B.ascendant,
        placements: d9B.planetaryPositions.map((p: any) => ({ planet: p.planet, sign: p.sign, house: p.house })),
      },
    };

    if (!requireTierOrTeaser(auth, 'premium', res, () => ({
      person_a_navamsa_ascendant: d9A.ascendant ?? null,
      person_b_navamsa_ascendant: d9B.ascendant ?? null,
      note: 'Upgrade to Premium (₹399/mo or $14.99/mo) to see the full D9 Navamsa compatibility: all divisional placements, Navamsa lord matching, and marriage karma analysis.',
      upgrade_url: 'https://marriage-astro.vercel.app/pricing',
    }))) return;

    return res.status(200).json({ success: true, data: matching });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
