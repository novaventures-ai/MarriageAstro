import { CompatibilityReport } from '@types';

export interface AIContext {
    overallScore: number;
    riskProfile: {
        level: string;
        flags: string[];
    };
    pillars: {
        name: string;
        score: number;
        status: string;
    }[];
    verdict: string;
    strengths: string[];
    challenges: string[];
    dashaTimeline: string[];
    deepAnalysis?: {
        partnerA: {
            name: string;
            ascendant: string;
            planets: any[];
            currentDasha: string;
        };
        partnerB: {
            name: string;
            ascendant: string;
            planets: any[];
            currentDasha: string;
        };
        synergy: {
            manglik: string;
            moonBond: string;
        };
    };
}

export const processReportForAI = (report: CompatibilityReport): AIContext => {
    // 1. Extract Critical Risks safely
    const riskFlags: string[] = [];

    const extractRisks = (analysis: any, type: 'addiction' | 'mental' | 'pattern') => {
        if (!analysis) return;
        ['partnerA', 'partnerB'].forEach(partner => {
            const data = analysis[partner];
            if (!data) return;

            if (type === 'addiction' && data.categories) {
                data.categories
                    .filter((c: any) => c.riskLevel === 'high' || c.riskLevel === 'very_high')
                    .forEach((c: any) => riskFlags.push(`${c.label} Risk (${partner === 'partnerA' ? 'Partner A' : 'Partner B'})`));
            }

            if (type === 'mental' && data.categories) {
                data.categories
                    .filter((c: any) => c.riskLevel === 'high' || c.riskLevel === 'elevated')
                    .forEach((c: any) => riskFlags.push(`${c.label} Issue (${partner === 'partnerA' ? 'Partner A' : 'Partner B'})`));
            }

            if (type === 'pattern' && data.patterns) {
                data.patterns
                    .filter((p: any) => p.severity === 'severe')
                    .forEach((p: any) => riskFlags.push(`${p.name} (${partner === 'partnerA' ? 'Partner A' : 'Partner B'})`));
            }
        });
    };

    extractRisks(report.addictionRiskAnalysis, 'addiction');
    extractRisks(report.mentalHealthAnalysis, 'mental');
    extractRisks(report.relationshipPatternAnalysis, 'pattern');

    // 2. Format Pillar Data with fallbacks
    const pillars = [
        { name: 'Stability', ...report.advancedBreakdown?.stability },
        { name: 'Dynamics', ...report.advancedBreakdown?.interaction },
        { name: 'Destiny', ...report.advancedBreakdown?.soul },
        { name: 'Tradition', ...report.advancedBreakdown?.tradition },
        { name: 'Promise', ...report.advancedBreakdown?.promise },
    ].map(p => ({
        name: p.name || 'Unknown Pillar',
        score: typeof p.score === 'number' ? Math.round(p.score) : 0,
        status: p.status || 'neutral'
    }));

    // 3. Extract High-Level Strengths/Weaknesses
    const strengths = report.executiveSummary?.strengths || [];
    const challenges = report.executiveSummary?.challenges || [];

    // 4. Extract Deep Analysis Data (Planets & Dashas)
    const simplifyPlanets = (positions: any[]) => {
        return positions.map(p => ({
            planet: p.planet,
            sign: p.sign,
            house: p.house,
            dignity: p.dignity,
            nakshatra: p.nakshatra
        }));
    };

    const getCurrentDasha = (dashas: any[]) => {
        const current = dashas.find((d: any) => d.isCurrent);
        return current ? `${current.planet} Mahadasha (ends ${new Date(current.endDate).getFullYear()})` : 'Unknown';
    };

    return {
        overallScore: report.overallScore || 0,
        riskProfile: {
            level: report.riskAssessment?.divorceProbability?.level || 'unknown',
            flags: riskFlags
        },
        pillars,
        verdict: report.executiveSummary?.verdict || 'Pending Analysis',
        strengths,
        challenges,
        dashaTimeline: [],
        deepAnalysis: {
            partnerA: {
                name: report.chartA.name,
                ascendant: report.chartA.ascendant,
                planets: simplifyPlanets(report.chartA.planetaryPositions),
                currentDasha: getCurrentDasha(report.chartA.dashas)
            },
            partnerB: {
                name: report.chartB.name,
                ascendant: report.chartB.ascendant,
                planets: simplifyPlanets(report.chartB.planetaryPositions),
                currentDasha: getCurrentDasha(report.chartB.dashas)
            },
            synergy: {
                manglik: report.riskAssessment?.manglikAnalysis?.compatibility || 'Unknown',
                moonBond: `${report.ashtakoot?.parameters?.bhakoot?.pointsObtained || 0}/7`
            }
        }
    };
};
