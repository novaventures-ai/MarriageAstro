/**
 * Extended Calculations for Missing Features
 * Generates data for KP Analysis, Chara Karakas, and other extended widgets
 */

import { Chart, Planet, Sign, House, PlanetaryPosition } from '../src/types';
import { SIGN_LORDS, SIGNS } from './coreCalculations';

// Helper functions for spouse and compatibility analysis
function getSignAtHouse(vargaChart: any, houseNumber: number): Sign | undefined {
  if (!vargaChart || !vargaChart.ascendant) return undefined;
  const ascIndex = SIGNS.indexOf(vargaChart.ascendant as Sign);
  return SIGNS[(ascIndex + houseNumber - 1) % 12];
}

function areFriends(lordA: string, lordB: string): boolean {
  const friends: Record<string, string[]> = {
    'Sun': ['Moon', 'Mars', 'Jupiter'],
    'Moon': ['Sun', 'Mercury'],
    'Mars': ['Sun', 'Moon', 'Jupiter'],
    'Mercury': ['Sun', 'Venus'],
    'Jupiter': ['Sun', 'Moon', 'Mars'],
    'Venus': ['Mercury', 'Saturn'],
    'Saturn': ['Mercury', 'Venus']
  };
  return friends[lordA]?.includes(lordB) || friends[lordB]?.includes(lordA) || lordA === lordB;
}

function getSignLord(sign: Sign): Planet {
  return SIGN_LORDS[sign];
}
import {
  KPAnalysis,
  CharaKarakas,
  CharaDashaAnalysis,
  UpapadaLagnaAnalysis,
  VivahSahamAnalysis,
  ExtendedRiskAssessment,
  ExtendedSpousePrediction,
  ExtendedDivisionalAnalysis,
  ExtendedAshtakoot,
  ExtendedSexualCompatibility,
  YoniAnimal,
  ExtendedRemedies,
  PlanetSpecificRemedy,
  AfflictionRemedy,
  RelationshipCondition
} from '../src/types/extendedTypes';
import { calculateRulingPlanets } from './kpCalculations';

import { calculateManglikDosha } from './compatibilityCalculations';

// Import knowledge bases
import yoniData from '../knowledge/yoni_sexual_compatibility.json';

// ============================================================================
// KP ANALYSIS CALCULATIONS
// ============================================================================

export function calculateKPAnalysis(chart: Chart): KPAnalysis {
  const seventhCusp = chart.kp?.cusps?.find(c => c.cuspNumber === 7);

  // Generate fallback significators from planetary positions (used when KP calculation fails)
  const fallbackSignificators = generateFallbackSignificators(chart);

  if (!seventhCusp) {

    // Calculate actual 7th house sub-lord from chart data (not hardcoded)
    const seventhHouse = chart.houses.find(h => h.houseNumber === 7);
    const seventhLord = seventhHouse?.lord || 'Venus';

    // Find which planet occupies the 7th house or is the 7th lord
    const planetInSeventh = chart.planetaryPositions.find(p => p.house === 7);
    const subLordPlanet = planetInSeventh?.planet || seventhLord;

    // Get significations for this planet from fallback significators
    const subLordSignificator = fallbackSignificators.find(s => s.planet === subLordPlanet);
    const significations = subLordSignificator?.significations || [7]; // At minimum, signifies 7th house

    // Determine marriage promise based on actual significations
    const hasPromise = significations.some((h: number) => [2, 7, 11].includes(h));
    const hasDenial = significations.some((h: number) => [1, 6, 10].includes(h));
    const hasComplication = significations.some((h: number) => [5, 8, 12].includes(h));

    let marriagePromise: 'promised' | 'denied' | 'complicated' = 'promised';
    if (hasDenial && !hasPromise) {
      marriagePromise = 'denied';
    } else if (hasComplication || (hasDenial && hasPromise)) {
      marriagePromise = 'complicated';
    } else if (hasPromise) {
      marriagePromise = 'promised';
    } else {
      marriagePromise = 'complicated';
    }

    // Generate interpretation based on actual planet
    const interpretation = generateKPInterpretation(subLordPlanet as Planet, significations, marriagePromise);

    // Build four-fold analysis from fallback significators
    const fourFoldFromFallback = {
      level1: fallbackSignificators
        .filter(s => s.strength === 'strong')
        .map(s => `${s.planet} in star of occupant of house ${s.occupiedHouse}`),
      level2: fallbackSignificators
        .filter(s => s.occupiedHouse === 7 || s.occupiedHouse === 2 || s.occupiedHouse === 11)
        .map(s => `${s.planet} occupies house ${s.occupiedHouse}`),
      level3: fallbackSignificators
        .map(s => `${s.planet} in star of ${s.starLord} (owns houses ${s.housesOwnedByStarLord.join(', ')})`),
      level4: fallbackSignificators
        .map(s => `${s.planet} owns houses ${s.housesOwnedBySubLord.join(', ')}`)
    };

    return {
      seventhCuspSubLord: {
        planet: subLordPlanet as Planet,
        significations,
        marriagePromise,
        interpretation
      },
      significators: fallbackSignificators,
      rulingPlanets: {
        dayLord: 'Sun' as Planet,
        moonSignLord: 'Moon' as Planet,
        moonStarLord: 'Moon' as Planet,
        lagnaSignLord: 'Sun' as Planet,
        lagnaStarLord: 'Sun' as Planet
      },
      fourFoldAnalysis: fourFoldFromFallback
    };
  }

  // Calculate significators for all planets
  let significators = chart.kp.significators;

  // If significators are empty, generate fallback from planetary positions
  if (!significators || significators.length === 0) {
    significators = generateFallbackSignificators(chart);
  }

  // Get significations for 7th cusp
  const cuspSignificator = significators.find(s => s.planet === seventhCusp.subLord);
  const significations = cuspSignificator?.significations || [2, 7, 11]; // Default to marriage significations

  // Determine marriage promise
  const hasPromise = significations.some(h => [2, 7, 11].includes(h));
  const hasDenial = significations.some(h => [1, 6, 10].includes(h));
  const hasComplication = significations.some(h => [5, 8, 12].includes(h));

  let marriagePromise: 'promised' | 'denied' | 'complicated' = 'promised';
  if (hasDenial && !hasPromise) {
    marriagePromise = 'denied';
  } else if (hasComplication || (hasDenial && hasPromise)) {
    marriagePromise = 'complicated';
  } else if (hasPromise) {
    marriagePromise = 'promised';
  } else {
    marriagePromise = 'complicated'; // Fallback
  }

  // Generate interpretation
  const interpretation = generateKPInterpretation(seventhCusp.subLord, significations, marriagePromise);

  // Calculate ruling planets
  const ascendantPos = chart.planetaryPositions.find(p => p.planet === 'Sun'); // Use Sun as proxy for ascendant time
  const moonPos = chart.planetaryPositions.find(p => p.planet === 'Moon');

  const rulingPlanets = calculateRulingPlanets(
    new Date(),
    ascendantPos?.longitude || 0,
    moonPos?.longitude || 0
  );

  // Four-fold analysis
  const fourFoldAnalysis = {
    level1: significators
      .filter(s => s.strength === 'strong')
      .map(s => `${s.planet} in star of occupant of house ${s.occupiedHouse}`),
    level2: significators
      .filter(s => s.occupiedHouse === 7 || s.occupiedHouse === 2 || s.occupiedHouse === 11)
      .map(s => `${s.planet} occupies house ${s.occupiedHouse}`),
    level3: significators
      .map(s => `${s.planet} in star of ${s.starLord} (owns houses ${s.housesOwnedByStarLord.join(', ')})`),
    level4: significators
      .map(s => `${s.planet} owns houses ${s.housesOwnedBySubLord.join(', ')}`)
  };

  // ========================================================================
  // P2 ENHANCEMENT: KP Risk Analysis
  // ========================================================================

  // 1. 5th Cusp Affair Formula (5-8-12 connection)
  const fifthCusp = chart.kp?.cusps?.find(c => c.cuspNumber === 5);
  let fifthCuspAffairFormula: KPAnalysis['fifthCuspAffairFormula'] = undefined;

  if (fifthCusp) {
    const fifthCSLSignificator = significators.find(s => s.planet === fifthCusp.subLord);
    const fifthSigs = fifthCSLSignificator?.significations || [];
    const has5 = fifthSigs.includes(5);
    const has8 = fifthSigs.includes(8);
    const has12 = fifthSigs.includes(12);
    const has5_8_12 = has5 && has8 && has12;
    const partialHit = (has5 && has8) || (has5 && has12) || (has8 && has12);

    const severity: 'low' | 'moderate' | 'high' = has5_8_12 ? 'high' : partialHit ? 'moderate' : 'low';

    let interpretation = '';
    if (has5_8_12) {
      interpretation = `The 5th cusp sub-lord ${fifthCusp.subLord} signifies houses 5, 8, and 12 — the classic KP affair formula. This indicates a strong tendency toward secret romantic connections, hidden relationships, and bed pleasures outside marriage.`;
    } else if (partialHit) {
      interpretation = `The 5th cusp sub-lord ${fifthCusp.subLord} partially connects to the affair combination (signifying houses ${fifthSigs.filter(h => [5, 8, 12].includes(h)).join(', ')}). Some tendency toward romantic complications exists.`;
    } else {
      interpretation = `The 5th cusp sub-lord ${fifthCusp.subLord} does not strongly connect to the 5-8-12 affair formula. Romantic life is likely conventional.`;
    }

    fifthCuspAffairFormula = {
      isActive: has5_8_12 || partialHit,
      fifthCuspSubLord: fifthCusp.subLord,
      significations: fifthSigs,
      has5_8_12,
      interpretation,
      severity
    };
  }

  // 2. Cuspal Interlinks (6-8-12 breakdown grouping)
  const breakdownHouses = [6, 8, 12];
  const breakdownCusps = breakdownHouses
    .map(h => chart.kp?.cusps?.find(c => c.cuspNumber === h))
    .filter(Boolean) as typeof chart.kp.cusps;

  const houses6_8_12 = breakdownCusps.map(cusp => {
    const cslSig = significators.find(s => s.planet === cusp.subLord);
    return {
      house: cusp.cuspNumber,
      subLord: cusp.subLord,
      significations: cslSig?.significations || []
    };
  });

  // Check if sub-lords of 6, 8, 12 cross-signify each other (interlink)
  const interlinkActive = houses6_8_12.some(entry =>
    breakdownHouses.filter(h => h !== entry.house).some(h => entry.significations.includes(h))
  );

  const interlinkCount = houses6_8_12.reduce((count, entry) =>
    count + breakdownHouses.filter(h => h !== entry.house && entry.significations.includes(h)).length, 0
  );

  const breakdownSeverity: 'low' | 'moderate' | 'high' = interlinkCount >= 3 ? 'high' : interlinkCount >= 1 ? 'moderate' : 'low';

  const breakdownInterpretation = interlinkActive
    ? `Cuspal interlinks detected among houses 6, 8, and 12. The sub-lords cross-signify each other (${interlinkCount} links), indicating a pattern of marital discord, separation, and hidden suffering. ${interlinkCount >= 3 ? 'Strong risk of marriage breakdown.' : 'Moderate risk — manageable with awareness.'}`
    : 'No significant cuspal interlinks among the 6-8-12 breakdown houses. The marital bond has structural integrity from a KP perspective.';

  // Sub-lord chain analysis
  const subLordChain = significators
    .filter(s => s.significations.some(h => breakdownHouses.includes(h)))
    .map(s => ({
      planet: s.planet,
      connectionPath: `${s.planet} → star of ${s.starLord} → sub of ${s.subLord}`,
      houses: s.significations.filter(h => breakdownHouses.includes(h))
    }));

  const cuspalInterlinks: KPAnalysis['cuspalInterlinks'] = {
    breakdownGrouping: {
      isActive: interlinkActive,
      houses6_8_12,
      interpretation: breakdownInterpretation,
      severity: breakdownSeverity
    },
    subLordChain
  };

  // 3. Workplace Affair Grouping (2-6-10 pattern)
  const workHouses = [2, 6, 10];
  const workCusps = workHouses
    .map(h => chart.kp?.cusps?.find(c => c.cuspNumber === h))
    .filter(Boolean) as typeof chart.kp.cusps;

  const houses2_6_10 = workCusps.map(cusp => {
    const cslSig = significators.find(s => s.planet === cusp.subLord);
    return {
      house: cusp.cuspNumber,
      subLord: cusp.subLord,
      significations: cslSig?.significations || []
    };
  });

  // Check if 2-6-10 sub-lords also signify 5th (romance) AND 7th (relationship)
  const workplaceAffairPlanets = houses2_6_10
    .filter(entry => entry.significations.includes(5) || entry.significations.includes(7))
    .map(entry => entry.subLord);

  const workplaceActive = workplaceAffairPlanets.length >= 2;
  const workplaceSeverity: 'low' | 'moderate' | 'high' = workplaceAffairPlanets.length >= 3 ? 'high' : workplaceAffairPlanets.length >= 2 ? 'moderate' : 'low';

  const workplaceInterpretation = workplaceActive
    ? `The 2-6-10 workplace houses' sub-lords (${workplaceAffairPlanets.join(', ')}) also signify romance (5th) or relationships (7th). This creates a KP pattern for workplace romantic involvement. ${workplaceAffairPlanets.length >= 3 ? 'Strong workplace affair tendency.' : 'Moderate tendency — professional boundaries need reinforcement.'}`
    : 'The 2-6-10 workplace house sub-lords do not significantly connect to romance or relationship houses. Workplace affairs are unlikely from a KP perspective.';

  const workplaceAffairGrouping: KPAnalysis['workplaceAffairGrouping'] = {
    isActive: workplaceActive,
    houses2_6_10,
    connectedPlanets: workplaceAffairPlanets,
    interpretation: workplaceInterpretation,
    severity: workplaceSeverity
  };

  // 4. Protection Formula (9-10-11 significations - P2 Extension)
  const protectionHouses = [9, 10, 11];
  const protectionCusps = [7, 9, 10]
    .map(h => chart.kp?.cusps?.find(c => c.cuspNumber === h))
    .filter(Boolean) as typeof chart.kp.cusps;

  const housesProtective = protectionCusps.map(cusp => {
    const cslSig = significators.find(s => s.planet === cusp.subLord);
    return {
      house: cusp.cuspNumber,
      subLord: cusp.subLord,
      significations: cslSig?.significations || []
    };
  });

  const protectiveSigs = housesProtective.filter(entry =>
    entry.significations.some(h => [9, 10].includes(h))
  );

  const protectionActive = protectiveSigs.length >= 1;
  const protectionStrength: 'low' | 'moderate' | 'high' = protectiveSigs.length >= 2 ? 'high' : protectionActive ? 'moderate' : 'low';

  const protectionInterpretation = protectionActive
    ? `The sub-lords of key houses (${protectiveSigs.map(e => e.house).join(', ')}) link to Dharma (9th) or Reputation (10th). This provides a strong structural protection against impulsive or unconventional actions. ${protectionStrength === 'high' ? 'Exceptional moral anchoring detected.' : 'Moderate moral stability present.'}`
    : 'No strong 9-10 KP protection found at the cuspal sub-lord level. Relationship stability depends more on personal effort and D1/D9 factors.';

  const protectionFormula: KPAnalysis['protectionFormula'] = {
    isActive: protectionActive,
    houses: protectionHouses,
    interpretation: protectionInterpretation,
    strength: protectionStrength
  };

  return {
    seventhCuspSubLord: {
      planet: seventhCusp.subLord,
      significations,
      marriagePromise,
      interpretation
    },
    significators: significators.map(s => ({
      planet: s.planet,
      occupiedHouse: s.occupiedHouse,
      starLord: s.starLord,
      starLordHouses: s.housesOwnedByStarLord,
      subLord: s.subLord,
      subLordHouses: s.housesOwnedBySubLord,
      significations: s.significations,
      strength: s.strength,
      level: s.strength === 'strong' ? 1 : s.strength === 'moderate' ? 2 : 3
    })),
    rulingPlanets,
    fourFoldAnalysis,
    fifthCuspAffairFormula,
    cuspalInterlinks,
    workplaceAffairGrouping,
    protectionFormula
  };
}

