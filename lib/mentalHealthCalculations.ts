/**
 * Mental Health & Psychology Calculations
 * Based on Risk_kn.md Section 7: depression, anxiety, personality patterns, emotional stability
 */

import { Chart, Planet } from '@types';
import { normalizeDegrees } from './coreCalculations';

// ============================================================================
// TYPES
// ============================================================================

export interface MentalHealthIndicator {
    name: string;
    present: boolean;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
    involvedPlanets: string[];
}

export interface MentalHealthCategory {
    category: string;
    label: string;
    icon: string;
    riskLevel: 'low' | 'moderate' | 'elevated' | 'high';
    indicators: MentalHealthIndicator[];
    interpretation: string;
}

export interface EmotionalStrength {
    name: string;
    present: boolean;
    strength: 'strong' | 'moderate' | 'mild';
    description: string;
}

export interface MentalHealthAnalysis {
    categories: MentalHealthCategory[];
    emotionalStrengths: EmotionalStrength[];
    overallWellbeing: 'strong' | 'moderate' | 'needs_attention' | 'vulnerable';
    totalRiskScore: number;
    summary: string;
    disclaimer: string;
}

// ============================================================================
// HELPERS
// ============================================================================

function getPos(chart: Chart, planet: string) {
    return chart.planetaryPositions.find(p => p.planet === planet);
}

function hasAspect(lon1: number, lon2: number, maxOrb = 10): { type: string; orb: number } | null {
    const diff = Math.abs(normalizeDegrees(lon1 - lon2));
    const normalizedDiff = Math.min(diff, 360 - diff);
    const aspects = [
        { angle: 0, name: 'conjunction' },
        { angle: 90, name: 'square' },
        { angle: 180, name: 'opposition' },
    ];
    for (const a of aspects) {
        const orb = Math.abs(normalizedDiff - a.angle);
        if (orb <= maxOrb) return { type: a.name, orb };
    }
    return null;
}

// ============================================================================
// DEPRESSION INDICATORS
// ============================================================================

function detectDepression(chart: Chart): MentalHealthCategory {
    const indicators: MentalHealthIndicator[] = [];
    const moon = getPos(chart, 'Moon');
    const saturn = getPos(chart, 'Saturn');
    const sun = getPos(chart, 'Sun');
    const ketu = getPos(chart, 'Ketu');

    // Saturn-Moon conjunction/hard aspect (classic depression signature)
    if (moon && saturn) {
        const asp = hasAspect(moon.longitude, saturn.longitude);
        if (asp) {
            indicators.push({
                name: 'Saturn-Moon Hard Aspect',
                present: true,
                severity: asp.type === 'conjunction' ? 'severe' : 'moderate',
                description: `Saturn ${asp.type}s Moon — classic emotional suppression pattern. Saturn restricts Moon's natural emotional flow, creating melancholic tendencies, emotional numbness, and difficulty experiencing joy.`,
                involvedPlanets: ['Moon', 'Saturn']
            });
        }
    }

    // Moon debilitated (Scorpio) 
    if (moon && moon.dignity === 'debilitated') {
        indicators.push({
            name: 'Debilitated Moon',
            present: true,
            severity: 'moderate',
            description: `Moon is debilitated in ${moon.sign}, weakening emotional resilience. Emotional processing is impaired, leading to mood instability and susceptibility to depressive episodes.`,
            involvedPlanets: ['Moon']
        });
    }

    // Moon in 6th, 8th, or 12th house (dusthana placement)
    if (moon && [6, 8, 12].includes(moon.house)) {
        indicators.push({
            name: `Moon in ${moon.house}th House`,
            present: true,
            severity: moon.house === 8 ? 'severe' : 'moderate',
            description: `Moon in the ${moon.house}th house indicates ${moon.house === 6 ? 'anxiety-driven emotional patterns and stress' : moon.house === 8 ? 'deep emotional turmoil, crisis-prone psychology, and intense inner world' : 'emotional withdrawal, isolation tendencies, and a rich but hidden inner life'}.`,
            involvedPlanets: ['Moon']
        });
    }

    // Sun-Saturn hard aspect (suppressed self-expression)
    if (sun && saturn) {
        const asp = hasAspect(sun.longitude, saturn.longitude);
        if (asp) {
            indicators.push({
                name: 'Sun-Saturn Hard Aspect',
                present: true,
                severity: asp.type === 'conjunction' ? 'moderate' : 'mild',
                description: `Saturn ${asp.type}s Sun — self-esteem struggles and difficulty asserting identity. This can manifest as chronic self-doubt, imposter syndrome, and depressive self-criticism.`,
                involvedPlanets: ['Sun', 'Saturn']
            });
        }
    }

    // Ketu-Moon (emotional detachment)
    if (moon && ketu) {
        const asp = hasAspect(moon.longitude, ketu.longitude, 10);
        if (asp && asp.type === 'conjunction') {
            indicators.push({
                name: 'Moon-Ketu Conjunction',
                present: true,
                severity: 'moderate',
                description: 'Ketu conjunct Moon creates emotional detachment and numbness. Difficulty connecting with feelings, a sense of emotional emptiness that can mimic or trigger depression.',
                involvedPlanets: ['Moon', 'Ketu']
            });
        }
    }

    const riskLevel = indicators.length >= 3 ? 'high' : indicators.length >= 2 ? 'elevated' : indicators.length === 1 ? 'moderate' : 'low';

    return {
        category: 'depression',
        label: 'Depression Indicators',
        icon: '🌧️',
        riskLevel,
        indicators,
        interpretation: indicators.length > 0
            ? `${indicators.length} indicator(s) suggest vulnerability to depressive patterns. Key themes include emotional suppression, self-criticism, and difficulty processing feelings.`
            : 'No significant depression indicators. Emotional processing appears healthy.'
    };
}

