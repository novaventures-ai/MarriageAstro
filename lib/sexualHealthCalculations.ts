/**
 * Sexual Health Analysis Module
 * Phase 2.5: PME, ED, Frigidity Indicators and Satisfaction Assessment
 */
import { Chart, Planet, SexualHealthAnalysis } from '@types';
import { normalizeDegrees } from './coreCalculations';
import sexualHealthRulesImport from '../knowledge/sexual_health_rules.json';

const sexualHealthRules = (sexualHealthRulesImport as any).default || sexualHealthRulesImport;

// ============================================================================
// MALE SEXUAL HEALTH ASSESSMENT
// ============================================================================

export function analyzeMaleSexualHealth(chart: Chart): {
  pmeRisk: 'Low' | 'Medium' | 'High';
  edRisk: 'Low' | 'Medium' | 'High';
  indicators: string[];
  recommendations: string[];
} {
  const indicators: string[] = [];
  const recommendations: string[] = [];
  const rules = (sexualHealthRules as any).male_sexual_health;

  const sun = chart.planetaryPositions.find(p => p.planet === 'Sun');
  const mars = chart.planetaryPositions.find(p => p.planet === 'Mars');
  const venus = chart.planetaryPositions.find(p => p.planet === 'Venus');
  const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');
  const mercury = chart.planetaryPositions.find(p => p.planet === 'Mercury');
  const ketu = chart.planetaryPositions.find(p => p.planet === 'Ketu');

  // PME (Premature Ejaculation) Indicators
  let pmeRiskScore = 0;
  const pmeRules = rules.premature_ejaculation_pme.indicators;

  // Venus conjunct Mars
  if (venus && mars) {
    const diff = Math.abs(normalizeDegrees(venus.longitude - mars.longitude));
    if (diff < 10) {
      const rule = pmeRules.find((r: any) => r?.condition === 'Venus conjunct Mars');
      if (rule) indicators.push((rule.condition || 'Venus conjunct Mars') + ': ' + (rule.explanation || ''));
      pmeRiskScore += 40;
    }
  }

  // Venus conjunct Ketu
  if (venus && ketu) {
    const diff = Math.abs(normalizeDegrees(venus.longitude - ketu.longitude));
    if (diff < 10) {
      const rule = pmeRules.find((r: any) => r?.condition === 'Venus conjunct Ketu');
      if (rule) indicators.push((rule.condition || 'Venus conjunct Ketu') + ': ' + (rule.explanation || ''));
      pmeRiskScore += 35;
    }
  }

  // Venus in Fire sign
  if (venus && ['Aries', 'Leo', 'Sagittarius'].includes(venus.sign)) {
    const rule = pmeRules.find((r: any) => r?.condition?.includes('Venus in Fire sign'));
    if (rule) indicators.push((rule.condition || 'Venus in Fire sign') + ': ' + (rule.explanation || ''));
    pmeRiskScore += 20;
  }

  // Mars in 7th or 8th house
  if (mars && (mars.house === 7 || mars.house === 8)) {
    const rule = pmeRules.find((r: any) => r?.condition?.includes('Mars in 7th or 8th house'));
    if (rule) indicators.push((rule.condition || 'Mars in 7th or 8th house') + ': ' + (rule.explanation || ''));
    pmeRiskScore += 20;
  }

  // ED (Erectile Dysfunction) Indicators
  let edRiskScore = 0;
  const edRules = rules.erectile_dysfunction_ed.indicators;

  // Sun debilitated or in Dusthana
  if (sun && (sun.dignity === 'debilitated' || [6, 8, 12].includes(sun.house))) {
    const rule = edRules.find((r: any) => r?.condition?.includes('Sun debilitated'));
    if (rule) indicators.push((rule.condition || 'Sun debilitated') + ': ' + (rule.explanation || ''));
    edRiskScore += 35;
    recommendations.push('Strengthen Sun through Surya Namaskar and lifestyle changes');
  }

  // Sun-Saturn influence
  if (sun && saturn) {
    const diff = Math.abs(normalizeDegrees(sun.longitude - saturn.longitude));
    if (diff < 10) {
      const rule = edRules.find((r: any) => r?.condition?.includes('Sun-Saturn conjunction'));
      if (rule) indicators.push((rule.condition || 'Sun-Saturn conjunction') + ': ' + (rule.explanation || ''));
      edRiskScore += 40;
      recommendations.push('Remedies for Sun-Saturn conjunction: Donate on Saturdays');
    }
  }

  // Mercury or Saturn in 7th/8th
  if ((saturn && [7, 8].includes(saturn.house)) || (mercury && [7, 8].includes(mercury.house))) {
    const rule = edRules.find((r: any) => r?.condition?.includes('Mercury or Saturn in 7th or 8th house'));
    if (rule) indicators.push((rule.condition || 'Mercury or Saturn in 7th or 8th house') + ': ' + (rule.explanation || ''));
    edRiskScore += 30;
  }

  // Determine risk levels based on assessment ranges
  const pmeRisk: 'Low' | 'Medium' | 'High' = pmeRiskScore >= 50 ? 'High' : pmeRiskScore >= 25 ? 'Medium' : 'Low';
  const edRisk: 'Low' | 'Medium' | 'High' = edRiskScore >= 50 ? 'High' : edRiskScore >= 25 ? 'Medium' : 'Low';

  return {
    pmeRisk,
    edRisk,
    indicators,
    recommendations
  };
}

