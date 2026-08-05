/**
 * Ashtakavarga — Bhinnashtakavarga (BAV) per planet + Sarvashtakavarga (SAV)
 * ---------------------------------------------------------------------------
 * A point (bindu) system: each of the seven classical planets earns benefic
 * points in the twelve signs, contributed from eight reference bodies (the
 * seven planets + the Lagna) according to fixed classical tables. Summing the
 * seven planets' charts gives the Sarvashtakavarga — the standard tool for
 * judging which signs/houses support a planet's transit.
 *
 * The benefic-place tables below are the classical Parashari values. They are
 * validated at module load against the well-known per-planet totals
 * (Sun 48, Moon 49, Mars 39, Mercury 54, Jupiter 56, Venus 52, Saturn 39;
 * SAV grand total 337) — a wrong transcription would throw immediately rather
 * than silently produce authoritative-looking but wrong output.
 */
import { Chart, Planet, Sign } from '../src/types/index.js';
import { SIGNS } from './coreCalculations.js';

type Contributor = 'Sun' | 'Moon' | 'Mars' | 'Mercury' | 'Jupiter' | 'Venus' | 'Saturn' | 'Lagna';

const CONTRIBUTORS: Contributor[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Lagna'];
const BAV_PLANETS: Planet[] = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];

/** Benefic houses (1–12, counted from the contributor's sign) for each planet. */
const BENEFIC: Record<string, Record<Contributor, number[]>> = {
  Sun: {
    Sun: [1, 2, 4, 7, 8, 9, 10, 11], Moon: [3, 6, 10, 11], Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [3, 5, 6, 9, 10, 11, 12], Jupiter: [5, 6, 9, 11], Venus: [6, 7, 12],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11], Lagna: [3, 4, 6, 10, 11, 12],
  },
  Moon: {
    Sun: [3, 6, 7, 8, 10, 11], Moon: [1, 3, 6, 7, 10, 11], Mars: [2, 3, 5, 6, 9, 10, 11],
    Mercury: [1, 3, 4, 5, 7, 8, 10, 11], Jupiter: [1, 4, 7, 8, 10, 11, 12], Venus: [3, 4, 5, 7, 9, 10, 11],
    Saturn: [3, 5, 6, 11], Lagna: [3, 6, 10, 11],
  },
  Mars: {
    Sun: [3, 5, 6, 10, 11], Moon: [3, 6, 11], Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [3, 5, 6, 11], Jupiter: [6, 10, 11, 12], Venus: [6, 8, 11, 12],
    Saturn: [1, 4, 7, 8, 9, 10, 11], Lagna: [1, 3, 6, 10, 11],
  },
  Mercury: {
    Sun: [5, 6, 9, 11, 12], Moon: [2, 4, 6, 8, 10, 11], Mars: [1, 2, 4, 7, 8, 9, 10, 11],
    Mercury: [1, 3, 5, 6, 9, 10, 11, 12], Jupiter: [6, 8, 11, 12], Venus: [1, 2, 3, 4, 5, 8, 9, 11],
    Saturn: [1, 2, 4, 7, 8, 9, 10, 11], Lagna: [1, 2, 4, 6, 8, 10, 11],
  },
  Jupiter: {
    Sun: [1, 2, 3, 4, 7, 8, 9, 10, 11], Moon: [2, 5, 7, 9, 11], Mars: [1, 2, 4, 7, 8, 10, 11],
    Mercury: [1, 2, 4, 5, 6, 9, 10, 11], Jupiter: [1, 2, 3, 4, 7, 8, 10, 11], Venus: [2, 5, 6, 9, 10, 11],
    Saturn: [3, 5, 6, 12], Lagna: [1, 2, 4, 5, 6, 7, 9, 10, 11],
  },
  Venus: {
    Sun: [8, 11, 12], Moon: [1, 2, 3, 4, 5, 8, 9, 11, 12], Mars: [3, 5, 6, 9, 11, 12],
    Mercury: [3, 5, 6, 9, 11], Jupiter: [5, 8, 9, 10, 11], Venus: [1, 2, 3, 4, 5, 8, 9, 10, 11],
    Saturn: [3, 4, 5, 8, 9, 10, 11], Lagna: [1, 2, 3, 4, 5, 8, 9, 11],
  },
  Saturn: {
    Sun: [1, 2, 4, 7, 8, 10, 11], Moon: [3, 6, 11], Mars: [3, 5, 6, 10, 11, 12],
    Mercury: [6, 8, 9, 10, 11, 12], Jupiter: [5, 6, 11, 12], Venus: [6, 11, 12],
    Saturn: [3, 5, 6, 11], Lagna: [1, 3, 4, 6, 10, 11],
  },
};

