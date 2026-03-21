/**
 * Multi-Partner Comparison Scoring Engine (Complete)
 * 
 * Extracts a 6-category score from a CompatibilityReport for ranking partners.
 * Coverage: ALL 13 widgets + ALL extended analyses + executiveSummary.
 * 
 * Field paths verified against:
 *   - types/index.ts (CompatibilityReport, SynastryData, etc.)
 *   - types/extendedTypes.ts (KPAnalysis, CharaKarakas, etc.)
 */

import { CompatibilityReport, Chart, Planet } from '@types';

// ============================================================================
// TYPES
// ============================================================================

export interface CategoryScore {
    traditional: number;   // 0-100
    relationship: number;  // 0-100
    risk: number;          // 0-100 (higher = lower risk = better)
    intimacy: number;      // 0-100
    advanced: number;      // 0-100
    timing: number;        // 0-100
}

export type ComparisonLabel = 'Excellent' | 'Strong' | 'Moderate' | 'Needs Attention' | 'Challenging';

export interface ComparisonScore {
    overall: number;                 // weighted total 0-100
    categories: CategoryScore;
    label: ComparisonLabel;
    strengths: string[];             // top 2 categories
    weaknesses: string[];            // bottom 2 categories
}

export interface PartnerComparisonEntry {
    id: string;
    name: string;
    birthData: {
        dateOfBirth: string;
        timeOfBirth: string;
        location: string;
        gender: string;
    };
    reportId: string | null;
    score: ComparisonScore | null;
    status: 'pending' | 'analyzing' | 'complete' | 'failed';
    error?: string;
    createdAt: string;
}

export interface ComparisonProfile {
    id: string;
    profileName: string;
    profileBirthData: {
        name: string;
        dateOfBirth: string;
        timeOfBirth: string;
        location: string;
        latitude: number;
        longitude: number;
        timezone: string;
        gender: string;
    };
    partners: PartnerComparisonEntry[];
    createdAt: string;
}

// ============================================================================
// WEIGHTS — adjusted from audit feedback
// ============================================================================

const CATEGORY_WEIGHTS = {
    traditional: 0.30,   // Ashtakoot + Navamsa + Porutham
    relationship: 0.25,  // Synastry + In-laws + Spouse prediction
    risk: 0.20,          // Divorce + Infidelity + Manglik + Modern challenges
    intimacy: 0.12,      // Sexual compatibility + Sexual health + Extended
    advanced: 0.08,      // KP + Jaimini + Chara + Upapada + Vivah Saham + Divisional
    timing: 0.05,        // Timing + Chara Dasha
} as const;

// ============================================================================
// CATEGORY SCORING FUNCTIONS
// ============================================================================

/**
 * TRADITIONAL (30%): Ashtakoot, Navamsa, Porutham
 * Widgets: AshtakootWidget, PoruthamWidget, OverviewWidget
 */
function scoreTraditional(report: CompatibilityReport): number {
    const scores: number[] = [];

    // ── Ashtakoot: totalScore / maxScore → 0-100
    if (report.ashtakoot?.totalScore != null) {
        const maxScore = report.ashtakoot.maxScore || 36;
        scores.push((report.ashtakoot.totalScore / maxScore) * 100);
    }

    // ── Navamsa matching score
    if (report.navamsaMatching?.score != null) {
        scores.push(clamp(report.navamsaMatching.score, 0, 100));
    }

    // ── Porutham (Tamil compatibility system)
    if (report.poruthamAnalysis) {
        const porutham = report.poruthamAnalysis as { totalScore?: number; maxScore?: number };
        if (porutham.totalScore != null && porutham.maxScore) {
            scores.push((porutham.totalScore / porutham.maxScore) * 100);
        }
    }

    // ── Executive summary traffic light as a modifier
    if (report.executiveSummary?.trafficLightStatus) {
        switch (report.executiveSummary.trafficLightStatus) {
            case 'green': scores.push(85); break;
            case 'yellow': scores.push(55); break;
            case 'red': scores.push(25); break;
        }
    }

    return scores.length > 0 ? average(scores) : 50;
}

