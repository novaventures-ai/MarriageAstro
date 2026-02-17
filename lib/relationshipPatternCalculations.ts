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
    category: 'narrative_history' | 'opportunity_triggers' | 'capacity_approach' | 'spouse_longevity';
    present: boolean;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
    indicators: string[];
    advice: string;
}

export interface RelationshipPatternAnalysis {
    patterns: RelationshipPattern[];
    narrativeHistorySummary: string;
    opportunityTriggersSummary: string;
    capacityApproachSummary: string;
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
            name: 'Complex Romantic History',
            category: 'narrative_history',
            present: true,
            severity: 'moderate',
            description: `The 5th house is heavily active with ${planetsIn5.length} planets. This typically indicates a life where romantic experiences have been a major avenue for self-discovery. You likely have a history of falling in love deeply and often, with each relationship shaping your identity significantly.`,
            indicators: planetsIn5.map(p => `${p.planet} in 5th house`),
            advice: 'Ensure your current partner understands that your past was a "training ground," not a comparison chart.'
        });
    } else if (planetsIn5.length === 2) {
        patterns.push({
            name: 'Meaningful Pre-Marital Connections',
            category: 'narrative_history',
            present: true,
            severity: 'mild',
            description: `With ${planetsIn5.map(p => p.planet).join(' and ')} in the 5th, your romantic past likely consists of a few serious, impactful relationships rather than casual dating. You tend to learn through deep emotional engagement.`,
            indicators: planetsIn5.map(p => `${p.planet} in 5th house`),
            advice: 'Draw upon the emotional maturity gained from these specific past bonds to strengthen your marriage.'
        });
    }

    // Venus in 5th (romantic nature)
    const venus = getPos(chart, 'Venus');
    if (venus && venus.house === 5) {
        patterns.push({
            name: 'Innate Romantic Idealism',
            category: 'narrative_history',
            present: true,
            severity: 'mild',
            description: 'Venus in the 5th house suggests you are "in love with love." You likely had a vivid romantic life (or fantasy life) before marriage. In reality, this can lead to disappointment if marriage becomes too mundane or practical.',
            indicators: ['Venus in 5th house'],
            advice: 'Schedule regular "dating" nights with your spouse. You need romance to feel married; utility is not enough.'
        });
    }

    // 5th lord in 7th or 7th lord in 5th (romance continues into marriage)
    const rahu = getPos(chart, 'Rahu');
    if (rahu && rahu.house === 5) {
        patterns.push({
            name: 'Unconventional Romantic Desires',
            category: 'narrative_history',
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
// AFFAIR CONTEXT ANALYSIS (External Triggers)
// Uses shared logic from riskCalculations.ts
// ============================================================================

import { assessAffairContext } from './riskCalculations';

function analyzeAffairContextPatterns(chart: Chart, name: string): RelationshipPattern[] {
    const patterns: RelationshipPattern[] = [];
    const contexts = assessAffairContext(chart, name);

    // Map shared contexts to RelationshipPattern format
    contexts.forEach((ctx: any) => {
        let title = '';
        let description = '';
        let advice = '';
        let severity: 'mild' | 'moderate' | 'severe' = 'moderate';

        switch (ctx.context) {
            case 'workplace':
                title = 'Workplace Connection Vulnerability';
                description = 'The alignment of career (10th) and relationship (7th) lords creates a high probability of emotional bonds forming in professional settings. This often manifests as "work spouses" or deep emotional reliance on a colleague, which can subtly cross into romantic territory during high-pressure projects or late-night work.';
                advice = 'Maintain strict professional boundaries. Avoid exclusive private communication channels with colleagues of the opposite sex.';
                severity = ctx.confidence === 'high' ? 'severe' : 'moderate';
                break;
            case 'neighbor':
                title = 'Local Environment/Neighbor Trigger';
                description = 'Your chart shows a strong link between immediate environment (3rd House) and partnership. This indicates a higher chance of developing attractions to neighbors, community members, or people encountered in daily short-distance routines (gym, coffee shop, local groups).';
                advice = 'Be mindful of over-familiarity in casual, daily interactions. Keep neighborly relations friendly but distant.';
                severity = ctx.confidence === 'high' ? 'severe' : 'moderate';
                break;
            case 'travel':
                title = 'Travel & Foreign Connection Vulnerability';
                description = 'With the 7th Lord linked to the 9th or 12th houses, the psychological guard is lowered significantly when away from home. There is a strong tendency to seek or find romantic excitement during long-distance travel, work trips, or interactions with foreigners, often driven by a sense of anonymity.';
                advice = 'Establish clear communication protocols with your partner when traveling alone. Avoid isolated social situations in foreign environments.';
                severity = ctx.confidence === 'high' ? 'severe' : 'moderate';
                break;
            case 'financial':
                title = 'Financial/Business Partnership Trigger';
                description = 'The direct connection between wealth sectors (2nd/11th) and relationships suggests that shared financial goals or business dealings are a primary avenue for emotional entanglement. You may confuse financial compatibility or business synergy with romantic destiny.';
                advice = 'Keep business and personal accounts/interactions rigidly separate. Do not mix romance with investment discussions.';
                severity = ctx.confidence === 'high' ? 'severe' : 'moderate';
                break;
            case 'spiritual':
                title = 'Spiritual/Mentorship Connection';
                description = 'A link between the 7th and 9th houses often creates an attraction to mentors, gurus, or figures of authority in spiritual settings. The danger here is idealizing a guide or teacher and confusing spiritual intimacy with romantic love.';
                advice = 'Distinguish clearly between spiritual devotion and personal intimacy. Avoid one-on-one private sessions with mentors.';
                severity = 'mild';
                break;
            case 'domestic_incest':
                title = 'Domestic/Taboo Vulnerability';
                description = 'Planetary afflictions involving the 4th/8th houses suggest a complex psychological pattern where "forbidden" or "taboo" dynamics trigger attraction. This is a high-risk pattern indicating potential for boundary-crossing within close family circles or extended domestic networks.';
                advice = 'Strict adherence to social and familial boundaries is essential. Seek therapy if you notice patterns of attraction to unavailable or inappropriate figures.';
                severity = 'severe';
                break;
            case 'foreign_isolated':
                title = 'Hidden/Isolated Environment Pattern';
                description = 'Heavily tenanted 12th house indicates a subconscious draw towards relationships that exist in "bubbles"—isolated from regular society. This strongly suggests vulnerability to online affairs, secret messaging apps, or relationships that exist purely in hidden, private spaces.';
                advice = 'Radical transparency is your safety mechanism. Avoid using "vanish mode" or hidden folders on devices.';
                severity = 'moderate';
                break;
            case 'social_circle':
                title = 'Social Circle Overlap';
                description = 'Romance and Friendship sectors are fused. This suggests affairs or emotional deviations are most likely to start as "just friends" within your existing social circle. The slide from friendship to romance is often invisible until it is too late.';
                advice = 'Ensure your partner is integrated into your friendship groups. Avoid "best friend" dynamics with potential romantic interests.';
                severity = 'mild';
                break;
        }

        if (title) {
            patterns.push({
                name: title,
                category: 'opportunity_triggers',
                present: true,
                severity: severity,
                description: description + (ctx.text ? ` (${ctx.text})` : ''),
                indicators: [ctx.text],
                advice: advice
            });
        }
    });

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
            name: 'High-Stimulus Relationship Needs',
            category: 'capacity_approach',
            present: true,
            severity: 'severe',
            description: `The chart shows ${maleficsInKama.length} intense planets in the "Zones of Desire" (3rd, 7th, 11th houses). In reality, this often manifests as a person who gets bored easily with "safe" or "routine" love. There is a subconscious drive for relationships that provide constant adrenaline or validation.`,
            indicators: maleficsInKama.map(p => `${p.planet} in ${p.house}th house`),
            advice: 'You need "healthy danger"—adventure, ambitious shared goals, or rigorous physical activity together—to prevent seeking drama elsewhere.'
        });
    }

    // Loyal partnership indicators
    const loyalIndicators: string[] = [];
    if (jupiter && jupiter.house === 7) loyalIndicators.push('Jupiter in 7th (Values ethics over pleasure)');
    if (venus && ['exalted', 'own_house', 'moolatrikona'].includes(venus.dignity)) loyalIndicators.push(`Strong Venus in ${venus.sign} (Seeks harmony, dislikes conflict)`);
    if (saturn && saturn.house === 7 && saturn.dignity !== 'debilitated') loyalIndicators.push('Saturn in 7th (Takes vows extremely seriously)');
    if (moon && ['exalted', 'own_house', 'moolatrikona'].includes(moon.dignity)) loyalIndicators.push(`Strong Moon in ${moon.sign} (Emotionally anchored)`);

    if (loyalIndicators.length >= 2) {
        patterns.push({
            name: 'Deep-Rooted Loyalty Architecture',
            category: 'capacity_approach',
            present: true,
            severity: 'mild',
            description: 'Your psychological makeup is heavily wired for stability. In real-world terms, you are likely the partner who works through issues rather than exiting when things get tough. Infidelity or betrayal violates your core self-image.',
            indicators: loyalIndicators,
            advice: 'Ensure you do not stay in toxic situations simply out of duty. Your loyalty is a gift, not a trap.'
        });
    }

    // Intensity-seeking pattern
    const planetsIn8 = chart.planetaryPositions.filter(p => p.house === 8);
    if (planetsIn8.length >= 2) {
        patterns.push({
            name: 'Transformational Intensity Pattern',
            category: 'capacity_approach',
            present: true,
            severity: 'moderate',
            description: `${planetsIn8.length} planets in the 8th house indicate that superficial connections feel meaningless to you. You crave "soul-merging" depth. If a relationship becomes too polite or distant, you may subconsciously provoke a crisis just to feel something real.`,
            indicators: planetsIn8.map(p => `${p.planet} in 8th house`),
            advice: 'Practice "Radical Honesty" with your partner. Deep conversations are your substitute for drama.'
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

    // 2nd House Affliction (Secrets in family/wealth)
    // Needs lord 2 checking
    const lord2 = house2?.lord;
    const lord2Pos = lord2 ? getPos(chart, lord2) : undefined;

    if (house2 && house2.planets.includes('Rahu') && lord2Pos && [6, 8, 12].includes(lord2Pos.house)) {
        patterns.push({
            name: 'Family Secrets Sensitivity',
            category: 'opportunity_triggers',
            present: true,
            severity: 'moderate',
            description: 'Rahu in 2nd with afflicted Lord indicates potential for hidden family matters or secrets affecting relationships.',
            indicators: ['Rahu in 2nd', `2nd Lord in ${lord2Pos.house}th`],
            advice: 'Transparency about family history and finances is crucial.'
        });
    }

    // 8th House Affliction (Taboo/Secret relationships)
    if (house8 && (house8.planets.includes('Mars') || house8.planets.includes('Rahu'))) {
        patterns.push({
            name: 'Taboo Relationship Vulnerability',
            category: 'opportunity_triggers',
            present: true,
            severity: 'severe',
            description: 'Mars or Rahu in 8th house can indicate attraction to taboo or secretive relationships contexts.',
            indicators: ['Malefics in 8th house'],
            advice: 'Be conscious of the attraction to forbidden or secretive dynamics.'
        });
    }

    // 12th House (Bed Pleasures / Isolation)
    if (house12 && house12.planets.length >= 3) {
        patterns.push({
            name: 'Hidden/Isolated Connection Pattern',
            category: 'opportunity_triggers',
            present: true,
            severity: 'moderate',
            description: 'Cluster of planets in 12th house emphasizes private, hidden, or isolated relationship dynamics.',
            indicators: [`${house12.planets.length} planets in 12th`],
            advice: 'Ensure that the need for privacy does not become secrecy.'
        });
    }

    return patterns;
}

// ============================================================================
// SPOUSE LONGEVITY INDICATORS (§5)
// ============================================================================

function analyzeSpouseLongevity(chart: Chart): RelationshipPattern[] {
    const patterns: RelationshipPattern[] = [];
    // 8th House Analysis (Mangalya Sthana for females, longevity in general)
    const house8 = chart.houses.find(h => h.houseNumber === 8);
    const mars = getPos(chart, 'Mars');

    // Mangal Dosha (High Level Check) - The general Mangal Dosha check is removed as per instruction.

    if (house8) {
        const malefics = house8.planets.filter(p => ['Saturn', 'Rahu', 'Ketu', 'Mars', 'Sun'].includes(p));

        // Mars in 8th (Mangal Dosha / Sudden events)
        if (house8.planets.includes('Mars')) {
            patterns.push({
                name: 'Mars Influence (Mangal Dosha)',
                category: 'spouse_longevity',
                present: true,
                severity: 'moderate',
                description: 'Mars in the 8th house indicates that conflicts in marriage can escalate quickly and intensely. In real terms, this often means arguments don\'t stay "small"—they can trigger disproportionate reactions or sudden decisions to separate.',
                indicators: ['Mars in 8th house'],
                advice: 'Implement a "time-out" rule during heated arguments. Cooling down prevents permanent damage.'
            });
        } else if (malefics.length >= 2) {
            patterns.push({
                name: '8th House Stress Factors',
                category: 'spouse_longevity',
                present: true,
                severity: 'moderate',
                description: `${malefics.join(', ')} in the 8th house suggests that shared finances, in-laws, or chronic health issues could become major stress points in the marriage. The relationship is tested through crises.`,
                indicators: [`${malefics.length} malefics in 8th`],
                advice: 'Proactive management of joint assets and clear boundaries with in-laws are essential.'
            });
        }
    }

    return patterns;
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export function calculateRelationshipPatterns(chart: Chart, name: string): RelationshipPatternAnalysis {
    const preMarital = analyzePreMaritalPatterns(chart);
    const affairContext = [
        ...analyzeAffairContextPatterns(chart, name),
        ...analyzeTabooPatterns(chart)
    ];
    const relationshipStyle = analyzeRelationshipStyle(chart);
    const spouseLongevity = analyzeSpouseLongevity(chart);

    const allPatterns = [...preMarital, ...affairContext, ...relationshipStyle, ...spouseLongevity];

    // Calculate overall risk
    const severeCount = allPatterns.filter(p => p.severity === 'severe').length;
    const moderateCount = allPatterns.filter(p => p.severity === 'moderate').length;

    let overallRisk: 'low' | 'moderate' | 'elevated' | 'high' = 'low';
    if (severeCount >= 2) overallRisk = 'high';
    else if (severeCount === 1 || moderateCount >= 3) overallRisk = 'elevated';
    else if (moderateCount >= 1) overallRisk = 'moderate';

    return {
        patterns: allPatterns,
        narrativeHistorySummary: summarizePatterns(preMarital, 'Narrative history'),
        opportunityTriggersSummary: summarizePatterns(affairContext, 'Opportunity triggers'),
        capacityApproachSummary: summarizePatterns(relationshipStyle, 'Capacity approach'),
        overallRiskLevel: overallRisk
    };
}

function summarizePatterns(patterns: RelationshipPattern[], defaultText: string): string {
    if (patterns.length === 0) return `No significant ${defaultText.toLowerCase()} detected.`;

    const severe = patterns.filter(p => p.severity === 'severe');
    const moderate = patterns.filter(p => p.severity === 'moderate');

    if (severe.length > 0) {
        return `${patterns.length} pattern(s) detected (${severe.length} severe), suggesting challenging ${defaultText.toLowerCase()}.`;
    }
    if (moderate.length > 0) {
        return `${patterns.length} pattern(s) detected, suggesting moderate ${defaultText.toLowerCase()}.`;
    }

    return `${patterns.length} pattern(s) indicate mild ${defaultText.toLowerCase()}.`;
}
