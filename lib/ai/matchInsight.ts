/**
 * Match Insight Generator - Enhanced with AI Matchmaking Engine
 * Provides comprehensive partner analysis and best match selection
 */

import { Chart } from '@types';
import {
    AIMatchmakingEngine,
    AIMatchResult,
    AIMatchAnalysis,
    analyzeAllPartners,
    generateQuickMatchInsight
} from './matchmakingEngine.js';
import { calculateAshtakootMilan } from '../compatibilityCalculations.js';

export interface MatchInsight {
    partnerId: string;
    partnerName: string;
    score: number;
    rawScore: number;
    verdict: string;
    reason: string;
    strengths: string[];
    challenges: string[];
    aiAnalysis?: AIMatchAnalysis;
}

/**
 * Generate comprehensive match insight with full AI analysis
 * This is used when the user clicks "View Full Analysis" or "Explain"
 */
export async function generateComprehensiveMatchInsight(
    selfChart: Chart,
    partnerChart: Chart,
    partnerName: string,
    partnerId: string
): Promise<{ insight: MatchInsight; fullAnalysis: AIMatchAnalysis | null }> {

    // Create a mini-engine for single partner analysis
    const engine = new AIMatchmakingEngine(selfChart, [{ id: partnerId, name: partnerName, chart: partnerChart }]);

    // We need to generate the report first
    const { generateCompatibilityReport } = await import('../reportGenerator');

    try {
        const report = await generateCompatibilityReport(selfChart, partnerChart);

        // Create a minimal analysis from the report
        const ashtakoot = report.ashtakoot;
        const score = report.overallScore;

        let verdict = 'Neutral';
        if (score >= 80) verdict = 'Excellent';
        else if (score >= 60) verdict = 'Good';
        else if (score >= 40) verdict = 'Average';
        else verdict = 'Challenging';

        // Generate detailed analysis
        const reasons: string[] = [];
        const strengths: string[] = [];
        const challenges: string[] = [];

        // Nadi analysis
        if (ashtakoot.doshas.nadiDosha) {
            if (ashtakoot.exceptions.some((e: string) => e.includes('Nadi'))) {
                reasons.push(`Although Nadi Dosha is present, it is cancelled by specific astrological factors.`);
                strengths.push('Nadi Dosha Cancelled');
            } else {
                reasons.push(`Nadi Dosha present: Same constitution may affect health and progeny compatibility.`);
                challenges.push('Nadi Dosha');
            }
        }

        // Moon sign analysis
        const moonA = selfChart.planetaryPositions.find((p: any) => p.planet === 'Moon');
        const moonB = partnerChart.planetaryPositions.find((p: any) => p.planet === 'Moon');

        if (moonA && moonB) {
            if (ashtakoot.parameters.bhakoot.pointsObtained >= 7) {
                reasons.push(`Your Moon signs (${moonA.sign} & ${moonB.sign}) are in harmonious positions, creating a deep emotional bond and mutual understanding.`);
                strengths.push('Emotional Harmony');
            } else if (ashtakoot.doshas.bhakootDosha) {
                reasons.push(`Moon positions indicate different emotional needs (${moonA.sign} & ${moonB.sign}). Conscious communication will be important.`);
                challenges.push('Different Mindsets');
            }
        }

        // Graha Maitri
        if (ashtakoot.parameters.grahaMaitri.pointsObtained >= 4) {
            strengths.push('Mental Friendship');
            reasons.push(`Strong mental rapport: Your Moon sign lords (${ashtakoot.parameters.grahaMaitri.boyValue} & ${ashtakoot.parameters.grahaMaitri.girlValue}) are naturally friendly.`);
        } else if (ashtakoot.parameters.grahaMaitri.pointsObtained <= 1) {
            challenges.push('Different Mindsets');
            reasons.push(`Different mental wavelengths indicated by planetary lord relationships.`);
        }

        // Gana analysis
        if (ashtakoot.parameters.gana.pointsObtained >= 5) {
            strengths.push('Compatible Temperament');
        } else if (ashtakoot.doshas.ganaDosha) {
            challenges.push('Temperament Difference');
        }

        // Manglik
        if (ashtakoot.manglikAnalysis) {
            if (ashtakoot.manglikAnalysis.compatibility === 'High' || ashtakoot.manglikAnalysis.compatibility === 'Compatible') {
                strengths.push('Manglik Compatible');
                if (ashtakoot.manglikAnalysis.partnerA.isManglik || ashtakoot.manglikAnalysis.partnerB.isManglik) {
                    reasons.push("Mars energy is balanced between both charts.");
                }
            } else if (ashtakoot.manglikAnalysis.compatibility === 'Low') {
                challenges.push('Manglik Mismatch');
                reasons.push("Mars energy mismatch requires attention to avoid conflicts.");
            }
        }

        // Sexual compatibility
        if (report.sexualCompatibility.overallScore >= 75) {
            strengths.push('Strong Physical Chemistry');
            reasons.push(`Excellent physical compatibility with ${report.sexualCompatibility.yoniMatch.nature} yoni match.`);
        }

        // Synastry connections
        if (report.synastry.soulmateConnections.length > 0) {
            strengths.push(`${report.synastry.soulmateConnections.length} Soulmate Indicators`);
            reasons.push(`Multiple soulmate connections found between your charts, indicating natural affinity.`);
        }

        // Risk assessment
        if (report.riskAssessment.divorceProbability.score < 30) {
            strengths.push('Stable Relationship Indicators');
        } else if (report.riskAssessment.divorceProbability.score > 35) {
            challenges.push('Stability Concerns');
            reasons.push(`${report.riskAssessment.divorceProbability.level} risk indicators present - conscious effort needed.`);
        }

        // Construct reason text
        let reasonText = reasons[0] || "Compatibility analysis shows mixed indicators.";
        if (reasons.length > 1 && reasonText.length < 120) {
            reasonText += " " + reasons[1];
        }

        // Build full AI analysis object
        const fullAnalysis: AIMatchAnalysis = {
            partnerId,
            partnerName,
            overallScore: score,
            rawScore: ashtakoot.totalScore,
            categoryScores: {
                traditional: Math.round((ashtakoot.totalScore / 36) * 100),
                relationship: report.synastry.soulmateConnections.length > 0 ? 75 : 50,
                risk: Math.round(100 - report.riskAssessment.divorceProbability.score),
                intimacy: report.sexualCompatibility.overallScore,
                advanced: 60,
                timing: report.timing.favorablePeriods.length > 0 ? 70 : 50
            },
            rankingFactors: [],
            strengthAreas: strengths.map(s => ({
                category: 'General',
                title: s,
                description: s,
                evidence: [],
                astrologicalBasis: '',
                impactScore: 70
            })),
            challengeAreas: challenges.map(c => ({
                category: 'General',
                title: c,
                description: c,
                severity: 'moderate',
                mitigationStrategies: [],
                astrologicalBasis: ''
            })),
            uniqueAdvantages: strengths.slice(0, 3),
            riskFactors: [
                ...(report.riskAssessment.divorceProbability.score > 30 ? [{
                    type: 'Divorce Risk',
                    level: (report.riskAssessment.divorceProbability.score > 60 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
                    description: report.riskAssessment.divorceProbability.level,
                    indicators: report.riskAssessment.divorceProbability.indicators.map((i: any) => i.text),
                    mitigationAvailable: true
                }] : []),
                ...(report.riskAssessment.infidelityRisk?.score > 30 ? [{
                    type: 'Infidelity Risk',
                    level: (report.riskAssessment.infidelityRisk.score > 60 ? 'high' : 'medium') as 'high' | 'medium' | 'low',
                    description: report.riskAssessment.infidelityRisk.level,
                    indicators: report.riskAssessment.infidelityRisk.indicators?.map((i: any) => i.text) || [],
                    mitigationAvailable: true
                }] : []),
            ],
            compatibilitySignature: {
                emotionalProfile: ashtakoot.parameters.bhakoot.pointsObtained >= 7 ? 'Harmonious' : 'Needs Work',
                mentalProfile: ashtakoot.parameters.grahaMaitri.pointsObtained >= 4 ? 'Aligned' : 'Different',
                sexualSynergy: report.sexualCompatibility.overallScore >= 70 ? 'Strong' : 'Moderate',
                socialProfile: 'Harmonious',
                karmicWeight: report.synastry.soulmateConnections.length > 0 ? 'High' : 'Moderate'
            },
            explanationData: {
                executiveSummary: report.executiveSummary.verdict,
                detailedAnalysis: [
                    {
                        title: 'Ashtakoot Analysis',
                        content: `Scored ${ashtakoot.totalScore}/36 gunas`,
                        subsections: Object.entries(ashtakoot.parameters).map(([key, param]: [string, any]) => ({
                            title: param.name,
                            content: `${param.pointsObtained}/${param.maxPoints} - ${param.interpretation}`,
                            data: {
                                'Your Value': param.boyValue,
                                'Partner Value': param.girlValue
                            }
                        }))
                    },
                    {
                        title: 'Synastry Connections',
                        content: `${report.synastry.soulmateConnections.length} soulmate indicators found`
                    },
                    {
                        title: 'Risk Assessment',
                        content: `Divorce probability: ${report.riskAssessment.divorceProbability.level}`
                    }
                ],
                keyHighlights: [
                    ...strengths.map(s => ({
                        type: 'positive' as const,
                        title: s,
                        description: s,
                        importance: 80
                    })),
                    ...challenges.map(c => ({
                        type: 'negative' as const,
                        title: c,
                        description: c,
                        importance: 70
                    }))
                ],
                comparisonWithOthers: [],
                astrologicalEvidence: [
                    {
                        category: 'Moon Signs (Emotional)',
                        evidence: `${moonA?.sign} & ${moonB?.sign}`,
                        technicalDetails: `${moonA?.nakshatra} & ${moonB?.nakshatra}`,
                        interpretation: ashtakoot.parameters.bhakoot.interpretation
                    },
                    {
                        category: 'Venus (Harmony)',
                        evidence: `Venus placements: ${selfChart.planetaryPositions.find(p => p.planet === 'Venus')?.sign} & ${partnerChart.planetaryPositions.find(p => p.planet === 'Venus')?.sign}`,
                        technicalDetails: 'Synastry and house interactions',
                        interpretation: 'Venus indicates the quality of love and affection between the couple.'
                    },
                    {
                        category: 'Mars (Compatibility)',
                        evidence: `Manglik Status: ${ashtakoot.manglikAnalysis?.partnerA.isManglik ? 'Yes' : 'No'} & ${ashtakoot.manglikAnalysis?.partnerB.isManglik ? 'Yes' : 'No'}`,
                        technicalDetails: ashtakoot.manglikAnalysis?.compatibility || 'Neutral',
                        interpretation: 'Mars energy dictates how the couple handles drive and conflict.'
                    }
                ]
            },
            recommendation: score >= 80 ? 'highly_recommended' :
                score >= 60 ? 'recommended' :
                    score >= 40 ? 'conditional' : 'caution_advised',
            confidence: 80
        };

        const insight: MatchInsight = {
            partnerId,
            partnerName,
            score,
            rawScore: ashtakoot.totalScore,
            verdict,
            reason: reasonText,
            strengths,
            challenges,
            aiAnalysis: fullAnalysis
        };

        return { insight, fullAnalysis };

    } catch (error) {
        console.error('Error generating comprehensive insight:', error instanceof Error ? error.message : 'Unknown error');

        // Fallback to simple insight
        const simpleInsight = await generateMatchInsight(selfChart, partnerChart, partnerName, partnerId);
        return {
            insight: simpleInsight,
            fullAnalysis: null
        };
    }
}

/**
 * Generate match insight - Now async to use full AI engine for consistency
 * Used for dashboard display
 */
export async function generateMatchInsight(
    selfChart: Chart,
    partnerChart: Chart,
    partnerName: string,
    partnerId: string
): Promise<MatchInsight> {
    try {
        // Run full AI analysis for 100% consistency with the reports
        const engine = new AIMatchmakingEngine(selfChart, [{ id: partnerId, name: partnerName, chart: partnerChart }]);
        const results = await engine.analyzeAllMatches();
        const analysis = results.allMatches[0];

        if (!analysis) throw new Error("Analysis failed");

        // Calculate ashtakoot for the rawScore field
        const ashtakoot = calculateAshtakootMilan(selfChart, partnerChart);

        return {
            partnerId,
            partnerName,
            score: analysis.overallScore,
            rawScore: ashtakoot.totalScore,
            verdict: analysis.recommendation.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            reason: analysis.explanationData.executiveSummary,
            strengths: analysis.strengthAreas.map(s => s.title),
            challenges: analysis.challengeAreas.map(c => c.title),
            aiAnalysis: analysis
        };
    } catch (error) {
        console.error('Error generating AI match insight (dashboard path):', error instanceof Error ? error.message : 'Unknown error');

        // Fallback to basic calculation if engine fails
        const ashtakoot = calculateAshtakootMilan(selfChart, partnerChart);
        let score = Math.round((ashtakoot.totalScore / 36) * 100);

        // Basic penalties for fallback
        if (ashtakoot.doshas.nadiDosha && !ashtakoot.exceptions.some(e => e.includes('Nadi'))) score -= 30;

        return {
            partnerId,
            partnerName,
            score: Math.max(0, Math.min(100, score)),
            rawScore: ashtakoot.totalScore,
            verdict: score >= 70 ? 'Good' : score >= 50 ? 'Average' : 'Challenging',
            reason: "Compatibility analysis (Standard Model)",
            strengths: [],
            challenges: ashtakoot.doshas.nadiDosha ? ['Nadi Dosha'] : []
        };
    }
}

/**
 * Analyze all partners and find the best match
 * Returns detailed analysis for all partners with best match highlighted
 */
export async function analyzeBestMatch(
    selfChart: Chart,
    partners: { id: string; name: string; chart?: Chart }[]
): Promise<{ bestMatch: MatchInsight | null; allMatches: MatchInsight[]; aiResult: AIMatchResult | null }> {

    // Filter partners with charts
    const validPartners = partners.filter(p => p.chart) as { id: string; name: string; chart: Chart }[];

    if (validPartners.length === 0) {
        return { bestMatch: null, allMatches: [], aiResult: null };
    }

    try {
        // Run comprehensive AI analysis
        const aiResult = await analyzeAllPartners(selfChart, validPartners);

        // Convert AI results to MatchInsights
        const allMatches: MatchInsight[] = aiResult.allMatches.map(analysis => ({
            partnerId: analysis.partnerId,
            partnerName: analysis.partnerName,
            score: analysis.overallScore,
            rawScore: analysis.rawScore,
            verdict: analysis.recommendation.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            reason: analysis.explanationData.executiveSummary,
            strengths: analysis.strengthAreas.map(s => s.title),
            challenges: analysis.challengeAreas.map(c => c.title),
            aiAnalysis: analysis
        }));

        const bestMatch = allMatches[0] || null;

        return { bestMatch, allMatches, aiResult };

    } catch (error) {
        console.error('Error in comprehensive analysis:', error instanceof Error ? error.message : 'Unknown error');

        // Fallback to simple analysis
        let bestMatch: MatchInsight | null = null;
        let highestScore = -1;
        const allMatches: MatchInsight[] = [];

        for (const partner of validPartners) {
            const insight = await generateMatchInsight(selfChart, partner.chart, partner.name, partner.id);
            allMatches.push(insight);

            if (insight.score > highestScore) {
                highestScore = insight.score;
                bestMatch = insight;
            }
        }

        return { bestMatch, allMatches, aiResult: null };
    }
}

/**
 * Sync version of match insight generator (for fallbacks where async is not possible)
 */
export function generateMatchInsightSync(
    selfChart: Chart,
    partnerChart: Chart,
    partnerName: string,
    partnerId: string
): MatchInsight {
    // Basic calculation
    const ashtakoot = calculateAshtakootMilan(selfChart, partnerChart);
    let score = Math.round((ashtakoot.totalScore / 36) * 100);

    // Basic penalties
    if (ashtakoot.doshas.nadiDosha && !ashtakoot.exceptions.some(e => e.includes('Nadi'))) score -= 30;

    return {
        partnerId,
        partnerName,
        score: Math.max(0, Math.min(100, score)),
        rawScore: ashtakoot.totalScore,
        verdict: score >= 70 ? 'Good' : score >= 50 ? 'Average' : 'Challenging',
        reason: "Compatibility analysis (Standard Model)",
        strengths: [],
        challenges: ashtakoot.doshas.nadiDosha ? ['Nadi Dosha'] : []
    };
}

/**
 * Legacy function for backward compatibility
 */
export function analyzeBestMatchSync(selfChart: Chart, partners: { id: string; name: string; chart?: Chart }[]): MatchInsight | null {
    let bestMatch: MatchInsight | null = null;
    let highestScore = -1;

    for (const partner of partners) {
        if (partner.chart) {
            const insight = generateMatchInsightSync(selfChart, partner.chart, partner.name, partner.id);
            if (insight.score > highestScore) {
                highestScore = insight.score;
                bestMatch = insight;
            }
        }
    }

    return bestMatch;
}

export type { AIMatchResult, AIMatchAnalysis };
export { analyzeAllPartners };
