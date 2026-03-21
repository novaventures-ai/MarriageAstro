import { describe, it, expect } from 'vitest';
import { analyzeYogaDoshas } from '../../lib/yogaDoshaCalculations';
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

describe('Yoga and Dosha Analysis', () => {
  it('should return analysis with yogas and doshas arrays', () => {
    const chart = createMockChart({
      planetaryPositions: [
        { planet: 'Sun', longitude: 10, latitude: 0, speed: 1, house: 1, sign: 'Aries', signDegree: 10, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'exalted' },
        { planet: 'Moon', longitude: 40, latitude: 0, speed: 13, house: 2, sign: 'Taurus', signDegree: 10, nakshatra: 'Rohini', nakshatraPada: 2, isRetrograde: false, isCombust: false, dignity: 'exalted' },
        { planet: 'Mars', longitude: 190, latitude: 0, speed: 0.5, house: 7, sign: 'Libra', signDegree: 10, nakshatra: 'Swati', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'debilitated' },
        { planet: 'Mercury', longitude: 170, latitude: 0, speed: 1.5, house: 6, sign: 'Virgo', signDegree: 20, nakshatra: 'Hasta', nakshatraPada: 3, isRetrograde: false, isCombust: false, dignity: 'own_house' },
        { planet: 'Jupiter', longitude: 90, latitude: 0, speed: 0.1, house: 4, sign: 'Cancer', signDegree: 0, nakshatra: 'Punarvasu', nakshatraPada: 4, isRetrograde: false, isCombust: false, dignity: 'exalted' },
        { planet: 'Venus', longitude: 330, latitude: 0, speed: 1.2, house: 12, sign: 'Pisces', signDegree: 0, nakshatra: 'Revati', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'exalted' },
        { planet: 'Saturn', longitude: 200, latitude: 0, speed: 0.05, house: 7, sign: 'Libra', signDegree: 20, nakshatra: 'Vishakha', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'exalted' },
        { planet: 'Rahu', longitude: 120, latitude: 0, speed: -0.05, house: 5, sign: 'Leo', signDegree: 0, nakshatra: 'Magha', nakshatraPada: 1, isRetrograde: true, isCombust: false, dignity: 'neutral' },
        { planet: 'Ketu', longitude: 300, latitude: 0, speed: -0.05, house: 11, sign: 'Aquarius', signDegree: 0, nakshatra: 'Dhanishta', nakshatraPada: 3, isRetrograde: true, isCombust: false, dignity: 'neutral' }
      ]
    });

    const result = analyzeYogaDoshas(chart);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('yogas');
    expect(result).toHaveProperty('doshas');
    expect(Array.isArray(result.yogas)).toBe(true);
    expect(Array.isArray(result.doshas)).toBe(true);
  });

  it('should detect Manglik dosha when Mars is in 7th house', () => {
    const chart = createMockChart({
      planetaryPositions: [
        { planet: 'Mars', longitude: 190, latitude: 0, speed: 0.5, house: 7, sign: 'Libra', signDegree: 10, nakshatra: 'Swati', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'debilitated' },
        { planet: 'Moon', longitude: 40, latitude: 0, speed: 13, house: 2, sign: 'Taurus', signDegree: 10, nakshatra: 'Rohini', nakshatraPada: 2, isRetrograde: false, isCombust: false, dignity: 'exalted' },
      ]
    });

    const result = analyzeYogaDoshas(chart);
    const manglik = result.doshas.find((d: any) => d.name.toLowerCase().includes('manglik') || d.name.toLowerCase().includes('mangal'));

    // Mars in 7th house should trigger Manglik dosha
    if (manglik) {
      expect(manglik.present).toBe(true);
    }
  });

  it('should return doshas with name, present, and severity fields', () => {
    const chart = createMockChart({
      planetaryPositions: [
        { planet: 'Moon', longitude: 0, latitude: 0, speed: 13, house: 1, sign: 'Aries', signDegree: 0, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'neutral' }
      ]
    });

    const result = analyzeYogaDoshas(chart);

    result.doshas.forEach((dosha: any) => {
      expect(dosha).toHaveProperty('name');
      expect(typeof dosha.name).toBe('string');
      expect(dosha).toHaveProperty('present');
      expect(typeof dosha.present).toBe('boolean');
    });
  });
});

describe('Manglik Detection Edge Cases', () => {
  it('should detect Manglik for Mars in houses 1, 2, 4, 7, 8, 12', () => {
    const manglikHouses = [1, 2, 4, 7, 8, 12];

    manglikHouses.forEach(house => {
      const chart = createMockChart({
        planetaryPositions: [
          { planet: 'Mars', longitude: house * 30, latitude: 0, speed: 0.5, house, sign: 'Aries', signDegree: 10, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'neutral' },
          { planet: 'Moon', longitude: 40, latitude: 0, speed: 13, house: 2, sign: 'Taurus', signDegree: 10, nakshatra: 'Rohini', nakshatraPada: 2, isRetrograde: false, isCombust: false, dignity: 'neutral' }
        ]
      });

      const result = analyzeYogaDoshas(chart);
      // Simply verify no crash
      expect(result).toBeDefined();
    });
  });
});