// ============================================================================
// ANXIETY INDICATORS
// ============================================================================

function detectAnxiety(chart: Chart): MentalHealthCategory {
    const indicators: MentalHealthIndicator[] = [];
    const mercury = getPos(chart, 'Mercury');
    const saturn = getPos(chart, 'Saturn');
    const rahu = getPos(chart, 'Rahu');
    const moon = getPos(chart, 'Moon');

    // Saturn-Mercury (pessimistic/anxious thinking)
    if (mercury && saturn) {
        const asp = hasAspect(mercury.longitude, saturn.longitude);
        if (asp) {
            indicators.push({
                name: 'Saturn-Mercury Hard Aspect',
                present: true,
                severity: asp.type === 'conjunction' ? 'severe' : 'moderate',
                description: `Saturn ${asp.type}s Mercury — creates pessimistic thought patterns, catastrophic thinking, and excessive worry. The mind defaults to worst-case scenarios.`,
                involvedPlanets: ['Mercury', 'Saturn']
            });
        }
    }

    // Rahu-Mercury (racing, obsessive thoughts)
    if (mercury && rahu) {
        const asp = hasAspect(mercury.longitude, rahu.longitude, 10);
        if (asp && asp.type === 'conjunction') {
            indicators.push({
                name: 'Mercury-Rahu Conjunction',
                present: true,
                severity: 'severe',
                description: 'Rahu amplifies Mercury\'s mental activity to obsessive levels. Racing thoughts, difficulty quieting the mind, information overload, and compulsive thinking patterns.',
                involvedPlanets: ['Mercury', 'Rahu']
            });
        }
    }

    // Mercury debilitated (Pisces)
    if (mercury && mercury.dignity === 'debilitated') {
        indicators.push({
            name: 'Debilitated Mercury',
            present: true,
            severity: 'moderate',
            description: `Mercury debilitated in ${mercury.sign} creates confusion-based anxiety. Difficulty organizing thoughts, poor decision-making under stress, and a mind that feels foggy.`,
            involvedPlanets: ['Mercury']
        });
    }

    // Moon-Rahu (obsessive emotional anxiety)
    if (moon && rahu) {
        const asp = hasAspect(moon.longitude, rahu.longitude, 10);
        if (asp && asp.type === 'conjunction') {
            indicators.push({
                name: 'Moon-Rahu Conjunction',
                present: true,
                severity: 'severe',
                description: 'Rahu conjunct Moon creates intense emotional anxiety, phobias, and a \'clouded mind.\' Emotional responses are amplified and distorted, creating fear-based reactivity.',
                involvedPlanets: ['Moon', 'Rahu']
            });
        }
    }

    // Mercury in 6th or 8th
    if (mercury && [6, 8].includes(mercury.house)) {
        indicators.push({
            name: `Mercury in ${mercury.house}th House`,
            present: true,
            severity: 'mild',
            description: `Mercury in the ${mercury.house}th house ${mercury.house === 6 ? 'creates worry-oriented thinking, health anxiety, and analytical overthinking' : 'gives an investigative but anxious mind, prone to dwelling on hidden dangers and psychological complexity'}.`,
            involvedPlanets: ['Mercury']
        });
    }

    const riskLevel = indicators.length >= 3 ? 'high' : indicators.length >= 2 ? 'elevated' : indicators.length === 1 ? 'moderate' : 'low';

    return {
        category: 'anxiety',
        label: 'Anxiety Indicators',
        icon: '⚡',
        riskLevel,
        indicators,
        interpretation: indicators.length > 0
            ? `${indicators.length} indicator(s) suggest vulnerability to anxiety patterns. Key themes include racing thoughts, catastrophic thinking, and emotional hypervigilance.`
            : 'No significant anxiety indicators. Mental processing appears balanced.'
    };
}

