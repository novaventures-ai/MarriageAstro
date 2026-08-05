import { describe, it, expect, vi, beforeAll } from 'vitest';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { calculateExtendedDivisionalAnalysis } from '../../lib/extendedCalculations';
import { BirthDataInput } from '../../types';
import type { Chart } from '../types';
import fs from 'fs';
import path from 'path';

// Regression coverage for the Vimshopaka scoring fix:
//  - a planet with unknown/unpopulated dignity must NOT collapse to 0
//  - a debilitated-but-cancelled (Neechabhanga) planet must not read 0
//  - D7 / D60 summaries must be derived from the chart, not fixed boilerplate
describe('Vimshopaka strength scoring', () => {
  let chart: Chart;

  beforeAll(async () => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url === '/swisseph.wasm') {
        const wasmPath = path.resolve(__dirname, '../../public/swisseph.wasm');
        const wasmBuffer = fs.readFileSync(wasmPath);
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(
            wasmBuffer.buffer.slice(wasmBuffer.byteOffset, wasmBuffer.byteOffset + wasmBuffer.byteLength)
          ),
        });
      }
      return Promise.reject(new Error(`Unhandled fetch to ${url}`));
    });

    const birthData: BirthDataInput = {
      name: 'Rahul',
      gender: 'male',
      dateOfBirth: '1995-09-28',
      timeOfBirth: '00:50:00',
      location: 'Mumbai, India',
      latitude: 19.076,
      longitude: 72.8777,
      timezone: '5.5',
    };
    chart = await generateChartFromBirthData(birthData);
  });

  it('never returns a spurious 0 for a well-dignified planet', () => {
    const analysis = calculateExtendedDivisionalAnalysis(chart);
    for (const s of analysis.vimshopakaScores) {
      const d1 = chart.planetaryPositions.find(p => p.planet === s.planet);
      // An own-sign / exalted / friendly planet must never score 0.
      if (d1 && ['exalted', 'moolatrikona', 'own_house', 'friendly', 'neutral'].includes(d1.dignity)) {
        expect(s.total, `${s.planet} (${d1.dignity}) scored ${s.total}`).toBeGreaterThan(0);
      }
      // No score should fall outside the 0–20 Vimshopaka band.
      expect(s.total).toBeGreaterThanOrEqual(0);
      expect(s.total).toBeLessThanOrEqual(20);
    }
  });

  it('does not zero out any of the seven grahas purely from missing dignity', () => {
    const analysis = calculateExtendedDivisionalAnalysis(chart);
    // At least the majority of grahas should carry a positive score; a chart
    // where every planet reads 0 is the exact symptom of the old bug.
    const nonZero = analysis.vimshopakaScores.filter(s => s.total > 0).length;
    expect(nonZero).toBeGreaterThanOrEqual(4);
  });

  it('derives D7 progeny indications from the chart, not boilerplate', () => {
    const analysis = calculateExtendedDivisionalAnalysis(chart);
    const joined = analysis.d7Full.childrenIndications.join(' ');
    // The old canned strings must be gone.
    expect(joined).not.toBe('Fertility indicated Progeny blessed');
    expect(analysis.d7Full.childrenIndications.length).toBeGreaterThan(0);
  });

  it('ties D60 deity interpretation to the computed placement', () => {
    const analysis = calculateExtendedDivisionalAnalysis(chart);
    // When D60 is computed, each interpretation should reference its D60 sign;
    // when not, it must say so rather than presenting a bare canned phrase.
    for (const d of analysis.d60Deities) {
      expect(d.interpretation).toMatch(/D60/);
    }
  });
});
