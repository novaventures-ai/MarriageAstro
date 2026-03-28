/**
 * Yoga & Dosha Calculations
 * Comprehensive detection of marriage-related yogas and doshas
 * Based on Risk_kn.md §1.3, §1.4 and traditional Vedic texts
 */

import { Chart, Planet, Sign, PlanetaryPosition } from '@types';
import { normalizeDegrees, SIGN_LORDS } from './coreCalculations';

// ============================================================================
// TYPES
// ============================================================================

export interface YogaDosha {
    name: string;
    category: 'yoga' | 'dosha';
    type: 'marriage' | 'character' | 'health' | 'karmic';
    auspicious?: boolean;  // ADD THIS
    present: boolean;
    severity: 'mild' | 'moderate' | 'severe';
    description: string;
    effects: string;
    remedies: string[];
    involvedPlanets: string[];
}

export interface YogaDoshaAnalysis {
    yogas: YogaDosha[];
    doshas: YogaDosha[];
    auspiciousYogas: YogaDosha[];  // ADD THIS
    summary: string;
    overallSeverity: 'low' | 'moderate' | 'high';
}

// ============================================================================
// HELPERS
// ============================================================================

function isConjunct(chart: Chart, p1: Planet, p2: Planet, orb = 10): boolean {
    const pos1 = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === p1);
    const pos2 = chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === p2);
    if (!pos1 || !pos2) return false;
    const diff = Math.abs(normalizeDegrees(pos1.longitude - pos2.longitude));
    return Math.min(diff, 360 - diff) < orb;
}

function getPos(chart: Chart, planet: Planet) {
    return chart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === planet);
}

function getHouseLord(ascendant: Sign, houseNum: number): Planet {
    const signs: Sign[] = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const ascIndex = signs.indexOf(ascendant);
    const houseSignIndex = (ascIndex + houseNum - 1) % 12;
    return SIGN_LORDS[signs[houseSignIndex]];
}

// ============================================================================
// YOGA DETECTION
// ============================================================================

function detectManglikDosha(chart: Chart): YogaDosha {
    const mars = getPos(chart, 'Mars');
    const manglikHouses = [1, 2, 4, 7, 8, 12];
    const present = mars ? manglikHouses.includes(mars.house) : false;

    // Cancellation checks
    const cancellations: string[] = [];
    if (mars && present) {
        const jupiter = getPos(chart, 'Jupiter');
        if (jupiter && jupiter.house === 7) cancellations.push('Jupiter in 7th');
        if (mars.sign === 'Aries' || mars.sign === 'Scorpio') cancellations.push('Mars in own sign');
        if (mars.sign === 'Capricorn') cancellations.push('Mars exalted');
        const venus = getPos(chart, 'Venus');
        if (venus && venus.house === 7 && ['Taurus', 'Libra', 'Pisces'].includes(venus.sign)) cancellations.push('Venus strong in 7th');
    }

    const cancelled = cancellations.length > 0;
    const severity = !present ? 'mild' : cancelled ? 'mild' : (mars?.house === 7 || mars?.house === 8) ? 'severe' : 'moderate';

    return {
        name: 'Manglik Dosha (Kuja Dosha)',
        category: 'dosha',
        type: 'marriage',
        present: present && !cancelled,
        severity,
        description: present
            ? cancelled
                ? `Mars in ${mars?.house}th house but dosha is cancelled: ${cancellations.join(', ')}`
                : `Mars in ${mars?.house}th house creates aggressive energy affecting marriage`
            : 'Mars is not in manglik houses — no Kuja Dosha',
        effects: present && !cancelled ? 'Can cause conflicts, delays in marriage, and temperamental clashes with spouse' : 'No negative manglik effects',
        remedies: present && !cancelled ? ['Kumbh Vivah (marriage to a pot)', 'Mangal Shanti Puja', 'Hanuman Chalisa recitation on Tuesdays', 'Wear coral on ring finger'] : [],
        involvedPlanets: ['Mars']
    };
}