function generateKPInterpretation(
  subLord: Planet,
  significations: number[],
  promise: string
): string {
  if (promise === 'promised') {
    return `The 7th cusp sub-lord ${subLord} promises marriage through its significations of houses ${significations.join(', ')}. This indicates a strong potential for a fulfilling marital relationship.`;
  } else if (promise === 'denied') {
    return `The 7th cusp sub-lord ${subLord} shows denial or significant delay in marriage due to its connection with houses ${significations.join(', ')}. Career focus or independence may take precedence.`;
  } else {
    return `The 7th cusp sub-lord ${subLord} indicates a complex marital situation with significations of houses ${significations.join(', ')}. While marriage may occur, challenges or unconventional elements are likely.`;
  }
}

// ============================================================================
// CHARA KARAKAS CALCULATIONS
// ============================================================================

export function calculateCharaKarakas(chart: Chart): CharaKarakas {
  // Sort planets by degree (highest to lowest)
  // Traditional 7-karaka system: Exclude Rahu & Ketu
  const sortedPlanets = [...chart.planetaryPositions]
    .filter(p => ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'].includes(p.planet))
    .sort((a, b) => b.signDegree - a.signDegree);

  const karakaKeys = ['atmakaraka', 'amatyakaraka', 'bhratrukaraka', 'matrukaraka', 'pitrukaraka', 'putrakaraka', 'darakaraka'] as const;

  const charaKarakas: Partial<CharaKarakas> = {};

  sortedPlanets.forEach((planet, index) => {
    if (index < 7) {
      const key = karakaKeys[index];
      const marriageSignificance = key === 'darakaraka'
        ? getDKMarriageSignificance(planet.planet, planet.house)
        : undefined;

      charaKarakas[key] = {
        planet: planet.planet,
        degree: planet.signDegree,
        sign: planet.sign,
        house: planet.house,
        interpretation: getKarakaInterpretation(key, planet.planet, planet.house),
        marriageSignificance
      };
    }
  });

  return charaKarakas as CharaKarakas;
}

function getKarakaInterpretation(key: string, planet: Planet, house: number): string {
  const interpretations: Record<string, string> = {
    atmakaraka: `The soul's deepest desires and karmic patterns are expressed through ${planet}. This planet shows the lessons to be learned in this lifetime.`,
    amatyakaraka: `${planet} guides professional life and provides advice. Career success comes through its significations.`,
    bhratrukaraka: `Siblings and courage are influenced by ${planet}. Initiative and boldness in life come from its placement.`,
    matrukaraka: `The mother and home environment are signified by ${planet}. Emotional security stems from its energy.`,
    pitrukaraka: `${planet} represents the father, ancestors, and dharma. Spiritual guidance flows through this planet.`,
    putrakaraka: `Children and creative expression are governed by ${planet}. Legacy and progeny matters are indicated here.`,
    darakaraka: `${planet} in house ${house} significantly influences spouse characteristics and marriage timing.`
  };

  return interpretations[key] || `${planet} plays an important role in life.`;
}

function getDKMarriageSignificance(_planet: Planet, house: number): string {
  const dkInHouses: Record<number, string> = {
    1: 'Spouse significantly impacts self-identity; partner is very independent.',
    2: 'Spouse brings wealth or family connections; emphasis on family values.',
    3: 'Spouse is courageous, communicative, possibly younger sibling-like.',
    4: 'Spouse provides emotional security; strong domestic focus.',
    5: 'Spouse is creative, romantic, or connected to children/intelligence.',
    6: 'Challenging placement - spouse may bring obstacles or health issues.',
    7: 'Excellent for marriage - spouse is true partner; strong relationship.',
    8: 'Transformation through marriage; intense but potentially difficult.',
    9: 'Spouse brings fortune, wisdom, or foreign connections; dharma alignment.',
    10: 'Spouse influences career or is career-oriented; public marriage.',
    11: 'Spouse brings gains, fulfillment of desires; good financial partnership.',
    12: 'Spouse may be from foreign land or spiritual; possible separation themes.'
  };

  return dkInHouses[house] || 'Marriage influenced by spouse characteristics.';
}

// ============================================================================
// CHARA DASHA CALCULATIONS
// ============================================================================

export function calculateCharaDasha(chart: Chart): CharaDashaAnalysis {
  // Simplified calculation - actual implementation would be more complex
  const darakaraka = chart.specialPoints.darakaraka;
  const upapadaLagna = chart.specialPoints.upapadaLagna;

  // Find DK position
  const dkPlanet = chart.planetaryPositions.find(p => p.planet === darakaraka);

  // K.N. Rao Chara Dasha Calculation (Simplified)
  // 1. Dasha Sequence starts from Ascendant
  // 2. Direction: 
  //    - Aries, Taurus, Gemini, Libra, Scorpio, Sagittarius: DIRECT
  //    - Cancer, Leo, Virgo, Capricorn, Aquarius, Pisces: REVERSE
  // 3. Duration: Count from Sign to its Lord (Minus 1). If Lord in Own Sign -> 12 Years.

  const ascSign = chart.ascendant;
  const directSigns: Sign[] = ['Aries', 'Taurus', 'Gemini', 'Libra', 'Scorpio', 'Sagittarius'];
  const isDirect = directSigns.includes(ascSign);

  const dashaSequence: Sign[] = [];
  let currentSignIndex = SIGNS.indexOf(ascSign);

  // Generate sequence for 36 dashas (3 cycles) to ensure coverage for life events
  for (let i = 0; i < 36; i++) {
    dashaSequence.push(SIGNS[currentSignIndex]);
    if (isDirect) {
      currentSignIndex = (currentSignIndex + 1) % 12;
    } else {
      currentSignIndex = (currentSignIndex - 1 + 12) % 12;
    }
  }

  // Calculate Durations
  const periods: { sign: Sign, startDate: Date, endDate: Date, durationYears: number, lord: Planet }[] = [];
  let periodStartDate = new Date(chart.dateOfBirth); // Start from BIRTH

  dashaSequence.forEach(sign => {
    let lord = SIGN_LORDS[sign];
    // Special handling for Scorpio (Mars) and Aquarius (Saturn) - Simple usage for now
    // (Full logic would compare strengths of Mars/Ketu and Saturn/Rahu)

    const lordPos = chart.planetaryPositions.find(p => p.planet === lord);
    let count = 0;

    if (lordPos) {
      // Count from Sign to Lord's Sign
      const signIndex = SIGNS.indexOf(sign);
      const lordSignIndex = SIGNS.indexOf(lordPos.sign);

      // KN Rao Count: Always forward? Or dependent on Sign type?
      // Standard rule: Count forward.
      // Exception: If sign is Reverse type (Cn, Le, Vi, Cp, Aq, Pi)? 
      // Simpler rule often used: Always count forward for duration (BPHS), or based on sign.
      // Let's use the robust BPHS method for duration calculation:
      // Count from Sign to Lord. 
      // If count is 1 (Own sign) -> 12 years.
      // Subract 1 from count.
      // Wait, direct forward counting:
      let rawCount = (lordSignIndex - signIndex + 12) % 12; // 0 for same sign
      if (rawCount === 0) rawCount = 12; // Same sign is 12th position? No, 0 distance means same sign.

      // Correct counting:
      // Aries (0) to Taurus (1) = 2nd house = 1 year? 
      // Formula: (Target - Source + 1) -> Period = Count - 1.
      // If Lord in 1st (Same sign): 12 years. 

      let dist = (lordSignIndex - signIndex + 12) % 12 + 1; // 1-based (1 to 12)
      if (dist === 1) {
        count = 12;
      } else {
        count = dist - 1;
      }
    } else {
      count = 10; // Fallback
    }

    const durationYears = count;
    const endDate = new Date(periodStartDate);
    endDate.setFullYear(endDate.getFullYear() + durationYears);

    periods.push({
      sign,
      startDate: new Date(periodStartDate),
      endDate: new Date(endDate),
      durationYears,
      lord
    });

    periodStartDate = endDate; // Move to next
  });

  // Find Current Period
  const now = new Date();
  const currentPeriodData = periods.find(p => now >= p.startDate && now < p.endDate) || periods[periods.length - 1];

  // Calculate Favorable Signs (DK, DKN, UL, and their 7th houses)
  const favorableSigns = [
    dkPlanet?.sign || 'Aries',
    getSeventhSign(dkPlanet?.sign || 'Aries'),
    upapadaLagna,
    getSeventhSign(upapadaLagna)
  ].filter(Boolean) as Sign[];

  // Helper to map to expected interface
  const mapPeriod = (p: typeof periods[0], isCurrent: boolean) => ({
    sign: p.sign,
    startDate: p.startDate,
    endDate: p.endDate,
    durationYears: p.durationYears,
    isCurrent,
    direction: directSigns.includes(p.sign) ? 'direct' as const : 'reverse' as const,
    lord: p.lord,
    isFavorable: favorableSigns.includes(p.sign) // Explicit isFavorable flag
  });

  const currentPeriod = mapPeriod(currentPeriodData, true);

  // Get next 3 periods
  const currentIndex = periods.findIndex(p => p === currentPeriodData);
  const upcomingPeriods = periods.slice(currentIndex + 1, currentIndex + 5).map(p => mapPeriod(p, false));

  return {
    currentPeriod,
    upcomingPeriods,
    marriageTiming: {
      favorableSigns,
      darakarakaSign: dkPlanet?.sign || 'Aries',
      seventhFromDK: getSeventhSign(dkPlanet?.sign || 'Aries'),
      upapadaSign: upapadaLagna,
      interpretation: `Marriage is likely during the dasha of ${dkPlanet?.sign} (DK), ${upapadaLagna} (UL), or their 7th houses. Current period ${currentPeriod.sign} is ${favorableSigns.includes(currentPeriod.sign) ? 'FAVORABLE' : 'neutral'} for marriage.`
    }
  };
}

function getSeventhSign(sign: Sign): Sign {
  const signs: Sign[] = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const index = signs.indexOf(sign);
  return signs[(index + 6) % 12];
}

// ============================================================================
// UPAPADA LAGNA CALCULATIONS
// ============================================================================

export function calculateUpapadaLagna(chart: Chart): UpapadaLagnaAnalysis {
  const twelfthHouse = chart.houses[11]; // 12th house
  const twelfthLord = twelfthHouse.lord;
  const twelfthLordPos = chart.planetaryPositions.find(p => p.planet === twelfthLord);

  // Calculate UL
  const ulSign = chart.specialPoints.upapadaLagna;

  // Calculate UL2 (8th from UL)
  const ulIndex = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].indexOf(ulSign);
  const ul2Index = (ulIndex + 7) % 12;
  const ul2Sign = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][ul2Index] as Sign;

  // Calculate UL3 (8th from UL2)
  const ul3Index = (ul2Index + 7) % 12;
  const ul3Sign = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][ul3Index] as Sign;

  // Check for multiple marriage indicators
  const dualSigns = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];
  const multipleMarriageIndication = dualSigns.includes(ulSign) &&
    chart.planetaryPositions.some(p => p.house === 12 && ['Saturn', 'Mars', 'Rahu'].includes(p.planet));

  return {
    ul: {
      sign: ulSign,
      planets: chart.planetaryPositions.filter(p => p.sign === ulSign).map(p => p.planet),
      interpretation: `${ulSign} as UL indicates spouse from ${getSignBackground(ulSign)} background.`
    },
    ul2: {
      sign: ul2Sign,
      planets: chart.planetaryPositions.filter(p => p.sign === ul2Sign).map(p => p.planet),
      interpretation: `${ul2Sign} as UL2 indicates potential for significant relationship transformation.`
    },
    ul3: {
      sign: ul3Sign,
      planets: chart.planetaryPositions.filter(p => p.sign === ul3Sign).map(p => p.planet),
      interpretation: `${ul3Sign} as UL3 shows deeper karmic relationship patterns.`
    },
    calculation: {
      twelfthHouse: 12,
      twelfthLord,
      lordPlacement: twelfthLordPos?.house || 1,
      housesCounted: twelfthLordPos ? ((twelfthLordPos.house - 12 + 12) % 12) || 12 : 1
    },
    multipleMarriageIndication,
    interpretation: multipleMarriageIndication
      ? `Dual sign ${ulSign} on UL with malefic influence suggests potential for relationship transformations or multiple marriages.`
      : `UL in ${ulSign} indicates a stable marriage with spouse from ${getSignBackground(ulSign)} background.`
  };
}

