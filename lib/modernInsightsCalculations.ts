/**
 * Modern Insights Enhanced Calculations
 * Cross-chart outer planet aspects, attachment theory, and shadow analysis
 */

import { Chart, Planet } from '@types';
import { normalizeDegrees } from './coreCalculations';

// ============================================================================
// TYPES
// ============================================================================

export interface OuterPlanetAspect {
    planet1: string;       // e.g. "A's Uranus"
    planet2: string;       // e.g. "B's Venus"
    aspectType: string;    // conjunction, opposition, trine, square, sextile
    orb: number;
    nature: 'harmonious' | 'challenging' | 'intense';
    interpretation: string;
    keywords: string[];
}

export interface AttachmentPattern {
    name: string;
    style: 'secure' | 'anxious' | 'avoidant' | 'disorganized';
    present: boolean;
    strength: 'strong' | 'moderate' | 'mild';
    description: string;
    indicators: string[];
    partner: 'A' | 'B' | 'both';
}

export interface ShadowDynamic {
    name: string;
    present: boolean;
    intensity: 'high' | 'moderate' | 'low';
    description: string;
    growthOpportunity: string;
    involvedPlanets: string[];
}

export interface ModernInsightsEnhanced {
    crossChartAspects: OuterPlanetAspect[];
    attachmentPatterns: AttachmentPattern[];
    shadowDynamics: ShadowDynamic[];
    overallAttachmentStyle: {
        partnerA: string;
        partnerB: string;
        compatibilityNote: string;
    };
}

// ============================================================================
// HELPERS
// ============================================================================

function getPos(chart: Chart, planet: string) {
    return chart.planetaryPositions.find(p => p.planet === planet);
}

interface AspectResult {
    type: string;
    orb: number;
    nature: 'harmonious' | 'challenging' | 'intense';
}

function findAspect(lon1: number, lon2: number, maxOrb = 8): AspectResult | null {
    const diff = Math.abs(normalizeDegrees(lon1 - lon2));
    const normalizedDiff = Math.min(diff, 360 - diff);

    const aspects: { angle: number; name: string; nature: 'harmonious' | 'challenging' | 'intense' }[] = [
        { angle: 0, name: 'conjunction', nature: 'intense' },
        { angle: 60, name: 'sextile', nature: 'harmonious' },
        { angle: 90, name: 'square', nature: 'challenging' },
        { angle: 120, name: 'trine', nature: 'harmonious' },
        { angle: 180, name: 'opposition', nature: 'challenging' },
    ];

    for (const a of aspects) {
        const orb = Math.abs(normalizedDiff - a.angle);
        if (orb <= maxOrb) {
            return { type: a.name, orb: Math.round(orb * 10) / 10, nature: a.nature };
        }
    }
    return null;
}

// ============================================================================
// 1. CROSS-CHART OUTER PLANET ASPECTS
// ============================================================================

function analyzeOuterPlanetAspects(chartA: Chart, chartB: Chart, nameA: string, nameB: string): OuterPlanetAspect[] {
    const aspects: OuterPlanetAspect[] = [];

    const outerPlanets = ['Uranus', 'Neptune', 'Pluto'];
    const personalPlanets = ['Venus', 'Mars', 'Moon', 'Sun', 'Mercury'];

    // Check each outer planet from A against personal planets of B, and vice versa
    for (const outer of outerPlanets) {
        for (const personal of personalPlanets) {
            // A's outer → B's personal
            const outerA = getPos(chartA, outer as Planet);
            const personalB = getPos(chartB, personal as Planet);
            if (outerA && personalB) {
                const asp = findAspect(outerA.longitude, personalB.longitude);
                if (asp) {
                    const interp = getOuterPersonalInterpretation(outer, personal, asp.type, nameA, nameB);
                    if (interp) {
                        aspects.push({
                            planet1: `${nameA}'s ${outer}`,
                            planet2: `${nameB}'s ${personal}`,
                            aspectType: asp.type,
                            orb: asp.orb,
                            nature: asp.nature,
                            interpretation: interp.text,
                            keywords: interp.keywords
                        });
                    }
                }
            }

            // B's outer → A's personal
            const outerB = getPos(chartB, outer as Planet);
            const personalA = getPos(chartA, personal as Planet);
            if (outerB && personalA) {
                const asp = findAspect(outerB.longitude, personalA.longitude);
                if (asp) {
                    const interp = getOuterPersonalInterpretation(outer, personal, asp.type, nameB, nameA);
                    if (interp) {
                        aspects.push({
                            planet1: `${nameB}'s ${outer}`,
                            planet2: `${nameA}'s ${personal}`,
                            aspectType: asp.type,
                            orb: asp.orb,
                            nature: asp.nature,
                            interpretation: interp.text,
                            keywords: interp.keywords
                        });
                    }
                }
            }
        }
    }

    return aspects;
}