// ============================================================================
// FEMALE SEXUAL HEALTH ASSESSMENT
// ============================================================================

export function analyzeFemaleSexualHealth(chart: Chart): {
  frigidityRisk: 'Low' | 'Medium' | 'High';
  physicalPainRisk: 'Low' | 'Medium' | 'High';
  indicators: string[];
  recommendations: string[];
} {
  const indicators: string[] = [];
  const recommendations: string[] = [];
  const rules = (sexualHealthRules as any).female_sexual_health;

  const moon = chart.planetaryPositions.find(p => p.planet === 'Moon');
  const venus = chart.planetaryPositions.find(p => p.planet === 'Venus');
  const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');
  const mars = chart.planetaryPositions.find(p => p.planet === 'Mars');
  const rahu = chart.planetaryPositions.find(p => p.planet === 'Rahu');
  const ketu = chart.planetaryPositions.find(p => p.planet === 'Ketu');

  // Frigidity/Low Desire Indicators
  let frigidityScore = 0;
  const frigidityRules = rules.frigidity_low_desire.indicators;

  // Saturn aspecting Venus or Moon
  if (saturn && (venus || moon)) {
    const venusDiff = venus ? Math.abs(normalizeDegrees(saturn.longitude - venus.longitude)) : 1000;
    const moonDiff = moon ? Math.abs(normalizeDegrees(saturn.longitude - moon.longitude)) : 1000;

    if (venusDiff < 10 || (venusDiff > 170 && venusDiff < 190) || moonDiff < 10 || (moonDiff > 170 && moonDiff < 190)) {
      const rule = frigidityRules.find((r: any) => r?.condition?.includes('Saturn aspecting Venus OR Moon'));
      if (rule) indicators.push((rule.condition || 'Saturn aspecting Venus OR Moon') + ': ' + (rule.explanation || ''));
      frigidityScore += 40;
    }
  }

  // Ketu in 7th or 8th house
  if (ketu && (ketu.house === 7 || ketu.house === 8)) {
    const rule = frigidityRules.find((r: any) => r?.condition?.includes('Ketu in 7th or 8th house'));
    if (rule) indicators.push((rule.condition || 'Ketu in 7th or 8th house') + ': ' + (rule.explanation || ''));
    frigidityScore += 40;
  }

  // Venus in Capricorn
  if (venus && venus.sign === 'Capricorn') {
    const rule = frigidityRules.find((r: any) => r?.condition?.includes('Venus in Capricorn'));
    if (rule) indicators.push((rule.condition || 'Venus in Capricorn') + ': ' + (rule.explanation || ''));
    frigidityScore += 20;
  }

  // Physical Pain Indicators
  let painScore = 0;
  const painRules = rules.physical_pain_issues.indicators;

  // Mars or Rahu in 8th house
  if (mars && mars.house === 8) {
    const rule = painRules.find((r: any) => r?.condition === 'Mars in 8th house');
    if (rule) indicators.push((rule.condition || 'Mars in 8th house') + ': ' + (rule.explanation || ''));
    painScore += 35;
  }
  if (rahu && rahu.house === 8) {
    const rule = painRules.find((r: any) => r?.condition === 'Rahu in 8th house');
    if (rule) indicators.push((rule.condition || 'Rahu in 8th house') + ': ' + (rule.explanation || ''));
    painScore += 30;
  }

  // 8th Lord in 6th house
  const eighthLord = getLordOfHouse(chart, 8);
  const eighthLordPosition = chart.planetaryPositions.find(p => p.planet === eighthLord);
  if (eighthLordPosition && eighthLordPosition.house === 6) {
    const rule = painRules.find((r: any) => r?.condition === '8th Lord in 6th house');
    if (rule) indicators.push((rule.condition || '8th Lord in 6th house') + ': ' + (rule.explanation || ''));
    painScore += 25;
  }

  // Determine risk levels
  const frigidityRisk: 'Low' | 'Medium' | 'High' = frigidityScore >= 50 ? 'High' : frigidityScore >= 25 ? 'Medium' : 'Low';
  const physicalPainRisk: 'Low' | 'Medium' | 'High' = painScore >= 40 ? 'High' : painScore >= 20 ? 'Medium' : 'Low';

  return {
    frigidityRisk,
    physicalPainRisk,
    indicators,
    recommendations
  };
}