/**
 * RELATIONSHIP (25%): Synastry connections, in-law analysis, spouse prediction
 * Widgets: SynastryWidget, SpousePredictionWidget
 */
function scoreRelationship(report: CompatibilityReport): number {
    let score = 50; // baseline
    let dataPoints = 0;
    const hasSynastryData = report.synastry != null;

    // ── Soulmate connections (harmonious aspects)
    const soulmate = report.synastry?.soulmateConnections || [];
    if (soulmate.length > 0) {
        score += Math.min(soulmate.length * 7, 25);
        dataPoints++;
    } else if (hasSynastryData) {
        score -= 5; // No soulmate connections despite having synastry data
    }

    // ── Karmic bonds
    const karmic = report.synastry?.karmicBonds || [];
    if (karmic.length > 0) {
        score += Math.min(karmic.length * 4, 12);
        dataPoints++;
    } else if (hasSynastryData) {
        score -= 3; // No karmic bonds despite having synastry data
    }

    // ── House overlays (planet-in-house synastry)
    const overlays = report.synastry?.houseOverlays || [];
    if (overlays.length > 0) {
        score += Math.min(overlays.length * 1.5, 8);
        dataPoints++;
    } else if (hasSynastryData) {
        score -= 3; // No house overlays despite having synastry data
    }

    // ── D9 Navamsa overlays
    const d9Overlays = report.synastry?.d9Overlays || [];
    if (d9Overlays.length > 0) {
        score += Math.min(d9Overlays.length * 2, 8);
        dataPoints++;
    }

    // ── Planetary conjunctions
    const conjunctions = report.synastry?.planetaryConjunctions || [];
    if (conjunctions.length > 0) {
        score += Math.min(conjunctions.length * 2, 8);
        dataPoints++;
    }

    // ── In-law analysis (person A's perspective)
    if (report.inLawAnalysis) {
        const inLawAvg = (
            (report.inLawAnalysis.secondHouseScore || 0) +
            (report.inLawAnalysis.tenthHouseScore || 0)
        ) / 2;
        score += clamp(inLawAvg * 2, -10, 12);
        dataPoints++;
    }

    // ── Partner in-law analysis (person B's perspective)
    if (report.partnerInLawAnalysis) {
        const partnerInLawAvg = (
            (report.partnerInLawAnalysis.secondHouseScore || 0) +
            (report.partnerInLawAnalysis.tenthHouseScore || 0)
        ) / 2;
        score += clamp(partnerInLawAvg, -5, 8);
        dataPoints++;
    }

    // ── Spouse prediction — how well the partner matches the predicted spouse
    if (report.spousePrediction?.seventhHouse) {
        const spTraits = report.spousePrediction.seventhHouse.spouseTraits || [];
        // More traits identified = more detailed analysis = neutral-positive
        score += Math.min(spTraits.length * 1, 5);
        dataPoints++;
    }

    // ── Partner's spouse prediction
    if (report.partnerSpousePrediction?.seventhHouse) {
        const pspTraits = report.partnerSpousePrediction.seventhHouse.spouseTraits || [];
        score += Math.min(pspTraits.length * 1, 5);
        dataPoints++;
    }

    // If we have many data points, the score may have been inflated — normalize
    if (dataPoints > 5) {
        score = 50 + (score - 50) * 0.85; // dampen extremes
    }

    return clamp(score, 0, 100);
}

/**
 * RISK (20%): Divorce probability, infidelity risk, manglik, modern challenges
 * Widgets: RiskRadarWidget
 * Higher score = LOWER risk = BETTER
 */