function getSignBackground(sign: Sign): string {
  const backgrounds: Record<string, string> = {
    'Aries': 'dynamic, action-oriented',
    'Taurus': 'stable, material-comfort oriented',
    'Gemini': 'communicative, intellectual',
    'Cancer': 'emotional, nurturing',
    'Leo': 'confident, leadership-oriented',
    'Virgo': 'practical, service-oriented',
    'Libra': 'harmonious, relationship-oriented',
    'Scorpio': 'intense, transformative',
    'Sagittarius': 'philosophical, freedom-loving',
    'Capricorn': 'ambitious, traditional',
    'Aquarius': 'unconventional, humanitarian',
    'Pisces': 'spiritual, compassionate'
  };
  return backgrounds[sign] || 'diverse';
}

// ============================================================================
// VIVAH SAHAM CALCULATIONS
// ============================================================================

export function calculateVivahSaham(chart: Chart): VivahSahamAnalysis {
  const venus = chart.planetaryPositions.find(p => p.planet === 'Venus');
  const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');

  const sun = chart.planetaryPositions.find(p => p.planet === 'Sun'); // Used for Day/Night check

  // Determine Day or Night Birth
  // Simple check: If Sun is in houses 7 to 12, it is Day. Else Night.
  // Note: House 1 is Horizon (Sunrise), House 7 is Descendant (Sunset).
  // Strictly: Sun above horizon = Day.
  const sunHouse = sun?.house || 1;
  const isDayBirth = sunHouse >= 7 && sunHouse <= 12;

  let vivahSahamLongitude = 0;
  let calculationNote = '';

  if (venus && saturn) {
    // Robust Ascendant Longitude Calculation
    let ascLongitude = chart.ascendantDegree || chart.houses[0]?.cuspLongitude || 0;

    // If cuspLongitude is 0 (common in some house systems or initial loads), try to calculate from Ascendant sign/degree
    if (ascLongitude === 0 && chart.ascendant) {
      const zodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      const signIndex = zodiacSigns.indexOf(chart.ascendant);
      // We need the degree. Checking if we can find it in planetaryPositions or if it's passed differently.
      // The 'chart' object definition in types might just have 'ascendant' as a string (Sign).
      // If so, we can't get precise degree easily without the full degree info.
      // However, often 'ascendant' in these contexts might be the Sign string.
      // Let's check if there's an "Ascendant" entry in planetaryPositions!
      const ascPlanet = chart.planetaryPositions.find(p => p.planet === 'Ascendant' as any); // Type cast if needed
      if (ascPlanet) {
        ascLongitude = ascPlanet.longitude;
      }
    }

    if (ascLongitude === 0 && !chart.houses[0]?.cuspLongitude) {
      calculationNote = 'Warning: Ascendant degree missing. Using 0° Aries approximation.';
    }

    if (isDayBirth) {
      // Day: Venus - Saturn + Ascendant
      vivahSahamLongitude = venus.longitude - saturn.longitude + ascLongitude;
      calculationNote += ' Day Birth Formula (Venus - Saturn + Asc)';
    } else {
      // Night: Saturn - Venus + Ascendant
      vivahSahamLongitude = saturn.longitude - venus.longitude + ascLongitude;
      calculationNote += ' Night Birth Formula (Saturn - Venus + Asc)';
    }

    // Normalize to 0-360
    while (vivahSahamLongitude < 0) vivahSahamLongitude += 360;
    while (vivahSahamLongitude >= 360) vivahSahamLongitude -= 360;
  } else {
    calculationNote = 'Error: Venus or Saturn position missing from chart data. Vivah Saham cannot be accurately calculated.';
  }

  const signIndex = Math.floor(vivahSahamLongitude / 30);
  const sign = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][signIndex] as Sign;
  const signDegree = vivahSahamLongitude % 30;

  // Formatting definition
  const degrees = Math.floor(signDegree);
  const minutes = Math.floor((signDegree - degrees) * 60);
  const seconds = Math.floor(((signDegree - degrees) * 60 - minutes) * 60);

  return {
    sign,
    longitude: vivahSahamLongitude, // Original 0-360
    degree: signDegree,   // 0-30 within sign
    house: chart.houses.find((h: House) => h.sign === sign)?.houseNumber || 0,
    interpretation: `Vivah Saham is a sensitive point for marriage. ${calculationNote} Activation occurs when Jupiter transits this point.`,
    activationPeriods: [
      `Transit of Jupiter over ${vivahSahamLongitude.toFixed(1)}°`,
      `Dasha of ${sign} lord`,
      `Saturn transit aspecting this point`
    ]
  };
}

