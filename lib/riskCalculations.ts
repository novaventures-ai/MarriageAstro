/**
 * Risk Assessment Engine
 * Phase 2.6: Divorce, Infidelity, and Multiple Marriage Indicators
 */

import { Chart, RiskAssessment, ModernPlanetAnalysis, ModernChallenges, Planet } from '@types';
import { normalizeDegrees, SIGN_LORDS } from './coreCalculations';
import riskRules from '../knowledge/risk_rules.json';

// ============================================================================
// HELPERS
// ============================================================================

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ============================================================================
// DIVORCE RISK ASSESSMENT
// ============================================================================

export function assessDivorceRisk(chart: Chart, name: string): {
  score: number;
  level: 'low' | 'medium' | 'high' | 'very_high';
  indicators: { text: string; profileName: string }[];
  mitigation: string[];
} {
  let score = 0;
  const indicators: { text: string; profileName: string }[] = [];
  const mitigation: string[] = [];
  const rules = (riskRules as any).divorce_indicators;

  if (!rules) return { score, level: 'low', indicators, mitigation };

  // Get key positions
  const seventhHouse = chart.houses.find(h => h.houseNumber === 7);
  const secondHouse = chart.houses.find(h => h.houseNumber === 2);

  const seventhLord = seventhHouse?.lord;
  const secondLord = secondHouse?.lord;

  const seventhLordPosition = chart.planetaryPositions.find(p => p.planet === seventhLord);
  const secondLordPosition = chart.planetaryPositions.find(p => p.planet === secondLord);
  const venusPosition = chart.planetaryPositions.find(p => p.planet === 'Venus');

  // 7th Lord in Dusthana (6, 8, 12)
  if (seventhLordPosition && [6, 8, 12].includes(seventhLordPosition.house)) {
    const rule = rules.high_risk_combinations?.find((r: any) => r.condition.includes('7th Lord in 6th, 8th, or 12th'));
    if (rule) {
      indicators.push({ text: rule.condition + ': ' + rule.description, profileName: name });
    } else {
      indicators.push({ text: `7th Lord in ${getOrdinal(seventhLordPosition.house)} house: Relationship challenges`, profileName: name });
    }
    score += 30;
  }


  // 2nd Lord in Dusthana
  if (secondLordPosition && [6, 8, 12].includes(secondLordPosition.house)) {
    indicators.push({ text: `2nd Lord in ${getOrdinal(secondLordPosition.house)} house: Family harmony compromised`, profileName: name });
    score += 25;
  }

  // Venus in Dusthana
  if (venusPosition && [6, 8, 12].includes(venusPosition.house)) {
    const rule = rules.high_risk_combinations?.find((r: any) => r.condition.includes('Venus in 6th, 8th, or 12th'));
    if (rule) {
      indicators.push({ text: rule.condition + ': ' + rule.description, profileName: name });
    } else {
      indicators.push({ text: `Venus in ${getOrdinal(venusPosition.house)} house: Challenges in love`, profileName: name });
    }
    score += 20;
  }


  // Afflictions to 7th house
  const separativePlanetsData = rules.separative_planets || {};
  const separativePlanets = Object.keys(separativePlanetsData).filter(k => k !== 'description');
  const planetsIn7th = seventhHouse?.planets || [];
  planetsIn7th.forEach(p => {
    if (separativePlanets.includes(p)) {
      indicators.push({ text: `${p} in 7th house: Separative influence on marriage`, profileName: name });
      score += 15;
    }
  });


  // Mars/Saturn in 7th
  const saturnInSeventh = chart.planetaryPositions.find(p => p.planet === 'Saturn' && p.house === 7);
  const marsInSeventh = chart.planetaryPositions.find(p => p.planet === 'Mars' && p.house === 7);

  if (saturnInSeventh && marsInSeventh) {
    indicators.push({ text: 'Saturn and Mars both in 7th house: Severe affliction', profileName: name });
    score += 25;
    mitigation.push('Marriage to tree or idol before actual marriage recommended');
  } else if (saturnInSeventh) {
    indicators.push({ text: 'Saturn in 7th house: Delay and restrictions', profileName: name });
    score += 15;
    mitigation.push('Marriage after 28 years advised');
  } else if (marsInSeventh) {
    indicators.push({ text: 'Mars in 7th house: Kuja Dosha', profileName: name });
    score += 15;
    mitigation.push('Match with partner having similar placement');
  }

  // ---- ADVANCED LOGIC FROM Risk_kn.md ----

  // 6th or 8th Lord in 7th house (§1.2.2)
  const h6 = chart.houses.find(h => h.houseNumber === 6);
  const h8 = chart.houses.find(h => h.houseNumber === 8);
  const lord6 = h6?.lord;
  const lord8 = h8?.lord;

  if (lord6 && planetsIn7th.includes(lord6)) {
    indicators.push({ text: '6th Lord in 7th house: Brings disputes and active conflict into the marriage', profileName: name });
    score += 20;
  }
  if (lord8 && planetsIn7th.includes(lord8)) {
    indicators.push({ text: '8th Lord in 7th house: Crisis-prone relationship or sudden transformative disruptions', profileName: name });
    score += 25;
  }

  // 2nd House (Mangalya Bhava) Affliction (§1.2.2 + §4.4)
  if (secondHouse) {
    const malefics: Planet[] = ['Saturn', 'Mars', 'Rahu', 'Ketu'];
    const maleficsIn2 = secondHouse.planets.filter(p => malefics.includes(p as Planet));
    if (maleficsIn2.length >= 2) {
      indicators.push({ text: 'Severe affliction to 2nd house (Mangalya Bhava): Threatens the longevity of the marital bond', profileName: name });
      score += 25;
    }
  }

  // 7th Lord Debilitated or in Marana Karaka Sthan (12th house for 7th lord)
  if (seventhLordPosition) {
    if (seventhLordPosition.dignity === 'debilitated') {
      indicators.push({ text: '7th Lord is debilitated: Marriage significator lacks structural strength', profileName: name });
      score += 20;
    }
    // MKS for 7th Lord (typically 12th house in some schools, or specific houses per planet)
    // Here we'll check if it's in a sensitive dusthana specifically relative to it
    if (seventhLordPosition.house === 12) {
      indicators.push({ text: '7th Lord in 12th house: Potential for loss or "Marana" energy affecting partnership', profileName: name });
      score += 20;
    }
  }

  // Protective Factor: Strong Jupiter aspecting 7th house (§1.1.4)
  const jupiter = chart.planetaryPositions.find(p => p.planet === 'Jupiter');
  if (jupiter) {
    const jupHouse = jupiter.house;
    const aspect7 = (jupHouse + 6) % 12 + 1; // 7th aspect
    const aspect5 = (jupHouse + 4) % 12 + 1; // 5th aspect
    const aspect9 = (jupHouse + 8) % 12 + 1; // 9th aspect

    if (jupHouse === 7 || aspect5 === 7 || aspect7 === 7 || aspect9 === 7) {
      indicators.push({ text: 'Benefic Jupiter aspects/occupies 7th house: Strong protective influence mitigating risks', profileName: name });
      score -= 25; // Mitigation
    }
  }

  // Determine level
  const levelByScore: 'low' | 'medium' | 'high' | 'very_high' = score >= 70 ? 'very_high' : score >= 45 ? 'high' : score >= 20 ? 'medium' : 'low';

  return {
    score: Math.min(score, 100),
    level: levelByScore,
    indicators,
    mitigation
  };
}

