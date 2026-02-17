import {
    NAKSHATRAS,
    PLANET_FRIENDSHIP,
    GANA_TYPES,
    NADI_TYPES,
    getSignLord,
    getVashya,
    areFriends,
    SIGNS
} from './coreCalculations';
import { Planet, Sign, Chart, Nakshatra } from '@types';
import poruthamData from '@knowledge/ten_poruthams.json';
import yoniMatrixData from '@knowledge/yoni_matrix.json';

export interface PoruthamParameter {
    id: string;
    name: string;
    pointsObtained: number;
    maxPoints: number;
    result: 'Good' | 'Average' | 'Bad';
    description: string;
}

export interface PoruthamAnalysis {
    parameters: PoruthamParameter[];
    totalScore: number;
    maxScore: number;
    percentage: number;
    verdict: string;
    criticalDoshas: string[];
}

/**
 * Calculate full 11 Porutham matching
 */
export function calculatePorutham(chartA: Chart, chartB: Chart): PoruthamAnalysis {
    const moonA = chartA.planetaryPositions.find(p => p.planet === 'Moon');
    const moonB = chartB.planetaryPositions.find(p => p.planet === 'Moon');

    if (!moonA || !moonB) {
        throw new Error('Moon position not found in one or both charts');
    }

    const nakA = moonA.nakshatra;
    const nakB = moonB.nakshatra;
    const signA = moonA.sign;
    const signB = moonB.sign;

    const parameters: PoruthamParameter[] = [];

    // 1. Dina Porutham
    parameters.push(calcDina(nakA, nakB));

    // 2. Gana Porutham
    parameters.push(calcGana(nakA, nakB));

    // 3. Mahendra Porutham
    parameters.push(calcMahendra(nakA, nakB));

    // 4. Stree Deergha Porutham
    parameters.push(calcStreeDeergha(nakA, nakB));

    // 5. Yoni Porutham
    parameters.push(calcYoni(nakA, nakB));

    // 6. Rashi Porutham
    parameters.push(calcRashi(signA, signB));

    // 7. Rashyadhipati Porutham
    parameters.push(calcRashyadhipati(signA, signB));

    // 8. Vashya Porutham
    parameters.push(calcVashya(signA, signB));

    // 9. Rajju Porutham
    parameters.push(calcRajju(nakA, nakB));

    // 10. Vedha Porutham
    parameters.push(calcVedha(nakA, nakB));

    // 11. Nadi Porutham
    parameters.push(calcNadi(nakA, nakB));

    const totalScore = parameters.reduce((sum, p) => sum + p.pointsObtained, 0);
    const maxScore = parameters.reduce((sum, p) => sum + p.maxPoints, 0);
    const percentage = (totalScore / maxScore) * 100;

    const criticalDoshas: string[] = [];
    if (parameters.find(p => p.id === 'Rajju')?.result === 'Bad') criticalDoshas.push('Rajju Dosha');
    if (parameters.find(p => p.id === 'Vedha')?.result === 'Bad') criticalDoshas.push('Vedha Dosha');
    if (parameters.find(p => p.id === 'Nadi')?.result === 'Bad') criticalDoshas.push('Nadi Dosha');

    let verdict = 'Moderate';
    if (percentage >= 80 && criticalDoshas.length === 0) verdict = 'Excellent';
    else if (percentage >= 60 && criticalDoshas.length === 0) verdict = 'Good';
    else if (criticalDoshas.length > 0) verdict = 'Challenging (Doshas present)';
    else if (percentage < 40) verdict = 'Poor';

    return {
        parameters,
        totalScore,
        maxScore,
        percentage,
        verdict,
        criticalDoshas
    };
}

function calcDina(nakA: Nakshatra, nakB: Nakshatra): PoruthamParameter {
    const indexA = NAKSHATRAS.indexOf(nakA);
    const indexB = NAKSHATRAS.indexOf(nakB);
    const count = ((indexB - indexA + 27) % 27) + 1;
    const rem = count % 9;
    const isGood = [2, 4, 6, 8, 0].includes(rem);
    const points = isGood ? 3 : 0;

    return {
        id: 'Dina',
        name: poruthamData.poruthams.Dina.name,
        pointsObtained: points,
        maxPoints: 3,
        result: isGood ? 'Good' : 'Bad',
        description: isGood ? 'Favorable health and longevity' : 'Potential health disturbances'
    };
}

