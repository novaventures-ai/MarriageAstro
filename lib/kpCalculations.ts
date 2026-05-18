/**
 * KP Astrology Engine (Krishnamurti Paddhati)
 * Phase 2.2: Cuspal Sub Lords, Significators, Ruling Planets
 */

import { Planet, Sign, House, KPCusp, KPSignificator, RulingPlanet, PlanetaryPosition } from '@types';
import {
  SIGNS,
  NAKSHATRAS,
  NAKSHATRA_LORDS,
  SIGN_LORDS,
  getNakshatraFromLongitude,
  normalizeDegrees
} from './coreCalculations.js';

// ============================================================================
// SUB-LORD CALCULATIONS
// ============================================================================

// Vimshottari Dasha order and years
const DASHA_ORDER: Planet[] = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const DASHA_YEARS: Record<Planet, number> = {
  'Ketu': 7, 'Venus': 20, 'Sun': 6, 'Moon': 10, 'Mars': 7,
  'Rahu': 18, 'Jupiter': 16, 'Saturn': 19, 'Mercury': 17,
  'Uranus': 0, 'Neptune': 0, 'Pluto': 0
};

/**
 * Calculate sub-lord for a given degree within a nakshatra
 * Each nakshatra (13°20') is divided into 9 sub-lords based on dasha proportions
 */
export function calculateSubLord(longitude: number): Planet {
  const nakshatraData = getNakshatraFromLongitude(longitude);
  const nakshatraLord = NAKSHATRA_LORDS[nakshatraData.nakshatra];

  // Calculate position within nakshatra
  const nakshatraIndex = NAKSHATRAS.indexOf(nakshatraData.nakshatra);
  const nakshatraStart = nakshatraIndex * (360 / 27);
  const positionInNakshatra = normalizeDegrees(longitude - nakshatraStart);
  const nakshatraSpan = 360 / 27; // 13°20'

  // Find starting point in dasha order
  const startIndex = DASHA_ORDER.indexOf(nakshatraLord);

  // Calculate cumulative dasha spans within nakshatra
  let cumulativeSpan = 0;
  for (let i = 0; i < 9; i++) {
    const dashaPlanet = DASHA_ORDER[(startIndex + i) % 9];
    const dashaPortion = DASHA_YEARS[dashaPlanet] / 120; // Total vimshottari = 120 years
    const spanInNakshatra = dashaPortion * nakshatraSpan;

    if (positionInNakshatra < cumulativeSpan + spanInNakshatra) {
      return dashaPlanet;
    }
    cumulativeSpan += spanInNakshatra;
  }

  return nakshatraLord; // Fallback
}

/**
 * Calculate Sub-Sub-Lord (for more precision)
 */
export function calculateSubSubLord(longitude: number): Planet {
  const subLord = calculateSubLord(longitude);

  // Sub-sub-lord is calculated similarly within the sub-lord division
  // Simplified implementation
  const subLordIndex = DASHA_ORDER.indexOf(subLord);
  return DASHA_ORDER[(subLordIndex + 1) % 9];
}

// ============================================================================
// CUSPAL SUB LORD (CSL) CALCULATIONS
// ============================================================================

/**
 * Calculate KP Cusps with Star Lord, Sub Lord, and Sub-Sub Lord
 */
export function calculateKPCusps(
  houseCusps: number[],
  planetaryPositions: PlanetaryPosition[]
): KPCusp[] {
  return houseCusps.map((cuspLongitude, index) => {
    const cuspNumber = index + 1;
    const sign = getSignFromLongitude(cuspLongitude);
    const signLord = SIGN_LORDS[sign];

    // Calculate Star Lord (based on nakshatra)
    const nakshatraData = getNakshatraFromLongitude(cuspLongitude);
    const starLord = NAKSHATRA_LORDS[nakshatraData.nakshatra];

    // Calculate Sub Lord
    const subLord = calculateSubLord(cuspLongitude);

    // Calculate Sub-Sub Lord
    const subSubLord = calculateSubSubLord(cuspLongitude);

    return {
      cuspNumber,
      longitude: cuspLongitude,
      sign,
      signLord,
      starLord,
      subLord,
      subSubLord
    };
  });
}

/**
 * Get sign from longitude
 */
function getSignFromLongitude(longitude: number): Sign {
  const normalized = normalizeDegrees(longitude);
  const signIndex = Math.floor(normalized / 30);
  return SIGNS[signIndex];
}

// ============================================================================
// SIGNIFICATORS CALCULATIONS (4-FOLD THEORY)
// ============================================================================

