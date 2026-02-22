/**
 * Spouse Calculations
 * Calculates spouse prediction from chart
 */

import { Chart, Planet, Sign, SpousePrediction, SpouseMeetingPrediction } from '@types';

// Direction mappings from classical Vedic texts
const SIGN_DIRECTIONS: Record<string, string> = {
  'Aries': 'South', 'Taurus': 'South', 'Gemini': 'West', 'Cancer': 'North',
  'Leo': 'East', 'Virgo': 'Southeast', 'Libra': 'West', 'Scorpio': 'South',
  'Sagittarius': 'Northeast', 'Capricorn': 'South', 'Aquarius': 'West', 'Pisces': 'North'
};

const PLANET_DIRECTIONS: Record<string, string> = {
  'Sun': 'East', 'Moon': 'Northwest', 'Mars': 'South', 'Mercury': 'North',
  'Jupiter': 'Northeast', 'Venus': 'Southeast', 'Saturn': 'West',
  'Rahu': 'Southwest', 'Ketu': 'Northeast'
};

const DISTANCE_MAP: Record<number, { level: string; label: string; description: string; context: string; modern: string }> = {
  1: { level: 'very_near', label: 'Same locality', description: 'Spouse from your own community or neighborhood', context: 'Personal activities, gym, training', modern: 'Someone in your daily life' },
  2: { level: 'near', label: 'Family circles', description: 'Through family connections. Same city likely', context: 'Family gathering, family friends', modern: 'Family introduction, community gatherings' },
  3: { level: 'nearby', label: 'Nearby area', description: 'From neighboring area. Siblings/neighbors may connect', context: 'Siblings, messaging, short travel', modern: 'Social media DMs, dating apps, matchmaking' },
  4: { level: 'hometown', label: 'Same hometown', description: 'From native place or early life connections', context: 'Mother, maternal relatives, school', modern: 'School/college alumni, hometown connections' },
  5: { level: 'same_region', label: 'Social circles', description: 'Through entertainment or creative pursuits', context: 'Party, creative event, sports, dating', modern: 'Dating apps, entertainment events' },
  6: { level: 'moderate', label: 'Through service/work', description: 'Met through workplace or challenging circumstances', context: 'Workplace, hospital, charity event', modern: 'Office romance, volunteering' },
  7: { level: 'familiar', label: 'Known circles', description: 'From same social standing, conventional means', context: 'Public event, business meeting', modern: 'Professional networking' },
  8: { level: 'unpredictable', label: 'Unexpected place', description: 'During transformative or crisis situation', context: 'Difficult period, unexpected encounter', modern: 'Unexpected encounter, online mystery' },
  9: { level: 'far', label: 'Different state/culture', description: 'From different cultural background or state', context: 'University, temple, travel, conference', modern: 'Inter-state/international connections' },
  10: { level: 'career_linked', label: 'Through career', description: 'Connected through profession', context: 'Workplace, corporate event', modern: 'LinkedIn, professional conference' },
  11: { level: 'social_network', label: 'Through friends/community', description: 'Introduced through friends or community', context: 'Social club, community org', modern: 'Social media, matrimony sites' },
  12: { level: 'very_far', label: 'Foreign/distant land', description: 'Strong indication of spouse from abroad', context: 'Foreign land, spiritual retreat', modern: 'International dating, met traveling' }
};

const CIRCUMSTANCE_MAP: Record<string, { setting: string; atmosphere: string; examples: string[] }> = {
  'Jupiter': { setting: 'Auspicious ceremony or educational setting', atmosphere: 'Respectful, dignified, blessed', examples: ['Wedding of relative', 'Religious ceremony', 'University campus', 'Cultural function'] },
  'Venus': { setting: 'Romantic or artistic setting', atmosphere: 'Beautiful, pleasurable, luxurious', examples: ['Party or celebration', 'Art exhibition', 'Music concert', 'Fine dining'] },
  'Mars': { setting: 'Competitive or energetic setting', atmosphere: 'Intense, passionate', examples: ['Sports event', 'Gym', 'Competition', 'Heated debate'] },
  'Saturn': { setting: 'Formal or structured setting', atmosphere: 'Serious, practical', examples: ['Professional setting', 'Through family elders', 'During difficult period'] },
  'Mercury': { setting: 'Intellectual or communication-based', atmosphere: 'Witty, conversational', examples: ['Through messaging', 'Workshop', 'Business communication'] },
  'Moon': { setting: 'Emotional or family environment', atmosphere: 'Nurturing, comforting', examples: ['Family event', 'Through mother', 'Support group'] },
  'Sun': { setting: 'Prestigious or authority-linked', atmosphere: 'Grand, impressive', examples: ['Government event', 'Through authority figure', 'Public ceremony'] },
  'Rahu': { setting: 'Unconventional or foreign', atmosphere: 'Surprising, mysterious', examples: ['Online/social media', 'Foreign country', 'Unusual circumstances'] },
  'Ketu': { setting: 'Spiritual or karmic', atmosphere: 'Mystical, past-life feeling', examples: ['Spiritual retreat', 'Chance encounter', 'Feels instantly familiar'] }
};

