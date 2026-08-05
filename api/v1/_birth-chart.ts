/**
 * GET /api/v1/birth-chart
 * Tier: free
 * Returns: planets, houses, nakshatras, ascendant, yogas for one person
 */
import { validateApiKey, parseBirthData, requireTierOrTeaser } from './_auth.js';
import { generateChartFromBirthData } from '../../lib/reportGenerator.js';
import { assembleFullKundali } from '../../lib/fullKundali.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST required' });

  const auth = await validateApiKey(req);
  if (!auth.valid) return res.status(auth.statusCode || 401).json({ error: auth.error });

  const birth = parseBirthData(req.body);
  if (!birth.dateOfBirth || isNaN(birth.latitude) || isNaN(birth.longitude)) {
    return res.status(400).json({
      error: 'Required: date (YYYY-MM-DD), latitude, longitude',
      example: {
        date: '1990-01-15',
        time: '10:30',
        latitude: 19.076,
        longitude: 72.8777,
        timezone: 'Asia/Kolkata',
        name: 'Person A',
        gender: 'male',
      },
    });
  }

  try {
    const chart = await generateChartFromBirthData(birth);

    // ── detail=full — the complete kundali (all divisional charts, all yogas &
    // doshas, KP sub-lords, full Jaimini set, Vimshopaka strength, and the
    // Vimshottari tree with the active branch drilled to Prana). This is a
    // premium-grade payload, so it is gated to premium; free/lower tiers get a
    // teaser pointing at the summary + upgrade, keeping the paywall intact.
    const detail = String(req.body?.detail || 'summary').toLowerCase();
    if (detail === 'full') {
      if (!requireTierOrTeaser(auth, 'premium', res, () => ({
        ascendant: chart.ascendant,
        moon_nakshatra: chart.nakshatra,
        note: 'detail=full returns the complete kundali — every divisional chart, all yogas & doshas, KP sub-lords, the full Jaimini set, and the 5-level Vimshottari dasha. Premium plan (₹399/mo or $14.99/mo) unlocks it; the default summary is free.',
        upgrade_url: 'https://marriage-astro.vercel.app/pricing',
      }))) return;

      return res.status(200).json({ success: true, detail: 'full', data: assembleFullKundali(chart) });
    }

    const seventhMalefics = chart.planetaryPositions.filter((p: any) =>
      ['Mars', 'Saturn', 'Rahu'].includes(p.planet) && [7, 2, 8].includes(p.house)
    ).length;
    const moonAfflicted = chart.planetaryPositions.some((p: any) => p.planet === 'Moon' && [6, 8, 12].includes(p.house));
    const afflictedCount = chart.planetaryPositions.filter((p: any) => p.dignity === 'debilitated').length;

    // A genuine positive takeaway derived from the chart — benefics (Jupiter/
    // Venus) in kendras/trikonas signal natural relationship strength. Leading
    // the teaser with this (Peak-End rule) ends the free experience on agency,
    // not fear, before the upsell.
    const benefics = chart.planetaryPositions.filter((p: any) =>
      ['Jupiter', 'Venus'].includes(p.planet) && [1, 4, 5, 7, 9, 10].includes(p.house)
    );
    const brightSpot = benefics.length >= 2
      ? 'Strong support from Jupiter and Venus — a natural capacity for lasting commitment.'
      : benefics.length === 1
        ? `${benefics[0].planet} is well-placed for relationships — a real strength in your chart.`
        : 'Your chart shows workable ground for a happy marriage with conscious effort.';

    return res.status(200).json({
      success: true,
      data: {
        ascendant: chart.ascendant,
        planets: chart.planetaryPositions,
        houses: chart.houses,
        yogas: chart.yogas,
        dashas: chart.dashas,
        birthData: { name: birth.name, date: birth.dateOfBirth, time: birth.timeOfBirth },
        // Upsell block — only for callers who actually have something to upgrade to.
        // Agency-first: open with a free constructive insight, reframe risk as
        // resilience, and close on possibility rather than dread.
        ...(auth.tier !== 'premium' ? {
          _premium_preview: {
            bright_spot: brightSpot,
            relationship_resilience: seventhMalefics >= 2 ? 'A few areas will reward extra care — unlock your full resilience map' : seventhMalefics === 1 ? 'Mostly steady, with a couple of growth areas to understand' : 'Strong foundation — unlock the full picture to confirm',
            emotional_wellbeing: moonAfflicted ? 'A few sensitivity patterns worth nurturing — see your full profile' : 'A balanced emotional profile — see the full read',
            remedies_available: afflictedCount + 3,
            spouse_prediction: 'Your full future-spouse profile is ready to view',
            upgrade_url: 'https://marriage-astro.vercel.app/pricing',
          },
        } : {}),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Calculation failed' });
  }
}
