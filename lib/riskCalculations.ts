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

/**
 * Calculates a numerical deduction based on protective factors.
 */
function calculateProtectionBuffer(chart: Chart, name: string): number {
  const factors = assessProtectiveFactors(chart, name);
  let buffer = 0;

  factors.forEach(f => {
    if (f.strength === 'strong') buffer += 15;
    else if (f.strength === 'moderate') buffer += 10;
    else if (f.strength === 'weak') buffer += 5;
  });

  return buffer;
}

/**
 * Calculates a numerical deduction based on INFIDELITY protective factors (Moral/Character).
 */
function calculateInfidelityProtectionBuffer(chart: Chart, name: string): number {
  const factors = assessInfidelityProtections(chart, name);
  let buffer = 0;

  factors.forEach(f => {
    if (f.strength === 'strong') buffer += 15;
    else if (f.strength === 'moderate') buffer += 10;
    else if (f.strength === 'weak') buffer += 5;
  });

  return buffer;
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

  // --- REFINED PROTECTIVE BUFFER ---
  const protectiveBuffer = calculateProtectionBuffer(chart, name);
  score -= protectiveBuffer;

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
  let capacityScore = 0;
  let opportunityScore = 0;
  let stabilizerScore = 0;

  const indicators: { text: string; profileName: string }[] = [];
  const warning: string[] = [];

  const venus = chart.planetaryPositions.find(p => p.planet === 'Venus');
  const mars = chart.planetaryPositions.find(p => p.planet === 'Mars');
  const rahu = chart.planetaryPositions.find(p => p.planet === 'Rahu');
  const mercury = chart.planetaryPositions.find(p => p.planet === 'Mercury');
  const moon = chart.planetaryPositions.find(p => p.planet === 'Moon');
  const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');
  const jupiter = chart.planetaryPositions.find(p => p.planet === 'Jupiter');

  const seventhHouse = chart.houses.find(h => h.houseNumber === 7);
  const fifthHouse = chart.houses.find(h => h.houseNumber === 5);
  const eighthHouse = chart.houses.find(h => h.houseNumber === 8);
  const eleventhHouse = chart.houses.find(h => h.houseNumber === 11);
  const twelfthHouse = chart.houses.find(h => h.houseNumber === 12);
  const thirdHouse = chart.houses.find(h => h.houseNumber === 3);
  const sixthHouse = chart.houses.find(h => h.houseNumber === 6);
  const tenthHouse = chart.houses.find(h => h.houseNumber === 10);

  // ==========================================================================
  // 1. CAPACITY & HISTORY (Core nature / Past patterns)
  // ==========================================================================

  // Venus-Mars connection (Passion)
  if (venus && mars) {
    const diff = Math.abs(normalizeDegrees(venus.longitude - mars.longitude));
    const minDiff = Math.min(diff, 360 - diff);
    if (minDiff < 10) {
      indicators.push({ text: 'History & Capacity: Venus-Mars Conjunction indicates a high-passion nature where romance is a primary life driver.', profileName: name });
      capacityScore += 25;
    }
  }

  // Venus-Rahu connection (Obsessive/Unconventional)
  if (venus && rahu) {
    const diff = Math.abs(normalizeDegrees(venus.longitude - rahu.longitude));
    const minDiff = Math.min(diff, 360 - diff);
    if (minDiff < 10) {
      indicators.push({ text: 'History & Capacity: Venus-Rahu connection creates intense, sometimes unconventional romantic curiosity.', profileName: name });
      capacityScore += 30;
    }
  }

  // Moon-Mercury connection (Psychological variety)
  if (moon && mercury) {
    const diff = Math.abs(normalizeDegrees(moon.longitude - mercury.longitude));
    const minDiff = Math.min(diff, 360 - diff);
    const dualSigns = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];
    if (minDiff < 10 || (dualSigns.includes(moon.sign) && dualSigns.includes(mercury.sign))) {
      indicators.push({ text: 'History & Capacity: Restless mind (Moon-Mercury) suggests a need for high intellectual stimulation in love.', profileName: name });
      capacityScore += 15;
    }
  }

  // 5th house planets (Multiple romance indicator)
  if (fifthHouse && fifthHouse.planets.length >= 3) {
    indicators.push({ text: `History & Capacity: ${fifthHouse.planets.length} planets in 5th house point to a multi-faceted and active romantic history.`, profileName: name });
    capacityScore += 15;
  }

  // Rahu in 5th House (Obsessive desires) - Classic Indicator
  if (fifthHouse && fifthHouse.planets.includes('Rahu')) {
    indicators.push({ text: 'History & Capacity: Rahu in the 5th house aspects relationship planets, often creating obsessive or unconventional desires.', profileName: name });
    capacityScore += 20;
  }

  // 5th Lord in 8th or 12th House - Classic Indicator
  const fifthLordPos = chart.planetaryPositions.find(p => p.planet === fifthHouse?.lord);
  if (fifthLordPos && [8, 12].includes(fifthLordPos.house)) {
    indicators.push({ text: `Deep Narrative: 5th Lord in the ${getOrdinal(fifthLordPos.house)} house suggests a romantic life linked to secrecy or hidden experiences.`, profileName: name });
    capacityScore += 15;
  }

  // 5th-7th Lord Exchange (Parivartana Yoga) - Classic Indicator
  const seventhLord = seventhHouse?.lord;
  const fifthLord = fifthHouse?.lord;
  const seventhLordPos = chart.planetaryPositions.find(p => p.planet === seventhLord);
  if (seventhLord && fifthLord && seventhLordPos && fifthLordPos) {
    if (seventhLordPos.house === 5 && fifthLordPos.house === 7) {
      indicators.push({ text: 'Deep Narrative: Parivartana Yoga between 5th and 7th lords; deep fusion of romance and marriage.', profileName: name });
      capacityScore += 25;
    }
  }

  // Navamsa Confirmation (Soul Level)
  const d9 = chart.vargaCharts?.D9;
  if (d9) {
    const d9Venus = d9.planetaryPositions.find(p => p.planet === 'Venus');
    const d9Rahu = d9.planetaryPositions.find(p => p.planet === 'Rahu');
    const d9Mars = d9.planetaryPositions.find(p => p.planet === 'Mars');

    if (venus && rahu && d9Venus && d9Rahu) {
      const d1Conj = Math.abs(normalizeDegrees(venus.longitude - rahu.longitude)) < 10;
      const d9Conj = Math.abs(normalizeDegrees(d9Venus.longitude - d9Rahu.longitude)) < 12;
      if (d1Conj && d9Conj) {
        indicators.push({ text: 'Deep Narrative: Venus-Rahu pattern confirmed in Navamsa; deep-seated drive for intensity.', profileName: name });
        capacityScore += 20;
      }
    }
  }

  // ==========================================================================
  // 2. OPPORTUNITY & TRIGGERS (Environment / Context)
  // ==========================================================================

  // 12th House Clusters (Secret Spheres)
  if (twelfthHouse) {
    const p12 = twelfthHouse.planets;
    if (p12.length >= 2) {
      indicators.push({ text: 'Vulnerability Triggers: Planets in 12th house suggest a private/isolated sphere where secret bonds can form.', profileName: name });
      opportunityScore += 30;
    }
  }

  // Workplace Context (6-10-7)
  if (sixthHouse && tenthHouse) {
    const passion6 = sixthHouse.planets.some(p => ['Venus', 'Mars', 'Rahu'].includes(p as Planet));
    const passion10 = tenthHouse.planets.some(p => ['Venus', 'Mars', 'Rahu'].includes(p as Planet));
    if (passion6 && passion10) {
      indicators.push({ text: 'Vulnerability Triggers: Workplace environment (6th/10th) identified as a primary trigger for emotional bonds.', profileName: name });
      opportunityScore += 25;
    }
  }

  // Social/Friendship Circles (11-5)
  if (eleventhHouse && fifthHouse) {
    const passion11 = eleventhHouse.planets.some(p => ['Venus', 'Mars', 'Rahu'].includes(p as Planet));
    const passion5 = fifthHouse.planets.some(p => ['Venus', 'Mars', 'Rahu'].includes(p as Planet));
    if (passion11 && passion5) {
      indicators.push({ text: 'Vulnerability Triggers: Blurred lines between social circles (11th) and romance (5th).', profileName: name });
      opportunityScore += 25;
    }
  }

  // Secretive 8th house activity
  if (eighthHouse && eighthHouse.planets.length >= 2 && eighthHouse.planets.some(p => ['Venus', 'Mars', 'Rahu'].includes(p))) {
    indicators.push({ text: 'Vulnerability Triggers: Multiple planets in 8th house point to secrecy as a recurring relationship theme.', profileName: name });
    opportunityScore += 25;
  }

  // ==========================================================================
  // 2.1 ADVANCED CONTEXT TRIGGERS (Synced from Affair Context Analysis)
  // ==========================================================================
  const advancedContexts = assessAffairContext(chart, name);
  advancedContexts.forEach(ctx => {
    // Each unique advanced context adds to Opportunity
    const contextWeight = ctx.confidence === 'high' ? 20 : ctx.confidence === 'medium' ? 10 : 5;
    opportunityScore += contextWeight;

    // Add textual indicator for high/medium confidence advanced contexts
    if (ctx.confidence !== 'low') {
      indicators.push({
        text: `Vulnerability Triggers: ${ctx.text} (Advanced ${ctx.context.replace('_', ' ')} trigger detected)`,
        profileName: name
      });
    }
  });

  // ==========================================================================
  // 3. STABILIZERS (Mitigating factors)
  // ==========================================================================

  if (jupiter) {
    const hasDignity = ['exalted', 'own_house', 'moolatrikona'].includes(jupiter.dignity);
    if (hasDignity || jupiter.house === 7 || jupiter.house === 9) {
      indicators.push({ text: 'Stabilizer: Strong Jupiter provides a philosophical/moral anchor, balancing intense passion.', profileName: name });
      stabilizerScore += 30;
    }
  }

  if (saturn && (saturn.house === 7 || saturn.house === 1) && saturn.dignity !== 'debilitated') {
    indicators.push({ text: 'Stabilizer: Saturnine influence brings a strong sense of duty and structural longevity to commitments.', profileName: name });
    stabilizerScore += 20;
  }

  // Final Score Calculation
  // We weight Capacity and Opportunity, then subtract Stabilizers
  // --- REFINED PROTECTIVE BUFFER ---
  // --- REFINED PROTECTIVE BUFFER (Using Moral/Character Anchors) ---
  const protectiveBuffer = calculateInfidelityProtectionBuffer(chart, name);
  const hasIndicators = (capacityScore + opportunityScore) > 0;

  let finalScore = (capacityScore * 0.5) + (opportunityScore * 0.5) - stabilizerScore - protectiveBuffer;
  if (hasIndicators) finalScore += 5; // Base bump for detected presence

  finalScore = Math.max(10, Math.min(100, finalScore));

  const level: 'low' | 'medium' | 'high' = finalScore >= 60 ? 'high' : finalScore >= 30 ? 'medium' : 'low';

  if (level === 'high') {
    warning.push('Strong indicators of high passion/restlessness. Transparency in relationship is crucial.');
  }

  return {
    score: Math.round(finalScore),
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
    // 9th house logic moved to Infidelity Protections (Moral Anchors)

    // Benefic aspects to 7th house
    if (seventhHouse) {
      const beneficsIn7 = seventhHouse.planets.filter(p => ['Jupiter', 'Venus'].includes(p));
      if (beneficsIn7.length > 0) {
        factors.push({ text: `${beneficsIn7.join(' and ')} in 7th house stabilizes marriage`, strength: 'strong', profileName: name });
      }
    }

    // --- NEW: Subha Kartari Yoga on 7th House ---
    const house6 = chart.houses.find(h => h.houseNumber === 6);
    const house8 = chart.houses.find(h => h.houseNumber === 8);
    const benefics: Planet[] = ['Jupiter', 'Venus', 'Mercury', 'Moon'];
    if (house6 && house8) {
      const beneficsIn6 = house6.planets.filter(p => benefics.includes(p as Planet));
      const beneficsIn8 = house8.planets.filter(p => benefics.includes(p as Planet));
      if (beneficsIn6.length > 0 && beneficsIn8.length > 0) {
        factors.push({
          text: `Subha Kartari Yoga: 7th house (Marriage) is protected by benefics in 6th and 8th, creating a safety net during crises`,
          strength: 'strong',
          profileName: name
        });
      }
    }

    // --- NEW: Mangalya Bhava (2nd House) Strength ---
    const house2 = chart.houses.find(h => h.houseNumber === 2);
    if (house2) {
      const beneficsIn2 = house2.planets.filter(p => benefics.includes(p as Planet));
      if (beneficsIn2.length >= 2) {
        factors.push({ text: `Strong Mangalya Bhava: Multiple benefics in 2nd house provide profound stability to the marital bond`, strength: 'strong', profileName: name });
      } else if (beneficsIn2.length === 1) {
        factors.push({ text: `Well-fortified 2nd house supports family longevity`, strength: 'moderate', profileName: name });
      }

      const secondLord = chart.planetaryPositions.find(p => p.planet === house2.lord);
      if (secondLord && ['exalted', 'own_house', 'moolatrikona'].includes(secondLord.dignity)) {
        factors.push({ text: `2nd Lord (family longevity) is exceptionally strong and dignified`, strength: 'strong', profileName: name });
      }
    }

    // --- NEW: Upapada Lagna (UL) Stabilizers ---
    // Approximate UL: 12th lord's position, then same distance from there.
    const house12 = chart.houses.find(h => h.houseNumber === 12);
    if (house12?.lord) {
      const lord12Pos = chart.planetaryPositions.find(p => p.planet === house12.lord);
      if (lord12Pos) {
        // Calculate UL House
        // 12th lord is X houses away from 12th. UL is X houses away from 12th lord.
        const dist = (lord12Pos.house >= 12) ? (lord12Pos.house - 12) : (lord12Pos.house + 12 - 12);
        const ulHouse = (lord12Pos.house + dist - 1) % 12 + 1;
        const houseUL2 = chart.houses.find(h => h.houseNumber === (ulHouse % 12 + 1));

        if (houseUL2) {
          const beneficsInUL2 = houseUL2.planets.filter(p => benefics.includes(p as Planet));
          if (beneficsInUL2.length > 0) {
            factors.push({ text: `Upapada Lagna Protection: Benefics in 2nd from UL indicate intrinsic longevity of the marital contract`, strength: 'moderate', profileName: name });
          }
        }
      }
    }

    // --- NEW: Dharma Karmadhipati Yoga ---
    const house9 = chart.houses.find(h => h.houseNumber === 9);
    const house10 = chart.houses.find(h => h.houseNumber === 10);
    if (house9?.lord && house10?.lord) {
      const lord9 = chart.planetaryPositions.find(p => p.planet === house9.lord);
      const lord10 = chart.planetaryPositions.find(p => p.planet === house10.lord);
      if (lord9 && lord10) {
        // Simple connection: conjunction or mutual aspect (180 deg)
        const diff = Math.abs(lord9.longitude - lord10.longitude);
        if (diff < 10 || Math.abs(diff - 180) < 10) {
          factors.push({ text: `Dharma-Karmadhipati Yoga: Strong sense of purpose and public duty prevents impulsive relationship decisions`, strength: 'strong', profileName: name });
        }
      }
    }

    // Navamsa (D9) logic moved to Infidelity Protections


    // --- NEW: D7 (Saptamsha) Bond Strength ---
    if (chart.vargaCharts?.D7) {
      const d7 = chart.vargaCharts.D7;
      const d7H1 = d7.houses?.find(h => h.houseNumber === 1);
      const d7H7 = d7.houses?.find(h => h.houseNumber === 7);

      if (d7H1) {
        const d7LagnaLord = d7.planetaryPositions?.find(p => p.planet === d7H1.lord);
        if (d7LagnaLord && ['exalted', 'own_house'].includes(d7LagnaLord.dignity)) {
          factors.push({ text: 'D7 (Saptamsha) Confirmation: Strong Ascendant Lord indicates a fruitful and stable creative bond', strength: 'moderate', profileName: name });
        }
      }

      if (d7H7) {
        const d7BeneficsIn7 = d7H7.planets.filter(p => benefics.includes(p as Planet));
        if (d7BeneficsIn7.length > 0) {
          factors.push({ text: `D7 (Saptamsha) Protection: Benefics in 7th house (${d7BeneficsIn7.join(', ')}) strengthen the specific relationship fruitfulness`, strength: 'moderate', profileName: name });
        }
      }
    }

    // --- NEW: D60 (Shashtiamsha) Karmic Seal ---
    if (chart.vargaCharts?.D60) {
      const d60 = chart.vargaCharts.D60;
      const d60H7 = d60.houses?.find(h => h.houseNumber === 7);
      if (d60H7) {
        const d60BeneficsIn7 = d60H7.planets.filter(p => benefics.includes(p as Planet));
        if (d60BeneficsIn7.length > 0) {
          factors.push({ text: 'D60 (Shashtiamsha) Protection: Benefic influence in the 7th house indicates deep-rooted past-life karmic protection for the marriage', strength: 'strong', profileName: name });
        }
      }
    }

    // Social Deterrent (Saturn in 10th)
    const saturn10 = chart.planetaryPositions.find(p => p.planet === 'Saturn' && p.house === 10);
    if (saturn10) {
      factors.push({
        text: 'Social Responsibility: Saturn in 10th house creates a strong conscience and fear of reputational loss, acting as a deterrent against unconventional choices',
        strength: 'moderate',
        profileName: name
      });
    }

    // KP Dharma/Status Protection
    if (chart.kp?.significators) {
      const seventhCusp = chart.kp.cusps.find(c => c.cuspNumber === 7);
      if (seventhCusp) {
        const subLordSignificator = chart.kp.significators.find(s => s.planet === seventhCusp.subLord);
        const sigs = subLordSignificator?.significations || [];

        // Check for 9 or 10 connection
        // Check for 10 connection (Status/Reputation only - Social Deterrent)
        // 9th House (Dharma) moved to Infidelity Protections
        if (sigs.includes(10)) {
          factors.push({
            text: `KP Status Anchor: 7th Cusp Sub-Lord links to 10th house (Social Status), anchoring the relationship in public duty rather than private desire`,
            strength: 'strong',
            profileName: name
          });
        }

        // --- NEW: KP 11H Binding Counter ---
        if (sigs.includes(11)) {
          factors.push({
            text: 'KP Binding: 7th Cusp Sub-Lord signifies 11th house (fulfillment), acting as a "Binding Anchor" that preserves the relationship against separation',
            strength: 'moderate',
            profileName: name
          });
        }
      }
    }
  }

  // --- NEW: Jaimini Darakaraka Stability ---
  const dkPlanetName = chart.specialPoints?.darakaraka;
  if (dkPlanetName) {
    const dkPos = chart.planetaryPositions.find(p => p.planet === dkPlanetName);
    if (dkPos && ['exalted', 'own_house', 'moolatrikona'].includes(dkPos.dignity)) {
      factors.push({
        text: `Darakaraka Stability: Your spouse-significator planet (${dkPlanetName}) is exceptionally dignified, indicating a partner who acts as a core stabilizer`,
        strength: 'strong',
        profileName: name
      });
    }
  }

  // Protective Yogas (Gajakesari / Dharma Karmadhipati)
  const moon = chart.planetaryPositions.find(p => p.planet === 'Moon');
  if (jupiter && moon) {
    // Simplified Gajakesari check: Moon-Jupiter opposition or conjunction or square
    const angle = Math.abs(normalizeDegrees(jupiter.longitude - moon.longitude));
    const isKendra = [0, 90, 180, 270].some(a => Math.abs(angle - a) < 10);
    if (isKendra) {
      factors.push({
        text: 'Gajakesari Yoga: Jupiter-Moon connection provides emotional stability, wisdom, and strong mental self-control',
        strength: 'strong',
        profileName: name
      });
    }
  }

  // --- NEW: Vargottama 7th Lord (Destiny Seal) ---
  if (seventhHouse && chart.vargaCharts.D9) {
    const lord7Name = seventhHouse.lord;
    const lord7D1 = chart.planetaryPositions.find(p => p.planet === lord7Name);
    const lord7D9 = chart.vargaCharts.D9.planetaryPositions.find(p => p.planet === lord7Name);

    if (lord7D1 && lord7D9 && lord7D1.sign === lord7D9.sign) {
      factors.push({
        text: `Vargottama 7th Lord: The Lord of Marriage (${lord7Name}) is in the same sign in Rashi and Navamsa, creating an unbreakable 'Destiny Seal' on the partnership`,
        strength: 'strong',
        profileName: name
      });
    }
  }

  // --- NEW: Samubandha (Mutual Aspect) ---
  const house1 = chart.houses.find(h => h.houseNumber === 1);
  if (house1 && seventhHouse) {
    const lord1 = chart.planetaryPositions.find(p => p.planet === house1.lord);
    const lord7 = chart.planetaryPositions.find(p => p.planet === seventhHouse.lord);

    if (lord1 && lord7) {
      const diff = Math.abs(normalizeDegrees(lord1.longitude - lord7.longitude));
      // Check for mutual opposition (approx 180 degrees)
      if (Math.abs(diff - 180) < 15) {
        factors.push({
          text: `Samubandha (Mutual Aspect): The Lords of Self and Spouse are gazing at each other (mutual aspect), creating a powerful fated bond`,
          strength: 'strong',
          profileName: name
        });
      }
    }
  }

  // --- NEW: Upapada Sustenance (4th from UL) ---
  if (chart.specialPoints?.upapadaLagna) {
    const ulSign = chart.specialPoints.upapadaLagna;
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const ulIndex = signs.indexOf(ulSign);
    const fourthFromULIndex = (ulIndex + 3) % 12; // 0-based index: +3 is 4th house
    const fourthFromULSign = signs[fourthFromULIndex];

    const beneficsIn4FromUL = chart.planetaryPositions.filter(
      p => p.sign === fourthFromULSign && ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p.planet)
    );

    if (beneficsIn4FromUL.length > 0) {
      const planetNames = beneficsIn4FromUL.map(p => p.planet).join(', ');
      factors.push({
        text: `Upapada Sustenance: Benefics (${planetNames}) in the 4th house from Upapada Lagna ensure the marriage has the resources to sustain itself long-term`,
        strength: 'moderate',
        profileName: name
      });
    }
  }

  return factors;
}

