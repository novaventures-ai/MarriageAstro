/**
 * Jaimini Astrology System
 * Phase 2.4: Chara Karakas, Chara Dasha, Vivah Saham, Upapada Lagna
 */

import { Planet, Sign, CharaDashaPeriod } from '@types';
import { SIGNS, SIGN_LORDS, getSignFromLongitude, normalizeDegrees } from './coreCalculations';

// ============================================================================
// CHARA KARAKA CALCULATIONS
// ============================================================================

/**
 * Calculate Chara Karakas based on planetary degrees
 * Planets are ordered by highest to lowest degree
 */
export function calculateCharaKarakas(
  planetaryPositions: { planet: Planet; longitude: number; sign: Sign; house: number }[]
): import('@types').CharaKarakas {
  // Filter out Rahu and Ketu for Karaka calculation (sometimes included)
  // Traditional Jaimini uses 7 karakas from 7 planets (Sun to Saturn)
  const validPlanets = planetaryPositions.filter(
    p => !['Rahu', 'Ketu', 'Uranus', 'Neptune', 'Pluto'].includes(p.planet)
  );

  // Sort by degree (highest first)
  const sorted = [...validPlanets].sort((a, b) => {
    const degA = a.longitude % 30;
    const degB = b.longitude % 30;
    return degB - degA;
  });

  const getDetail = (index: number) => {
    const p = sorted[index] || sorted[0];
    return {
      planet: p.planet,
      degree: p.longitude % 30,
      sign: p.sign,
      house: p.house,
      interpretation: `${p.planet} acts as a key significator in this role.`
    };
  };

  return {
    atmakaraka: getDetail(0),
    amatyakaraka: getDetail(1),
    bhratrukaraka: getDetail(2),
    matrukaraka: getDetail(3),
    pitrukaraka: getDetail(4),
    putrakaraka: getDetail(5),
    darakaraka: getDetail(6)
  };
}

/**
 * Analyze Darakaraka (Spouse Significator)
 */
export function analyzeDarakaraka(
  darakaraka: Planet,
  darakarakaPosition: { sign: Sign; house: number }
): {
  planetNature: string;
  houseSignificance: string;
  spouseCharacteristics: string;
} {
  const planetNature: Record<Planet, string> = {
    'Sun': 'Authoritative, dignified, government/management background, respected',
    'Moon': 'Nurturing, emotional, caring, motherly/fatherly nature, changeable',
    'Mars': 'Active, energetic, assertive, possibly military/athletic, passionate',
    'Mercury': 'Intelligent, communicative, business-minded, youthful, analytical',
    'Jupiter': 'Wise, spiritual, teacher/guide, generous, philosophical',
    'Venus': 'Artistic, romantic, beautiful/handsome, pleasure-loving, cultured',
    'Saturn': 'Mature, serious, hardworking, older, disciplined, practical',
    'Rahu': 'Foreign, unconventional, ambitious, mysterious, sudden changes',
    'Ketu': 'Spiritual, detached, mystical, intuitive, past-life connection',
    'Uranus': 'Independent, unconventional, freedom-loving, unusual',
    'Neptune': 'Idealistic, spiritual, artistic, dreamy, boundary-less',
    'Pluto': 'Intense, transformative, powerful, deep, controlling'
  };

  const houseSignificance: Record<number, string> = {
    1: 'Spouse significantly impacts self-identity; partner is very independent',
    2: 'Spouse brings wealth or family connections; emphasis on family values',
    3: 'Spouse is courageous, communicative, possibly younger sibling-like',
    4: 'Spouse provides emotional security; strong domestic focus',
    5: 'Spouse is creative, romantic, or connected to children/intelligence',
    6: 'Challenging placement - spouse may bring obstacles or health issues',
    7: 'Excellent for marriage - spouse is true partner; strong relationship',
    8: 'Transformation through marriage; intense but potentially difficult',
    9: 'Spouse brings fortune, wisdom, or foreign connections; dharma alignment',
    10: 'Spouse influences career or is career-oriented; public marriage',
    11: 'Spouse brings gains, fulfillment of desires; good financial partnership',
    12: 'Spouse may be from foreign land or spiritual; possible separation themes'
  };

  return {
    planetNature: planetNature[darakaraka],
    houseSignificance: houseSignificance[darakarakaPosition.house],
    spouseCharacteristics: `${planetNature[darakaraka]} in ${houseSignificance[darakarakaPosition.house]}`
  };
}

// ============================================================================
// UPAPADA LAGNA CALCULATIONS
// ============================================================================

export interface UpapadaLagna {
  ul: Sign;
  ul2: Sign;
  ul3: Sign;
  calculation: string;
  interpretation: {
    spouseFamily: string;
    marriageQuality: string;
  };
}

/**
 * Calculate Upapada Lagna (UL) and its sequences
 */
