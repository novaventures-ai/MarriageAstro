import { describe, it, expect, vi, beforeAll } from 'vitest';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { calculateAshtakavarga, CLASSICAL_BAV_TOTALS } from '../../lib/ashtakavarga';
import { assembleFullKundali } from '../../lib/fullKundali';
import { BirthDataInput } from '../../types';
import type { Chart } from '../types';
import fs from 'fs';
import path from 'path';

// Ashtakavarga is a fixed point system with classical invariants that hold for
// EVERY horoscope, so these are exact-value assertions, not approximations —
// they would catch any transcription error in the benefic-place tables.
describe('Ashtakavarga', () => {
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
    const birthData: BirthDataInput = {
      name: 'Rahul', gender: 'male', dateOfBirth: '1995-09-28', timeOfBirth: '00:50:00',
      location: 'Mumbai, India', latitude: 19.076, longitude: 72.8777, timezone: '5.5',
    };
    chart = await generateChartFromBirthData(birthData);
  });

  it('each planet BAV totals the classical constant (48/49/39/54/56/52/39)', () => {
    const av = calculateAshtakavarga(chart);
    for (const [planet, expected] of Object.entries(CLASSICAL_BAV_TOTALS)) {
      expect(av.bhinna[planet].total, `${planet} BAV total`).toBe(expected);
    }
  });

  it('Sarvashtakavarga totals exactly 337', () => {
    const av = calculateAshtakavarga(chart);
    expect(av.sarva.total).toBe(337);
  });

  it('SAV per sign is the sum of the seven planet BAVs, and each sign is 0..56', () => {
    const av = calculateAshtakavarga(chart);
    for (let s = 0; s < 12; s++) {
      const sum = Object.values(av.bhinna).reduce((a, b) => a + b.bySign[s], 0);
      expect(av.sarva.bySign[s]).toBe(sum);
      expect(av.sarva.bySign[s]).toBeGreaterThanOrEqual(0);
      expect(av.sarva.bySign[s]).toBeLessThanOrEqual(56);
    }
  });

  it('byHouse is the sign ring rotated to the ascendant (house 1 = lagna sign)', () => {
    const av = calculateAshtakavarga(chart);
    const ascIdx = av.signOrder.indexOf(av.ascendantSign);
    expect(av.sarva.byHouse[0]).toBe(av.sarva.bySign[ascIdx]);
    expect(av.sarva.byHouse.reduce((a, b) => a + b, 0)).toBe(337);
  });

  it('is exposed in detail=full', () => {
    const full = assembleFullKundali(chart) as any;
    expect(full.ashtakavarga).toBeTruthy();
    expect(full.ashtakavarga.sarva.total).toBe(337);
    // 6th and 8th house SAV values are directly readable (health-timing use).
    expect(typeof full.ashtakavarga.sarva.byHouse[5]).toBe('number'); // 6th house
    expect(typeof full.ashtakavarga.sarva.byHouse[7]).toBe('number'); // 8th house
  });
});

describe('D6 (Shashtamsa) chart', () => {
  it('is present in detail=full divisional charts', async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url === '/swisseph.wasm') {
        const wasmPath = path.resolve(__dirname, '../../public/swisseph.wasm');
        const buf = fs.readFileSync(wasmPath);
        return Promise.resolve({ ok: true, arrayBuffer: () => Promise.resolve(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)) });
      }
      return Promise.reject(new Error(`Unhandled fetch ${url}`));
    });
    const chart = await generateChartFromBirthData({
      name: 'Rahul', gender: 'male', dateOfBirth: '1995-09-28', timeOfBirth: '00:50:00',
      location: 'Mumbai, India', latitude: 19.076, longitude: 72.8777, timezone: '5.5',
    } as BirthDataInput);
    const full = assembleFullKundali(chart) as any;
    expect(full.divisionalCharts).toHaveProperty('D6');
    expect(full.divisionalCharts.D6.planetaryPositions.length).toBeGreaterThan(0);
  });
});