// ============================================================================
// INFIDELITY RISK ASSESSMENT
// ============================================================================

export function assessInfidelityRisk(chart: Chart, name: string): {
  score: number;
  level: 'low' | 'medium' | 'high';
  indicators: { text: string; profileName: string }[];
  warning: string[];
} {
  let score = 0;
  const indicators: { text: string; profileName: string }[] = [];
  const warning: string[] = [];

  const venus = chart.planetaryPositions.find(p => p.planet === 'Venus');
  const mars = chart.planetaryPositions.find(p => p.planet === 'Mars');
  const rahu = chart.planetaryPositions.find(p => p.planet === 'Rahu');
  const mercury = chart.planetaryPositions.find(p => p.planet === 'Mercury');
  const moon = chart.planetaryPositions.find(p => p.planet === 'Moon');

  // Venus-Mars connection (Passion)
  if (venus && mars) {
    const diff = Math.abs(normalizeDegrees(venus.longitude - mars.longitude));
    if (diff < 10) {
      indicators.push({ text: 'Venus-Mars Conjunction: Heightened passion and desire', profileName: name });
      score += 25;
    }
  }

  // Venus-Rahu connection (Obscure desires)
  if (venus && rahu) {
    const diff = Math.abs(normalizeDegrees(venus.longitude - rahu.longitude));
    if (diff < 10) {
      indicators.push({ text: 'Venus-Rahu Conjunction: Unconventional or hidden desires', profileName: name });
      score += 30;
    }
  }

  // Moon-Mercury connection (Dual mind)
  if (moon && mercury) {
    const diff = Math.abs(normalizeDegrees(moon.longitude - mercury.longitude));
    if (diff < 10) {
      indicators.push({ text: 'Moon-Mercury Conjunction: Possibility of dual personality or fickle mind', profileName: name });
      score += 15;
    }
  }

  // KP Formula Logic: Sublord of 5th/7th/11th houses
  // Note: Simplified logic as we don't have full KP sublord data here
  const seventhHouse = chart.houses.find(h => h.houseNumber === 7);
  const eleventhHouse = chart.houses.find(h => h.houseNumber === 11);
  const fifthHouse = chart.houses.find(h => h.houseNumber === 5);

  if (seventhHouse && eleventhHouse && fifthHouse) {
    const passionPlanets: Planet[] = ['Venus', 'Mars', 'Rahu'];
    const planetsIn5 = fifthHouse.planets;
    const planetsIn7 = seventhHouse.planets;
    const planetsIn11 = eleventhHouse.planets;

    // Strong involvement of 5, 7, 11 with passion planets
    const hasPassion5 = planetsIn5.some(p => passionPlanets.includes(p as Planet));
    const hasPassion7 = planetsIn7.some(p => passionPlanets.includes(p as Planet));
    const hasPassion11 = planetsIn11.some(p => passionPlanets.includes(p as Planet));

    if (hasPassion5 && hasPassion11) {
      indicators.push({ text: 'KP Analysis: Strong link between romance (5th) and desire fulfillment (11th) suggests a high-passion nature.', profileName: name });
      score += 15;
    }

    if (hasPassion7 && passionPlanets.some(p => planetsIn5.includes(p as Planet) || planetsIn11.includes(p as Planet))) {
      indicators.push({ text: 'KP Analysis: Marriage house (7th) linked to romance/desire houses (5th/11th), indicating passion takes precedence in partnership.', profileName: name });
      score += 20;
    }

    const lordsPassion = passionPlanets.includes(fifthHouse.lord as Planet) || passionPlanets.includes(seventhHouse.lord as Planet) || passionPlanets.includes(eleventhHouse.lord as Planet);
    if (lordsPassion) {
      indicators.push({ text: 'KP Analysis: Pleasure house rulers are ‘Fire’ planets (Mars/Venus/Rahu), amplifying impulsive attractions.', profileName: name });
      score += 10;
    }
  }

  // ---- NEW INDICATORS FROM Risk_kn.md ----

  // Moon-Rahu "clouded mind" (§1.1)
  if (moon && rahu) {
    const diff = Math.abs(normalizeDegrees(moon.longitude - rahu.longitude));
    if (diff < 10) {
      indicators.push({ text: 'Moon-Rahu conjunction: "Clouded mind" — emotional confusion and desire for escapism in relationships', profileName: name });
      score += 20;
    }
  }

  // Ketu in 7th + Venus in 12th (§1.1)
  const ketu = chart.planetaryPositions.find(p => p.planet === 'Ketu');
  if (ketu && ketu.house === 7 && venus && venus.house === 12) {
    indicators.push({ text: 'Ketu in 7th + Venus in 12th: Detachment from marriage combined with secret pleasures', profileName: name });
    score += 25;
  }

  // 5th house multiple planets → multiple romances (§1.2)
  if (fifthHouse && fifthHouse.planets.length >= 3) {
    indicators.push({ text: `${fifthHouse.planets.length} planets in 5th house: Indicates multi-faceted romantic experiences`, profileName: name });
    score += 10;
  }

  // 3rd-5th connection: secret relationships (§1.2)
  const thirdHouse = chart.houses.find(h => h.houseNumber === 3);
  if (thirdHouse && fifthHouse) {
    const lord3Pos = chart.planetaryPositions.find(p => p.planet === thirdHouse.lord);
    if (lord3Pos && lord3Pos.house === 5) {
      indicators.push({ text: '3rd lord in 5th house: Communication-romance link suggests secret or hidden relationships', profileName: name });
      score += 15;
    }
  }

  // Kama Trikona affliction: malefics in 3, 7, and 11 (§1.2)
  const h3 = chart.houses.find(h => h.houseNumber === 3);
  const h11 = chart.houses.find(h => h.houseNumber === 11);
  const malefics: Planet[] = ['Saturn', 'Mars', 'Rahu', 'Ketu'];
  if (h3 && seventhHouse && h11) {
    const mal3 = h3.planets.some(p => malefics.includes(p as Planet));
    const mal7 = seventhHouse.planets.some(p => malefics.includes(p as Planet));
    const mal11 = h11.planets.some(p => malefics.includes(p as Planet));
    if (mal3 && mal7 && mal11) {
      indicators.push({ text: 'Kama Trikona (3-7-11) afflicted by malefics: Desire nature strongly activated across multiple life areas', profileName: name });
      score += 20;
    }
  }

  // 8th house emphasis (§1.2)
  const eighthHouse = chart.houses.find(h => h.houseNumber === 8);
  if (eighthHouse && eighthHouse.planets.length >= 2 && eighthHouse.planets.some(p => ['Venus', 'Mars', 'Rahu'].includes(p))) {
    indicators.push({ text: 'Multiple planets with Venus/Mars/Rahu in 8th house: Deep, hidden desires and dissatisfaction with conventional partnership', profileName: name });
    score += 15;
  }

  // Moon in risky nakshatras (§1.1)
  if (moon) {
    const riskyNakshatras = ['Ashlesha', 'Jyeshta', 'Purva Bhadrapada'];
    if (riskyNakshatras.includes(moon.nakshatra)) {
      indicators.push({ text: `Moon in ${moon.nakshatra} nakshatra: Psychologically intense nakshatra linked to secretive or manipulative emotional patterns`, profileName: name });
      score += 10;
    }
  }

  // Mars-Venus in passionate signs (§1.1)
  const passionateSigns = ['Scorpio', 'Aries', 'Leo'];
  if (venus && mars) {
    const diff = Math.abs(normalizeDegrees(venus.longitude - mars.longitude));
    if (diff < 10 && passionateSigns.includes(venus.sign)) {
      indicators.push({ text: `Venus-Mars conjunction in ${venus.sign}: "Fire and desire" combination amplified in passionate sign`, profileName: name });
      score += 10;
    }
  }

  // ---- ADVANCED LOGIC FROM Risk_kn.md ----

  // Venus in 6th house (§1.1.1)
  if (venus && venus.house === 6) {
    indicators.push({ text: 'Venus in 6th house: Potential for multiple illicit relationships or disharmony in commitment', profileName: name });
    score += 20;
  }

  // Moon-Mercury in Dual Signs (§1.1.3 + §1.3.5)
  const dualSigns = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];
  if (moon && mercury && dualSigns.includes(moon.sign) && dualSigns.includes(mercury.sign)) {
    indicators.push({ text: 'Moon and Mercury in Dual Signs: Indicates a restless, changeable mind prone to seeking variety in relationships', profileName: name });
    score += 15;
  }

  // Kama Trikona (3-7-11) Malefic Affliction (§1.2.5)
  // Already partially checked but let's make it more explicit if all three have malefics
  const h7_inf = chart.houses.find(h => h.houseNumber === 7);
  if (h3 && h7_inf && h11) {
    const m3 = h3.planets.some(p => malefics.includes(p as Planet));
    const m7 = h7_inf.planets.some(p => malefics.includes(p as Planet));
    const m11 = h11.planets.some(p => malefics.includes(p as Planet));
    if (m3 && m7 && m11) {
      indicators.push({ text: 'Full Kama Trikona (3-7-11) Affliction: Intense desire nature activated across all social and personal spheres', profileName: name });
      score += 25;
    }
  }

  // NAVAMSA CONFIRMATION MULTIPLIER (§1.4.1)
  const d9 = chart.vargaCharts?.D9;
  if (d9) {
    const d9Venus = d9.planetaryPositions.find(p => p.planet === 'Venus');
    const d9Rahu = d9.planetaryPositions.find(p => p.planet === 'Rahu');
    const d9Mars = d9.planetaryPositions.find(p => p.planet === 'Mars');

    if (venus && rahu && d9Venus && d9Rahu) {
      const d1Conj = Math.abs(normalizeDegrees(venus.longitude - rahu.longitude)) < 10;
      const d9Conj = Math.abs(normalizeDegrees(d9Venus.longitude - d9Rahu.longitude)) < 12;
      if (d1Conj && d9Conj) {
        indicators.push({ text: 'CRITICAL: Venus-Rahu connection confirmed at Soul Level (Navamsa). Risk of obsessive attractions is extremely high.', profileName: name });
        score += 40; // High boost for double confirmation
      }
    }

    if (venus && mars && d9Venus && d9Mars) {
      const d1Conj = Math.abs(normalizeDegrees(venus.longitude - mars.longitude)) < 10;
      const d9Conj = Math.abs(normalizeDegrees(d9Venus.longitude - d9Mars.longitude)) < 12;
      if (d1Conj && d9Conj) {
        indicators.push({ text: 'CRITICAL: Venus-Mars passion pattern confirmed in Navamsa. Emotional/sexual drive dominates long-term behavior.', profileName: name });
        score += 30;
      }
    }
  }

  // Protective Factor: Strong Jupiter (§1.3.2)
  const jupiter = chart.planetaryPositions.find(p => p.planet === 'Jupiter');
  if (jupiter && ['exalted', 'own_house', 'moolatrikona'].includes(jupiter.dignity)) {
    indicators.push({ text: 'Protective Factor: Strong Jupiter provides a stable moral compass mitigating impulsive desires', profileName: name });
    score -= 20;
  }

  // Score mapping
  const level: 'low' | 'medium' | 'high' = score >= 60 ? 'high' : score >= 30 ? 'medium' : 'low';

  if (level === 'high') {
    warning.push('Strong indicators of wandering mind. Transparency in relationship is crucial.');
  }

  return {
    score: Math.min(score, 100),
    level,
    indicators,
    warning
  };
}

