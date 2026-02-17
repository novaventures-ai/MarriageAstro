/**
 * Addiction & Compulsion Risk Calculations
 * Detects astrological indicators for addictive and compulsive behavior patterns
 * Based on Risk_kn.md §6, traditional Vedic texts, and Western astrology
 */

import { Chart, Planet, Sign } from '@types';
import { normalizeDegrees } from './coreCalculations';

// ============================================================================
// TYPES
// ============================================================================

export interface AddictionIndicator {
    name: string;
    category: 'sex_addiction' | 'alcohol_substance' | 'drug_addiction' | 'compulsive_behavior' | 'neptune_western';
    present: boolean;
    severity: 'low' | 'moderate' | 'high';
    description: string;
    contributingFactors: string[];
    involvedPlanets: string[];
}

export interface AddictionCategory {
    category: string;
    label: string;
    icon: string;
    riskScore: number; // 0-100
    riskLevel: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
    indicators: AddictionIndicator[];
    interpretation: string;
}

export interface AddictionProtectiveFactor {
    name: string;
    present: boolean;
    strength: 'strong' | 'moderate' | 'weak';
    description: string;
    planet: string;
}

export interface AddictionRiskAnalysis {
    categories: AddictionCategory[];
    protectiveFactors: AddictionProtectiveFactor[];
    overallRisk: 'low' | 'moderate' | 'high';
    overallScore: number;
    summary: string;
    disclaimer: string;
}

// ============================================================================
// HELPERS
// ============================================================================

function isConjunct(chart: Chart, p1: Planet, p2: Planet, orb = 10): boolean {
    const pos1 = chart.planetaryPositions.find(p => p.planet === p1);
    const pos2 = chart.planetaryPositions.find(p => p.planet === p2);
    if (!pos1 || !pos2) return false;
    const diff = Math.abs(normalizeDegrees(pos1.longitude - pos2.longitude));
    return Math.min(diff, 360 - diff) < orb;
}

function getPos(chart: Chart, planet: Planet) {
    return chart.planetaryPositions.find(p => p.planet === planet);
}

function planetsInHouse(chart: Chart, house: number): Planet[] {
    return chart.planetaryPositions
        .filter(p => p.house === house)
        .map(p => p.planet);
}

function hasAspect(chart: Chart, p1: Planet, p2: Planet, orb = 8): boolean {
    const pos1 = chart.planetaryPositions.find(p => p.planet === p1);
    const pos2 = chart.planetaryPositions.find(p => p.planet === p2);
    if (!pos1 || !pos2) return false;
    const diff = Math.abs(normalizeDegrees(pos1.longitude - pos2.longitude));
    const normalizedDiff = Math.min(diff, 360 - diff);
    // Major aspects: conjunction(0), opposition(180), trine(120), square(90), sextile(60)
    return [0, 60, 90, 120, 180].some(a => Math.abs(normalizedDiff - a) < orb);
}

// ============================================================================
// CATEGORY 1: SEX / PORNOGRAPHY ADDICTION
// ============================================================================

