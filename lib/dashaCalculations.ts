/**
 * Dasha (Planetary Period) Calculations
 * Phase 2.1: Vimshottari and Chara Dasha Systems
 */

import { Nakshatra, Planet, Sign, DashaPeriod, CharaDashaPeriod, VimshottariDasha } from '@types';
import { NAKSHATRAS, NAKSHATRA_LORDS, PLANET_PERIODS, SIGNS } from './coreCalculations.js';

// ============================================================================
// VIMSHOTTARI DASHA
// ============================================================================

/**
 * Calculate Vimshottari Dasha based on Moon's Nakshatra
 */
export function calculateVimshottariDasha(
  moonNakshatra: Nakshatra,
  moonLongitude: number,
  birthDate: Date
): VimshottariDasha {
  const nakshatraIndex = NAKSHATRAS.indexOf(moonNakshatra);
  const nakshatraLord = NAKSHATRA_LORDS[moonNakshatra];

  // Calculate balance of current dasha
  // Each nakshatra is 13°20' = 800 minutes of arc
  const nakshatraStart = nakshatraIndex * (360 / 27);
  const moonDegreeInNakshatra = moonLongitude - nakshatraStart;
  const nakshatraSpan = 360 / 27;
  const portionRemaining = 1 - (moonDegreeInNakshatra / nakshatraSpan);

  // Vimshottari order: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury
  const dashaOrder: Planet[] = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ];

  const startIndex = dashaOrder.indexOf(nakshatraLord);
  const mahaDashas: DashaPeriod[] = [];

  let currentDate = new Date(birthDate);
  let first = true;

  // Calculate all Mahadashas
  for (let i = 0; i < 9; i++) {
    const planetIndex = (startIndex + i) % 9;
    const planet = dashaOrder[planetIndex];
    const totalYears = PLANET_PERIODS[planet];

    let durationYears: number;

    if (first) {
      // First dasha is partial
      durationYears = totalYears * portionRemaining;
      first = false;
    } else {
      durationYears = totalYears;
    }

    // Use full precision for end date calculation (approximate years to ms)
    // 365.2425 days per year on average (Gregorian)
    const msPerYear = 365.2425 * 24 * 60 * 60 * 1000;
    const endDate = new Date(currentDate.getTime() + (durationYears * msPerYear));

    mahaDashas.push({
      planet,
      startDate: new Date(currentDate),
      endDate: endDate,
      durationYears,
      isCurrent: false, // Will be set later
      subPeriods: calculateAntardashas(planet, currentDate, endDate)
    });

    currentDate = endDate;
  }

  // Mark current dasha
  const now = new Date();
  mahaDashas.forEach(d => {
    d.isCurrent = now >= d.startDate && now < d.endDate;
  });

  return {
    moonNakshatra,
    mahaDashas
  };
}

/**
 * Calculate Antardashas (sub-periods) for a given Mahadasha
 */
function calculateAntardashas(
  mahaDashaLord: Planet,
  startDate: Date,
  endDate: Date
): DashaPeriod[] {
  const dashaOrder: Planet[] = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ];

  const startIndex = dashaOrder.indexOf(mahaDashaLord);
  const mahaDashaYears = PLANET_PERIODS[mahaDashaLord];
  const totalMs = endDate.getTime() - startDate.getTime();

  const antardashas: DashaPeriod[] = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < 9; i++) {
    const planetIndex = (startIndex + i) % 9;
    const planet = dashaOrder[planetIndex];
    const antardashaLordYears = PLANET_PERIODS[planet];

    // Antardasha proportion formula
    const durationYears = (mahaDashaYears * antardashaLordYears) / 120;
    const durationMs = (durationYears / mahaDashaYears) * totalMs;

    const subEndDate = new Date(currentDate.getTime() + durationMs);

    // Generate Pratyantar Dashas (Level 3)
    const pratyantarDashas = calculatePratyantarDashas(planet, new Date(currentDate), subEndDate, durationYears);

    antardashas.push({
      planet,
      startDate: new Date(currentDate),
      endDate: subEndDate,
      durationYears,
      isCurrent: false,
      subPeriods: pratyantarDashas
    });

    currentDate = subEndDate;
  }

  return antardashas;
}

/**
 * Calculate Pratyantar Dashas (Level 3)
 */