// ============================================================================
// MULTIPLE MARRIAGE INDICATORS
// ============================================================================

export function assessMultipleMarriages(chart: Chart, name: string): { text: string; profileName: string }[] {
  const indicators: { text: string; profileName: string }[] = [];
  const rules = (riskRules as any).divorce_indicators?.multiple_marriage_indicators;

  const seventhHouse = chart.houses.find(h => h.houseNumber === 7);
  const seventhLord = seventhHouse?.lord;
  const seventhLordPosition = chart.planetaryPositions.find(p => p.planet === seventhLord);

  // Dual Signs
  const dualSigns = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];

  // 7th Lord in Dual Sign
  if (seventhLordPosition && dualSigns.includes(seventhLordPosition.sign)) {
    const rule = rules?.find((r: any) => r.condition.includes('7th Lord in dual sign'));
    if (rule) {
      indicators.push({ text: rule.condition + ': ' + rule.description, profileName: name });
    } else {
      indicators.push({ text: '7th Lord in Dual Sign: Potential for multiple partnerships', profileName: name });
    }
  }


  // Multiple planets in 7th
  if (seventhHouse && seventhHouse.planets.length >= 2) {
    indicators.push({ text: 'Multiple planets in 7th house: Diverse relationship experiences', profileName: name });
  }

  // Upapada Lagna (UL) Analysis
  const ul = chart.specialPoints?.upapadaLagna;
  if (ul) {
    const ulLord = SIGN_LORDS[ul];
    const ulLordPosition = chart.planetaryPositions.find(p => p.planet === ulLord);

    // If UL Lord is in a dual sign or associated with dual planets
    if (ulLordPosition && dualSigns.includes(ulLordPosition.sign)) {
      indicators.push({ text: 'Upapada Lagna Lord in Dual Sign: Potential for more than one significant relationship', profileName: name });
    }
  }

  return indicators;
}

