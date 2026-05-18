import {
    CompatibilityReport,
    ConflictZone,
    ConflictTrigger,
    Planet,
    PlanetaryPosition
} from '../src/types/index.js';

/**
 * Calculates relationship Conflict Zones based on comprehensive astrological indicators.
 * Categorizes friction into: People, Things, Ideology, Behavior.
 * Each trigger is attributed to a specific partner's chart using overlay direction and aspect ownership.
 */
export function calculateConflictZones(
    selfChart: any,
    partnerChart: any,
    report: CompatibilityReport
): ConflictZone {
    const people: ConflictTrigger[] = [];
    const things: ConflictTrigger[] = [];
    const ideology: ConflictTrigger[] = [];
    const behavior: ConflictTrigger[] = [];

    // Helper to find planet position
    const getPos = (chart: any, planet: Planet): PlanetaryPosition | undefined =>
        chart.planetaryPositions.find((p: any) => p.planet === planet);

    // Helper: determine source from overlay direction
    // A_in_B means Partner A's planet is in Partner B's house → source is partnerA (A's planet causes the effect)
    // B_in_A means Partner B's planet is in Partner A's house → source is partnerB
    const overlaySource = (direction: 'A_in_B' | 'B_in_A'): 'partnerA' | 'partnerB' =>
        direction === 'A_in_B' ? 'partnerA' : 'partnerB';

    // ===========================================================================
    // 1. ANALYSIS: PEOPLE (In-laws, Family, Social Pressure)
    // ===========================================================================

    // Check Nadi Dosha (Health/Genealogy/Progeny line) — mutual, both nakshatras contribute
    if (report.ashtakoot.doshas.nadiDosha && !report.ashtakoot.exceptions.some(e => e.includes('Nadi'))) {
        people.push({
            title: 'Ancestral/Genetic Friction (Nadi)',
            intensity: 'High',
            description: 'Shared physiological temperaments can lead to health-related stress or progeny-related concerns.',
            technicalBasis: 'Nadi Dosha detected in Ashtakoot Milan.',
            source: 'mutual'
        });
    }

    // Check In-law dynamics (8th house overlays)
    // Each overlay has a direction telling us whose planet falls in whose 8th house
    const inLawOverlays = report.synastry.houseOverlays.filter(o => o.house === 8);
    if (inLawOverlays.length > 0) {
        const maleficIn8 = inLawOverlays.filter(o => ['Mars', 'Saturn', 'Rahu', 'Ketu'].includes(o.planet));
        if (maleficIn8.length > 0) {
            // Group by source partner
            const fromA = maleficIn8.filter(o => o.direction === 'A_in_B');
            const fromB = maleficIn8.filter(o => o.direction === 'B_in_A');

            if (fromA.length > 0) {
                people.push({
                    title: `In-law Boundary Challenges (${report.chartA.name}'s influence)`,
                    intensity: fromA.length > 1 ? 'High' : 'Medium',
                    description: `${report.chartA.name}'s planetary energy in ${report.chartB.name}'s 8th house creates tension with extended family dynamics.`,
                    technicalBasis: `${report.chartA.name}'s ${fromA.map(p => p.planet).join(', ')} in ${report.chartB.name}'s 8th house of privacy/occult bonds.`,
                    source: 'partnerA'
                });
            }
            if (fromB.length > 0) {
                people.push({
                    title: `In-law Boundary Challenges (${report.chartB.name}'s influence)`,
                    intensity: fromB.length > 1 ? 'High' : 'Medium',
                    description: `${report.chartB.name}'s planetary energy in ${report.chartA.name}'s 8th house creates tension with extended family dynamics.`,
                    technicalBasis: `${report.chartB.name}'s ${fromB.map(p => p.planet).join(', ')} in ${report.chartA.name}'s 8th house of privacy/occult bonds.`,
                    source: 'partnerB'
                });
            }
        }
    }

    // ===========================================================================
    // 2. ANALYSIS: THINGS (Money, Assets, Shared Resources)
    // ===========================================================================

    // 2nd house (Wealth) overlays — attribute by direction
    const wealthOverlays = report.synastry.houseOverlays.filter(o => o.house === 2);
    const marsSatInWealth = wealthOverlays.filter(o => o.planet === 'Mars' || o.planet === 'Saturn');
    if (marsSatInWealth.length > 0) {
        const fromA = marsSatInWealth.filter(o => o.direction === 'A_in_B');
        const fromB = marsSatInWealth.filter(o => o.direction === 'B_in_A');

        if (fromA.length > 0) {
            things.push({
                title: `Financial Management Friction (${report.chartA.name})`,
                intensity: 'Medium',
                description: `${report.chartA.name}'s ${fromA.map(p => p.planet).join('/')} energy impacts ${report.chartB.name}'s wealth house, causing differing approaches to money.`,
                technicalBasis: `${report.chartA.name}'s ${fromA.map(p => p.planet).join(', ')} impacting ${report.chartB.name}'s 2nd house of resources.`,
                source: 'partnerA'
            });
        }
        if (fromB.length > 0) {
            things.push({
                title: `Financial Management Friction (${report.chartB.name})`,
                intensity: 'Medium',
                description: `${report.chartB.name}'s ${fromB.map(p => p.planet).join('/')} energy impacts ${report.chartA.name}'s wealth house, causing differing approaches to money.`,
                technicalBasis: `${report.chartB.name}'s ${fromB.map(p => p.planet).join(', ')} impacting ${report.chartA.name}'s 2nd house of resources.`,
                source: 'partnerB'
            });
        }
    }

    // 8th house (Joint Assets) — derived from overall risk, mutual
    if (report.riskAssessment.divorceProbability.score > 60) {
        things.push({
            title: 'Shared Asset Complexity',
            intensity: 'Low',
            description: 'Complex financial entanglements or disputes over joint property could arise during stress.',
            technicalBasis: 'Associated with 8th house vulnerability indicators.',
            source: 'mutual'
        });
    }

    // ===========================================================================
    // 3. ANALYSIS: IDEOLOGY (Beliefs, Values, Life Philosophy)
    // ===========================================================================

    // Gana Match (Temperament/Ideology) — mutual, both nakshatras contribute
    if (report.ashtakoot.parameters.gana.pointsObtained === 0) {
        ideology.push({
            title: 'Fundamental Value Divergence',
            intensity: 'High',
            description: 'A clash between "Deiva" (Divine) and "Rakshasa" (Individuated) temperaments leads to differing life goals.',
            technicalBasis: 'Gana Dosha (0/6 points) indicates deep-seated ideological differences.',
            source: 'mutual'
        });
    }

    // 9th house (Philosophy/Dharma) — attribute by direction
    const ideologyOverlays = report.synastry.houseOverlays.filter(o => o.house === 9);
    const restrictiveIn9 = ideologyOverlays.filter(o => o.planet === 'Saturn' || o.planet === 'Ketu');
    if (restrictiveIn9.length > 0) {
        const fromA = restrictiveIn9.filter(o => o.direction === 'A_in_B');
        const fromB = restrictiveIn9.filter(o => o.direction === 'B_in_A');

        if (fromA.length > 0) {
            ideology.push({
                title: `Belief System Restriction (${report.chartA.name})`,
                intensity: 'Medium',
                description: `${report.chartB.name} may feel restricted by ${report.chartA.name}'s religious, cultural, or moral boundaries.`,
                technicalBasis: `${report.chartA.name}'s ${fromA.map(p => p.planet).join(', ')} impacting ${report.chartB.name}'s 9th house of higher belief.`,
                source: 'partnerA'
            });
        }
        if (fromB.length > 0) {
            ideology.push({
                title: `Belief System Restriction (${report.chartB.name})`,
                intensity: 'Medium',
                description: `${report.chartA.name} may feel restricted by ${report.chartB.name}'s religious, cultural, or moral boundaries.`,
                technicalBasis: `${report.chartB.name}'s ${fromB.map(p => p.planet).join(', ')} impacting ${report.chartA.name}'s 9th house of higher belief.`,
                source: 'partnerB'
            });
        }
    }

    // ===========================================================================
    // 4. ANALYSIS: BEHAVIOR (Communication, Ego, Habits)
    // ===========================================================================

    // Mercury (Communication) Aspects
    // planet1 = Partner A's planet, planet2 = Partner B's planet
    const mercuryAspects = report.synastry.allAspects.filter(a =>
        (a.planet1 === 'Mercury' || a.planet2 === 'Mercury') && a.nature === 'challenging'
    );
    if (mercuryAspects.length > 0) {
        // Determine whose Mercury is involved
        const mercuryFromA = mercuryAspects.filter(a => a.planet1 === 'Mercury');
        const mercuryFromB = mercuryAspects.filter(a => a.planet2 === 'Mercury');

        if (mercuryFromA.length > 0) {
            behavior.push({
                title: `Communication Style Issues (${report.chartA.name})`,
                intensity: 'Medium',
                description: `${report.chartA.name}'s communication style clashes with ${report.chartB.name}'s planetary energy, causing misinterpretation.`,
                technicalBasis: `${report.chartA.name}'s Mercury in challenging aspect with ${report.chartB.name}'s ${mercuryFromA.map(a => a.planet2).join(', ')} (${mercuryFromA.length} aspect(s)).`,
                source: 'partnerA'
            });
        }
        if (mercuryFromB.length > 0) {
            behavior.push({
                title: `Communication Style Issues (${report.chartB.name})`,
                intensity: 'Medium',
                description: `${report.chartB.name}'s communication style clashes with ${report.chartA.name}'s planetary energy, causing misinterpretation.`,
                technicalBasis: `${report.chartB.name}'s Mercury in challenging aspect with ${report.chartA.name}'s ${mercuryFromB.map(a => a.planet1).join(', ')} (${mercuryFromB.length} aspect(s)).`,
                source: 'partnerB'
            });
        }
    }

    // Mars (Anger/Impulse) Aspects
    const marsAspects = report.synastry.allAspects.filter(a =>
        (a.planet1 === 'Mars' || a.planet2 === 'Mars') && a.nature === 'challenging'
    );
    if (marsAspects.length > 0) {
        const marsFromA = marsAspects.filter(a => a.planet1 === 'Mars');
        const marsFromB = marsAspects.filter(a => a.planet2 === 'Mars');

        if (marsFromA.length > 0) {
            behavior.push({
                title: `Reactive Temperament (${report.chartA.name})`,
                intensity: 'High',
                description: `${report.chartA.name}'s Mars energy creates sudden bursts of anger or competitive friction with ${report.chartB.name}.`,
                technicalBasis: `${report.chartA.name}'s Mars in harsh aspect with ${report.chartB.name}'s ${marsFromA.map(a => a.planet2).join(', ')} (${marsFromA.length} aspect(s)).`,
                source: 'partnerA'
            });
        }
        if (marsFromB.length > 0) {
            behavior.push({
                title: `Reactive Temperament (${report.chartB.name})`,
                intensity: 'High',
                description: `${report.chartB.name}'s Mars energy creates sudden bursts of anger or competitive friction with ${report.chartA.name}.`,
                technicalBasis: `${report.chartB.name}'s Mars in harsh aspect with ${report.chartA.name}'s ${marsFromB.map(a => a.planet1).join(', ')} (${marsFromB.length} aspect(s)).`,
                source: 'partnerB'
            });
        }
    }

    // Overall Severity
    const totalTriggers = people.length + things.length + ideology.length + behavior.length;
    let overallSeverity: 'High' | 'Medium' | 'Low' = 'Low';
    if (totalTriggers > 6 || people.some(p => p.intensity === 'High')) overallSeverity = 'High';
    else if (totalTriggers > 3) overallSeverity = 'Medium';

    return {
        people,
        things,
        ideology,
        behavior,
        overallSeverity,
        awarenessNote: generateAwarenessNote(overallSeverity)
    };
}

function generateAwarenessNote(severity: 'High' | 'Medium' | 'Low'): string {
    if (severity === 'High') return 'PROACTIVE REMEDIATION REQUIRED: Multiple high-intensity conflict zones detected. Open dialogue and boundary setting are essential.';
    if (severity === 'Medium') return 'MODERATE ADAPTATION NEEDED: Identified friction points are manageable with conscious awareness and compromise.';
    return 'HARMONIOUS FLOW: Few significant conflict zones detected. Relationship naturally tends toward conflict resolution.';
}
