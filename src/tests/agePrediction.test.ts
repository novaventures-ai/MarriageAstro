
import { describe, it, expect } from 'vitest';
import { generateSelfAnalysisReport } from '../../lib/selfReportGenerator';
import { createMockChart } from './utils';

describe('Age Prediction Logic', () => {
    it('should enforce minimum age of 21 for a toddler', async () => {
        // Born in 2024 (2 years old in 2026)
        const dob = '2024-01-01';
        const chart = createMockChart({ dateOfBirth: dob });

        try {
            const report = await generateSelfAnalysisReport({
                dateOfBirth: dob,
                timeOfBirth: '12:00',
                location: 'Test',
                latitude: 0,
                longitude: 0,
                timezone: '5.5',
                name: 'Test',
                gender: 'male'
            }, chart);

            console.log('Toddler Expected Age:', report.marriagePotential.expectedMarriageAge);
            expect(report.marriagePotential.expectedMarriageAge.min).toBeGreaterThanOrEqual(21);
        } catch (e: any) {
            console.error('Test FAILED with error:', e);
            throw e;
        }
    });

    it('should use timing forecast for a marriageable age person', async () => {
        // Born in 2000 (26 years old in 2026)
        const dob = '2000-01-01';
        const chart = createMockChart({ dateOfBirth: dob });

        try {
            const report = await generateSelfAnalysisReport({
                dateOfBirth: dob,
                timeOfBirth: '12:00',
                location: 'Test',
                latitude: 0,
                longitude: 0,
                timezone: '5.5',
                name: 'Test',
                gender: 'male'
            }, chart);

            console.log('Adult Expected Age:', report.marriagePotential.expectedMarriageAge);
            expect(report.marriagePotential.expectedMarriageAge).toBeDefined();
            // Min age should be >= 0 (sanity check)
            expect(report.marriagePotential.expectedMarriageAge.min).toBeGreaterThan(0);
        } catch (e: any) {
            console.error('Test FAILED with error:', e);
            throw e;
        }
    });
});