function getOuterPersonalInterpretation(outer: string, personal: string, aspect: string, outerOwner: string, personalOwner: string): { text: string; keywords: string[] } | null {
    const isHard = aspect === 'square' || aspect === 'opposition';
    const isSoft = aspect === 'trine' || aspect === 'sextile';
    const isConj = aspect === 'conjunction';

    // Uranus aspects
    if (outer === 'Uranus' && personal === 'Venus') {
        return {
            text: isHard
                ? `${outerOwner}'s Uranus ${aspect}s ${personalOwner}'s Venus — electrifying but unstable attraction. The relationship craves excitement but struggles with commitment. ${personalOwner} may feel that ${outerOwner} is unpredictable in love, causing insecurity about the future.`
                : isSoft
                    ? `${outerOwner}'s Uranus ${aspect}s ${personalOwner}'s Venus — stimulating and refreshing love dynamic. Both enjoy an unconventional approach to romance, keeping the spark alive through novelty and intellectual connection.`
                    : `${outerOwner}'s Uranus conjunct ${personalOwner}'s Venus — instant, lightning-bolt attraction. An intensely exciting but potentially disruptive love connection. The relationship feels fated but demands freedom within commitment.`,
            keywords: isHard ? ['instability', 'electric attraction', 'commitment fears'] : ['exciting love', 'intellectual spark', 'unconventional romance']
        };
    }
    if (outer === 'Uranus' && personal === 'Mars') {
        return {
            text: isHard
                ? `${outerOwner}'s Uranus ${aspect}s ${personalOwner}'s Mars — volatile energy that can manifest as sudden conflicts or impulsive actions. Both may provoke each other into rash decisions. Channel this into shared adventures.`
                : `${outerOwner}'s Uranus ${aspect}s ${personalOwner}'s Mars — dynamic, exciting energy. Both inspire each other to take bold action and try new things. Great for shared entrepreneurial or athletic pursuits.`,
            keywords: isHard ? ['volatility', 'sudden conflicts', 'impulsiveness'] : ['dynamic energy', 'bold action', 'adventure']
        };
    }
    if (outer === 'Uranus' && personal === 'Moon') {
        return {
            text: isHard
                ? `${outerOwner}'s Uranus ${aspect}s ${personalOwner}'s Moon — emotional unpredictability. ${personalOwner} may feel emotionally unsettled by ${outerOwner}'s need for change. Establishing emotional safety rituals is essential.`
                : `${outerOwner}'s Uranus ${aspect}s ${personalOwner}'s Moon — emotionally liberating connection. ${outerOwner} helps ${personalOwner} break free from limiting emotional patterns and embrace a more authentic emotional life.`,
            keywords: isHard ? ['emotional instability', 'unpredictability', 'restlessness'] : ['emotional freedom', 'authenticity', 'liberation']
        };
    }

    // Neptune aspects
    if (outer === 'Neptune' && personal === 'Venus') {
        return {
            text: isHard
                ? `${outerOwner}'s Neptune ${aspect}s ${personalOwner}'s Venus — romantic idealization that leads to disillusionment. ${personalOwner} may project fantasy onto ${outerOwner}, only to discover reality doesn't match. Susceptible to deception in love.`
                : isSoft
                    ? `${outerOwner}'s Neptune ${aspect}s ${personalOwner}'s Venus — dreamy, spiritual love connection. Both experience a transcendent bond that feels divinely orchestrated. Shared artistic or spiritual pursuits deepen the connection.`
                    : `${outerOwner}'s Neptune conjunct ${personalOwner}'s Venus — a soul-level romantic connection that borders on the mystical. Boundaries dissolve in love. Extraordinarily beautiful but requires grounding to prevent co-dependency.`,
            keywords: isHard ? ['idealization', 'disillusion', 'deception risk'] : ['spiritual love', 'transcendent bond', 'soul connection']
        };
    }
    if (outer === 'Neptune' && personal === 'Mars') {
        return {
            text: isHard
                ? `${outerOwner}'s Neptune ${aspect}s ${personalOwner}'s Mars — action paralyzed by confusion. ${personalOwner}'s drive is undermined or misdirected by ${outerOwner}'s elusiveness. Passive-aggressive dynamics and energy drain are possible.`
                : `${outerOwner}'s Neptune ${aspect}s ${personalOwner}'s Mars — inspired action. ${personalOwner}'s drive is channeled into creative, spiritual, or compassionate pursuits through ${outerOwner}'s influence. Great for artistic collaboration.`,
            keywords: isHard ? ['confusion', 'passive aggression', 'energy drain'] : ['inspired action', 'creative drive', 'spiritual motivation']
        };
    }
    if (outer === 'Neptune' && personal === 'Moon') {
        return {
            text: isHard
                ? `${outerOwner}'s Neptune ${aspect}s ${personalOwner}'s Moon — emotional boundaries dissolve, creating confusion about whose feelings are whose. ${personalOwner} may feel emotionally manipulated or gaslighted, even unintentionally.`
                : `${outerOwner}'s Neptune ${aspect}s ${personalOwner}'s Moon — deep psychic and emotional attunement. Both can sense each other's feelings without words. A nurturing, compassionate emotional environment that feels like coming home.`,
            keywords: isHard ? ['boundary confusion', 'emotional manipulation', 'gaslighting'] : ['psychic bond', 'emotional attunement', 'compassion']
        };
    }

    // Pluto aspects
    if (outer === 'Pluto' && personal === 'Venus') {
        return {
            text: isHard
                ? `${outerOwner}'s Pluto ${aspect}s ${personalOwner}'s Venus — obsessive, all-consuming attraction with power struggles. ${outerOwner} may try to control or possess ${personalOwner}'s love. Jealousy and possessiveness are themes. Transformative if navigated consciously.`
                : isSoft
                    ? `${outerOwner}'s Pluto ${aspect}s ${personalOwner}'s Venus — deep, transformative love that heals old wounds. Both experience profound emotional and sexual bonding. Love is regenerative and empowering.`
                    : `${outerOwner}'s Pluto conjunct ${personalOwner}'s Venus — the most intense romantic aspect in synastry. Magnetic, irresistible attraction that transforms both people forever. Power dynamics must be consciously managed.`,
            keywords: isHard ? ['obsession', 'possessiveness', 'power struggle'] : ['transformative love', 'deep bonding', 'regeneration']
        };
    }
    if (outer === 'Pluto' && personal === 'Mars') {
        return {
            text: isHard
                ? `${outerOwner}'s Pluto ${aspect}s ${personalOwner}'s Mars — explosive power dynamic. Both trigger each other's survival instincts. Can manifest as competitive, aggressive, or sexually intense energy. Requires conscious de-escalation strategies.`
                : `${outerOwner}'s Pluto ${aspect}s ${personalOwner}'s Mars — powerfully transformative drive. Both push each other to achieve extraordinary things. Intense sexual chemistry and shared ambition can move mountains together.`,
            keywords: isHard ? ['power dynamic', 'aggression', 'survival triggers'] : ['transformative power', 'intense chemistry', 'shared ambition']
        };
    }
    if (outer === 'Pluto' && personal === 'Moon') {
        return {
            text: isHard
                ? `${outerOwner}'s Pluto ${aspect}s ${personalOwner}'s Moon — emotionally overwhelming connection. ${outerOwner} has deep influence over ${personalOwner}'s emotional security. Can feel manipulative or controlling at the emotional level. Deep healing possible if both are self-aware.`
                : `${outerOwner}'s Pluto ${aspect}s ${personalOwner}'s Moon — profoundly deep emotional bond. ${outerOwner} helps ${personalOwner} transform emotional patterns at the root level. An unforgettable connection that changes inner landscape.`,
            keywords: isHard ? ['emotional overwhelm', 'control', 'manipulation'] : ['emotional transformation', 'deep healing', 'profound bond']
        };
    }

    // For Sun and Mercury, provide lighter interpretations
    if (personal === 'Sun' || personal === 'Mercury') {
        const planetLabel = outer === 'Uranus' ? 'innovation' : outer === 'Neptune' ? 'imagination' : 'transformation';
        return {
            text: isHard
                ? `${outerOwner}'s ${outer} ${aspect}s ${personalOwner}'s ${personal} — ${outerOwner} challenges ${personalOwner}'s ${personal === 'Sun' ? 'identity and ego' : 'thinking and communication'} through ${planetLabel}. This creates growth through tension.`
                : `${outerOwner}'s ${outer} ${aspect}s ${personalOwner}'s ${personal} — ${outerOwner} enriches ${personalOwner}'s ${personal === 'Sun' ? 'self-expression' : 'intellectual world'} with ${planetLabel}. A stimulating and expansive connection.`,
            keywords: isHard ? ['growth through tension', planetLabel] : ['expansion', 'stimulation', planetLabel]
        };
    }

    return null;
}

