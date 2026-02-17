/**
 * Relationship Pattern Calculations
 * Based on Risk_kn.md §4: pre-marital history, affair context, spouse longevity
 */

import { Chart, Planet } from '@types';
import { normalizeDegrees } from './coreCalculations';

// ============================================================================
// TYPES
// ============================================================================

export interface RelationshipPattern {
    name: string;
    category: 'pre_marital' | 'affair_context' | 'spouse_longevity' | 'relationship_style';
    present: boolean;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
    indicators: string[];
    advice: string;
}

export interface RelationshipPatternAnalysis {
    patterns: RelationshipPattern[];
    preMaritalSummary: string;
    affairContextSummary: string;
    relationshipStyleSummary: string;
    overallRiskLevel: 'low' | 'moderate' | 'elevated' | 'high';
}

// ============================================================================
// HELPERS
// ============================================================================

function getPos(chart: Chart, planet: string) {
    return chart.planetaryPositions.find(p => p.planet === planet);
}

function hasAspect(lon1: number, lon2: number, maxOrb = 10): { type: string } | null {
    const diff = Math.abs(normalizeDegrees(lon1 - lon2));
    const normalizedDiff = Math.min(diff, 360 - diff);
    const aspects = [
        { angle: 0, name: 'conjunction' },
        { angle: 90, name: 'square' },
        { angle: 180, name: 'opposition' },
    ];
    for (const a of aspects) {
        if (Math.abs(normalizedDiff - a.angle) <= maxOrb) return { type: a.name };
    }
    return null;
}

// ============================================================================
// PRE-MARITAL HISTORY ANALYSIS (5th house)
// ============================================================================

function analyzePreMaritalPatterns(chart: Chart): RelationshipPattern[] {
    const patterns: RelationshipPattern[] = [];
    const planetsIn5 = chart.planetaryPositions.filter(p => p.house === 5);

    // 5th house planet count (multiple romances indicator)
    if (planetsIn5.length >= 3) {
        patterns.push({
            name: 'Multiple Pre-Marital Romances',
            category: 'pre_marital',
            present: true,
            severity: 'moderate',
            description: `${planetsIn5.length} planets in the 5th house (${planetsIn5.map(p => p.planet).join(', ')}) indicate a rich romantic history with multiple significant relationships before marriage.`,
            indicators: planetsIn5.map(p => `${p.planet} in 5th house`),
            advice: 'Past relationships are learning experiences. Openly discussing relationship history builds trust.'
        });
    } else if (planetsIn5.length === 2) {
        patterns.push({
            name: 'Moderate Pre-Marital Experience',
            category: 'pre_marital',
            present: true,
            severity: 'mild',
            description: `${planetsIn5.map(p => p.planet).join(' and ')} in the 5th house suggest a few meaningful romantic connections before marriage.`,
            indicators: planetsIn5.map(p => `${p.planet} in 5th house`),
            advice: 'Prior relationship experience provides emotional maturity for the current partnership.'
        });
    }

    // Venus in 5th (romantic nature)
    const venus = getPos(chart, 'Venus');
    if (venus && venus.house === 5) {
        patterns.push({
            name: 'Romantic & Pleasure-Seeking Nature',
            category: 'pre_marital',
            present: true,
            severity: 'mild',
            description: 'Venus in the 5th house gives a natural inclination toward romance, aesthetics, and pleasure. Enjoys courtship and may have been involved in multiple romantic relationships.',
            indicators: ['Venus in 5th house'],
            advice: 'Channel the romantic energy into keeping the marriage vibrant and exciting.'
        });
    }

    // 5th lord in 7th or 7th lord in 5th (romance continues into marriage)
    const rahu = getPos(chart, 'Rahu');
    if (rahu && rahu.house === 5) {
        patterns.push({
            name: 'Unconventional Romantic Desires',
            category: 'pre_marital',
            present: true,
            severity: 'moderate',
            description: 'Rahu in the 5th house creates intense, unconventional, and sometimes obsessive romantic attraction. May be drawn to unusual or taboo romantic situations.',
            indicators: ['Rahu in 5th house'],
            advice: 'Self-awareness about obsessive tendencies in romance helps channel this energy constructively.'
        });
    }

    return patterns;
}