export function calculateUpapadaLagna(
  ascendant: number,
  houses: { sign: Sign; cuspLongitude: number }[]
): UpapadaLagna {
  // Step 1: Identify 12th house from Ascendant
  const twelfthHouseIndex = 11; // 12th house is index 11
  const twelfthHouse = houses[twelfthHouseIndex];
  const twelfthSign = twelfthHouse.sign;
  const twelfthLord = SIGN_LORDS[twelfthSign];

  // Step 2: Find 12th lord's position
  // For this, we need the longitude - simplified here
  const twelfthLordPosition = twelfthHouseIndex * 30 + 15; // Simplified

  // Step 3: Count houses from 12th to its lord
  const twelfthSignIndex = SIGNS.indexOf(twelfthSign);
  // Simplified - in reality, find where the lord is placed
  const lordHouseIndex = twelfthSignIndex; // Simplified
  const count = (lordHouseIndex - twelfthSignIndex + 12) % 12;
  const effectiveCount = count === 0 ? 12 : count;

  // Step 4: Count same distance forward from the lord
  const ulSignIndex = (twelfthSignIndex + effectiveCount) % 12;
  const ul = SIGNS[ulSignIndex];

  // Calculate UL2 (8th from UL) and UL3 (8th from UL2)
  const ul2Index = (ulSignIndex + 7) % 12; // 8th house
  const ul2 = SIGNS[ul2Index];

  const ul3Index = (ul2Index + 7) % 12;
  const ul3 = SIGNS[ul3Index];

  // Interpretation
  const ulInterpretation: Record<Sign, { spouseFamily: string; marriageQuality: string }> = {
    'Aries': {
      spouseFamily: 'Active, independent, possibly military/defense background',
      marriageQuality: 'Dynamic but may have conflicts; need for patience'
    },
    'Taurus': {
      spouseFamily: 'Wealthy, artistic, stable, business-oriented',
      marriageQuality: 'Stable and prosperous; sensual and material comfort'
    },
    'Gemini': {
      spouseFamily: 'Intellectual, communicative, business, multiple interests',
      marriageQuality: 'Mentally stimulating but may lack depth; good communication'
    },
    'Cancer': {
      spouseFamily: 'Nurturing, emotional, traditional, water-related professions',
      marriageQuality: 'Emotionally deep; family-oriented; may be moody'
    },
    'Leo': {
      spouseFamily: 'Dignified, authoritative, creative, leadership background',
      marriageQuality: 'Proud and loyal; dramatic expressions; strong bond'
    },
    'Virgo': {
      spouseFamily: 'Service-oriented, analytical, health professions, practical',
      marriageQuality: 'Practical and service-based; attention to details; health focus'
    },
    'Libra': {
      spouseFamily: 'Artistic, diplomatic, business, legal, balanced',
      marriageQuality: 'Harmonious and balanced; diplomatic; partnership-focused'
    },
    'Scorpio': {
      spouseFamily: 'Intense, secretive, research-oriented, transformative',
      marriageQuality: 'Deep and transformative; potential for secrets; intense intimacy'
    },
    'Sagittarius': {
      spouseFamily: 'Spiritual, philosophical, teaching, foreign connections',
      marriageQuality: 'Adventurous and philosophical; freedom-loving; spiritual growth'
    },
    'Capricorn': {
      spouseFamily: 'Traditional, hardworking, government/corporate, disciplined',
      marriageQuality: 'Serious and committed; may delay marriage; stable long-term'
    },
    'Aquarius': {
      spouseFamily: 'Unconventional, humanitarian, scientific, intellectual',
      marriageQuality: 'Unconventional relationship; friendship base; need for space'
    },
    'Pisces': {
      spouseFamily: 'Spiritual, artistic, healing professions, compassionate',
      marriageQuality: 'Spiritual and compassionate; boundary issues; soul connection'
    }
  };

  return {
    ul,
    ul2,
    ul3,
    calculation: `12th sign: ${twelfthSign}, 12th lord: ${twelfthLord}, UL: ${ul}`,
    interpretation: (ulInterpretation as any)[ul]
  };
}

/**
 * Check for multiple marriage indicators through UL sequence
 */
export function checkMultipleMarriageIndicators(
  upapadaLagna: UpapadaLagna,
  seventhHousePlanets: Planet[]
): {
  hasIndicators: boolean;
  count: number;
  reasons: string[];
} {
  const reasons: string[] = [];
  let count = 0;

  // Check if UL is in dual sign
  const dualSigns: Sign[] = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];
  if (dualSigns.includes(upapadaLagna.ul)) {
    reasons.push('UL in dual sign indicates potential for multiple marriages');
    count++;
  }

  // Check if UL2 is activated (has planets or aspects)
  // Simplified check
  if (seventhHousePlanets.length > 0) {
    reasons.push('Planets in 7th house affecting UL2');
    count++;
  }

  // Multiple planets in 7th or 12th
  if (seventhHousePlanets.length > 1) {
    reasons.push('Multiple planets in relationship houses');
    count++;
  }

  return {
    hasIndicators: count > 0,
    count,
    reasons
  };
}

