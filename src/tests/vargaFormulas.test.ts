import { describe, it, expect } from 'vitest';
import { calculateVargaChart } from '../lib/astro/calculations';

// Verifies the divisional-chart rules that previously fell through to a
// placeholder formula (D20, D27, D30, D40, D45). Expected placements are
// derived from the classical rules:
//   D20 — 20 × 1°30'; movable→Aries, fixed→Sagittarius, dual→Leo
//   D27 — 27 × 1°6'40"; fire→Aries, earth→Cancer, air→Libra, water→Capricorn
//   D30 — unequal; odd: Mars 0-5 Aries, Sat 5-10 Aquarius, Jup 10-18 Sagittarius,
//         Mer 18-25 Gemini, Ven 25-30 Libra. even: reversed to Venus/Mercury/
//         Jupiter/Saturn/Mars → Taurus/Virgo/Pisces/Capricorn/Scorpio
//   D40 — 40 × 45'; odd→Aries, even→Libra
//   D45 — 45 × 40'; movable→Aries, fixed→Leo, dual→Sagittarius
const SIGNS = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

/** Place a single planet at `signIndex` + `deg` and read back its varga sign. */
function vargaSignOf(division: number, signIndex: number, deg: number): string {
  const longitude = signIndex * 30 + deg;
  const planets = [{
    planet: 'Sun', longitude, sign: SIGNS[signIndex], signIndex,
    degree: Math.floor(deg), minute: 0, second: 0,
    nakshatra: 'Ashwini', nakshatraIndex: 0, nakshatraPada: 1,
    isRetrograde: false, house: 1, speed: 1, dignity: 'neutral',
  }] as any[];
  const varga = calculateVargaChart(planets, 0, division, `D${division}`);
  return varga.planets[0].sign;
}

describe('Divisional chart formulas (D20/D27/D30/D40/D45)', () => {
  it('D20 starts from Aries / Sagittarius / Leo by sign modality', () => {
    // First part (0°) of a movable (Aries=0), fixed (Taurus=1), dual (Gemini=2) sign.
    expect(vargaSignOf(20, 0, 0.5)).toBe('Aries');       // movable → Aries
    expect(vargaSignOf(20, 1, 0.5)).toBe('Sagittarius'); // fixed → Sagittarius
    expect(vargaSignOf(20, 2, 0.5)).toBe('Leo');         // dual → Leo
    // Second part (1°30'–3°) advances one sign from the start.
    expect(vargaSignOf(20, 0, 2)).toBe('Taurus');
  });

  it('D27 starts from Aries / Cancer / Libra / Capricorn by element', () => {
    expect(vargaSignOf(27, 0, 0.5)).toBe('Aries');     // Aries = fire
    expect(vargaSignOf(27, 1, 0.5)).toBe('Cancer');    // Taurus = earth
    expect(vargaSignOf(27, 2, 0.5)).toBe('Libra');     // Gemini = air
    expect(vargaSignOf(27, 3, 0.5)).toBe('Capricorn'); // Cancer = water
  });

  it('D30 uses the unequal five-part division for ODD signs', () => {
    // Aries (odd): Mars 0-5, Saturn 5-10, Jupiter 10-18, Mercury 18-25, Venus 25-30
    expect(vargaSignOf(30, 0, 2)).toBe('Aries');
    expect(vargaSignOf(30, 0, 7)).toBe('Aquarius');
    expect(vargaSignOf(30, 0, 14)).toBe('Sagittarius');
    expect(vargaSignOf(30, 0, 20)).toBe('Gemini');
    expect(vargaSignOf(30, 0, 28)).toBe('Libra');
  });

  it('D30 reverses quantum and lordship for EVEN signs', () => {
    // Taurus (even): Venus 0-5, Mercury 5-12, Jupiter 12-20, Saturn 20-25, Mars 25-30
    expect(vargaSignOf(30, 1, 2)).toBe('Taurus');
    expect(vargaSignOf(30, 1, 8)).toBe('Virgo');
    expect(vargaSignOf(30, 1, 15)).toBe('Pisces');
    expect(vargaSignOf(30, 1, 22)).toBe('Capricorn');
    expect(vargaSignOf(30, 1, 28)).toBe('Scorpio');
  });

  it('D40 starts from Aries for odd signs and Libra for even signs', () => {
    expect(vargaSignOf(40, 0, 0.2)).toBe('Aries'); // Aries = odd
    expect(vargaSignOf(40, 1, 0.2)).toBe('Libra'); // Taurus = even
  });

  it('D45 starts from Aries / Leo / Sagittarius by sign modality', () => {
    expect(vargaSignOf(45, 0, 0.2)).toBe('Aries');       // movable
    expect(vargaSignOf(45, 1, 0.2)).toBe('Leo');         // fixed
    expect(vargaSignOf(45, 2, 0.2)).toBe('Sagittarius'); // dual
  });

  it('every division maps into a valid sign across a whole sign sweep', () => {
    for (const division of [20, 27, 30, 40, 45]) {
      for (let s = 0; s < 12; s++) {
        for (let d = 0; d < 30; d += 0.5) {
          expect(SIGNS, `D${division} sign ${s} deg ${d}`).toContain(vargaSignOf(division, s, d));
        }
      }
    }
  });
});
