import { describe, it, expect, vi, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { generateFullCompatibilityReport } from '../../lib/reportGenerator';
import { getReportContext } from '../../lib/ai/context';
import { BirthDataInput } from '../../types';

/**
 * The AstroMind chat is only as good as the context it is handed. It used to
 * receive a ~30-line summary — two ascendants, four scores, three bullets — so
 * asked "why is my Venus weak?" it had no Venus and could only restate the
 * verdict or invent a placement.
 *
 * These assert the context actually carries the chart: real planetary
 * placements with dignity and nakshatra, the divisional charts, Ashtakavarga,
 * the dasha, and both people. A regression here degrades the assistant
 * silently — the chat still answers, just with nothing behind it.
 */

let context = '';

describe('AstroMind chat context', () => {
  beforeAll(async () => {
    global.fetch = vi.fn().mockImplementation((url: any) => {
      if (url === '/swisseph.wasm') {
        const p = path.resolve(__dirname, '../../public/swisseph.wasm');
        const buf = fs.readFileSync(p);
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => Promise.resolve(
            buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)),
        });
      }
      return Promise.reject(new Error(`Unhandled fetch to ${url}`));
    }) as any;

    const a: BirthDataInput = {
      name: 'Rahul', gender: 'male', dateOfBirth: '1995-09-28', timeOfBirth: '00:50:00',
      location: 'Mumbai, India', latitude: 19.0760, longitude: 72.8777, timezone: '5.5',
    };
    const b: BirthDataInput = {
      name: 'Priya', gender: 'female', dateOfBirth: '1997-04-14', timeOfBirth: '09:20:00',
      location: 'Pune, India', latitude: 18.5204, longitude: 73.8567, timezone: '5.5',
    };
    const report = await generateFullCompatibilityReport(a, b);
    context = getReportContext(report as any);
  }, 60000);

  it('names both people rather than "Partner A"', () => {
    expect(context).toContain('Rahul');
    expect(context).toContain('Priya');
    expect(context).not.toContain('Partner A');
  });

  it('carries every planet with house, nakshatra and dignity', () => {
    for (const planet of ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']) {
      expect(context, `${planet} missing from chat context`).toContain(planet);
    }
    // The detail is the point — a bare planet name would satisfy the loop above.
    expect(context).toMatch(/house \d+/);
    expect(context).toMatch(/pada [1-4]/);
    expect(context).toMatch(/dignity: (exalted|moolatrikona|own|own_house|friendly|neutral|enemy|debilitated)/);
    expect(context).toMatch(/\d+°\d{2}'/);
  });

  it('carries the divisional charts the assistant reasons about', () => {
    for (const varga of ['D9 Navamsa', 'D7 Saptamsa', 'D10 Dasamsa', 'D6 Shashtamsa', 'D30 Trimsamsa', 'D60']) {
      expect(context, `${varga} missing`).toContain(varga);
    }
    // Each varga line must actually resolve, not read "not available".
    const d9 = context.match(/D9 Navamsa[^\n]*/g) || [];
    expect(d9.length).toBe(2); // one per person
    for (const line of d9) expect(line).not.toContain('not available');
  });

  it('carries Ashtakavarga bindus and the running dasha', () => {
    expect(context).toContain('SARVASHTAKAVARGA');
    expect(context).toMatch(/H1:\d+ H2:\d+/);
    expect(context).toContain('CURRENT DASHA');
    expect(context).toMatch(/mahadasha/);
  });

  it('carries the Jaimini and KP marriage significators', () => {
    expect(context).toContain('Darakaraka');
    expect(context).toContain('Upapada Lagna');
    expect(context).toContain('7th cusp sub-lord');
  });

  it('still carries the match result and koota breakdown', () => {
    expect(context).toContain('MATCH RESULT');
    expect(context).toContain('Ashtakoot');
    expect(context).toContain('ASHTAKOOT BREAKDOWN');
    expect(context).toMatch(/Divorce risk/);
  });

  it('is substantially richer than the old summary', () => {
    // The previous builder produced roughly 30 lines. Anything near that means
    // the deep sections silently fell back to "not available".
    expect(context.split('\n').length).toBeGreaterThan(60);
  });
});