// ============================================================================
// AFFAIR CONTEXT ANALYSIS
// ============================================================================

function analyzeAffairContext(chart: Chart): RelationshipPattern[] {
    const patterns: RelationshipPattern[] = [];

    // Workplace affairs: 6-10-7 connections
    const planetsIn6 = chart.planetaryPositions.filter(p => p.house === 6).map(p => p.planet);
    const planetsIn10 = chart.planetaryPositions.filter(p => p.house === 10).map(p => p.planet);
    const planetsIn7 = chart.planetaryPositions.filter(p => p.house === 7).map(p => p.planet);

    const workplaceIndicators: string[] = [];
    const venus = getPos(chart, 'Venus');
    const mars = getPos(chart, 'Mars');
    const saturn = getPos(chart, 'Saturn');

    if (venus && [6, 10].includes(venus.house)) workplaceIndicators.push(`Venus in ${venus.house}th house (mixing love and work)`);
    if (mars && mars.house === 10 && venus) {
        const asp = hasAspect(mars.longitude, venus.longitude);
        if (asp) workplaceIndicators.push('Mars-Venus aspect (passion in professional sphere)');
    }
    if (saturn && saturn.house === 7) workplaceIndicators.push('Saturn in 7th (attraction to authority figures)');

    if (workplaceIndicators.length >= 2) {
        patterns.push({
            name: 'Workplace Affair Susceptibility',
            category: 'affair_context',
            present: true,
            severity: 'moderate',
            description: 'The 6th-10th-7th house axis shows connections between professional life and romantic energy, creating susceptibility to workplace attractions.',
            indicators: workplaceIndicators,
            advice: 'Maintain clear professional boundaries. Be mindful of emotional intimacy developing with colleagues.'
        });
    }

    // Neighbor/proximity affairs: 3rd-5th connections
    const planetsIn3 = chart.planetaryPositions.filter(p => p.house === 3);
    const moon = getPos(chart, 'Moon');
    const neighborIndicators: string[] = [];

    if (venus && venus.house === 3) neighborIndicators.push('Venus in 3rd house (attraction through proximity)');
    if (mars && mars.house === 3) neighborIndicators.push('Mars in 3rd house (physical attraction in neighborhood)');
    if (moon && moon.house === 3) neighborIndicators.push('Moon in 3rd house (emotional bonds with neighbors/community)');

    if (neighborIndicators.length >= 2) {
        patterns.push({
            name: 'Proximity-Based Attraction Pattern',
            category: 'affair_context',
            present: true,
            severity: 'mild',
            description: 'Multiple planets in the 3rd house indicate attraction develops through proximity, frequent interaction, and casual contact in the immediate environment.',
            indicators: neighborIndicators,
            advice: 'Be aware of how routine proximity to others can develop into emotional or physical attraction.'
        });
    }

    // Social circle affairs: 11th-5th-7th connections
    const planetsIn11 = chart.planetaryPositions.filter(p => p.house === 11);
    const socialIndicators: string[] = [];

    if (venus && venus.house === 11) socialIndicators.push('Venus in 11th house (love through friend circles)');
    if (planetsIn11.length >= 2) socialIndicators.push(`${planetsIn11.length} planets in 11th (active social life)`);
    const rahu = getPos(chart, 'Rahu');
    if (rahu && rahu.house === 11) socialIndicators.push('Rahu in 11th (unconventional friendships crossing boundaries)');

    if (socialIndicators.length >= 2) {
        patterns.push({
            name: 'Social Circle Romance Pattern',
            category: 'affair_context',
            present: true,
            severity: 'moderate',
            description: 'The 11th house emphasis indicates romantic connections developing within friend groups, social networks, or community organizations.',
            indicators: socialIndicators,
            advice: 'Openly include your partner in social activities. Transparent friendships strengthen the marriage.'
        });
    }

    // Secret relationship tendency: 12th house emphasis
    const planetsIn12 = chart.planetaryPositions.filter(p => p.house === 12);
    if (planetsIn12.length >= 2) {
        const secretIndicators = planetsIn12.map(p => `${p.planet} in 12th house`);
        patterns.push({
            name: 'Secret Relationship Tendency',
            category: 'affair_context',
            present: true,
            severity: planetsIn12.length >= 3 ? 'severe' : 'moderate',
            description: `${planetsIn12.length} planets in the 12th house create tendencies toward hidden connections, secret emotional bonds, and compartmentalized intimate life.`,
            indicators: secretIndicators,
            advice: 'The 12th house energy can be channeled into spiritual intimacy, shared meditation, or creative private pursuits with your partner.'
        });
    }

    return patterns;
}