/**
 * Calculate KP Significators for a planet
 * 4-Fold Theory:
  * 1. Planet in Star of Occupant
  * 2. Occupant of House
  * 3. Planet in Star of Lord
  * 4. Lord of House
 */
export function calculateSignificators(
  planet: Planet,
  planetaryPositions: PlanetaryPosition[],
  houseCusps: number[]
): KPSignificator {
  const planetPosition = planetaryPositions.find(p => p.planet === planet);

  if (!planetPosition) {
    throw new Error(`Planet ${planet} not found`);
  }

  // 1. Planet occupies a house
  const occupiedHouse = getHouseFromCusp(planetPosition.longitude, houseCusps);

  // 2. Star Lord and houses owned by Star Lord
  const nakshatraData = getNakshatraFromLongitude(planetPosition.longitude);
  const starLord = NAKSHATRA_LORDS[nakshatraData.nakshatra];
  const housesOwnedByStarLord = getHousesOwnedByPlanet(starLord, houseCusps);

  // 3. Sub Lord and houses owned by Sub Lord
  const subLord = calculateSubLord(planetPosition.longitude);
  const housesOwnedBySubLord = getHousesOwnedByPlanet(subLord, houseCusps);

  // Combine all significations
  const significations = [
    occupiedHouse,
    ...housesOwnedByStarLord,
    ...housesOwnedBySubLord
  ];

  // Determine strength
  let strength: 'strong' | 'moderate' | 'weak' = 'moderate';
  if (significations.includes(2) || significations.includes(7) || significations.includes(11)) {
    strength = 'strong';
  } else if (significations.includes(1) || significations.includes(6) || significations.includes(10)) {
    strength = 'weak';
  }

  return {
    planet,
    occupiedHouse,
    starLord,
    housesOwnedByStarLord,
    subLord,
    housesOwnedBySubLord,
    significations: [...new Set(significations)].sort(),
    strength
  };
}

/**
 * Get house number from longitude using cusps
 */
function getHouseFromCusp(longitude: number, houseCusps: number[]): number {
  const normalizedLong = normalizeDegrees(longitude);

  for (let i = 0; i < 12; i++) {
    const cuspStart = normalizeDegrees(houseCusps[i]);
    const cuspEnd = normalizeDegrees(houseCusps[(i + 1) % 12]);

    if (cuspStart < cuspEnd) {
      if (normalizedLong >= cuspStart && normalizedLong < cuspEnd) {
        return i + 1;
      }
    } else {
      // Wraps around 360°
      if (normalizedLong >= cuspStart || normalizedLong < cuspEnd) {
        return i + 1;
      }
    }
  }

  return 1; // Default
}

/**
 * Get houses owned by a planet
 */
function getHousesOwnedByPlanet(planet: Planet, houseCusps: number[]): number[] {
  const houses: number[] = [];

  for (let i = 0; i < 12; i++) {
    const cuspSign = getSignFromLongitude(houseCusps[i]);
    if (SIGN_LORDS[cuspSign] === planet) {
      houses.push(i + 1);
    }
  }

  return houses;
}

// ============================================================================
// RULING PLANETS CALCULATION
// ============================================================================

/**
 * Calculate Ruling Planets at a given moment
 * Used for birth time rectification and precise timing
 */
export function calculateRulingPlanets(
  date: Date,
  ascendantLongitude: number,
  moonLongitude: number
): RulingPlanet {
  // 1. Day Lord
  const dayLord = getDayLord(date);

  // 2. Moon Sign Lord
  const moonSign = getSignFromLongitude(moonLongitude);
  const moonSignLord = SIGN_LORDS[moonSign];

  // 3. Moon Star Lord
  const moonNakshatra = getNakshatraFromLongitude(moonLongitude);
  const moonStarLord = NAKSHATRA_LORDS[moonNakshatra.nakshatra];

  // 4. Lagna Sign Lord
  const lagnaSign = getSignFromLongitude(ascendantLongitude);
  const lagnaSignLord = SIGN_LORDS[lagnaSign];

  // 5. Lagna Star Lord
  const lagnaNakshatra = getNakshatraFromLongitude(ascendantLongitude);
  const lagnaStarLord = NAKSHATRA_LORDS[lagnaNakshatra.nakshatra];

  return {
    dayLord,
    moonSignLord,
    moonStarLord,
    lagnaSignLord,
    lagnaStarLord
  };
}

/**
 * Get Day Lord based on weekday
 */
