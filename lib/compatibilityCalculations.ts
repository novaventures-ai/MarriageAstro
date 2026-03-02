/**
 * Compatibility Calculation Engine
 * Phase 2.5: Ashtakoot, Navamsa, Synastry, Sexual Compatibility
 * Enhanced with aaps.space knowledge: Yoni, Spouse Indicators, Divisional Charts
 */

import {
  Chart,
  AshtakootResult,
  AshtakootParameter,
  NavamsaMatching,
  SexualCompatibility,
  SpousePrediction,
  DivisionalChartAnalysis,
  Nakshatra,
  Sign,
  Planet,
  PlanetaryPosition
} from '@types';
import {
  SIGNS,
  NAKSHATRAS,
  PLANET_FRIENDSHIP,
  NADI_TYPES,
  GANA_TYPES,
  VARNA_GROUPS,
  VASHYA_GROUPS,
  YONI_BITTER_ENEMIES,
  SIGN_LORDS,
  getSignLord,
  areFriends,
  getVashya
} from './coreCalculations';

// Import comprehensive knowledge bases
import yoniData from '../knowledge/yoni_sexual_compatibility.json';
import spouseData from '../knowledge/spouse_indicators.json';
import nakshatraCompatData from '../knowledge/nakshatra_compatibility.json';

// ============================================================================
// ASHTAKOOT MILAN (36 POINTS)
// ============================================================================

// VARNA_GROUPS and VASHYA_GROUPS imported from coreCalculations.ts as single source of truth

// NADI_TYPES and GANA_TYPES imported from coreCalculations.ts — single source of truth

/**
 * Calculate complete Ashtakoot Milan
 */
export function calculateAshtakootMilan(chartA: Chart, chartB: Chart): AshtakootResult {
  // Get Moon positions
  const moonA = chartA.planetaryPositions.find(p => p.planet === 'Moon');
  const moonB = chartB.planetaryPositions.find(p => p.planet === 'Moon');

  if (!moonA || !moonB) {
    throw new Error('Moon position not found in one or both charts');
  }

  const moonSignA = moonA.sign;
  const moonSignB = moonB.sign;
  const moonNakshatraA = moonA.nakshatra;
  const moonNakshatraB = moonB.nakshatra;

  // Calculate all 8 parameters
  const varna = calculateVarna(moonSignA, moonSignB);
  const vashya = calculateVashya(moonSignA, moonSignB);
  const tara = calculateTara(moonNakshatraA, moonNakshatraB);
  const yoni = calculateYoni(moonNakshatraA, moonNakshatraB);
  const grahaMaitri = calculateGrahaMaitri(moonSignA, moonSignB);
  const gana = calculateGana(moonNakshatraA, moonNakshatraB);
  const bhakoot = calculateBhakoot(moonSignA, moonSignB);
  const nadi = calculateNadi(moonNakshatraA, moonNakshatraB);

  const totalScore = varna.pointsObtained + vashya.pointsObtained + tara.pointsObtained +
    yoni.pointsObtained + grahaMaitri.pointsObtained + gana.pointsObtained +
    bhakoot.pointsObtained + nadi.pointsObtained;

  const maxScore = 36;
  const percentage = (totalScore / maxScore) * 100;

  // Check doshas
  const nadiDosha = nadi.pointsObtained === 0;
  const bhakootDosha = bhakoot.pointsObtained === 0;
  const ganaDosha = gana.pointsObtained <= 1;

  // Check exceptions
  const exceptions: string[] = [];

  // Nadi cancellation
  if (nadiDosha && checkNadiCancellation(moonNakshatraA, moonNakshatraB, moonSignA, moonSignB)) {
    exceptions.push('Nadi Dosha cancelled: Based on specific planetary friendship or nakshatra exceptions');
  }

  // Bhakoot cancellation
  if (bhakootDosha && checkBhakootCancellation(moonSignA, moonSignB)) {
    exceptions.push('Bhakoot Dosha cancelled: Moon sign lords are same or highly friendly');
  }

  // Gana cancellation
  if (ganaDosha && checkGanaCancellation(moonSignA, moonSignB)) {
    exceptions.push('Gana Dosha cancelled: Rashi lords friendship or strong planetary placement mitigates clash');
  }

  // Manglik Check
  const manglikA = calculateManglikDosha(chartA);
  const manglikB = calculateManglikDosha(chartB);

  return {
    totalScore,
    maxScore,
    percentage,
    parameters: { varna, vashya, tara, yoni, grahaMaitri, gana, bhakoot, nadi },
    exceptions,
    doshas: {
      nadiDosha: nadiDosha && !checkNadiCancellation(moonNakshatraA, moonNakshatraB, moonSignA, moonSignB),
      bhakootDosha: bhakootDosha && !checkBhakootCancellation(moonSignA, moonSignB),
      ganaDosha: ganaDosha && !checkGanaCancellation(moonSignA, moonSignB)
    },
    manglikAnalysis: {
      partnerA: manglikA,
      partnerB: manglikB,
      compatibility: (() => {
        if (manglikA.isManglik === manglikB.isManglik) return 'High (Balanced)';
        if ((manglikA.isManglik && manglikA.isCancelled) || (manglikB.isManglik && manglikB.isCancelled)) return 'Moderate (Dosha Cancelled)';
        return 'Low (Potential Clash)';
      })()
    }
  };
}