function assessSexAddictionRisk(chart: Chart): AddictionCategory {
    const indicators: AddictionIndicator[] = [];

    // 1. Venus-Rahu-Mars in 8th or 12th
    const venus = getPos(chart, 'Venus');
    const mars = getPos(chart, 'Mars');
    const rahu = getPos(chart, 'Rahu');
    const venusIn812 = venus && [8, 12].includes(venus.house);
    const marsIn812 = mars && [8, 12].includes(mars.house);
    const rahuIn812 = rahu && [8, 12].includes(rahu.house);
    const count812 = [venusIn812, marsIn812, rahuIn812].filter(Boolean).length;
    indicators.push({
        name: 'Venus-Mars-Rahu in 8th/12th',
        category: 'sex_addiction',
        present: count812 >= 2,
        severity: count812 >= 3 ? 'high' : count812 >= 2 ? 'moderate' : 'low',
        description: count812 >= 2
            ? `${count812} desire planets (Venus/Mars/Rahu) concentrated in houses of hidden pleasures (8th/12th)`
            : 'Desire planets not concentrated in secretive houses',
        contributingFactors: [
            ...(venusIn812 ? [`Venus in ${venus!.house}th (hidden sensuality)`] : []),
            ...(marsIn812 ? [`Mars in ${mars!.house}th (aggressive desires)`] : []),
            ...(rahuIn812 ? [`Rahu in ${rahu!.house}th (obsessive urges)`] : [])
        ],
        involvedPlanets: [
            ...(venusIn812 ? ['Venus'] : []),
            ...(marsIn812 ? ['Mars'] : []),
            ...(rahuIn812 ? ['Rahu'] : [])
        ]
    });

    // 2. Afflicted Moon (emotional vulnerability to addiction)
    const moon = getPos(chart, 'Moon');
    const moonAfflicted = moon && (
        isConjunct(chart, 'Moon', 'Rahu') ||
        isConjunct(chart, 'Moon', 'Ketu') ||
        (moon.house === 8 || moon.house === 12)
    );
    indicators.push({
        name: 'Afflicted Moon (emotional void)',
        category: 'sex_addiction',
        present: !!moonAfflicted,
        severity: moonAfflicted ? 'moderate' : 'low',
        description: moonAfflicted
            ? 'Moon afflicted by nodes or placed in 8th/12th — emotional emptiness drives compulsive seeking'
            : 'Moon is not significantly afflicted — emotional stability acts as protection',
        contributingFactors: moonAfflicted ? [
            ...(isConjunct(chart, 'Moon', 'Rahu') ? ['Moon-Rahu conjunction (obsessive mind)'] : []),
            ...(isConjunct(chart, 'Moon', 'Ketu') ? ['Moon-Ketu conjunction (emotional detachment)'] : []),
            ...(moon && [8, 12].includes(moon.house) ? [`Moon in ${moon.house}th house (hidden emotional patterns)`] : [])
        ] : [],
        involvedPlanets: ['Moon', ...(isConjunct(chart, 'Moon', 'Rahu') ? ['Rahu'] : []), ...(isConjunct(chart, 'Moon', 'Ketu') ? ['Ketu'] : [])]
    });

    // 3. 5th-12th house connection (romance + hidden pleasures)
    const fifthLord = chart.houses[4]?.lord;
    const fifthLordPos = fifthLord ? getPos(chart, fifthLord) : null;
    const twelfthLord = chart.houses[11]?.lord;
    const twelfthLordPos = twelfthLord ? getPos(chart, twelfthLord) : null;
    const fifthTwelfthLink = (fifthLordPos && fifthLordPos.house === 12) || (twelfthLordPos && twelfthLordPos.house === 5) || (fifthLord && twelfthLord && isConjunct(chart, fifthLord, twelfthLord));
    indicators.push({
        name: '5th-12th House Connection',
        category: 'sex_addiction',
        present: !!fifthTwelfthLink,
        severity: fifthTwelfthLink ? 'moderate' : 'low',
        description: fifthTwelfthLink
            ? '5th lord (romance) connected to 12th house (hidden pleasures) — secret romantic/sexual pursuits'
            : 'No significant 5th-12th connection — romantic pursuits stay conventional',
        contributingFactors: fifthTwelfthLink ? [
            ...(fifthLordPos && fifthLordPos.house === 12 ? [`5th lord ${fifthLord} in 12th`] : []),
            ...(twelfthLordPos && twelfthLordPos.house === 5 ? [`12th lord ${twelfthLord} in 5th`] : [])
        ] : [],
        involvedPlanets: [fifthLord || 'Sun', twelfthLord || 'Sun']
    });

    // 4. Venus-Rahu conjunction (unquenchable thirst)
    const venusRahu = isConjunct(chart, 'Venus', 'Rahu');
    indicators.push({
        name: 'Venus-Rahu Conjunction',
        category: 'sex_addiction',
        present: venusRahu,
        severity: venusRahu ? 'high' : 'low',
        description: venusRahu
            ? 'Venus-Rahu conjunction — "unquenchable thirst" for sensual experiences; amplified desires beyond normal'
            : 'Venus and Rahu are not conjunct — desires stay within normal range',
        contributingFactors: venusRahu ? ['Venus amplified by Rahu (insatiable)', 'Unconventional sensual attractions'] : [],
        involvedPlanets: ['Venus', 'Rahu']
    });

    const activeIndicators = indicators.filter(i => i.present);
    const score = Math.min(100, activeIndicators.reduce((s, i) => s + (i.severity === 'high' ? 35 : i.severity === 'moderate' ? 20 : 5), 0));
    const riskLevel = score >= 70 ? 'very_high' : score >= 50 ? 'high' : score >= 30 ? 'moderate' : score >= 10 ? 'low' : 'very_low';

    return {
        category: 'sex_addiction',
        label: 'Sexual Compulsion Risk',
        icon: '🔥',
        riskScore: score,
        riskLevel,
        indicators,
        interpretation: activeIndicators.length > 0
            ? `${activeIndicators.length} indicator(s) suggest vulnerability to compulsive sexual behavior. ${score >= 50 ? 'Significant risk — awareness and disciplined practices recommended.' : 'Moderate tendency — manageable with self-awareness.'}`
            : 'No significant indicators for compulsive sexual behavior detected.'
    };
}

