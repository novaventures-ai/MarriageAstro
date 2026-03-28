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
    counterBalance?: {
        title: string;
        text: string;
    };
}

export interface KarmaIndicator {
    label: string;
    value: string;
    icon: string;
    note: string;
    severity: 'low' | 'moderate' | 'high';
}

export interface RelationshipPatternAnalysis {
    patterns: RelationshipPattern[];
    narrativeHistorySummary: string;
    opportunityTriggersSummary: string;
    capacityApproachSummary: string;
    overallRiskLevel: 'low' | 'moderate' | 'elevated' | 'high';
    karmaIndicators: KarmaIndicator[];
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

function analyzePreMaritalPatterns(chart: Chart, name: string): RelationshipPattern[] {
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
            advice: 'Ensure your current partner understands that your past was a "training ground," not a comparison chart.',
            counterBalance: findSmartNeutralizer(chart, name, 'narrative_history', 'Complex Romantic History')
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
            advice: 'Schedule regular "dating" nights with your spouse. You need romance to feel married; utility is not enough.',
            counterBalance: findSmartNeutralizer(chart, name, 'narrative_history', 'Innate Romantic Idealism')
        });
    }

    // Unconventional desires (Rahu in 5th)
    const rahuIn5 = planetsIn5.find(p => p.planet === 'Rahu');
    if (rahuIn5) {
        patterns.push({
            name: 'Unconventional Romantic Desires',
            category: 'narrative_history',
            present: true,
            severity: 'moderate',
            description: 'Rahu in the 5th house creates intense, unconventional, and sometimes obsessive romantic attraction. May be drawn to unusual or taboo romantic situations.',
            indicators: ['Rahu in 5th house'],
            advice: 'Self-awareness about obsessive tendencies in romance helps channel this energy constructively.',
            counterBalance: findSmartNeutralizer(chart, name, 'narrative_history', 'Unconventional Romantic Desires')
        });
    }

    return patterns;
}

// ============================================================================
// AFFAIR CONTEXT ANALYSIS (External Triggers)
// Uses shared logic from riskCalculations.ts
// ============================================================================

import { assessAffairContext, assessInfidelityProtections } from './riskCalculations';

function findSmartNeutralizer(chart: Chart, name: string, patternCategory: string, patternName: string): { title: string; text: string } | undefined {
    // 1. Get all available protections using the advanced logic
    const protections = assessInfidelityProtections(chart, name);

    if (protections.length === 0) return undefined;

    // 2. Define priority keywords based on pattern context
    let priorityKeywords: string[] = [];

    // -- Contextual Mapping --
    if (patternName.includes('High-Stimulus') || patternName.includes('Unconventional') || patternName.includes('Passion')) {
        // For high passion/stimulus, we need CONTROL and RESTRICTION
        priorityKeywords = ['Saturn', 'Control', 'Discipline', 'Restrictive'];
    } else if (patternName.includes('Taboo') || patternName.includes('Secret') || patternName.includes('Affair')) {
        // For taboo/secrets, we need HIGH MORALITY and DHARMA
        priorityKeywords = ['Atmakaraka', 'Ishta Devata', 'Dharma', 'Jupiter', 'Ethics', 'Moral'];
    } else if (patternCategory === 'narrative_history' || patternName.includes('Emotional')) {
        // For narrative/emotional history, we need EMOTIONAL STABILITY and SUSTENANCE
        priorityKeywords = ['Moon', 'Upapada', 'Family', 'Contentment', 'Resilience'];
    } else if (patternCategory === 'spouse_longevity') {
        // For longevity/conflict, we need COMMITMENT and DUTY
        priorityKeywords = ['Vargottama', 'Mangalya', 'Saturn', 'Vow'];
    }

    // 3. Find the best match
    // First, look for a STRONG protection that matches keywords
    let bestMatch = protections.find(p =>
        p.strength === 'strong' && priorityKeywords.some(kw => p.text.includes(kw))
    );

    // Second, look for ANY protection that matches keywords
    if (!bestMatch) {
        bestMatch = protections.find(p =>
            priorityKeywords.some(kw => p.text.includes(kw))
        );
    }

    // Third, fallback to the STRONGEST available protection (General Anchor)
    if (!bestMatch) {
        bestMatch = protections.find(p => p.strength === 'strong');
    }

    // Fourth, fallback to the first available (Moderate/Weak)
    if (!bestMatch && protections.length > 0) {
        bestMatch = protections[0];
    }

    if (bestMatch) {
        // Add a prefix to define context if it's a specific match
        const isSpecific = priorityKeywords.some(kw => bestMatch!.text.includes(kw));
        return {
            title: isSpecific ? `Specific Counter: ${bestMatch.text.split(':')[0]}` : `General Stabilizer: ${bestMatch.text.split(':')[0]}`,
            text: bestMatch.text.split(':')[1] ? bestMatch.text.split(':')[1].trim() : bestMatch.text
        };
    }

    return undefined;
}

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
            case 'family_taboo':
                title = 'Family/Taboo Connection Pattern';
                description = 'Planetary afflictions involving the 4th/9th houses (D1/D12) suggest a complex psychological pattern where "forbidden" or "taboo" dynamics trigger attraction. This indicates a high-risk pattern suggesting potential for boundary-crossing within close family circles or extended domestic networks.';
                advice = 'Strict adherence to social and familial boundaries is essential. Seek professional guidance if you notice patterns of attraction to inappropriate or unavailable figures.';
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
                advice: advice,
                counterBalance: findSmartNeutralizer(chart, name, 'opportunity_triggers', title)
            });
        }
    });

    return patterns;
}

