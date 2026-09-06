import { describe, it, expect } from 'vitest';
import { calculateRelationshipPatterns } from '../../lib/relationshipPatternCalculations';
import type { Chart, PlanetaryPosition } from '../types';

/**
 * This card used to print "4 or more connections likely" — a factual claim about
 * a real person's romantic history, inferred from a temperament score. In an
 * arranged match it was read as a character verdict, and the low bands were
 * worse: "few or no significant connections" behind a green badge worked as a
 * purity certificate and ranked chastity as the good outcome.
 *
 * The score now describes HOW someone attaches. These tests exist so nobody can
 * reintroduce a count, a purity reading, or a severity ranking without a test
 * turning red — the failure mode is silent copy drift, not a crash.
 */

function planet(p: Partial<PlanetaryPosition> & { planet: string }): PlanetaryPosition {
  return {
    longitude: 0, latitude: 0, speed: 1, house: 1, sign: 'Aries', signDegree: 10,
    nakshatra: 'Ashwini', nakshatraPada: 1, isRetrograde: false, isCombust: false,
    dignity: 'neutral', ...p,
  } as PlanetaryPosition;
}

/** A chart dialled to a chosen intensity: `hot` loads the 5th house. */
function chartWith(hot: boolean): Chart {
  const planets = hot
    ? [
        planet({ planet: 'Rahu', house: 5 }),
        planet({ planet: 'Mars', house: 5 }),
        planet({ planet: 'Moon', house: 5 }),
        planet({ planet: 'Venus', house: 4, sign: 'Virgo', dignity: 'debilitated' }),
        planet({ planet: 'Jupiter', house: 6 }),
      ]
    : [
        planet({ planet: 'Rahu', house: 11 }),
        planet({ planet: 'Mars', house: 10 }),
        planet({ planet: 'Moon', house: 2, nakshatra: 'Ashwini' }),
        planet({ planet: 'Venus', house: 2, sign: 'Taurus', dignity: 'own' }),
        planet({ planet: 'Jupiter', house: 9, dignity: 'exalted' }),
      ];
  return {
    id: 't', name: 'Test', gender: 'male', dateOfBirth: new Date('1995-09-28'),
    timeOfBirth: '00:50', location: 'Mumbai', latitude: 19.07, longitude: 72.87,
    timezone: '5.5', ayanamsha: 'lahiri', ascendant: 'Gemini',
    planetaryPositions: planets,
    houses: [],
    // D9 must carry real placements: the neutraliser path reads
    // vargaCharts.D9.planetaryPositions, as every real chart supplies.
    vargaCharts: {
      D1: { ascendant: 'Gemini', houses: [], planetaryPositions: planets } as any,
      D9: { ascendant: 'Aries', houses: [], planetaryPositions: planets } as any,
    },
    yogas: [], kp: { cusps: [], significators: [] }, dashas: [],
    specialPoints: { atmakaraka: 'Sun', darakaraka: 'Venus', upapadaLagna: 'Aries', vivahSaham: 0 },
    nakshatra: 'Vishakha',
  } as unknown as Chart;
}

/** Anything that reads as "N relationships". */
const COUNT_PATTERNS = [
  /\b\d+\s*(or more|\+)?\s*(connections?|relationships?|partners?|affairs?)\b/i,
  /\b(one|two|three|four|five|several|many|multiple)\s+(connections?|relationships?|partners?)\b/i,
  /\b\d+\s*[–-]\s*\d+\b/,            // "2–3", "3-4"
  /connections? likely/i,
  /connections? indicated/i,
];

function card(chart: Chart, audience: 'self' | 'couple') {
  const out = calculateRelationshipPatterns(chart, 'Test', audience);
  const label = audience === 'self' ? 'How You Love' : 'Attachment Style';
  const found = out.karmaIndicators.find(k => k.label === label);
  expect(found, `no "${label}" card produced`).toBeTruthy();
  return found!;
}

describe('attachment style card', () => {
  const cases: [string, Chart][] = [['intense chart', chartWith(true)], ['reserved chart', chartWith(false)]];

  it('never states a relationship count, in either audience', () => {
    for (const [name, chart] of cases) {
      for (const audience of ['self', 'couple'] as const) {
        const c = card(chart, audience);
        const text = `${c.value} ${c.note}`;
        for (const re of COUNT_PATTERNS) {
          expect(re.test(text), `${name}/${audience} leaked a count: "${text}"`).toBe(false);
        }
      }
    }
  });

  it('no longer advertises a "Pre-Marital Relationship Count" card', () => {
    for (const [, chart] of cases) {
      for (const audience of ['self', 'couple'] as const) {
        const labels = calculateRelationshipPatterns(chart, 'Test', audience)
          .karmaIndicators.map(k => k.label);
        expect(labels).not.toContain('Pre-Marital Relationship Count');
      }
    }
  });

  it('a reserved chart is never presented as an absence of history', () => {
    const c = card(chartWith(false), 'couple');
    const text = `${c.value} ${c.note}`.toLowerCase();
    // The purity readings the old copy produced.
    for (const phrase of ['few or no', 'no significant', 'inexperienced', 'pure', 'untouched', 'virgin']) {
      expect(text, `reserved chart read as a purity claim via "${phrase}"`).not.toContain(phrase);
    }
    // And it must carry the explicit disclaimer.
    expect(text).toContain('not how much of one');
  });

  it('does not rank temperaments by severity colour', () => {
    const hot = card(chartWith(true), 'couple');
    const cool = card(chartWith(false), 'couple');
    // Identical severity => the UI cannot paint one green and the other red.
    expect(hot.severity).toBe(cool.severity);
  });

  it('speaks in second person for self, third for couple', () => {
    const self = card(chartWith(true), 'self');
    expect(`${self.value} ${self.note}`.toLowerCase()).toMatch(/\byou\b/);

    const couple = card(chartWith(true), 'couple');
    expect(couple.value.toLowerCase()).not.toMatch(/\byou\b/);
  });

  it('still differentiates — an intense chart reads differently from a reserved one', () => {
    expect(card(chartWith(true), 'couple').value)
      .not.toBe(card(chartWith(false), 'couple').value);
  });

  it('still explains which placements drive it', () => {
    const c = card(chartWith(true), 'couple');
    expect(c.note).toContain('What shapes this');
    expect(c.note).toMatch(/5th/);
  });
});