// ============================================================================
// CATEGORY 2: ALCOHOL / SUBSTANCE ABUSE
// ============================================================================

function assessAlcoholSubstanceRisk(chart: Chart): AddictionCategory {
    const indicators: AddictionIndicator[] = [];

    // 1. 2nd house (consumption) → 6th house (disease) → 12th house (escape) chain
    const secondLord = chart.houses[1]?.lord;
    const secondLordPos = secondLord ? getPos(chart, secondLord) : null;
    const sixthLord = chart.houses[5]?.lord;
    const sixthLordPos = sixthLord ? getPos(chart, sixthLord) : null;
    const twelfthLord = chart.houses[11]?.lord;
    const chainActive = (secondLordPos && [6, 12].includes(secondLordPos.house)) || (sixthLordPos && [2, 12].includes(sixthLordPos.house));
    indicators.push({
        name: '2-6-12 Consumption Chain',
        category: 'alcohol_substance',
        present: !!chainActive,
        severity: chainActive ? 'high' : 'low',
        description: chainActive
            ? '2nd lord (intake/consumption) connected to 6th (disease/habit) or 12th (escape/loss) — classic addiction axis'
            : 'No significant 2-6-12 chain connection — consumption habits stay controlled',
        contributingFactors: [
            ...(secondLordPos && secondLordPos.house === 6 ? [`2nd lord ${secondLord} in 6th (intake → habit)`] : []),
            ...(secondLordPos && secondLordPos.house === 12 ? [`2nd lord ${secondLord} in 12th (intake → escape)`] : []),
            ...(sixthLordPos && sixthLordPos.house === 2 ? [`6th lord ${sixthLord} in 2nd (disease → consumption)`] : []),
            ...(sixthLordPos && sixthLordPos.house === 12 ? [`6th lord ${sixthLord} in 12th (disease → loss)`] : [])
        ],
        involvedPlanets: [secondLord || 'Sun', sixthLord || 'Sun', twelfthLord || 'Sun']
    });

    // 2. Moon-Venus affliction (emotional/pleasure dependency)
    const moonVenus = isConjunct(chart, 'Moon', 'Venus');
    const moon = getPos(chart, 'Moon');
    const venus = getPos(chart, 'Venus');
    const moonVenusAfflicted = moonVenus && (
        (moon && ['enemy', 'debilitated'].includes(moon.dignity)) ||
        (venus && ['enemy', 'debilitated'].includes(venus.dignity))
    );
    indicators.push({
        name: 'Moon-Venus Affliction',
        category: 'alcohol_substance',
        present: !!moonVenusAfflicted,
        severity: moonVenusAfflicted ? 'moderate' : 'low',
        description: moonVenusAfflicted
            ? 'Moon-Venus conjunction with weak dignity — emotional comfort sought through substances or indulgence'
            : 'Moon-Venus relationship is not afflicted — emotional needs met in healthy ways',
        contributingFactors: moonVenusAfflicted ? ['Weak Moon or Venus amplifies dependency patterns', 'Seeking pleasure to fill emotional gaps'] : [],
        involvedPlanets: ['Moon', 'Venus']
    });

    // 3. Rahu involvement with 2nd house (intoxicants)
    const rahu = getPos(chart, 'Rahu');
    const rahuIn2nd = rahu && rahu.house === 2;
    const rahuWith2ndLord = secondLord ? isConjunct(chart, 'Rahu', secondLord) : false;
    const rahuInvolvement = rahuIn2nd || rahuWith2ndLord;
    indicators.push({
        name: 'Rahu & 2nd House Connection',
        category: 'alcohol_substance',
        present: !!rahuInvolvement,
        severity: rahuInvolvement ? 'high' : 'low',
        description: rahuInvolvement
            ? 'Rahu connected to 2nd house (intake) — obsessive consumption patterns, unconventional substances'
            : 'Rahu not connected to 2nd house — intake habits stay conventional',
        contributingFactors: [
            ...(rahuIn2nd ? ['Rahu in 2nd house (amplified consumption)'] : []),
            ...(rahuWith2ndLord ? [`Rahu conjunct 2nd lord ${secondLord} (obsessive intake)`] : [])
        ],
        involvedPlanets: ['Rahu', ...(secondLord ? [secondLord] : [])]
    });

    // 4. Saturn in watery signs aspecting Moon (depression-driven drinking)
    const saturn = getPos(chart, 'Saturn');
    const waterySigns: Sign[] = ['Cancer', 'Scorpio', 'Pisces'];
    const saturnWatery = saturn && waterySigns.includes(saturn.sign);
    const saturnMoonAspect = hasAspect(chart, 'Saturn', 'Moon');
    const depressionDrinking = saturnWatery && saturnMoonAspect;
    indicators.push({
        name: 'Saturn-Moon Depression Pattern',
        category: 'alcohol_substance',
        present: !!depressionDrinking,
        severity: depressionDrinking ? 'moderate' : 'low',
        description: depressionDrinking
            ? 'Saturn in watery sign aspecting Moon — emotional heaviness can drive substance use as coping mechanism'
            : 'Saturn-Moon interaction does not indicate depression-driven substance patterns',
        contributingFactors: depressionDrinking ? [
            `Saturn in ${saturn!.sign} (emotional restriction in watery environment)`,
            'Saturn aspecting Moon (chronic emotional heaviness)'
        ] : [],
        involvedPlanets: ['Saturn', 'Moon']
    });

    const activeIndicators = indicators.filter(i => i.present);
    const score = Math.min(100, activeIndicators.reduce((s, i) => s + (i.severity === 'high' ? 35 : i.severity === 'moderate' ? 20 : 5), 0));
    const riskLevel = score >= 70 ? 'very_high' : score >= 50 ? 'high' : score >= 30 ? 'moderate' : score >= 10 ? 'low' : 'very_low';

    return {
        category: 'alcohol_substance',
        label: 'Alcohol & Substance Risk',
        icon: '🍷',
        riskScore: score,
        riskLevel,
        indicators,
        interpretation: activeIndicators.length > 0
            ? `${activeIndicators.length} indicator(s) point to vulnerability for alcohol or substance dependency. ${score >= 50 ? 'Caution: strong astrological pattern for addiction present.' : 'Mild susceptibility — lifestyle discipline recommended.'}`
            : 'No significant substance addiction indicators found.'
    };
}

