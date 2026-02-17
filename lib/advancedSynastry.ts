import { Chart, HouseOverlay, KPCompatibility, JaiminiCompatibility, Planet, Sign } from '@types';
import synastryDetails from '../knowledge/synastry_details.json';

const SIGNS: Sign[] = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

/**
 * Calculates overlays of Partner A's D1 planets onto Partner B's D9 (Navamsa) chart.
 * This indicates deep, soul-level impacts and marriage compatibility.
 */
export function calculateD9Synastry(chartA: Chart, chartB: Chart): HouseOverlay[] {
    const overlays: HouseOverlay[] = [];

    // --- Phase 1: A in B ---
    if (chartB.vargaCharts.D9) {
        const d9AscB = chartB.vargaCharts.D9.ascendant;
        const d9AscIndexB = SIGNS.indexOf(d9AscB);
        const planetsToCheck: Planet[] = ['Sun', 'Moon', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

        chartA.planetaryPositions.forEach(pos => {
            if (planetsToCheck.includes(pos.planet)) {
                const planetSign = pos.sign;
                const planetIndex = SIGNS.indexOf(planetSign);
                const houseNumber = ((planetIndex - d9AscIndexB + 12) % 12) + 1;

                const planetD9Data = (synastryDetails.d9_overlays as any)[pos.planet];
                const genericD9Data = (synastryDetails.d9_overlays as any).generic;

                const descriptionValue = (planetD9Data && planetD9Data[houseNumber.toString()]) ||
                    (genericD9Data && genericD9Data[houseNumber.toString()]);

                if (descriptionValue) {
                    overlays.push({
                        planet: pos.planet,
                        house: houseNumber,
                        description: descriptionValue
                            .replace("Partner's", "Partner A's")
                            .replace("your Navamsa", "Partner B's Navamsa"),
                        direction: 'A_in_B'
                    });
                }
            }
        });
    }

    // --- Phase 2: B in A ---
    if (chartA.vargaCharts.D9) {
        const d9AscA = chartA.vargaCharts.D9.ascendant;
        const d9AscIndexA = SIGNS.indexOf(d9AscA);
        const planetsToCheck: Planet[] = ['Sun', 'Moon', 'Venus', 'Mars', 'Jupiter', 'Saturn'];

        chartB.planetaryPositions.forEach(pos => {
            if (planetsToCheck.includes(pos.planet)) {
                const planetSign = pos.sign;
                const planetIndex = SIGNS.indexOf(planetSign);
                const houseNumber = ((planetIndex - d9AscIndexA + 12) % 12) + 1;

                const planetD9Data = (synastryDetails.d9_overlays as any)[pos.planet];
                const genericD9Data = (synastryDetails.d9_overlays as any).generic;

                const descriptionValue = (planetD9Data && planetD9Data[houseNumber.toString()]) ||
                    (genericD9Data && genericD9Data[houseNumber.toString()]);

                if (descriptionValue) {
                    overlays.push({
                        planet: pos.planet,
                        house: houseNumber,
                        description: descriptionValue
                            .replace("Partner's", "Partner B's")
                            .replace("your Navamsa", "Partner A's Navamsa"),
                        direction: 'B_in_A'
                    });
                }
            }
        });
    }

    return overlays;
}

/**
 * Calculates KP Astrology compatibility based on Sub-Lord connections.
 */
export function calculateKPSynastry(chartA: Chart, chartB: Chart): KPCompatibility {
    const kpData: KPCompatibility = {
        cslConnection: { hasConnection: false, description: "" },
        rulingPlanetConnection: { score: 0, description: "" },
        significatorHarmony: { score: 0, description: "" }
    };

    // 1. 7th Cusp Sub-Lord Connection
    const cslA_7 = chartA.kp?.cusps?.find(c => c.cuspNumber === 7)?.subLord;
    const cslB_7 = chartB.kp?.cusps?.find(c => c.cuspNumber === 7)?.subLord;

    if (cslA_7 && cslB_7) {
        if (cslA_7 === cslB_7) {
            kpData.cslConnection = {
                hasConnection: true,
                description: synastryDetails.kp_connections.csl_7_connection
            };
        } else {
            kpData.cslConnection = {
                hasConnection: false,
                description: `Partner A and Partner B's 7th Sub-Lords are in a neutral state, indicating a stable but non-specific technical connection.`
            };
        }
    }

    // 2. Ruling Planet Harmony (Simplified)
    const ascSubA = chartA.kp?.cusps?.find(c => c.cuspNumber === 1)?.subLord;
    const ascSubB = chartB.kp?.cusps?.find(c => c.cuspNumber === 1)?.subLord;

    if (ascSubA && ascSubB) {
        const friends = isFriendly(ascSubA, ascSubB);
        kpData.rulingPlanetConnection = {
            score: friends ? 10 : 5,
            description: friends
                ? synastryDetails.kp_connections.csl_1_connection
                : (synastryDetails.kp_connections as any).csl_1_connection_neutral
        };
    }

    return kpData;
}

/**
 * Calculates Jaimini Sutra compatibility based on Darakaraka (Spouse Significator).
 */
export function calculateJaiminiSynastry(chartA: Chart, chartB: Chart): JaiminiCompatibility {
    const jaiminiData: JaiminiCompatibility = {
        darakarakaContact: { type: 'none', description: "" },
        soulLink: { hasLink: false, description: "" }
    };

    const dkA = chartA.specialPoints.darakaraka;
    const dkB = chartB.specialPoints.darakaraka;

    // Find planets in planetaryPositions to get signs
    const planetA = chartA.planetaryPositions.find(p => p.planet === dkA);
    const planetB = chartB.planetaryPositions.find(p => p.planet === dkB);

    if (planetA && planetB) {
        const idxA = SIGNS.indexOf(planetA.sign as Sign);
        const idxB = SIGNS.indexOf(planetB.sign as Sign);

        // Calculate relationship (1/1, 1/7, 1/5, 1/9, etc.)
        const diff = (idxB - idxA + 12) % 12;

        if (diff === 0) {
            jaiminiData.darakarakaContact = {
                type: 'mutual',
                description: synastryDetails.jaimini_aspects.dk_dk_same
            };
        } else if ([4, 8].includes(diff)) {
            jaiminiData.darakarakaContact = {
                type: 'trine',
                description: synastryDetails.jaimini_aspects.dk_dk_trines
            };
        } else if (diff === 6) {
            jaiminiData.darakarakaContact = {
                type: 'opposition',
                description: (synastryDetails.jaimini_aspects as any).dk_dk_opposition
            };
        } else if ([3, 9].includes(diff)) {
            jaiminiData.darakarakaContact = {
                type: 'kendra',
                description: synastryDetails.jaimini_aspects.dk_dk_kendras
            };
        } else if ([1, 11].includes(diff)) {
            jaiminiData.darakarakaContact = {
                type: 'none',
                description: (synastryDetails.jaimini_aspects as any).dk_dk_2_12
            };
        } else if ([5, 7].includes(diff)) {
            jaiminiData.darakarakaContact = {
                type: 'none',
                description: (synastryDetails.jaimini_aspects as any).dk_dk_6_8
            };
        } else if ([2, 10].includes(diff)) {
            jaiminiData.darakarakaContact = {
                type: 'none',
                description: (synastryDetails.jaimini_aspects as any).dk_dk_3_11
            };
        } else {
            jaiminiData.darakarakaContact = {
                type: 'none',
                description: (synastryDetails.jaimini_aspects as any).dk_dk_neutral
            };
        }
    }

    // Check DK-AK Link (Cross connection)
    const akA = chartA.specialPoints.atmakaraka;
    const akB = chartB.specialPoints.atmakaraka;

    if (dkA === akB || dkB === akA) {
        jaiminiData.soulLink = {
            hasLink: true,
            description: synastryDetails.jaimini_aspects.dk_ak_link
        };
    }

    return jaiminiData;
}

// Helper to determine natural friendship (Simplified Vedic compatibility)
function isFriendly(p1: Planet, p2: Planet): boolean {
    const friends: Record<string, Planet[]> = {
        'Sun': ['Moon', 'Mars', 'Jupiter'],
        'Moon': ['Sun', 'Mercury'],
        'Mars': ['Sun', 'Moon', 'Jupiter'],
        'Mercury': ['Sun', 'Venus'],
        'Jupiter': ['Sun', 'Moon', 'Mars'],
        'Venus': ['Mercury', 'Saturn'],
        'Saturn': ['Mercury', 'Venus'],
        'Rahu': ['Venus', 'Saturn'],
        'Ketu': ['Mars', 'Jupiter']
    };

    return friends[p1]?.includes(p2) || friends[p2]?.includes(p1) || p1 === p2;
}