const RAHU_NAKSHATRAS = ['Ardra', 'Swati', 'Shatabhisha'];
const KETU_NAKSHATRAS = ['Ashwini', 'Magha', 'Mula'];

export function calculateSpouseMeeting(chart: Chart): SpouseMeetingPrediction {
  const seventhHouse = chart.houses.find(h => h.houseNumber === 7);
  const seventhSign = seventhHouse?.sign || 'Libra' as Sign;
  const seventhLord = seventhHouse?.lord || 'Venus' as Planet;
  const planetsIn7th = (seventhHouse?.planets || []) as Planet[];

  const seventhLordPos = chart.planetaryPositions.find(p => p.planet === seventhLord);
  const seventhLordHouse = seventhLordPos?.house || 7;
  const seventhLordSign = seventhLordPos?.sign || seventhSign;

  const d9 = chart.vargaCharts?.D9;
  const d9SeventhHouse = d9?.houses?.find((h: any) => h.houseNumber === 7);
  const d9SeventhLordPos = d9?.planetaryPositions?.find((p: any) => p.planet === seventhLord);
  const d9SeventhSign = d9SeventhHouse?.sign;

  const darakaraka = (chart.specialPoints?.darakaraka as Planet) || 'Venus';
  const dkPos = chart.planetaryPositions.find(p => p.planet === darakaraka);

  const fifthHouse = chart.houses.find(h => h.houseNumber === 5);
  const fifthLord = fifthHouse?.lord;
  const twelfthHouse = chart.houses.find(h => h.houseNumber === 12);
  const twelfthLord = twelfthHouse?.lord;
  const fourthHouse = chart.houses.find(h => h.houseNumber === 4);
  const fourthLord = fourthHouse?.lord;
  const ninthHouse = chart.houses.find(h => h.houseNumber === 9);
  const ninthLord = ninthHouse?.lord;
  const eleventhHouse = chart.houses.find(h => h.houseNumber === 11);
  const eleventhLord = eleventhHouse?.lord;

  // Venus position (for males) and Jupiter position (for females)
  const venusPos = chart.planetaryPositions.find(p => p.planet === 'Venus');
  const jupiterPos = chart.planetaryPositions.find(p => p.planet === 'Jupiter');

  // =================== DIRECTION ===================
  const dirSources: { system: string; direction: string; basis: string }[] = [];

  // Source 1: Sign on 7th cusp
  const signDir = SIGN_DIRECTIONS[seventhSign];
  if (signDir) dirSources.push({ system: 'D1 7th Sign', direction: signDir, basis: `${seventhSign} on 7th house` });

  // Source 2: 7th Lord's rashi
  const lordSignDir = SIGN_DIRECTIONS[seventhLordSign];
  if (lordSignDir) dirSources.push({ system: 'D1 7th Lord', direction: lordSignDir, basis: `7th Lord ${seventhLord} in ${seventhLordSign}` });

  // Source 3: Planets in 7th house
  planetsIn7th.forEach(p => {
    const pDir = PLANET_DIRECTIONS[p];
    if (pDir) dirSources.push({ system: 'Planet in 7th', direction: pDir, basis: `${p} in 7th house` });
  });

  // Source 4: D9 7th sign
  if (d9SeventhSign) {
    const d9Dir = SIGN_DIRECTIONS[d9SeventhSign];
    if (d9Dir) dirSources.push({ system: 'D9 7th Sign', direction: d9Dir, basis: `${d9SeventhSign} on D9 7th house` });
  }

  // Source 5: D9 7th lord position
  if (d9SeventhLordPos?.sign) {
    const d9LordDir = SIGN_DIRECTIONS[d9SeventhLordPos.sign];
    if (d9LordDir) dirSources.push({ system: 'D9 7th Lord', direction: d9LordDir, basis: `7th Lord in D9 ${d9SeventhLordPos.sign}` });
  }

  // Source 6: Darakaraka sign
  if (dkPos?.sign) {
    const dkDir = SIGN_DIRECTIONS[dkPos.sign];
    if (dkDir) dirSources.push({ system: 'Jaimini DK', direction: dkDir, basis: `Darakaraka ${darakaraka} in ${dkPos.sign}` });
  }

  // Count direction frequencies
  const dirCounts: Record<string, number> = {};
  dirSources.forEach(s => { dirCounts[s.direction] = (dirCounts[s.direction] || 0) + 1; });
  const sortedDirs = Object.entries(dirCounts).sort((a, b) => b[1] - a[1]);
  const primaryDir = sortedDirs[0]?.[0] || 'East';
  const secondaryDir = sortedDirs[1]?.[0];
  const dirConfidence = sortedDirs[0]?.[1] >= 3 ? 'high' : sortedDirs[0]?.[1] >= 2 ? 'medium' : 'low';

  // =================== DISTANCE ===================
  const distInfo = DISTANCE_MAP[seventhLordHouse] || DISTANCE_MAP[7];

  // Check foreign yogas
  const foreignIndicators: { name: string; strength: string; interpretation: string }[] = [];

  if (planetsIn7th.includes('Rahu' as Planet)) foreignIndicators.push({ name: 'Rahu in 7th House', strength: 'strong', interpretation: 'Spouse from different culture or foreign background' });
  if (seventhLordHouse === 12) foreignIndicators.push({ name: '7th Lord in 12th House', strength: 'very_strong', interpretation: 'Strong yoga for spouse from foreign land' });
  if (dkPos?.house === 12) foreignIndicators.push({ name: 'Darakaraka in 12th', strength: 'strong', interpretation: 'Spouse from foreign country (Jaimini)' });

  // Check 7th lord conjunct Rahu
  const rahuPos = chart.planetaryPositions.find(p => p.planet === 'Rahu');
  if (rahuPos && seventhLordPos && rahuPos.sign === seventhLordPos.sign) {
    foreignIndicators.push({ name: '7th Lord conjunct Rahu', strength: 'strong', interpretation: 'Inter-caste or foreign marriage likely' });
  }

  // Venus-Rahu or Jupiter-Rahu conjunction
  if (venusPos && rahuPos && venusPos.sign === rahuPos.sign) {
    foreignIndicators.push({ name: 'Venus-Rahu Conjunction', strength: 'moderate', interpretation: 'Attraction to foreign or unconventional partner' });
  }
  if (jupiterPos && rahuPos && jupiterPos.sign === rahuPos.sign) {
    foreignIndicators.push({ name: 'Jupiter-Rahu Conjunction', strength: 'moderate', interpretation: 'Husband from different cultural background' });
  }

  // 12th lord in 7th
  if (twelfthLord && planetsIn7th.includes(twelfthLord as Planet)) {
    foreignIndicators.push({ name: '12th Lord in 7th', strength: 'moderate', interpretation: 'Foreign influence on marriage' });
  }

  // 7th lord in Rahu nakshatra
  const lordNakshatra = seventhLordPos?.nakshatra || '';
  if (RAHU_NAKSHATRAS.includes(lordNakshatra)) {
    foreignIndicators.push({ name: '7th Lord in Rahu Nakshatra', strength: 'moderate', interpretation: 'Unconventional partner origin' });
  }

  const distConfidence = foreignIndicators.length >= 2 ? 'high' : foreignIndicators.length === 1 ? 'medium' : (seventhLordHouse === 12 || seventhLordHouse === 9 ? 'medium' : 'low');

  // =================== MEETING MEDIUM ===================
  const meetingContextPrimary = distInfo.context;
  const meetingModern = distInfo.modern;

  // Build alternatives from planets in 7th
  const alternatives: string[] = [];
  planetsIn7th.forEach(p => {
    const circ = CIRCUMSTANCE_MAP[p];
    if (circ) alternatives.push(...circ.examples.slice(0, 2));
  });

  // Through whom
  let through = 'Conventional means';
  if (seventhLordHouse === 2 || seventhLordHouse === 4) through = 'Family members or relatives';
  else if (seventhLordHouse === 3) through = 'Siblings, neighbors, or communication';
  else if (seventhLordHouse === 5) through = 'Dating, romance, or creative events';
  else if (seventhLordHouse === 6) through = 'Workplace colleagues or service';
  else if (seventhLordHouse === 9) through = 'Education, travel, or spiritual community';
  else if (seventhLordHouse === 10) through = 'Career or professional network';
  else if (seventhLordHouse === 11) through = 'Friends, social media, or community';
  else if (seventhLordHouse === 12) through = 'Foreign connection or online';
  else if (seventhLordHouse === 1) through = 'Self-initiated — personal efforts';

  // =================== CIRCUMSTANCES ===================
  const circumstancePlanet = planetsIn7th[0] || seventhLord;
  const circData = CIRCUMSTANCE_MAP[circumstancePlanet] || CIRCUMSTANCE_MAP['Venus'];

  // Nakshatra flavor
  let nakshatraFlavor: string | undefined;
  let nakshatraEnergy: string | undefined;
  if (lordNakshatra) {
    const fireNaksh = ['Ashwini', 'Bharani', 'Krittika', 'Magha', 'Purva Phalguni', 'Mula', 'Purva Ashadha', 'Uttara Ashadha'];
    const earthNaksh = ['Rohini', 'Mrigashira', 'Hasta', 'Chitra', 'Uttara Phalguni', 'Shravana', 'Dhanishta'];
    const airNaksh = ['Ardra', 'Punarvasu', 'Swati', 'Vishakha', 'Shatabhisha', 'Purva Bhadrapada'];
    const waterNaksh = ['Pushya', 'Ashlesha', 'Anuradha', 'Jyeshtha', 'Uttara Bhadrapada', 'Revati'];

    if (fireNaksh.includes(lordNakshatra)) {
      nakshatraFlavor = 'Sudden, impulsive, passionate first meeting. Love at first sight possible.';
      nakshatraEnergy = 'fast';
    } else if (earthNaksh.includes(lordNakshatra)) {
      nakshatraFlavor = 'Practical, stable setting. Meeting through grounded circumstances.';
      nakshatraEnergy = 'steady';
    } else if (airNaksh.includes(lordNakshatra)) {
      nakshatraFlavor = 'Through communication or chance. Unexpected wind of fate brings you together.';
      nakshatraEnergy = 'variable';
    } else if (waterNaksh.includes(lordNakshatra)) {
      nakshatraFlavor = 'Emotional, nurturing event. Deep feeling of connection from the start.';
      nakshatraEnergy = 'flowing';
    }
  }

  // =================== MARRIAGE TYPE ===================
  const loveYogas: { name: string; present: boolean; description: string }[] = [];
  let loveScore = 0;
  let arrangedScore = 0;

  // 5th-7th Lord Connection
  const fifthLordPos = chart.planetaryPositions.find(p => p.planet === fifthLord);
  const hasFifthSeventhConnection = fifthLord === seventhLord || // Same lord
    fifthLordPos?.sign === seventhLordPos?.sign || // Conjunction
    fifthLordPos?.house === 7 || seventhLordPos?.house === 5; // Exchange
  loveYogas.push({ name: '5th-7th Lord Connection', present: !!hasFifthSeventhConnection, description: hasFifthSeventhConnection ? 'Romance transforms into marriage — classic love marriage yoga' : 'No direct 5th-7th link' });
  if (hasFifthSeventhConnection) loveScore += 3;

  // Venus-Mars Connection
  const marsPos = chart.planetaryPositions.find(p => p.planet === 'Mars');
  const hasVenusMars = venusPos && marsPos && venusPos.sign === marsPos.sign;
  loveYogas.push({ name: 'Venus-Mars Connection', present: !!hasVenusMars, description: hasVenusMars ? 'Passionate attraction leads to relationship' : 'No Venus-Mars connection' });
  if (hasVenusMars) loveScore += 2;

  // Rahu on 5th or 7th
  const rahuOn5or7 = rahuPos && (rahuPos.house === 5 || rahuPos.house === 7);
  loveYogas.push({ name: 'Rahu on 5th/7th', present: !!rahuOn5or7, description: rahuOn5or7 ? 'Unconventional romance, may break social norms for love' : 'No Rahu influence on romance/marriage houses' });
  if (rahuOn5or7) loveScore += 2;

  // 5th Lord in 7th or 7th Lord in 5th
  const fiveSevenExchange = fifthLordPos?.house === 7 || seventhLordPos?.house === 5;
  loveYogas.push({ name: '5th Lord in 7th / 7th Lord in 5th', present: !!fiveSevenExchange, description: fiveSevenExchange ? 'Love affair leads directly to marriage' : 'No direct house exchange' });
  if (fiveSevenExchange) loveScore += 3;

  // Venus in 5th
  const venusIn5 = venusPos?.house === 5;
  loveYogas.push({ name: 'Venus in 5th House', present: !!venusIn5, description: venusIn5 ? 'Strong romantic nature, love relationship likely before marriage' : 'Venus not in 5th' });
  if (venusIn5) loveScore += 2;

  // 4th-7th Connection (Arranged)
  const fourthLordPos = chart.planetaryPositions.find(p => p.planet === fourthLord);
  const hasFourthSeventh = fourthLordPos?.sign === seventhLordPos?.sign || fourthLordPos?.house === 7 || seventhLordPos?.house === 4;
  if (hasFourthSeventh) arrangedScore += 2;

  // 9th-7th Connection (Arranged)
  const ninthLordPos = chart.planetaryPositions.find(p => p.planet === ninthLord);
  const hasNinthSeventh = ninthLordPos?.sign === seventhLordPos?.sign || ninthLordPos?.house === 7 || seventhLordPos?.house === 9;
  if (hasNinthSeventh) arrangedScore += 2;

  // Saturn in 7th (Arranged)
  if (planetsIn7th.includes('Saturn' as Planet)) arrangedScore += 1;

  // Jupiter aspect on 7th (Arranged) — Jupiter aspects 5th, 7th, 9th from itself
  if (jupiterPos) {
    const jupHouse = jupiterPos.house || 0;
    if ([jupHouse + 4, jupHouse + 6, jupHouse + 8].map(h => ((h - 1) % 12) + 1).includes(7)) arrangedScore += 1;
  }

  // No 5th-7th link (Arranged)
  if (!hasFifthSeventhConnection && !fiveSevenExchange && !venusIn5) arrangedScore += 1;

  let marriageType: 'love' | 'arranged' | 'mixed' = 'mixed';
  let marriageDesc = 'A mix of personal choice and family involvement in spouse selection';
  if (loveScore >= 5 && loveScore > arrangedScore * 2) {
    marriageType = 'love';
    marriageDesc = 'Strong indications of love marriage. Romance and personal choice will drive spouse selection';
  } else if (arrangedScore >= 4 && arrangedScore > loveScore) {
    marriageType = 'arranged';
    marriageDesc = 'Family and traditional processes will play the dominant role in finding your spouse';
  } else if (loveScore > arrangedScore) {
    marriageType = 'love';
    marriageDesc = 'Love marriage likely with some family support. Romance will lead the way';
  } else if (arrangedScore > loveScore) {
    marriageType = 'arranged';
    marriageDesc = 'Arranged marriage likely, though personal preferences will be considered';
  }

  const mtConfidence = Math.abs(loveScore - arrangedScore) >= 3 ? 'high' : Math.abs(loveScore - arrangedScore) >= 1 ? 'medium' : 'low';

  return {
    direction: {
      primary: primaryDir,
      secondary: secondaryDir,
      confidence: dirConfidence as 'high' | 'medium' | 'low',
      sources: dirSources
    },
    distance: {
      level: distInfo.level as any,
      label: distInfo.label,
      description: distInfo.description,
      foreignIndicators,
      confidence: distConfidence as 'high' | 'medium' | 'low'
    },
    meetingMedium: {
      primary: meetingContextPrimary,
      alternatives: alternatives.length > 0 ? alternatives : ['Social gathering', 'Through common connections'],
      through,
      modernInterpretation: meetingModern
    },
    circumstances: {
      setting: circData.setting,
      atmosphere: circData.atmosphere,
      examples: circData.examples,
      nakshatraFlavor,
      nakshatraEnergy
    },
    marriageType: {
      type: marriageType,
      confidence: mtConfidence,
      yogas: loveYogas,
      description: marriageDesc
    }
  };
}