function scoreRisk(report: CompatibilityReport): number {
    let score = 70; // neutral baseline

    // ── Divorce probability
    if (report.riskAssessment?.divorceProbability) {
        score -= report.riskAssessment.divorceProbability.score * 0.5;
    }

    // ── Infidelity risk
    if (report.riskAssessment?.infidelityRisk) {
        score -= report.riskAssessment.infidelityRisk.score * 0.3;
    }

    // ── Multiple marriage indicators
    const multipleMarriage = report.riskAssessment?.multipleMarriageIndicators || [];
    score -= multipleMarriage.length * 3;

    // ── Manglik analysis
    if (report.riskAssessment?.manglikAnalysis) {
        const manglik = report.riskAssessment.manglikAnalysis;
        const bothManglik = manglik.partnerA?.isManglik && manglik.partnerB?.isManglik;
        const oneManglik = manglik.partnerA?.isManglik || manglik.partnerB?.isManglik;
        const cancelled = manglik.partnerA?.isCancelled || manglik.partnerB?.isCancelled;

        if (bothManglik) {
            score += 5; // both manglik cancels out
        } else if (oneManglik && !cancelled) {
            score -= 10; // single manglik without cancellation
        } else if (oneManglik && cancelled) {
            score -= 3; // cancelled — minor concern
        }
    }

    // ── Modern challenges (digital age, career stress, mental health, communication)
    if (report.modernChallenges) {
        const totalChallenges =
            (report.modernChallenges.digitalAge?.length || 0) +
            (report.modernChallenges.careerStress?.length || 0) +
            (report.modernChallenges.mentalHealth?.length || 0) +
            (report.modernChallenges.communicationIssues?.length || 0);
        score -= Math.min(totalChallenges * 1.5, 15);
    }

    // ── Modern planets (Uranus/Neptune/Pluto disruption potential)
    if (report.modernPlanets) {
        let modernPenalty = 0;
        const checkPlanet = (planet: { challenges?: string[] } | undefined) => {
            if (planet?.challenges) {
                modernPenalty += planet.challenges.length * 1;
            }
        };
        checkPlanet(report.modernPlanets.uranus);
        checkPlanet(report.modernPlanets.neptune);
        checkPlanet(report.modernPlanets.pluto);
        score -= Math.min(modernPenalty, 10);
    }

    // ── Upapada Lagna — multiple marriage indication
    if (report.upapadaLagna) {
        const ulA = report.upapadaLagna.partnerA as { multipleMarriageIndication?: boolean } | undefined;
        const ulB = report.upapadaLagna.partnerB as { multipleMarriageIndication?: boolean } | undefined;
        if (ulA?.multipleMarriageIndication) score -= 5;
        if (ulB?.multipleMarriageIndication) score -= 5;
    }

    return clamp(score, 0, 100);
}

/**
 * INTIMACY (12%): Sexual compatibility, sexual health, extended sexual analysis
 * Widgets: SexualCompatibilityWidget, SexualHealthWidget
 */
function scoreIntimacy(report: CompatibilityReport): number {
    const scores: number[] = [];

    // ── Yoni match score
    if (report.sexualCompatibility?.yoniMatch?.score != null) {
        scores.push(clamp(report.sexualCompatibility.yoniMatch.score, 0, 100));
    }

    // ── Nakshatra match score
    if (report.sexualCompatibility?.nakshatraMatch?.score != null) {
        scores.push(clamp(report.sexualCompatibility.nakshatraMatch.score, 0, 100));
    }

    // ── Overall sexual compatibility score
    if (report.sexualCompatibility?.overallScore != null) {
        scores.push(clamp(report.sexualCompatibility.overallScore, 0, 100));
    }

    // ── Sexual chemistry aspects from synastry
    const chemistry = report.synastry?.sexualChemistry || [];
    if (chemistry.length > 0) {
        scores.push(50 + Math.min(chemistry.length * 10, 40));
    }

    // ── Sexual Health: mutual satisfaction score
    if (report.sexualHealth?.mutualSatisfaction?.score != null) {
        scores.push(clamp(report.sexualHealth.mutualSatisfaction.score, 0, 100));
    }

    // ── Sexual Health: libido compatibility
    if (report.sexualHealth?.libidoA && report.sexualHealth?.libidoB) {
        const libidoMap: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
        const libA = libidoMap[report.sexualHealth.libidoA.level] || 2;
        const libB = libidoMap[report.sexualHealth.libidoB.level] || 2;
        const libidoDiff = Math.abs(libA - libB);
        // Matching libido = 85, one step apart = 65, two steps = 40
        const libidoScore = libidoDiff === 0 ? 85 : libidoDiff === 1 ? 65 : 40;
        scores.push(libidoScore);
    }

    // ── Sexual Health: risk factors (PME, ED, frigidity, pain)
    if (report.sexualHealth?.maleHealth || report.sexualHealth?.femaleHealth) {
        let healthScore = 90;
        const riskMap: Record<string, number> = { 'High': 20, 'Medium': 10, 'Low': 2 };

        if (report.sexualHealth.maleHealth) {
            healthScore -= riskMap[report.sexualHealth.maleHealth.pmeRisk] || 0;
            healthScore -= riskMap[report.sexualHealth.maleHealth.edRisk] || 0;
        }
        if (report.sexualHealth.femaleHealth) {
            healthScore -= riskMap[report.sexualHealth.femaleHealth.frigidityRisk] || 0;
            healthScore -= riskMap[report.sexualHealth.femaleHealth.physicalPainRisk] || 0;
        }
        scores.push(clamp(healthScore, 0, 100));
    }

    // ── Extended sexual compatibility (if available)
    if (report.extendedSexualCompatibility) {
        // Extended data mostly adds descriptive detail; use yoni animals for scoring
        const ext = report.extendedSexualCompatibility as { allYoniAnimals?: { score?: number }[] };
        if (ext.allYoniAnimals && ext.allYoniAnimals.length > 0) {
            const avgYoniScore = ext.allYoniAnimals.reduce((sum, y) => sum + (y.score || 0), 0) / ext.allYoniAnimals.length;
            if (avgYoniScore > 0) scores.push(clamp(avgYoniScore, 0, 100));
        }
    }

    return scores.length > 0 ? average(scores) : 50;
}

