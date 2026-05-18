import { Chart, Planet, Sign } from '@types';
import { SIGNS } from './coreCalculations.js';
import synastryData from '../knowledge/synastry_details.json';

export interface HouseOverlay {
    planet: Planet;
    house: number;
    description: string;
    direction: 'A_in_B' | 'B_in_A';
}

export interface PlanetaryConjunction {
    planetA: Planet;
    planetB: Planet;
    orb: number;
    description: string;
}

/**
 * Calculate House Overlays: Where Partner A's planets fall in Partner B's chart houses
 */
export function calculateHouseOverlays(chartA: Chart, chartB: Chart): HouseOverlay[] {
    const overlays: HouseOverlay[] = [];
    const planetsToCheck: Planet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    // --- Phase 1: A in B (Chart A planets in Chart B houses) ---
    const ascendantSignB = chartB.ascendant as Sign;
    const ascendantIndexB = SIGNS.indexOf(ascendantSignB);

    chartA.planetaryPositions.forEach(pos => {
        if (planetsToCheck.includes(pos.planet)) {
            const planetSignA = pos.sign as Sign;
            const planetIndexA = SIGNS.indexOf(planetSignA);

            // House = (SignIndex - AscIndex + 12) % 12 + 1
            const houseNumber = ((planetIndexA - ascendantIndexB + 12) % 12) + 1;

            // Get Description from Knowledge Base
            const planetData = (synastryData.house_overlays as any)[pos.planet];
            const description = planetData ? planetData[houseNumber.toString()] :
                `Partner A's ${pos.planet} activates Partner B's ${houseNumber}th House, influencing matters related to that house.`;

            overlays.push({
                planet: pos.planet,
                house: houseNumber,
                description,
                direction: 'A_in_B'
            });
        }
    });

    // --- Phase 2: B in A (Chart B planets in Chart A houses) ---
    const ascendantSignA = chartA.ascendant as Sign;
    const ascendantIndexA = SIGNS.indexOf(ascendantSignA);

    chartB.planetaryPositions.forEach(pos => {
        if (planetsToCheck.includes(pos.planet)) {
            const planetSignB = pos.sign as Sign;
            const planetIndexB = SIGNS.indexOf(planetSignB);

            const houseNumber = ((planetIndexB - ascendantIndexA + 12) % 12) + 1;

            // Use the SAME description templates, but assume "Partner A" now means "Chart B (Planet Owner)"
            // and "Partner B" means "Chart A (House Owner)". 
            // The UI will handle standardizing "Partner A" -> "Planet Owner Name" and "Partner B" -> "House Owner Name".
            const planetData = (synastryData.house_overlays as any)[pos.planet];
            let description = planetData ? planetData[houseNumber.toString()] :
                `Partner A's ${pos.planet} activates Partner B's ${houseNumber}th House, influencing matters related to that house.`;

            // Swap Partner A and Partner B in the description
            description = description
                .replace(/Partner A/g, "TEMP_PARTNER")
                .replace(/Partner B/g, "Partner A")
                .replace(/TEMP_PARTNER/g, "Partner B");

            overlays.push({
                planet: pos.planet,
                house: houseNumber,
                description,
                direction: 'B_in_A'
            });
        }
    });

    return overlays;
}

/**
 * Calculate Planetary Conjunctions: When planets are in the same sign (and close degree)
 */
export function calculatePlanetaryConjunctions(chartA: Chart, chartB: Chart): PlanetaryConjunction[] {
    const conjunctions: PlanetaryConjunction[] = [];
    const MAX_ORB = 10; // degrees

    // Check major planets against each other
    const planetsToCheck: Planet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

    chartA.planetaryPositions.forEach(posA => {
        if (planetsToCheck.includes(posA.planet)) {
            chartB.planetaryPositions.forEach(posB => {
                if (planetsToCheck.includes(posB.planet)) {

                    // Same Sign Check
                    if (posA.sign === posB.sign) {
                        // Orb Check
                        const orb = Math.abs(posA.signDegree - posB.signDegree);
                        if (orb <= MAX_ORB) {

                            // Get Description
                            // Try A-B key, then B-A key
                            const key1 = `${posA.planet}-${posB.planet}`;
                            const key2 = `${posB.planet}-${posA.planet}`;

                            let description = (synastryData.conjunctions as any)[key1] || (synastryData.conjunctions as any)[key2];

                            if (!description) {
                                // Generic fallback if not in JSON
                                description = `${posA.planet} and ${posB.planet} energies merge. This creates a strong bond and mutual understanding in the areas ruled by these planets.`;
                            }

                            conjunctions.push({
                                planetA: posA.planet,
                                planetB: posB.planet,
                                orb,
                                description
                            });
                        }
                    }
                }
            });
        }
    });

    return conjunctions;
}