export function calculateSpousePrediction(chart: Chart): SpousePrediction {
  const seventhHouse = chart.houses.find(h => h.houseNumber === 7);
  const seventhSign = seventhHouse?.sign || 'Libra' as Sign;
  const seventhLord = seventhHouse?.lord || 'Venus' as Planet;
  const planetsIn7th = (seventhHouse?.planets || []) as Planet[];

  const d9 = chart.vargaCharts?.D9;
  const d9SeventhHouse = d9?.houses?.find((h: any) => h.houseNumber === 7);

  // Logic for profession
  // Dominant planet: Planet in 7th House (especially closest to cusp) > 7th Lord
  const dominantPlanet = planetsIn7th.length > 0 ? planetsIn7th[0] : seventhLord;
  const profession = analyzeProfession(dominantPlanet);

  return {
    profileName: chart.name || 'You',
    seventhHouse: {
      sign: seventhSign,
      lord: seventhLord,
      planets: planetsIn7th,
      spouseNature: getSpouseNature(seventhSign, planetsIn7th),
      spouseAppearance: getSpouseAppearance(seventhLord, planetsIn7th),
      spouseTraits: getSpouseTraits(seventhSign, planetsIn7th),
      element: getElementFromSign(seventhSign),
      seventhLordDetails: {
        d1: {
          sign: chart.planetaryPositions.find(p => p.planet === seventhLord)?.sign || 'Unknown',
          house: chart.planetaryPositions.find(p => p.planet === seventhLord)?.house || 0,
          description: getSeventhLordPlacementInterpretation(
            seventhLord,
            chart.planetaryPositions.find(p => p.planet === seventhLord)?.house || 0
          ).description,
          interpretation: getSeventhLordPlacementInterpretation(
            seventhLord,
            chart.planetaryPositions.find(p => p.planet === seventhLord)?.house || 0
          )
        },
        d9: {
          sign: d9?.planetaryPositions.find((p: any) => p.planet === seventhLord)?.sign || 'Unknown',
          house: d9?.planetaryPositions.find((p: any) => p.planet === seventhLord)?.house || 0,
          description: `7th Lord ${seventhLord} in D9 is placed in ${(d9?.planetaryPositions.find((p: any) => p.planet === seventhLord)?.sign) || 'Unknown'}`,
          interpretation: d9 ? getSeventhLordPlacementInterpretation(
            seventhLord,
            d9.planetaryPositions.find((p: any) => p.planet === seventhLord)?.house || 0
          ) : undefined
        }
      }
    },
    darakaraka: {
      planet: (chart.specialPoints?.darakaraka as Planet) || 'Venus',
      sign: (chart.planetaryPositions.find(p => p.planet === chart.specialPoints?.darakaraka)?.sign as Sign) || 'Libra',
      house: chart.planetaryPositions.find(p => p.planet === chart.specialPoints?.darakaraka)?.house || 7,
      spouseCharacteristics: 'Brings specific karmic lessons and traits based on the Darakaraka planet.'
    },
    navamsaSeventh: {
      sign: d9SeventhHouse?.sign || 'Libra',
      planets: (d9SeventhHouse?.planets || []) as Planet[],
      marriageQuality: 'Navamsa indicates the underlying strength and sustenance of marriage.'
    },
    upapadaLagna: {
      sign: (chart.specialPoints?.upapadaLagna as Sign) || 'Libra',
      planets: [], // Placeholder
      timing: 'Upapada Lagna helps in determining the timing and nature of spouse.'
    },
    predictions: generatePredictions(seventhHouse?.sign || 'Libra', planetsIn7th, seventhLord),
    physique: getSpousePhysique(seventhLord, planetsIn7th, seventhHouse?.sign || 'Libra'),
    profession,
    meetingPrediction: calculateSpouseMeeting(chart)
  };
}