/**
 * ADVANCED (8%): KP analysis, Jaimini/Chara Karakas, Upapada Lagna,
 *                 Vivah Saham, Divisional charts, Chara Dasha
 * Widgets: KPAnalysisWidget, CharaKarakasWidget, DivisionalChartWidget
 */
function scoreAdvanced(report: CompatibilityReport): number {
    let score = 50; // baseline
    let dataPoints = 0;

    // ── KP Compatibility (inside synastry)
    const kp = report.synastry?.kpCompatibility;
    if (kp) {
        if (kp.cslConnection?.hasConnection) { score += 8; dataPoints++; }
        if (kp.rulingPlanetConnection?.score) {
            score += clamp(kp.rulingPlanetConnection.score * 5, 0, 12);
            dataPoints++;
        }
        if (kp.significatorHarmony?.score) {
            score += clamp(kp.significatorHarmony.score * 5, 0, 12);
            dataPoints++;
        }
    }

    // ── Extended KP Analysis (top-level, per partner)
    if (report.kpAnalysis) {
        const kpA = report.kpAnalysis.partnerA as { seventhCuspSubLord?: { marriagePromise?: string } } | undefined;
        const kpB = report.kpAnalysis.partnerB as { seventhCuspSubLord?: { marriagePromise?: string } } | undefined;

        // Marriage promise from 7th cusp sub lord
        if (kpA?.seventhCuspSubLord?.marriagePromise === 'promised') score += 6;
        if (kpA?.seventhCuspSubLord?.marriagePromise === 'denied') score -= 8;
        if (kpA?.seventhCuspSubLord?.marriagePromise === 'complicated') score -= 3;

        if (kpB?.seventhCuspSubLord?.marriagePromise === 'promised') score += 6;
        if (kpB?.seventhCuspSubLord?.marriagePromise === 'denied') score -= 8;
        if (kpB?.seventhCuspSubLord?.marriagePromise === 'complicated') score -= 3;
        dataPoints++;
    }

    // ── Jaimini Compatibility (inside synastry)
    const jaimini = report.synastry?.jaiminiCompatibility;
    if (jaimini) {
        if (jaimini.soulLink?.hasLink) { score += 8; dataPoints++; }
        switch (jaimini.darakarakaContact?.type) {
            case 'trine': score += 10; break;
            case 'kendra': score += 8; break;
            case 'mutual': score += 6; break;
            case 'opposition': score -= 3; break;
            case 'none': score -= 4; break;
        }
        dataPoints++;
    }

    // ── Chara Karakas (extended, per partner)
    if (report.charaKarakas) {
        const ckA = report.charaKarakas.partnerA as { darakaraka?: { marriageSignificance?: string } } | undefined;
        const ckB = report.charaKarakas.partnerB as { darakaraka?: { marriageSignificance?: string } } | undefined;

        // Darakaraka marriage significance exists = positive
        if (ckA?.darakaraka?.marriageSignificance) score += 4;
        if (ckB?.darakaraka?.marriageSignificance) score += 4;
        dataPoints++;
    }

    // ── Upapada Lagna
    if (report.upapadaLagna) {
        // Having UL analysis itself is informative; bonus for details
        score += 5;
        dataPoints++;
    }

    // NOTE: Vivah Saham scored only in scoreTiming() to avoid double-counting

    // ── Divisional charts (D9 vargottama + pushkar + extended analysis)
    if (report.divisionalAnalysis?.d9) {
        const vargottama = report.divisionalAnalysis.d9.vargottamaPlanets || [];
        score += Math.min(vargottama.length * 2.5, 10);

        const pushkar = report.divisionalAnalysis.d9.pushkarNavamsa || [];
        score += Math.min(pushkar.length * 2, 6);
        dataPoints++;
    }

    // ── Extended divisional analysis
    if (report.divisionalAnalysis?.extended) {
        const ext = report.divisionalAnalysis.extended;
        const extA = ext.partnerA as { bhavottama?: { length: number }; vargaLinkage?: { length: number } } | undefined;
        const extB = ext.partnerB as { bhavottama?: { length: number }; vargaLinkage?: { length: number } } | undefined;

        // Bhavottama (planets in same house in D1 and varga) — stability indicator
        const bhavA = (extA?.bhavottama as unknown as unknown[] | undefined)?.length || 0;
        const bhavB = (extB?.bhavottama as unknown as unknown[] | undefined)?.length || 0;
        score += Math.min((bhavA + bhavB) * 1.5, 6);
        dataPoints++;
    }

    // Dampen if too many tiny bonuses accumulated
    if (dataPoints > 6) {
        score = 50 + (score - 50) * 0.8;
    }

    return clamp(score, 0, 100);
}