// ============================================================================
// CATEGORY 3: DRUG ADDICTION
// ============================================================================

function assessDrugAddictionRisk(chart: Chart): AddictionCategory {
    const indicators: AddictionIndicator[] = [];

    // 1. Rahu-Ketu axis prominence (obsession-detachment cycle)
    const rahu = getPos(chart, 'Rahu');
    const ketu = getPos(chart, 'Ketu');
    const rahuKetuin1_7 = (rahu && [1, 7].includes(rahu.house)) || (ketu && [1, 7].includes(ketu.house));
    const nodesIn612 = (rahu && [6, 12].includes(rahu.house)) || (ketu && [6, 12].includes(ketu.house));
    indicators.push({
        name: 'Rahu-Ketu Axis Prominence',
        category: 'drug_addiction',
        present: !!(rahuKetuin1_7 || nodesIn612),
        severity: (rahuKetuin1_7 && nodesIn612) ? 'high' : (rahuKetuin1_7 || nodesIn612) ? 'moderate' : 'low',
        description: (rahuKetuin1_7 || nodesIn612)
            ? 'Rahu-Ketu in identity (1st/7th) or escapism (6th/12th) houses — intense obsession-detachment cycle facilitates drug dependency'
            : 'Rahu-Ketu axis not prominently placed for drug risk',
        contributingFactors: [
            ...(rahu && [1, 7].includes(rahu.house) ? [`Rahu in ${rahu.house}st/7th (identity obsession)`] : []),
            ...(ketu && [1, 7].includes(ketu.house) ? [`Ketu in ${ketu.house}st/7th (spiritual escapism)`] : []),
            ...(rahu && [6, 12].includes(rahu.house) ? [`Rahu in ${rahu.house}th (obsessive escape)`] : []),
            ...(ketu && [6, 12].includes(ketu.house) ? [`Ketu in ${ketu.house}th (detachment drive)`] : [])
        ],
        involvedPlanets: ['Rahu', 'Ketu']
    });

    // 2. 6-8-12 house grouping (disease-transformation-loss)
    const planets6 = planetsInHouse(chart, 6);
    const planets8 = planetsInHouse(chart, 8);
    const planets12 = planetsInHouse(chart, 12);
    const dusthanaLoad = planets6.length + planets8.length + planets12.length;
    indicators.push({
        name: '6-8-12 Dusthana Concentration',
        category: 'drug_addiction',
        present: dusthanaLoad >= 4,
        severity: dusthanaLoad >= 6 ? 'high' : dusthanaLoad >= 4 ? 'moderate' : 'low',
        description: dusthanaLoad >= 4
            ? `${dusthanaLoad} planets in dusthana houses (6/8/12) — heavy karmic load creates escape-seeking patterns`
            : 'Dusthana houses not overloaded — no strong escapist tendencies from planetary concentration',
        contributingFactors: [
            ...(planets6.length > 0 ? [`House 6: ${planets6.join(', ')} (disease/enemies)`] : []),
            ...(planets8.length > 0 ? [`House 8: ${planets8.join(', ')} (transformation/crisis)`] : []),
            ...(planets12.length > 0 ? [`House 12: ${planets12.join(', ')} (loss/escape/foreign)`] : [])
        ],
        involvedPlanets: [...planets6, ...planets8, ...planets12]
    });

    // 3. Mercury afflicted (nervous system vulnerability)
    const mercury = getPos(chart, 'Mercury');
    const mercuryAfflicted = mercury && (
        isConjunct(chart, 'Mercury', 'Rahu') ||
        isConjunct(chart, 'Mercury', 'Saturn') ||
        (mercury.dignity === 'debilitated')
    );
    indicators.push({
        name: 'Afflicted Mercury (nervous vulnerability)',
        category: 'drug_addiction',
        present: !!mercuryAfflicted,
        severity: mercuryAfflicted ? 'moderate' : 'low',
        description: mercuryAfflicted
            ? 'Mercury afflicted by malefics or debilitated — nervous system vulnerability makes the person susceptible to stimulant/depressant dependency'
            : 'Mercury is well-placed — nervous system resilience acts as protection',
        contributingFactors: mercuryAfflicted ? [
            ...(isConjunct(chart, 'Mercury', 'Rahu') ? ['Mercury-Rahu (racing thoughts, seeking chemical calm)'] : []),
            ...(isConjunct(chart, 'Mercury', 'Saturn') ? ['Mercury-Saturn (chronic anxiety, self-medication)'] : []),
            ...(mercury.dignity === 'debilitated' ? ['Mercury debilitated (weak mental coping)'] : [])
        ] : [],
        involvedPlanets: ['Mercury']
    });

    const activeIndicators = indicators.filter(i => i.present);
    const score = Math.min(100, activeIndicators.reduce((s, i) => s + (i.severity === 'high' ? 35 : i.severity === 'moderate' ? 20 : 5), 0));
    const riskLevel = score >= 70 ? 'very_high' : score >= 50 ? 'high' : score >= 30 ? 'moderate' : score >= 10 ? 'low' : 'very_low';

    return {
        category: 'drug_addiction',
        label: 'Drug Addiction Risk',
        icon: '💊',
        riskScore: score,
        riskLevel,
        indicators,
        interpretation: activeIndicators.length > 0
            ? `${activeIndicators.length} indicator(s) suggest vulnerability to drug dependency. ${score >= 50 ? 'Strong planetary patterns present — professional support and spiritual discipline highly recommended.' : 'Mild susceptibility detected — awareness is key.'}`
            : 'No significant drug addiction indicators found in the chart.'
    };
}

