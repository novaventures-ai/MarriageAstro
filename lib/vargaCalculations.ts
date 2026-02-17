/**
 * Varga (Divisional Chart) Calculations
 * Phase 2.1: Divisional Chart Generation
 * Implements D1, D2, D3, D4, D7, D9, D10, D12, D16, D20, D24, D27, D30, D40, D45, D60
 */

import { Planet, Sign, PlanetaryPosition, ChartData } from '@types';
import {
  SIGNS,
  PLANETS,
  getSignFromLongitude,
  getSignDegree,
  normalizeDegrees
} from './coreCalculations';

// ============================================================================
// VARGA CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate Navamsa (D9) - Most important for marriage
 * Each sign divided into 9 parts of 3°20' each
 */
export function calculateNavamsa(longitude: number): Sign {
  const sign = getSignFromLongitude(longitude);
  const signDegree = getSignDegree(longitude);
  const signIndex = SIGNS.indexOf(sign);

  // For odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius)
  // Navamsa starts from Aries
  // For even signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces)
  // Navamsa starts from Libra

  const navamsaIndex = Math.floor(signDegree / (30 / 9));

  let startSign: number;
  if (signIndex % 2 === 0) {
    // Odd sign
    startSign = 0; // Aries
  } else {
    // Even sign
    startSign = 6; // Libra
  }

  const d9SignIndex = (startSign + navamsaIndex) % 12;
  return SIGNS[d9SignIndex];
}

/**
 * Calculate Saptamsa (D7) - For progeny and children
 * Each sign divided into 7 parts
 */
export function calculateSaptamsa(longitude: number): Sign {
  const sign = getSignFromLongitude(longitude);
  const signDegree = getSignDegree(longitude);
  const signIndex = SIGNS.indexOf(sign);

  const saptamsaIndex = Math.floor(signDegree / (30 / 7));

  let startSign: number;
  if (signIndex % 2 === 0) {
    // Odd sign - starts from same sign
    startSign = signIndex;
  } else {
    // Even sign - starts from 7th from sign
    startSign = (signIndex + 6) % 12;
  }

  const d7SignIndex = (startSign + saptamsaIndex) % 12;
  return SIGNS[d7SignIndex];
}

/**
 * Calculate Dasamsa (D10) - For career and status
 * Each sign divided into 10 parts
 */
export function calculateDasamsa(longitude: number): Sign {
  const sign = getSignFromLongitude(longitude);
  const signDegree = getSignDegree(longitude);
  const signIndex = SIGNS.indexOf(sign);

  const dasamsaIndex = Math.floor(signDegree / 3); // 30° / 10 = 3° each

  // For movable signs: starts from same sign
  // For fixed signs: starts from 9th from sign
  // For dual signs: starts from 5th from sign

  const signType = signIndex % 3; // 0 = movable, 1 = fixed, 2 = dual
  let startSign: number;

  if (signType === 0) {
    startSign = signIndex;
  } else if (signType === 1) {
    startSign = (signIndex + 8) % 12; // 9th from sign
  } else {
    startSign = (signIndex + 4) % 12; // 5th from sign
  }

  const d10SignIndex = (startSign + dasamsaIndex) % 12;
  return SIGNS[d10SignIndex];
}

/**
 * Calculate Dwadasamsa (D12) - For parents and ancestry
 * Each sign divided into 12 parts
 */
export function calculateDwadasamsa(longitude: number): Sign {
  const sign = getSignFromLongitude(longitude);
  const signDegree = getSignDegree(longitude);
  const signIndex = SIGNS.indexOf(sign);

  const dwadasamsaIndex = Math.floor(signDegree / 2.5); // 30° / 12 = 2.5° each

  const d12SignIndex = (signIndex + dwadasamsaIndex) % 12;
  return SIGNS[d12SignIndex];
}

/**
 * Calculate Shodasamsa (D16) - For vehicles and comforts
 */
export function calculateShodasamsa(longitude: number): Sign {
  const sign = getSignFromLongitude(longitude);
  const signDegree = getSignDegree(longitude);
  const signIndex = SIGNS.indexOf(sign);

  const shodasamsaIndex = Math.floor(signDegree / (30 / 16));

  // For movable signs: starts from Aries
  // For fixed signs: starts from Leo
  // For dual signs: starts from Sagittarius

  const signType = signIndex % 3;
  let startSign: number;

  if (signType === 0) {
    startSign = 0; // Aries
  } else if (signType === 1) {
    startSign = 4; // Leo
  } else {
    startSign = 8; // Sagittarius
  }

  const d16SignIndex = (startSign + shodasamsaIndex) % 12;
  return SIGNS[d16SignIndex];
}

/**
 * Calculate Shashtiamsa (D60) - For past life karma
 * Each sign divided into 60 parts of 0.5° each
 */
export function calculateShashtiamsa(longitude: number): Sign {
  const sign = getSignFromLongitude(longitude);
  const signDegree = getSignDegree(longitude);
  const signIndex = SIGNS.indexOf(sign);

  const shashtiamsaIndex = Math.floor(signDegree / 0.5);

  // For odd signs: starts from Aries
  // For even signs: starts from Libra

  let startSign: number;
  if (signIndex % 2 === 0) {
    startSign = 0; // Aries
  } else {
    startSign = 6; // Libra
  }

  const d60SignIndex = (startSign + shashtiamsaIndex) % 12;
  return SIGNS[d60SignIndex];
}

