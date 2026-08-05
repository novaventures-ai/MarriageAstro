import { describe, it, expect, vi, beforeAll } from 'vitest';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { calculateYoginiDasha, YOGINI_CYCLE_YEARS } from '../../lib/yoginiDasha';
import { calculateShadbala } from '../../lib/shadbala';
import { assembleFullKundali } from '../../lib/fullKundali';
import { BirthDataInput } from '../../types';
import type { Chart } from '../types';
import fs from 'fs';
import path from 'path';

describe('Yogini Dasha + Shadbala', () => {
  let chart: Chart;

  beforeAll(async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url === '/swisseph.wasm') {
        const wasmPath = path.resolve(__dirname, '../../public/swisseph.wasm');
        const buf = fs.readFileSync(wasmPath);
        return Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)) });
      }
      return Promise.reject(new Error(`Unhandled fetch ${url}`));
    });
    chart = await generateChartFromBirthData({
      name: 'Rahul', gender: 'male', dateOfBirth: '1995-09-28', timeOfBirth: '00:50:00',
      location: 'Mumbai, India', latitude: 19.076, longitude: 72.8777, timezone: '5.5',
    } as BirthDataInput);
  });

  // ── Yogini ──
  it('Yogini periods each carry a valid 1..8-year Yogini and 8 antardashas', () => {
    const y = calculateYoginiDasha(chart);
    const durations: Record<string, number> = {
      Mangala: 1, Pingala: 2, Dhanya: 3, Bhramari: 4, Bhadrika: 5, Ulka: 6, Siddha: 7, Sankata: 8,
    };
    expect(y.periods.length).toBeGreaterThan(8);
    for (const p of y.periods) {
      expect(durations).toHaveProperty(p.yogini);
      expect(p.antardashas).toHaveLength(8);
    }
  });

  it('a full Yogini cycle (8 consecutive full periods) spans exactly 36 years', () => {
    const y = calculateYoginiDasha(chart);
    // Skip the partial first period; the next 8 are full periods = one 36y cycle.
    const cycle = y.periods.slice(1, 9);
    const span = (cycle[7].endDate.getTime() - cycle[0].startDate.getTime()) / (365.2425 * 24 * 3600 * 1000);
    expect(Math.round(span)).toBe(YOGINI_CYCLE_YEARS);
  });

  it('exactly one Yogini maha-period is current', () => {
    const y = calculateYoginiDasha(chart);
    expect(y.periods.filter(p => p.isCurrent).length).toBe(1);
  });

  // ── Shadbala ──
  it('Naisargika bala matches the fixed constants and Sun is highest', () => {
    const s = calculateShadbala(chart);
    expect(s.planets.Sun.naisargika).toBe(60);
    expect(s.planets.Saturn.naisargika).toBeCloseTo(8.57, 2);
    for (const p of ['Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn']) {
      expect(s.planets.Sun.naisargika).toBeGreaterThanOrEqual(s.planets[p].naisargika);
    }
  });

  it('each component stays within its virupa bounds', () => {
    const s = calculateShadbala(chart);
    for (const p of Object.values(s.planets)) {
      expect(p.sthana.uccha).toBeGreaterThanOrEqual(0);
      expect(p.sthana.uccha).toBeLessThanOrEqual(60);
      expect(p.dig).toBeGreaterThanOrEqual(0);
      expect(p.dig).toBeLessThanOrEqual(60);
      expect(p.sthana.kendradi === 60 || p.sthana.kendradi === 30 || p.sthana.kendradi === 15).toBe(true);
      expect(p.totalRupas).toBeGreaterThan(0);
    }
  });

  it('discloses its scope via the completeness field', () => {
    const s = calculateShadbala(chart);
    expect(s.completeness.omitted.join(' ')).toMatch(/Ayana/);
    expect(s.completeness.approximated.length).toBeGreaterThan(0);
    expect(s.completeness.note).toMatch(/lower bound/i);
  });

  it('both are exposed in detail=full', () => {
    const full = assembleFullKundali(chart) as any;
    expect(full.dashas.yogini).toBeTruthy();
    expect(full.dashas.yogini.periods.length).toBeGreaterThan(0);
    expect(full.strength.shadbala).toBeTruthy();
    expect(full.strength.shadbala.planets.Sun.totalRupas).toBeGreaterThan(0);
  });
});