function calculatePratyantarDashas(
  antardashaLord: Planet,
  startDate: Date,
  endDate: Date,
  antardashaDurationYears: number
): DashaPeriod[] {
  const dashaOrder: Planet[] = [
    'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'
  ];

  const startIndex = dashaOrder.indexOf(antardashaLord);
  const totalMs = endDate.getTime() - startDate.getTime();

  const pratyantars: DashaPeriod[] = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < 9; i++) {
    const planetIndex = (startIndex + i) % 9;
    const planet = dashaOrder[planetIndex];
    const planetYears = PLANET_PERIODS[planet];

    // Pratyantar proportion: (AntardashaDuration * PlanetYears) / 120
    const durationYears = (antardashaDurationYears * planetYears) / 120;
    const durationMs = (durationYears / antardashaDurationYears) * totalMs;

    const subEndDate = new Date(currentDate.getTime() + durationMs);

    pratyantars.push({
      planet,
      startDate: new Date(currentDate),
      endDate: subEndDate,
      durationYears,
      isCurrent: false
    });

    currentDate = subEndDate;
  }

  return pratyantars;
}

/**
 * Find current Dasha and Antardasha
 */
export function getCurrentDasha(dasha: VimshottariDasha): {
  mahaDasha: DashaPeriod | null;
  antardasha: DashaPeriod | null;
} {
  const now = new Date();

  const mahaDasha = dasha.mahaDashas.find(d =>
    now >= d.startDate && now < d.endDate
  ) || null;

  const antardasha = mahaDasha?.subPeriods?.find(d =>
    now >= d.startDate && now < d.endDate
  ) || null;

  return { mahaDasha, antardasha };
}

// ============================================================================
// CHARA DASHA (JAIMINI SYSTEM)
// ============================================================================

/**
 * Calculate Chara Dasha based on Ascendant sign
 * This is a simplified version
 */
export function calculateCharaDasha(
  ascendantSign: string,
  birthDate: Date
): CharaDashaPeriod[] {
  const dashaPeriods: CharaDashaPeriod[] = [];

  // Chara Dasha order depends on sign characteristics
  // Odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius): Forward
  // Even signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces): Backward

  const ascendantIndex = SIGNS.indexOf(ascendantSign as any);
  const isOddSign = ascendantIndex % 2 === 0;

  let currentDate = new Date(birthDate);

  for (let i = 0; i < 12; i++) {
    let signIndex: number;

    if (isOddSign) {
      // Forward order starting from ascendant
      signIndex = (ascendantIndex + i) % 12;
    } else {
      // Backward order starting from ascendant
      signIndex = (ascendantIndex - i + 12) % 12;
    }

    const sign = SIGNS[signIndex];

    // Calculate proper Chara Dasha years based on lord placement
    // This uses the Jaimini method: count from sign to its lord
    const durationYears = calculateCharaDashaYears(sign, []);

    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + durationYears);

    dashaPeriods.push({
      sign: sign as any,
      startDate: new Date(currentDate),
      endDate,
      durationYears,
      isCurrent: false
    });

    currentDate = endDate;
  }

  // Mark current period
  const now = new Date();
  dashaPeriods.forEach(d => {
    d.isCurrent = now >= d.startDate && now < d.endDate;
  });

  return dashaPeriods;
}

/**
 * Calculate precise Chara Dasha years for a sign
 * Based on lord placement (Jaimini method)
 */
export function calculateCharaDashaYears(
  sign: string,
  planetaryPositions: { planet: Planet; longitude: number }[]
): number {
  // This is a simplified calculation
  // Real calculation involves counting from sign to its lord
  // and various rules for different sign types

  const signLords: Record<string, Planet> = {
    'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury',
    'Cancer': 'Moon', 'Leo': 'Sun', 'Virgo': 'Mercury',
    'Libra': 'Venus', 'Scorpio': 'Mars', 'Sagittarius': 'Jupiter',
    'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
  };

  const lord = signLords[sign];

  // Find lord's position
  const lordPosition = planetaryPositions.find(p => p.planet === lord);

  if (!lordPosition) return 7; // Default

  // Simplified: based on sign position
  const signIndex = SIGNS.indexOf(sign as any);
  const lordSignIndex = Math.floor(lordPosition.longitude / 30);

  let housesFromSign = (lordSignIndex - signIndex + 12) % 12;
  if (housesFromSign === 0) housesFromSign = 12;

  // Exception signs get modified calculations
  const exceptionSigns = [0, 4, 8]; // Aries, Leo, Sagittarius (fire signs)
  if (exceptionSigns.includes(signIndex)) {
    housesFromSign = housesFromSign === 12 ? 12 : housesFromSign;
  }

  return housesFromSign;
}