/** Classical per-planet bindu totals — used as an integrity check on the tables. */
export const CLASSICAL_BAV_TOTALS: Record<string, number> = {
  Sun: 48, Moon: 49, Mars: 39, Mercury: 54, Jupiter: 56, Venus: 52, Saturn: 39,
};

// Fail fast at module load if any table was mis-transcribed.
for (const planet of BAV_PLANETS) {
  const total = CONTRIBUTORS.reduce((sum, c) => sum + BENEFIC[planet][c].length, 0);
  if (total !== CLASSICAL_BAV_TOTALS[planet]) {
    throw new Error(`Ashtakavarga table error: ${planet} sums to ${total}, expected ${CLASSICAL_BAV_TOTALS[planet]}`);
  }
}

export interface BavChart {
  /** Bindus per sign, index 0 = Aries … 11 = Pisces. */
  bySign: number[];
  /** Bindus per house, index 0 = 1st house (from the Lagna) … 11 = 12th. */
  byHouse: number[];
  /** Total bindus (equals the classical constant for this planet). */
  total: number;
  /** Bindus in the sign the planet itself occupies. */
  inOwnSign: number;
}

export interface AshtakavargaResult {
  /** Per-planet Bhinnashtakavarga. */
  bhinna: Record<string, BavChart>;
  /** Sarvashtakavarga — sum of the seven planets. */
  sarva: { bySign: number[]; byHouse: number[]; total: number };
  /** index → Sign, so a caller can label bySign[]. */
  signOrder: Sign[];
  ascendantSign: Sign;
}

export function calculateAshtakavarga(chart: Chart): AshtakavargaResult {
  const ascIndex = Math.max(0, SIGNS.indexOf(chart.ascendant as Sign));

  const signIndexOf = (body: Contributor): number => {
    if (body === 'Lagna') return ascIndex;
    const p = chart.planetaryPositions.find(pp => pp.planet === body);
    const idx = p ? SIGNS.indexOf(p.sign as Sign) : -1;
    return idx >= 0 ? idx : 0;
  };

  const contributorSign: Record<Contributor, number> = {} as Record<Contributor, number>;
  for (const c of CONTRIBUTORS) contributorSign[c] = signIndexOf(c);

  const toHouse = (bySign: number[]): number[] =>
    Array.from({ length: 12 }, (_, h) => bySign[(ascIndex + h) % 12]);

  const bhinna: Record<string, BavChart> = {};
  const savBySign = new Array(12).fill(0);

  for (const planet of BAV_PLANETS) {
    const bySign = new Array(12).fill(0);
    for (const c of CONTRIBUTORS) {
      const from = contributorSign[c];
      for (const house of BENEFIC[planet][c]) {
        bySign[(from + (house - 1)) % 12] += 1;
      }
    }
    const total = bySign.reduce((a, b) => a + b, 0);
    bhinna[planet] = {
      bySign,
      byHouse: toHouse(bySign),
      total,
      inOwnSign: bySign[contributorSign[planet as Contributor]],
    };
    for (let i = 0; i < 12; i++) savBySign[i] += bySign[i];
  }

  return {
    bhinna,
    sarva: {
      bySign: savBySign,
      byHouse: toHouse(savBySign),
      total: savBySign.reduce((a, b) => a + b, 0),
    },
    signOrder: SIGNS.slice(0, 12) as Sign[],
    ascendantSign: chart.ascendant as Sign,
  };
}