// ============================================================================
// CATEGORY 4: COMPULSIVE BEHAVIOR PATTERNS
// ============================================================================

function assessCompulsiveBehaviorRisk(chart: Chart): AddictionCategory {
    const indicators: AddictionIndicator[] = [];

    // 1. 5th-12th house emphasis (romance + isolation = compulsive fantasy)
    const planets5 = planetsInHouse(chart, 5);
    const planets12 = planetsInHouse(chart, 12);
    const fivetwelveEmphasis = planets5.length >= 2 && planets12.length >= 1;
    indicators.push({
        name: '5th-12th Emphasis (compulsive fantasy)',
        category: 'compulsive_behavior',
        present: fivetwelveEmphasis,
        severity: fivetwelveEmphasis ? 'moderate' : 'low',
        description: fivetwelveEmphasis
            ? '5th house (pleasure/creativity) overloaded with 12th house involvement — compulsive fantasy patterns'
            : '5th-12th combination not significantly activated',
        contributingFactors: fivetwelveEmphasis ? [
            `House 5: ${planets5.join(', ')} (pleasure seeking)`,
            `House 12: ${planets12.join(', ')} (escapism via fantasy)`
        ] : [],
        involvedPlanets: [...planets5, ...planets12]
    });

    // 2. Isolated Mars/Venus (frustrated desire drives compulsion)
    const mars = getPos(chart, 'Mars');
    const venus = getPos(chart, 'Venus');
    const marsIsolated = mars && [6, 8, 12].includes(mars.house) && mars.dignity !== 'exalted' && mars.dignity !== 'own_house';
    const venusIsolated = venus && [6, 8, 12].includes(venus.house) && venus.dignity !== 'exalted' && venus.dignity !== 'own_house';
    indicators.push({
        name: 'Mars/Venus in Dusthana (frustrated desire)',
        category: 'compulsive_behavior',
        present: !!(marsIsolated || venusIsolated),
        severity: (marsIsolated && venusIsolated) ? 'high' : (marsIsolated || venusIsolated) ? 'moderate' : 'low',
        description: (marsIsolated || venusIsolated)
            ? 'Desire planets (Mars/Venus) in difficult houses without strength — frustrated desires generate compulsive patterns'
            : 'Mars and Venus are well-placed — desire fulfillment channels are healthy',
        contributingFactors: [
            ...(marsIsolated ? [`Mars in ${mars!.house}th in ${mars!.dignity} dignity (frustrated action)`] : []),
            ...(venusIsolated ? [`Venus in ${venus!.house}th in ${venus!.dignity} dignity (frustrated pleasure)`] : [])
        ],
        involvedPlanets: [...(marsIsolated ? ['Mars'] : []), ...(venusIsolated ? ['Venus'] : [])]
    });

    // 3. Moon afflictions (OCD-like patterns)
    const moonRahu = isConjunct(chart, 'Moon', 'Rahu');
    const moon = getPos(chart, 'Moon');
    const moonInDual = moon && (['Gemini', 'Virgo', 'Sagittarius', 'Pisces'] as Sign[]).includes(moon.sign);
    const ocdPattern = moonRahu && moonInDual;
    indicators.push({
        name: 'Moon-Rahu in Dual Sign (OCD tendency)',
        category: 'compulsive_behavior',
        present: !!ocdPattern,
        severity: ocdPattern ? 'moderate' : 'low',
        description: ocdPattern
            ? `Moon-Rahu in ${moon?.sign} (dual sign) — obsessive thought loops and repetitive behavioral patterns`
            : 'No Moon-Rahu dual sign combination — thought patterns are not obsessively repetitive',
        contributingFactors: ocdPattern ? [
            'Moon-Rahu amplifies mental obsession',
            `Dual sign ${moon?.sign} creates oscillating thoughts`
        ] : [],
        involvedPlanets: ['Moon', 'Rahu']
    });

    const activeIndicators = indicators.filter(i => i.present);
    const score = Math.min(100, activeIndicators.reduce((s, i) => s + (i.severity === 'high' ? 35 : i.severity === 'moderate' ? 20 : 5), 0));
    const riskLevel = score >= 70 ? 'very_high' : score >= 50 ? 'high' : score >= 30 ? 'moderate' : score >= 10 ? 'low' : 'very_low';

    return {
        category: 'compulsive_behavior',
        label: 'Compulsive Behavior Patterns',
        icon: '🔄',
        riskScore: score,
        riskLevel,
        indicators,
        interpretation: activeIndicators.length > 0
            ? `${activeIndicators.length} compulsive pattern indicator(s) found. ${score >= 50 ? 'Strong compulsive tendencies — mindfulness practices and structured routine highly beneficial.' : 'Mild tendencies — awareness helps.'}`
            : 'No significant compulsive behavior indicators found.'
    };
}