export function analyzeProfession(planet: Planet): NonNullable<SpousePrediction['profession']> {
  const professionMap: Record<string, any> = {
    'Sun': {
      field: 'Government or Administration',
      description: 'The spouse is likely to hold a position of authority or work in a prominent public role.',
      careerNature: 'Government'
    },
    'Moon': {
      field: 'Social Services or Arts',
      description: 'A career involving public care, hospitality, emotional intelligence, or creative fields.',
      careerNature: 'Service'
    },
    'Mars': {
      field: 'Engineering, Technical or Uniformed Services',
      description: 'Physical or technical work requiring energy, leadership, and discipline.',
      careerNature: 'Service'
    },
    'Mercury': {
      field: 'Business, IT or Communication',
      description: 'Intellectual career involving numbers, logic, trade, or tech-enabled services.',
      careerNature: 'Business'
    },
    'Jupiter': {
      field: 'Law, Finance, Education or Advisory',
      description: 'Respected role involving wisdom, ethics, law, or high-level financial planning.',
      careerNature: 'Self-Employed'
    },
    'Venus': {
      field: 'Creative Arts, Fashion or Finance',
      description: 'Profession related to aesthetics, luxury, arts, or high-end hospitality.',
      careerNature: 'Creative'
    },
    'Saturn': {
      field: 'Technical, Corporate or Large-scale Manufacturing',
      description: 'Stable, long-term career requiring persistence, possibly in infrastructure or traditional industries.',
      careerNature: 'Service'
    },
    'Rahu': {
      field: 'Technology, Innovation or Foreign Trade',
      description: 'Unconventional career working with modern technology or global markets.',
      careerNature: 'Self-Employed'
    },
    'Ketu': {
      field: 'Spiritual, Research or Detail-oriented Science',
      description: 'Career focused on deep research, healing, coding, or metaphysical fields.',
      careerNature: 'Service'
    },
    'Neptune': {
      field: 'Spiritual, Creative Arts or Psychic/Intuitive',
      description: 'Highly creative and visionary career, often in films, photography, healing, or spiritual domains.',
      careerNature: 'Creative'
    },
    'Uranus': {
      field: 'Modern Tech, Space or Humanitarian Innovation',
      description: 'Breakthrough career working with advanced technology, astrology, or unique scientific fields.',
      careerNature: 'Self-Employed'
    },
    'Pluto': {
      field: 'Research, Investigation or Transformation',
      description: 'Career involving deep transformation, intense research, secret services, or power dynamics.',
      careerNature: 'Business'
    }
  };

  const data = professionMap[planet] || {
    field: 'General Professional',
    description: 'Working in a stable and respectable professional capacity.',
    careerNature: 'Service'
  };

  return {
    ...data,
    relatedPlanets: [planet]
  };
}