function calcGana(nakA: Nakshatra, nakB: Nakshatra): PoruthamParameter {
    const getGana = (nak: Nakshatra) => Object.keys(GANA_TYPES).find(g => (GANA_TYPES as any)[g].includes(nak)) || 'Manushya';
    const ganaA = getGana(nakA);
    const ganaB = getGana(nakB);

    const points = (poruthamData.poruthams.Gana.rules as any)[`${ganaA}_${ganaB}`] ?? 0;

    return {
        id: 'Gana',
        name: poruthamData.poruthams.Gana.name,
        pointsObtained: points,
        maxPoints: 4,
        result: points >= 4 ? 'Good' : points >= 2 ? 'Average' : 'Bad',
        description: `Gana match: ${ganaA} (Girl) and ${ganaB} (Boy)`
    };
}

function calcMahendra(nakA: Nakshatra, nakB: Nakshatra): PoruthamParameter {
    const indexA = NAKSHATRAS.indexOf(nakA);
    const indexB = NAKSHATRAS.indexOf(nakB);
    const count = ((indexB - indexA + 27) % 27) + 1;
    const goodCounts = [4, 7, 10, 13, 16, 19, 22, 25];
    const isGood = goodCounts.includes(count);

    return {
        id: 'Mahendra',
        name: poruthamData.poruthams.Mahendra.name,
        pointsObtained: isGood ? 1 : 0,
        maxPoints: 1,
        result: isGood ? 'Good' : 'Bad',
        description: isGood ? 'Stable progeny and wealth' : 'Progeny indicators are average'
    };
}

function calcStreeDeergha(nakA: Nakshatra, nakB: Nakshatra): PoruthamParameter {
    const indexA = NAKSHATRAS.indexOf(nakA);
    const indexB = NAKSHATRAS.indexOf(nakB);
    const count = ((indexB - indexA + 27) % 27) + 1;
    const isGood = count > 13;

    return {
        id: 'Stree_Deergha',
        name: poruthamData.poruthams.Stree_Deergha.name,
        pointsObtained: isGood ? 1 : 0,
        maxPoints: 1,
        result: isGood ? 'Good' : 'Bad',
        description: isGood ? 'Prosperous life for the wife' : 'Requires adjustment in lifestyle'
    };
}

function calcYoni(nakA: Nakshatra, nakB: Nakshatra): PoruthamParameter {
    const yoniA = (yoniMatrixData.nakshatra_to_yoni as any)[nakA];
    const yoniB = (yoniMatrixData.nakshatra_to_yoni as any)[nakB];

    const points = (yoniMatrixData.compatibility_matrix as any)[yoniA]?.[yoniB] ?? 0;

    return {
        id: 'Yoni',
        name: poruthamData.poruthams.Yoni.name,
        pointsObtained: points,
        maxPoints: 4,
        result: points >= 3 ? 'Good' : points >= 2 ? 'Average' : 'Bad',
        description: `Physical compatibility (${yoniA} & ${yoniB}): ${(yoniMatrixData.scoring_interpretation as any)[points]}`
    };
}

function calcRashi(signA: string, signB: string): PoruthamParameter {
    const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const indexA = SIGNS.indexOf(signA);
    const indexB = SIGNS.indexOf(signB);
    const dist = ((indexB - indexA + 12) % 12) + 1;

    const badPositions = [2, 12, 6, 8];
    const isGood = !badPositions.includes(dist);

    return {
        id: 'Rashi',
        name: poruthamData.poruthams.Rashi.name,
        pointsObtained: isGood ? 7 : 0,
        maxPoints: 7,
        result: isGood ? 'Good' : 'Bad',
        description: isGood ? 'Harmonious family growth' : 'Potential for family disputes (Rashi Dosha)'
    };
}