function calculateVarna(signA: string, signB: string): AshtakootParameter {
  const getVarna = (sign: string) => {
    for (const [varna, signs] of Object.entries(VARNA_GROUPS)) {
      if ((signs as string[]).includes(sign)) return varna;
    }
    return 'Shudra';
  };

  const varnaA = getVarna(signA as Sign);
  const varnaB = getVarna(signB as Sign);

  const varnaHierarchy = ['Shudra', 'Vaishya', 'Kshatriya', 'Brahmin'];
  const rankA = varnaHierarchy.indexOf(varnaA);
  const rankB = varnaHierarchy.indexOf(varnaB);

  const points = rankB <= rankA ? 1 : 0;

  return {
    name: 'Varna',
    boyValue: varnaA,
    girlValue: varnaB,
    pointsObtained: points,
    maxPoints: 1,
    interpretation: points === 1 ? 'Compatible varna' : 'Varna mismatch'
  };
}

function calculateVashya(signA: string, signB: string): AshtakootParameter {
  const vashyaA = getVashya(signA as Sign); // Returns array
  const vashyaB = getVashya(signB as Sign); // Returns array

  let points = 0;
  // If they share any vashya group, they get 2 points
  if (vashyaA.some((g: string) => vashyaB.includes(g))) {
    points = 2;
  } else if (
    (vashyaA.includes('Manava') && vashyaB.includes('Chatushpada')) ||
    (vashyaA.includes('Chatushpada') && vashyaB.includes('Manava'))
  ) {
    points = 1;
  }

  return {
    name: 'Vashya',
    boyValue: vashyaA.join(', '),
    girlValue: vashyaB.join(', '),
    pointsObtained: points,
    maxPoints: 2,
    interpretation: points === 2 ? 'Strong mutual attraction' : points === 1 ? 'Moderate attraction' : 'Different natures'
  };
}

function calculateTara(nakshatraA: Nakshatra, nakshatraB: Nakshatra): AshtakootParameter {
  const indexA = NAKSHATRAS.indexOf(nakshatraA);
  const indexB = NAKSHATRAS.indexOf(nakshatraB);

  // Tara counts both ways
  const countAB = ((indexB - indexA + 27) % 27) + 1;
  const countBA = ((indexA - indexB + 27) % 27) + 1;

  const getTaraScore = (count: number) => {
    const rem = count % 9;
    // Remainder 1 (Janm), 3 (Vipat), 5 (Pratyak), 7 (Vadh) are bad
    return [1, 3, 5, 7].includes(rem) ? 0 : 1.5;
  };

  const points = getTaraScore(countAB) + getTaraScore(countBA);

  return {
    name: 'Tara',
    boyValue: nakshatraA,
    girlValue: nakshatraB,
    pointsObtained: points,
    maxPoints: 3,
    interpretation: points >= 3 ? 'Auspicious destiny' : points >= 1.5 ? 'Moderate destiny' : 'Challenging destiny'
  };
}

function calculateYoni(nakshatraA: Nakshatra, nakshatraB: Nakshatra): AshtakootParameter {
  const metaA = getNakshatraMetadata(nakshatraA);
  const metaB = getNakshatraMetadata(nakshatraB);

  const yoniA = metaA.yoni;
  const yoniB = metaB.yoni;

  // Standard Yoni Matrix scoring (0-4)
  // 4: Swabhav (Same), 3: Friend, 2: Neutral, 1: Enemy, 0: Bitter Enemy
  let points = 2; // Default Neutral

  if (yoniA === yoniB) {
    points = 4;
  } else if (YONI_BITTER_ENEMIES[yoniA] === yoniB || YONI_BITTER_ENEMIES[yoniB] === yoniA) {
    points = 0;
  } else {
    // Check for friendship/enmities based on animal type
    // Simplified for now but much better than modulo 2
    const friends = ['Ashwa', 'Gaja', 'Mriga', 'Vanar', 'Sarpa'];
    if (friends.includes(yoniA) && friends.includes(yoniB)) points = 3;
    else points = 2;
  }

  return {
    name: 'Yoni',
    boyValue: yoniA,
    girlValue: yoniB,
    pointsObtained: points,
    maxPoints: 4,
    interpretation: points === 4 ? 'Sexual union' : points >= 3 ? 'Physical harmony' : points >= 2 ? 'Average attraction' : 'Physical friction'
  };
}

function calculateGrahaMaitri(signA: string, signB: string): AshtakootParameter {
  const lordA = getSignLord(signA);
  const lordB = getSignLord(signB);

  const getRelationship = (p1: string, p2: string): 'Friend' | 'Neutral' | 'Enemy' => {
    if (p1 === p2) return 'Friend';
    const friendship = PLANET_FRIENDSHIP[p1];
    if (friendship?.friends.includes(p2)) return 'Friend';
    if (friendship?.enemies.includes(p2)) return 'Enemy';
    return 'Neutral';
  };

  const rel1 = getRelationship(lordA, lordB);
  const rel2 = getRelationship(lordB, lordA);

  let points = 0;
  if (rel1 === 'Friend' && rel2 === 'Friend') points = 5;
  else if ((rel1 === 'Friend' && rel2 === 'Neutral') || (rel1 === 'Neutral' && rel2 === 'Friend')) points = 4;
  else if (rel1 === 'Neutral' && rel2 === 'Neutral') points = 3;
  else if ((rel1 === 'Friend' && rel2 === 'Enemy') || (rel1 === 'Enemy' && rel2 === 'Friend')) points = 1;
  else if ((rel1 === 'Neutral' && rel2 === 'Enemy') || (rel1 === 'Enemy' && rel2 === 'Neutral')) points = 0.5;
  else points = 0;

  return {
    name: 'Graha Maitri',
    boyValue: lordA,
    girlValue: lordB,
    pointsObtained: points,
    maxPoints: 5,
    interpretation: points >= 4 ? 'Natural friendship' : points >= 3 ? 'Neutral agreement' : 'Planetary tension'
  };
}