// ============================================================================
// RELATIONSHIP STYLE ANALYSIS
// ============================================================================

function analyzeRelationshipStyle(chart: Chart): RelationshipPattern[] {
    const patterns: RelationshipPattern[] = [];
    const venus = getPos(chart, 'Venus');
    const mars = getPos(chart, 'Mars');
    const moon = getPos(chart, 'Moon');
    const jupiter = getPos(chart, 'Jupiter');
    const saturn = getPos(chart, 'Saturn');

    // Kama Trikona affliction (3-7-11 axis)
    const kamaHousePlanets = chart.planetaryPositions.filter(p => [3, 7, 11].includes(p.house));
    const maleficsInKama = kamaHousePlanets.filter(p => ['Mars', 'Saturn', 'Rahu', 'Ketu'].includes(p.planet));
    if (maleficsInKama.length >= 3) {
        patterns.push({
            name: 'Kama Trikona Affliction',
            category: 'relationship_style',
            present: true,
            severity: 'severe',
            description: `${maleficsInKama.length} malefic planets in the desire triangle (houses 3-7-11): ${maleficsInKama.map(p => `${p.planet} in ${p.house}th`).join(', ')}. This intensifies desire-driven behavior and can create restlessness in committed relationships.`,
            indicators: maleficsInKama.map(p => `${p.planet} in ${p.house}th house`),
            advice: 'Recognize that restlessness comes from within. Adventure and novelty within the marriage satisfy these drives.'
        });
    }

    // Loyal partnership indicators
    const loyalIndicators: string[] = [];
    if (jupiter && jupiter.house === 7) loyalIndicators.push('Jupiter in 7th (devoted partnership)');
    if (venus && ['exalted', 'own_house', 'moolatrikona'].includes(venus.dignity)) loyalIndicators.push(`Strong Venus in ${venus.sign} (healthy love expression)`);
    if (saturn && saturn.house === 7 && saturn.dignity !== 'debilitated') loyalIndicators.push('Saturn in 7th (commitment-oriented)');
    if (moon && ['exalted', 'own_house', 'moolatrikona'].includes(moon.dignity)) loyalIndicators.push(`Strong Moon in ${moon.sign} (emotional stability)`);

    if (loyalIndicators.length >= 2) {
        patterns.push({
            name: 'Strong Loyalty Indicators',
            category: 'relationship_style',
            present: true,
            severity: 'mild',
            description: 'Multiple chart factors support loyalty, commitment, and long-term partnership dedication.',
            indicators: loyalIndicators,
            advice: 'These strengths form the foundation of a lasting relationship. Express and appreciate this commitment.'
        });
    }

    // Intensity-seeking pattern
    const planetsIn8 = chart.planetaryPositions.filter(p => p.house === 8);
    if (planetsIn8.length >= 2) {
        patterns.push({
            name: 'Intensity-Seeking Pattern',
            category: 'relationship_style',
            present: true,
            severity: 'moderate',
            description: `${planetsIn8.length} planets in the 8th house (${planetsIn8.map(p => p.planet).join(', ')}) create a need for deep, intense, transformative relationships. Surface-level connections feel unfulfilling.`,
            indicators: planetsIn8.map(p => `${p.planet} in 8th house`),
            advice: 'Depth and intensity are gifts. Channel this into emotional intimacy, shared transformative experiences, and honest vulnerability.'
        });
    }

    return patterns;
}