// ============================================================================
// CATEGORY 5: NEPTUNE / WESTERN INDICATORS
// ============================================================================

function assessNeptuneRisk(chart: Chart): AddictionCategory {
    const indicators: AddictionIndicator[] = [];

    // Neptune indicators (if available)
    const neptune = getPos(chart, 'Neptune' as Planet);
    const mars = getPos(chart, 'Mars');
    const venus = getPos(chart, 'Venus');

    // 1. Neptune-Mars aspect (action distorted by illusion)
    const neptuneMars = neptune && mars && hasAspect(chart, 'Neptune' as Planet, 'Mars');
    indicators.push({
        name: 'Neptune-Mars Aspect',
        category: 'neptune_western',
        present: !!neptuneMars,
        severity: neptuneMars ? 'moderate' : 'low',
        description: neptuneMars
            ? 'Neptune-Mars aspect — action distorted by fantasy, illusion, or escape; physical energy misdirected into addictive behaviors'
            : 'No Neptune-Mars aspect — action impulses are grounded',
        contributingFactors: neptuneMars ? ['Neptune dissolves Mars discipline', 'Physical energy channeled into escapism'] : [],
        involvedPlanets: ['Neptune', 'Mars']
    });

    // 2. Neptune in 5th or 12th
    const neptuneIn512 = neptune && [5, 12].includes(neptune.house);
    indicators.push({
        name: 'Neptune in 5th/12th House',
        category: 'neptune_western',
        present: !!neptuneIn512,
        severity: neptuneIn512 ? 'moderate' : 'low',
        description: neptuneIn512
            ? `Neptune in ${neptune!.house}th house — dissolution of boundaries in pleasure (5th) or surrender to escape (12th)`
            : 'Neptune not in pleasure or escapism houses',
        contributingFactors: neptuneIn512 ? [
            ...(neptune!.house === 5 ? ['Neptune in 5th (fantasy-based pleasure seeking)'] : []),
            ...(neptune!.house === 12 ? ['Neptune in 12th (blurred reality, escapist tendencies)'] : [])
        ] : [],
        involvedPlanets: ['Neptune']
    });

    // 3. Neptune-Venus aspect (fantasy addiction, love addiction)
    const neptuneVenus = neptune && venus && hasAspect(chart, 'Neptune' as Planet, 'Venus');
    indicators.push({
        name: 'Neptune-Venus Aspect',
        category: 'neptune_western',
        present: !!neptuneVenus,
        severity: neptuneVenus ? 'moderate' : 'low',
        description: neptuneVenus
            ? 'Neptune-Venus aspect — romanticizes addiction, confuses love with dependency, susceptible to "love addiction"'
            : 'No Neptune-Venus aspect — love relationships stay grounded',
        contributingFactors: neptuneVenus ? ['Idealized/fantasy-based love patterns', 'Difficulty distinguishing love from codependency'] : [],
        involvedPlanets: ['Neptune', 'Venus']
    });

    const activeIndicators = indicators.filter(i => i.present);
    const score = Math.min(100, activeIndicators.reduce((s, i) => s + (i.severity === 'high' ? 35 : i.severity === 'moderate' ? 20 : 5), 0));
    const riskLevel = score >= 70 ? 'very_high' : score >= 50 ? 'high' : score >= 30 ? 'moderate' : score >= 10 ? 'low' : 'very_low';

    return {
        category: 'neptune_western',
        label: 'Neptune / Western Indicators',
        icon: '🌊',
        riskScore: score,
        riskLevel,
        indicators,
        interpretation: activeIndicators.length > 0
            ? `${activeIndicators.length} Neptunian indicator(s) suggest susceptibility to illusion-based addictions and boundary dissolution. ${score >= 50 ? 'Strong Neptunian influence — grounding practices essential.' : 'Mild influence — awareness recommended.'}`
            : 'No significant Neptune-related addiction indicators.'
    };
}

