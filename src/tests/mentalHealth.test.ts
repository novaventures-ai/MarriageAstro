import { describe, it, expect } from 'vitest';
import { analyzeMentalHealth } from '../../lib/mentalHealthCalculations';
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
  planetaryPositions: [
    { planet: 'Sun', longitude: 10, latitude: 0, speed: 1, house: 1, sign: 'Aries', signDegree: 10, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'exalted' },
    { planet: 'Moon', longitude: 40, latitude: 0, speed: 13, house: 2, sign: 'Taurus', signDegree: 10, nakshatra: 'Rohini', nakshatraPada: 2, isRetrograde: false, isCombust: false, dignity: 'exalted' },
    { planet: 'Mars', longitude: 280, latitude: 0, speed: 0.5, house: 10, sign: 'Capricorn', signDegree: 10, nakshatra: 'Shravana', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'exalted' },
    { planet: 'Mercury', longitude: 170, latitude: 0, speed: 1.5, house: 6, sign: 'Virgo', signDegree: 20, nakshatra: 'Hasta', nakshatraPada: 3, isRetrograde: false, isCombust: false, dignity: 'own_house' },
    { planet: 'Jupiter', longitude: 90, latitude: 0, speed: 0.1, house: 4, sign: 'Cancer', signDegree: 0, nakshatra: 'Punarvasu', nakshatraPada: 4, isRetrograde: false, isCombust: false, dignity: 'exalted' },
    { planet: 'Venus', longitude: 330, latitude: 0, speed: 1.2, house: 12, sign: 'Pisces', signDegree: 0, nakshatra: 'Revati', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'exalted' },
    { planet: 'Saturn', longitude: 200, latitude: 0, speed: 0.05, house: 7, sign: 'Libra', signDegree: 20, nakshatra: 'Vishakha', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'exalted' },
    { planet: 'Rahu', longitude: 120, latitude: 0, speed: -0.05, house: 5, sign: 'Leo', signDegree: 0, nakshatra: 'Magha', nakshatraPada: 1, isRetrograde: true, isCombust: false, dignity: 'neutral' },
    { planet: 'Ketu', longitude: 300, latitude: 0, speed: -0.05, house: 11, sign: 'Aquarius', signDegree: 0, nakshatra: 'Dhanishta', nakshatraPada: 3, isRetrograde: true, isCombust: false, dignity: 'neutral' }
  ],
  houses: Array.from({ length: 12 }, (_, i) => ({
    houseNumber: i + 1,
    sign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][i],
    degree: i * 30,
    planets: [],
    lord: ['Mars', 'Venus', 'Mercury', 'Moon', 'Sun', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Saturn', 'Jupiter'][i]
  })),
  vargaCharts: {
    D1: { ascendant: 'Aries', houses: [], planetaryPositions: [] },
    D9: { ascendant: 'Leo', houses: [], planetaryPositions: [] }
  },
  specialPoints: {
    atmakaraka: 'Sun',
    darakaraka: 'Venus',
    upapadaLagna: 'Libra',
    vivahSaham: 120.5
  },
  createdAt: new Date(),
  yogas: [],
  kp: { cusps: [], significators: [] },
  dashas: [],
  nakshatra: 'Ashwini',
  nakshatraLord: 'Ketu',
  pada: 1,
  ...overrides
});

describe('Mental Health Analysis', () => {
  it('should return a valid mental health analysis object', () => {
    const chart = createMockChart();
    const result = analyzeMentalHealth(chart);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('categories');
    expect(result).toHaveProperty('overallWellbeing');
    expect(result).toHaveProperty('totalRiskScore');
    expect(result).toHaveProperty('disclaimer');
    expect(Array.isArray(result.categories)).toBe(true);
  });

  it('should have valid risk levels for all categories', () => {
    const chart = createMockChart();
    const result = analyzeMentalHealth(chart);

    const validRiskLevels = ['low', 'moderate', 'elevated', 'high'];

    result.categories.forEach((cat: any) => {
      expect(cat).toHaveProperty('label');
      expect(cat).toHaveProperty('riskLevel');
      expect(validRiskLevels).toContain(cat.riskLevel);
    });
  });

  it('should have a totalRiskScore between 0 and 100', () => {
    const chart = createMockChart();
    const result = analyzeMentalHealth(chart);

    expect(result.totalRiskScore).toBeGreaterThanOrEqual(0);
    expect(result.totalRiskScore).toBeLessThanOrEqual(100);
  });

  it('should have overallWellbeing as valid category', () => {
    const chart = createMockChart();
    const result = analyzeMentalHealth(chart);

    const validWellbeing = ['strong', 'moderate', 'vulnerable', 'at_risk'];
    expect(validWellbeing).toContain(result.overallWellbeing);
  });

  it('should include a disclaimer', () => {
    const chart = createMockChart();
    const result = analyzeMentalHealth(chart);

    expect(result.disclaimer).toBeTruthy();
    expect(typeof result.disclaimer).toBe('string');
    expect(result.disclaimer.length).toBeGreaterThan(10);
  });

  it('should handle chart with Moon in different signs', () => {
    const signs = ['Aries', 'Taurus', 'Cancer', 'Scorpio', 'Pisces', 'Capricorn'];

    signs.forEach(sign => {
      const chart = createMockChart({
        planetaryPositions: [
          { planet: 'Moon', longitude: 0, latitude: 0, speed: 13, house: 1, sign: sign as any, signDegree: 10, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'neutral' },
          { planet: 'Saturn', longitude: 200, latitude: 0, speed: 0.05, house: 7, sign: 'Libra', signDegree: 20, nakshatra: 'Vishakha', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'neutral' },
        ]
      });

      const result = analyzeMentalHealth(chart);
      expect(result).toBeDefined();
      expect(result.totalRiskScore).toBeGreaterThanOrEqual(0);
    });
  });
});