export function analyzeLibido(chart: Chart): {
  level: 'Low' | 'Medium' | 'High';
  description: string;
} {
  const mars = chart.planetaryPositions.find(p => p.planet === 'Mars');
  const venus = chart.planetaryPositions.find(p => p.planet === 'Venus');
  const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');

  const weights = sexualHealthRules.mutual_satisfaction.libido_weights;
  let score = 50; // Neutral starting point

  // High libido factors
  if (mars && mars.dignity === 'exalted') score += weights.exalted_mars;
  if (mars && (mars.dignity as string) === 'own_house') score += weights.own_house_mars;
  if (venus && venus.dignity === 'exalted') score += weights.exalted_venus;
  if (venus && (venus.dignity as string) === 'own_house') score += weights.own_house_venus;
  if (mars && ['Aries', 'Leo', 'Sagittarius'].includes(mars.sign)) score += weights.fire_sign_mars;

  // Mars-Venus connection
  if (mars && venus) {
    const diff = Math.abs(normalizeDegrees(mars.longitude - venus.longitude));
    if (diff < 15 || (diff > 105 && diff < 135) || (diff > 165 && diff < 195)) {
      score += weights.mars_venus_aspect;
    }
  }

  // Low libido factors
  if (saturn && mars) {
    const diff = Math.abs(normalizeDegrees(saturn.longitude - mars.longitude));
    if (diff < 10) score += weights.saturn_mars_affliction;
  }
  if (saturn && venus) {
    const diff = Math.abs(normalizeDegrees(saturn.longitude - venus.longitude));
    if (diff < 10) score += weights.saturn_venus_affliction;
  }

  const level: 'Low' | 'Medium' | 'High' = score >= 75 ? 'High' : score >= 40 ? 'Medium' : 'Low';

  const descriptions = {
    'High': 'Vibrant and intense sexual energy. Needs physical expression and excitement.',
    'Medium': 'Balanced desire and capacity for intimacy. Responsive and steady.',
    'Low': 'Reserved or restricted sexual energy. May prioritize emotional or spiritual connection over physical.'
  };

  return {
    level,
    description: descriptions[level]
  };
}

// ============================================================================
// MUTUAL SATISFACTION ASSESSMENT
// ============================================================================

