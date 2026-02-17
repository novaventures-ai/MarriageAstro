/**
 * Core Astronomical Calculations
 * Phase 2.1: Planetary Positions and House Calculations
 * Based on Swiss Ephemeris algorithms
 */

import { Planet, Sign, House, Gender, PlanetaryPosition, Nakshatra } from '@types';

// ============================================================================
// CONSTANTS
// ============================================================================

export const SIGNS: Sign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export const NAKSHATRAS: Nakshatra[] = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshta',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

export const PLANETS: Planet[] = [
  'Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu',
  'Uranus', 'Neptune', 'Pluto'
];

export const PLANET_PERIODS: Record<Planet, number> = {
  'Ketu': 7,
  'Venus': 20,
  'Sun': 6,
  'Moon': 10,
  'Mars': 7,
  'Rahu': 18,
  'Jupiter': 16,
  'Saturn': 19,
  'Mercury': 17,
  'Uranus': 0,
  'Neptune': 0,
  'Pluto': 0
};

export const NAKSHATRA_LORDS: Record<Nakshatra, Planet> = {
  'Ashwini': 'Ketu', 'Bharani': 'Venus', 'Krittika': 'Sun',
  'Rohini': 'Moon', 'Mrigashirsha': 'Mars', 'Ardra': 'Rahu',
  'Punarvasu': 'Jupiter', 'Pushya': 'Saturn', 'Ashlesha': 'Mercury',
  'Magha': 'Ketu', 'Purva Phalguni': 'Venus', 'Uttara Phalguni': 'Sun',
  'Hasta': 'Moon', 'Chitra': 'Mars', 'Swati': 'Rahu',
  'Vishakha': 'Jupiter', 'Anuradha': 'Saturn', 'Jyeshta': 'Mercury',
  'Mula': 'Ketu', 'Purva Ashadha': 'Venus', 'Uttara Ashadha': 'Sun',
  'Shravana': 'Moon', 'Dhanishta': 'Mars', 'Shatabhisha': 'Rahu',
  'Purva Bhadrapada': 'Jupiter', 'Uttara Bhadrapada': 'Saturn', 'Revati': 'Mercury'
};

// Sign lords
export const SIGN_LORDS: Record<Sign, Planet> = {
  'Aries': 'Mars', 'Taurus': 'Venus', 'Gemini': 'Mercury',
  'Cancer': 'Moon', 'Leo': 'Sun', 'Virgo': 'Mercury',
  'Libra': 'Venus', 'Scorpio': 'Mars', 'Sagittarius': 'Jupiter',
  'Capricorn': 'Saturn', 'Aquarius': 'Saturn', 'Pisces': 'Jupiter'
};

// Exaltation and debilitation
export const EXALTATION_SIGNS: Record<Planet, Sign> = {
  'Sun': 'Aries', 'Moon': 'Taurus', 'Mars': 'Capricorn',
  'Mercury': 'Virgo', 'Jupiter': 'Cancer', 'Venus': 'Pisces',
  'Saturn': 'Libra', 'Rahu': 'Taurus', 'Ketu': 'Scorpio',
  'Uranus': 'Aquarius', 'Neptune': 'Pisces', 'Pluto': 'Scorpio'
};

export const DEBILITATION_SIGNS: Record<Planet, Sign> = {
  'Sun': 'Libra', 'Moon': 'Scorpio', 'Mars': 'Cancer',
  'Mercury': 'Pisces', 'Jupiter': 'Capricorn', 'Venus': 'Virgo',
  'Saturn': 'Aries', 'Rahu': 'Scorpio', 'Ketu': 'Taurus',
  'Uranus': 'Leo', 'Neptune': 'Virgo', 'Pluto': 'Taurus'
};

// Moolatrikona signs
export const MOOLATRIKONA: Record<Planet, { sign: Sign; degrees: number }> = {
  'Sun': { sign: 'Leo', degrees: 20 },
  'Moon': { sign: 'Taurus', degrees: 30 },
  'Mars': { sign: 'Aries', degrees: 12 },
  'Mercury': { sign: 'Virgo', degrees: 15 },
  'Jupiter': { sign: 'Sagittarius', degrees: 10 },
  'Venus': { sign: 'Libra', degrees: 15 },
  'Saturn': { sign: 'Aquarius', degrees: 20 },
  'Rahu': { sign: 'Virgo', degrees: 30 },
  'Ketu': { sign: 'Pisces', degrees: 30 },
  'Uranus': { sign: 'Aquarius', degrees: 30 },
  'Neptune': { sign: 'Pisces', degrees: 30 },
  'Pluto': { sign: 'Scorpio', degrees: 30 }
};