// ============================================================================
// 2. ATTACHMENT THEORY ANALYSIS
// ============================================================================

function analyzeAttachmentPatterns(chartA: Chart, chartB: Chart, nameA: string, nameB: string): {
    patterns: AttachmentPattern[];
    styleA: string;
    styleB: string;
    compatNote: string;
} {
    const patterns: AttachmentPattern[] = [];

    // ---- Partner A's attachment style ----
    const moonA = getPos(chartA, 'Moon');
    const venusA = getPos(chartA, 'Venus');
    const saturnA = getPos(chartA, 'Saturn');

    // ---- Partner B's attachment style ----
    const moonB = getPos(chartB, 'Moon');
    const venusB = getPos(chartB, 'Venus');
    const saturnB = getPos(chartB, 'Saturn');

    // Anxious Attachment indicators
    const checkAnxious = (moon: ReturnType<typeof getPos>, venus: ReturnType<typeof getPos>, saturn: ReturnType<typeof getPos>, chart: Chart, name: string, partner: 'A' | 'B') => {
        const indicators: string[] = [];
        if (moon && [4, 8, 12].includes(moon.house)) indicators.push(`Moon in ${moon.house}th house (deep emotional needs)`);
        if (moon && venus) {
            const asp = findAspect(moon.longitude, venus.longitude);
            if (asp && (asp.type === 'conjunction' || asp.type === 'opposition')) {
                indicators.push(`Moon-Venus ${asp.type} (intense need for love/approval)`);
            }
        }
        if (moon && saturn) {
            const asp = findAspect(moon.longitude, saturn.longitude);
            if (asp && (asp.type === 'square' || asp.type === 'opposition' || asp.type === 'conjunction')) {
                indicators.push(`Moon-Saturn ${asp.type} (fear of abandonment)`);
            }
        }
        // Rahu-Moon (obsessive emotional needs)
        const rahu = getPos(chart, 'Rahu');
        if (rahu && moon) {
            const asp = findAspect(rahu.longitude, moon.longitude, 10);
            if (asp && asp.type === 'conjunction') {
                indicators.push('Moon-Rahu conjunction (obsessive emotional attachment)');
            }
        }

        if (indicators.length >= 2) {
            patterns.push({
                name: `Anxious Attachment — ${name}`,
                style: 'anxious',
                present: true,
                strength: indicators.length >= 3 ? 'strong' : 'moderate',
                description: `${name} shows anxious attachment patterns: a deep need for reassurance, fear of abandonment, and emotional hypervigilance in relationships.`,
                indicators,
                partner
            });
        }
    };

    // Avoidant Attachment indicators
    const checkAvoidant = (moon: ReturnType<typeof getPos>, venus: ReturnType<typeof getPos>, saturn: ReturnType<typeof getPos>, chart: Chart, name: string, partner: 'A' | 'B') => {
        const indicators: string[] = [];
        if (saturn && [1, 7].includes(saturn.house)) indicators.push(`Saturn in ${saturn.house}st/7th (walls around intimacy)`);
        if (moon && moon.dignity === 'debilitated') indicators.push('Debilitated Moon (emotional shutdown)');
        if (venus && saturn) {
            const asp = findAspect(venus.longitude, saturn.longitude);
            if (asp && (asp.type === 'conjunction' || asp.type === 'square')) {
                indicators.push(`Venus-Saturn ${asp.type} (love feels burdensome/restricted)`);
            }
        }
        // Ketu on Moon (detachment)
        const ketu = getPos(chart, 'Ketu');
        if (ketu && moon) {
            const asp = findAspect(ketu.longitude, moon.longitude, 10);
            if (asp && asp.type === 'conjunction') {
                indicators.push('Moon-Ketu conjunction (emotional detachment/karmic withdrawal)');
            }
        }

        if (indicators.length >= 2) {
            patterns.push({
                name: `Avoidant Attachment — ${name}`,
                style: 'avoidant',
                present: true,
                strength: indicators.length >= 3 ? 'strong' : 'moderate',
                description: `${name} shows avoidant attachment patterns: difficulty with emotional vulnerability, tendency to withdraw under stress, and preference for independence over intimacy.`,
                indicators,
                partner
            });
        }
    };

    checkAnxious(moonA, venusA, saturnA, chartA, nameA, 'A');
    checkAvoidant(moonA, venusA, saturnA, chartA, nameA, 'A');
    checkAnxious(moonB, venusB, saturnB, chartB, nameB, 'B');
    checkAvoidant(moonB, venusB, saturnB, chartB, nameB, 'B');

    // Cross-chart attachment dynamics (anxious-avoidant trap)
    const aIsAnxious = patterns.some(p => p.partner === 'A' && p.style === 'anxious');
    const bIsAnxious = patterns.some(p => p.partner === 'B' && p.style === 'anxious');
    const aIsAvoidant = patterns.some(p => p.partner === 'A' && p.style === 'avoidant');
    const bIsAvoidant = patterns.some(p => p.partner === 'B' && p.style === 'avoidant');

    if ((aIsAnxious && bIsAvoidant) || (bIsAnxious && aIsAvoidant)) {
        const anxiousName = aIsAnxious ? nameA : nameB;
        const avoidantName = aIsAvoidant ? nameA : nameB;
        patterns.push({
            name: 'Anxious-Avoidant Trap',
            style: 'disorganized',
            present: true,
            strength: 'strong',
            description: `${anxiousName} (anxious) pursues while ${avoidantName} (avoidant) withdraws, creating a painful push-pull cycle. This is the most common and destructive relationship pattern. Awareness is the first step to breaking the cycle.`,
            indicators: [
                `${anxiousName} seeks constant reassurance`,
                `${avoidantName} needs space when pressured`,
                'Pursuit-withdrawal cycle intensifies over time',
                'Both partners\' core wounds are activated'
            ],
            partner: 'both'
        });
    }

    // Secure attachment indicators
    const checkSecure = (moon: ReturnType<typeof getPos>, venus: ReturnType<typeof getPos>, jupiter: ReturnType<typeof getPos>, name: string, partner: 'A' | 'B') => {
        const indicators: string[] = [];
        if (moon && ['exalted', 'own_house', 'moolatrikona'].includes(moon.dignity)) indicators.push(`Strong Moon in ${moon.sign} (emotional stability)`);
        if (venus && ['exalted', 'own_house', 'moolatrikona'].includes(venus.dignity)) indicators.push(`Strong Venus in ${venus.sign} (healthy love expression)`);
        if (jupiter && [1, 5, 7, 9].includes(jupiter.house)) indicators.push(`Jupiter in ${jupiter.house}th house (trust and optimism)`);
        if (moon && !([6, 8, 12].includes(moon.house))) indicators.push('Moon in supportive house (emotional accessibility)');

        if (indicators.length >= 2 && !patterns.some(p => p.partner === partner && (p.style === 'anxious' || p.style === 'avoidant'))) {
            patterns.push({
                name: `Secure Attachment — ${name}`,
                style: 'secure',
                present: true,
                strength: indicators.length >= 3 ? 'strong' : 'moderate',
                description: `${name} shows secure attachment patterns: comfortable with intimacy, able to communicate needs, and trusting in relationships.`,
                indicators,
                partner
            });
        }
    };

    const jupiterA = getPos(chartA, 'Jupiter');
    const jupiterB = getPos(chartB, 'Jupiter');
    checkSecure(moonA, venusA, jupiterA, nameA, 'A');
    checkSecure(moonB, venusB, jupiterB, nameB, 'B');

    // Determine overall styles
    const getStyle = (partner: 'A' | 'B'): string => {
        const partnerPatterns = patterns.filter(p => p.partner === partner);
        if (partnerPatterns.find(p => p.style === 'secure')) return 'Secure';
        if (partnerPatterns.find(p => p.style === 'anxious') && partnerPatterns.find(p => p.style === 'avoidant')) return 'Disorganized (Fearful)';
        if (partnerPatterns.find(p => p.style === 'anxious')) return 'Anxious-Preoccupied';
        if (partnerPatterns.find(p => p.style === 'avoidant')) return 'Avoidant-Dismissive';
        return 'Secure (Default)';
    };

    const styleA = getStyle('A');
    const styleB = getStyle('B');

    // Compatibility note
    let compatNote = '';
    if (styleA.includes('Secure') && styleB.includes('Secure')) {
        compatNote = 'Both partners show secure attachment — this is the ideal foundation for a healthy, lasting relationship with mutual trust and emotional availability.';
    } else if ((styleA.includes('Anxious') && styleB.includes('Avoidant')) || (styleB.includes('Anxious') && styleA.includes('Avoidant'))) {
        compatNote = 'Anxious-avoidant pairing creates intense but unstable dynamics. Couples therapy focusing on attachment awareness can transform this pattern into earned security.';
    } else if (styleA.includes('Secure') || styleB.includes('Secure')) {
        compatNote = 'One partner\'s secure attachment acts as a stabilizing anchor. The secure partner can help the other develop earned security over time through consistent warmth and reliability.';
    } else {
        compatNote = 'Both partners show insecure attachment patterns. Building relationship security requires conscious effort: therapy, honest communication, and patience with each other\'s triggers.';
    }

    return { patterns, styleA, styleB, compatNote };
}

