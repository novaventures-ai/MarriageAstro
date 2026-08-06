import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// The chart pipeline emits dignity 'own' (getPlanetDignity), but several calc
// files historically only checked 'own_house', silently under-scoring own-sign
// planets across self-analysis, risk, and sexual-health endpoints. This guard
// fails if any dignity comparison against 'own_house' is reintroduced WITHOUT
// also accepting 'own' on the same line.
const FILES = [
  'lib/selfReportGenerator.ts',
  'lib/riskCalculations.ts',
  'lib/sexualHealthCalculations.ts',
  'lib/extendedCalculations.ts',
];

describe('own-sign dignity vocabulary', () => {
  for (const rel of FILES) {
    it(`${rel} never checks 'own_house' without also accepting 'own'`, () => {
      const src = fs.readFileSync(path.resolve(__dirname, '../../', rel), 'utf8');
      const offenders: string[] = [];
      const lines = src.split('\n');
      lines.forEach((line, i) => {
        // Only lines that COMPARE dignity to 'own_house' (not message string literals).
        const comparesOwnHouse = /'own_house'/.test(line) &&
          /(===\s*'own_house'|'own_house'\s*\]?\.includes|\[[^\]]*'own_house')|case 'own_house'/.test(line);
        if (!comparesOwnHouse) return;
        if (/'own'/.test(line)) return;
        // Allow switch fall-through: a `case 'own_house':` preceded by `case 'own':`.
        const prev = (lines[i - 1] || '').trim();
        if (/case 'own_house'/.test(line) && /case 'own':/.test(prev)) return;
        offenders.push(`${rel}:${i + 1}  ${line.trim()}`);
      });
      expect(offenders, `own_house checked without 'own':\n${offenders.join('\n')}`).toEqual([]);
    });
  }
});