function calculateGana(nakshatraA: Nakshatra, nakshatraB: Nakshatra): AshtakootParameter {
  const getGana = (nakshatra: Nakshatra) => {
    for (const [gana, nakshatras] of Object.entries(GANA_TYPES)) {
      if (nakshatras.includes(nakshatra)) return gana;
    }
    return 'Manushya';
  };

  const ganaA = getGana(nakshatraA);
  const ganaB = getGana(nakshatraB);

  const scoreMap: Record<string, Record<string, number>> = {
    'Deva': { 'Deva': 6, 'Manushya': 6, 'Rakshasa': 1 },
    'Manushya': { 'Deva': 5, 'Manushya': 6, 'Rakshasa': 0 },
    'Rakshasa': { 'Deva': 0, 'Manushya': 0, 'Rakshasa': 6 }
  };

  const points = scoreMap[ganaA]?.[ganaB] ?? 3;

  return {
    name: 'Gana',
    boyValue: ganaA,
    girlValue: ganaB,
    pointsObtained: points,
    maxPoints: 6,
    interpretation: points >= 5 ? 'Compatible temperament' : points >= 3 ? 'Manageable differences' : 'Major temperament clash'
  };
}

function calculateBhakoot(signA: string, signB: string): AshtakootParameter {
  const indexA = SIGNS.indexOf(signA as any);
  const indexB = SIGNS.indexOf(signB as any);

  // Distance from Boy to Girl (1-12)
  const dist = ((indexB - indexA + 12) % 12) + 1;

  // Inauspicious positions: 2/12, 5/9, 6/8
  // dist 2 means 2/12. dist 12 means 12/2.
  // dist 5 means 5/9. dist 9 means 9/5.
  // dist 6 means 6/8. dist 8 means 8/6.
  const badPositions = [2, 12, 5, 9, 6, 8];

  const points = badPositions.includes(dist) ? 0 : 7;

  return {
    name: 'Bhakoot',
    boyValue: signA,
    girlValue: signB,
    pointsObtained: points,
    maxPoints: 7,
    interpretation: points === 7 ? 'Compatible relative positions' : 'Inauspicious relative positions (Bhakoot Dosha)'
  };
}

function calculateNadi(nakshatraA: Nakshatra, nakshatraB: Nakshatra): AshtakootParameter {
  const getNadi = (nakshatra: Nakshatra) => {
    for (const [nadi, nakshatras] of Object.entries(NADI_TYPES)) {
      if (nakshatras.includes(nakshatra)) return nadi;
    }
    return 'Adi';
  };

  const nadiA = getNadi(nakshatraA);
  const nadiB = getNadi(nakshatraB);

  const points = nadiA === nadiB ? 0 : 8;

  return {
    name: 'Nadi',
    boyValue: nadiA,
    girlValue: nadiB,
    pointsObtained: points,
    maxPoints: 8,
    interpretation: points === 8 ? 'Different constitutions - healthy' : 'Same constitution - health risks'
  };
}

// ============================================================================
// CANCELLATION RULES
// ============================================================================

// ============================================================================
// CANCELLATION RULES & DOSHA ASSESSMENT
// ============================================================================