// ============================================================================
// 3. SHADOW ANALYSIS (12th House + Pluto Dynamics)
// ============================================================================

function analyzeShadowDynamics(chartA: Chart, chartB: Chart, nameA: string, nameB: string): ShadowDynamic[] {
    const dynamics: ShadowDynamic[] = [];

    // 12th house planet overlays (where one person's planets fall in the other's 12th house)
    const planetsToCheck: Planet[] = ['Sun', 'Moon', 'Venus', 'Mars'];

    for (const planet of planetsToCheck) {
        const posA = getPos(chartA, planet);
        const posB = getPos(chartB, planet);

        // A's planet in B's 12th house zone (approximate using house cusps)
        if (posA && posA.house === 12) {
            dynamics.push({
                name: `${nameA}'s ${planet} in 12th House`,
                present: true,
                intensity: planet === 'Moon' || planet === 'Venus' ? 'high' : 'moderate',
                description: `${nameA}'s ${planet} operates from the 12th house — the realm of the unconscious, hidden patterns, and karmic memory. This creates a deep, often unspoken undercurrent in ${nameA}'s ${planet === 'Moon' ? 'emotional' : planet === 'Venus' ? 'love' : planet === 'Mars' ? 'desire' : 'identity'} expression that ${nameB} senses but cannot fully articulate.`,
                growthOpportunity: `${nameA} can integrate this shadow by bringing awareness to unconscious ${planet === 'Moon' ? 'emotional needs' : planet === 'Venus' ? 'love patterns' : planet === 'Mars' ? 'anger and desire' : 'ego drives'}. ${nameB} can help by creating safe space for vulnerability.`,
                involvedPlanets: [planet]
            });
        }
        if (posB && posB.house === 12) {
            dynamics.push({
                name: `${nameB}'s ${planet} in 12th House`,
                present: true,
                intensity: planet === 'Moon' || planet === 'Venus' ? 'high' : 'moderate',
                description: `${nameB}'s ${planet} operates from the 12th house — hidden desires, unconscious patterns, and spiritual yearning influence ${nameB}'s ${planet === 'Moon' ? 'emotional' : planet === 'Venus' ? 'love' : planet === 'Mars' ? 'desire' : 'identity'} expression in subtle, often confusing ways for ${nameA}.`,
                growthOpportunity: `${nameB} benefits from journaling, therapy, or spiritual practice to surface hidden ${planet === 'Moon' ? 'feelings' : planet === 'Venus' ? 'relationship needs' : planet === 'Mars' ? 'frustrations' : 'ambitions'}. ${nameA} can support by not taking withdrawal personally.`,
                involvedPlanets: [planet]
            });
        }
    }

    // Pluto cross-chart shadow activation
    const plutoA = getPos(chartA, 'Pluto' as Planet);
    const plutoB = getPos(chartB, 'Pluto' as Planet);

    // Pluto-Sun cross (power/identity shadow)
    const sunA = getPos(chartA, 'Sun');
    const sunB = getPos(chartB, 'Sun');
    if (plutoA && sunB) {
        const asp = findAspect(plutoA.longitude, sunB.longitude);
        if (asp && (asp.type === 'conjunction' || asp.type === 'square' || asp.type === 'opposition')) {
            dynamics.push({
                name: 'Power Shadow Activation',
                present: true,
                intensity: asp.type === 'conjunction' ? 'high' : 'moderate',
                description: `${nameA}'s Pluto ${asp.type}s ${nameB}'s Sun — ${nameA} activates ${nameB}'s shadow around power, control, and authentic self-expression. ${nameB} may feel simultaneously drawn to and threatened by ${nameA}'s intensity.`,
                growthOpportunity: `This dynamic pushes ${nameB} to reclaim personal power. ${nameA} can support by being transparent about motivations. Both grow through honest confrontation of power dynamics.`,
                involvedPlanets: ['Pluto', 'Sun']
            });
        }
    }
    if (plutoB && sunA) {
        const asp = findAspect(plutoB.longitude, sunA.longitude);
        if (asp && (asp.type === 'conjunction' || asp.type === 'square' || asp.type === 'opposition')) {
            dynamics.push({
                name: 'Power Shadow Activation',
                present: true,
                intensity: asp.type === 'conjunction' ? 'high' : 'moderate',
                description: `${nameB}'s Pluto ${asp.type}s ${nameA}'s Sun — ${nameB} triggers ${nameA}'s deepest identity questions and power struggles. This creates transformative tension that can forge or break the relationship.`,
                growthOpportunity: `${nameA} is pushed to develop authentic self-expression beyond ego. ${nameB} should be mindful of using emotional intensity constructively. Profound mutual evolution is possible.`,
                involvedPlanets: ['Pluto', 'Sun']
            });
        }
    }

    // 8th House emphasis (shared shadow territory)
    const planetsIn8A = chartA.planetaryPositions.filter(p => p.house === 8).map(p => p.planet);
    const planetsIn8B = chartB.planetaryPositions.filter(p => p.house === 8).map(p => p.planet);
    if (planetsIn8A.length >= 2 || planetsIn8B.length >= 2) {
        const heavyPartner = planetsIn8A.length >= planetsIn8B.length ? nameA : nameB;
        const planets = planetsIn8A.length >= planetsIn8B.length ? planetsIn8A : planetsIn8B;
        dynamics.push({
            name: '8th House Shadow Depth',
            present: true,
            intensity: planets.length >= 3 ? 'high' : 'moderate',
            description: `${heavyPartner} has ${planets.length} planets in the 8th house (${planets.join(', ')}), bringing intense themes of transformation, intimacy, and confrontation with mortality into the relationship. This person carries deep psychological material that will surface in intimate bonds.`,
            growthOpportunity: `The 8th house depth is a gift for psychological growth. Both partners benefit from depth-oriented exploration (therapy, shadow work, tantric practices) rather than surface-level relating.`,
            involvedPlanets: planets
        });
    }

    return dynamics;
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export function analyzeModernInsightsEnhanced(chartA: Chart, chartB: Chart, nameA?: string, nameB?: string): ModernInsightsEnhanced {
    const pA = nameA || 'Partner A';
    const pB = nameB || 'Partner B';

    const crossChartAspects = analyzeOuterPlanetAspects(chartA, chartB, pA, pB);
    const { patterns: attachmentPatterns, styleA, styleB, compatNote } = analyzeAttachmentPatterns(chartA, chartB, pA, pB);
    const shadowDynamics = analyzeShadowDynamics(chartA, chartB, pA, pB);

    return {
        crossChartAspects,
        attachmentPatterns,
        shadowDynamics,
        overallAttachmentStyle: {
            partnerA: styleA,
            partnerB: styleB,
            compatibilityNote: compatNote
        }
    };
}