// ============================================================================
// MODERN PLANET & CHALLENGES ANALYSIS
// ============================================================================

export function analyzeModernPlanets(chart: Chart): ModernPlanetAnalysis {
  const uranus = chart.planetaryPositions.find(p => p.planet === 'Uranus');
  const neptune = chart.planetaryPositions.find(p => p.planet === 'Neptune');
  const pluto = chart.planetaryPositions.find(p => p.planet === 'Pluto');

  let uranusData = { house: uranus?.house || 1, aspects: [] as string[], interpretation: '', challenges: [] as string[] };
  let neptuneData = { house: neptune?.house || 1, aspects: [] as string[], interpretation: '', challenges: [] as string[] };
  let plutoData = { house: pluto?.house || 1, aspects: [] as string[], interpretation: '', challenges: [] as string[] };

  if (uranus?.house === 7) uranusData.interpretation = 'Unconventional partnerships, need for freedom';
  if (neptune?.house === 7) neptuneData.interpretation = 'Idealization of partner, spiritual connection';
  if (pluto?.house === 7) plutoData.interpretation = 'Power struggles, transformative intensity';

  return { uranus: uranusData, neptune: neptuneData, pluto: plutoData };
}

export function analyzeModernChallenges(chart: Chart): ModernChallenges {
  const mercury = chart.planetaryPositions.find(p => p.planet === 'Mercury');
  const uranus = chart.planetaryPositions.find(p => p.planet === 'Uranus');
  const rahu = chart.planetaryPositions.find(p => p.planet === 'Rahu');
  const ketu = chart.planetaryPositions.find(p => p.planet === 'Ketu');
  const moon = chart.planetaryPositions.find(p => p.planet === 'Moon');
  const mars = chart.planetaryPositions.find(p => p.planet === 'Mars');
  const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');

  const digitalAge: string[] = [];
  const careerStress: string[] = [];
  const mentalHealth: string[] = [];
  const communicationIssues: string[] = [];

  const getAspect = (p1: any, p2: any) => {
    if (!p1 || !p2) return null;
    const diff = Math.abs(normalizeDegrees(p1.longitude - p2.longitude));
    const orb = Math.min(diff, 360 - diff);
    if (orb < 8) return 'conjunction';
    if (Math.abs(orb - 90) < 8) return 'square';
    if (Math.abs(orb - 180) < 8) return 'opposition';
    return null;
  };

  // 1. Digital Balance (Mercury, Rahu, Uranus)
  if (mercury && rahu && getAspect(mercury, rahu) === 'conjunction') {
    digitalAge.push('Tendency towards digital dependency or virtual escapism');
  }
  if (mercury && uranus && getAspect(mercury, uranus)) {
    digitalAge.push('Erratic digital communication style leading to misunderstandings');
  }
  if (rahu && rahu.house === 3) {
    digitalAge.push('Over-active digital presence potentially impacting direct bonding');
  }

  // 2. Career-Life Stress (10th/4th Houses & Saturn)
  const house4 = chart.houses.find(h => h.houseNumber === 4);
  const house10 = chart.houses.find(h => h.houseNumber === 10);
  if (house4 && house10) {
    const lord4 = chart.planetaryPositions.find(p => p.planet === house4.lord);
    const lord10 = chart.planetaryPositions.find(p => p.planet === house10.lord);
    if (lord4 && lord10 && (getAspect(lord4, lord10) === 'square' || getAspect(lord4, lord10) === 'opposition')) {
      careerStress.push('Direct conflict identified between professional demands and domestic peace');
    }
  }
  if (saturn && saturn.house === 4) {
    careerStress.push('Professional responsibilities often cast a shadow over home life');
  }

  // 3. Mental Resilience (Moon, Ketu, Rahu, Saturn)
  if (moon && saturn && getAspect(moon, saturn)) {
    mentalHealth.push('Mental load and emotional fatigue may periodically impact the relationship');
  }
  if (moon && ketu && getAspect(moon, ketu) === 'conjunction') {
    mentalHealth.push('Subconscious anxiety or emotional detachment needs conscious handling');
  }
  if (moon && rahu && getAspect(moon, rahu) === 'conjunction') {
    mentalHealth.push('Over-active emotional mind leading to periodic anxiety');
  }

  // 4. Communication Dynamics (Mercury, Mars, Saturn)
  if (mercury && mars && getAspect(mercury, mars)) {
    communicationIssues.push('Impulsive or aggressive speech patterns identified during disagreements');
  }
  if (mercury && saturn && getAspect(mercury, saturn)) {
    communicationIssues.push('Potential for communication blocks or expressed hesitation');
  }
  const house2 = chart.houses.find(h => h.houseNumber === 2);
  if (house2 && [6, 8, 12].includes(chart.planetaryPositions.find(p => p.planet === house2.lord)?.house || 0)) {
    communicationIssues.push('Verbal expression may be hindered by external stressors');
  }

  return { digitalAge, careerStress, mentalHealth, communicationIssues };
}