export function calculateManglikDosha(chart: Chart, otherChart?: Chart): {
  isManglik: boolean;
  score: number;
  isCancelled: boolean;
  cancellationReasons: string[];
} {
  const mars = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Mars');
  if (!mars) return { isManglik: false, score: 0, isCancelled: false, cancellationReasons: [] };

  const manglikHouses = [1, 2, 4, 7, 8, 12];
  const house = mars.house;
  const isManglik = manglikHouses.includes(house);

  if (!isManglik) return { isManglik: false, score: 0, isCancelled: false, cancellationReasons: [] };

  const cancellationReasons: string[] = [];

  // Rule 1: Mars in Aries/Scorpio/Capricorn (Strong Mars)
  if (['Aries', 'Scorpio', 'Capricorn'].includes(mars.sign)) {
    cancellationReasons.push(`Mars is in its own or exaltation sign (${mars.sign})`);
  }

  // Rule 2: Jupiter aspecting Mars
  const jupiter = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Jupiter');
  if (jupiter) {
    const dist = (mars.house - jupiter.house + 12) % 12;
    if ([0, 4, 6, 8].includes(dist)) { // 1st, 5th, 7th, 9th aspects
      cancellationReasons.push("Jupiter aspects Mars, neutralizing effects");
    }
  }

  // Rule 3: Mars in 2nd for specific signs
  if (house === 2 && ['Virgo', 'Gemini'].includes(mars.sign)) {
    cancellationReasons.push("Mars in 2nd in Mercury's sign cancels dosha");
  }

  // Rule 4: Mars in 12th for specific signs
  if (house === 12 && ['Sagittarius', 'Pisces', 'Taurus', 'Libra'].includes(mars.sign)) {
    cancellationReasons.push("Mars in 12th in own/friendly sign cancels dosha");
  }

  // Rule 5: Complex Sign Exceptions (Traditional)
  if (house === 4 && mars.sign === 'Aries') cancellationReasons.push("Mars in 4th in Aries cancels dosha");
  if (house === 7 && mars.sign === 'Leo') cancellationReasons.push("Mars in 7th in Leo cancels dosha");
  if (house === 8 && mars.sign === 'Aquarius') cancellationReasons.push("Mars in 8th in Aquarius cancels dosha");

  // Rule 6: Mitigation by other chart (if provided)
  if (otherChart) {
    const otherMars = otherChart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Mars');
    const otherSaturn = otherChart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Saturn');
    const otherRahu = otherChart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Rahu');
    const otherKetu = otherChart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Ketu');

    if (otherMars && manglikHouses.includes(otherMars.house)) {
      cancellationReasons.push("Mutual Manglik alignment (Both partners are Manglik)");
    }
    if (otherSaturn && manglikHouses.includes(otherSaturn.house)) {
      cancellationReasons.push("Saturn in Manglik house of partner mitigates Mars energy");
    }
    if ((otherRahu && manglikHouses.includes(otherRahu.house)) || (otherKetu && manglikHouses.includes(otherKetu.house))) {
      cancellationReasons.push("Rahu/Ketu in partner's Manglik house provides balance");
    }
  }

  return {
    isManglik: true,
    score: cancellationReasons.length > 0 ? 0 : 1, // Final decision: Fully cancelled if reasons found
    isCancelled: cancellationReasons.length > 0,
    cancellationReasons
  };
}

export function checkNadiCancellation(
  nakshatraA: Nakshatra,
  nakshatraB: Nakshatra,
  signA: Sign,
  signB: Sign,
  chartA?: Chart,
  chartB?: Chart
): boolean {
  // Rule 1: Same rashi different nakshatra
  if (signA === signB && nakshatraA !== nakshatraB) return true;

  // Rule 2: Same nakshatra different rashi (Charan diff)
  if (nakshatraA === nakshatraB && signA !== signB) return true;

  // Rule 3: Exception nakshatras - Comprehensive traditional list
  const exceptionNakshatras = [
    'Rohini', 'Ardra', 'Punarvasu', 'Vishakha', 'Shravana', 'Revati',
    'Mrigashirsha', 'Hasta', 'Pushya', 'Anuradha', 'Ashwini', 'Krittika'
  ];
  if (exceptionNakshatras.includes(nakshatraA) && exceptionNakshatras.includes(nakshatraB)) {
    return true;
  }

  // Rule 4: Same Lord
  const metaA = getNakshatraMetadata(nakshatraA);
  const metaB = getNakshatraMetadata(nakshatraB);
  if (metaA.lord === metaB.lord && signA !== signB) return true;

  // Rule 5: Friendly Rashi Lords
  const lordA = getSignLord(signA);
  const lordB = getSignLord(signB);
  if (areFriends(lordA, lordB) && signA !== signB) return true;

  // Rule 6: Navamsa Matching
  if (chartA && chartB) {
    const navA = chartA.vargaCharts.D9.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon');
    const navB = chartB.vargaCharts.D9.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon');
    if (navA && navB && navA.sign === navB.sign) return true;
  }

  return false;
}

export function checkBhakootCancellation(signA: string, signB: string): boolean {
  const lordA = getSignLord(signA);
  const lordB = getSignLord(signB);

  // Rule 1: Same rashi lords
  if (lordA === lordB) return true;

  // Rule 2: Friendly lords
  const friends: Record<string, string[]> = {
    'Sun': ['Moon', 'Mars', 'Jupiter'],
    'Moon': ['Sun', 'Mercury'],
    'Mars': ['Sun', 'Moon', 'Jupiter'],
    'Mercury': ['Sun', 'Venus'],
    'Jupiter': ['Sun', 'Moon', 'Mars'],
    'Venus': ['Mercury', 'Saturn'],
    'Saturn': ['Mercury', 'Venus']
  };

  if (friends[lordA]?.includes(lordB) && friends[lordB]?.includes(lordA)) return true;

  // Rule 3: Specific Rashi Pairs (Aries-Scorpio, Taurus-Libra, Capricorn-Aquarius)
  const pairs = [['Aries', 'Scorpio'], ['Taurus', 'Libra'], ['Capricorn', 'Aquarius']];
  if (pairs.some(p => p.includes(signA) && p.includes(signB))) return true;

  return false;
}

export function checkGanaCancellation(signA: string, signB: string): boolean {
  // If rashi lords are friendly or same
  const lordA = getSignLord(signA);
  const lordB = getSignLord(signB);

  if (lordA === lordB) return true;

  const friends: Record<string, string[]> = {
    'Sun': ['Moon', 'Mars', 'Jupiter'],
    'Moon': ['Sun', 'Mercury'],
    'Mars': ['Sun', 'Moon', 'Jupiter'],
    'Mercury': ['Sun', 'Venus'],
    'Jupiter': ['Sun', 'Moon', 'Mars'],
    'Venus': ['Mercury', 'Saturn'],
    'Saturn': ['Mercury', 'Venus']
  };

  return (friends[lordA]?.includes(lordB) && friends[lordB]?.includes(lordA)) || false;
}