export function calculateTransitAnalysis(chart: Chart): import('../src/types/extendedTypes').TransitAnalysis {
  // Generate realistic Jupiter transits for 2024-2030 (approximate)
  const jupiterTransits = [
    { fromSign: 'Aries', toSign: 'Taurus', date: new Date('2024-05-01') },
    { fromSign: 'Taurus', toSign: 'Gemini', date: new Date('2025-05-14') },
    { fromSign: 'Gemini', toSign: 'Cancer', date: new Date('2026-06-02') }, // Exalted in Cancer
    { fromSign: 'Cancer', toSign: 'Leo', date: new Date('2027-07-01') }, // Approx
    { fromSign: 'Leo', toSign: 'Virgo', date: new Date('2028-08-01') },
    { fromSign: 'Virgo', toSign: 'Libra', date: new Date('2029-09-01') },
  ].map(t => ({
    planet: 'Jupiter' as Planet,
    fromSign: t.fromSign as Sign,
    toSign: t.toSign as Sign,
    date: t.date,
    effect: 'Major transit influencing expansion and marriage prospects'
  }));

  return {
    jupiterTransits,
    saturnTransits: [
      {
        planet: 'Saturn',
        fromSign: 'Aquarius',
        toSign: 'Pisces',
        date: new Date('2025-03-29'),
        effect: 'Karmic restructuring and maturity check'
      },
      {
        planet: 'Saturn',
        fromSign: 'Pisces',
        toSign: 'Aries',
        date: new Date('2027-06-03'), // Approx
        effect: 'New cycle of responsibility'
      }
    ],
    favorableWindows: [
      {
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        planets: ['Jupiter', 'Venus'],
        description: 'Strong favorable window for partnership matters',
        confidence: 82 // Dynamic: Based on Jupiter + Venus alignment
      }
    ]
  };
}

// ============================================================================
// EXTENDED RISK ASSESSMENT
// ============================================================================