// ============================================================================
// YOGA DETECTION (Risk_kn.md §1.3)
// ============================================================================

export function detectRiskYogas(chart: Chart, name: string): {
  name: string; severity: 'mild' | 'moderate' | 'severe'; description: string; profileName: string;
}[] {
  const yogas: { name: string; severity: 'mild' | 'moderate' | 'severe'; description: string; profileName: string }[] = [];
  const venus = chart.planetaryPositions.find(p => p.planet === 'Venus');
  const mars = chart.planetaryPositions.find(p => p.planet === 'Mars');
  const rahu = chart.planetaryPositions.find(p => p.planet === 'Rahu');
  const ketu = chart.planetaryPositions.find(p => p.planet === 'Ketu');
  const jupiter = chart.planetaryPositions.find(p => p.planet === 'Jupiter');
  const moon = chart.planetaryPositions.find(p => p.planet === 'Moon');
  const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');
  const mercury = chart.planetaryPositions.find(p => p.planet === 'Mercury');

  const conjOrb = 10;
  const isConj = (a: any, b: any) => a && b && Math.abs(normalizeDegrees(a.longitude - b.longitude)) < conjOrb;

  // Vish Kanya Yoga: Venus + Saturn/Mars/Rahu in specific combos
  if (venus && (isConj(venus, saturn) || isConj(venus, rahu)) && venus.dignity === 'debilitated') {
    yogas.push({ name: 'Vish Kanya Yoga', severity: 'severe', description: 'Toxic relationship pattern — Venus afflicted by malefics in weak dignity. Can cause disharmony and mistrust.', profileName: name });
  }

  // Guru Chandal Yoga: Jupiter + Rahu or Jupiter + Ketu
  if (isConj(jupiter, rahu)) {
    yogas.push({ name: 'Guru Chandal Yoga', severity: 'moderate', description: 'Jupiter-Rahu conjunction weakens moral compass and dharmic values. May lead to unconventional choices in relationships.', profileName: name });
  } else if (isConj(jupiter, ketu)) {
    yogas.push({ name: 'Guru Chandal Yoga (Ketu)', severity: 'mild', description: 'Jupiter-Ketu conjunction creates spiritual confusion. May cause detachment from marital duties.', profileName: name });
  }

  // Punarbhu Dosha: Moon + Saturn conjunction or mutual aspect
  if (isConj(moon, saturn)) {
    yogas.push({ name: 'Punarbhu Dosha', severity: 'moderate', description: 'Moon-Saturn conjunction indicates emotional heaviness and delayed marital happiness. Associated with remarriage potential.', profileName: name });
  }

  // Venus-Mars-Rahu Triad: all three within 20° span
  if (venus && mars && rahu) {
    const positions = [venus.longitude, mars.longitude, rahu.longitude].sort((a, b) => a - b);
    const span = Math.min(positions[2] - positions[0], 360 - (positions[2] - positions[0]));
    if (span < 25) {
      yogas.push({ name: 'Venus-Mars-Rahu Triad', severity: 'severe', description: 'Triple conjunction of desire planets creates intense, potentially uncontrollable passion. High risk of obsessive or forbidden attractions.', profileName: name });
    }
  }

  // Moon-Mercury in dual signs
  const dualSigns = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];
  if (isConj(moon, mercury) && moon && dualSigns.includes(moon.sign)) {
    yogas.push({ name: 'Chanchala Manas Yoga', severity: 'mild', description: 'Moon-Mercury conjunction in dual sign creates restless, changeable mind in relationships. May seek variety.', profileName: name });
  }

  return yogas;
}