// Varna Groups (Air=Shudra, Earth=Vaishya as per corrected traditional Vedic)
export const VARNA_GROUPS: Record<string, Sign[]> = {
  'Brahmin': ['Cancer', 'Scorpio', 'Pisces'],
  'Kshatriya': ['Aries', 'Leo', 'Sagittarius'],
  'Vaishya': ['Taurus', 'Virgo', 'Capricorn'],
  'Shudra': ['Gemini', 'Libra', 'Aquarius']
};

// Vashya Groups - multi-group mapping for Sagittarius/Capricorn
export const VASHYA_GROUPS: Record<string, Sign[]> = {
  'Manava': ['Gemini', 'Virgo', 'Libra', 'Sagittarius', 'Aquarius'],
  'Vanachara': ['Leo'],
  'Chatushpada': ['Aries', 'Taurus', 'Sagittarius', 'Capricorn'],
  'Jalachara': ['Cancer', 'Capricorn', 'Pisces'],
  'Keeta': ['Scorpio']
};

// Yoni Bitter Enemies (Normalized names matching JSON prefixes)
export const YONI_BITTER_ENEMIES: Record<string, string> = {
  'Ashwa': 'Mahish',
  'Gaja': 'Simha',
  'Mesha': 'Vanar',
  'Sarpa': 'Nakula',
  'Mushak': 'Marjar',
  'Gow': 'Vyaghra',
  'Mriga': 'Shwaan'
};

// Gana Types mapping
export const GANA_TYPES = {
  Deva: ['Ashwini', 'Mrigashirsha', 'Punarvasu', 'Pushya', 'Hasta', 'Swati', 'Anuradha', 'Shravana', 'Revati'],
  Manushya: ['Bharani', 'Rohini', 'Ardra', 'Purva Phalguni', 'Uttara Phalguni', 'Purva Ashadha', 'Uttara Ashadha', 'Purva Bhadrapada', 'Uttara Bhadrapada'],
  Rakshasa: ['Krittika', 'Ashlesha', 'Magha', 'Chitra', 'Vishakha', 'Jyeshta', 'Mula', 'Dhanishta', 'Shatabhisha']
};

// Nadi Types mapping (cyclic: 0=Adi, 1=Madhya, 2=Antya repeating every 3 nakshatras)
export const NADI_TYPES = {
  Adi: ['Ashwini', 'Ardra', 'Punarvasu', 'Uttara Phalguni', 'Hasta', 'Jyeshta', 'Mula', 'Shatabhisha', 'Purva Bhadrapada'],
  Madhya: ['Bharani', 'Mrigashirsha', 'Pushya', 'Purva Phalguni', 'Chitra', 'Anuradha', 'Purva Ashadha', 'Dhanishta', 'Uttara Bhadrapada'],
  Antya: ['Krittika', 'Rohini', 'Ashlesha', 'Magha', 'Swati', 'Vishakha', 'Uttara Ashadha', 'Shravana', 'Revati']
};


// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function normalizeDegrees(degrees: number): number {
  while (degrees < 0) degrees += 360;
  while (degrees >= 360) degrees -= 360;
  return degrees;
}

export function getSignFromLongitude(longitude: number): Sign {
  const normalized = normalizeDegrees(longitude);
  const signIndex = Math.floor(normalized / 30);
  return SIGNS[signIndex];
}

export function getSignDegree(longitude: number): number {
  const normalized = normalizeDegrees(longitude);
  return normalized % 30;
}

export function getNakshatraFromLongitude(longitude: number): { nakshatra: Nakshatra; pada: number } {
  const normalized = normalizeDegrees(longitude);
  const nakshatraIndex = Math.floor(normalized / (360 / 27));
  const nakshatraRemainder = normalized % (360 / 27);
  const pada = Math.floor(nakshatraRemainder / (360 / 27 / 4)) + 1;

  return {
    nakshatra: NAKSHATRAS[nakshatraIndex],
    pada: Math.min(pada, 4)
  };
}

export function getHouseFromLongitude(longitude: number, ascendant: number): number {
  const normalizedLong = normalizeDegrees(longitude);
  const normalizedAsc = normalizeDegrees(ascendant);
  const diff = normalizeDegrees(normalizedLong - normalizedAsc);
  return Math.floor(diff / 30) + 1;
}

export function getSignLord(sign: Sign | string): Planet {
  return SIGN_LORDS[sign as Sign] || 'Sun';
}

export function areFriends(p1: Planet | string, p2: Planet | string): boolean {
  const f1 = PLANET_FRIENDSHIP[p1 as string]?.friends || [];
  const f2 = PLANET_FRIENDSHIP[p2 as string]?.friends || [];
  return f1.includes(p2 as string) && f2.includes(p1 as string);
}