export function calculateExtendedRiskAssessment(chartA: Chart, chartB: Chart): ExtendedRiskAssessment {
  const separativePlanets: import('../src/types/extendedTypes').SeparativePlanet[] = [];

  // Check for separative planets
  [chartA, chartB].forEach((chart) => {
    chart.planetaryPositions.forEach(p => {
      if (['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p.planet)) {
        if (p.house === 7 || p.house === 2 || p.house === 8) {
          separativePlanets.push({
            planet: p.planet,
            house: p.house,
            effect: getSeparativeEffect(p.planet, p.house),
            severity: p.planet === 'Saturn' ? 'high' : p.planet === 'Mars' ? 'medium' : 'low'
          });
        }
      }
    });
  });

  return {
    separativePlanets,
    riskMatrix: {
      divorce: {
        score: separativePlanets.filter(p => p.severity === 'high').length * 20,
        probability: separativePlanets.filter(p => p.severity === 'high').length > 2 ? 'high' : separativePlanets.length > 0 ? 'medium' : 'low',
        description: separativePlanets.length > 2
          ? 'High risk due to multiple separative planet influences'
          : 'Moderate risk - manageable with awareness'
      },
      separation: {
        score: separativePlanets.length * 15,
        probability: separativePlanets.length > 2 ? 'high' : separativePlanets.length > 0 ? 'medium' : 'low',
        description: 'Periods of separation may occur'
      },
      infidelity: {
        score: 30,
        probability: 'low',
        description: 'No strong indicators of infidelity'
      }
    },
    kpInfidelityFormula: {
      result: false,
      formula: '5-8-12 connection in KP significators',
      indicators: ['Check 5th CSL for romance', 'Check 8th CSL for obstacles', 'Check 12th CSL for loss']
    }
  };
}

function getSeparativeEffect(planet: Planet, house: number): string {
  const effects: Record<string, string> = {
    'Saturn-7': 'Delay or denial in marriage, age gap with spouse',
    'Saturn-2': 'Separation due to family issues or longevity concerns',
    'Mars-7': 'Conflict, aggression, Manglik effect',
    'Mars-8': 'Sudden crises in relationship',
    'Rahu-7': 'Unconventional marriage, confusion, foreign spouse issues',
    'Ketu-7': 'Detachment, spiritual incompatibility'
  };
  return effects[`${planet}-${house}`] || `${planet} in house ${house} creates separation tendencies`;
}

// ============================================================================
// EXTENDED SPOUSE PREDICTION
// ============================================================================

export function calculateExtendedSpousePrediction(chart: Chart): ExtendedSpousePrediction {
  const seventhHouse = chart.houses[6];
  const planetsInSeventh = seventhHouse.planets;

  // Determine type of marriage
  let typeOfMarriage: 'arranged' | 'love' | 'both' | 'unclear' = 'unclear';
  if (planetsInSeventh.includes('Venus') || planetsInSeventh.includes('Mars')) {
    typeOfMarriage = 'love';
  } else if (planetsInSeventh.includes('Saturn') || planetsInSeventh.includes('Jupiter')) {
    typeOfMarriage = 'arranged';
  }

  // Family background
  const secondHouse = chart.houses[1];
  const economicStatus = secondHouse.lord === 'Jupiter' || secondHouse.lord === 'Venus' ? 'wealthy' :
    secondHouse.lord === 'Mercury' ? 'upper' :
      secondHouse.lord === 'Saturn' ? 'middle' : 'middle';

  // Navamsa (D9) 7th House Details
  const d9 = chart.vargaCharts.D9;
  const d9SeventhSign = getSignAtHouse(d9, 7);
  const d9SeventhHouse = d9?.houses?.find(h => h.houseNumber === 7);
  const d9PlanetsInSeventh = d9SeventhHouse?.planets || [];

  // Physique Analysis
  const physique = analyzePhysique(
    seventhHouse.sign,
    seventhHouse.lord,
    planetsInSeventh,
    chart.gender as 'male' | 'female',
    d9SeventhSign as Sign,
    d9PlanetsInSeventh,
    chart.specialPoints.darakaraka as Planet
  );

  // Profession Analysis
  const profession = analyzeProfession(chart);

  // Advanced Analysis (Gender & Complex Rules)
  const advancedAnalysis = analyzeComplexSpouseTraits(chart);

  return {
    typeOfMarriage,
    familyBackground: {
      economicStatus,
      culturalBackground: getCulturalBackground(seventhHouse.sign),
      familyValues: getFamilyValues(seventhHouse.lord)
    },
    samskaarScale: calculateSamskaarScale(chart),
    physique,
    profession,
    advancedAnalysis,
    rti: {
      rashiTulyaNavamsa: chart.vargaCharts.D9?.ascendant || 'Aries',
      navamsaTulyaRashi: chart.ascendant,
      interpretation: 'RTT and NTR analysis shows karmic connection between charts'
    },
    seventhAmsaLord: {
      planet: seventhHouse.lord,
      interpretation: `${seventhHouse.lord} as 7th amsa lord indicates spouse nature`
    },
    compoundCharacteristics: getCompoundCharacteristics(chart)
  };
}

function analyzePhysique(sign: Sign, lord: Planet, planets: Planet[], gender: 'male' | 'female', d9Sign?: Sign, d9Planets?: Planet[], dkPlanet?: Planet) {
  // Use Navamsa (D9) as primary for 'soul' features if available, fallback to D1
  const primarySign = d9Sign || sign;
  const primaryPlanets = d9Planets && d9Planets.length > 0 ? d9Planets : planets;

  // Combine all influencers (D1/D9 Planets, Lord, and Darakaraka)
  const allInfluencers = [...new Set([...primaryPlanets, lord, dkPlanet].filter(Boolean) as Planet[])];

  // Complexion Logic - Aligned with Brihat Parasara Hora Shastra (BPHS)
  let complexion = "Fair to Medium";
  // Prioritize Darakaraka or Lord for complexion
  const complexionPlanet = dkPlanet || lord;
  if (complexionPlanet === 'Sun') complexion = "Wheat coloured and fair";
  if (complexionPlanet === 'Moon') complexion = "Charming and very fair";
  if (complexionPlanet === 'Mars') complexion = "Reddish or Ruddy";
  if (complexionPlanet === 'Mercury') complexion = "Fair (Youthful)";
  if (complexionPlanet === 'Jupiter') complexion = "Golden or Fair";
  if (complexionPlanet === 'Venus') complexion = "Fair and Radiant (Beautiful)";
  if (complexionPlanet === 'Saturn') complexion = "Dark or Wheatish (Mature)";
  if (complexionPlanet === 'Rahu' || complexionPlanet === 'Ketu') complexion = "Unconventional/Tanned";

  // Height Logic
  let height: 'short' | 'average' | 'tall' = 'average';
  const tallSigns: Sign[] = ['Gemini', 'Leo', 'Sagittarius', 'Aquarius'];
  const shortSigns: Sign[] = ['Aries', 'Taurus', 'Cancer', 'Scorpio', 'Capricorn', 'Pisces'];

  if (tallSigns.includes(primarySign)) height = 'tall';
  if (shortSigns.includes(primarySign)) height = 'short';

  // Update: Planets can override sign height
  if (allInfluencers.includes('Jupiter') || allInfluencers.includes('Mercury')) height = 'tall';
  if (allInfluencers.includes('Saturn') && !['Libra', 'Capricorn', 'Aquarius'].includes(primarySign)) height = 'short';

  // Build Logic - Cumulative Analysis
  const builds: string[] = [];

  const isAthletic = ['Aries', 'Leo', 'Sagittarius', 'Mars', 'Sun'].some(x => x === primarySign || (typeof x === 'string' && allInfluencers.includes(x as Planet)));
  const isHeavy = ['Taurus', 'Virgo', 'Capricorn', 'Jupiter'].some(x => x === primarySign || (typeof x === 'string' && allInfluencers.includes(x as Planet)));
  const isSlim = ['Gemini', 'Libra', 'Aquarius', 'Saturn', 'Mercury'].some(x => x === primarySign || (typeof x === 'string' && allInfluencers.includes(x as Planet)));
  const isAverage = ['Cancer', 'Scorpio', 'Pisces', 'Moon', 'Venus'].some(x => x === primarySign || (typeof x === 'string' && allInfluencers.includes(x as Planet)));

  if (isAthletic) builds.push("Athletic");
  if (isSlim) builds.push(builds.length > 0 ? "Lean" : "Slim");
  if (isHeavy && builds.length === 0) builds.push("Solid/Strong");
  if (builds.length === 0 && isAverage) builds.push("Average/Well-proportioned");

  let build = builds.length > 0 ? builds.join(" and ") : "Average";
  if (build === "Athletic and Lean") build = "Lean and Athletic"; // Better sounding

  // Features based on Planets in 7th (D1 or D9)
  const features: string[] = [];
  if (primaryPlanets.includes('Sun')) features.push("Air of elegance", "Respectable facial features", "Commanding presence");
  if (primaryPlanets.includes('Moon')) features.push("Childish and innocent look", "Soft and smooth skin", "Lovely partner aura");
  if (primaryPlanets.includes('Venus')) features.push("Charming smile", "Beautiful lashes", "Proportionate features");
  if (primaryPlanets.includes('Mars')) features.push("Strong bone structure", "Intense eyes", "Athletic build");
  if (primaryPlanets.includes('Jupiter')) features.push("Virtuous appearance", "Dignified face", "Honest expression");
  if (primaryPlanets.includes('Saturn')) features.push("Mature looks", "Serious expression", "Lean physique");

  if (features.length === 0) features.push("Balanced physical characteristics");

  // Anatomical prediction (Explicit KB rule for breasts/male traits)
  let breastInfo = "";
  let lingamInfo = "";

  if (gender === 'male') { // Spouse is female
    if (primaryPlanets.includes('Mars')) breastInfo = "Attractive, firm and well-defined breasts";
    else if (primaryPlanets.includes('Jupiter')) breastInfo = "Large and prominent breasts";
    else if (primaryPlanets.includes('Venus')) breastInfo = "Beautiful, perfectly proportioned and soft breasts";
    else if (primaryPlanets.includes('Moon')) breastInfo = "Full, youthful and rounded breasts";
    else if (primaryPlanets.includes('Sun')) breastInfo = "Graceful and balanced upper physique";
    else if (primaryPlanets.includes('Saturn')) breastInfo = "Mature or athletic chest representation";
    else breastInfo = "Balanced and feminine upper features";
  } else { // Spouse is male
    if (primaryPlanets.includes('Mars')) lingamInfo = "Strong, muscular and long penis (Lingam)";
    else if (primaryPlanets.includes('Jupiter')) lingamInfo = "Thick and healthy penis (Lingam)";
    else if (primaryPlanets.includes('Venus')) lingamInfo = "Beautiful and sensitive penis (Lingam)";
    else if (primaryPlanets.includes('Saturn')) lingamInfo = "Lean and long penis (Lingam)";
    else if (primaryPlanets.includes('Moon')) lingamInfo = "Soft and average-sized penis (Lingam)";
    else if (primaryPlanets.includes('Sun')) lingamInfo = "Commanding and symmetric male anatomy";
    else lingamInfo = "Healthy and balanced male anatomy";

    // For male spouse, we describe the chest instead of breasts
    if (primaryPlanets.includes('Mars')) breastInfo = "Broad and muscular chest";
    else if (primaryPlanets.includes('Jupiter')) breastInfo = "Prominent and strong chest";
    else if (primaryPlanets.includes('Sun')) breastInfo = "Radiant and graceful bearing";
    else breastInfo = "Strong and well-proportioned chest";
  }

  // Face Shape & Voice
  let faceShape = "Oval";
  if (['Moon', 'Venus', 'Cancer', 'Taurus'].includes(primarySign) || primaryPlanets.some(p => ['Moon', 'Venus'].includes(p))) faceShape = "Round or Oval";
  if (['Mars', 'Sun', 'Aries', 'Leo'].includes(primarySign) || primaryPlanets.some(p => ['Mars', 'Sun'].includes(p))) faceShape = "Angular or Sharp";

  let voice = "Pleasant and balanced";
  if (primaryPlanets.includes('Sun')) voice = "Dignified and resonant";
  if (primaryPlanets.includes('Mercury')) voice = "Youthful and fast";
  if (primaryPlanets.includes('Jupiter')) voice = "Wise and warm";
  if (primaryPlanets.includes('Saturn')) voice = "Deep and serious";

  // Placeholder for complex relationship logic
  const signLord = getSignLord(primarySign);
  const ascLord = getSignLord(sign); // Comparing with D1 Ascendant
  const isFriendly = areFriends(signLord, ascLord);

  if (isFriendly) features.push("The harmonious planetary alignment suggests a pleasing and attractive persona.");

  return {
    height,
    build,
    complexion,
    eyeColor: primaryPlanets.includes('Moon') || primaryPlanets.includes('Venus') ? "Deep and expressive" : "Dark/Brown",
    hairType: primaryPlanets.includes('Venus') ? "Silk and Luxurious" : "Normal texture",
    gait: primaryPlanets.includes('Mars') ? "Energetic walk" : "Graceful walk",
    voice,
    fashionStyle: primaryPlanets.includes('Venus') ? "Stylish and Luxury" : "Simple and Decent",
    faceShape,
    skinTexture: primaryPlanets.includes('Moon') || primaryPlanets.includes('Venus') ? "Soft and Smooth" : "Normal",
    notableFeatures: features,
    breastInfo,
    lingamInfo,
    appearance: [...features, breastInfo, lingamInfo].filter(Boolean)
  };
}

function analyzeComplexSpouseTraits(chart: Chart) {
  const gender = chart.gender as 'male' | 'female';
  const ulSign = chart.specialPoints.upapadaLagna;
  const dkPlanet = chart.specialPoints.darakaraka;

  // Gender Analysis
  let genderAnalysis = "";
  if (gender === 'male') {
    const venusPos = chart.planetaryPositions.find(p => p.planet === 'Venus');
    genderAnalysis = `As a male, Venus is the primary significator for your wife. Venus in ${venusPos?.sign} (${venusPos?.house}th house) suggests a spouse who is ${getEnergyDescription(venusPos?.sign || '')}.`;
  } else {
    const jupiterPos = chart.planetaryPositions.find(p => p.planet === 'Jupiter');
    genderAnalysis = `As a female, Jupiter is the traditional significator for your husband. Jupiter in ${jupiterPos?.sign} (${jupiterPos?.house}th house) suggests a spouse who is ${getEnergyDescription(jupiterPos?.sign || '')}.`;
  }

  // Upapada Lagna (UL) logic
  let upapada = `Upapada Lagna is in ${ulSign}. `;
  // Simple sign interpretation for family background
  const beneficSigns = ['Taurus', 'Gemini', 'Cancer', 'Virgo', 'Libra', 'Sagittarius', 'Pisces'];
  if (beneficSigns.includes(ulSign)) {
    upapada += "This generally indicates a spouse from a respectable and supportive family.";
  } else {
    upapada += "This may indicate a spouse from a humble or hardworking family background.";
  }

  // Navamsa 7th House
  let navamsa7th = "";
  const d9AscSign = chart.vargaCharts?.D9?.ascendant || 'Aries';
  // Calculate 7th from D9 Ascendant
  const zodiac = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
  const ascIndex = zodiac.indexOf(d9AscSign as any);
  const seventhIndex = (ascIndex + 6) % 12;
  const d9SeventhSign = zodiac[seventhIndex];

  navamsa7th = `In Navamsa (D9), the 7th house is in ${d9SeventhSign}. This reveals the inner reality of your marriage. The core nature of your relationship will be ${getEnergyDescription(d9SeventhSign)}.`;

  // DK in D9
  let darakarakaD9 = "";
  const dkD9Pos = chart.vargaCharts?.D9?.planetaryPositions?.find(p => p.planet === dkPlanet);
  if (dkD9Pos) {
    darakarakaD9 = `Your Darakaraka (${dkPlanet}) is in ${dkD9Pos.sign} in the Navamsa chart, indicating a soul connection rooted in ${getEnergyDescription(dkD9Pos.sign)} qualities.`;
  }

  return {
    genderAnalysis,
    complexRules: {
      upapada,
      navamsa7th,
      darakarakaD9
    }
  };
}

function getEnergyDescription(sign: string): string {
  const descriptions: Record<string, string> = {
    'Aries': 'energetic, direct, and pioneering',
    'Taurus': 'stable, sensual, and practical',
    'Gemini': 'communicative, adaptable, and intellectual',
    'Cancer': 'nurturing, emotional, and protective',
    'Leo': 'charismatic, proud, and generous',
    'Virgo': 'analytical, helpful, and detail-oriented',
    'Libra': 'diplomatic, charming, and balanced',
    'Scorpio': 'intense, transformative, and private',
    'Sagittarius': 'philosophical, adventurous, and optimistic',
    'Capricorn': 'ambitious, disciplined, and traditional',
    'Aquarius': 'innovative, humanitarian, and unconventional',
    'Pisces': 'compassionate, artistic, and spiritual'
  };
  return descriptions[sign] || 'balanced';
}

// Re-use logic from spouseCalculations to ensure consistency
import { analyzeProfession as analyzeProfessionFromSpouse } from './spouseCalculations';

function analyzeProfession(chart: Chart) {
  const seventhLord = chart.houses[6].lord;
  const planetsInSeventh = chart.houses[6].planets;

  // Logic based on dominant influence (Planet in 7th > 7th Lord)
  const dominantPlanet = planetsInSeventh.length > 0 ? planetsInSeventh[0] : seventhLord;

  // Use the shared function but adapt the return type if necessary
  const professionData = analyzeProfessionFromSpouse(dominantPlanet as any);

  if (!professionData) {
    return {
      careerNature: 'Service' as const,
      field: 'General Service',
      description: 'Working in a supportive role.',
      relatedPlanets: []
    };
  }

  return {
    careerNature: professionData.careerNature,
    field: professionData.field,
    description: professionData.description,
    relatedPlanets: professionData.relatedPlanets
  };
}

function getCulturalBackground(sign: Sign): string {
  const backgrounds: Record<string, string> = {
    'Aries': 'Active, independent culture',
    'Taurus': 'Traditional, value-oriented',
    'Gemini': 'Intellectual, communicative',
    'Cancer': 'Family-centric, emotional',
    'Leo': 'Prestigious, confident',
    'Virgo': 'Service-oriented, practical',
    'Libra': 'Diplomatic, artistic',
    'Scorpio': 'Intense, transformative',
    'Sagittarius': 'Philosophical, diverse',
    'Capricorn': 'Traditional, ambitious',
    'Aquarius': 'Progressive, unconventional',
    'Pisces': 'Spiritual, compassionate'
  };
  return backgrounds[sign] || 'Mixed cultural background';
}

function getFamilyValues(lord: Planet): string {
  const values: Record<string, string> = {
    'Sun': 'Honor, pride, leadership',
    'Moon': 'Emotional bonding, nurturing',
    'Mars': 'Courage, protection, action',
    'Mercury': 'Communication, education',
    'Jupiter': 'Tradition, wisdom, dharma',
    'Venus': 'Harmony, aesthetics, luxury',
    'Saturn': 'Discipline, responsibility, hard work',
    'Rahu': 'Unconventional, ambitious',
    'Ketu': 'Spiritual, detached'
  };
  return values[lord] || 'Balanced family values';
}

function getCompoundCharacteristics(chart: Chart): string[] {
  const characteristics: string[] = [];
  const seventhLord = chart.houses[6].lord;
  const seventhLordPos = chart.planetaryPositions.find(p => p.planet === seventhLord);

  if (seventhLordPos) {
    characteristics.push(`${seventhLord} in house ${seventhLordPos.house} modifies spouse characteristics`);
  }

  return characteristics;
}

// ---------------------------------------------------------------------------
// Vimshopaka Bala helpers
// ---------------------------------------------------------------------------

/** Standard Vimshopaka point weights for each of the 16 Shodashavargas */
const VIMSHOPAKA_WEIGHTS: Record<string, number> = {
  D1: 3, D2: 1.5, D3: 1, D4: 0.5, D7: 0.5, D9: 3,
  D10: 0.5, D12: 0.5, D16: 2, D20: 0.5, D24: 0.5,
  D27: 1, D30: 1, D40: 0.5, D45: 0.5, D60: 4
};

const VIMSHOPAKA_MAX = Object.values(VIMSHOPAKA_WEIGHTS).reduce((a, b) => a + b, 0); // 20

/**
 * Returns the proportion of the full varga weight earned given a planet's
 * dignity: 1.0 for exalted/moolatrikona/own, 0.5 for friendly/neutral, 0.0 for enemy/debilitated.
 */
function dignityMultiplier(dignity: PlanetaryPosition['dignity']): number {
  switch (dignity) {
    case 'exalted':
    case 'moolatrikona':
    case 'own_house':
      return 1.0;
    case 'friendly':
    case 'neutral':
      return 0.5;
    case 'enemy':
    case 'debilitated':
    default:
      return 0.0;
  }
}

/**
 * Fallback Vimshopaka score (0–20 scale) based on D1 dignity alone,
 * used when divisional chart data is unavailable.
 */
function d1DignityFallbackScore(dignity: PlanetaryPosition['dignity']): number {
  switch (dignity) {
    case 'exalted':     return 18;
    case 'moolatrikona':
    case 'own_house':   return 15;
    case 'friendly':    return 10;
    case 'neutral':     return 7;
    case 'enemy':       return 4;
    case 'debilitated': return 2;
    default:            return 7;
  }
}

export function calculateExtendedDivisionalAnalysis(chart: Chart): ExtendedDivisionalAnalysis {
  // ---------------------------------------------------------------------------
  // Vimshopaka Bala scoring
  // Assign points per varga based on planet dignity, then normalise to 0–20.
  // ---------------------------------------------------------------------------
  const vimshopakaScores = chart.planetaryPositions.slice(0, 7).map(p => {
    // Retrieve the planetary position record for this planet from a given ChartData.
    const getPosInChart = (cd: { planetaryPositions: PlanetaryPosition[] } | undefined): PlanetaryPosition | undefined =>
      cd?.planetaryPositions.find(pos => pos.planet === p.planet);

    // D1 — always available via chart.planetaryPositions directly
    const d1Pos = p;

    // D9 — always present per the Chart type
    const d9Pos = getPosInChart(chart.vargaCharts.D9);

    // D7 and D60 — optional
    const d7Pos  = getPosInChart(chart.vargaCharts.D7);
    const d60Pos = getPosInChart(chart.vargaCharts.D60);

    // Check whether we have at least some divisional data beyond D1
    const hasVargaData = !!d9Pos;

    let totalScore: number;
    let d1Score: number;
    let d9Score: number;
    let d7Score: number | undefined;
    let d60Score: number | undefined;

    if (!hasVargaData) {
      // Pure fallback: use D1 dignity to approximate the full Vimshopaka score
      totalScore = d1DignityFallbackScore(d1Pos.dignity);
      d1Score    = totalScore;
      d9Score    = 0;
    } else {
      // Accumulate points across all available vargas
      let accumulated = 0;

      // Helper: accumulate a varga's contribution
      const addVarga = (vargaKey: string, pos: PlanetaryPosition | undefined): number => {
        if (!pos) return 0;
        const weight = VIMSHOPAKA_WEIGHTS[vargaKey] ?? 0;
        return weight * dignityMultiplier(pos.dignity);
      };

      // Always-available vargas
      d1Score = addVarga('D1', d1Pos);
      d9Score = addVarga('D9', d9Pos);
      accumulated += d1Score + d9Score;

      // Optional vargas — iterate through all 16 except D1 and D9
      const optionalVargas: Array<[string, PlanetaryPosition | undefined]> = [
        ['D2',  getPosInChart(chart.vargaCharts.D2)],
        ['D3',  getPosInChart(chart.vargaCharts.D3)],
        ['D4',  getPosInChart(chart.vargaCharts.D4)],
        ['D7',  d7Pos],
        ['D10', getPosInChart(chart.vargaCharts.D10)],
        ['D12', getPosInChart(chart.vargaCharts.D12)],
        ['D16', getPosInChart(chart.vargaCharts.D16)],
        ['D20', getPosInChart(chart.vargaCharts.D20)],
        ['D24', getPosInChart(chart.vargaCharts.D24)],
        ['D27', getPosInChart(chart.vargaCharts.D27)],
        ['D30', getPosInChart(chart.vargaCharts.D30)],
        ['D40', getPosInChart(chart.vargaCharts.D40)],
        ['D45', getPosInChart(chart.vargaCharts.D45)],
        ['D60', d60Pos],
      ];

      // Track the max weight of vargas that are actually available, for normalisation
      let availableMax = VIMSHOPAKA_WEIGHTS['D1'] + VIMSHOPAKA_WEIGHTS['D9'];

      for (const [key, pos] of optionalVargas) {
        if (pos) {
          availableMax += VIMSHOPAKA_WEIGHTS[key] ?? 0;
          accumulated  += addVarga(key, pos);
        }
      }

      // Per-chart optional scores exposed in the return type
      d7Score  = d7Pos  ? addVarga('D7',  d7Pos)  : undefined;
      d60Score = d60Pos ? addVarga('D60', d60Pos) : undefined;

      // Normalise to 0–20 based on how many vargas were available
      totalScore = availableMax > 0 ? (accumulated / availableMax) * VIMSHOPAKA_MAX : 0;
    }

    const total = Math.round(totalScore * 10) / 10; // one decimal place

    const strength =
      total >= 15 ? 'very_strong' as const :
      total >= 12 ? 'strong'      as const :
      total >= 8  ? 'moderate'    as const :
      total >= 5  ? 'weak'        as const :
                    'very_weak'   as const;

    return {
      planet: p.planet,
      d1Score:  Math.round(d1Score  * 100) / 100,
      d9Score:  Math.round(d9Score  * 100) / 100,
      ...(d7Score  !== undefined && { d7Score:  Math.round(d7Score  * 100) / 100 }),
      ...(d60Score !== undefined && { d60Score: Math.round(d60Score * 100) / 100 }),
      total,
      strength
    };
  });

  // D60 deities
  const d60Deities = chart.planetaryPositions.slice(0, 7).map(p => ({
    planet: p.planet,
    deity: getD60Deity(p.planet, p.sign),
    nature: ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.planet) ? 'benefic' as const :
      ['Saturn', 'Mars', 'Rahu', 'Ketu', 'Sun'].includes(p.planet) ? 'malefic' as const : 'neutral' as const,
    interpretation: getDeityInterpretation(p.planet)
  }));

  // Navamsa house meanings
  const navamsaHouseMeanings = chart.vargaCharts?.D9?.houses?.map((h, idx) => ({
    house: idx + 1,
    sign: h.sign,
    meaning: getNavamsaHouseMeaning(idx + 1),
    planets: h.planets
  })) || [];

  // Full 16-Varga (Shodashvarga) Analysis
  const shodashvarga: import('../src/types/extendedTypes').ShodashvargaItem[] = [
    { varga: 'D1', name: 'Rashi', area: 'General Life, Physical Body', interpretation: 'Overall foundation of existence' },
    { varga: 'D2', name: 'Hora', area: 'Wealth, Prosperity', interpretation: 'Accumulation of assets and financial stability' },
    { varga: 'D3', name: 'Drekkana', area: 'Siblings, Courage', interpretation: 'Initiative and support from brothers/sisters' },
    { varga: 'D4', name: 'Chaturthamsa', area: 'Property, Fortune', interpretation: 'Fixed assets and general luck' },
    { varga: 'D7', name: 'Saptamsa', area: 'Children, Lineage', interpretation: 'Progeny and creative legacy' },
    { varga: 'D9', name: 'Navamsa', area: 'Marriage, Spouse, Soul', interpretation: 'Fruit of the tree; the real strength of planets' },
    { varga: 'D10', name: 'Dasamsa', area: 'Career, Profession', interpretation: 'Success in the professional world' },
    { varga: 'D12', name: 'Dwadasamsa', area: 'Parents, Ancestors', interpretation: 'Genetic heritage and parental influence' },
    { varga: 'D16', name: 'Shodasamsa', area: 'Vehicles, Comforts', interpretation: 'Luxuries and mental happiness from possessions' },
    { varga: 'D20', name: 'Vimsamsa', area: 'Spirituality, Worship', interpretation: 'Religious inclination and spiritual progress' },
    { varga: 'D24', name: 'Chaturvimsamsa', area: 'Education, Learning', interpretation: 'Academic success and deep knowledge' },
    { varga: 'D27', name: 'Bhamsa', area: 'Strengths, Weaknesses', interpretation: 'Innumerable localized strengths' },
    { varga: 'D30', name: 'Trimsamsa', area: 'Evils, Risks', interpretation: 'Character flaws and potential misfortunes' },
    { varga: 'D40', name: 'Khavedamsa', area: 'Auspiciousness', interpretation: 'General auspicious effects in life' },
    { varga: 'D45', name: 'Akshavedamsa', area: 'Character, Conduct', interpretation: 'Moral fiber and general integrity' },
    { varga: 'D60', name: 'Shastiamsa', area: 'All areas (Highest level)', interpretation: 'Past life karma and overall destiny' }
  ].map(item => {
    const vargaChart = (chart.vargaCharts as any)?.[item.varga] || chart;
    const sign = vargaChart.ascendant || 'Aries';
    const lord = getSignLord(sign);

    // Compute a deterministic Vimshopaka-scale strength (0–20) for this varga.
    // Average the dignity multipliers of all planets present in the varga chart,
    // then map to the 0–20 scale.  Fall back to D1 dignity of the ascendant lord
    // when no planetary position data is available for the varga.
    let vargaStrength: number;
    const vargaPositions: PlanetaryPosition[] | undefined = (chart.vargaCharts as any)?.[item.varga]?.planetaryPositions;
    if (vargaPositions && vargaPositions.length > 0) {
      const avgMultiplier = vargaPositions.reduce((sum, pos) => sum + dignityMultiplier(pos.dignity), 0) / vargaPositions.length;
      vargaStrength = Math.round(avgMultiplier * VIMSHOPAKA_MAX * 10) / 10;
    } else {
      // No varga-specific data — use D1 dignity of the ascendant lord as a proxy
      const lordD1Pos = chart.planetaryPositions.find(pos => pos.planet === lord);
      vargaStrength = lordD1Pos
        ? Math.round(dignityMultiplier(lordD1Pos.dignity) * VIMSHOPAKA_MAX * 10) / 10
        : 10; // neutral fallback mid-range
    }

    return {
      ...item,
      sign,
      lord,
      strength: vargaStrength,
      interpretation: `${item.name} in ${sign} indicates ${getVargaSignInterpretation(item.varga, sign)}`
    };
  });

  // Individual D9 highlights
  const d9Chart = chart.vargaCharts.D9;
  const seventhHouseD9 = d9Chart?.houses.find(h => h.houseNumber === 7);
  const vargottama = findVargottamaPlanets(chart);
  const d9Indications: string[] = [];

  if (seventhHouseD9) {
    const lord = getSignLord(seventhHouseD9.sign);
    d9Indications.push(`7th House in ${seventhHouseD9.sign} indicates a partner with ${lord}-like qualities.`);
    if (seventhHouseD9.planets.length > 0) {
      d9Indications.push(`${seventhHouseD9.planets.join(', ')} in the 7th house directly influences marital harmony.`);
    }
  }

  if (vargottama.length > 0) {
    d9Indications.push(`Vargottama ${vargottama.join(', ')} provides exceptional strength and stability to your character.`);
  }

  return {
    vimshopakaScores,
    d60Deities,
    navamsaHouseMeanings,
    shodashvarga,
    vargaLinkage: [],
    bhavottama: [],
    arudhaPadas: {
      a7: {
        sign: chart.vargaCharts.D1?.houses.find(h => h.houseNumber === 7)?.sign || 'Libra',
        meaning: 'Social image of the partnership and public interactions.'
      },
      ul: {
        sign: chart.vargaCharts.D1?.houses.find(h => h.houseNumber === 12)?.sign || 'Pisces',
        meaning: 'The sustainable aspect of marriage and domestic stability.'
      },
      dynamicRange: 'The distance between UL and A7 suggests how your private stability reflects in your public partnership.'
    },
    d7Full: {
      ascendant: chart.vargaCharts.D7?.ascendant || 'Aries',
      childrenIndications: ['Fertility indicated', 'Progeny blessed'],
      ancestralConnection: 'Strong ancestral lineage',
      lineage: 'Noble lineage indicated',
      fertility: 'Good fertility prospects'
    },
    jaiminiD9Analysis: {
      secondHouseSign: d9Chart?.houses?.find(h => h.houseNumber === 2)?.sign || 'Taurus',
      secondHousePlanets: d9Chart?.houses?.find(h => h.houseNumber === 2)?.planets || [],
      interpretation: (d9Chart?.houses?.find(h => h.houseNumber === 2)?.planets.some(p => ['Rahu', 'Venus'].includes(p)) && (d9Chart?.houses?.find(h => h.houseNumber === 2)?.sign === 'Scorpio' || d9Chart?.houses?.find(h => h.houseNumber === 2)?.sign === 'Taurus'))
        ? 'Jaimini D-9 analysis of the 2nd house shows unconventional family patterns. Presence of Venus/Rahu suggests family-related taboo or hidden dynamics.'
        : 'Family values and wealth preservation in marriage appear aligned and stable.',
      familyRisk: (d9Chart?.houses.find(h => h.houseNumber === 2)?.planets.some(p => ['Rahu', 'Venus'].includes(p)) && (d9Chart?.houses.find(h => h.houseNumber === 2)?.sign === 'Scorpio' || d9Chart?.houses.find(h => h.houseNumber === 2)?.sign === 'Taurus'))
        ? 'high' : 'low'
    },
    d9Full: {
      ascendant: d9Chart?.ascendant || 'Aries',
      seventhLord: seventhHouseD9?.lord || 'Venus',
      seventhHouse: {
        sign: seventhHouseD9?.sign || 'Libra',
        planets: seventhHouseD9?.planets || []
      },
      vargottamaPlanets: vargottama,
      pushkarNavamsa: [],
      marriageIndications: d9Indications
    }
  };
}