// ============================================================================
// PROTECTIVE FACTORS (Risk_kn.md §1.1 - stabilizers)
// ============================================================================

export function assessProtectiveFactors(chart: Chart, name: string): {
  text: string; strength: 'strong' | 'moderate' | 'weak'; profileName: string;
}[] {
  const factors: { text: string; strength: 'strong' | 'moderate' | 'weak'; profileName: string }[] = [];
  const jupiter = chart.planetaryPositions.find(p => p.planet === 'Jupiter');
  const ninthHouse = chart.houses.find(h => h.houseNumber === 9);
  const seventhHouse = chart.houses.find(h => h.houseNumber === 7);

  // Strong Jupiter (moral protection)
  if (jupiter) {
    if (['exalted', 'own_house', 'moolatrikona'].includes(jupiter.dignity)) {
      factors.push({ text: 'Strong Jupiter provides moral compass and dharmic protection for the marriage', strength: 'strong', profileName: name });
    } else if (jupiter.dignity === 'friendly') {
      factors.push({ text: 'Well-placed Jupiter offers moderate moral stability', strength: 'moderate', profileName: name });
    }
    // Jupiter aspecting 7th house (Vedic: Jupiter aspects 5th, 7th, 9th from itself)
    const jupHouse = jupiter.house;
    const aspect7 = (jupHouse + 6) % 12 + 1;
    if (aspect7 === 7 || jupHouse === 7) {
      factors.push({ text: 'Jupiter aspects or occupies 7th house — powerful protector of marriage', strength: 'strong', profileName: name });
    }
  }

  // 9th house strength (dharma protection)
  if (ninthHouse) {
    const ninthLord = chart.planetaryPositions.find(p => p.planet === ninthHouse.lord);
    const benefics: Planet[] = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
    const beneficsIn9 = ninthHouse.planets.filter(p => benefics.includes(p as Planet));
    if (beneficsIn9.length > 0) {
      factors.push({ text: `Benefic planet(s) in 9th house (${beneficsIn9.join(', ')}) strengthen dharma and commitment`, strength: 'strong', profileName: name });
    }
    if (ninthLord && ['exalted', 'own_house', 'moolatrikona'].includes(ninthLord.dignity)) {
      factors.push({ text: '9th lord is strong — deep-rooted values and ethical foundation support marital fidelity', strength: 'moderate', profileName: name });
    }
  }

  // Benefic aspects to 7th house
  if (seventhHouse) {
    const beneficsIn7 = seventhHouse.planets.filter(p => ['Jupiter', 'Venus'].includes(p));
    if (beneficsIn7.length > 0) {
      factors.push({ text: `${beneficsIn7.join(' and ')} in 7th house stabilizes marriage`, strength: 'strong', profileName: name });
    }
  }

  return factors;
}

// ============================================================================
// AFFAIR CONTEXT ANALYSIS (Risk_kn.md §4.4, §4.6)
// ============================================================================

export function assessAffairContext(chart: Chart, name: string): {
  context: 'workplace' | 'neighbor' | 'social_circle' | 'online' | 'general'; text: string; profileName: string;
}[] {
  const indicators: { context: 'workplace' | 'neighbor' | 'social_circle' | 'online' | 'general'; text: string; profileName: string }[] = [];
  const passionPlanets: Planet[] = ['Venus', 'Mars', 'Rahu'];

  const h3 = chart.houses.find(h => h.houseNumber === 3);
  const h5 = chart.houses.find(h => h.houseNumber === 5);
  const h6 = chart.houses.find(h => h.houseNumber === 6);
  const h7 = chart.houses.find(h => h.houseNumber === 7);
  const h10 = chart.houses.find(h => h.houseNumber === 10);
  const h11 = chart.houses.find(h => h.houseNumber === 11);

  // Workplace: 6-10-7 connection
  if (h6 && h10 && h7) {
    const passion6 = h6.planets.some(p => passionPlanets.includes(p as Planet));
    const passion10 = h10.planets.some(p => passionPlanets.includes(p as Planet));
    if (passion6 && passion10) {
      indicators.push({ context: 'workplace', text: 'Venus/Mars/Rahu in 6th and 10th houses — workplace environment could trigger romantic connections', profileName: name });
    }
    if (h7.lord && h10.planets.includes(h7.lord)) {
      indicators.push({ context: 'workplace', text: '7th lord placed in 10th house — partner may come through professional circles', profileName: name });
    }
  }

  // Neighbor/nearby: 3-5-7 connection
  if (h3 && h5) {
    const passion3 = h3.planets.some(p => passionPlanets.includes(p as Planet));
    const passion5 = h5.planets.some(p => passionPlanets.includes(p as Planet));
    if (passion3 && passion5) {
      indicators.push({ context: 'neighbor', text: 'Passion planets in 3rd and 5th houses — attraction in nearby or sibling-circle environments', profileName: name });
    }
  }

  // Social circle: 11-5-7 connection
  if (h11 && h5) {
    const passion11 = h11.planets.some(p => passionPlanets.includes(p as Planet));
    const passion5 = h5.planets.some(p => passionPlanets.includes(p as Planet));
    if (passion11 && passion5) {
      indicators.push({ context: 'social_circle', text: 'Passion planets in 11th and 5th houses — social gatherings or friend circles may trigger attractions', profileName: name });
    }
  }

  // Online/digital: Rahu in 3rd house with Mercury
  const rahu = chart.planetaryPositions.find(p => p.planet === 'Rahu');
  const mercury = chart.planetaryPositions.find(p => p.planet === 'Mercury');
  if (rahu && rahu.house === 3 && mercury && mercury.house === 3) {
    indicators.push({ context: 'online', text: 'Rahu-Mercury conjunction in 3rd house — digital or online platforms could become channels for emotional/romantic connections', profileName: name });
  }

  return indicators;
}