// getSignLord and areFriends imported from coreCalculations.ts as single source of truth

// ============================================================================
// DETAILED NAKSHATRA COMPATIBILITY (NEW)
// ============================================================================

/**
 * Get detailed nakshatra compatibility with psychological profile
 */
export function getDetailedNakshatraCompatibility(
  nakshatraA: Nakshatra,
  nakshatraB: Nakshatra
): { score: number; description: string; bestMatch: boolean; worstMatch: boolean } {
  const compatData = nakshatraCompatData as any;
  const dataA = compatData.nakshatra_compatibility[nakshatraA];

  if (!dataA) {
    throw new Error(`Nakshatra ${nakshatraA} not found in database`);
  }

  const compatibility = dataA.compatibility[nakshatraB];

  if (!compatibility) {
    throw new Error(`Compatibility data for ${nakshatraA} - ${nakshatraB} not found`);
  }

  const isBestMatch = dataA.best_match?.includes(nakshatraB) || false;
  const isWorstMatch = dataA.worst_match?.includes(nakshatraB) || false;

  return {
    score: compatibility.score,
    description: compatibility.description,
    bestMatch: isBestMatch,
    worstMatch: isWorstMatch
  };
}

/**
 * Get nakshatra metadata (lord, deity, yoni, gana, etc.)
 */
export function getNakshatraMetadata(nakshatra: Nakshatra): {
  lord: string;
  deity: string;
  yoni: string;
  gana: string;
  nadi: string;
  gender: string;
  symbol: string;
  animal: string;
  bestMatch: string[];
  worstMatch: string[];
} {
  const compatData = nakshatraCompatData as any;
  const data = compatData.nakshatra_compatibility[nakshatra];

  if (!data) {
    throw new Error(`Nakshatra ${nakshatra} not found in database`);
  }

  return {
    lord: data.lord,
    deity: data.deity,
    yoni: data.yoni,
    gana: data.gana,
    nadi: data.nadi,
    gender: data.gender,
    symbol: data.symbol,
    animal: data.animal,
    bestMatch: data.best_match || [],
    worstMatch: data.worst_match || []
  };
}

/**
 * Calculate comprehensive sexual compatibility using yoni and nakshatra data
 */
export function calculateSexualCompatibility(
  chartA: Chart,
  chartB: Chart
): SexualCompatibility {
  // Get Moon nakshatras
  const moonA = chartA.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon');
  const moonB = chartB.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon');

  if (!moonA || !moonB) {
    throw new Error('Moon position not found in one or both charts');
  }

  const nakshatraA = moonA.nakshatra;
  const nakshatraB = moonB.nakshatra;

  // Get metadata for both
  const metaA = getNakshatraMetadata(nakshatraA);
  const metaB = getNakshatraMetadata(nakshatraB);

  // Get yoni data
  const yoniSystem = (yoniData as any).yoni_system;
  const yoniAKey = metaA.yoni.replace(/ \(.*\)/, '');
  const yoniBKey = metaB.yoni.replace(/ \(.*\)/, '');
  const yoniAData = yoniSystem?.yonis?.[yoniAKey];
  const yoniBData = yoniSystem?.yonis?.[yoniBKey];

  // Calculate yoni compatibility
  let yoniScore = 50; // Base score
  let yoniNature = 'Neutral';
  let yoniDescription = 'Standard compatibility';

  if (yoniAData && yoniBData) {
    // Check for same yoni (best match)
    if (metaA.yoni === metaB.yoni) {
      yoniScore = 100; // aaps.space gives 100 for same yoni
      yoniNature = 'Excellent';
      yoniDescription = `Both share ${metaA.yoni} yoni nature, creating deep physical understanding. ${yoniAData.sexual_nature?.description || ''}`;
    } else {
      // Check compatibility matrix from JSON
      const matrix = (yoniData as any).yoni_compatibility_matrix;
      const score = matrix?.[yoniAKey]?.[yoniBKey] || matrix?.[yoniAKey]?.others || 3;

      // Map 1-5 score to 0-100
      yoniScore = score * 20;

      if (yoniScore >= 80) {
        yoniNature = 'Good';
        yoniDescription = `${yoniAKey} and ${yoniBKey} yonis are naturally compatible. ${yoniAData.compatibility_notes || ''}`;
      } else if (yoniScore >= 60) {
        yoniNature = 'Moderate';
        yoniDescription = 'Different yoni natures requiring understanding and adjustment';
      } else {
        yoniNature = 'Challenging';
        yoniDescription = 'Potentially conflicting sexual natures requiring significant patience';
      }
    }
  }

  // Get nakshatra compatibility
  const nakshatraCompat = getDetailedNakshatraCompatibility(nakshatraA, nakshatraB);

  // Calculate overall sexual score
  const overallScore = Math.round((yoniScore + nakshatraCompat.score) / 2);

  // Anatomical details from yoniData (mapped to yoniDepth)
  const yoniDepth = {
    drive: yoniAData?.sexual_nature?.drive || 'Medium',
    stamina: yoniAData?.sexual_nature?.stamina || 'Medium',
    sessionDuration: yoniAData?.sexual_nature?.duration || 'Medium',
    bodyElement: yoniAData?.element || 'Earth',
    characteristics: yoniAData?.sexual_nature?.characteristics || [],
    anatomy: {
      opening: yoniAData?.sexual_nature?.yoni_features?.opening,
      passage: yoniAData?.sexual_nature?.yoni_features?.passage,
      base: yoniAData?.sexual_nature?.yoni_features?.base,
      foreskin: yoniAData?.sexual_nature?.lingam_features?.foreskin,
      girth: yoniAData?.sexual_nature?.lingam_features?.girth,
      glans: yoniAData?.sexual_nature?.lingam_features?.glans,
    }
  };

  return {
    yoniMatch: {
      yoniA: metaA.yoni,
      yoniB: metaB.yoni,
      score: yoniScore,
      nature: yoniNature,
      description: yoniDescription
    },
    nakshatraMatch: {
      nakshatraA,
      nakshatraB,
      score: nakshatraCompat.score,
      description: nakshatraCompat.description,
      psychologicalProfile: `${nakshatraA} (${metaA.gana} gana) with ${nakshatraB} (${metaB.gana} gana)`
    },
    sexualNature: {
      partnerA: {
        nature: yoniAData?.sexual_nature?.description || 'Standard',
        preferences: yoniAData?.sexual_nature?.characteristics || [],
        compatibility: yoniAData?.best_matches?.includes(yoniBKey) ? 'High' : 'Moderate'
      },
      partnerB: {
        nature: yoniBData?.sexual_nature?.description || 'Standard',
        preferences: yoniBData?.sexual_nature?.characteristics || [],
        compatibility: yoniBData?.best_matches?.includes(yoniAKey) ? 'High' : 'Moderate'
      }
    },
    overallScore,
    recommendations: generateSexualRecommendations(metaA, metaB, overallScore),
    yoniDepth
  };
}