function detectNadiDosha(chart: Chart): YogaDosha {
    const moon = getPos(chart, 'Moon');
    // Nadi dosha is cross-chart, we detect the nakshatra-based nadi here
    const nadiMap: Record<string, string> = {
        'Ashwini': 'Vata', 'Ardra': 'Vata', 'Punarvasu': 'Vata', 'Uttara Phalguni': 'Vata', 'Hasta': 'Vata', 'Jyeshta': 'Vata', 'Mula': 'Vata', 'Shatabhisha': 'Vata', 'Purva Bhadrapada': 'Vata',
        'Bharani': 'Pitta', 'Mrigashirsha': 'Pitta', 'Pushya': 'Pitta', 'Purva Phalguni': 'Pitta', 'Chitra': 'Pitta', 'Anuradha': 'Pitta', 'Purva Ashadha': 'Pitta', 'Dhanishta': 'Pitta', 'Uttara Bhadrapada': 'Pitta',
        'Krittika': 'Kapha', 'Rohini': 'Kapha', 'Ashlesha': 'Kapha', 'Magha': 'Kapha', 'Swati': 'Kapha', 'Vishakha': 'Kapha', 'Uttara Ashadha': 'Kapha', 'Shravana': 'Kapha', 'Revati': 'Kapha'
    };

    const nadi = moon ? nadiMap[moon.nakshatra] || 'Unknown' : 'Unknown';

    return {
        name: 'Nadi Analysis',
        category: 'dosha',
        type: 'health',
        present: false, // Cross-chart analysis needed
        severity: 'mild',
        description: `Moon nakshatra ${moon?.nakshatra || 'unknown'} belongs to ${nadi} Nadi. Nadi dosha occurs when both partners share the same nadi.`,
        effects: 'Same nadi can indicate health incompatibility and genetic concerns for offspring',
        remedies: ['Nadi Nivarana Puja', 'Donate gold or grains on auspicious days', 'Mahamrityunjaya Mantra chanting'],
        involvedPlanets: ['Moon']
    };
}

function detectVishKanyaYoga(chart: Chart): YogaDosha {
    const venus = getPos(chart, 'Venus');
    const saturn = getPos(chart, 'Saturn');
    const rahu = getPos(chart, 'Rahu');
    const mars = getPos(chart, 'Mars');

    const venusAfflicted = venus && (
        (isConjunct(chart, 'Venus', 'Saturn') && venus.dignity === 'debilitated') ||
        (isConjunct(chart, 'Venus', 'Rahu') && venus.dignity === 'debilitated') ||
        (isConjunct(chart, 'Venus', 'Mars') && ['enemy', 'debilitated'].includes(venus.dignity))
    );

    return {
        name: 'Vish Kanya Yoga',
        category: 'yoga',
        type: 'character',
        present: !!venusAfflicted,
        severity: venusAfflicted ? 'severe' : 'mild',
        description: venusAfflicted
            ? 'Venus afflicted by malefics in weak dignity — creates toxic/poisonous relationship dynamics'
            : 'Venus is not in Vish Kanya combination',
        effects: venusAfflicted ? 'Can cause disharmony, mistrust, and destructive relationship patterns' : 'No Vish Kanya effects',
        remedies: venusAfflicted ? ['Durga Saptashati recitation', 'Venus shanti puja', 'Donate white items on Fridays', 'Wear diamond or white sapphire after consultation'] : [],
        involvedPlanets: ['Venus', ...(saturn && isConjunct(chart, 'Venus', 'Saturn') ? ['Saturn'] : []), ...(rahu && isConjunct(chart, 'Venus', 'Rahu') ? ['Rahu'] : [])]
    };
}

function detectGuruChandalYoga(chart: Chart): YogaDosha {
    const jupRahu = isConjunct(chart, 'Jupiter', 'Rahu');
    const jupKetu = isConjunct(chart, 'Jupiter', 'Ketu');
    const present = jupRahu || jupKetu;
    const node = jupRahu ? 'Rahu' : 'Ketu';

    return {
        name: 'Guru Chandal Yoga',
        category: 'yoga',
        type: 'character',
        present,
        severity: jupRahu ? 'moderate' : 'mild',
        description: present
            ? `Jupiter conjunct ${node} — weakens moral compass and dharmic values`
            : 'Jupiter is not afflicted by Rahu or Ketu',
        effects: present ? 'May lead to unconventional choices, questioning traditional values, and ethical dilemmas in relationships' : 'No Guru Chandal effects',
        remedies: present ? ['Jupiter shanti puja', 'Visit Guru temple on Thursdays', 'Wear yellow sapphire (Pukhraj)', 'Donate turmeric and yellow items'] : [],
        involvedPlanets: present ? ['Jupiter', node] : ['Jupiter']
    };
}