function calcRashyadhipati(signA: string, signB: string): PoruthamParameter {
    const lordA = getSignLord(signA as Sign);
    const lordB = getSignLord(signB as Sign);

    const getRelationship = (p1: Planet, p2: Planet) => {
        if (p1 === p2) return 'Friend';
        const rel = PLANET_FRIENDSHIP[p1];
        if (rel?.friends.includes(p2)) return 'Friend';
        if (rel?.enemies.includes(p2)) return 'Enemy';
        return 'Neutral';
    };

    const rel1 = getRelationship(lordA, lordB);
    const rel2 = getRelationship(lordB, lordA);

    let points = 0;
    if (rel1 === 'Friend' && rel2 === 'Friend') points = 5;
    else if (rel1 === 'Friend' || rel2 === 'Friend') points = 4;
    else if (rel1 === 'Neutral' && rel2 === 'Neutral') points = 1;

    return {
        id: 'Rashyadhipati',
        name: poruthamData.poruthams.Rashyadhipati.name,
        pointsObtained: points,
        maxPoints: 5,
        result: points >= 4 ? 'Good' : points >= 1 ? 'Average' : 'Bad',
        description: `Planetary friendship between ${lordA} and ${lordB}`
    };
}

function calcVashya(signA: string, signB: string): PoruthamParameter {
    const groupsA = getVashya(signA as Sign);
    const groupsB = getVashya(signB as Sign);

    let points = 0;
    // Basic Vashya logic: Same group or complementary
    if (groupsA.some(g => groupsB.includes(g))) points = 2;
    else if (
        (groupsA.includes('Manava') && groupsB.includes('Chatushpada')) ||
        (groupsA.includes('Chatushpada') && groupsB.includes('Manava'))
    ) points = 1;

    return {
        id: 'Vashya',
        name: poruthamData.poruthams.Vashya.name,
        pointsObtained: points,
        maxPoints: 2,
        result: points >= 2 ? 'Good' : points >= 1 ? 'Average' : 'Bad',
        description: points > 0 ? 'Good mutual attraction' : 'Average attraction'
    };
}

function calcRajju(nakA: Nakshatra, nakB: Nakshatra): PoruthamParameter {
    const getRajju = (nak: Nakshatra) => Object.keys(poruthamData.rajju_groups).find(k => (poruthamData.rajju_groups as any)[k].includes(nak));
    const rajjuA = getRajju(nakA);
    const rajjuB = getRajju(nakB);
    const isGood = rajjuA !== rajjuB;

    return {
        id: 'Rajju',
        name: poruthamData.poruthams.Rajju.name,
        pointsObtained: isGood ? 5 : 0,
        maxPoints: 5,
        result: isGood ? 'Good' : 'Bad',
        description: isGood ? 'Longevity of partners is secured' : 'Rajju Dosha: Same Rajju division (High Risk)'
    };
}

function calcVedha(nakA: Nakshatra, nakB: Nakshatra): PoruthamParameter {
    const isVedha = (poruthamData.vedha_pairs as string[][]).some(pair =>
        (pair[0] === nakA && pair[1] === nakB) || (pair[0] === nakB && pair[1] === nakA)
    );

    return {
        id: 'Vedha',
        name: poruthamData.poruthams.Vedha.name,
        pointsObtained: isVedha ? 0 : 5,
        maxPoints: 5,
        result: isVedha ? 'Bad' : 'Good',
        description: isVedha ? 'Vedha Dosha: Forbidden Nakshatra pair' : 'No hidden obstacles detected'
    };
}

function calcNadi(nakA: Nakshatra, nakB: Nakshatra): PoruthamParameter {
    const getNadi = (nak: Nakshatra) => Object.keys(NADI_TYPES).find(n => (NADI_TYPES as any)[n].includes(nak)) || 'Adi';
    const nadiA = getNadi(nakA);
    const nadiB = getNadi(nakB);
    const isGood = nadiA !== nadiB;

    return {
        id: 'Nadi',
        name: poruthamData.poruthams.Nadi.name,
        pointsObtained: isGood ? 8 : 0,
        maxPoints: 8,
        result: isGood ? 'Good' : 'Bad',
        description: isGood ? 'Healthy physical constitution' : 'Same Nadi: Potential health/progeny issues'
    };
}