// ============================================================================
// PROTECTIVE FACTORS
// ============================================================================

function assessProtectiveFactors(chart: Chart): AddictionProtectiveFactor[] {
    const factors: AddictionProtectiveFactor[] = [];

    // 1. Strong Jupiter (moral/spiritual anchor)
    const jupiter = getPos(chart, 'Jupiter');
    const jupiterStrong = jupiter && ['exalted', 'own_house', 'friendly'].includes(jupiter.dignity);
    factors.push({
        name: 'Strong Jupiter (Guru Protection)',
        present: !!jupiterStrong,
        strength: jupiterStrong ? (jupiter!.dignity === 'exalted' ? 'strong' : 'moderate') : 'weak',
        description: jupiterStrong
            ? `Jupiter in ${jupiter!.sign} (${jupiter!.dignity}) acts as divine protector — provides moral compass and wisdom to resist temptation`
            : 'Jupiter is not strongly placed — moral/spiritual anchor needs reinforcement through practice',
        planet: 'Jupiter'
    });

    // 2. Saturn discipline (self-control)
    const saturn = getPos(chart, 'Saturn');
    const saturnStrong = saturn && ['exalted', 'own_house', 'friendly'].includes(saturn.dignity);
    factors.push({
        name: 'Saturn Discipline',
        present: !!saturnStrong,
        strength: saturnStrong ? (saturn!.dignity === 'exalted' ? 'strong' : 'moderate') : 'weak',
        description: saturnStrong
            ? `Saturn in ${saturn!.sign} (${saturn!.dignity}) provides natural self-discipline and the ability to resist impulses`
            : 'Saturn not strongly placed — self-discipline needs conscious cultivation',
        planet: 'Saturn'
    });

    // 3. 9th house strength (dharmic foundation)
    const ninthHousePlanets = planetsInHouse(chart, 9);
    const beneficsIn9th = ninthHousePlanets.filter(p => ['Jupiter', 'Venus', 'Mercury', 'Moon'].includes(p));
    factors.push({
        name: '9th House Dharma Strength',
        present: beneficsIn9th.length > 0,
        strength: beneficsIn9th.length >= 2 ? 'strong' : beneficsIn9th.length === 1 ? 'moderate' : 'weak',
        description: beneficsIn9th.length > 0
            ? `Benefics in 9th house (${beneficsIn9th.join(', ')}) — strong dharmic foundation provides natural protection against addictive behaviors`
            : 'No benefics in 9th house — dharmic discipline needs to be consciously developed',
        planet: beneficsIn9th[0] || 'Jupiter'
    });

    // 4. Strong Moon (emotional stability)
    const moon = getPos(chart, 'Moon');
    const moonStrong = moon && ['exalted', 'own_house', 'friendly'].includes(moon.dignity) && ![6, 8, 12].includes(moon.house);
    factors.push({
        name: 'Emotionally Stable Moon',
        present: !!moonStrong,
        strength: moonStrong ? (moon!.dignity === 'exalted' ? 'strong' : 'moderate') : 'weak',
        description: moonStrong
            ? `Moon in ${moon!.sign} (${moon!.dignity}) with good house placement — emotional resilience reduces addiction vulnerability`
            : 'Moon is not optimally placed — emotional stability requires conscious effort and support',
        planet: 'Moon'
    });

    return factors;
}

