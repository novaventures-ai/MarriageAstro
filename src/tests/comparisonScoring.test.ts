import { describe, it, expect } from 'vitest';
import { calculateComparisonScore, ComparisonScore } from '../../lib/comparisonScoring';
import { CompatibilityReport } from '../../types';

// Minimal mock report with field names matching real CompatibilityReport types
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
            soulmateConnections: [
                { planet1: 'Venus', planet2: 'Moon', aspect: 'trine', orb: 2, description: 'Harmonious bond' },
            ],
            karmicBonds: [
                { planet1: 'Saturn', planet2: 'Moon', aspect: 'conjunction', orb: 3, description: 'Karmic link' },
            ],
            sexualChemistry: [
                { planet1: 'Mars', planet2: 'Venus', aspect: 'conjunction', orb: 1, description: 'Passion' },
            ],
            allAspects: [],
            houseOverlays: [
                { planet: 'Venus', house: 7, description: 'Love in partnership', direction: 'A_in_B' },
            ],
            d9Overlays: [],
            planetaryConjunctions: [],
        },
        riskAssessment: {
            divorceProbability: { score: 25, rawScore: 25, level: 'low', indicators: [], mitigation: [] },
            infidelityRisk: { score: 15, rawScore: 15, level: 'low', indicators: [], warning: [] },
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

    it('should penalize relationship score when synastry has no soulmate connections', () => {
        const noSoulmateReport = createMockReport({
            synastry: {
                soulmateConnections: [],
                karmicBonds: [],
                sexualChemistry: [],
                allAspects: [],
                houseOverlays: [],
                d9Overlays: [],
                planetaryConjunctions: [],
            },
        } as any);
        const goodReport = createMockReport();

        const noSoulmateResult = calculateComparisonScore(noSoulmateReport);
        const goodResult = calculateComparisonScore(goodReport);

        expect(noSoulmateResult.categories.relationship).toBeLessThan(goodResult.categories.relationship);
    });

    it('should use risk baseline of 70 (not 80)', () => {
        // An empty report should yield risk score near 70, not 80
        const emptyReport = {} as CompatibilityReport;
        const result = calculateComparisonScore(emptyReport);

        // With no risk data, score should be around 70 (the baseline)
        expect(result.categories.risk).toBeLessThanOrEqual(75);
    });

    it('should not double-count Vivah Saham in both advanced and timing', () => {
        const withVivah = createMockReport({
            vivahSaham: {
                partnerA: { activationPeriods: ['2025', '2026', '2027'] },
                partnerB: { activationPeriods: ['2025', '2026'] },
            },
        } as any);
        const withoutVivah = createMockReport();

        const withResult = calculateComparisonScore(withVivah);
        const withoutResult = calculateComparisonScore(withoutVivah);

        // Vivah Saham should only boost timing, not advanced
        expect(withResult.categories.timing).toBeGreaterThan(withoutResult.categories.timing);
        expect(withResult.categories.advanced).toBe(withoutResult.categories.advanced);
    });
});
