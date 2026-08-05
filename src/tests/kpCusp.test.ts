import { describe, it, expect, vi, beforeAll } from 'vitest';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { BirthDataInput } from '../../types';
import type { Chart } from '../types';
import fs from 'fs';
import path from 'path';

// Regression: KP cusp 1 IS the ascendant by definition and must always share
// the D1 lagna's sign. Previously the Placidus house engine fell back to an
// approximation whose ascendant was off by a sign or more, so KP cusp 1 landed
// in a different sign than the chart's ascendant.
describe('KP cusp anchoring', () => {
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
      name: 'Rahul', gender: 'male',
      dateOfBirth: '1995-09-28', timeOfBirth: '00:50:00',
      location: 'Mumbai, India', latitude: 19.076, longitude: 72.8777, timezone: '5.5',
    };
    chart = await generateChartFromBirthData(birthData);
  });

  it('KP cusp 1 sign equals the D1 ascendant sign', () => {
    const cusp1 = chart.kp?.cusps?.[0];
    expect(cusp1).toBeDefined();
    expect((cusp1 as any).sign).toBe(chart.ascendant);
  });

  it('produces 12 KP cusps', () => {
    expect(chart.kp?.cusps?.length).toBe(12);
  });
});