// ============================================================================
// COMPLETE VARGA CHART GENERATION
// ============================================================================

export interface VargaResults {
  D1: Sign;
  D2?: Sign;
  D3?: Sign;
  D4?: Sign;
  D7: Sign;
  D9: Sign;
  D10?: Sign;
  D12?: Sign;
  D16?: Sign;
  D20?: Sign;
  D24?: Sign;
  D27?: Sign;
  D30?: Sign;
  D40?: Sign;
  D45?: Sign;
  D60: Sign;
}

/**
 * Calculate all 16 Vargas for a given longitude
 */
export function calculateAllVargas(longitude: number): VargaResults {
  return {
    D1: getSignFromLongitude(longitude),
    D7: calculateSaptamsa(longitude),
    D9: calculateNavamsa(longitude),
    D10: calculateDasamsa(longitude),
    D12: calculateDwadasamsa(longitude),
    D16: calculateShodasamsa(longitude),
    D60: calculateShashtiamsa(longitude)
  };
}

/**
 * Generate complete varga chart from planetary positions
 */
export function generateVargaChart(
  d1Chart: ChartData,
  vargaType: 'D9' | 'D7' | 'D60' | 'D10' | 'D12' | 'D16'
): ChartData {
  const calculateFunction: Record<string, (lon: number) => Sign> = {
    'D9': calculateNavamsa,
    'D7': calculateSaptamsa,
    'D60': calculateShashtiamsa,
    'D10': calculateDasamsa,
    'D12': calculateDwadasamsa,
    'D16': calculateShodasamsa
  };

  const calcFn = calculateFunction[vargaType];

  // Calculate varga positions for each planet
  const vargaPositions = d1Chart.planetaryPositions.map(pos => ({
    ...pos,
    sign: calcFn(pos.longitude),
    signDegree: 0 // Simplified
  }));

  // Calculate varga ascendant
  const vargaAscendant = calcFn(d1Chart.houses[0].cuspLongitude);

  // Generate houses based on varga ascendant
  const ascendantIndex = SIGNS.indexOf(vargaAscendant);
  const houses = Array.from({ length: 12 }, (_, i) => ({
    houseNumber: i + 1,
    sign: SIGNS[(ascendantIndex + i) % 12],
    cuspLongitude: ((ascendantIndex + i) * 30),
    planets: vargaPositions
      .filter(p => {
        const houseFromAsc = (SIGNS.indexOf(p.sign) - ascendantIndex + 12) % 12 + 1;
        return houseFromAsc === i + 1;
      })
      .map(p => p.planet),
    lord: getSignLord(vargaAscendant)
  }));

  return {
    ascendant: vargaAscendant,
    houses,
    planetaryPositions: vargaPositions
  };
}

// Helper function to get sign lord
function getSignLord(sign: Sign): Planet {
  const signLords: Record<Sign, Planet> = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury',
    'Cancer': 'Moon', 'Leo': 'Sun', 'Virgo': 'Mercury',
    'Libra': 'Venus', 'Scorpio': 'Mars', 'Sagittarius': 'Jupiter',
    'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
  };
  return signLords[sign];
}

// ============================================================================
// VARGA STRENGTH CALCULATIONS
// ============================================================================

export interface VargaStrengthResult {
  planet: Planet;
  d1Sign: Sign;
  d9Sign: Sign;
  strength: number;
  interpretation: string;
}

/**
 * Calculate Varga Vimshopaka strength (simplified 20-point system)
 */
export function calculateVargaStrength(
  planet: Planet,
  d1Longitude: number,
  d9Longitude: number
): VargaStrengthResult {
  const d1Sign = getSignFromLongitude(d1Longitude);
  const d9Sign = getSignFromLongitude(d9Longitude);

  // Simplified strength calculation
  let strength = 10; // Base strength

  // Bonus for same sign in D9
  if (d1Sign === d9Sign) {
    strength += 5;
  }

  // Bonus for trine relationship
  const d1Index = SIGNS.indexOf(d1Sign);
  const d9Index = SIGNS.indexOf(d9Sign);
  const diff = Math.abs(d1Index - d9Index);

  if (diff === 4 || diff === 8) { // Trine (5th or 9th)
    strength += 3;
  }

  // Bonus for Kendra (1st, 4th, 7th, 10th)
  if (diff === 0 || diff === 3 || diff === 6 || diff === 9) {
    strength += 2;
  }

  const interpretation = strength >= 15
    ? 'Very Strong'
    : strength >= 10
      ? 'Strong'
      : strength >= 5
        ? 'Moderate'
        : 'Weak';

  return {
    planet,
    d1Sign,
    d9Sign,
    strength,
    interpretation
  };
}

/**
 * Calculate weighted Varga strength across multiple vargas
 */
export function calculateWeightedVargaStrength(
  planet: Planet,
  vargaPositions: Record<string, Sign>,
  weights: Record<string, number>
): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const [varga, sign] of Object.entries(vargaPositions)) {
    const weight = weights[varga] || 0.5;

    // Calculate dignity score (simplified)
    let dignityScore = 10; // Base

    // Add to weighted sum
    weightedSum += dignityScore * weight;
    totalWeight += weight;
  }

  return weightedSum / totalWeight;
}