function generateSexualRecommendations(
  metaA: any,
  metaB: any,
  score: number
): string[] {
  const recommendations: string[] = [];

  if (score >= 80) {
    recommendations.push('Excellent sexual compatibility - physical intimacy will be a strength');
  } else if (score >= 60) {
    recommendations.push('Good compatibility with room for exploration and growth');
  } else {
    recommendations.push('Requires conscious effort - communication about needs is essential');
  }

  if (metaA.gana !== metaB.gana) {
    recommendations.push(`Different ganas (${metaA.gana} vs ${metaB.gana}) - balance energy levels`);
  }

  if (metaA.nadi === metaB.nadi) {
    recommendations.push('Same nadi - watch for health compatibility issues');
  }

  return recommendations;
}

/**
 * Predict spouse characteristics based on chart analysis
 */
export function predictSpouseCharacteristics(chart: Chart): SpousePrediction {
  const seventhHouse = chart.houses.find((h: any) => h.houseNumber === 7);
  const seventhLord = seventhHouse?.lord;
  const planetsInSeventh = seventhHouse?.planets || [];

  const darakaraka = chart.specialPoints.darakaraka;
  const darakarakaPos = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === darakaraka);

  const navamsa = chart.vargaCharts.D9;
  const navamsaSeventh = navamsa.houses.find((h: any) => h.houseNumber === 7);
  const upapada = chart.specialPoints.upapadaLagna;

  // Get spouse nature based on 7th lord
  let spouseNature = 'Balanced and fair';
  let spouseAppearance = 'Attractive';
  const spouseTraits: string[] = [];

  const spouseIndicators = (spouseData as any).spouse_indicators;
  const seventhHousePlanets = spouseIndicators?.seventh_house_planets || {};
  const navamsaHouses = spouseIndicators?.navamsa_houses || {};

  if (seventhHousePlanets[seventhLord || '']) {
    const planetData = seventhHousePlanets[seventhLord || ''];
    spouseNature = planetData.spouse_nature || spouseNature;
    spouseAppearance = planetData.spouse_appearance || spouseAppearance;
    if (planetData.spouse_characteristics) {
      spouseTraits.push(...planetData.spouse_characteristics);
    }
  }

  // Planets in 7th modify the nature
  planetsInSeventh.forEach((planet: Planet) => {
    if (seventhHousePlanets[planet]) {
      const chars = seventhHousePlanets[planet].spouse_characteristics;
      if (chars) {
        spouseTraits.push(...chars);
      }
    }
  });

  // D9 7th house analysis
  const navamsaLord = navamsaSeventh?.lord;
  let marriageQuality = 'Good';

  if (navamsaLord && navamsaHouses['7']) {
    const navamsaData = navamsaHouses['7'];
    if (navamsaData && navamsaData[navamsaLord]) {
      marriageQuality = navamsaData[navamsaLord].quality || marriageQuality;
    }
  }

  return {
    profileName: chart.name,
    seventhHouse: {
      sign: seventhHouse?.sign || 'Libra',
      lord: seventhLord || 'Venus',
      planets: planetsInSeventh,
      spouseNature,
      spouseAppearance,
      spouseTraits: [...new Set(spouseTraits)] // Remove duplicates
    },
    darakaraka: {
      planet: darakaraka,
      sign: darakarakaPos?.sign || 'Aries',
      house: darakarakaPos?.house || 1,
      spouseCharacteristics: `Spouse shows ${darakaraka} qualities prominently`
    },
    navamsaSeventh: {
      sign: navamsaSeventh?.sign || 'Aries',
      planets: navamsaSeventh?.planets || [],
      marriageQuality
    },
    upapadaLagna: {
      sign: upapada,
      planets: [],
      timing: 'Marriage timing to be calculated from Upapada'
    },
    predictions: [
      `Spouse will be ${spouseNature.toLowerCase()}`,
      `Physical appearance: ${spouseAppearance.toLowerCase()}`,
      `Marriage quality in D9: ${marriageQuality}`,
      `Darakaraka ${darakaraka} indicates spouse nature`
    ]
  };
}