function detectPunarbhuDosha(chart: Chart): YogaDosha {
    const conjunct = isConjunct(chart, 'Moon', 'Saturn');
    const moon = getPos(chart, 'Moon');
    const saturn = getPos(chart, 'Saturn');

    // Also check mutual aspect (7th from each other)
    const mutualAspect = moon && saturn && Math.abs(moon.house - saturn.house) === 6;
    const present = conjunct || !!mutualAspect;

    return {
        name: 'Punarbhu Dosha',
        category: 'dosha',
        type: 'marriage',
        present,
        severity: conjunct ? 'moderate' : 'mild',
        description: present
            ? conjunct
                ? 'Moon-Saturn conjunction — emotional heaviness and delayed marital happiness'
                : 'Moon-Saturn in mutual aspect — emotional restraint affecting marriage'
            : 'No Moon-Saturn affliction detected',
        effects: present ? 'Associated with remarriage potential, emotional coldness, and delayed satisfaction in marriage' : 'No Punarbhu effects',
        remedies: present ? ['Shani Shanti Puja', 'Chandra Shanti Puja', 'Wear pearl on little finger', 'Fast on Saturdays', 'Donate black sesame seeds'] : [],
        involvedPlanets: ['Moon', 'Saturn']
    };
}

function detectKaalSarpaDosha(chart: Chart): YogaDosha {
    const rahu = getPos(chart, 'Rahu');
    const ketu = getPos(chart, 'Ketu');
    if (!rahu || !ketu) return { name: 'Kaal Sarpa Dosha', category: 'dosha', type: 'karmic', present: false, severity: 'mild', description: 'Rahu/Ketu positions not available', effects: '', remedies: [], involvedPlanets: ['Rahu', 'Ketu'] };

    const rahuLong = rahu.longitude;
    const ketuLong = ketu.longitude;

    // All planets between Rahu and Ketu
    const classicPlanets: Planet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    const allBetween = classicPlanets.every(planet => {
        const pos = getPos(chart, planet);
        if (!pos) return false;
        const pLong = pos.longitude;
        if (rahuLong < ketuLong) {
            return pLong > rahuLong && pLong < ketuLong;
        } else {
            return pLong > rahuLong || pLong < ketuLong;
        }
    });

    // Partial Kaal Sarpa: 5+ planets between Rahu-Ketu
    const countBetween = classicPlanets.filter(planet => {
        const pos = getPos(chart, planet);
        if (!pos) return false;
        const pLong = pos.longitude;
        if (rahuLong < ketuLong) {
            return pLong > rahuLong && pLong < ketuLong;
        } else {
            return pLong > rahuLong || pLong < ketuLong;
        }
    }).length;

    const partial = !allBetween && countBetween >= 5;
    const present = allBetween || partial;

    return {
        name: 'Kaal Sarpa Dosha',
        category: 'dosha',
        type: 'karmic',
        present,
        severity: allBetween ? 'severe' : partial ? 'moderate' : 'mild',
        description: allBetween
            ? 'All 7 planets hemmed between Rahu-Ketu axis — full Kaal Sarpa Dosha'
            : partial
                ? `${countBetween}/7 planets between Rahu-Ketu — partial Kaal Sarpa Dosha`
                : 'Planets are distributed on both sides of Rahu-Ketu — no Kaal Sarpa',
        effects: present ? 'Creates karmic obstacles, sudden reversals, and destined patterns in marriage and life events' : 'No Kaal Sarpa effects',
        remedies: present ? ['Kaal Sarpa Dosha Nivaran Puja at Trimbakeshwar', 'Rahu-Ketu shanti homa', 'Donate black and blue items on Saturdays', 'Nag Panchami puja'] : [],
        involvedPlanets: ['Rahu', 'Ketu']
    };
}