function getSpouseNature(sign: Sign, planets: Planet[]): string {
  const signNature = {
    'Aries': 'Active and energetic',
    'Taurus': 'Stable and reliable',
    'Gemini': 'Communicative and youthful',
    'Cancer': 'Nurturing and sensitive',
    'Leo': 'Confident and generous',
    'Virgo': 'Practical and detail-oriented',
    'Libra': 'Balanced and social',
    'Scorpio': 'Deep and intense',
    'Sagittarius': 'Optimistic and philosophical',
    'Capricorn': 'Disciplined and traditional',
    'Aquarius': 'Original and humanitarian',
    'Pisces': 'Compassionate and spiritual'
  }[sign] || 'Balanced';

  if (planets.length > 0) {
    return `${signNature} with a ${planets[0]} influence.`;
  }
  return `${signNature} personality.`;
}

function getSpouseAppearance(lord: Planet, planets: Planet[]): string {
  if (planets.includes('Neptune')) return 'Mystical aura with dreamy, expressive eyes and a glamorous look.';
  if (planets.includes('Venus')) return 'Attractive personality with a charming smile and refined features.';
  if (planets.includes('Jupiter')) return 'Dignified and graceful appearance with a broad forehead.';
  return 'Pleasant and balanced physical appearance.';
}