function getDayLord(date: Date): Planet {
  const dayLords: Planet[] = [
    'Sun',    // Sunday
    'Moon',   // Monday
    'Mars',   // Tuesday
    'Mercury',// Wednesday
    'Jupiter',// Thursday
    'Venus',  // Friday
    'Saturn'  // Saturday
  ];

  return dayLords[date.getDay()];
}

// ============================================================================
// MARRIAGE PROMISE LOGIC
// ============================================================================

export interface MarriagePromiseResult {
  isPromised: boolean;
  confidence: number;
  reason: string;
  seventhCSL: KPCusp;
  significators: {
    promising: Planet[];
    denying: Planet[];
  };
}

/**
 * Analyze 7th Cusp Sub Lord to determine marriage promise
 * Based on KP 2-7-11 theory
 */
export function analyzeMarriagePromise(
  seventhCusp: KPCusp,
  significators: KPSignificator[]
): MarriagePromiseResult {
  const seventhSignifications = getSignificationsForCusp(seventhCusp, significators);

  const has2 = seventhSignifications.includes(2);
  const has7 = seventhSignifications.includes(7);
  const has11 = seventhSignifications.includes(11);

  const has1 = seventhSignifications.includes(1);
  const has6 = seventhSignifications.includes(6);
  const has10 = seventhSignifications.includes(10);

  const has5 = seventhSignifications.includes(5);
  const has8 = seventhSignifications.includes(8);
  const has12 = seventhSignifications.includes(12);

  // Determine promise
  let isPromised = false;
  let confidence = 0;
  let reason = '';

  if ((has2 || has7 || has11) && !(has1 || has6 || has10)) {
    isPromised = true;
    confidence = 90;
    reason = '7th CSL signifies marriage houses (2, 7, 11) without denying houses';
  } else if (has2 && has11 && !has1 && !has10) {
    isPromised = true;
    confidence = 70;
    reason = '7th CSL signifies gains and family (2, 11)';
  } else if (has5 || has8 || has12) {
    isPromised = true;
    confidence = 40;
    reason = '7th CSL signifies challenging houses (5, 8, 12) - complications expected';
  } else if (has1 || has6 || has10) {
    isPromised = false;
    confidence = 80;
    reason = '7th CSL signifies denying houses (1, 6, 10) - marriage denied or delayed';
  } else {
    isPromised = true;
    confidence = 50;
    reason = 'Mixed significations - uncertain outcome';
  }

  // Categorize significators
  const promising = significators
    .filter(s => s.significations.some(h => [2, 7, 11].includes(h)))
    .map(s => s.planet);

  const denying = significators
    .filter(s => s.significations.some(h => [1, 6, 10].includes(h)))
    .map(s => s.planet);

  return {
    isPromised,
    confidence,
    reason,
    seventhCSL: seventhCusp,
    significators: {
      promising: [...new Set(promising)],
      denying: [...new Set(denying)]
    }
  };
}

/**
 * Get significations for a specific cusp
 */
function getSignificationsForCusp(
  cusp: KPCusp,
  significators: KPSignificator[]
): number[] {
  const cuspSignificator = significators.find(s => s.planet === cusp.subLord);
  return cuspSignificator?.significations || [];
}

// ============================================================================
// TIMING PREDICTION USING KP
// ============================================================================

/**
 * Find favorable periods for marriage based on KP significators
 */
export function findMarriagePeriodsKP(
  seventhCusp: KPCusp,
  significators: KPSignificator[],
  currentDate: Date
): Array<{
  planet: Planet;
  period: string;
  favorability: number;
  reason: string;
}> {
  const periods: Array<{
    planet: Planet;
    period: string;
    favorability: number;
    reason: string;
  }> = [];

  // Analyze each significator
  for (const sig of significators) {
    const hasMarriageHouses = sig.significations.some(h => [2, 7, 11].includes(h));
    const hasDenyingHouses = sig.significations.some(h => [1, 6, 10].includes(h));

    if (hasMarriageHouses && !hasDenyingHouses) {
      periods.push({
        planet: sig.planet,
        period: 'Favorable',
        favorability: 90,
        reason: `Strong significator of marriage houses: ${sig.significations.join(', ')}`
      });
    } else if (hasMarriageHouses && hasDenyingHouses) {
      periods.push({
        planet: sig.planet,
        period: 'Mixed',
        favorability: 50,
        reason: `Mixed significations: marriage and denying houses both present`
      });
    }
  }

  return periods.sort((a, b) => b.favorability - a.favorability);
}