function detectVenusMarsRahuTriad(chart: Chart): YogaDosha {
    const venus = getPos(chart, 'Venus');
    const mars = getPos(chart, 'Mars');
    const rahu = getPos(chart, 'Rahu');

    if (!venus || !mars || !rahu) return { name: 'Venus-Mars-Rahu Triad', category: 'yoga', type: 'character', present: false, severity: 'mild', description: 'Planet positions unavailable', effects: '', remedies: [], involvedPlanets: ['Venus', 'Mars', 'Rahu'] };

    const positions = [venus.longitude, mars.longitude, rahu.longitude].sort((a, b) => a - b);
    const span = Math.min(positions[2] - positions[0], 360 - (positions[2] - positions[0]));
    const present = span < 25;

    return {
        name: 'Venus-Mars-Rahu Triad',
        category: 'yoga',
        type: 'character',
        present,
        severity: present ? 'severe' : 'mild',
        description: present
            ? 'Triple conjunction of desire planets — intense, potentially uncontrollable passion'
            : 'Venus, Mars, and Rahu are spread apart — no triad formation',
        effects: present ? 'High risk of obsessive attractions, forbidden relationships, and extreme sensual nature' : 'No triad effects',
        remedies: present ? ['Venus + Mars + Rahu combined shanti', 'Strict lifestyle discipline', 'Meditation and pranayama daily', 'Donate to women-related charities on Fridays'] : [],
        involvedPlanets: ['Venus', 'Mars', 'Rahu']
    };
}

function detectChanchalManasYoga(chart: Chart): YogaDosha {
    const moonMercConj = isConjunct(chart, 'Moon', 'Mercury');
    const moon = getPos(chart, 'Moon');
    const dualSigns: Sign[] = ['Gemini', 'Virgo', 'Sagittarius', 'Pisces'];
    const inDual = moon ? dualSigns.includes(moon.sign) : false;
    const present = moonMercConj && inDual;

    return {
        name: 'Chanchala Manas Yoga',
        category: 'yoga',
        type: 'character',
        present,
        severity: present ? 'mild' : 'mild',
        description: present
            ? `Moon-Mercury conjunction in ${moon?.sign} (dual sign) — restless, changeable mind`
            : 'Moon-Mercury combination not in dual sign — stable mental patterns',
        effects: present ? 'May seek variety in relationships, difficulty committing, and fluctuating emotional attachments' : 'No Chanchala Manas effects',
        remedies: present ? ['Mercury shanti puja on Wednesdays', 'Wear emerald for mental stability', 'Practice mindfulness meditation'] : [],
        involvedPlanets: ['Moon', 'Mercury']
    };
}

// ============================================================================
// AUSPICIOUS YOGA DETECTION
// ============================================================================

function detectKalatraYoga(chart: Chart): YogaDosha {
    const venus = getPos(chart, 'Venus');
    const jupiter = getPos(chart, 'Jupiter');

    const venusStrong = venus && (['Taurus', 'Libra', 'Pisces'].includes(venus.sign) || ['exalted', 'own'].includes(venus.dignity));
    const venusIn7or9 = venus && [7, 9, 5].includes(venus.house);
    const jupAspectsVenus = venus && jupiter && (
        Math.abs(venus.house - jupiter.house) === 3 ||
        Math.abs(venus.house - jupiter.house) === 4 ||
        Math.abs(venus.house - jupiter.house) === 6 ||
        Math.abs(venus.house - jupiter.house) === 7
    );

    const present = !!(venusStrong && venusIn7or9) || !!(venusIn7or9 && jupAspectsVenus);

    return {
        name: 'Kalatra Yoga',
        category: 'yoga',
        type: 'marriage',
        auspicious: true,
        present,
        severity: 'mild',
        description: present
            ? `Venus in ${venus?.house}th house (${venus?.sign}) ${venusStrong ? 'in strong dignity' : 'with Jupiter aspect'} — indicates a virtuous, learned spouse and harmonious marriage`
            : 'Kalatra Yoga not formed in this chart',
        effects: present ? 'Attracts a loyal, educated, and morally upright spouse. Marriage brings social respect and domestic harmony.' : '',
        remedies: [],
        involvedPlanets: present && jupAspectsVenus ? ['Venus', 'Jupiter'] : ['Venus']
    };
}