/**
 * TIMING (5%): Favorable periods, Vimshottari dasha, Chara Dasha marriage timing
 * Widgets: TimingWidget
 */
function scoreTiming(report: CompatibilityReport): number {
    let score = 50; // baseline

    // ── Favorable periods
    const periods = report.timing?.favorablePeriods || [];
    score += Math.min(periods.length * 7, 20);

    // ── Average confidence of favorable periods
    if (periods.length > 0) {
        const avgConfidence = periods.reduce((sum: number, p: any) => sum + (p.confidence || 0), 0) / periods.length;
        score += avgConfidence * 10; // confidence typically 0-1
    }

    // ── Partner A Vimshottari dasha favourability
    if (report.timing?.partnerA?.favourability) {
        switch (report.timing.partnerA.favourability) {
            case 'positive': score += 8; break;
            case 'neutral': break;
            case 'challenging': score -= 8; break;
        }
    }

    // ── Partner B Vimshottari dasha favourability
    if (report.timing?.partnerB?.favourability) {
        switch (report.timing.partnerB.favourability) {
            case 'positive': score += 8; break;
            case 'neutral': break;
            case 'challenging': score -= 8; break;
        }
    }

    // ── Chara Dasha marriage timing (extended)
    if (report.charaDasha) {
        const cdA = report.charaDasha.partnerA as { marriageTiming?: { favorableSigns?: unknown[] } } | undefined;
        const cdB = report.charaDasha.partnerB as { marriageTiming?: { favorableSigns?: unknown[] } } | undefined;

        // Favorable signs for marriage timing
        const favA = cdA?.marriageTiming?.favorableSigns?.length || 0;
        const favB = cdB?.marriageTiming?.favorableSigns?.length || 0;
        score += Math.min((favA + favB) * 2, 10);
    }

    // ── Vivah Saham activation periods (timing-relevant)
    if (report.vivahSaham) {
        const vsA = report.vivahSaham.partnerA as { activationPeriods?: string[] } | undefined;
        const vsB = report.vivahSaham.partnerB as { activationPeriods?: string[] } | undefined;
        const totalActivations = (vsA?.activationPeriods?.length || 0) + (vsB?.activationPeriods?.length || 0);
        score += Math.min(totalActivations * 2, 8);
    }

    return clamp(score, 0, 100);
}