// ============================================================================
// INFIDELITY SPECIFIC PROTECTIONS (Moral/Character)
// ============================================================================

export function assessInfidelityProtections(chart: Chart, name: string): {
  text: string;
  strength: 'strong' | 'moderate' | 'weak';
  profileName: string;
}[] {
  const protections: { text: string; strength: 'strong' | 'moderate' | 'weak'; profileName: string }[] = [];
  const benefics = ['Jupiter', 'Venus', 'Mercury', 'Moon'];

  // 0. Navamsa (D9) Moral/Spiritual Strength (Moved from Divorce)
  if (chart.vargaCharts?.D9) {
    const d9 = chart.vargaCharts.D9;
    const d9Jupiter = d9.planetaryPositions?.find(p => p.planet === 'Jupiter');
    if (d9Jupiter && [1, 7].includes(d9Jupiter.house)) {
      protections.push({
        text: `Navamsa Deep Ethics: Jupiter in D9 ${d9Jupiter.house === 1 ? 'Ascendant' : '7th house'} indicates deep soul-level ethical commitment and moral protection`,
        strength: 'strong',
        profileName: name
      });
    }

    const d9H1 = d9.houses?.find(h => h.houseNumber === 1);
    if (d9H1) {
      const d9LagnaLord = d9.planetaryPositions?.find(p => p.planet === d9H1.lord);
      if (d9LagnaLord && ['exalted', 'own_house'].includes(d9LagnaLord.dignity)) {
        protections.push({
          text: 'Inner Resilience: Navamsa Lagna Lord is exceptionally strong, indicating high spiritual resilience against external temptations',
          strength: 'moderate',
          profileName: name
        });
      }
    }
  }

  // 1. Strong Jupiter (Wisdom/Ethics)
  const jupiter = chart.planetaryPositions.find(p => p.planet === 'Jupiter');
  if (jupiter && ['exalted', 'own_house', 'moolatrikona'].includes(jupiter.dignity)) {
    protections.push({
      text: 'Titan Jupiter: A powerful Jupiter grants deep wisdom and a natural moral compass that inherently rejects deceit.',
      strength: 'strong',
      profileName: name
    });
  }

  // 2. KP Dharma Connection (New migration from Divorce)
  if (chart.kp?.significators) {
    const seventhCusp = chart.kp.cusps.find(c => c.cuspNumber === 7);
    if (seventhCusp) {
      const subLordSignificator = chart.kp.significators.find(s => s.planet === seventhCusp.subLord);
      const sigs = subLordSignificator?.significations || [];
      if (sigs.includes(9)) {
        protections.push({
          text: 'KP Dharmic Alignment: 7th Cusp Sub-Lord connects to the 9th House of Dharma, indicating that righteousness is a core value in relationships.',
          strength: 'strong',
          profileName: name
        });
      }
    }
  }

  // 2. Benefic 9th Lord (Dharma)
  const house9 = chart.houses.find(h => h.houseNumber === 9);
  if (house9) {
    const lord9 = chart.planetaryPositions.find(p => p.planet === house9.lord);
    if (lord9 && benefics.includes(lord9.planet) && ['exalted', 'own_house'].includes(lord9.dignity)) {
      protections.push({
        text: 'Dharmic Shield: The Lord of High Ethics (9th) is powerful, creating a natural aversion to actions that violate your personal code of honor.',
        strength: 'strong',
        profileName: name
      });
    }
  }

  // 3. 4th House Purity (Emotional Contentment)
  const house4 = chart.houses.find(h => h.houseNumber === 4);
  if (house4) {
    const beneficsIn4 = house4.planets.filter(p => benefics.includes(p));
    if (beneficsIn4.length >= 1) {
      protections.push({
        text: 'Domestic Contentment: Benefics in the 4th house suggest a heart that finds peace at home, reducing the "seeking" impulse.',
        strength: 'moderate',
        profileName: name
      });
    }
  }

  // 4. Sun in 10th or 1st (Dignity/Reputation)
  const sun = chart.planetaryPositions.find(p => p.planet === 'Sun');
  if (sun && [1, 10].includes(sun.house)) {
    protections.push({
      text: 'Solar Dignity: A prominent Sun creates a strong ego-ideal and need for public respect, acting as a barrier against scandalous behavior.',
      strength: 'moderate',
      profileName: name
    });
  }

  // 5. Saturn Aspecting Venus (Control over Passion)
  const venus = chart.planetaryPositions.find(p => p.planet === 'Venus');
  const saturn = chart.planetaryPositions.find(p => p.planet === 'Saturn');
  if (venus && saturn) {
    // Checking conjunction or opposition or 10th aspect (Saturn aspects 3, 7, 10 from itself)
    // Simple checks for conjunction/opposition/trine relative to Saturn
    const diff = Math.abs(normalizeDegrees(venus.longitude - saturn.longitude));
    // Saturn aspects: 0 (conjunct), 180 (opp), 60 (3rd), 270 (10th) - approx
    // Actually Saturn aspects 3rd, 7th, 10th houses from itself.
    // Let's stick to simple Conjunction or Opposition for "Restriction"
    if (diff < 10 || Math.abs(diff - 180) < 10) {
      protections.push({
        text: 'Saturn-Venus Control: Saturn\'s restrictive influence on Venus cools down impulsive passions and imposes discipline on romantic desires.',
        strength: 'strong',
        profileName: name
      });
    }
  }

  // 6. Atmakaraka Nobility ("Soul's King")
  if (chart.specialPoints?.atmakaraka) {
    const akPlanet = chart.specialPoints.atmakaraka;
    const akPos = chart.planetaryPositions.find(p => p.planet === akPlanet); // AK is an object from Jaimini calc, but might just be string in specialPoints ref
    // Wait, checking type definition: specialPoints.atmakaraka is 'Planet' (string) in types/index.ts
    // Let's assume it's the planet name string as per the interface
    if (akPos) {
      const isNaturalBenefic = ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(akPlanet as any);
      const isExalted = akPos.dignity === 'exalted';
      const isMoolatrikona = akPos.dignity === 'moolatrikona';

      if (isNaturalBenefic || isExalted || isMoolatrikona) {
        protections.push({
          text: `Atmakaraka Nobility: The Soul Significator (${akPlanet}) is ${isNaturalBenefic ? 'a natural benefic' : 'highly dignified'}, indicating a soul that naturally rejects deceit`,
          strength: 'strong',
          profileName: name
        });
      }
    }
  }

  // 7. Ishta Devata Protection (12th from Karakamsa)
  // Karakamsa = Sign of Atmakaraka in Navamsa
  if (chart.specialPoints?.atmakaraka && chart.vargaCharts.D9) {
    const akName = chart.specialPoints.atmakaraka;
    const d9AK = chart.vargaCharts.D9.planetaryPositions.find(p => p.planet === akName);

    if (d9AK) {
      const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
      const karakamsaIndex = signs.indexOf(d9AK.sign);

      // 12th from Karakamsa
      // index + 11 = 12th house logic
      const ishtaIndex = (karakamsaIndex + 11) % 12;
      const ishtaSign = signs[ishtaIndex];

      const d9BeneficsInIshta = chart.vargaCharts.D9.planetaryPositions.filter(
        p => p.sign === ishtaSign && ['Jupiter', 'Venus', 'Mercury', 'Moon', 'Ketu'].includes(p.planet) // Ketu is Moksha karaka too
      );

      if (d9BeneficsInIshta.length > 0) {
        const pNames = d9BeneficsInIshta.map(p => p.planet).join(', ');
        protections.push({
          text: `Ishta Devata Protection: Benefics/Moksha planets (${pNames}) in 12th from Karakamsa indicate a spiritual path that prioritizes liberation over worldly indulgence`,
          strength: 'strong',
          profileName: name
        });
      }
    }
  }

  // 8. Vargottama Jupiter/Venus ("Consistent Values")
  ['Jupiter', 'Venus'].forEach(planetName => {
    const pD1 = chart.planetaryPositions.find(p => p.planet === planetName);
    const pD9 = chart.vargaCharts.D9?.planetaryPositions.find(p => p.planet === planetName);

    if (pD1 && pD9 && pD1.sign === pD9.sign) {
      protections.push({
        text: `Vargottama ${planetName}: ${planetName} is in the same sign in D1 & D9, indicating deeply consistent ${planetName === 'Jupiter' ? 'moral' : 'romantic'} values that do not waver`,
        strength: 'strong',
        profileName: name
      });
    }
  });

  return protections;
}

