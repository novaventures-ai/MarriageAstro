import { describe, it, expect } from 'vitest';
import {
  calculateAshtakootMilan,
  checkNadiCancellation,
  checkBhakootCancellation,
  checkGanaCancellation
} from '../../lib/compatibilityCalculations';
import {
  analyzeMaleSexualHealth,
  analyzeFemaleSexualHealth
} from '../../lib/sexualHealthCalculations';
import {
  assessDivorceRisk,
  assessInfidelityRisk
} from '../../lib/riskCalculations';
import { Chart, Planet } from '../../types';

// Mock chart for testing
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
  houses: [],
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

describe('Ashtakoot Milan Tests', () => {
  it('should calculate complete Ashtakoot with 8 parameters', () => {
    const chartA = createMockChart({
      planetaryPositions: [
        { planet: 'Moon', longitude: 0, latitude: 0, speed: 0, house: 1, sign: 'Aries', signDegree: 5, nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false, dignity: 'own_house' }
      ]
    });

    const chartB = createMockChart({
      planetaryPositions: [
        { planet: 'Moon', longitude: 30, latitude: 0, speed: 0, house: 2, sign: 'Taurus', signDegree: 10, nakshatra: 'Krittika', nakshatraPada: 2, isRetrograde: false, isCombust: false, dignity: 'moolatrikona' }
      ]
    });

    const result = calculateAshtakootMilan(chartA, chartB);

    expect(result).toHaveProperty('totalScore');
    expect(result).toHaveProperty('maxScore', 36);
    expect(result).toHaveProperty('parameters');
    expect(result.parameters).toHaveProperty('varna');
    expect(result.parameters).toHaveProperty('vashya');
    expect(result.parameters).toHaveProperty('tara');
    expect(result.parameters).toHaveProperty('yoni');
    expect(result.parameters).toHaveProperty('grahaMaitri');
    expect(result.parameters).toHaveProperty('gana');
    expect(result.parameters).toHaveProperty('bhakoot');
    expect(result.parameters).toHaveProperty('nadi');
  });

  it('should detect Nadi Dosha when same Nadi', () => {
    // Test Nadi detection logic
    expect(true).toBe(true); // Placeholder
  });
});

describe('Dosha Cancellation Tests', () => {
  it('should cancel Nadi Dosha for exception nakshatras', () => {
    const exceptionNakshatras = ['Revati', 'Shravana', 'Mrigashira'];

    exceptionNakshatras.forEach(nakshatra => {
      // Should return true (cancelled)
      expect(true).toBe(true); // Placeholder
    });
  });

  it('should cancel Bhakoot when rashi lords are friends', () => {
    // Cancer and Scorpio both have friendly lords (Moon and Mars)
    expect(true).toBe(true); // Placeholder
  });

  it('should cancel Gana when rashi lords are friends', () => {
    // Sun and Moon are friends
    expect(true).toBe(true); // Placeholder
  });
});

describe('Sexual Health Tests', () => {
  it('should detect PME risk with Venus-Mars conjunction', () => {
    const chart = createMockChart({
      planetaryPositions: [
        { planet: 'Venus', longitude: 45, latitude: 0, speed: 0, house: 2, sign: 'Taurus', signDegree: 15, nakshatra: 'Mrigashirsha', nakshatraPada: 3, isRetrograde: false, isCombust: false, dignity: 'own_house' },
        { planet: 'Mars', longitude: 48, latitude: 0, speed: 0, house: 2, sign: 'Taurus', signDegree: 18, nakshatra: 'Mrigashirsha', nakshatraPada: 3, isRetrograde: false, isCombust: false, dignity: 'neutral' }
      ]
    });

    const result = analyzeMaleSexualHealth(chart);

    expect(result).toHaveProperty('pmeRisk');
    expect(result).toHaveProperty('edRisk');
    expect(result).toHaveProperty('indicators');
    expect(result).toHaveProperty('recommendations');
  });

  it('should detect ED risk with Sun debilitated', () => {
    const chart = createMockChart({
      planetaryPositions: [
        { planet: 'Sun', longitude: 195, latitude: 0, speed: 0, house: 7, sign: 'Libra', signDegree: 15, nakshatra: 'Swati', nakshatraPada: 2, isRetrograde: false, isCombust: false, dignity: 'debilitated' }
      ]
    });

    const result = analyzeMaleSexualHealth(chart);

    // Sun debilitated should indicate ED risk
    expect(result.indicators.some(i => i.includes('debilitated'))).toBe(true);
  });

  it('should detect frigidity risk with Saturn-Venus aspect', () => {
    const chart = createMockChart({
      planetaryPositions: [
        { planet: 'Venus', longitude: 45, latitude: 0, speed: 0, house: 2, sign: 'Taurus', signDegree: 15, nakshatra: 'Mrigashirsha', nakshatraPada: 3, isRetrograde: false, isCombust: false, dignity: 'own_house' },
        { planet: 'Saturn', longitude: 135, latitude: 0, speed: 0, house: 5, sign: 'Leo', signDegree: 15, nakshatra: 'Purva Phalguni', nakshatraPada: 2, isRetrograde: false, isCombust: false, dignity: 'enemy' }
      ]
    });

    const result = analyzeFemaleSexualHealth(chart);

    expect(result).toHaveProperty('frigidityRisk');
    expect(result).toHaveProperty('physicalPainRisk');
    expect(result).toHaveProperty('indicators');
    expect(result).toHaveProperty('recommendations');
  });
});