// ============================================================================
// PERSONALITY PATTERN INDICATORS
// ============================================================================

function detectPersonalityPatterns(chart: Chart): MentalHealthCategory {
    const indicators: MentalHealthIndicator[] = [];
    const sun = getPos(chart, 'Sun');
    const moon = getPos(chart, 'Moon');
    const mars = getPos(chart, 'Mars');
    const venus = getPos(chart, 'Venus');
    const saturn = getPos(chart, 'Saturn');
    const rahu = getPos(chart, 'Rahu');

    // Borderline patterns: Moon-Rahu or Venus-Rahu
    if (moon && rahu) {
        const asp = hasAspect(moon.longitude, rahu.longitude, 10);
        if (asp && asp.type === 'conjunction') {
            indicators.push({
                name: 'Borderline Pattern — Moon-Rahu',
                present: true,
                severity: 'moderate',
                description: 'Moon-Rahu conjunction suggests emotional intensity with idealization-devaluation cycles. Fear of abandonment, intense but unstable attachments, and emotional volatility that can strain relationships.',
                involvedPlanets: ['Moon', 'Rahu']
            });
        }
    }
    if (venus && rahu) {
        const asp = hasAspect(venus.longitude, rahu.longitude, 10);
        if (asp && asp.type === 'conjunction') {
            indicators.push({
                name: 'Borderline Pattern — Venus-Rahu',
                present: true,
                severity: 'moderate',
                description: 'Venus-Rahu conjunction suggests obsessive love patterns with extremes in relationships. May cycle between passionate idealization and sudden devaluation of partners.',
                involvedPlanets: ['Venus', 'Rahu']
            });
        }
    }

    // Narcissistic patterns: Sun-Rahu
    if (sun && rahu) {
        const asp = hasAspect(sun.longitude, rahu.longitude, 10);
        if (asp && asp.type === 'conjunction') {
            indicators.push({
                name: 'Narcissistic Pattern — Sun-Rahu',
                present: true,
                severity: 'moderate',
                description: 'Sun-Rahu conjunction suggests inflated ego, need for constant admiration, and difficulty with genuine empathy. May present as charismatic and confident but struggles with authentic emotional connection.',
                involvedPlanets: ['Sun', 'Rahu']
            });
        }
    }

    // Antisocial patterns: Mars-Saturn hard aspect
    if (mars && saturn) {
        const asp = hasAspect(mars.longitude, saturn.longitude);
        if (asp && (asp.type === 'conjunction' || asp.type === 'square')) {
            indicators.push({
                name: 'Antisocial Pattern — Mars-Saturn',
                present: true,
                severity: asp.type === 'conjunction' ? 'severe' : 'moderate',
                description: `Mars-Saturn ${asp.type} creates tension between aggression and control. May manifest as suppressed anger that erupts unpredictably, rigid behavior patterns, or difficulty handling frustration constructively.`,
                involvedPlanets: ['Mars', 'Saturn']
            });
        }
    }

    // Weak Saturn (difficulty with rules/boundaries)
    if (saturn && saturn.dignity === 'debilitated') {
        indicators.push({
            name: 'Debilitated Saturn',
            present: true,
            severity: 'mild',
            description: `Saturn debilitated in ${saturn.sign} indicates difficulty with discipline, boundaries, and delayed gratification. May struggle with authority, structure, and long-term planning.`,
            involvedPlanets: ['Saturn']
        });
    }

    const riskLevel = indicators.length >= 3 ? 'high' : indicators.length >= 2 ? 'elevated' : indicators.length === 1 ? 'moderate' : 'low';

    return {
        category: 'personality_patterns',
        label: 'Personality Pattern Insights',
        icon: '🔍',
        riskLevel,
        indicators,
        interpretation: indicators.length > 0
            ? `${indicators.length} personality pattern indicator(s) detected. These suggest deep-seated psychological dynamics that influence how this person relates in intimate partnerships.`
            : 'No significant personality pattern concerns. Psychological functioning appears balanced.'
    };
}