export function getVashya(sign: Sign | string): string[] {
  return Object.keys(VASHYA_GROUPS).filter(g => VASHYA_GROUPS[g].includes(sign as Sign));
}

export function getElement(sign: Sign): string {
  const elements: Record<string, string> = {
    'Aries': 'Fire', 'Leo': 'Fire', 'Sagittarius': 'Fire',
    'Taurus': 'Earth', 'Virgo': 'Earth', 'Capricorn': 'Earth',
    'Gemini': 'Air', 'Libra': 'Air', 'Aquarius': 'Air',
    'Cancer': 'Water', 'Scorpio': 'Water', 'Pisces': 'Water'
  };
  return elements[sign];
}

export const PLANET_FRIENDSHIP: Record<string, { friends: string[]; enemies: string[] }> = {
  'Sun': { friends: ['Moon', 'Mars', 'Jupiter'], enemies: ['Venus', 'Saturn'] },
  'Moon': { friends: ['Sun', 'Mercury'], enemies: ['Rahu', 'Ketu'] },
  'Mars': { friends: ['Sun', 'Moon', 'Jupiter'], enemies: ['Mercury'] },
  'Mercury': { friends: ['Sun', 'Venus'], enemies: ['Moon'] },
  'Jupiter': { friends: ['Sun', 'Moon', 'Mars'], enemies: ['Mercury', 'Venus'] },
  'Venus': { friends: ['Mercury', 'Saturn'], enemies: ['Sun', 'Moon'] },
  'Saturn': { friends: ['Mercury', 'Venus'], enemies: ['Sun', 'Moon', 'Mars'] },
  'Rahu': { friends: ['Mercury', 'Saturn', 'Venus'], enemies: ['Sun', 'Moon'] },
  'Ketu': { friends: ['Mercury', 'Saturn', 'Venus'], enemies: ['Sun', 'Moon'] }
};

export function getDignity(planet: Planet, sign: Sign, degree: number): 'exalted' | 'moolatrikona' | 'own_house' | 'friendly' | 'neutral' | 'enemy' | 'debilitated' {
  const exaltationSign = EXALTATION_SIGNS[planet];
  const debilitationSign = DEBILITATION_SIGNS[planet];
  const moolatrikonaData = MOOLATRIKONA[planet];
  const signLord = SIGN_LORDS[sign];

  // Check exaltation
  if (sign === exaltationSign) {
    return 'exalted';
  }

  // Check debilitation
  if (sign === debilitationSign) {
    return 'debilitated';
  }

  // Check moolatrikona
  if (sign === moolatrikonaData.sign && degree <= moolatrikonaData.degrees) {
    return 'moolatrikona';
  }

  // Check own house
  if (signLord === planet) {
    return 'own_house';
  }

  // Check friends and enemies
  const friendship = PLANET_FRIENDSHIP[planet as keyof typeof PLANET_FRIENDSHIP];
  if (friendship?.friends.includes(signLord)) {
    return 'friendly';
  }
  if (friendship?.enemies.includes(signLord)) {
    return 'enemy';
  }

  return 'neutral';
}

export function isCombust(planet: Planet, planetLongitude: number, sunLongitude: number): boolean {
  if (planet === 'Sun') return false;

  const diff = Math.abs(normalizeDegrees(planetLongitude - sunLongitude));
  const combustionOrbs: Record<Planet, number> = {
    'Moon': 12,
    'Mars': 17,
    'Mercury': 14,
    'Jupiter': 11,
    'Venus': 10,
    'Saturn': 15,
    'Rahu': 0,
    'Ketu': 0,
    'Sun': 0,
    'Uranus': 0,
    'Neptune': 0,
    'Pluto': 0
  };

  return diff <= combustionOrbs[planet];
}

// ============================================================================
// CORE CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculate planetary positions for a given date/time
 * This is a simplified version - in production, use Swiss Ephemeris
 */
