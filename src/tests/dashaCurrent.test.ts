import { describe, it, expect } from 'vitest';
import { mapDashaPeriod } from '../../lib/mappingUtils';

/**
 * isCurrent was set by planet-name membership in `currentDashaPlanets`, which
 * holds the maha, antar AND pratyantar lords — three different planets. Three
 * unrelated mahadashas were therefore flagged current at once, and every
 * `dashas.find(d => d.isCurrent)` in the app returned whichever sat first in
 * the array. Observed on a real chart: a Jupiter mahadasha that ended in 2008
 * reported as the current period in 2026.
 */
describe('dasha isCurrent', () => {
  const yr = (y: number) => new Date(`${y}-06-15T00:00:00Z`);
  const thisYear = new Date().getFullYear();

  const periods = [
    { planet: 'Jupiter', startDate: yr(thisYear - 29), endDate: yr(thisYear - 18), years: 16 },
    { planet: 'Saturn',  startDate: yr(thisYear - 18), endDate: yr(thisYear + 1),  years: 19 },
    { planet: 'Mercury', startDate: yr(thisYear + 1),  endDate: yr(thisYear + 18), years: 17 },
  ];

  it('marks exactly the period containing today, whatever the lord list says', () => {
    // The lord list names all three — the old code flagged all three.
    const lords = ['Jupiter', 'Saturn', 'Mercury'];
    const mapped = periods.map(p => mapDashaPeriod(p, lords));
    const current = mapped.filter(d => d.isCurrent);
    expect(current).toHaveLength(1);
    expect(current[0].planet).toBe('Saturn');
  });

  it('find() returns a period that actually contains today', () => {
    const mapped = periods.map(p => mapDashaPeriod(p, ['Jupiter', 'Saturn', 'Mercury']));
    const found = mapped.find(d => d.isCurrent)!;
    const now = Date.now();
    expect(new Date(found.startDate).getTime()).toBeLessThanOrEqual(now);
    expect(new Date(found.endDate).getTime()).toBeGreaterThan(now);
  });

  it('never marks an already-finished period current', () => {
    const past = mapDashaPeriod(periods[0], ['Jupiter']);
    expect(past.isCurrent).toBe(false);
  });

  it('recurses into sub-periods on dates too', () => {
    const withSubs = {
      planet: 'Saturn', startDate: yr(thisYear - 18), endDate: yr(thisYear + 1), years: 19,
      subPeriods: [
        { planet: 'Mars', startDate: yr(thisYear - 4), endDate: yr(thisYear - 2), years: 2 },
        { planet: 'Rahu', startDate: yr(thisYear - 2), endDate: yr(thisYear + 1), years: 3 },
      ],
    };
    const mapped = mapDashaPeriod(withSubs, ['Saturn', 'Mars', 'Rahu']);
    const currentSubs = (mapped.subPeriods || []).filter(d => d.isCurrent);
    expect(currentSubs).toHaveLength(1);
    expect(currentSubs[0].planet).toBe('Rahu');
  });

  it('falls back to the lord list when a period carries no usable dates', () => {
    const undated = { planet: 'Venus', startDate: undefined, endDate: undefined, years: 20 };
    expect(mapDashaPeriod(undated as any, ['Venus']).isCurrent).toBe(true);
    expect(mapDashaPeriod(undated as any, ['Saturn']).isCurrent).toBe(false);
  });
});