// ============================================================================
// EMOTIONAL STABILITY ASSESSMENT
// ============================================================================

function assessEmotionalStability(chart: Chart): MentalHealthCategory {
    const indicators: MentalHealthIndicator[] = [];
    const moon = getPos(chart, 'Moon');
    const venus = getPos(chart, 'Venus');
    const mars = getPos(chart, 'Mars');
    const rahu = getPos(chart, 'Rahu');

    // Moon strength assessment
    if (moon && ['exalted', 'own_house', 'moolatrikona'].includes(moon.dignity)) {
        // Strong Moon is a positive — skip as indicator
    } else if (moon && moon.dignity === 'debilitated') {
        indicators.push({
            name: 'Weak Emotional Foundation',
            present: true,
            severity: 'severe',
            description: 'Debilitated Moon indicates a compromised emotional foundation. Mood swings, emotional reactivity, and difficulty self-soothing during stress.',
            involvedPlanets: ['Moon']
        });
    }

    // Mars-Moon hard aspect (emotional volatility)
    if (moon && mars) {
        const asp = hasAspect(moon.longitude, mars.longitude);
        if (asp && (asp.type === 'conjunction' || asp.type === 'square')) {
            indicators.push({
                name: 'Moon-Mars Emotional Volatility',
                present: true,
                severity: asp.type === 'conjunction' ? 'moderate' : 'mild',
                description: `Mars ${asp.type}s Moon — emotions are tinged with anger and impulsiveness. Reacts quickly and intensely, may say hurtful things in the heat of the moment, then regret later.`,
                involvedPlanets: ['Moon', 'Mars']
            });
        }
    }

    // Venus-Mars tight conjunction (desire-driven emotional state)
    if (venus && mars) {
        const asp = hasAspect(venus.longitude, mars.longitude, 6);
        if (asp && asp.type === 'conjunction') {
            indicators.push({
                name: 'Venus-Mars Desire Drive',
                present: true,
                severity: 'mild',
                description: 'Venus-Mars conjunction creates a passion-driven emotional landscape. Emotions are heavily influenced by desire and attraction, which can cloud judgment in relationships.',
                involvedPlanets: ['Venus', 'Mars']
            });
        }
    }

    // Multiple planets in water signs (emotional overwhelm)
    const waterSigns = ['Cancer', 'Scorpio', 'Pisces'];
    const waterPlanets = chart.planetaryPositions.filter(p => waterSigns.includes(p.sign) && ['Moon', 'Venus', 'Mars', 'Mercury', 'Sun'].includes(p.planet));
    if (waterPlanets.length >= 3) {
        indicators.push({
            name: 'Water Sign Emphasis',
            present: true,
            severity: 'mild',
            description: `${waterPlanets.length} personal planets in water signs (${waterPlanets.map(p => p.planet).join(', ')}). Highly empathic and emotionally sensitive, which is a gift but also creates vulnerability to emotional overwhelm and boundary confusion.`,
            involvedPlanets: waterPlanets.map(p => p.planet)
        });
    }

    const riskLevel = indicators.length >= 3 ? 'high' : indicators.length >= 2 ? 'elevated' : indicators.length === 1 ? 'moderate' : 'low';

    return {
        category: 'emotional_stability',
        label: 'Emotional Stability',
        icon: '🌊',
        riskLevel,
        indicators,
        interpretation: indicators.length > 0
            ? `${indicators.length} factor(s) affect emotional stability. Understanding these patterns helps in developing targeted coping strategies.`
            : 'Emotional stability appears strong. This person can generally manage stress and intense feelings effectively.'
    };
}