export function analyzeMutualSatisfaction(
  chartA: Chart,
  chartB: Chart,
  genderA: 'male' | 'female' = 'male',
  genderB: 'male' | 'female' = 'female'
): {
  score: number;
  vibeMatch: string;
  elementCompatibility: string;
  description: string;
} {
  // Element balance analysis
  const elementsA = getElementBalance(chartA);
  const elementsB = getElementBalance(chartB);

  const dominantA = getDominantElement(elementsA);
  const dominantB = getDominantElement(elementsB);

  // Calculate compatibility using lookup
  const elementDescriptions = sexualHealthRules.mutual_satisfaction.element_descriptions;

  // Create lookup key (sorted alphabetically to handle A+B vs B+A)
  const elements = [dominantA, dominantB].sort();
  const lookupKey = `${elements[0]}_${elements[1]}`;

  const elementDescription = elementDescriptions[lookupKey] || elementDescriptions.Default;

  // Map scores based on combination (Alphabetical Order - Lower base scores for more headroom)
  const scoreMap: Record<string, number> = {
    'Air_Air': 55,
    'Air_Earth': 45,
    'Air_Fire': 70,
    'Air_Water': 50,
    'Earth_Earth': 60,
    'Earth_Fire': 65,
    'Earth_Water': 65,
    'Fire_Fire': 60,
    'Fire_Water': 40,
    'Water_Water': 65
  };

  let elementScore = scoreMap[lookupKey] || 55;
  let chemistryScore = 0;
  let penaltyScore = 0;

  // Mars-Venus interaction (Gender-Aware)
  const marsA = chartA.planetaryPositions.find(p => p.planet === 'Mars');
  const venusA = chartA.planetaryPositions.find(p => p.planet === 'Venus');
  const marsB = chartB.planetaryPositions.find(p => p.planet === 'Mars');
  const venusB = chartB.planetaryPositions.find(p => p.planet === 'Venus');

  // Primary Attraction (Male Mars to Female Venus)
  const maleMars = genderA === 'male' ? marsA : (genderB === 'male' ? marsB : null);
  const femaleVenus = genderB === 'female' ? venusB : (genderA === 'female' ? venusA : null);

  if (maleMars && femaleVenus) {
    const diff = Math.abs(normalizeDegrees(maleMars.longitude - femaleVenus.longitude));
    const minDiff = Math.min(diff, 360 - diff);
    if (minDiff < 8) { // Conjunction
      chemistryScore += 20;
    } else if (minDiff > 172 && minDiff < 188) { // Opposition
      chemistryScore += 20;
    } else if (minDiff > 115 && minDiff < 125) { // Trine
      chemistryScore += 12;
    } else if (minDiff > 55 && minDiff < 65) { // Sextile
      chemistryScore += 12;
    }
  }

  // Secondary Attraction (Female Mars to Male Venus)
  const femaleMars = genderA === 'female' ? marsA : (genderB === 'female' ? marsB : null);
  const maleVenus = genderB === 'male' ? venusB : (genderA === 'male' ? venusA : null);

  if (femaleMars && maleVenus) {
    const diff = Math.abs(normalizeDegrees(femaleMars.longitude - maleVenus.longitude));
    const minDiff = Math.min(diff, 360 - diff);
    if (minDiff < 8 || (minDiff > 172 && minDiff < 188)) {
      chemistryScore += 10; // Extra spark
    }
  }

  // Affliction Penalties
  const saturnA = chartA.planetaryPositions.find(p => p.planet === 'Saturn');
  const saturnB = chartB.planetaryPositions.find(p => p.planet === 'Saturn');
  const ketuA = chartA.planetaryPositions.find(p => p.planet === 'Ketu');
  const ketuB = chartB.planetaryPositions.find(p => p.planet === 'Ketu');

  // 1. Saturn aspecting Venus (restrictive/coldness)
  [chartA, chartB].forEach((chart, idx) => {
    const venus = chart.planetaryPositions.find(p => p.planet === 'Venus');
    const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');
    if (venus && saturn) {
      const diff = Math.abs(normalizeDegrees(venus.longitude - saturn.longitude));
      const minDiff = Math.min(diff, 360 - diff);
      // conjunction (0), opposition (180), square (90), 10th aspect (270)
      if (minDiff < 8 || minDiff > 172 || (minDiff > 82 && minDiff < 98)) {
        penaltyScore -= 12; // Saturn restriction
      }
    }
  });

  // 2. Ketu in 8th house (detachment)
  if (ketuA && ketuA.house === 8) penaltyScore -= 8;
  if (ketuB && ketuB.house === 8) penaltyScore -= 8;

  // 3. Debilitated Venus/Mars
  if (venusA?.dignity === 'debilitated') penaltyScore -= 10;
  if (venusB?.dignity === 'debilitated') penaltyScore -= 10;
  if (marsA?.dignity === 'debilitated') penaltyScore -= 5;
  if (marsB?.dignity === 'debilitated') penaltyScore -= 5;

  // Check 8th house strength (Scaled Bonus)
  const eighthLordA = getLordOfHouse(chartA, 8);
  const eighthLordB = getLordOfHouse(chartB, 8);

  const eighthA = chartA.planetaryPositions.find(p => p.planet === eighthLordA);
  const eighthB = chartB.planetaryPositions.find(p => p.planet === eighthLordB);

  // Only add bonus for EXALTED or OWN sign (high strength)
  if (eighthA && (eighthA.dignity === 'exalted' || eighthA.dignity === 'own_house')) {
    chemistryScore += 8;
  }
  if (eighthB && (eighthB.dignity === 'exalted' || eighthB.dignity === 'own_house')) {
    chemistryScore += 8;
  }

  const finalScore = Math.max(20, Math.min(100, elementScore + chemistryScore + penaltyScore));

  let satisfactionLevel = '';
  if (finalScore >= 85) {
    satisfactionLevel = 'Exceptional physical harmony and strong mutual attraction.';
  } else if (finalScore >= 70) {
    satisfactionLevel = 'Good sexual compatibility with shared rhythms and attraction.';
  } else if (finalScore >= 50) {
    satisfactionLevel = 'Moderate compatibility; needs conscious communication and effort to sync.';
  } else {
    satisfactionLevel = 'Significant differences in temperament or physical vitality detected.';
  }

  return {
    score: Math.round(finalScore),
    vibeMatch: `${dominantA} + ${dominantB}`,
    elementCompatibility: elementDescription,
    description: satisfactionLevel
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getElementBalance(chart: Chart): { fire: number; earth: number; air: number; water: number } {
  const elements = { fire: 0, earth: 0, air: 0, water: 0 };

  const fireSigns = ['Aries', 'Leo', 'Sagittarius'];
  const earthSigns = ['Taurus', 'Virgo', 'Capricorn'];
  const airSigns = ['Gemini', 'Libra', 'Aquarius'];
  const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];

  chart.planetaryPositions.forEach(p => {
    if (fireSigns.includes(p.sign)) elements.fire++;
    else if (earthSigns.includes(p.sign)) elements.earth++;
    else if (airSigns.includes(p.sign)) elements.air++;
    else if (waterSigns.includes(p.sign)) elements.water++;
  });

  return elements;
}

function getDominantElement(elements: { fire: number; earth: number; air: number; water: number }): string {
  const max = Math.max(elements.fire, elements.earth, elements.air, elements.water);
  if (max === elements.fire) return 'Fire';
  if (max === elements.earth) return 'Earth';
  if (max === elements.air) return 'Air';
  return 'Water';
}

function getLordOfHouse(chart: Chart, houseNumber: number): Planet {
  const house = chart.houses.find(h => h.houseNumber === houseNumber);
  if (!house) return 'Sun'; // Fallback
  return house.lord;
}

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

export function analyzeSexualOrientation(chart: Chart): {
  pattern: string;
  indicators: string[];
  description: string;
} {
  const indicators: string[] = [];
  const venus = chart.planetaryPositions.find(p => p.planet === 'Venus');
  const mercury = chart.planetaryPositions.find(p => p.planet === 'Mercury');
  const uranus = chart.planetaryPositions.find(p => p.planet === 'Uranus');
  const rahu = chart.planetaryPositions.find(p => p.planet === 'Rahu');
  const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');

  let dualityScore = 0;
  let unconventionalScore = 0;

  // Duality (Mercury-Venus)
  if (mercury && venus) {
    const diff = Math.abs(normalizeDegrees(mercury.longitude - venus.longitude));
    if (diff < 10) {
      indicators.push("Mercury conjunct Venus: Suggests duality in romantic expression and intellectualized attraction.");
      dualityScore += 30;
    }
  }

  // Eccentricity (Uranus-Venus)
  if (uranus && venus) {
    const diff = Math.abs(normalizeDegrees(uranus.longitude - venus.longitude));
    if (diff < 10 || (diff > 170 && diff < 190) || (diff > 82 && diff < 98)) {
      indicators.push("Uranus aspecting Venus: Indicates unconventional or eccentric attraction patterns, potentially deviating from traditional norms.");
      unconventionalScore += 40;
    }
  }

  // Identity Markers (Rahu/Saturn on Ascendant or 1st Lord)
  const firstLord = getLordOfHouse(chart, 1);
  const firstLordPos = chart.planetaryPositions.find(p => p.planet === firstLord);

  if (rahu && (rahu.house === 1 || (firstLordPos && Math.abs(normalizeDegrees(rahu.longitude - firstLordPos.longitude)) < 10))) {
    indicators.push("Rahu impacting Identity/1st Lord: Generates an 'outsider' perspective on self and socially defined roles.");
    unconventionalScore += 30;
  }

  if (saturn && (saturn.house === 1 || (firstLordPos && Math.abs(normalizeDegrees(saturn.longitude - firstLordPos.longitude)) < 10))) {
    indicators.push("Saturn impacting Identity/1st Lord: Can create internalized restrictions or unique definitions of self-identity.");
    unconventionalScore += 20;
  }

  // Determine Pattern
  let pattern = "Conventional Orientation";
  let description = "Astrological indicators suggest a conventional romantic and sexual orientation aligned with traditional social norms.";

  if (unconventionalScore >= 60 || (dualityScore >= 25 && unconventionalScore >= 30)) {
    pattern = "Unconventional / Fluid Potential";
    description = "Planetary configurations (Uranus/Venus, Rahu influences) suggest an unconventional, fluid, or non-traditional approach to romantic and sexual identity.";
  } else if (dualityScore >= 30) {
    pattern = "Dual / Bisexual Tendencies";
    description = "Mercury-Venus prominence indicates duality in attractions and a youthful, experimental mental approach to relationships.";
  }

  return {
    pattern,
    indicators,
    description
  };
}

export function analyzeSexualHealth(
  chartA: Chart,
  chartB: Chart,
  genderA: 'male' | 'female',
  genderB: 'male' | 'female'
): SexualHealthAnalysis {
  // Analyze based on gender
  const maleHealth = genderA === 'male'
    ? analyzeMaleSexualHealth(chartA)
    : genderB === 'male'
      ? analyzeMaleSexualHealth(chartB)
      : { pmeRisk: 'Low' as const, edRisk: 'Low' as const, indicators: [], recommendations: [] };

  const femaleHealth = genderA === 'female'
    ? analyzeFemaleSexualHealth(chartA)
    : genderB === 'female'
      ? analyzeFemaleSexualHealth(chartB)
      : { frigidityRisk: 'Low' as const, physicalPainRisk: 'Low' as const, indicators: [], recommendations: [] };

  const mutualSatisfaction = analyzeMutualSatisfaction(chartA, chartB, genderA, genderB);

  const libidoA = analyzeLibido(chartA);
  const libidoB = analyzeLibido(chartB);

  const orientationA = analyzeSexualOrientation(chartA);
  const orientationB = analyzeSexualOrientation(chartB);

  return {
    maleHealth,
    femaleHealth,
    mutualSatisfaction,
    libidoA,
    libidoB,
    orientationA,
    orientationB
  };
}