/**
 * Analyze divisional charts for marriage
 */
export function analyzeDivisionalCharts(chartA: Chart, chartB: Chart): DivisionalChartAnalysis {
  const d9A = chartA.vargaCharts.D9;
  const d9B = chartB.vargaCharts.D9;

  const d7A = chartA.vargaCharts.D7 || chartA.vargaCharts.D1; // Fallback to D1 if D7 not present

  // Find Vargottama planets (same sign in D1 and D9)
  const vargottamaA = findVargottamaPlanets(chartA);
  const vargottamaB = findVargottamaPlanets(chartB);

  // Shodasavarga (16 Vargas) Analysis
  const vargaInterpretations: Record<string, string> = {
    D1: 'Foundation of life and basic marriage structure',
    D2: 'Wealth and family resources available after marriage',
    D3: 'Brotherhood, courage, and initiative in relationship',
    D4: 'Fixed assets, residence, and emotional stability',
    D7: 'Progeny, children, and lineage continuity',
    D9: 'Soul of marriage, spouse traits, and marital fruit',
    D10: 'Public status, career impact, and societal image',
    D12: 'Ancestry, parents, and inherited values/debt',
    D16: 'Vehicles, luxuries, and material comforts in life',
    D20: 'Spirituality, religious practices, and mental peace',
    D24: 'Knowledge, wisdom, and educational compatibility',
    D27: 'Subconscious strength and inherent mental nature',
    D30: 'Evil influences, health issues, and hidden traits',
    D40: 'General auspiciousness and fruits of past lives',
    D45: 'Character, behavior, and deep-seated habits',
    D60: 'Karmic baggage, past life connections, and destiny'
  };

  const shodasavarga: { chart: string; sign: Sign; interpretation: string }[] = [];
  const vargaKeys = ['D1', 'D2', 'D3', 'D4', 'D7', 'D9', 'D10', 'D12', 'D16', 'D20', 'D24', 'D27', 'D30', 'D40', 'D45', 'D60'];

  vargaKeys.forEach(key => {
    const vargaChart = chartA.vargaCharts[key as keyof typeof chartA.vargaCharts];
    if (vargaChart) {
      shodasavarga.push({
        chart: key,
        sign: vargaChart.ascendant as Sign,
        interpretation: vargaInterpretations[key] || 'General life significance'
      });
    }
  });

  // Analyze D9 7th houses
  const seventhA = d9A.houses.find((h: any) => h.houseNumber === 7);
  const seventhB = d9B.houses.find((h: any) => h.houseNumber === 7);

  const indications: string[] = [];

  if (seventhA && seventhB) {
    if (seventhA.sign === seventhB.sign) {
      indications.push('Same D9 7th house sign: Deep soul-level connection (Bhrigu rules)');
    }

    const lordA = getSignLord(seventhA.sign);
    const lordB = getSignLord(seventhB.sign);

    if (areFriends(lordA, lordB)) {
      indications.push(`Friendly lords (${lordA} & ${lordB}): Supportive and harmonious partnership`);
    }

    // Check for Pushkar Navamsa (simplified common signs)
    const pushkarSigns = ['Taurus', 'Cancer', 'Virgo', 'Sagittarius', 'Pisces'];
    if (pushkarSigns.includes(seventhA.sign) || pushkarSigns.includes(seventhB.sign)) {
      indications.push('Pushkar Navamsa involvement: Highly auspicious marriage destiny');
    }
  }

  // Add Vargottama indications
  if (vargottamaA.length > 0) indications.push(`${chartA.name} has Vargottama ${vargottamaA.join(', ')}: Strong character and resilience`);
  if (vargottamaB.length > 0) indications.push(`${chartB.name} has Vargottama ${vargottamaB.join(', ')}: Stable character and destiny`);

  // Analyze D7 for progeny
  const fifthD7A = d7A.houses.find((h: any) => h.houseNumber === 5);
  const d7Indications = [
    `${chartA.name}'s progeny potential through ${fifthD7A?.sign || '5th house'} suggests fulfillment through children`,
    `${chartB.name}'s D7 indicates lineage continuity and ancestral blessings`
  ];

  // Analyze D60 for past life
  const d60A = chartA.vargaCharts.D60;
  const d60B = chartB.vargaCharts.D60;
  let d60PastLife = "D60 analysis indicates a relationship governed by subtle past-life impressions (Samskaras).";
  let d60Destiny = "Strong karmic undercurrents identified through Shashtiamsa divisional positioning.";

  if (d60A && d60B) {
    const ascA = d60A.ascendant;
    const ascB = d60B.ascendant;
    const lordA = getSignLord(ascA);
    const lordB = getSignLord(ascB);

    if (ascA === ascB) {
      d60Destiny = "Soul Mirroring: Rare shared D60 Ascendant indicates your life paths were deeply intertwined in past incarnations.";
    } else if (lordA === lordB) {
      d60Destiny = `Karmic Resonance: Regulated by ${lordA} in D60, suggesting a shared evolutionary mission from past lives.`;
    }

    // Check 7th Lord of D1 in D60
    const seventhHouseA = chartA.houses.find((h: any) => h.houseNumber === 7);
    const seventhLordA = seventhHouseA?.lord;
    const pA_in_D60 = d60A.planetaryPositions.find((p: PlanetaryPosition) => p.planet === seventhLordA);
    const pB_in_D60 = d60B.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon'); // Partner B's Moon in D60

    if (pA_in_D60 && pB_in_D60 && pA_in_D60.sign === pB_in_D60.sign) {
      d60PastLife = "Destined Union: One partner's relationship ruler connects directly with the other's subconscious (Moon) in the karmic chart.";
    }

    // Check Rahu/Ketu connections in D60
    const rahuA = d60A.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Rahu');
    const ketuB = d60B.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Ketu');
    if (rahuA && ketuB && rahuA.sign === ketuB.sign) {
      d60PastLife = "Karmic Axis Shift: Node reversal in D60 signifies a profound duty to balance past life debts in this partnership.";
    }

    // Atmakaraka resonance
    if (chartA.specialPoints?.atmakaraka && chartA.specialPoints?.atmakaraka === chartB.specialPoints?.atmakaraka) {
      d60Destiny = `Soul Kinship: Both sharing ${chartA.specialPoints.atmakaraka} as Atmakaraka creates a powerful spiritual bond mirrored in the D60.`;
    }
  }

  return {
    d9: {
      ascendant: d9A.ascendant,
      seventhLord: seventhA?.lord || 'Venus',
      seventhHouse: {
        sign: seventhA?.sign || 'Libra',
        planets: seventhA?.planets || []
      },
      vargottamaPlanets: [...vargottamaA, ...vargottamaB],
      pushkarNavamsa: [], // To be implemented
      marriageIndications: indications
    },
    d7: {
      childrenIndications: d7Indications,
      fertility: 'High potential indicated by strong D7 placements'
    },
    d60: {
      pastLifeKarma: d60PastLife,
      marriageDestiny: d60Destiny
    },
    shodasavarga,
    overall: `Marriage is deeply supported by divisional chart alignments between ${chartA.name} and ${chartB.name}.`
  };
}