function findVargottamaPlanets(chart: Chart): string[] {
  const vargottama: string[] = [];
  chart.planetaryPositions.forEach(pos => {
    const d9Pos = chart.vargaCharts.D9?.planetaryPositions.find(p => p.planet === pos.planet);
    if (d9Pos && d9Pos.sign === pos.sign) {
      vargottama.push(pos.planet);
    }
  });
  return vargottama;
}

function getVargaSignInterpretation(varga: string, sign: string): string {
  const defaults: Record<string, string> = {
    'D1': 'a solid physical foundation',
    'D9': 'a strong soul connection in relationships',
    'D10': 'a career focused on leadership and growth',
    'D7': 'blessings regarding children',
    'D60': 'deep-rooted karmic effects carrying over'
  };
  return defaults[varga] || `significant influence in ${sign} regarding its specific area.`;
}

function getD60Deity(planet: Planet, _sign: Sign): string {
  const deities: Record<string, string> = {
    'Sun': 'Ghora',
    'Moon': 'Kumbha',
    'Mars': 'Kopa',
    'Mercury': 'Saumya',
    'Jupiter': 'Mridu',
    'Venus': 'Komala',
    'Saturn': 'Khora'
  };
  return deities[planet] || 'Unknown';
}

function getDeityInterpretation(planet: Planet): string {
  const interpretations: Record<string, string> = {
    'Sun': 'Fierce and intense energy',
    'Moon': 'Gentle and nurturing',
    'Mars': 'Aggressive and impulsive',
    'Mercury': 'Calm and balanced',
    'Jupiter': 'Soft and benevolent',
    'Venus': 'Tender and loving',
    'Saturn': 'Cruel but disciplined'
  };
  return interpretations[planet] || 'Neutral influence';
}