// ============================================================================
// AFFAIR CONTEXT ANALYSIS (Risk_kn.md §4.4, §4.6)
// ============================================================================

export function assessAffairContext(chart: Chart, name: string): {
  context: 'workplace' | 'neighbor' | 'social_circle' | 'online' | 'family' | 'foreign_isolated' | 'travel' | 'spiritual' | 'financial' | 'family_taboo' | 'general'; text: string; profileName: string; confidence: 'high' | 'medium' | 'low';
}[] {
  const indicators: {
    context: 'workplace' | 'neighbor' | 'social_circle' | 'online' | 'family' | 'foreign_isolated' | 'travel' | 'spiritual' | 'financial' | 'family_taboo' | 'general';
    text: string;
    profileName: string;
    confidence: 'high' | 'medium' | 'low';
  }[] = [];

  const passionPlanets: Planet[] = ['Venus', 'Mars', 'Rahu'];

  // Helper to get planet position in ANY chart (D1, D9, D10, etc)
  const getPlanetHouse = (chartObj: any, planet: string): number | undefined => {
    return chartObj?.planetaryPositions.find((p: { planet: string; house: number }) => p.planet === planet)?.house;
  };

  // Helper: Get House Object
  const getHouse = (chartObj: any, houseNum: number) => chartObj?.houses.find((h: { houseNumber: number; planets: string[]; lord: string }) => h.houseNumber === houseNum);

  // Key Lords from D1
  const h7 = getHouse(chart, 7);
  const h5 = getHouse(chart, 5);
  const seventhLord = h7?.lord;
  const fifthLord = h5?.lord;

  // Divisional Charts from Varga Object
  const D9 = chart.vargaCharts?.D9;
  const D10 = chart.vargaCharts?.D10; // Career
  const D3 = chart.vargaCharts?.D3;   // Siblings/Neighbor
  const D4 = chart.vargaCharts?.D4;   // Home/Assets (Travel check)
  const D20 = chart.vargaCharts?.D20; // Spiritual
  const D2 = chart.vargaCharts?.D2;   // Wealth
  const D12 = chart.vargaCharts?.D12; // Parents/Lineage

  // ---------------------------------------------------------
  // 1. WORKPLACE CONTEXT (Career/Office)
  // Logic: 
  // D1: 7th/5th Lord in 6th/10th OR 10th Lord in 7th
  // D9: Venus/Mars in 10th
  // D10: 7th Lord of D1 in 10th of D10
  // ---------------------------------------------------------
  const h6 = getHouse(chart, 6);
  const h10 = getHouse(chart, 10);
  let workplaceScore = 0;
  let workplaceText = '';

  // D1 Checks
  if (h10 && h7 && h10.planets.includes(seventhLord)) {
    workplaceScore += 2; workplaceText = '7th Lord in 10th House (Partner from Career)';
  }
  if (h6 && h7 && h6.planets.includes(seventhLord)) {
    workplaceScore += 1; workplaceText = '7th Lord in 6th House (Partner from Service/Work)';
  }
  if (h10 && h5 && h10.planets.includes(fifthLord)) {
    workplaceScore += 2; workplaceText = '5th Lord in 10th House (Romance in Career)';
  }

  // D9 Confirmation
  if (getPlanetHouse(D9, 'Venus') === 10 || getPlanetHouse(D9, 'Mars') === 10) {
    workplaceScore += 2; workplaceText += ' + D9 Passion in 10th';
  }

  // D10 Specific Confirmation
  if (D10 && seventhLord && getPlanetHouse(D10, seventhLord) === 10) {
    workplaceScore += 3; workplaceText += ' + 7th Lord of D1 is in 10th of D10 (Strong)';
  }

  if (workplaceScore >= 2) {
    indicators.push({
      context: 'workplace',
      text: workplaceText,
      profileName: name,
      confidence: workplaceScore >= 4 ? 'high' : 'medium'
    });
  }

  // ---------------------------------------------------------
  // 2. NEIGHBOR / LOCAL CONTEXT
  // Logic: 
  // D1: 7th/5th Lord in 3rd
  // D9: Venus/Mars in 3rd
  // D3: 7th Lord of D1 in 3rd of D3
  // ---------------------------------------------------------
  const h3 = getHouse(chart, 3);
  let neighborScore = 0;
  let neighborText = '';

  if (h3 && h7 && h3.planets.includes(seventhLord)) {
    neighborScore += 2; neighborText = '7th Lord in 3rd House (Partner is Neighbor/Local)';
  }
  if (h3 && h5 && h3.planets.includes(fifthLord)) {
    neighborScore += 2; neighborText = '5th Lord in 3rd House (Romance in Neighborhood)';
  }

  if (getPlanetHouse(D9, 'Venus') === 3 || getPlanetHouse(D9, 'Mars') === 3) {
    neighborScore += 1; neighborText += ' + D9 Passion in 3rd';
  }

  if (D3 && seventhLord && getPlanetHouse(D3, seventhLord) === 3) {
    neighborScore += 3; neighborText += ' + 7th Lord of D1 is in 3rd of D3 (Specific)';
  }

  if (neighborScore >= 2) {
    indicators.push({
      context: 'neighbor',
      text: neighborText,
      profileName: name,
      confidence: neighborScore >= 4 ? 'high' : 'medium'
    });
  }

  // ---------------------------------------------------------
  // 3. TRAVEL / FOREIGN CONTEXT
  // Logic: D1 7th/5th in 9th/12th + D4/D9 Confirmation
  // ---------------------------------------------------------
  const h9 = getHouse(chart, 9);
  const h12 = getHouse(chart, 12);
  let travelScore = 0;
  let travelText = '';

  if ((h9 && h7 && h9.planets.includes(seventhLord)) || (h12 && h7 && h12.planets.includes(seventhLord))) {
    travelScore += 2; travelText = '7th Lord in 9th/12th (Partner from Travel/Foreign)';
  }

  if (D4 && seventhLord && (getPlanetHouse(D4, seventhLord) === 9 || getPlanetHouse(D4, seventhLord) === 12)) {
    travelScore += 3; travelText += ' + 7th Lord in 9th/12th of D4 (Chaturthamsha)';
  }

  if (travelScore >= 2) {
    indicators.push({
      context: 'travel',
      text: travelText,
      profileName: name,
      confidence: travelScore >= 4 ? 'high' : 'medium'
    });
  }

  // ---------------------------------------------------------
  // 4. SPIRITUAL / GURU CONTEXT (Ashram/Mentor)
  // Logic: D1 7th in 9th/Conjunct Jupiter + D20 Confirmation
  // ---------------------------------------------------------
  let spiritScore = 0;
  let spiritText = '';

  // 7th Lord with Jupiter or in 9th
  if (h9 && h7 && (h9.planets.includes(seventhLord) || h9.planets.includes(fifthLord))) {
    spiritScore += 2; spiritText = 'Romance/Partner Lord in 9th House';
  }
  // Guru Chandal Yoga influence (Jupiter + Rahu)
  const jupiter = chart.planetaryPositions.find(p => p.planet === 'Jupiter');
  const rahu = chart.planetaryPositions.find(p => p.planet === 'Rahu');
  if (jupiter && rahu && Math.abs(normalizeDegrees(jupiter.longitude - rahu.longitude)) < 10) {
    spiritScore += 1; spiritText += ' + Guru Chandal Yoga';
  }

  if (D20 && seventhLord && (getPlanetHouse(D20, seventhLord) === 9 || getPlanetHouse(D20, seventhLord) === 5)) {
    spiritScore += 3; spiritText += ' + 7th Lord in 9th/5th of D20 (Spiritual Chart)';
  }

  if (spiritScore >= 3) { // Higher threshold for this rare context
    indicators.push({
      context: 'spiritual',
      text: spiritText,
      profileName: name,
      confidence: spiritScore >= 4 ? 'high' : 'medium'
    });
  }

  // ---------------------------------------------------------
  // 5. FINANCIAL / BUSINESS CONTEXT
  // Logic: D1 7th in 2nd/11th + D2 Confirmation
  // ---------------------------------------------------------
  const h2 = getHouse(chart, 2);
  const h11 = getHouse(chart, 11);
  let financeScore = 0;
  let financeText = '';

  if ((h2 && h2.planets.includes(seventhLord)) || (h11 && h11.planets.includes(seventhLord))) {
    financeScore += 2; financeText = '7th Lord in 2nd/11th (Partner from Wealth/Gain Circles)';
  }

  if (D2 && seventhLord && (getPlanetHouse(D2, seventhLord) === 2 || getPlanetHouse(D2, seventhLord) === 11)) {
    financeScore += 3; financeText += ' + 7th Lord in 2nd/11th of D2 (Hora)';
  }

  if (financeScore >= 3) {
    indicators.push({
      context: 'financial',
      text: financeText,
      profileName: name,
      confidence: financeScore >= 4 ? 'high' : 'medium'
    });
  }

  // ---------------------------------------------------------
  // 6. DOMESTIC / INCEST CONTEXT (Taboo/Family)
  // Logic: 
  // D1: 7th Lord in 4th/9th AND Heavily Afflicted (Rahu/Ketu/8th Lord)
  // D12: 7th Lord in 4th/9th of D12
  // Note: This requires strict checking to avoid false alarms.
  // ---------------------------------------------------------
  const h4 = getHouse(chart, 4);
  const h8 = getHouse(chart, 8);
  const lord8 = h8?.lord;
  let tabooScore = 0;
  let tabooText = '';

  // D1: 7th Lord in 4th (Mother/Home) or 9th (Father)
  const inSensitiveHouse = (h4 && h4.planets.includes(seventhLord)) || (h9 && h9.planets.includes(seventhLord));

  if (inSensitiveHouse) {
    // Must be Afflicted by Rahu, Ketu, or 8th Lord to be "Taboo"
    const seventhLordPos = chart.planetaryPositions.find(p => p.planet === seventhLord);
    const isAfflicted = chart.planetaryPositions.some(p =>
      ['Rahu', 'Ketu', lord8].includes(p.planet) &&
      seventhLordPos &&
      Math.abs(normalizeDegrees(p.longitude - seventhLordPos.longitude)) < 15
    );

    if (isAfflicted) {
      tabooScore += 2; tabooText = '7th Lord in 4th/9th heavily afflicted (Taboo indicator)';
    }
  }

  // D12 Confirmation (Ancestral/Parents)
  if (D12 && seventhLord && (getPlanetHouse(D12, seventhLord) === 4 || getPlanetHouse(D12, seventhLord) === 9)) {
    tabooScore += 3; tabooText += ' + 7th Lord in 4th/9th of D12 (Dwadasamsa)';
  }

  // D9 Confirmation (Secret)
  if (getPlanetHouse(D9, 'Venus') === 4 || getPlanetHouse(D9, 'Venus') === 9) {
    tabooScore += 1;
  }

  if (tabooScore >= 3) {
    indicators.push({
      context: 'family_taboo',
      text: tabooText,
      profileName: name,
      confidence: tabooScore >= 4 ? 'high' : 'medium'
    });
  }

  // ---------------------------------------------------------
  // KP SYSTEM VALIDATOR (Final Layer)
  // Logic: Check if 7th Cusp Sublord signifies specific houses
  // ---------------------------------------------------------
  const checkKp7thSublord = (signifiedHouses: number[]): boolean => {
    if (!chart.kp || !chart.kp.cusps) return false;
    const cusp7 = chart.kp.cusps.find((c: any) => c.house === 7);
    if (!cusp7 || !cusp7.subLord) return false;

    const subLordPlanet = cusp7.subLord;
    const subLordPos = chart.planetaryPositions.find(p => p.planet === subLordPlanet);
    if (!subLordPos) return false;

    // Check Occupation
    if (signifiedHouses.includes(subLordPos.house)) return true;

    // Check Ownership
    const ownedHouses = chart.houses.filter(h => h.lord === subLordPlanet).map(h => h.houseNumber);
    if (ownedHouses.some(h => signifiedHouses.includes(h))) return true;

    return false;
  };

  // 1. Workplace KP Check (6, 10)
  if (checkKp7thSublord([6, 10])) {
    workplaceScore += 2; workplaceText += ' + KP: 7th Cusp Sublord links to 6/10';
  }
  // Re-evaluate Workplace
  if (workplaceScore >= 2) {
    // Check if already pushed, if so update, else push
    const existing = indicators.find(i => i.context === 'workplace');
    if (existing) {
      existing.text = workplaceText;
      existing.confidence = workplaceScore >= 4 ? 'high' : 'medium';
    } else {
      indicators.push({
        context: 'workplace',
        text: workplaceText,
        profileName: name,
        confidence: workplaceScore >= 4 ? 'high' : 'medium'
      });
    }
  }

  // 2. Neighbor KP Check (3)
  if (checkKp7thSublord([3])) {
    neighborScore += 2; neighborText += ' + KP: 7th Cusp Sublord links to 3rd';
  }
  if (neighborScore >= 2) {
    const existing = indicators.find(i => i.context === 'neighbor');
    if (existing) {
      existing.text = neighborText;
      existing.confidence = neighborScore >= 4 ? 'high' : 'medium';
    } else {
      indicators.push({
        context: 'neighbor',
        text: neighborText,
        profileName: name,
        confidence: neighborScore >= 4 ? 'high' : 'medium'
      });
    }
  }

  // 3. Travel KP Check (9, 12)
  if (checkKp7thSublord([9, 12])) {
    travelScore += 2; travelText += ' + KP: 7th Cusp Sublord links to 9/12';
  }
  if (travelScore >= 2) {
    const existing = indicators.find(i => i.context === 'travel');
    if (existing) {
      existing.text = travelText;
      existing.confidence = travelScore >= 4 ? 'high' : 'medium';
    } else {
      indicators.push({
        context: 'travel',
        text: travelText,
        profileName: name,
        confidence: travelScore >= 4 ? 'high' : 'medium'
      });
    }
  }

  // 4. Spiritual KP Check (9, 5)
  if (checkKp7thSublord([9, 5])) {
    spiritScore += 2; spiritText += ' + KP: 7th Cusp Sublord links to 5/9';
  }
  if (spiritScore >= 3) {
    const existing = indicators.find(i => i.context === 'spiritual');
    if (existing) {
      existing.text = spiritText;
      existing.confidence = spiritScore >= 4 ? 'high' : 'medium';
    } else {
      indicators.push({
        context: 'spiritual',
        text: spiritText,
        profileName: name,
        confidence: spiritScore >= 4 ? 'high' : 'medium'
      });
    }
  }

  // 5. Financial KP Check (2, 11)
  if (checkKp7thSublord([2, 11])) {
    financeScore += 2; financeText += ' + KP: 7th Cusp Sublord links to 2/11';
  }
  if (financeScore >= 3) {
    const existing = indicators.find(i => i.context === 'financial');
    if (existing) {
      existing.text = financeText;
      existing.confidence = financeScore >= 4 ? 'high' : 'medium';
    } else {
      indicators.push({
        context: 'financial',
        text: financeText,
        profileName: name,
        confidence: financeScore >= 4 ? 'high' : 'medium'
      });
    }
  }

  // 6. Domestic/Incest KP Check (4, 8)
  // Must link to 4 (Home) AND 8 (Secret/Taboo) or 12 (Bed)
  if (checkKp7thSublord([4]) && (checkKp7thSublord([8]) || checkKp7thSublord([12]))) {
    tabooScore += 2; tabooText += ' + KP: 7th Cusp Sublord links to 4 & 8/12';
  }
  if (tabooScore >= 3) {
    const existing = indicators.find(i => i.context === 'family_taboo');
    if (existing) {
      existing.text = tabooText;
      existing.confidence = tabooScore >= 4 ? 'high' : 'medium';
    } else {
      indicators.push({
        context: 'family_taboo',
        text: tabooText,
        profileName: name,
        confidence: tabooScore >= 4 ? 'high' : 'medium'
      });
    }
  }

  // Default Social Circle Logic (Fallback)
  if (h11 && h5) {
    const passion11 = h11.planets.some((p: string) => passionPlanets.includes(p as Planet));
    const passion5 = h5.planets.some((p: string) => passionPlanets.includes(p as Planet));
    if (passion11 && passion5) {
      indicators.push({ context: 'social_circle', text: 'Passion planets in 11th and 5th houses', profileName: name, confidence: 'medium' });
    }
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