function getSpouseTraits(sign: Sign, planets: Planet[]): string[] {
  const baseTraits: Record<string, string[]> = {
    'Aries': ['Energetic', 'Brave', 'Independent'],
    'Taurus': ['Patient', 'Stable', 'Appreciative'],
    'Gemini': ['Witty', 'Adaptable', 'Clever'],
    'Cancer': ['Caring', 'Nurturing', 'Family-oriented'],
    'Leo': ['Noble', 'Proud', 'Generous'],
    'Virgo': ['Practical', 'Dedicated', 'Helpful'],
    'Libra': ['Charming', 'Diplomatic', 'Graceful'],
    'Scorpio': ['Intuitive', 'Private', 'Resilient'],
    'Sagittarius': ['Honest', 'Adventurous', 'Philosophical'],
    'Capricorn': ['Ambitious', 'Hardworking', 'Wise'],
    'Aquarius': ['Original', 'Rebellious', 'Humanitarian'],
    'Pisces': ['Creative', 'Spiritual', 'Compassionate']
  };

  const traits = [...(baseTraits[sign] || ['Supportive', 'Kind'])];
  if (planets.includes('Neptune')) traits.push('Visionary', 'Dreamy');
  if (planets.includes('Jupiter')) traits.push('Wise', 'Ethical');
  return traits;
}