// ============================================================================
// MAIN SCORING FUNCTION
// ============================================================================

/**
 * Calculate a multi-dimensional comparison score from a CompatibilityReport.
 * 
 * Coverage:
 * ✅ AshtakootWidget      → Traditional (ashtakoot)
 * ✅ PoruthamWidget        → Traditional (poruthamAnalysis)
 * ✅ OverviewWidget        → Traditional (executiveSummary.trafficLightStatus)
 * ✅ SynastryWidget        → Relationship (soulmate, karmic, overlays, conjunctions, d9)
 * ✅ SpousePredictionWidget → Relationship (spousePrediction traits)
 * ✅ RiskRadarWidget       → Risk (divorce, infidelity, manglik, modern)
 * ✅ SexualCompatWidget    → Intimacy (yoni, nakshatra, overall)
 * ✅ SexualHealthWidget    → Intimacy (PME/ED risk, libido, mutual satisfaction)
 * ✅ KPAnalysisWidget      → Advanced (kpCompatibility + extended kpAnalysis)
 * ✅ CharaKarakasWidget    → Advanced (jaimini + charaKarakas)
 * ✅ DivisionalChartWidget → Advanced (D9, vargottama, pushkar, extended)
 * ✅ TimingWidget          → Timing (periods, dasha, charaDasha)
 * ✅ RemediesWidget        → NOT scored (correctly: remedies are suggestions, not metrics)
 * ✅ modernPlanets         → Risk
 * ✅ modernChallenges      → Risk
 * ✅ upapadaLagna          → Advanced + Risk (multiple marriage indication)
 * ✅ vivahSaham            → Timing only (activation periods)
 * ✅ extendedSexual        → Intimacy
 */
export function calculateComparisonScore(report: CompatibilityReport): ComparisonScore {
    const categories: CategoryScore = {
        traditional: Math.round(scoreTraditional(report)),
        relationship: Math.round(scoreRelationship(report)),
        risk: Math.round(scoreRisk(report)),
        intimacy: Math.round(scoreIntimacy(report)),
        advanced: Math.round(scoreAdvanced(report)),
        timing: Math.round(scoreTiming(report)),
    };

    // Weighted overall
    const overall = Math.round(
        categories.traditional * CATEGORY_WEIGHTS.traditional +
        categories.relationship * CATEGORY_WEIGHTS.relationship +
        categories.risk * CATEGORY_WEIGHTS.risk +
        categories.intimacy * CATEGORY_WEIGHTS.intimacy +
        categories.advanced * CATEGORY_WEIGHTS.advanced +
        categories.timing * CATEGORY_WEIGHTS.timing
    );

    const label = getLabel(overall);

    // Sort categories to find strengths and weaknesses
    const categoryLabels: Record<keyof CategoryScore, string> = {
        traditional: 'Traditional Compatibility',
        relationship: 'Relationship Harmony',
        risk: 'Low Risk Profile',
        intimacy: 'Intimacy & Chemistry',
        advanced: 'Advanced Indicators',
        timing: 'Timing Alignment',
    };

    const sorted = (Object.entries(categories) as [keyof CategoryScore, number][])
        .sort((a, b) => b[1] - a[1]);

    const strengths = sorted.slice(0, 2).map(([key, val]) => `${categoryLabels[key]} (${val}%)`);
    const weaknesses = sorted.slice(-2).map(([key, val]) => `${categoryLabels[key]} (${val}%)`);

    return { overall, categories, label, strengths, weaknesses };
}

// ============================================================================
// HELPERS
// ============================================================================

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

function average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function getLabel(score: number): ComparisonLabel {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Strong';
    if (score >= 50) return 'Moderate';
    if (score >= 35) return 'Needs Attention';
    return 'Challenging';
}