export function calculatePlanetaryPositions(
  date: Date,
  _latitude: number,
  _longitude: number
): PlanetaryPosition[] {
  // Placeholder for actual Swiss Ephemeris calculation
  // In production, this would call swisseph or similar library

  const positions: PlanetaryPosition[] = [];
  const julianDay = getJulianDay(date);

  // Simplified mean positions (for demonstration)
  // In real implementation, use precise ephemeris calculations
  const meanPositions: Record<Planet, number> = {
    'Sun': (280.461 + 0.9856474 * julianDay) % 360,
    'Moon': (218.316 + 13.176396 * julianDay) % 360,
    'Mars': (355.433 + 0.524033 * julianDay) % 360,
    'Mercury': (252.251 + 4.092377 * julianDay) % 360,
    'Jupiter': (34.351 + 0.0830912 * julianDay) % 360,
    'Venus': (50.416 + 1.60213 * julianDay) % 360,
    'Saturn': (50.077 + 0.033444 * julianDay) % 360,
    'Rahu': (125.08 - 0.05295 * julianDay) % 360,
    'Ketu': (305.08 - 0.05295 * julianDay) % 360,
    'Uranus': (314.055 + 0.011728 * julianDay) % 360,
    'Neptune': (304.349 + 0.005981 * julianDay) % 360,
    'Pluto': (238.929 + 0.003964 * julianDay) % 360
  };

  for (const planet of PLANETS) {
    const longitude = meanPositions[planet];
    const sign = getSignFromLongitude(longitude);
    const signDegree = getSignDegree(longitude);
    const nakshatraData = getNakshatraFromLongitude(longitude);
    const sunLongitude = meanPositions['Sun'];

    positions.push({
      planet,
      longitude,
      latitude: 0, // Simplified
      speed: 0, // Simplified
      house: 0, // Will be calculated after houses
      sign,
      signDegree,
      nakshatra: nakshatraData.nakshatra,
      nakshatraPada: nakshatraData.pada,
      isRetrograde: false, // Simplified
      isCombust: isCombust(planet, longitude, sunLongitude),
      dignity: getDignity(planet, sign, signDegree)
    });
  }

  return positions;
}

/**
 * Calculate house cusps using Whole Sign house system
 */
export function calculateHouseCusps(
  ascendant: number,
  planetaryPositions: PlanetaryPosition[]
): House[] {
  const ascendantSign = getSignFromLongitude(ascendant);
  const ascendantIndex = SIGNS.indexOf(ascendantSign);
  const houses: House[] = [];

  for (let i = 0; i < 12; i++) {
    const houseNumber = i + 1;
    const signIndex = (ascendantIndex + i) % 12;
    const sign = SIGNS[signIndex];
    const cuspLongitude = (ascendantIndex + i) * 30;

    // Find planets in this house
    const planetsInHouse = planetaryPositions
      .filter(p => {
        const houseFromAsc = getHouseFromLongitude(p.longitude, ascendant);
        return houseFromAsc === houseNumber;
      })
      .map(p => p.planet);

    houses.push({
      houseNumber,
      sign,
      cuspLongitude,
      planets: planetsInHouse,
      lord: SIGN_LORDS[sign]
    });
  }

  // Update house assignments in planetary positions
  planetaryPositions.forEach(p => {
    p.house = getHouseFromLongitude(p.longitude, ascendant);
  });

  return houses;
}

/**
 * Calculate Julian Day from JavaScript Date
 */
function getJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60;

  let a = Math.floor((14 - month) / 12);
  let y = year + 4800 - a;
  let m = month + 12 * a - 3;

  let jd = day + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  return jd + hour / 24;
}

/**
 * Get Lahiri Ayanamsha for a given date
 */
export function getLahiriAyanamsha(date: Date): number {
  const year = date.getUTCFullYear() + (date.getUTCMonth() + 1) / 12;
  // Simplified Lahiri calculation
  // Precise formula: 23.85° + 50.29" * (year - 2000) / 100
  return 23.85 + 0.01396 * (year - 2000);
}

/**
 * Convert tropical to sidereal (using Lahiri Ayanamsha)
 */
export function tropicalToSidereal(tropicalLongitude: number, date: Date): number {
  const ayanamsha = getLahiriAyanamsha(date);
  return normalizeDegrees(tropicalLongitude - ayanamsha);
}

// ============================================================================
// ASPECT CALCULATIONS
// ============================================================================

export interface Aspect {
  planet1: Planet;
  planet2: Planet;
  aspectType: 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';
  orb: number;
}

export function calculateAspects(positions: PlanetaryPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  const aspectAngles = {
    'conjunction': 0,
    'sextile': 60,
    'square': 90,
    'trine': 120,
    'opposition': 180
  };

  const orbs = {
    'conjunction': 8,
    'sextile': 6,
    'square': 8,
    'trine': 8,
    'opposition': 8
  };

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const p1 = positions[i];
      const p2 = positions[j];

      const diff = Math.abs(normalizeDegrees(p1.longitude - p2.longitude));
      const minDiff = Math.min(diff, 360 - diff);

      for (const [aspect, angle] of Object.entries(aspectAngles)) {
        const orb = Math.abs(minDiff - angle);
        if (orb <= orbs[aspect as keyof typeof orbs]) {
          aspects.push({
            planet1: p1.planet,
            planet2: p2.planet,
            aspectType: aspect as Aspect['aspectType'],
            orb
          });
        }
      }
    }
  }

  return aspects;
}