// ============================================================================
// VIVAH SAHAM CALCULATION
// ============================================================================

/**
 * Calculate Vivah Saham - Sensitive point for marriage
 * Formula: Venus longitude - Sun longitude + Ascendant longitude
 */
export function calculateVivahSaham(
  venusLongitude: number,
  sunLongitude: number,
  ascendantLongitude: number
): {
  longitude: number;
  sign: Sign;
  interpretation: string;
} {
  let saham = venusLongitude - sunLongitude + ascendantLongitude;
  saham = normalizeDegrees(saham);

  const sign = getSignFromLongitude(saham);

  const interpretations: Record<Sign, string> = {
    'Aries': 'Marriage may be dynamic and passionate',
    'Taurus': 'Stable and prosperous marriage',
    'Gemini': 'Mentally stimulating marriage; possible duality',
    'Cancer': 'Emotionally nurturing marriage',
    'Leo': 'Dramatic and proud marriage',
    'Virgo': 'Practical and service-oriented marriage',
    'Libra': 'Harmonious and balanced marriage',
    'Scorpio': 'Intense and transformative marriage',
    'Sagittarius': 'Adventurous and philosophical marriage',
    'Capricorn': 'Serious and committed marriage',
    'Aquarius': 'Unconventional friendship-based marriage',
    'Pisces': 'Spiritual and compassionate marriage'
  };

  return {
    longitude: saham,
    sign,
    interpretation: (interpretations as any)[sign]
  };
}

// ============================================================================
// CHARA DASHA (DETAILED)
// ============================================================================

/**
 * Calculate detailed Chara Dasha with proper years
 */
export function calculateDetailedCharaDasha(
  ascendantSign: Sign,
  planetaryPositions: { planet: Planet; longitude: number }[],
  birthDate: Date
): CharaDashaPeriod[] {
  const ascendantIndex = SIGNS.indexOf(ascendantSign);
  const periods: CharaDashaPeriod[] = [];

  // Determine direction
  const movableSigns = [0, 3, 6, 9]; // Aries, Cancer, Libra, Capricorn
  const fixedSigns = [1, 4, 7, 10];  // Taurus, Leo, Scorpio, Aquarius
  const dualSigns = [2, 5, 8, 11];   // Gemini, Virgo, Sagittarius, Pisces

  let isForward = true;
  if (fixedSigns.includes(ascendantIndex)) {
    isForward = false;
  } else if (dualSigns.includes(ascendantIndex)) {
    // For dual signs, check if 6th from ascendant has more planets
    // Simplified: assume forward for dual signs
    isForward = true;
  }

  // Calculate dasha for each sign
  let currentDate = new Date(birthDate);

  for (let i = 0; i < 12; i++) {
    let signIndex: number;
    if (isForward) {
      signIndex = (ascendantIndex + i) % 12;
    } else {
      signIndex = (ascendantIndex - i + 12) % 12;
    }

    const sign = SIGNS[signIndex];
    const years = calculateCharaDashaYears(sign, planetaryPositions);

    const endDate = new Date(currentDate);
    endDate.setFullYear(endDate.getFullYear() + years);

    periods.push({
      sign: sign as any,
      startDate: new Date(currentDate),
      endDate,
      durationYears: years,
      isCurrent: false
    });

    currentDate = endDate;
  }

  // Mark current period
  const now = new Date();
  periods.forEach(d => {
    d.isCurrent = now >= d.startDate && now < d.endDate;
  });

  return periods;
}

/**
 * Calculate years for a Chara Dasha sign
 */
function calculateCharaDashaYears(
  sign: Sign,
  planetaryPositions: { planet: Planet; longitude: number }[]
): number {
  const signLord = SIGN_LORDS[sign];
  const signIndex = SIGNS.indexOf(sign);

  // Find lord's position
  const lordPosition = planetaryPositions.find(p => p.planet === signLord);

  if (!lordPosition) return 7;

  // Calculate houses from sign to lord
  const lordSignIndex = Math.floor(lordPosition.longitude / 30);
  let housesFromSign = (lordSignIndex - signIndex + 12) % 12;
  if (housesFromSign === 0) housesFromSign = 12;

  // Exception for Scorpio and Aquarius (dual lordship)
  if (sign === 'Scorpio' || sign === 'Aquarius') {
    // Check both lords (Mars/Ketu for Scorpio, Saturn/Rahu for Aquarius)
    // Simplified - just use standard calculation
  }

  return housesFromSign;
}