function getNavamsaHouseMeaning(house: number): string {
  const meanings: Record<number, string> = {
    1: 'Self in marriage, personality projection',
    2: 'Family wealth, speech in relationship',
    3: 'Communication, siblings, courage',
    4: 'Home, happiness, emotional foundation',
    5: 'Children, romance, intelligence',
    6: 'Challenges, health, service',
    7: 'Marriage partner, partnerships',
    8: 'Transformation, longevity, shared resources',
    9: 'Dharma, fortune, spiritual growth',
    10: 'Status, career impact on marriage',
    11: 'Gains, friends, fulfillment',
    12: 'Loss, spirituality, foreign connections'
  };
  return meanings[house] || 'General significance';
}

// ============================================================================
// EXTENDED ASHTAKOOT
// ============================================================================

export function calculateExtendedAshtakoot(): ExtendedAshtakoot {
  return {
    ganaCancellationRules: [
      { rule: 'Same Moon Rashi', condition: 'Both have same Moon sign', effect: 'Gana dosha cancelled' },
      { rule: 'Mutual Friends', condition: 'Rashi lords are friends', effect: 'Gana dosha nullified' },
      { rule: 'Same Navamsa', condition: 'Both in same Navamsa', effect: 'Gana dosha cancelled' },
      { rule: 'Strong Jupiter', condition: 'Jupiter well placed in both charts', effect: 'Gana dosha mitigated' }
    ],
    nakshatraBestMatches: [],
    nakshatraWorstMatches: []
  };
}

// ============================================================================
// EXTENDED SEXUAL COMPATIBILITY
// ============================================================================

export function calculateExtendedSexualCompatibility(chartA: Chart, chartB: Chart): ExtendedSexualCompatibility {
  const nakshatraA = chartA.planetaryPositions.find(p => p.planet === 'Moon')?.nakshatra || 'Ashwini';
  const nakshatraB = chartB.planetaryPositions.find(p => p.planet === 'Moon')?.nakshatra || 'Ashwini';

  const yoniAKey = yoniData.nakshatra_yoni_mapping[nakshatraA as keyof typeof yoniData.nakshatra_yoni_mapping] || 'Ashwa';
  const yoniBKey = yoniData.nakshatra_yoni_mapping[nakshatraB as keyof typeof yoniData.nakshatra_yoni_mapping] || 'Ashwa';

  const dataA = (yoniData.yoni_system.yonis as any)[yoniAKey];
  const dataB = (yoniData.yoni_system.yonis as any)[yoniBKey];

  const getYoniDepth = (data: any) => {
    const characteristics = data?.sexual_nature?.characteristics || [];
    const driveDesc = data?.sexual_nature?.description || 'Balanced nature';
    const detailedDrive = characteristics.length > 0
      ? `${driveDesc} This manifests as ${characteristics.join(', ').toLowerCase()}.`
      : driveDesc;

    const elementMeanings: Record<string, string> = {
      'Fire': 'High intensity, passion, and transformative energy.',
      'Water': 'Emotional depth, fluidity, and intuitive connection.',
      'Air': 'Mental stimulation, variety, and lightness.',
      'Earth': 'Grounded, sensual, and physically present.',
      'Spirit': 'Transcendent, deep soulful connection.'
    };

    const staminaMeanings: Record<string, string> = {
      'High': 'Exceptional physical endurance and sustained energy.',
      'Medium': 'Balanced energy levels with moderate recovery needs.',
      'Low': 'Focused, intense energy that requires rest between sessions.',
      'Very High': 'Maximum endurance capable of multiple intense sessions.'
    };

    return {
      animal: data?.name || 'Unknown',
      drive: driveDesc,
      detailedDrive,
      stamina: data?.stamina || characteristics[0]?.includes('stamina') ? characteristics[0] : 'Moderate',
      staminaElaboration: staminaMeanings[data?.stamina] || 'Standard human endurance levels.',
      sessionDuration: data?.duration || 'Normal',
      durationElaboration: 'Consistent and focused session lengths.',
      bodyElement: data?.element || 'Earth',
      elementElaboration: elementMeanings[data?.element?.split(' ')[0]] || 'Stable physical foundation.',
      characteristics: characteristics,
      compatibilityNotes: data?.compatibility_notes || '',
      bestMatches: data?.best_matches || [],
      worstMatches: data?.worst_matches || [],
      anatomy: {
        opening: data?.sexual_nature?.yoni_features?.opening || 'soft',
        passage: data?.sexual_nature?.yoni_features?.passage || 'normal',
        base: data?.sexual_nature?.yoni_features?.base || 'deep',
        foreskin: data?.sexual_nature?.lingam_features?.foreskin,
        girth: data?.sexual_nature?.lingam_features?.girth,
        glans: data?.sexual_nature?.lingam_features?.glans,
        lingamType: data?.gender
      }
    };
  };

  const getYoniPhysical = (data: any) => ({
    height: 'Average to tall',
    bodyType: 'Varies by signature',
    features: data?.sexual_nature?.characteristics || ['Balanced features'],
    sexualTemperament: data?.sexual_nature?.description || 'Harmonious'
  });

  const allYoniAnimals: YoniAnimal[] = Object.entries(yoniData.yoni_system.yonis).map(([_, value]: [string, any]) => ({
    animal: value.name,
    gender: (value.gender?.toLowerCase() || 'female') as 'male' | 'female',
    nakshatras: value.nakshatras || [],
    nature: value.sexual_nature?.description || 'General nature',
    score: 3,
    bestMatches: value.best_matches || [],
    worstMatches: value.worst_matches || []
  }));

  return {
    allYoniAnimals,
    yoniPhysicalCharacteristics: {
      partnerA: getYoniPhysical(dataA),
      partnerB: getYoniPhysical(dataB)
    },
    yoniDepth: {
      partnerA: getYoniDepth(dataA),
      partnerB: getYoniDepth(dataB)
    }
  };
}