// ============================================================================
// PSYCHOTIC & DISSOCIATIVE INDICATORS (§7.3)
// ============================================================================

function detectPsychoticDissociativePatterns(chart: Chart): MentalHealthCategory {
    const indicators: MentalHealthIndicator[] = [];
    const moon = getPos(chart, 'Moon');
    const mercury = getPos(chart, 'Mercury');
    const rahu = getPos(chart, 'Rahu');
    const ketu = getPos(chart, 'Ketu');
    const mars = getPos(chart, 'Mars');
    const saturn = getPos(chart, 'Saturn');

    // Lunacy/Insanity Patterns (Moon-Mars-Saturn-Rahu in Dusthanas)
    if (moon && [6, 8, 12].includes(moon.house)) {
        if (mars && hasAspect(moon.longitude, mars.longitude)) {
            indicators.push({
                name: 'Moon-Mars Psychotic Tension',
                present: true,
                severity: 'severe',
                description: 'Moon in a difficult house aspected by Mars creates high emotional volatility and potential for impulsive breakdowns or aggressive outbursts.',
                involvedPlanets: ['Moon', 'Mars']
            });
        }
        if (saturn && hasAspect(moon.longitude, saturn.longitude)) {
            indicators.push({
                name: 'Moon-Saturn Melancholic Disconnection',
                present: true,
                severity: 'severe',
                description: 'Moon in a dusthana house with Saturn influence indicates deep states of depression that can cross into catatonic or delusional states.',
                involvedPlanets: ['Moon', 'Saturn']
            });
        }
    }

    // Dissociative Patterns (Ketu on Moon/Mercury)
    if (moon && ketu && hasAspect(moon.longitude, ketu.longitude, 8)) {
        indicators.push({
            name: 'Dissociative Potential — Moon-Ketu',
            present: true,
            severity: 'moderate',
            description: 'Ketu on the Moon can lead to dissociative episodes, feeling "out of body" or extremely detached from reality and self during times of high stress.',
            involvedPlanets: ['Moon', 'Ketu']
        });
    }

    if (mercury && ketu && hasAspect(mercury.longitude, ketu.longitude, 8)) {
        indicators.push({
            name: 'Mental Dissociation — Mercury-Ketu',
            present: true,
            severity: 'moderate',
            description: 'Ketu impacting Mercury affects cognitive continuity. May experience "missing time," mental blanks, or sudden switches in perspective.',
            involvedPlanets: ['Mercury', 'Ketu']
        });
    }

    // Rahu "Clouded Mind" Insanity (§1.1)
    if (moon && rahu && hasAspect(moon.longitude, rahu.longitude, 5)) {
        indicators.push({
            name: 'Lunacy Potential — Moon-Rahu',
            present: true,
            severity: 'severe',
            description: 'Rahu tightly conjunct Moon creates a "clouded mind," prone to phobias, paranoia, and obsessive loop-thinking that can distort reality.',
            involvedPlanets: ['Moon', 'Rahu']
        });
    }

    const riskLevel = indicators.length >= 3 ? 'high' : indicators.length >= 2 ? 'elevated' : indicators.length === 1 ? 'moderate' : 'low';

    return {
        category: 'psychotic_dissociative',
        label: 'Psychotic & Dissociative Patterns',
        icon: '🌪️',
        riskLevel,
        indicators,
        interpretation: indicators.length > 0
            ? `${indicators.length} indicator(s) suggest potential for dissociative or deep psychological distortion patterns. These require careful emotional grounding.`
            : 'No significant psychotic or dissociative indicators detected.'
    };
}

// ============================================================================
// EMOTIONAL STRENGTHS (PROTECTIVE FACTORS)
// ============================================================================