// ============================================================================
// NAVAMSA RISK CONFIRMATION (Risk_kn.md §1.4)
// ============================================================================

export function assessNavamsaRisks(chart: Chart, name: string): {
  text: string; confirmed: boolean; profileName: string;
}[] {
  const confirmations: { text: string; confirmed: boolean; profileName: string }[] = [];
  const d9 = chart.vargaCharts?.D9;
  if (!d9) return confirmations;

  const d9Venus = d9.planetaryPositions?.find(p => p.planet === 'Venus');
  const d9Mars = d9.planetaryPositions?.find(p => p.planet === 'Mars');
  const d9Rahu = d9.planetaryPositions?.find(p => p.planet === 'Rahu');

  const conjOrb = 12;
  const isConj = (a: any, b: any) => a && b && Math.abs(normalizeDegrees(a.longitude - b.longitude)) < conjOrb;

  // Venus-Rahu in Navamsa
  if (isConj(d9Venus, d9Rahu)) {
    confirmations.push({ text: 'Venus-Rahu conjunction confirmed in Navamsa (D-9) — amplifies desire for forbidden/unconventional relationships', confirmed: true, profileName: name });
  }

  // Mars-Venus in Navamsa
  if (isConj(d9Mars, d9Venus)) {
    confirmations.push({ text: 'Mars-Venus conjunction in Navamsa — passion and desire patterns confirmed at soul level', confirmed: true, profileName: name });
  }

  // Venus in dusthana in Navamsa
  if (d9Venus && [6, 8, 12].includes(d9Venus.house)) {
    confirmations.push({ text: `Venus in ${d9Venus.house}th house of Navamsa — relationship challenges echoed in divisional chart`, confirmed: true, profileName: name });
  }

  // 7th house affliction in Navamsa
  const d9H7 = d9.houses?.find(h => h.houseNumber === 7);
  if (d9H7) {
    const maleficsIn7 = d9H7.planets.filter(p => ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p));
    if (maleficsIn7.length >= 2) {
      confirmations.push({ text: `Multiple malefics (${maleficsIn7.join(', ')}) in Navamsa 7th house — marital stress patterns deeply ingrained`, confirmed: true, profileName: name });
    }
  }

  return confirmations;
}

export function assessSpouseLongevity(chart: Chart, name: string): {
  score: number;
  level: 'vulnerable' | 'moderate' | 'stable';
  indicators: { text: string; profileName: string }[];
  description: string;
} {
  const indicators: { text: string; profileName: string }[] = [];
  let vulnerabilityScore = 0;

  // 8th from 7th is the 2nd house (Mangalya Bhava)
  const secondHouse = chart.houses.find(h => h.houseNumber === 2);
  const eighthHouse = chart.houses.find(h => h.houseNumber === 8);
  const secondLord = secondHouse?.lord;
  const secondLordPos = chart.planetaryPositions.find(p => p.planet === secondLord);
  const seventhLord = chart.houses.find(h => h.houseNumber === 7)?.lord;

  // 2nd House Affliction (8th from 7th)
  if (secondHouse) {
    const maleficsIn2 = secondHouse.planets.filter(p => ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p));
    if (maleficsIn2.length >= 2) {
      indicators.push({ text: `Multiple malefics in 2nd house (8th from 7th): Vulnerability to spouse's longevity`, profileName: name });
      vulnerabilityScore += 35;
    }
  }

  // 2nd Lord in Dusthana
  if (secondLordPos && [6, 8, 12].includes(secondLordPos.house)) {
    indicators.push({ text: `2nd Lord (Spouse Longevity significator) in ${getOrdinal(secondLordPos.house)} house`, profileName: name });
    vulnerabilityScore += 25;
  }

  // 8th Lord aspecting/conjoining 7th Lord
  const eighthLord = eighthHouse?.lord;
  const eighthLordPos = chart.planetaryPositions.find(p => p.planet === eighthLord);
  const seventhLordPos = chart.planetaryPositions.find(p => p.planet === seventhLord);

  if (eighthLordPos && seventhLordPos) {
    const diff = Math.abs(normalizeDegrees(eighthLordPos.longitude - seventhLordPos.longitude));
    if (diff < 10 || (diff > 170 && diff < 190)) {
      indicators.push({ text: '8th Lord connected to 7th Lord: Potential for sudden transformations or crises in spouse health/longevity', profileName: name });
      vulnerabilityScore += 30;
    }
  }

  // Darakaraka Affliction
  const darakaraka = chart.specialPoints.darakaraka;
  const dkPos = chart.planetaryPositions.find(p => p.planet === darakaraka);
  const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');
  const rahu = chart.planetaryPositions.find(p => p.planet === 'Rahu');

  if (dkPos) {
    if (saturn && Math.abs(normalizeDegrees(dkPos.longitude - saturn.longitude)) < 10) {
      indicators.push({ text: 'Darakaraka (Spouse Karaka) conjunct Saturn: Challenges to spouse longevity or health', profileName: name });
      vulnerabilityScore += 20;
    }
    if (rahu && Math.abs(normalizeDegrees(dkPos.longitude - rahu.longitude)) < 10) {
      indicators.push({ text: 'Darakaraka conjunct Rahu: Unpredictable risks to spouse', profileName: name });
      vulnerabilityScore += 20;
    }
  }

  // Determine Level
  const score = Math.max(0, 100 - vulnerabilityScore); // 100 is stable, 0 is vulnerable
  const level: 'vulnerable' | 'moderate' | 'stable' = score < 40 ? 'vulnerable' : score < 70 ? 'moderate' : 'stable';

  let description = "Spouse longevity indicators appear stable and supportive.";
  if (level === 'vulnerable') {
    description = "Significant vulnerabilities identified regarding spouse longevity; requires careful matching and remedial measures.";
  } else if (level === 'moderate') {
    description = "Some moderate indicators of health or longevity challenges for spouse; balance is required.";
  }

  return {
    score,
    level,
    indicators,
    description
  };
}