// ============================================================================
// MAIN ANALYSIS
// ============================================================================

export function analyzeAddictionRisk(chart: Chart): AddictionRiskAnalysis {
    const categories = [
        assessSexAddictionRisk(chart),
        assessAlcoholSubstanceRisk(chart),
        assessDrugAddictionRisk(chart),
        assessCompulsiveBehaviorRisk(chart),
        assessNeptuneRisk(chart)
    ];

    const protectiveFactors = assessProtectiveFactors(chart);

    // Calculate overall score (average of categories, adjusted by protective factors)
    const avgScore = categories.reduce((s, c) => s + c.riskScore, 0) / categories.length;
    const protectionBonus = protectiveFactors.filter(f => f.present).length * 5;
    const overallScore = Math.max(0, Math.round(avgScore - protectionBonus));

    const overallRisk: 'low' | 'moderate' | 'high' =
        overallScore >= 50 ? 'high' : overallScore >= 25 ? 'moderate' : 'low';

    const activeCategories = categories.filter(c => c.riskScore > 0);
    const summary = activeCategories.length === 0
        ? 'No significant addiction or compulsion risk indicators found. Protective factors are adequately present.'
        : `${activeCategories.length} risk area(s) identified: ${activeCategories.map(c => c.label).join(', ')}. ${protectiveFactors.filter(f => f.present).length} protective factor(s) active.`;

    return {
        categories,
        protectiveFactors,
        overallRisk,
        overallScore,
        summary,
        disclaimer: 'This analysis identifies astrological patterns associated with addictive tendencies. It is NOT a clinical diagnosis. Astrological indicators show potential, not certainty. If you or someone you know struggles with addiction, please seek professional help from a licensed counselor or therapist.'
    };
}