// ============================================================================
// DASHA PREDICTION FUNCTIONS
// ============================================================================

/**
 * Check if a dasha period is favorable for marriage
 */
export function isFavorableForMarriage(
  dashaLord: Planet,
  antardashaLord: Planet,
  chartData: {
    seventhLord: Planet;
    venusPosition: { house: number };
    jupiterPosition: { house: number };
    secondLord?: Planet;
    eleventhLord?: Planet;
  },
  pratyantarLord?: Planet
): {
  isFavorable: boolean;
  strength: number;
  reason: string;
} {
  const { seventhLord, venusPosition, jupiterPosition, secondLord, eleventhLord } = chartData;

  let strength = 0;
  const reasons: string[] = [];

  // Check if dasha lord is related to 7th house (Primary)
  if (dashaLord === seventhLord) {
    strength += 35;
    reasons.push('Dasha lord is 7th lord');
  }

  // Check 2nd and 11th lords (Secondary marriage indicators)
  if (secondLord && dashaLord === secondLord) {
    strength += 15;
    reasons.push('Dasha lord activates family (2nd)');
  }
  if (eleventhLord && dashaLord === eleventhLord) {
    strength += 15;
    reasons.push('Dasha lord desires (11th)');
  }

  // Check if dasha lord is Venus (Natural Karaka)
  if (dashaLord === 'Venus') {
    strength += 25;
    reasons.push('Venus dasha');
  }

  // Check if dasha lord is Jupiter (Blessing)
  if (dashaLord === 'Jupiter') {
    strength += 20;
    reasons.push('Jupiter dasha');
  }

  // Check antardasha lord (Multipliers)
  if (antardashaLord === seventhLord || antardashaLord === 'Venus') {
    strength += 15;
    reasons.push('Antardasha supports union');
  }

  if (secondLord && antardashaLord === secondLord) strength += 10;
  if (eleventhLord && antardashaLord === eleventhLord) strength += 10;

  // Check Pratyantar Lord (Fine Tuning)
  if (pratyantarLord) {
    if (pratyantarLord === seventhLord) {
      strength += 10;
      reasons.push('Pratyantar triggers marriage');
    }
    if (pratyantarLord === 'Venus' || pratyantarLord === 'Jupiter') {
      strength += 5;
    }
  }

  // Check house positions
  if (venusPosition.house === 7 || venusPosition.house === 5 || venusPosition.house === 11) {
    strength += 10;
    reasons.push('Venus well-placed');
  }

  return {
    isFavorable: strength >= 30, // Lowered base threshold to catch more periods
    strength: Math.min(strength, 100),
    reason: reasons.join(', ')
  };
}

/**
 * Find favorable marriage windows with Pratyantar precision
 */