// ============================================================================
// RECOMMENDATIONS
// ============================================================================

export function generateRiskRecommendations(
  _chartA: Chart,
  _chartB: Chart,
  risk: RiskAssessment
): string[] {
  const recommendations: string[] = [];

  if (risk.divorceProbability.level === 'very_high' || risk.divorceProbability.level === 'high') {
    recommendations.push('High compatibility risk detected. Pre-marital counseling is strongly advised.');
  }

  if (risk.infidelityRisk.level === 'high') {
    recommendations.push('Trust-building and transparent communication are vital for this relationship.');
  }

  if (risk.multipleMarriageIndicators.length > 0) {
    recommendations.push('Multiple marriage indicators suggest a need for flexibility and long-term adaptation.');
  }

  if (risk.detectedYogas && risk.detectedYogas.length > 0) {
    recommendations.push('Specific doshas/yogas detected — targeted remedies recommended. See Remedies section.');
  }

  if (risk.protectiveFactors && risk.protectiveFactors.filter(f => f.strength === 'strong').length > 0) {
    recommendations.push('Strong protective factors are present which can significantly mitigate identified risks.');
  }

  return recommendations;
}

// ============================================================================
// MAIN ASSESSMENT
// ============================================================================

export function assessRisk(chartA: Chart, chartB: Chart): RiskAssessment {
  const divorceA = assessDivorceRisk(chartA, chartA.name);
  const divorceB = assessDivorceRisk(chartB, chartB.name);

  const infidelityA = assessInfidelityRisk(chartA, chartA.name);
  const infidelityB = assessInfidelityRisk(chartB, chartB.name);

  const multipleA = assessMultipleMarriages(chartA, chartA.name);
  const multipleB = assessMultipleMarriages(chartB, chartB.name);

  // New Risk_kn.md enhanced analysis
  const yogasA = detectRiskYogas(chartA, chartA.name);
  const yogasB = detectRiskYogas(chartB, chartB.name);

  const protectiveA = assessProtectiveFactors(chartA, chartA.name);
  const protectiveB = assessProtectiveFactors(chartB, chartB.name);

  const affairContextA = assessAffairContext(chartA, chartA.name);
  const affairContextB = assessAffairContext(chartB, chartB.name);

  const navamsaA = assessNavamsaRisks(chartA, chartA.name);
  const navamsaB = assessNavamsaRisks(chartB, chartB.name);

  const longevityA = assessSpouseLongevity(chartA, chartA.name);
  const longevityB = assessSpouseLongevity(chartB, chartB.name);

  const combinedDivorceScore = Math.round((divorceA.score + divorceB.score) / 2);
  const combinedDivorceLevel = combinedDivorceScore >= 70 ? 'very_high' : combinedDivorceScore >= 45 ? 'high' : combinedDivorceScore >= 20 ? 'medium' : 'low';

  const combinedInfidelityScore = Math.round((infidelityA.score + infidelityB.score) / 2);
  const combinedInfidelityLevel = combinedInfidelityScore >= 60 ? 'high' : combinedInfidelityScore >= 30 ? 'medium' : 'low';

  return {
    divorceProbability: {
      score: combinedDivorceScore,
      level: combinedDivorceLevel,
      indicators: [...divorceA.indicators, ...divorceB.indicators],
      mitigation: [...new Set([...divorceA.mitigation, ...divorceB.mitigation])],
      partnerA: divorceA,
      partnerB: divorceB
    },
    infidelityRisk: {
      score: combinedInfidelityScore,
      level: combinedInfidelityLevel,
      indicators: [...infidelityA.indicators, ...infidelityB.indicators],
      warning: [...new Set([...infidelityA.warning, ...infidelityB.warning])],
      partnerA: infidelityA,
      partnerB: infidelityB
    },
    multipleMarriageIndicators: [...multipleA, ...multipleB],
    detectedYogas: [...yogasA, ...yogasB],
    protectiveFactors: [...protectiveA, ...protectiveB],
    affairContextIndicators: [...affairContextA, ...affairContextB],
    navamsaConfirmations: [...navamsaA, ...navamsaB],
    spouseLongevity: {
      score: Math.round((longevityA.score + longevityB.score) / 2),
      level: (longevityA.score + longevityB.score) / 2 < 40 ? 'vulnerable' : (longevityA.score + longevityB.score) / 2 < 70 ? 'moderate' : 'stable',
      indicators: [...longevityA.indicators, ...longevityB.indicators],
      description: longevityA.level === 'vulnerable' || longevityB.level === 'vulnerable' ? 'Vulnerabilities detected in partner longevity patterns.' : 'Longevity patterns appear generally stable.',
      partnerA: longevityA,
      partnerB: longevityB
    }
  };
}