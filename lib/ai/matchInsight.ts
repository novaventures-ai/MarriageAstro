import { Chart, AshtakootResult, PlanetaryPosition } from '@types';
import { calculateAshtakootMilan } from '../compatibilityCalculations';

export interface MatchInsight {
    partnerId: string;
    partnerName: string;
    score: number; // Normalized and penalized "Holistic Lite" score
    rawScore: number; // The 36 point score
    verdict: string;
    reason: string;
    strengths: string[];
    challenges: string[];
}

// Helper to approximate the 'Holistic Score' without running full report generation
// This aims to bring the Dashboard score closer to the Report score by applying similar penalties
function calculateLiteHolisticScore(ashtakoot: AshtakootResult): number {
    let score = Math.round((ashtakoot.totalScore / 36) * 100);

    // Apply penalties similar to full report (but simplified)

    // 1. Nadi Dosha (Major Health/Gene incompatibility)
    // Full report deducts significantly for Nadi
    if (ashtakoot.doshas.nadiDosha) {
        // Check exceptions
        const isCancelled = ashtakoot.exceptions.some((e: string) => e.includes('Nadi'));
        if (!isCancelled) {
            score -= 15; // Significant penalty
        }
    }

    // 2. Bhakoot Dosha (Emotional disconnect)
    if (ashtakoot.doshas.bhakootDosha) {
        const isCancelled = ashtakoot.exceptions.some((e: string) => e.includes('Bhakoot'));
        if (!isCancelled) {
            score -= 10;
        }
    }

    // 3. Manglik Mismatch (Aggression/Energy mismatch)
    const manglik = ashtakoot.manglikAnalysis;
    if (manglik) {
        if (manglik.compatibility === 'Low' || manglik.compatibility === 'Consult Astrologer') {
            score -= 10;
        }
    }

    // 4. Gana Dosha (Temperament)
    if (ashtakoot.doshas.ganaDosha) {
        const isCancelled = ashtakoot.exceptions.some((e: string) => e.includes('Gana'));
        if (!isCancelled) {
            score -= 5;
        }
    }

    // 5. Graha Maitri (Friendship) - Bonus/Penalty
    // Report gives 20% weight to "Interaction". Friendship is key here.
    if (ashtakoot.parameters.grahaMaitri.pointsObtained >= 4) {
        score += 5;
    } else if (ashtakoot.parameters.grahaMaitri.pointsObtained <= 1) {
        score -= 5;
    }

    // Cap score at 0-100
    return Math.max(0, Math.min(100, score));
}

export function generateMatchInsight(selfChart: Chart, partnerChart: Chart, partnerName: string, partnerId: string): MatchInsight {
    const ashtakoot = calculateAshtakootMilan(selfChart, partnerChart);
    const rawScore = ashtakoot.totalScore;

    // Use the new holistic lite score for better accuracy
    const score = calculateLiteHolisticScore(ashtakoot);

    let verdict = 'Neutral';
    if (score >= 80) verdict = 'Excellent';
    else if (score >= 60) verdict = 'Good';
    else if (score >= 40) verdict = 'Average';
    else verdict = 'Challenging';

    // Generate Reasoning
    const reasons: string[] = [];
    const strengths: string[] = [];
    const challenges: string[] = [];

    // --- Critical Factors that AI analyzes "on top of" the score ---

    // 1. Nadi Dosha
    if (ashtakoot.doshas.nadiDosha) {
        if (ashtakoot.exceptions.some((e: string) => e.includes('Nadi'))) {
            reasons.push(`Although Nadi Dosha is present, it is cancelled, ensuring good health compatibility.`);
            strengths.push('Nadi Dosha Cancelled');
        } else {
            reasons.push(`There is Nadi Dosha present which may affect health or progeny matters.`);
            challenges.push('Nadi Dosha');
        }
    }

    // 2. Bhakoot
    const moonA = selfChart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon');
    const moonB = partnerChart.planetaryPositions.find((p: PlanetaryPosition) => p.planet === 'Moon');

    if (moonA && moonB) {
        if (ashtakoot.parameters.bhakoot.pointsObtained >= 7) {
            reasons.push(`Your Moon signs (${moonA.sign} & ${moonB.sign}) are in harmony, creating a deep emotional bond.`);
            strengths.push('Emotional Harmony');
        } else if (ashtakoot.doshas.bhakootDosha) {
            reasons.push(`Moon positions suggest different emotional needs; patience is key.`);
            challenges.push('Emotional Mismatch');
        }
    }

    // 3. Graha Maitri
    if (ashtakoot.parameters.grahaMaitri.pointsObtained >= 4) {
        strengths.push('Mental Friendship');
        reasons.push(`You share a strong mental rapport and friendship.`);
    } else if (ashtakoot.parameters.grahaMaitri.pointsObtained <= 1) {
        challenges.push('Different Mindsets');
    }

    // 4. Manglik Analysis
    const manglik = ashtakoot.manglikAnalysis;
    if (manglik) {
        if (manglik.compatibility === 'High' || manglik.compatibility === 'Compatible') {
            strengths.push('Manglik Compatible');
            if (manglik.partnerA.isManglik || manglik.partnerB.isManglik) {
                reasons.push("Mars energy is balanced between both charts.");
            }
        } else if (manglik.compatibility === 'Low' || manglik.compatibility === 'Consult Astrologer') {
            challenges.push('Manglik Mismatch');
            reasons.push("Mars energy mismatch requires detailed analysis.");
        }
    }

    // Construct final reason text
    let reasonText = "";

    if (challenges.includes('Nadi Dosha')) {
        reasonText = reasons.find(r => r.includes('Nadi')) || "";
    } else if (challenges.includes('Manglik Mismatch')) {
        reasonText = reasons.find(r => r.includes('Mars')) || "Mars energies are not aligned.";
    } else if (strengths.includes('Emotional Harmony')) {
        reasonText = reasons.find(r => r.includes('Moon')) || "";
    } else if (reasons.length > 0) {
        reasonText = reasons[0];
    } else {
        reasonText = "Overall compatibility is being analyzed.";
    }

    if (reasonText && reasons.length > 1 && !reasonText.includes(reasons[1])) {
        if (reasonText.length < 100) reasonText += " " + reasons[1];
    }

    return {
        partnerId,
        partnerName,
        score,
        rawScore,
        verdict,
        reason: reasonText,
        strengths,
        challenges
    };
}

export function analyzeBestMatch(selfChart: Chart, partners: { id: string, name: string, chart?: Chart }[]): MatchInsight | null {
    let bestMatch: MatchInsight | null = null;
    let highestScore = -1;

    for (const partner of partners) {
        if (partner.chart) {
            const insight = generateMatchInsight(selfChart, partner.chart, partner.name, partner.id);

            // Use the new holistic lite score for ranking
            if (insight.score > highestScore) {
                highestScore = insight.score;
                bestMatch = insight;
            }
        }
    }

    return bestMatch;
}