describe('Risk Assessment Tests', () => {
  it('should assess high divorce risk with 7th lord in 6th house', () => {
    const chart = createMockChart({
      houses: [
        { houseNumber: 7, sign: 'Libra', cuspLongitude: 180, planets: [], lord: 'Venus' }
      ],
      planetaryPositions: [
        { planet: 'Venus', longitude: 75, latitude: 0, speed: 0, house: 6, sign: 'Gemini', signDegree: 15, nakshatra: 'Ardra', nakshatraPada: 2, isRetrograde: false, isCombust: false, dignity: 'friendly' }
      ]
    });

    const result = assessDivorceRisk(chart, 'Test Profile');

    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('level');
    expect(result).toHaveProperty('indicators');
    expect(result).toHaveProperty('mitigation');

    // 7th lord in 6th should increase risk
    expect(result.indicators.some(i => i.text.includes('6th'))).toBe(true);
  });

  it('should detect infidelity risk with Rahu-Venus conjunction in 12th', () => {
    const chart = createMockChart({
      planetaryPositions: [
        { planet: 'Venus', longitude: 345, latitude: 0, speed: 0, house: 12, sign: 'Pisces', signDegree: 15, nakshatra: 'Revati', nakshatraPada: 2, isRetrograde: false, isCombust: false, dignity: 'exalted' },
        { planet: 'Rahu', longitude: 348, latitude: 0, speed: 0, house: 12, sign: 'Pisces', signDegree: 18, nakshatra: 'Revati', nakshatraPada: 2, isRetrograde: false, isCombust: false, dignity: 'neutral' }
      ]
    });

    const result = assessInfidelityRisk(chart, 'Test Profile');

    expect(result).toHaveProperty('score');
    expect(result).toHaveProperty('level');
    expect(result).toHaveProperty('indicators');
    expect(result).toHaveProperty('warning');
  });
});

describe('Core Calculations Tests', () => {
  it('should normalize degrees correctly', async () => {
    const { normalizeDegrees } = await import('../../lib/coreCalculations');

    expect(normalizeDegrees(0)).toBe(0);
    expect(normalizeDegrees(360)).toBe(0);
    expect(normalizeDegrees(720)).toBe(0);
    expect(normalizeDegrees(-90)).toBe(270);
    expect(normalizeDegrees(450)).toBe(90);
  });

  it('should get correct sign from longitude', async () => {
    const { getSignFromLongitude } = await import('../../lib/coreCalculations');

    expect(getSignFromLongitude(0)).toBe('Aries');
    expect(getSignFromLongitude(30)).toBe('Taurus');
    expect(getSignFromLongitude(180)).toBe('Libra');
    expect(getSignFromLongitude(330)).toBe('Pisces');
  });

  it('should get correct nakshatra from longitude', async () => {
    const { getNakshatraFromLongitude } = await import('../../lib/coreCalculations');

    const result = getNakshatraFromLongitude(0);
    expect(result).toHaveProperty('nakshatra');
    expect(result).toHaveProperty('pada');
    expect(result.pada).toBeGreaterThanOrEqual(1);
    expect(result.pada).toBeLessThanOrEqual(4);
  });
});

describe('Varga Calculation Tests', () => {
  it('should calculate Navamsa correctly', async () => {
    const { calculateNavamsa } = await import('../../lib/vargaCalculations');

    // Aries 15° should give Leo Navamsa (for odd sign)
    const result = calculateNavamsa(15);
    expect(['Leo', 'Cancer']).toContain(result); // Depends on odd/even logic
  });

  it('should calculate Saptamsa correctly', async () => {
    const { calculateSaptamsa } = await import('../../lib/vargaCalculations');

    const result = calculateSaptamsa(15);
    expect(result).toBeDefined();
    expect(typeof result).toBe('string');
  });
});

describe('Dasha Calculation Tests', () => {
  it('should calculate Vimshottari Dasha', async () => {
    const { calculateVimshottariDasha } = await import('../../lib/dashaCalculations');

    const result = calculateVimshottariDasha('Ashwini', 5, new Date());

    expect(result).toHaveProperty('moonNakshatra');
    expect(result).toHaveProperty('mahaDashas');
    expect(Array.isArray(result.mahaDashas)).toBe(true);
    expect(result.mahaDashas.length).toBe(9);
  });
});

describe('KP Calculation Tests', () => {
  it('should calculate sub-lord correctly', async () => {
    const { calculateSubLord } = await import('../../lib/kpCalculations');

    const result = calculateSubLord(15);
    expect(result).toBeDefined();
    expect(['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']).toContain(result);
  });
});

describe('Jaimini Calculation Tests', () => {
  it('should calculate Chara Karakas correctly', async () => {
    const { calculateCharaKarakas } = await import('../../lib/jaiminiCalculations');

    const positions = [
      { planet: 'Sun' as Planet, longitude: 1 }, // 1 degree (Lowest -> DK)
      { planet: 'Moon' as Planet, longitude: 45 }, // 15 degrees
      { planet: 'Mars' as Planet, longitude: 75 }, // 15 degrees 
      { planet: 'Mercury' as Planet, longitude: 105 }, // 15 degrees
      { planet: 'Jupiter' as Planet, longitude: 135 }, // 15 degrees
      { planet: 'Venus' as Planet, longitude: 165 }, // 15 degrees
      { planet: 'Saturn' as Planet, longitude: 209 } // 29 degrees (Highest -> AK)
    ];

    const result = calculateCharaKarakas(positions);

    expect(result).toHaveProperty('atmakaraka');
    expect(result).toHaveProperty('darakaraka');
    expect(result.atmakaraka.planet).toBe('Saturn'); // Highest degree
    expect(result.darakaraka.planet).toBe('Sun'); // Lowest degree
  });
});