function findVargottamaPlanets(chart: Chart): string[] {
  const vargottama: string[] = [];

  chart.planetaryPositions.forEach((pos: PlanetaryPosition) => {
    const d9Pos = chart.vargaCharts.D9.planetaryPositions.find((p: PlanetaryPosition) => p.planet === pos.planet);
    if (d9Pos && d9Pos.sign === pos.sign) {
      vargottama.push(pos.planet);
    }
  });

  return vargottama;
}

// ============================================================================
// NAVAMSA MATCHING (V.P. Goel Method)
// ============================================================================

export function calculateNavamsaMatching(chartA: Chart, chartB: Chart): NavamsaMatching {
  const navamsaA = chartA.vargaCharts.D9;
  const navamsaB = chartB.vargaCharts.D9;

  // Simplified V.P. Goel method
  let score = 0;

  // Check ascendants
  const ascA = navamsaA.ascendant;
  const ascB = navamsaB.ascendant;

  // Mutual respect: Kendra or trine preferred
  const indexA = SIGNS.indexOf(ascA);
  const indexB = SIGNS.indexOf(ascB);
  const diff = Math.abs(indexA - indexB);

  if (diff === 0 || diff === 6) {
    score += 25; // Same or opposite - good
  } else if (diff === 4 || diff === 8) {
    score += 25; // Trine - excellent
  } else if (diff === 3 || diff === 9) {
    score += 20; // Square - acceptable
  } else {
    score += 10; // Other
  }

  // Check 7th house in D9
  const seventhLordA = getSignLord(getSignAtHouse(navamsaA, 7));
  const seventhLordB = getSignLord(getSignAtHouse(navamsaB, 7));

  if (seventhLordA === seventhLordB) {
    score += 25;
  } else if (areFriends(seventhLordA, seventhLordB)) {
    score += 20;
  } else {
    score += 10;
  }

  // Check Venus positions in D9
  const venusA = navamsaA.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Venus');
  const venusB = navamsaB.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Venus');

  if (venusA && venusB) {
    if (venusA.sign === venusB.sign) {
      score += 25;
    } else if (areFriends(getSignLord(venusA.sign), getSignLord(venusB.sign))) {
      score += 15;
    }
  }

  // Check 2nd house for family happiness
  const secondLordA = getSignLord(getSignAtHouse(navamsaA, 2));
  const secondLordB = getSignLord(getSignAtHouse(navamsaB, 2));

  const familyRelations = areFriends(secondLordA, secondLordB)
    ? 'Good family integration expected'
    : 'Family adjustment required';

  return {
    score,
    mutualRespect: score >= 70 ? 'High mutual respect' : score >= 50 ? 'Moderate respect' : 'Respect needs cultivation',
    maritalHappiness: score >= 70 ? 'High marital happiness' : score >= 50 ? 'Good potential' : 'Challenges present',
    familyRelations,
    suitability: score >= 70 ? 'Highly suitable' : score >= 50 ? 'Suitable with effort' : 'Requires significant work'
  };
}

export function getSignAtHouse(vargaChart: any, houseNumber: number): string {
  const ascIndex = SIGNS.indexOf(vargaChart.ascendant);
  return SIGNS[(ascIndex + houseNumber - 1) % 12];
}

// checkGrahaDoshMaitri or other logic if still needed below