function assessEmotionalStrengths(chart: Chart): EmotionalStrength[] {
    const strengths: EmotionalStrength[] = [];
    const moon = getPos(chart, 'Moon');
    const jupiter = getPos(chart, 'Jupiter');
    const venus = getPos(chart, 'Venus');
    const sun = getPos(chart, 'Sun');

    if (moon && ['exalted', 'own_house', 'moolatrikona'].includes(moon.dignity)) {
        strengths.push({
            name: 'Strong Emotional Core',
            present: true,
            strength: moon.dignity === 'exalted' ? 'strong' : 'moderate',
            description: `Moon in ${moon.sign} provides excellent emotional resilience, self-awareness, and capacity for nurturing self and others.`
        });
    }

    if (jupiter && [1, 5, 7, 9].includes(jupiter.house)) {
        strengths.push({
            name: 'Jupiter\'s Protective Wisdom',
            present: true,
            strength: jupiter.house === 1 || jupiter.house === 9 ? 'strong' : 'moderate',
            description: `Jupiter in the ${jupiter.house}th house provides optimism, philosophical perspective, and the ability to find meaning in difficult experiences.`
        });
    }

    if (jupiter && ['exalted', 'own_house', 'moolatrikona'].includes(jupiter.dignity)) {
        strengths.push({
            name: 'Strong Jupiter Dignity',
            present: true,
            strength: 'strong',
            description: `Jupiter in ${jupiter.sign} gives natural wisdom, ethical grounding, and a resilient positive outlook that protects against mental health challenges.`
        });
    }

    if (sun && ['exalted', 'own_house', 'moolatrikona'].includes(sun.dignity)) {
        strengths.push({
            name: 'Strong Self-Identity',
            present: true,
            strength: 'moderate',
            description: `Sun in ${sun.sign} provides strong sense of self, healthy ego boundaries, and confidence that protects against external psychological pressures.`
        });
    }

    if (venus && ['exalted', 'own_house', 'moolatrikona'].includes(venus.dignity)) {
        strengths.push({
            name: 'Healthy Love Expression',
            present: true,
            strength: 'moderate',
            description: `Venus in ${venus.sign} supports healthy emotional expression, appreciation of beauty, and the ability to form harmonious relationships.`
        });
    }

    // Moon in kendra (1, 4, 7, 10) - emotional stability
    if (moon && [1, 4, 7, 10].includes(moon.house) && !moon.dignity?.includes('debilitated')) {
        strengths.push({
            name: 'Moon in Angular House',
            present: true,
            strength: 'moderate',
            description: `Moon in the ${moon.house}th house (angular/kendra) provides emotional stability and prominence. Feelings are integrated into identity and worldly functioning.`
        });
    }

    return strengths;
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export function analyzeMentalHealth(chart: Chart): MentalHealthAnalysis {
    const depression = detectDepression(chart);
    const anxiety = detectAnxiety(chart);
    const personalityPatterns = detectPersonalityPatterns(chart);
    const psychoticDissociative = detectPsychoticDissociativePatterns(chart);
    const emotionalStability = assessEmotionalStability(chart);
    const emotionalStrengths = assessEmotionalStrengths(chart);

    const categories = [depression, anxiety, personalityPatterns, psychoticDissociative, emotionalStability];

    const highCount = categories.filter(c => c.riskLevel === 'high').length;
    const elevatedCount = categories.filter(c => c.riskLevel === 'elevated').length;
    const totalIndicators = categories.reduce((sum, c) => sum + c.indicators.length, 0);

    const overallWellbeing: MentalHealthAnalysis['overallWellbeing'] =
        highCount >= 2 ? 'vulnerable' :
            highCount >= 1 || elevatedCount >= 2 ? 'needs_attention' :
                elevatedCount >= 1 ? 'moderate' : 'strong';

    const totalRiskScore = Math.min(100, Math.round(
        (highCount * 30) + (elevatedCount * 15) + (totalIndicators * 5)
    ));

    const summary = overallWellbeing === 'strong'
        ? 'Overall mental health indicators are positive. Emotional resilience and coping capacity appear strong.'
        : overallWellbeing === 'moderate'
            ? 'Some areas warrant awareness. Minor mental health patterns exist but are manageable with conscious effort.'
            : overallWellbeing === 'needs_attention'
                ? `${totalIndicators} significant indicators suggest areas that benefit from professional support and self-awareness practices.`
                : `Multiple indicators across ${highCount} categories suggest vulnerability. Professional mental health support is strongly recommended.`;

    return {
        categories,
        emotionalStrengths,
        overallWellbeing,
        totalRiskScore,
        summary,
        disclaimer: '⚠️ IMPORTANT: These are astrological pattern indicators, NOT clinical diagnoses. Charts reveal tendencies and vulnerabilities, not certainties. If you or someone you know is struggling with mental health, please consult a licensed mental health professional. Astrology is a complementary tool for self-awareness, not a substitute for clinical care.'
    };
}
