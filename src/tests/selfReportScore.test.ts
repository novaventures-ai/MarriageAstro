
import { describe, it, expect } from 'vitest';
import { generateSelfAnalysisReport } from '../../lib/selfReportGenerator';
import { createMockChart } from './utils';

describe('Self Report Score Verification', () => {

    const baseInput = {
        dateOfBirth: '1990-01-01',
        timeOfBirth: '12:00',
        location: 'Test',
        latitude: 0,
        longitude: 0,
        timezone: '5.5',
        name: 'Test',
        gender: 'male' as const
    };

    it('should boost a moderate score to "Good" range (Square Root Curve)', async () => {
        // Create a chart with average indications
        // 7th House: Empty, Lord is Mars (Average)
        // Navamsa: Average
        const chart = createMockChart({
            gender: 'male',
            houses: Array.from({ length: 12 }, (_, i) => ({
                houseNumber: i + 1,
                sign: 'Aries',
                lord: 'Mars',
                cuspLongitude: 0,
                planets: []
            }))
        });

        const report = await generateSelfAnalysisReport(baseInput, chart);
        const score = report.marriagePotential.score;
        const verdict = report.marriagePotential.verdict;

        console.log('Moderate Chart - Score:', score, 'Verdict:', verdict);

        // Raw score ~40-50 -> Boosted should be ~63-70
        // Expect at least 60
        expect(score).toBeGreaterThanOrEqual(60);
    });

    it('should result in high score for excellent placements', async () => {
        // Excellent 7th House: Jupiter in 7th
        const chart = createMockChart({
            gender: 'male',
            houses: Array.from({ length: 12 }, (_, i) => ({
                houseNumber: i + 1,
                sign: 'Aries',
                lord: i === 6 ? 'Jupiter' : 'Mars', // Set 7th lord to Jupiter
                cuspLongitude: 0,
                planets: i === 6 ? ['Jupiter'] : [] // 7th house (index 6) has Jupiter
            })),
            planetaryPositions: [
                { planet: 'Jupiter', sign: 'Libra', house: 7, longitude: 180, isRetrograde: false, speed: 1, dignity: 'exalted' },
                { planet: 'Mars', sign: 'Aries', house: 1, longitude: 0, isRetrograde: false, speed: 1, dignity: 'own_house' } // Keep Mars for sanity
            ] as any[]
        });

        const report = await generateSelfAnalysisReport(baseInput, chart);
        const score = report.marriagePotential.score;

        console.log('Excellent Chart - Score:', score);
        expect(score).toBeGreaterThanOrEqual(75);
    });

    it('should result in lower score for poor placements', async () => {
        // Poor 7th House: Saturn + Mars in 7th
        const chart = createMockChart({
            gender: 'male',
            houses: Array.from({ length: 12 }, (_, i) => ({
                houseNumber: i + 1,
                sign: 'Aries',
                lord: 'Mars',
                cuspLongitude: 0,
                planets: i === 6 ? ['Saturn', 'Mars'] : []
            })),
            planetaryPositions: [
                { planet: 'Saturn', sign: 'Libra', house: 7, longitude: 180, isRetrograde: false, speed: 1, dignity: 'debilitated' }, // Debilitated Saturn in Aries? (Sign mismatch in mock but logic follows props)
                { planet: 'Mars', sign: 'Libra', house: 7, longitude: 180, isRetrograde: false, speed: 1, dignity: 'enemy' }
            ] as any[]
        });

        const report = await generateSelfAnalysisReport(baseInput, chart);
        const score = report.marriagePotential.score;

        console.log('Poor Chart - Score:', score);

        // Even boosted, poor raw score should not reach "Excellent"
        // Raw ~20 -> Boosted ~44
        // Raw ~30 -> Boosted ~54
        expect(score).toBeLessThan(75);
    });
});
