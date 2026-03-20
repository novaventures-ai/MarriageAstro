import { describe, it, expect } from 'vitest';
import { calculateComparisonScore, ComparisonScore } from '../../lib/comparisonScoring';
import { CompatibilityReport } from '../../types';

// Minimal mock report with enough data to score
function createMockReport(overrides: Partial<CompatibilityReport> = {}): CompatibilityReport {
    return {
        ashtakoot: {
            totalScore: 25,
            maxScore: 36,
            parameters: {},
            doshas: [],
        },
        navamsaMatching: {
            score: 70,
        },
        synastry: {
            overallScore: 65,
            aspects: [],
            soulmate: { score: 60 },
            karmic: { score: 55 },
            sexual: { score: 70 },
        },
        riskAssessment: {
            divorceRisk: { score: 25, level: 'low' },
            infidelityRisk: { score: 15, level: 'low' },
        },
        sexualCompatibility: {
            overallScore: 72,
        },
        executiveSummary: {
            overallScore: 68,
            overallVerdict: 'Good',
            trafficLightStatus: 'green',
        },
        ...overrides,
    } as CompatibilityReport;
}

describe('Comparison Scoring Engine', () => {
    it('should return a score between 0 and 100', () => {
        const report = createMockReport();
        const result = calculateComparisonScore(report);

        expect(result.overall).toBeGreaterThanOrEqual(0);
        expect(result.overall).toBeLessThanOrEqual(100);
    });

    it('should have all 6 category scores', () => {
        const report = createMockReport();
        const result = calculateComparisonScore(report);

        expect(result.categories).toHaveProperty('traditional');
        expect(result.categories).toHaveProperty('relationship');
        expect(result.categories).toHaveProperty('risk');
        expect(result.categories).toHaveProperty('intimacy');
        expect(result.categories).toHaveProperty('advanced');
        expect(result.categories).toHaveProperty('timing');
    });

    it('should assign a label', () => {
        const report = createMockReport();
        const result = calculateComparisonScore(report);
        const validLabels = ['Excellent', 'Strong', 'Moderate', 'Needs Attention', 'Challenging'];

        expect(validLabels).toContain(result.label);
    });

    it('should produce higher traditional score for higher Ashtakoot', () => {
        const highReport = createMockReport({
            ashtakoot: { totalScore: 32, maxScore: 36, parameters: {}, doshas: [] },
        } as any);
        const lowReport = createMockReport({
            ashtakoot: { totalScore: 12, maxScore: 36, parameters: {}, doshas: [] },
        } as any);

        const highResult = calculateComparisonScore(highReport);
        const lowResult = calculateComparisonScore(lowReport);

        expect(highResult.categories.traditional).toBeGreaterThan(lowResult.categories.traditional);
    });

    it('should identify strengths and weaknesses', () => {
        const report = createMockReport();
        const result = calculateComparisonScore(report);

        expect(Array.isArray(result.strengths)).toBe(true);
        expect(Array.isArray(result.weaknesses)).toBe(true);
    });

    it('should handle empty/minimal report gracefully', () => {
        const emptyReport = {} as CompatibilityReport;
        const result = calculateComparisonScore(emptyReport);

        expect(result.overall).toBeGreaterThanOrEqual(0);
        expect(result.overall).toBeLessThanOrEqual(100);
        expect(result.categories).toBeDefined();
    });
});
