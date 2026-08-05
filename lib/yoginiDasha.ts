/**
 * Yogini Dasha — an 8-fold, 36-year cyclic dasha keyed to the Moon's nakshatra.
 * ---------------------------------------------------------------------------
 * Eight Yoginis run in a fixed order with durations 1..8 years (total 36),
 * each ruled by a graha. The starting Yogini is fixed by the birth nakshatra,
 * and the first period's balance is proportional to the unspent part of the
 * Moon's nakshatra (as in Vimshottari). Provided here as an independent
 * timing cross-check alongside Vimshottari and Jaimini Chara dasha.
 */
import { Chart, Planet } from '../src/types/index.js';

interface Yogini {
  name: string;
  lord: Planet;
  years: number;
}

// Fixed order and durations (sum = 36).
const YOGINIS: Yogini[] = [
  { name: 'Mangala', lord: 'Moon', years: 1 },
  { name: 'Pingala', lord: 'Sun', years: 2 },
  { name: 'Dhanya', lord: 'Jupiter', years: 3 },
  { name: 'Bhramari', lord: 'Mars', years: 4 },
  { name: 'Bhadrika', lord: 'Mercury', years: 5 },
  { name: 'Ulka', lord: 'Saturn', years: 6 },
  { name: 'Siddha', lord: 'Venus', years: 7 },
  { name: 'Sankata', lord: 'Rahu', years: 8 },
];

export const YOGINI_CYCLE_YEARS = 36;
const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;
const NAK_SPAN = 360 / 27;

export interface YoginiPeriod {
  yogini: string;
  lord: Planet;
  startDate: Date;
  endDate: Date;
  durationYears: number;
  isCurrent: boolean;
  antardashas?: YoginiPeriod[];
}

export interface YoginiDashaResult {
  startingYogini: string;
  balanceYears: number;
  periods: YoginiPeriod[];
}

/** Sub-divide a Yogini maha-period into 8 antardashas (proportional, same order). */
function yoginiAntardashas(startIndex: number, start: Date, mahaYears: number): YoginiPeriod[] {
  const now = new Date();
  const out: YoginiPeriod[] = [];
  let cursor = start.getTime();
  for (let i = 0; i < 8; i++) {
    const y = YOGINIS[(startIndex + i) % 8];
    const years = (mahaYears * y.years) / YOGINI_CYCLE_YEARS;
    const end = cursor + years * MS_PER_YEAR;
    out.push({
      yogini: y.name, lord: y.lord,
      startDate: new Date(cursor), endDate: new Date(end),
      durationYears: years,
      isCurrent: now.getTime() >= cursor && now.getTime() < end,
    });
    cursor = end;
  }
  return out;
}

export function calculateYoginiDasha(chart: Chart, yearsToCover = 108): YoginiDashaResult {
  const moon = chart.planetaryPositions.find(p => p.planet === 'Moon');
  const moonLon = moon?.longitude ?? 0;
  const nakIndex = Math.floor(moonLon / NAK_SPAN); // 0..26

  // Starting Yogini: (nakshatra number + 3) mod 8 → Yogini (1..8, 0→8).
  // With a 0-based nakshatra index that reduces to (nakIndex + 3) mod 8.
  const startIndex = (nakIndex + 3) % 8;

  // Balance of the first period: unspent fraction of the Moon's nakshatra.
  const degInNak = moonLon - nakIndex * NAK_SPAN;
  const fractionRemaining = 1 - degInNak / NAK_SPAN;

  const birth = chart.dateOfBirth instanceof Date ? chart.dateOfBirth : new Date(chart.dateOfBirth);
  const now = new Date();

  const periods: YoginiPeriod[] = [];
  let cursor = birth.getTime();
  let i = 0;
  let coveredYears = 0;

  while (coveredYears < yearsToCover) {
    const idx = (startIndex + i) % 8;
    const y = YOGINIS[idx];
    const years = i === 0 ? y.years * fractionRemaining : y.years;
    const end = cursor + years * MS_PER_YEAR;
    periods.push({
      yogini: y.name, lord: y.lord,
      startDate: new Date(cursor), endDate: new Date(end),
      durationYears: years,
      isCurrent: now.getTime() >= cursor && now.getTime() < end,
      antardashas: yoginiAntardashas(idx, new Date(cursor), years),
    });
    cursor = end;
    coveredYears += years;
    i += 1;
  }

  return {
    startingYogini: YOGINIS[startIndex].name,
    balanceYears: Math.round(YOGINIS[startIndex].years * fractionRemaining * 100) / 100,
    periods,
  };
}