function detectDharmaKarmadhipatiYoga(chart: Chart): YogaDosha {
    if (!chart.ascendant) return { name: 'Dharma-Karmadhipati Yoga', category: 'yoga', type: 'karmic', auspicious: true, present: false, severity: 'mild', description: 'Ascendant not available', effects: '', remedies: [], involvedPlanets: [] };

    const lord9 = getHouseLord(chart.ascendant, 9);
    const lord10 = getHouseLord(chart.ascendant, 10);
    const pos9 = getPos(chart, lord9);
    const pos10 = getPos(chart, lord10);

    // Parivartana (exchange) or conjunction
    const exchange = pos9 && pos10 && (
        (pos9.house === 10 && pos10.house === 9) ||
        Math.abs(pos9.house - pos10.house) <= 1
    );

    // Also: Jupiter in 9th or 10th in good dignity
    const jupiter = getPos(chart, 'Jupiter');
    const jupInDharma = jupiter && [9, 10, 5].includes(jupiter.house) && ['exalted', 'own', 'friendly'].includes(jupiter.dignity);

    const present = !!exchange || !!jupInDharma;

    return {
        name: 'Dharma-Karmadhipati Yoga',
        category: 'yoga',
        type: 'karmic',
        auspicious: true,
        present,
        severity: present ? 'moderate' : 'mild',
        description: present
            ? exchange
                ? `9th and 10th house lords in mutual exchange — powerful yoga for dharmic purpose and career-spirituality alignment`
                : `Jupiter in ${jupiter?.house}th house in ${jupiter?.dignity} dignity — strong dharmic foundation supporting marriage`
            : 'Dharma-Karmadhipati Yoga not present in this chart',
        effects: present ? 'Marriage accelerates both partners\' spiritual and professional growth simultaneously. Strong alignment of life purpose.' : '',
        remedies: [],
        involvedPlanets: exchange ? [lord9, lord10] : ['Jupiter']
    };
}

function detectGauriYoga(chart: Chart): YogaDosha {
    const moon = getPos(chart, 'Moon');
    const jupiter = getPos(chart, 'Jupiter');

    const moonStrong = moon && (['Cancer', 'Taurus'].includes(moon.sign) || ['exalted', 'own'].includes(moon.dignity));
    const jupAspectsMoon = moon && jupiter && (
        Math.abs(moon.house - jupiter.house) === 4 ||
        Math.abs(moon.house - jupiter.house) === 6 ||
        Math.abs(moon.house - jupiter.house) === 7 ||
        Math.abs(moon.house - jupiter.house) === 0
    );

    const present = !!(moonStrong && jupAspectsMoon);

    return {
        name: 'Gauri Yoga',
        category: 'yoga',
        type: 'marriage',
        auspicious: true,
        present,
        severity: 'mild',
        description: present
            ? `Moon in ${moon?.sign} (${moon?.dignity}) with Jupiter aspect — exceptional emotional intelligence and nurturing capacity`
            : 'Gauri Yoga not formed in this chart',
        effects: present ? 'Strong emotional stability, compassionate nature, and ability to create deep marital harmony. Spouse benefits from native\'s emotional wisdom.' : '',
        remedies: [],
        involvedPlanets: ['Moon', 'Jupiter']
    };
}

// ============================================================================
// MAIN ANALYSIS
// ============================================================================

export function analyzeYogaDoshas(chart: Chart): YogaDoshaAnalysis {
    const results = [
        detectManglikDosha(chart),
        detectNadiDosha(chart),
        detectVishKanyaYoga(chart),
        detectGuruChandalYoga(chart),
        detectPunarbhuDosha(chart),
        detectKaalSarpaDosha(chart),
        detectVenusMarsRahuTriad(chart),
        detectChanchalManasYoga(chart)
    ];

    const auspiciousResults = [
        detectKalatraYoga(chart),
        detectDharmaKarmadhipatiYoga(chart),
        detectGauriYoga(chart),
    ];

    const yogas = results.filter(r => r.category === 'yoga');
    const doshas = results.filter(r => r.category === 'dosha');
    const auspiciousYogas = auspiciousResults;

    const presentItems = results.filter(r => r.present);
    const presentAuspicious = auspiciousResults.filter(r => r.present);
    const severeCount = presentItems.filter(r => r.severity === 'severe').length;
    const moderateCount = presentItems.filter(r => r.severity === 'moderate').length;

    const overallSeverity: 'low' | 'moderate' | 'high' =
        severeCount >= 2 ? 'high' :
            severeCount >= 1 || moderateCount >= 2 ? 'moderate' : 'low';

    const summary = presentAuspicious.length > 0 && presentItems.length === 0
        ? `${presentAuspicious.length} auspicious yoga(s) detected — highly favourable for marriage`
        : presentItems.length === 0
            ? 'No significant yogas or doshas detected — favorable for marriage'
            : `${presentItems.length} yoga/dosha pattern(s) detected: ${presentItems.map(p => p.name).join(', ')}`;

    return { yogas, doshas, auspiciousYogas, summary, overallSeverity };
}