// ============================================================================
// RELATIONSHIP STYLE ANALYSIS
// ============================================================================

function analyzeRelationshipStyle(chart: Chart, name: string): RelationshipPattern[] {
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
            advice: 'You need "healthy danger"—adventure, ambitious shared goals, or rigorous physical activity together—to prevent seeking drama elsewhere.',
            counterBalance: findSmartNeutralizer(chart, name, 'capacity_approach', 'High-Stimulus Relationship Needs')
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
            advice: 'Practice "Radical Honesty" with your partner. Deep conversations are your substitute for drama.',
            counterBalance: findSmartNeutralizer(chart, name, 'capacity_approach', 'Transformational Intensity Pattern')
        });
    }

    return patterns;
}

// ============================================================================
// TABOO & FAMILY PATTERNS (§4.5)
// ============================================================================

function analyzeTabooPatterns(chart: Chart, name: string): RelationshipPattern[] {
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
            advice: 'Transparency about family history and finances is crucial.',
            counterBalance: findSmartNeutralizer(chart, name, 'opportunity_triggers', 'Family Secrets Sensitivity')
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
            advice: 'Be conscious of the attraction to forbidden or secretive dynamics.',
            counterBalance: findSmartNeutralizer(chart, name, 'opportunity_triggers', 'Taboo Relationship Vulnerability')
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
            advice: 'Ensure that the need for privacy does not become secrecy.',
            counterBalance: findSmartNeutralizer(chart, name, 'opportunity_triggers', 'Hidden/Isolated Connection Pattern')
        });
    }

    return patterns;
}

// ============================================================================
// SPOUSE LONGEVITY INDICATORS (§5)
// ============================================================================

function analyzeSpouseLongevity(chart: Chart, name: string): RelationshipPattern[] {
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
                advice: 'Implement a "time-out" rule during heated arguments. Cooling down prevents permanent damage.',
                counterBalance: findSmartNeutralizer(chart, name, 'spouse_longevity', 'Mars Influence (Mangal Dosha)')
            });
        } else if (malefics.length >= 2) {
            patterns.push({
                name: '8th House Stress Factors',
                category: 'spouse_longevity',
                present: true,
                severity: 'moderate',
                description: `${malefics.join(', ')} in the 8th house suggests that shared finances, in-laws, or chronic health issues could become major stress points in the marriage. The relationship is tested through crises.`,
                indicators: [`${malefics.length} malefics in 8th`],
                advice: 'Proactive management of joint assets and clear boundaries with in-laws are essential.',
                counterBalance: findSmartNeutralizer(chart, name, 'spouse_longevity', '8th House Stress Factors')
            });
        }
    }

    return patterns;
}

// ============================================================================
// KARMA INDICATORS COMPUTATION  (multi-factor — no single planet decides outcome)
// ============================================================================

/** Ordinal suffix helper */
function ord(n: number): string {
    if (n === 1) return '1st';
    if (n === 2) return '2nd';
    if (n === 3) return '3rd';
    return `${n}th`;
}

/** House-difference (wraps at 12, shortest path) */
function houseDiff(a: number, b: number): number {
    const d = Math.abs(a - b);
    return Math.min(d, 12 - d);
}