function generatePredictions(sign: Sign, planets: Planet[], lord: Planet): string[] {
  const items = [
    'Spouse will be helpful and supportive in your endeavors.',
    'Relationship will be built on the foundation of mutual respect.'
  ];
  if (planets.includes('Neptune')) items.push('There will be a deep soul-level connection between you and your spouse.');
  if (lord === 'Jupiter') items.push('Spouse will bring wisdom and growth to your life.');
  return items;
}

function getSpousePhysique(lord: Planet, planets: Planet[], sign: Sign): SpousePrediction['physique'] {
  const base: SpousePrediction['physique'] = {
    height: 'average',
    build: 'average',
    complexion: 'fair',
    eyeColor: 'brown',
    hairType: 'straight',
    notableFeatures: ['Pleasant smile'],
    appearance: ['Elegant'],
    faceShape: getFaceShape(sign),
    skinTexture: getSkinTexture(sign)
  };

  if (planets.includes('Neptune')) {
    base.notableFeatures.push('Dreamy eyes');
    base.appearance.push('Ethereal');
  }

  return base;
}

function getElementFromSign(sign: Sign): 'Fire' | 'Earth' | 'Air' | 'Water' {
  const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
  const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
  const airSigns = ['Gemini', 'Libra', 'Aquarius'];
  if (fireSigns.includes(sign)) return 'Fire';
  if (earthSigns.includes(sign)) return 'Earth';
  if (airSigns.includes(sign)) return 'Air';
  return 'Water';
}

