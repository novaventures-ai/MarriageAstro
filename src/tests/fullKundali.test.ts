import { describe, it, expect, vi, beforeAll } from 'vitest';
import { generateChartFromBirthData } from '../../lib/reportGenerator';
import { assembleFullKundali } from '../../lib/fullKundali';
import { subDivideDasha, drillActiveDashaChain } from '../../lib/dashaCalculations';
import { BirthDataInput } from '../../types';
import type { Chart } from '../types';
import fs from 'fs';
import path from 'path';

describe('Full Kundali aggregator (detail=full)', () => {
  let chart: Chart;
  let full: ReturnType<typeof assembleFullKundali>;

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
      name: 'Rahul', gender: 'male',
      dateOfBirth: '1995-09-28', timeOfBirth: '00:50:00',
      location: 'Mumbai, India', latitude: 19.076, longitude: 72.8777, timezone: '5.5',
    };
    chart = await generateChartFromBirthData(birthData);
    full = assembleFullKundali(chart);
  });

  it('includes every top-level section', () => {
    for (const key of ['meta', 'ascendant', 'planets', 'houses', 'nakshatra',
      'divisionalCharts', 'strength', 'yogas', 'kp', 'jaimini', 'dashas', 'specialPoints']) {
      expect(full, `missing section: ${key}`).toHaveProperty(key);
    }
  });

  it('returns the full set of divisional charts including D9 and D60', () => {
    expect(full.divisionalCharts).toHaveProperty('D1');
    expect(full.divisionalCharts).toHaveProperty('D9');
    expect(full.divisionalCharts).toHaveProperty('D60');
    // At least the primary vargas should be present.
    expect(Object.keys(full.divisionalCharts).length).toBeGreaterThanOrEqual(10);
  });

  it('carries the full Jaimini set', () => {
    expect(full.jaimini.charaKarakas).toBeDefined();
    expect(full.jaimini.upapadaLagna).toBeDefined();
    expect(full.jaimini.vivahSaham).toBeDefined();
    expect(Array.isArray(full.jaimini.charaDasha)).toBe(true);
    expect(full.jaimini.charaDasha.length).toBeGreaterThan(0);
  });

  it('exposes Vimshopaka strength and KP significators', () => {
    expect(Array.isArray(full.strength.vimshopaka)).toBe(true);
    expect(full.strength.vimshopaka.length).toBeGreaterThan(0);
    expect(full.kp).toHaveProperty('significators');
  });

  it('drills the active dasha branch down to Prana (level 5)', () => {
    const chain = full.dashas.activeChainToPrana;
    expect(chain.mahadasha).not.toBeNull();
    expect(chain.antardasha).not.toBeNull();
    expect(chain.pratyantardasha).not.toBeNull();
    expect(chain.sookshmaDasha).not.toBeNull();
    expect(chain.pranaDasha).not.toBeNull();
    // Sibling lists at the finest bands are each a full 9-period cycle.
    expect(chain.sookshmaPeriods).toHaveLength(9);
    expect(chain.pranaPeriods).toHaveLength(9);
  });

  it('subDivideDasha splits a span into 9 periods that tile it exactly', () => {
    const start = new Date('2020-01-01T00:00:00Z');
    const end = new Date('2030-01-01T00:00:00Z');
    const parts = subDivideDasha('Venus', start, end);
    expect(parts).toHaveLength(9);
    expect(parts[0].startDate.getTime()).toBe(start.getTime());
    expect(parts[8].endDate.getTime()).toBe(end.getTime());
    // Adjacent periods are contiguous (no gaps/overlaps).
    for (let i = 1; i < parts.length; i++) {
      expect(parts[i].startDate.getTime()).toBe(parts[i - 1].endDate.getTime());
    }
  });

  it('drillActiveDashaChain returns the active period containing "now"', () => {
    const moonLon = chart.planetaryPositions.find(p => p.planet === 'Moon')!.longitude;
    const now = new Date();
    const chain = drillActiveDashaChain(chart.nakshatra as any, moonLon, chart.dateOfBirth, now);
    expect(chain.mahadasha).not.toBeNull();
    expect(now.getTime()).toBeGreaterThanOrEqual(chain.mahadasha!.startDate.getTime());
    expect(now.getTime()).toBeLessThan(chain.mahadasha!.endDate.getTime());
  });
});