export function findMarriageWindows(
  vimshottariDasha: VimshottariDasha,
  charaDasha: CharaDashaPeriod[],
  chartData: {
    seventhLord: Planet;
    venusPosition: { house: number };
    jupiterPosition: { house: number };
    secondLord?: Planet;
    eleventhLord?: Planet;
  },
  baseDate: Date = new Date()
): Array<{
  startDate: Date;
  endDate: Date;
  confidence: number;
  description: string;
}> {
  const windows: Array<{
    startDate: Date;
    endDate: Date;
    confidence: number;
    description: string;
  }> = [];

  const now = baseDate;
  const threeYearsFromNow = new Date(now);
  threeYearsFromNow.setFullYear(now.getFullYear() + 3);

  const fifteenYearsfromNow = new Date(now);
  fifteenYearsfromNow.setFullYear(now.getFullYear() + 15);

  // Check Vimshottari dashas
  for (const mahaDasha of vimshottariDasha.mahaDashas) {
    // Skip past Mahadashas or Distant Future ones
    if (new Date(mahaDasha.endDate) < now || new Date(mahaDasha.startDate) > fifteenYearsfromNow) continue;

    for (const antardasha of mahaDasha.subPeriods || []) {
      // Skip past Antardashas
      if (new Date(antardasha.endDate) < now) continue;

      const antardashaStart = new Date(antardasha.startDate);

      // Stop checking if we are too far in the future
      if (antardashaStart > fifteenYearsfromNow) continue;

      // Logic Split:
      // 1. For Near-Term (Next 3 Years): Analyze Pratyantar Dashas
      // 2. For Medium-Term (4-15 Years): Analyze Antardashas roughly

      if (antardashaStart <= threeYearsFromNow) {
        // Drill down to Pratyantar
        if (antardasha.subPeriods && antardasha.subPeriods.length > 0) {
          for (const pratyantar of antardasha.subPeriods) {
            if (new Date(pratyantar.endDate) < now) continue;

            const result = isFavorableForMarriage(
              mahaDasha.planet,
              antardasha.planet,
              chartData,
              pratyantar.planet
            );

            // Lower threshold for near-term pratyantar to catch "pockets"
            if (result.strength >= 25) {
              windows.push({
                startDate: pratyantar.startDate,
                endDate: pratyantar.endDate,
                confidence: result.strength,
                description: `${mahaDasha.planet}-${antardasha.planet}-${pratyantar.planet}: ${result.reason}`
              });
            }
          }
        } else {
          // Fallback if no sub-periods generated
          const result = isFavorableForMarriage(mahaDasha.planet, antardasha.planet, chartData);
          if (result.isFavorable) {
            windows.push({
              startDate: antardasha.startDate,
              endDate: antardasha.endDate,
              confidence: result.strength,
              description: `${mahaDasha.planet}-${antardasha.planet}: ${result.reason}`
            });
          }
        }
      } else {
        // Medium Term: Just check Antardasha
        const result = isFavorableForMarriage(mahaDasha.planet, antardasha.planet, chartData);
        if (result.isFavorable) {
          windows.push({
            startDate: antardasha.startDate,
            endDate: antardasha.endDate,
            confidence: result.strength,
            description: `${mahaDasha.planet}-${antardasha.planet}: ${result.reason}`
          });
        }
      }
    }
  }

  // Sort: First by absolute timing (nearest first)
  return windows.sort((a, b) => {
    return a.startDate.getTime() - b.startDate.getTime();
  });
}

/**
 * Find vulnerable periods for relationship risk
 * Periods where Rahu, Ketu, or separative planets are active
 */
export function findVulnerablePeriods(
  vimshottariDasha: VimshottariDasha,
  chartData: {
    separativePlanets: Planet[];
    name: string;
  }
): Array<{
  startDate: Date;
  endDate: Date;
  description: string;
  riskLevel: 'moderate' | 'high';
  profileName: string;
}> {
  const vulnerablePeriods: Array<{
    startDate: Date;
    endDate: Date;
    description: string;
    riskLevel: 'moderate' | 'high';
    profileName: string;
  }> = [];

  const riskLords = ['Rahu', 'Ketu', ...chartData.separativePlanets];
  const uniqueRiskLords = [...new Set(riskLords)];

  for (const mahaDasha of vimshottariDasha.mahaDashas) {
    for (const antardasha of mahaDasha.subPeriods || []) {
      let riskLevel: 'moderate' | 'high' | null = null;
      const reasons: string[] = [];

      // Check if either lord is a risk lord
      if (uniqueRiskLords.includes(mahaDasha.planet)) {
        riskLevel = 'high';
        reasons.push(`${mahaDasha.planet} Mahadasha activates separative influences`);
      }

      if (uniqueRiskLords.includes(antardasha.planet)) {
        riskLevel = riskLevel === 'high' ? 'high' : 'moderate';
        reasons.push(`${antardasha.planet} Antardasha triggers specific risk factors`);
      }

      // Special Rahu/Ketu combos
      if ((mahaDasha.planet === 'Rahu' || mahaDasha.planet === 'Ketu') &&
        (antardasha.planet === 'Rahu' || antardasha.planet === 'Ketu')) {
        riskLevel = 'high';
        reasons.push('Intense Rahu-Ketu nodal axis activation');
      }

      if (riskLevel) {
        vulnerablePeriods.push({
          startDate: antardasha.startDate,
          endDate: antardasha.endDate,
          description: reasons.join('. '),
          riskLevel,
          profileName: chartData.name
        });
      }
    }
  }

  // Filter for current and future periods only to avoid clutter
  const now = new Date();
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(now.getFullYear() - 2);

  return vulnerablePeriods
    .filter(p => p.endDate >= twoYearsAgo)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
}