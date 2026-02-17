import { describe, it, expect } from 'vitest';
import { assessInfidelityRisk } from '../../lib/riskCalculations';
import { Chart } from '../../types';

const createMockChart = (overrides: Partial<Chart> = {}): Chart => ({
    id: 'test-chart',
    name: 'Test Person',
    gender: 'male',
    dateOfBirth: new Date('1990-01-01'),
    timeOfBirth: '10:00',
    location: 'Mumbai, India',
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
    ayanamsha: 'Lahiri (23.85°)',
    ascendant: 'Aries',
    planetaryPositions: [],
    houses: Array.from({ length: 12 }, (_, i) => ({
        houseNumber: i + 1,
        sign: 'Aries',
        degree: 0,
        lord: 'Mars',
        planets: []
    })),
    vargaCharts: {
        D1: { ascendant: 'Aries', houses: [], planetaryPositions: [] },
        D9: { ascendant: 'Leo', houses: [], planetaryPositions: [] }
    },
    specialPoints: { atmakaraka: 'Sun', darakaraka: 'Venus', upapadaLagna: 'Libra', vivahSaham: 120.5 },
    createdAt: new Date(),
    yogas: [],
    kp: { cusps: [], significators: [] },
    dashas: [],
    nakshatra: 'Ashwini',
    nakshatraLord: 'Ketu',
    pada: 1,
    ...overrides
});

describe('Passion & Commitment Logic (Harmonized)', () => {
    it('detects high passion from Venus-Mars conjunction', () => {
        const chart = createMockChart({
            planetaryPositions: [
                { planet: 'Venus', longitude: 10, latitude: 0, speed: 0, house: 1, sign: 'Aries', signDegree: 10, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'none' },
                { planet: 'Mars', longitude: 12, latitude: 0, speed: 0, house: 1, sign: 'Aries', signDegree: 12, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'own_house' }
            ]
        });
        const result = assessInfidelityRisk(chart, 'John');
        // Capacity score for Venus-Mars: 25. Final: (25 * 0.5) + (0 * 0.5) + 5 = 17.5 -> 18
        expect(result.level).toBe('low');
        expect(result.score).toBe(18);
    });

    it('detects very high passion from Venus-Rahu and context', () => {
        const chart = createMockChart({
            planetaryPositions: [
                { planet: 'Venus', longitude: 10, latitude: 0, speed: 0, house: 1, sign: 'Aries', signDegree: 10, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'none' },
                { planet: 'Rahu', longitude: 12, latitude: 0, speed: 0, house: 1, sign: 'Aries', signDegree: 12, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'none' }
            ],
            houses: [
                { houseNumber: 12, sign: 'Pisces', degree: 0, lord: 'Jupiter', planets: ['Moon', 'Mercury'] }
            ] as any
        });
        const result = assessInfidelityRisk(chart, 'John');
        // Capacity (Venus-Rahu): 30.
        // Opportunity (p12.length >= 2): 30.
        // Final: (30 * 0.5) + (30 * 0.5) + 5 = 15 + 15 + 5 = 35.
        expect(result.score).toBe(35);
        expect(result.level).toBe('medium');
    });

    it('mitigates risk when strong Jupiter (Stabilizer) is present', () => {
        // High capacity (Venus-Mars 25 + Venus-Rahu 30 = 55)
        // High opportunity (12th house 20)
        // Stabilizer (Strong Jupiter -30)
        const chart = createMockChart({
            planetaryPositions: [
                { planet: 'Venus', longitude: 10, latitude: 0, speed: 0, house: 1, sign: 'Aries', signDegree: 10, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'none' },
                { planet: 'Mars', longitude: 12, latitude: 0, speed: 0, house: 1, sign: 'Aries', signDegree: 12, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'own_house' },
                { planet: 'Rahu', longitude: 11, latitude: 0, speed: 0, house: 1, sign: 'Aries', signDegree: 11, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'none' },
                { planet: 'Jupiter', longitude: 90, latitude: 0, speed: 0, house: 4, sign: 'Cancer', signDegree: 0, nakshatra: 'Pushya', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'exalted' }
            ],
            houses: [
                { houseNumber: 12, sign: 'Pisces', degree: 0, lord: 'Jupiter', planets: ['Moon', 'Mercury'] }
            ] as any
        });
        const result = assessInfidelityRisk(chart, 'John');
        // Capacity: 25 + 30 = 55.
        // Opportunity: 30 (12th house).
        // Stabilizer: 30 (Exalted Jupiter).
        // Final: (55 * 0.5) + (30 * 0.5) - 30 + 5 = 27.5 + 15 - 30 + 5 = 17.5 -> 18.
        expect(result.score).toBe(18);
        expect(result.level).toBe('low');
    });

    it('identifies workplace context triggers', () => {
        const chart = createMockChart({
            houses: [
                { houseNumber: 6, planets: ['Venus'], lord: 'Mercury' },
                { houseNumber: 10, planets: ['Mars'], lord: 'Saturn' }
            ] as any
        });
        const result = assessInfidelityRisk(chart, 'John');
        // Opportunity: 25 (Workplace).
        // Final: (0 * 0.5) + (25 * 0.5) + 5 = 12.5 + 5 = 17.5 -> 18.
        expect(result.score).toBe(18);
    });

    it('detects classic combinations and advanced reasons', () => {
        const chart = createMockChart({
            planetaryPositions: [
                { planet: 'Rahu', longitude: 10, house: 5, sign: 'Aries', dignity: 'none' } as any,
                { planet: 'Mars', longitude: 150, house: 7, sign: 'Leo', dignity: 'own_house' } as any, // 7th Lord in 7th
                { planet: 'Venus', longitude: 120, house: 5, sign: 'Leo', dignity: 'none' } as any, // 5th Lord should be Sun, let's simplify for parity
            ],
            houses: [
                { houseNumber: 5, lord: 'Venus', planets: ['Rahu'] },
                { houseNumber: 7, lord: 'Mars', planets: [] }
            ] as any
        });

        // 5th Lord (Venus) in 5th - no exchange here yet.
        // Let's force an exchange: 5th Lord in 7, 7th Lord in 5.
        const exchangeChart = createMockChart({
            planetaryPositions: [
                { planet: 'Venus', longitude: 180, house: 7, sign: 'Libra', dignity: 'own_house' } as any, // 5th Lord in 7
                { planet: 'Mars', longitude: 10, house: 5, sign: 'Aries', dignity: 'own_house' } as any, // 7th Lord in 5
                { planet: 'Rahu', longitude: 12, house: 5, sign: 'Aries', dignity: 'none' } as any
            ],
            houses: [
                { houseNumber: 5, lord: 'Venus', planets: ['Mars', 'Rahu'] },
                { houseNumber: 7, lord: 'Mars', planets: ['Venus'] }
            ] as any
        });

        const result = assessInfidelityRisk(exchangeChart, 'John');

        // Capacity: 
        // Rahu in 5th: 20
        // Parivartana 5-7: 25
        // 5th Lord in 7: 0 (Classic)
        // Total Capacity: 45

        // Opportunity: 5 (Base bump)
        // Final Score: (45 * 0.5) + (0 * 0.5) + 5 = 22.5 + 5 = 27.5 -> 28

        expect(result.score).toBe(28);
        const IndicatorTexts = result.indicators.map(i => i.text);
        expect(IndicatorTexts).toContain('History & Capacity: Rahu in the 5th house aspects relationship planets, often creating obsessive or unconventional desires.');
        expect(IndicatorTexts).toContain('Deep Narrative: Parivartana Yoga between 5th and 7th lords; deep fusion of romance and marriage.');
    });
});