function computeKarmaIndicators(chart: Chart): KarmaIndicator[] {
    const ketu    = getPos(chart, 'Ketu');
    const rahu    = getPos(chart, 'Rahu');
    const venus   = getPos(chart, 'Venus');
    const saturn  = getPos(chart, 'Saturn');
    const jupiter = getPos(chart, 'Jupiter');
    const moon    = getPos(chart, 'Moon');
    const mars    = getPos(chart, 'Mars');
    const sun     = getPos(chart, 'Sun');

    // ─────────────────────────────────────────────────────────────────────────
    // 1. PAST-LIFE RELATIONSHIP KARMA
    //    Factors: Ketu house, Rahu house, Saturn-Venus aspect, 12th-house load
    // ─────────────────────────────────────────────────────────────────────────
    let plScore = 0;
    const plFactors: string[] = [];

    // Factor A — Ketu house (primary, but only ONE of several signals)
    if (ketu) {
        if (ketu.house === 5)  { plScore += 3; plFactors.push(`Ketu in ${ord(ketu.house)} (intense romantic karma)`); }
        else if (ketu.house === 7)  { plScore += 3; plFactors.push(`Ketu in ${ord(ketu.house)} (marriage soul-contract)`); }
        else if (ketu.house === 12) { plScore += 2; plFactors.push(`Ketu in ${ord(ketu.house)} (hidden past-life bonds)`); }
        else if (ketu.house === 9)  { plScore += 2; plFactors.push(`Ketu in ${ord(ketu.house)} (dharma-karma axis)`); }
        else if ([1, 4, 8].includes(ketu.house)) { plScore += 1; plFactors.push(`Ketu in ${ord(ketu.house)}`); }
        // Houses 2,3,6,10,11 = no significant past-life romantic karma
    }

    // Factor B — Rahu in relationship houses
    if (rahu) {
        if (rahu.house === 7) { plScore += 2; plFactors.push(`Rahu in ${ord(rahu.house)} (obsessive partner pull)`); }
        if (rahu.house === 5) { plScore += 1; plFactors.push(`Rahu in ${ord(rahu.house)} (romance amplification)`); }
    }

    // Factor C — Saturn aspecting or conjunct Venus (karmic relationship debt)
    if (saturn && venus) {
        const d = houseDiff(saturn.house, venus.house);
        if (d === 0) { plScore += 2; plFactors.push('Saturn conjunct Venus (karmic love debt)'); }
        else if (d === 6) { plScore += 2; plFactors.push('Saturn opposite Venus (karmic tension)'); }
        else if (d === 3 || d === 4) { plScore += 1; plFactors.push('Saturn aspecting Venus'); }
    }

    // Factor D — Heavily loaded 12th house (hidden/past-life bonds)
    const planetsIn12 = chart.planetaryPositions.filter(
        p => p.house === 12 && !['Uranus', 'Neptune', 'Pluto'].includes(p.planet)
    );
    if (planetsIn12.length >= 2) { plScore += 1; plFactors.push(`${planetsIn12.length} planets in 12th`); }

    let pastLifeValue: string;
    let pastLifeSeverity: 'low' | 'moderate' | 'high';
    if (plScore >= 4) {
        pastLifeSeverity = 'high';
        const primary = plFactors[0] || '';
        pastLifeValue = primary.includes('5th') ? 'Strong — unresolved romantic karma'
            : primary.includes('7th') ? 'Strong — fated marriage lessons'
            : 'Strong — multiple karmic threads';
    } else if (plScore >= 2) {
        pastLifeSeverity = 'moderate';
        pastLifeValue = 'Moderate — some karmic themes present';
    } else {
        pastLifeSeverity = 'low';
        pastLifeValue = 'Mild — relatively fresh soul in love';
    }

    const pastLifeNote = plFactors.length > 0
        ? `Active indicators: ${plFactors.join('; ')}. These create recurring patterns until consciously resolved.`
        : 'No strong past-life romantic indicators. You approach relationships with fewer karmic obligations.';

    // ─────────────────────────────────────────────────────────────────────────
    // 2. PRE-MARITAL RELATIONSHIP COUNT
    //    Factors scored independently — not just planet count in 5th house
    // ─────────────────────────────────────────────────────────────────────────
    let pmScore = 0;
    const pmFactors: string[] = [];
    const pmProtections: string[] = [];

    // Factor A — High-impact planets in 5th (weighted by planet nature)
    // Ketu, Uranus, Neptune, Pluto excluded (generational / detachment energy)
    const romantic5th = chart.planetaryPositions.filter(
        p => p.house === 5 && !['Ketu', 'Uranus', 'Neptune', 'Pluto'].includes(p.planet)
    );
    for (const p of romantic5th) {
        if (p.planet === 'Rahu')   { pmScore += 3; pmFactors.push('Rahu in 5th (amplified romance)'); }
        else if (p.planet === 'Venus') { pmScore += 2; pmFactors.push('Venus in 5th (innate romantic nature)'); }
        else if (p.planet === 'Mars')  { pmScore += 2; pmFactors.push('Mars in 5th (passion-driven bonds)'); }
        else if (p.planet === 'Moon')  { pmScore += 1; pmFactors.push('Moon in 5th (emotional entanglement)'); }
        else                           { pmScore += 1; pmFactors.push(`${p.planet} in 5th`); }
    }

    // Factor B — Rahu aspecting Venus (opposition or conjunction across houses)
    if (rahu && venus && romantic5th.every(p => p.planet !== 'Rahu')) {
        const d = houseDiff(rahu.house, venus.house);
        if (d === 0 || d === 6) { pmScore += 2; pmFactors.push('Rahu–Venus conjunction/opposition (desire amplification)'); }
        else if (d === 1)        { pmScore += 1; pmFactors.push('Rahu near Venus'); }
    }

    // Factor C — Venus-Mars combination (physical passion)
    if (venus && mars && !romantic5th.some(p => ['Venus', 'Mars'].includes(p.planet))) {
        const d = houseDiff(venus.house, mars.house);
        if (d === 0) { pmScore += 1; pmFactors.push('Venus–Mars conjunction'); }
    }

    // Factor D — Venus dignity
    if (venus) {
        if (venus.dignity === 'debilitated') { pmScore += 2; pmFactors.push(`Venus debilitated in ${venus.sign} (seeks validation through many bonds)`); }
        else if (['Scorpio', 'Aries'].includes(venus.sign)) { pmScore += 1; pmFactors.push(`Venus in ${venus.sign} (intense desire nature)`); }
    }

    // Factor E — Moon in romantic nakshatras
    const romanticNaks = ['Rohini', 'Purva Phalguni', 'Swati', 'Purva Ashadha', 'Shatabhisha'];
    if (moon && romanticNaks.includes(moon.nakshatra)) {
        pmScore += 1;
        pmFactors.push(`Moon in ${moon.nakshatra} nakshatra (romantic disposition)`);
    }

    // Protection: Jupiter well-placed reduces impulsive connections
    if (jupiter && [5, 7, 9].includes(jupiter.house) &&
        ['exalted', 'own_house', 'friendly', 'moolatrikona'].includes(jupiter.dignity)) {
        pmScore -= 2;
        pmProtections.push(`Jupiter in ${ord(jupiter.house)} (wisdom guards romantic choices)`);
    }
    pmScore = Math.max(0, pmScore);

    let preMarValue: string;
    let preMarSeverity: 'low' | 'moderate' | 'high';
    if (pmScore >= 7) {
        preMarSeverity = 'high';
        preMarValue = '4 or more connections likely';
    } else if (pmScore >= 5) {
        preMarSeverity = 'high';
        preMarValue = '3–4 connections indicated';
    } else if (pmScore >= 3) {
        preMarSeverity = 'moderate';
        preMarValue = '2–3 connections indicated';
    } else if (pmScore >= 1) {
        preMarSeverity = 'low';
        preMarValue = '1–2 connections indicated';
    } else {
        preMarSeverity = 'low';
        preMarValue = '0–1 (few or no significant connections)';
    }

    const preMarNote = [
        pmFactors.length > 0 ? `Contributing factors: ${pmFactors.join('; ')}.` : 'No major indicators of multiple connections.',
        pmProtections.length > 0 ? ` Counter: ${pmProtections.join('; ')}.` : ''
    ].join('');

    // ─────────────────────────────────────────────────────────────────────────
    // 3. VENUS CYCLE PATTERN
    //    Factors: Venus sign, Venus aspects from Rahu/Saturn/Mars, Venus house
    // ─────────────────────────────────────────────────────────────────────────
    const fireSignsV  = ['Aries', 'Leo', 'Sagittarius'];
    const waterSignsV = ['Cancer', 'Scorpio', 'Pisces'];
    const earthSignsV = ['Taurus', 'Virgo', 'Capricorn'];
    let venusCycleValue = 'Steady → Committed';
    let venusCycleNote  = 'Venus shows a grounded, reliable approach to love.';
    let venusCycleSeverity: 'low' | 'moderate' | 'high' = 'low';

    if (venus) {
        const venusRahuConj = rahu && houseDiff(venus.house, rahu.house) <= 1;
        const venusRahuOpp  = rahu && houseDiff(venus.house, rahu.house) === 6;
        const venusSaturnConj = saturn && houseDiff(venus.house, saturn.house) <= 1;
        const venusMarsConj   = mars && houseDiff(venus.house, mars.house) <= 1;

        if (venusRahuConj || venusRahuOpp || ['Scorpio', 'Aries'].includes(venus.sign)) {
            venusCycleValue = 'Idealism → Disillusionment → Repeat';
            venusCycleSeverity = 'high';
            const why = (venusRahuConj || venusRahuOpp)
                ? `Venus ${venusRahuConj ? 'conjunct' : 'opposite'} Rahu (amplified desire)`
                : `Venus in ${venus.sign}`;
            venusCycleNote = `${why}: Each relationship begins with intense idealization — they seem perfect. When reality sets in, disillusionment follows. Without conscious awareness, this cycle repeats with each new person.`;
        } else if (venusMarsConj && fireSignsV.includes(venus.sign)) {
            venusCycleValue = 'Passion → Burnout → New Spark';
            venusCycleSeverity = 'high';
            venusCycleNote = `Venus-Mars in ${venus.sign}: Love ignites fast and burns hot, but fades when daily routine sets in. You crave the "spark" — which requires active effort to maintain within one relationship.`;
        } else if (venusSaturnConj || ['Capricorn', 'Virgo'].includes(venus.sign)) {
            venusCycleValue = 'Cautious → Deeply Committed';
            venusCycleSeverity = 'low';
            const why = venusSaturnConj ? 'Venus with Saturn' : `Venus in ${venus.sign}`;
            venusCycleNote = `${why}: Love takes time to develop but runs very deep. You are slow to open, critical of potential partners, but once committed — exceptionally steadfast and loyal.`;
        } else if (fireSignsV.includes(venus.sign)) {
            venusCycleValue = 'Intense Spark → Gradual Settling';
            venusCycleSeverity = 'moderate';
            venusCycleNote = `Venus in ${venus.sign}: Passionate and enthusiastic in early romance. Needs ongoing growth and shared adventure to stay engaged. Routine without renewal leads to restlessness.`;
        } else if (waterSignsV.includes(venus.sign)) {
            venusCycleValue = 'Deep Bonding → Attachment Risk';
            venusCycleSeverity = 'moderate';
            venusCycleNote = `Venus in ${venus.sign}: Forms intensely emotional bonds. Difficulty letting go when relationships end — healing requires full emotional processing before the next connection.`;
        } else if (earthSignsV.includes(venus.sign)) {
            venusCycleValue = 'Steady → Practical Partnership';
            venusCycleSeverity = 'low';
            venusCycleNote = `Venus in ${venus.sign}: Values stability and shared purpose over grand romantic gestures. Love is demonstrated through consistent support, reliability, and quality time.`;
        } else {
            venusCycleValue = 'Exploratory → Intellectually Bonded';
            venusCycleSeverity = 'low';
            venusCycleNote = `Venus in ${venus.sign}: Needs mental connection as much as emotional. Curious and communicative in love — may take time to commit if not intellectually stimulated.`;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. PATTERN BREAK POTENTIAL
    //    Factors: Jupiter placement+dignity, Saturn placement, Sun strength, Ketu detachment
    // ─────────────────────────────────────────────────────────────────────────
    let bpScore = 0;
    const bpFactors: string[] = [];

    // Jupiter well-placed = wisdom to break patterns
    if (jupiter) {
        const jupGood = ['exalted', 'own_house', 'friendly', 'moolatrikona'].includes(jupiter.dignity);
        if ([5, 7, 9, 1].includes(jupiter.house) && jupGood) {
            bpScore += 3; bpFactors.push(`Jupiter in ${ord(jupiter.house)} (grace and wisdom)`);
        } else if ([5, 7, 9].includes(jupiter.house)) {
            bpScore += 1; bpFactors.push(`Jupiter in ${ord(jupiter.house)}`);
        }
    }

    // Saturn in relationship houses = structural discipline
    if (saturn && [7, 5, 1, 9].includes(saturn.house) && saturn.dignity !== 'debilitated') {
        bpScore += 2; bpFactors.push(`Saturn in ${ord(saturn.house)} (structured self-discipline)`);
    }

    // Strong Sun = willpower and self-awareness
    if (sun && ['exalted', 'own_house', 'moolatrikona'].includes(sun.dignity)) {
        bpScore += 1; bpFactors.push('Strong Sun (self-awareness and willpower)');
    }

    // Ketu in 7th/12th/9th = natural detachment from patterns
    if (ketu && [7, 12, 9].includes(ketu.house)) {
        bpScore += 1; bpFactors.push(`Ketu in ${ord(ketu.house)} (natural detachment)`);
    }

    let breakValue: string;
    let breakSeverity: 'low' | 'moderate' | 'high';
    if (bpScore >= 4) {
        breakSeverity = 'low';   // Low severity = GOOD (high potential)
        const label = bpFactors[0]?.split('(')[0].trim() || 'multiple factors';
        breakValue = `High — ${label}`;
    } else if (bpScore >= 2) {
        breakSeverity = 'moderate';
        breakValue = 'Moderate — intentional effort required';
    } else {
        breakSeverity = 'high';  // High severity = needs most work
        breakValue = 'Challenging — deep patterns need structured work';
    }

    const breakNote = bpFactors.length > 0
        ? `Supportive factors: ${bpFactors.join('; ')}. Saturn Return (ages 28–30, 57–60) and Jupiter Mahadasha are key transformation windows.`
        : 'No strong natural break indicators. Structured therapy, Jyotish remedies, and Saturn-period discipline are most effective tools.';

    return [
        { label: 'Past-Life Relationship Karma',   value: pastLifeValue,    icon: '♾️', note: pastLifeNote,  severity: pastLifeSeverity  },
        { label: 'Pre-Marital Relationship Count',  value: preMarValue,       icon: '🌹', note: preMarNote,    severity: preMarSeverity    },
        { label: 'Venus Cycle Pattern',             value: venusCycleValue,  icon: '💫', note: venusCycleNote, severity: venusCycleSeverity },
        { label: 'Pattern Break Potential',         value: breakValue,       icon: '🌟', note: breakNote,      severity: breakSeverity     },
    ];
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export function calculateRelationshipPatterns(chart: Chart, name: string): RelationshipPatternAnalysis {
    const preMarital = analyzePreMaritalPatterns(chart, name);
    const affairContext = [
        ...analyzeAffairContextPatterns(chart, name),
        ...analyzeTabooPatterns(chart, name)
    ];
    const relationshipStyle = analyzeRelationshipStyle(chart, name);
    const spouseLongevity = analyzeSpouseLongevity(chart, name);

    const allPatterns = [...preMarital, ...affairContext, ...relationshipStyle, ...spouseLongevity];

    // Calculate overall risk
    const severeCount = allPatterns.filter(p => p.severity === 'severe').length;
    const moderateCount = allPatterns.filter(p => p.severity === 'moderate').length;
    const counterCount = allPatterns.filter(p => p.counterBalance).length;

    // Adjust counts based on counter-balances for overall level
    // A counter-balance effectively "neutralizes" one moderate risk or softens a severe one
    const effectiveSevere = Math.max(0, severeCount - Math.floor(counterCount / 2));
    const effectiveModerate = Math.max(0, moderateCount - (counterCount % 2 === 1 ? 1 : 0));

    let overallRisk: 'low' | 'moderate' | 'elevated' | 'high' = 'low';
    if (effectiveSevere >= 2) overallRisk = 'high';
    else if (effectiveSevere === 1 || effectiveModerate >= 3) overallRisk = 'elevated';
    else if (effectiveModerate >= 1) overallRisk = 'moderate';

    return {
        patterns: allPatterns,
        narrativeHistorySummary: summarizePatterns(preMarital, 'Narrative history'),
        opportunityTriggersSummary: summarizePatterns(affairContext, 'Opportunity triggers'),
        capacityApproachSummary: summarizePatterns(relationshipStyle, 'Capacity approach'),
        overallRiskLevel: overallRisk,
        karmaIndicators: computeKarmaIndicators(chart)
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