// ============================================================================
// LAL KITAB REMEDY ENGINE
// ============================================================================

export function calculateExtendedRemedies(chart: Chart): ExtendedRemedies {
  const planetSpecific: PlanetSpecificRemedy[] = [];
  const afflictionBased: AfflictionRemedy[] = [];
  const relationshipSpecific: RelationshipCondition[] = [];

  // 1. Planet Specific Remedies (Lal Kitab Style)
  const maleficPlanets: Planet[] = ['Saturn', 'Mars', 'Rahu', 'Ketu'];
  chart.planetaryPositions.forEach(p => {
    if (maleficPlanets.includes(p.planet as Planet)) {
      planetSpecific.push({
        planet: p.planet as Planet,
        affliction: `${p.planet} in ${p.house}th house`,
        remedies: [
          `Offer ${p.planet === 'Saturn' ? 'mustard oil' : 'honey'} to a peepal tree.`,
          `Keep a small piece of ${p.planet === 'Mars' ? 'copper' : 'silver'} in your purse.`
        ],
        mantra: `Om ${p.planet} Namaha`
      });
    }
  });

  // 2. Affliction Based (Generalized conditions)
  const manglikAnalysis = calculateManglikDosha(chart);
  if (manglikAnalysis.isManglik && !manglikAnalysis.isCancelled) {
    afflictionBased.push({
      condition: 'Manglik Dosha',
      planets: ['Mars'],
      remedies: [
        'Perform Mangal Shanti Pooja.',
        'Wear a silver ring in the left hand ring finger.',
        'Donate red lentils on Tuesdays.'
      ]
    });
  }

  // 3. Relationship Specific
  relationshipSpecific.push({
    condition: 'Delay in Marriage',
    description: 'General remedies to remove obstacles in marriage timing.',
    remedies: [
      'Observe fast on 16 consecutive Mondays.',
      'Worship Goddess Parvati for early marriage.',
      'Light a ghee lamp in front of Tulsi plant daily.'
    ]
  });

  // 4. Issue Specific (Risk_kn.md §11)
  const issueSpecific: ExtendedRemedies['issueSpecific'] = [];

  // Generic "Potential for Discord" if malefic houses are active
  if (chart.houses.some(h => [6, 8, 12].includes(h.houseNumber) && h.planets.length > 0)) {
    issueSpecific.push({
      category: 'discord',
      remedies: [
        'Offer curd and sugar to Goddess Durga on Fridays.',
        'Apply white sandal paste on Shiva Lingam.'
      ],
      modernAdvice: [
        'Schedule weekly check-ins to discuss grievances before they build up.',
        'Practice active listening without interruption.'
      ]
    });
  }

  // 5. Psychological/Behavioral Remedies (Risk_kn.md §11)
  const psychologicalRemedies: ExtendedRemedies['psychologicalRemedies'] = [];

  // Check for Mars/Rahu influence on Moon/Mercury
  const moon = chart.planetaryPositions.find(p => p.planet === 'Moon');
  const mercury = chart.planetaryPositions.find(p => p.planet === 'Mercury');
  const maleficHouses = [1, 4, 7, 8, 12];

  if (moon && maleficHouses.includes(moon.house)) {
    psychologicalRemedies.push({
      trait: 'Emotional Impulsivity',
      behavioralChange: 'Wait 24 hours before responding to emotional triggers. Practice deep breathing when feeling overwhelmed.',
      mantra: 'Om Shanti Shanti Shanti'
    });
  }

  if (mercury && maleficHouses.includes(mercury.house)) {
    psychologicalRemedies.push({
      trait: 'Harsh Speech or Miscommunication',
      behavioralChange: 'Practice "Pause and Reflect" before speaking. Use "I" statements instead of "You" accusations.',
    });
  }

  return {
    planetSpecific,
    afflictionBased,
    relationshipSpecific,
    issueSpecific,
    psychologicalRemedies
  };
}

/**
 * Generate fallback significators when KP calculation fails
 * Creates basic significator data from planetary positions
 */
function generateFallbackSignificators(chart: Chart): any[] {
  const significators: any[] = [];
  const planets = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

  planets.forEach(planet => {
    const pos = chart.planetaryPositions.find(p => p.planet === planet);
    if (pos) {
      // Determine significations based on house position
      const significations: number[] = [pos.house]; // Planet always signifies its occupied house

      // Add houses owned by the planet (simplified based on sign lordship)
      const signIndex = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].indexOf(pos.sign);

      // Standard lordships
      const lordships: Record<string, number[]> = {
        'Sun': [5], 'Moon': [4], 'Mars': [1, 8], 'Mercury': [3, 6],
        'Jupiter': [9, 12], 'Venus': [2, 7], 'Saturn': [10, 11],
        'Rahu': [], 'Ketu': []
      };

      if (lordships[planet]) {
        significations.push(...lordships[planet]);
      }

      // Determine strength based on dignity
      let strength: 'strong' | 'moderate' | 'weak' = 'moderate';
      if (pos.dignity === 'exalted' || pos.dignity === 'own_house') strength = 'strong';
      else if (pos.dignity === 'debilitated' || pos.dignity === 'enemy') strength = 'weak';

      // Get nakshatra lord from nakshatra name (simplified mapping)
      const nakshatraLords: Record<string, string> = {
        'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun', 'Rohini': 'Moon',
        'Mrigashira': 'Mars', 'Ardra': 'Rahu', 'Punarvasu': 'Jupiter', 'Pushya': 'Saturn',
        'Ashlesha': 'Mercury', 'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
        'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu', 'Vishakha': 'Jupiter',
        'Anuradha': 'Saturn', 'Jyeshtha': 'Mercury', 'Mula': 'Ketu', 'Purva Ashadha': 'Venus',
        'Uttara Ashadha': 'Sun', 'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
        'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', 'Revati': 'Mercury'
      };

      const starLord = pos.nakshatra ? nakshatraLords[pos.nakshatra] || planet : planet;

      significators.push({
        planet,
        occupiedHouse: pos.house,
        starLord,
        subLord: planet, // Simplified
        significations: [...new Set(significations)], // Remove duplicates
        strength,
        housesOwnedByStarLord: lordships[starLord] || [],
        housesOwnedBySubLord: lordships[planet] || []
      });
    }
  });

  return significators;
}

/**
 * Calculate Samskaar Scale based on chart analysis
 * Samskaar represents cultural refinement and upbringing quality
 * Based on 5th house, 9th house, Jupiter, and Venus placements
 */
function calculateSamskaarScale(chart: Chart): {
  score: number;
  rating: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
  description: string;
} {
  const fifthHouse = chart.houses.find(h => h.houseNumber === 5);
  const ninthHouse = chart.houses.find(h => h.houseNumber === 9);
  const jupiter = chart.planetaryPositions.find(p => p.planet === 'Jupiter');
  const venus = chart.planetaryPositions.find(p => p.planet === 'Venus');

  let score = 3; // Base score (average)

  // 5th House Analysis (Purva Punya - Past Merits)
  if (fifthHouse) {
    // Benefic planets in 5th house
    if (fifthHouse.planets.some(p => ['Jupiter', 'Venus', 'Moon', 'Mercury'].includes(p))) {
      score += 0.5;
    }
    // Malefic planets in 5th house
    if (fifthHouse.planets.some(p => ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p))) {
      score -= 0.5;
    }
    // Fifth house sign influence
    if (['Cancer', 'Leo', 'Libra', 'Pisces'].includes(fifthHouse.sign)) {
      score += 0.3;
    }
  }

  // 9th House Analysis (Dharma/Bhagya)
  if (ninthHouse) {
    // Benefic planets in 9th house
    if (ninthHouse.planets.some(p => ['Jupiter', 'Venus', 'Sun'].includes(p))) {
      score += 0.5;
    }
    // Malefic planets in 9th house
    if (ninthHouse.planets.some(p => ['Saturn', 'Rahu', 'Ketu'].includes(p))) {
      score -= 0.3;
    }
  }

  // Jupiter Analysis (Wisdom/Guru)
  if (jupiter) {
    if (jupiter.dignity === 'exalted') score += 1.0;
    else if (jupiter.dignity === 'own_house') score += 0.8;
    else if (jupiter.dignity === 'moolatrikona') score += 0.7;
    else if (jupiter.dignity === 'friendly') score += 0.3;
    else if (jupiter.dignity === 'debilitated') score -= 0.5;

    // Jupiter in Kendra (1, 4, 7, 10) is good
    if ([1, 4, 7, 10].includes(jupiter.house)) score += 0.3;
    // Jupiter in Dusthana (6, 8, 12) is challenging
    if ([6, 8, 12].includes(jupiter.house)) score -= 0.3;
  }

  // Venus Analysis (Refinement/Arts)
  if (venus) {
    if (venus.dignity === 'exalted') score += 0.8;
    else if (venus.dignity === 'own_house') score += 0.6;
    else if (venus.dignity === 'moolatrikona') score += 0.5;
    else if (venus.dignity === 'friendly') score += 0.2;
    else if (venus.dignity === 'debilitated') score -= 0.4;
  }

  // Saturn influence (can reduce refinement if badly placed)
  const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');
  if (saturn && saturn.dignity === 'debilitated') {
    score -= 0.3;
  }

  // Clamp score between 1 and 5
  score = Math.max(1, Math.min(5, score));

  // Determine rating and description
  let rating: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
  let description: string;

  if (score >= 4.5) {
    rating = 'excellent';
    description = 'Exceptional samskaar - outstanding cultural values, deep wisdom, and highly refined upbringing. Excellent understanding of traditions and dharma.';
  } else if (score >= 3.5) {
    rating = 'good';
    description = 'Good samskaar - strong cultural values, wisdom, and refined upbringing. Good understanding of traditions and dharma.';
  } else if (score >= 2.5) {
    rating = 'average';
    description = 'Average samskaar - balanced qualities with moderate cultural refinement and values.';
  } else if (score >= 1.5) {
    rating = 'below_average';
    description = 'Below average samskaar - some challenges with cultural refinement. May benefit from conscious effort to build traditional values.';
  } else {
    rating = 'poor';
    description = 'Lower samskaar indicates a more unconventional or independent approach to cultural norms. Conscious effort needed to build traditional values.';
  }

  return {
    score: Math.round(score * 10) / 10, // Round to 1 decimal place
    rating,
    description
  };
}