// ============================================================================
// TABOO & FAMILY PATTERNS (§4.5)
// ============================================================================

function analyzeTabooPatterns(chart: Chart): RelationshipPattern[] {
    const patterns: RelationshipPattern[] = [];
    const house2 = chart.houses.find(h => h.houseNumber === 2);
    const house8 = chart.houses.find(h => h.houseNumber === 8);
    const house12 = chart.houses.find(h => h.houseNumber === 12);
    const venus = getPos(chart, 'Venus');
    const mars = getPos(chart, 'Mars');
    const rahu = getPos(chart, 'Rahu');

    if (house2) {
        const lord2 = house2.lord;
        const lord2Pos = getPos(chart, lord2);
        const tabooIndicators: string[] = [];

        // 2nd lord with Rahu/Mars (Aggression/Obsession in family sphere)
        if (lord2Pos && rahu && hasAspect(lord2Pos.longitude, rahu.longitude)) {
            tabooIndicators.push('2nd Lord (Family) afflicted by Rahu: Unconventional family dynamics');
        }
        if (lord2Pos && mars && hasAspect(lord2Pos.longitude, mars.longitude)) {
            tabooIndicators.push('2nd Lord afflicted by Mars: Passion or aggression within family boundary');
        }

        // 2nd house connections to 8/12 with passion planets
        const passionPlanets: Planet[] = ['Venus', 'Mars', 'Rahu'];
        if (house2.planets.some(p => passionPlanets.includes(p as Planet)) &&
            (house12?.planets.some(p => passionPlanets.includes(p as Planet)) || house8?.planets.some(p => passionPlanets.includes(p as Planet)))) {
            tabooIndicators.push('Connection between family house (2nd) and secret/occult houses (8th/12th) involving passion planets');
        }

        if (tabooIndicators.length >= 2) {
            patterns.push({
                name: 'Family Boundary / Taboo Patterns',
                category: 'relationship_style',
                present: true,
                severity: 'severe',
                description: 'Astrological configurations suggest a compromise of traditional family boundaries or attraction to taboo relationship structures within or involving the extended family sphere.',
                indicators: tabooIndicators,
                advice: 'Establishing healthy psychological boundaries and seeking professional counseling to navigate complex family-related emotional triggers is essential.'
            });
        }
    }

    return patterns;
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export function analyzeRelationshipPatterns(chart: Chart): RelationshipPatternAnalysis {
    const preMarital = analyzePreMaritalPatterns(chart);
    const affairContext = analyzeAffairContext(chart);
    const relationshipStyle = analyzeRelationshipStyle(chart);
    const tabooPatterns = analyzeTabooPatterns(chart);

    const allPatterns = [...preMarital, ...affairContext, ...relationshipStyle, ...tabooPatterns];

    const severeCount = allPatterns.filter(p => p.severity === 'severe').length;
    const moderateCount = allPatterns.filter(p => p.severity === 'moderate').length;

    const overallRiskLevel: RelationshipPatternAnalysis['overallRiskLevel'] =
        severeCount >= 2 ? 'high' :
            severeCount >= 1 || moderateCount >= 3 ? 'elevated' :
                moderateCount >= 1 ? 'moderate' : 'low';

    return {
        patterns: allPatterns,
        preMaritalSummary: preMarital.length > 0
            ? `${preMarital.length} indicator(s) suggest notable pre-marital romantic history.`
            : 'Minimal pre-marital romantic indicators. Focus has been on building foundations.',
        affairContextSummary: affairContext.length > 0
            ? `${affairContext.length} pattern(s) indicate contexts where extra-marital attraction may develop.`
            : 'No significant contextual affair vulnerability detected.',
        relationshipStyleSummary: relationshipStyle.length > 0
            ? `${relationshipStyle.length} pattern(s) define the overall approach to intimate relationships.`
            : 'Balanced relationship approach without extreme patterns.',
        overallRiskLevel
    };
}