function getFaceShape(sign: Sign): string {
  const shapes: Record<string, string> = {
    'Aries': 'Diamond or Triangular',
    'Taurus': 'Round or Square',
    'Gemini': 'Oval',
    'Cancer': 'Round',
    'Leo': 'Oval or Broad forehead',
    'Virgo': 'Oval',
    'Libra': 'Oval or Heart',
    'Scorpio': 'Square or Intense',
    'Sagittarius': 'Long or Oval',
    'Capricorn': 'Square or Bony',
    'Aquarius': 'Oval or Unique',
    'Pisces': 'Round or Soft'
  };
  return shapes[sign] || 'Oval';
}
export interface LordPlacementInterpretation {
  description: string;
  impactScore: number; // -1 to 1 (Negative to Positive)
  riskFactors: string[];
}

export function getSeventhLordPlacementInterpretation(lord: Planet, houseNumber: number): LordPlacementInterpretation {
  let description = '';
  let impactScore = 0;
  let riskFactors: string[] = [];

  switch (houseNumber) {
    case 1:
      description = `7th Lord in the 1st House indicates a strong connection between you and your partner. Relationships are a core part of your identity. You may seek a partner who reflects your own personality or ideals.`;
      impactScore = 0.8;
      break;
    case 2:
      description = `7th Lord in the 2nd House suggests wealth accumulation through marriage or a partner from a wealthy family. However, it can also indicate possessiveness or family interference in relationships.`;
      impactScore = 0.5;
      break;
    case 3:
      description = `7th Lord in the 3rd House indicates a partner who is communicative, courageous, or perhaps a neighbor/childhood friend. It can also suggest struggles or efforts required to maintain relationship harmony.`;
      impactScore = 0.4;
      break;
    case 4:
      description = `7th Lord in the 4th House brings domestic happiness and a partner who is nurturing. It connects marriage with home life, emotional security, and property. A strong placement here suggests a happy married life.`;
      impactScore = 0.9;
      break;
    case 5:
      description = `7th Lord in the 5th House is a classic indicator of love marriage or a romantic, creative partner. It suggests a strong intellectual and emotional bond, though it can sometimes delay marriage if afflicted.`;
      impactScore = 0.8;
      break;
    case 6:
      description = `7th Lord in the 6th House is challenging (Dusthana). It can indicate conflict, disagreements, or a partner with health issues. Relationships may require significant effort, service, or resolving debts/disputes.`;
      impactScore = -0.6;
      riskFactors.push('Potential for Conflict/Separation');
      break;
    case 7:
      description = `7th Lord in the 7th House (Swakshetra/Own House) is excellent (if not afflicted). It creates a "Maha Purusha Yoga" potential, indicating a strong, supportive, and stable marriage with a capable partner.`;
      impactScore = 1.0;
      break;
    case 8:
      description = `7th Lord in the 8th House is a difficult placement (Dusthana). It connects marriage with secrecy, transformation, or sudden events. It can indicate financial gains from partner but often brings emotional intensity or longevity concerns for the relationship.`;
      impactScore = -0.7;
      riskFactors.push('Secrecy/Transformation Challenges');
      break;
    case 9:
      description = `7th Lord in the 9th House is highly auspicious (Bhagya). It suggests a lucky partner, spiritual connection, or benefits from marriage. The partner may be from a different culture or bring wisdom and prosperity.`;
      impactScore = 0.95;
      break;
    case 10:
      description = `7th Lord in the 10th House specifically connects marriage with career and public status. Your partner may be career-oriented, successful, or you may meet them through work. Marriage enhances your social standing.`;
      impactScore = 0.85;
      break;
    case 11:
      description = `7th Lord in the 11th House indicates gains through marriage, fulfillment of desires, and a friendly relationship with the spouse. The partner may be from a large social circle or bring financial benefits.`;
      impactScore = 0.9;
      break;
    case 12:
      description = `7th Lord in the 12th House is a sensitive placement (Dusthana). It can indicate separation, loss, or a partner from a foreign land. On the positive side, it can show strong bed pleasures (Sayana Sukha) but requires care to avoid emotional distance.`;
      impactScore = -0.5;
      riskFactors.push('Potential for Separation/Distance');
      break;
    default:
      description = `7th Lord placement in House ${houseNumber} provides unique karmic influences.`;
      impactScore = 0;
  }

  return { description, impactScore, riskFactors };
}

function getSkinTexture(sign: Sign): string {
  const textures: Record<string, string> = {
    'Aries': 'Ruddy, may have marks',
    'Taurus': 'Soft, smooth',
    'Gemini': 'Fair, dry',
    'Cancer': 'Pale, soft',
    'Leo': 'Golden, glowing',
    'Virgo': 'Smooth, pale',
    'Libra': 'Fair, balanced',
    'Scorpio': 'Oily or intense',
    'Sagittarius': 'Glowing, healthy',
    'Capricorn': 'Dry, wrinkly',
    'Aquarius': 'Dry, electric',
    'Pisces': 'Soft, lustrous'
  };
  return textures[sign] || 'Normal';
}
