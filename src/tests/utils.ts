
import { Chart } from '@types';

export const createMockChart = (overrides: Partial<Chart> = {}): Chart => ({
    name: 'Test User',
    dateOfBirth: '1990-01-01',
    timeOfBirth: '12:00',
    placeOfBirth: {
        name: 'Test Place',
        latitude: 0,
        longitude: 0,
        timezone: 5.5
    },
    ascendant: 'Aries',
    houses: Array.from({ length: 12 }, (_, i) => ({
        houseNumber: i + 1,
        sign: 'Aries',
        lord: 'Mars',
        planets: []
    })),
    planetaryPositions: [
        { planet: 'Sun', sign: 'Aries', house: 1, longitude: 0, isRetrograde: false, speed: 1 },
        { planet: 'Moon', sign: 'Taurus', house: 2, longitude: 30, isRetrograde: false, speed: 13 },
        { planet: 'Mars', sign: 'Gemini', house: 3, longitude: 60, isRetrograde: false, speed: 1 },
        { planet: 'Mercury', sign: 'Cancer', house: 4, longitude: 90, isRetrograde: false, speed: 1 },
        { planet: 'Jupiter', sign: 'Leo', house: 5, longitude: 120, isRetrograde: false, speed: 0.1 },
        { planet: 'Venus', sign: 'Virgo', house: 6, longitude: 150, isRetrograde: false, speed: 1 },
        { planet: 'Saturn', sign: 'Libra', house: 7, longitude: 180, isRetrograde: false, speed: 0.05 },
        { planet: 'Rahu', sign: 'Scorpio', house: 8, longitude: 210, isRetrograde: true, speed: -0.05 },
        { planet: 'Ketu', sign: 'Taurus', house: 2, longitude: 30, isRetrograde: true, speed: -0.05 }
    ],
    specialPoints: {
        ascendant: { longitude: 0, sign: 'Aries', nakshatra: 'Ashwini', pada: 1 },
        moon: { longitude: 30, sign: 'Taurus', nakshatra: 'Rohini', pada: 1 },
        darakaraka: 'Venus',
        upapadaLagna: 'Pisces'
    },
    nakshatra: 'Ashwini',
    dashas: [], // Populate if needed for specific dasha tests
    yogas: [],
    kp: {
        cusps: [],
        significators: []
    },
    vargaCharts: {
        D1: { houses: [], planetaryPositions: [], ascendant: 'Aries' },
        D9: { houses: [], planetaryPositions: [], ascendant: 'Aries' }
    },
    ...overrides
} as any);
